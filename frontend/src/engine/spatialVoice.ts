import * as THREE from 'three'
import { Socket } from 'socket.io-client'
import { spatialAudio, SpatialVoiceNodeController } from './spatialAudio'
import { sound } from './audio'
import { achievements } from './achievements'

export interface SpatialVoicePeer {
  id: string
  creatorId: string
  position: THREE.Vector3
  isMuted: boolean
  isDeafened: boolean
  pc: RTCPeerConnection
  stream?: MediaStream
  voiceNode?: SpatialVoiceNodeController | null
  isSpeaking: boolean
  audioLevel: number // 0 - 100
  distance: number // in meters
  inRange: boolean // distance <= hearingRadius
  volume: number // 0.0 - 2.0 (default 1.0)
  isSelfMutedLocally: boolean // muted locally by this client
  iceCandidateQueue: RTCIceCandidateInit[]
}

export interface SpatialBeacon {
  active: boolean
  position: THREE.Vector3
  pulseInterval: any
  soundType: 'cyber_pulse' | 'voice_blip' | 'radio_ping'
  distance: number
  inRange: boolean
}

export type VoiceConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ]
}

export class SpatialVoiceEngine {
  private socket: Socket | null = null
  private creatorId: string = 'Pioneer'
  private localStream: MediaStream | null = null
  private localAnalyser: AnalyserNode | null = null
  private localAnalyserBuffer: Uint8Array = new Uint8Array(new ArrayBuffer(64))
  public hasMicrophone: boolean = false

  public connectionStatus: VoiceConnectionStatus = 'disconnected'
  public errorMessage: string = ''
  public isJoined: boolean = false
  public isMicMuted: boolean = false
  public isDeafened: boolean = false
  public localAudioLevel: number = 0 // 0 - 100
  public isLocalSpeaking: boolean = false
  public hearingRadius: number = 50.0 // meters
  public masterVolume: number = 1.0 // 0 - 2.0

  public peers: Map<string, SpatialVoicePeer> = new Map()

  public beacon: SpatialBeacon = {
    active: false,
    position: new THREE.Vector3(0, 0, 0),
    pulseInterval: null,
    soundType: 'cyber_pulse',
    distance: 0,
    inRange: false
  }

  // ── Connection & Join / Leave ───────────────────────────────────────

  public async joinVoice(
    socket: Socket,
    creatorId: string,
    playerPos: THREE.Vector3
  ): Promise<boolean> {
    if (this.isJoined) return true

    this.socket = socket
    this.creatorId = creatorId || 'Pioneer'
    this.connectionStatus = 'connecting'
    this.errorMessage = ''

    // Ensure Web Audio context is started and running
    await spatialAudio.resumeContext()

    // 1. Capture local microphone (graceful fallback if denied)
    await this.initMicrophone()

    // 2. Setup socket signaling listeners
    this.setupSocketSignaling()

    // 3. Emit join to signaling server
    this.socket.emit('voice-join', {
      creatorId: this.creatorId,
      position: { x: playerPos.x, y: playerPos.y, z: playerPos.z },
      isMuted: this.isMicMuted
    })

    this.isJoined = true
    this.connectionStatus = 'connected'
    sound.playFanfare()
    achievements.unlock('spatial_voice_chat')
    window.dispatchEvent(new CustomEvent('voice-status-changed', { detail: { isJoined: true } }))
    return true
  }

  public leaveVoice(): void {
    if (!this.isJoined && this.connectionStatus === 'disconnected') return

    // Stop microphone
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => t.stop())
      this.localStream = null
    }
    this.localAnalyser = null

    // Notify backend
    if (this.socket && this.socket.connected) {
      this.socket.emit('voice-leave')
    }

    // Close all peer connections
    for (const peer of this.peers.values()) {
      this.closePeer(peer)
    }
    this.peers.clear()

    // Disable beacon if running
    this.stopBeacon()

    this.isJoined = false
    this.connectionStatus = 'disconnected'
    this.localAudioLevel = 0
    this.isLocalSpeaking = false

    window.dispatchEvent(new CustomEvent('voice-status-changed', { detail: { isJoined: false } }))
  }

  private async initMicrophone(): Promise<void> {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false
        })

        this.localStream = stream
        this.hasMicrophone = true

        // Connect local stream to AnalyserNode for volume metering
        const audioCtx = spatialAudio.getAudioContext()
        if (audioCtx) {
          const micSource = audioCtx.createMediaStreamSource(stream)
          const analyser = audioCtx.createAnalyser()
          analyser.fftSize = 64
          analyser.smoothingTimeConstant = 0.3
          micSource.connect(analyser) // Do not connect to destination to avoid feedback
          this.localAnalyser = analyser
          this.localAnalyserBuffer = new Uint8Array(analyser.fftSize)
        }

        // Apply mute status
        this.applyMicMuteState()
      } else {
        this.hasMicrophone = false
        console.warn('[SpatialVoice] getUserMedia is not supported in this environment.')
      }
    } catch (err: any) {
      this.hasMicrophone = false
      console.warn('[SpatialVoice] Microphone access was not granted or not available (Entering Listen-Only Mode):', err?.message || err)
    }
  }

  // ── Socket Signaling Handlers ───────────────────────────────────────

  private setupSocketSignaling(): void {
    if (!this.socket) return

    // Remove existing handlers to avoid duplicates
    this.socket.off('voice-peer-list')
    this.socket.off('voice-peer-joined')
    this.socket.off('voice-signal')
    this.socket.off('voice-peer-mute-change')
    this.socket.off('voice-peer-left')

    // Received list of existing peers -> Initiate offers to all of them
    this.socket.on('voice-peer-list', async (peerList: Array<{ id: string; creatorId: string; position: { x: number; y: number; z: number }; isMuted: boolean }>) => {
      for (const p of peerList) {
        if (p.id === this.socket?.id) continue
        const peer = this.getOrCreatePeer(p.id, p.creatorId, p.position)
        peer.isMuted = p.isMuted
        await this.initiateOffer(peer)
      }
    })

    // A new peer joined -> Register peer and wait for their offer
    this.socket.on('voice-peer-joined', (p: { id: string; creatorId: string; position: { x: number; y: number; z: number }; isMuted: boolean }) => {
      if (p.id === this.socket?.id) return
      const peer = this.getOrCreatePeer(p.id, p.creatorId, p.position)
      peer.isMuted = p.isMuted
    })

    // Incoming WebRTC signaling message (offer, answer, or candidate)
    this.socket.on('voice-signal', async (data: { senderId: string; signal: any }) => {
      const { senderId, signal } = data
      if (!senderId || !signal) return

      let peer = this.peers.get(senderId)
      if (!peer) {
        peer = this.getOrCreatePeer(senderId, 'Player', { x: 0, y: 0, z: 0 })
      }

      try {
        if (signal.sdp) {
          const desc = new RTCSessionDescription(signal.sdp)
          await peer.pc.setRemoteDescription(desc)

          // Flush queued candidates if any
          while (peer.iceCandidateQueue.length > 0) {
            const cand = peer.iceCandidateQueue.shift()
            if (cand) {
              await peer.pc.addIceCandidate(new RTCIceCandidate(cand))
            }
          }

          // If incoming message was an OFFER, create and return an ANSWER
          if (desc.type === 'offer') {
            const answer = await peer.pc.createAnswer()
            await peer.pc.setLocalDescription(answer)
            this.socket?.emit('voice-signal', {
              targetId: senderId,
              signal: { sdp: peer.pc.localDescription }
            })
          }
        } else if (signal.candidate) {
          if (peer.pc.remoteDescription && peer.pc.remoteDescription.type) {
            await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate))
          } else {
            peer.iceCandidateQueue.push(signal.candidate)
          }
        }
      } catch (err) {
        console.error('[SpatialVoice] Error handling signal from peer ' + senderId, err)
      }
    })

    // Peer mute / deafen change
    this.socket.on('voice-peer-mute-change', (data: { peerId: string; isMuted: boolean; isDeafened: boolean }) => {
      const peer = this.peers.get(data.peerId)
      if (peer) {
        peer.isMuted = data.isMuted
        peer.isDeafened = data.isDeafened
      }
    })

    // Peer left voice chat
    this.socket.on('voice-peer-left', (data: { peerId: string }) => {
      const peer = this.peers.get(data.peerId)
      if (peer) {
        this.closePeer(peer)
        this.peers.delete(data.peerId)
      }
    })
  }

  // ── RTCPeerConnection Management ────────────────────────────────────

  private getOrCreatePeer(
    peerId: string,
    creatorId: string,
    pos: { x: number; y: number; z: number }
  ): SpatialVoicePeer {
    let peer = this.peers.get(peerId)
    if (peer) return peer

    const pc = new RTCPeerConnection(RTC_CONFIG)
    const peerPos = new THREE.Vector3(pos.x, pos.y, pos.z)

    peer = {
      id: peerId,
      creatorId: creatorId || 'Player',
      position: peerPos,
      isMuted: false,
      isDeafened: false,
      pc,
      isSpeaking: false,
      audioLevel: 0,
      distance: 0,
      inRange: true,
      volume: 1.0,
      isSelfMutedLocally: false,
      iceCandidateQueue: []
    }

    // Add local tracks if available, otherwise add receive-only transceiver
    if (this.localStream && this.localStream.getAudioTracks().length > 0) {
      this.localStream.getAudioTracks().forEach(track => {
        pc.addTrack(track, this.localStream!)
      })
    } else {
      pc.addTransceiver('audio', { direction: 'recvonly' })
    }

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && this.socket) {
        this.socket.emit('voice-signal', {
          targetId: peerId,
          signal: { candidate: event.candidate.toJSON() }
        })
      }
    }

    // Remote audio stream arrived
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0]
      if (remoteStream) {
        peer!.stream = remoteStream
        // Attach to Web Audio 3D spatial node pipeline
        const node = spatialAudio.createSpatialVoiceNode(remoteStream, peer!.position)
        peer!.voiceNode = node
        console.log(`[SpatialVoice] 3D audio pipeline hooked for peer ${peerId}`)
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.warn(`[SpatialVoice] Peer connection state for ${peerId}: ${pc.connectionState}`)
      }
    }

    this.peers.set(peerId, peer)
    return peer
  }

  private async initiateOffer(peer: SpatialVoicePeer): Promise<void> {
    try {
      const offer = await peer.pc.createOffer({
        offerToReceiveAudio: true,
      })
      await peer.pc.setLocalDescription(offer)
      this.socket?.emit('voice-signal', {
        targetId: peer.id,
        signal: { sdp: peer.pc.localDescription }
      })
    } catch (err) {
      console.error(`[SpatialVoice] Failed to create offer for ${peer.id}:`, err)
    }
  }

  private closePeer(peer: SpatialVoicePeer): void {
    if (peer.voiceNode) {
      peer.voiceNode.dispose()
      peer.voiceNode = null
    }
    peer.pc.close()
  }

  // ── Local Audio Controls (Mute / Deafen / Volume) ────────────────────

  public toggleMic(): boolean {
    this.isMicMuted = !this.isMicMuted
    this.applyMicMuteState()
    this.broadcastMuteState()
    return this.isMicMuted
  }

  public setMicMuted(muted: boolean): void {
    this.isMicMuted = muted
    this.applyMicMuteState()
    this.broadcastMuteState()
  }

  private applyMicMuteState(): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(t => {
        t.enabled = !this.isMicMuted
      })
    }
  }

  public toggleDeafen(): boolean {
    this.isDeafened = !this.isDeafened
    if (this.isDeafened) {
      spatialAudio.setVoiceMasterVolume(0)
    } else {
      spatialAudio.setVoiceMasterVolume(this.masterVolume)
    }
    this.broadcastMuteState()
    return this.isDeafened
  }

  public setDeafened(deafened: boolean): void {
    this.isDeafened = deafened
    if (this.isDeafened) {
      spatialAudio.setVoiceMasterVolume(0)
    } else {
      spatialAudio.setVoiceMasterVolume(this.masterVolume)
    }
    this.broadcastMuteState()
  }

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(2.0, vol))
    if (!this.isDeafened) {
      spatialAudio.setVoiceMasterVolume(this.masterVolume)
    }
  }

  public setHearingRadius(radius: number): void {
    this.hearingRadius = Math.max(10, Math.min(150, radius))
  }

  public setPeerVolume(peerId: string, vol: number): void {
    const peer = this.peers.get(peerId)
    if (peer) {
      peer.volume = Math.max(0, Math.min(2.0, vol))
      if (peer.voiceNode) {
        const effectiveGain = peer.isSelfMutedLocally ? 0 : peer.volume
        peer.voiceNode.setVolume(effectiveGain)
      }
    }
  }

  public togglePeerMuteLocally(peerId: string): boolean {
    const peer = this.peers.get(peerId)
    if (peer) {
      peer.isSelfMutedLocally = !peer.isSelfMutedLocally
      if (peer.voiceNode) {
        const effectiveGain = peer.isSelfMutedLocally ? 0 : peer.volume
        peer.voiceNode.setVolume(effectiveGain)
      }
      return peer.isSelfMutedLocally
    }
    return false
  }

  private broadcastMuteState(): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('voice-mute-toggle', {
        isMuted: this.isMicMuted,
        isDeafened: this.isDeafened
      })
    }
  }

  // ── Testing Beacon (Simulated 3D Voice/Audio Emitter) ───────────────

  public toggleBeacon(playerPos: THREE.Vector3): boolean {
    if (this.beacon.active) {
      this.stopBeacon()
      return false
    } else {
      this.startBeacon(playerPos)
      return true
    }
  }

  public startBeacon(playerPos: THREE.Vector3): void {
    this.stopBeacon()
    // Place beacon 8 meters ahead of player
    this.beacon.position.set(playerPos.x + 6, playerPos.y, playerPos.z + 6)
    this.beacon.active = true

    // Play periodic 3D audio bursts
    this.beacon.pulseInterval = setInterval(() => {
      if (this.beacon.active && !this.isDeafened) {
        spatialAudio.createSyntheticBeaconSound(this.beacon.position, this.beacon.soundType)
      }
    }, 1800)

    // Play first ping immediately
    spatialAudio.createSyntheticBeaconSound(this.beacon.position, this.beacon.soundType)
    sound.playUiClick()
  }

  public stopBeacon(): void {
    if (this.beacon.pulseInterval) {
      clearInterval(this.beacon.pulseInterval)
      this.beacon.pulseInterval = null
    }
    this.beacon.active = false
  }

  // ── Per-Frame Update (Call in Render Loop) ───────────────────────────

  public update(
    cameraPos: THREE.Vector3,
    cameraForward: THREE.Vector3,
    cameraUp: THREE.Vector3
  ): void {
    // 1. Update Spatial Audio listener position & 3D orientation in Web Audio API
    spatialAudio.updateListener(cameraPos, cameraForward, cameraUp)

    // 2. Measure local microphone speaking level
    if (this.localAnalyser && !this.isMicMuted) {
      this.localAnalyser.getByteTimeDomainData(this.localAnalyserBuffer as any)
      let sumSquares = 0
      for (let i = 0; i < this.localAnalyserBuffer.length; i++) {
        const norm = (this.localAnalyserBuffer[i] - 128) / 128
        sumSquares += norm * norm
      }
      const rms = Math.sqrt(sumSquares / this.localAnalyserBuffer.length)
      this.localAudioLevel = Math.min(100, Math.round(rms * 280))
      this.isLocalSpeaking = this.localAudioLevel > 12
    } else {
      this.localAudioLevel = 0
      this.isLocalSpeaking = false
    }

    // 3. Update each connected remote peer
    for (const peer of this.peers.values()) {
      peer.distance = peer.position.distanceTo(cameraPos)
      peer.inRange = peer.distance <= this.hearingRadius

      if (peer.voiceNode) {
        // Update 3D PannerNode position
        peer.voiceNode.updatePosition(peer.position)

        // Calculate and set effective gain
        let targetGain = peer.volume
        if (this.isDeafened || peer.isSelfMutedLocally || !peer.inRange) {
          targetGain = 0
        }
        peer.voiceNode.setVolume(targetGain)

        // Read audio activity
        peer.audioLevel = peer.voiceNode.getAudioLevel()
        peer.isSpeaking = peer.audioLevel > 10 && !peer.isMuted
      } else {
        peer.audioLevel = 0
        peer.isSpeaking = false
      }
    }

    // 4. Update beacon distance if active
    if (this.beacon.active) {
      this.beacon.distance = this.beacon.position.distanceTo(cameraPos)
      this.beacon.inRange = this.beacon.distance <= this.hearingRadius
    }
  }

  public updatePeerPosition(peerId: string, x: number, y: number, z: number): void {
    const peer = this.peers.get(peerId)
    if (peer) {
      peer.position.set(x, y, z)
      peer.voiceNode?.updatePosition(peer.position)
    }
  }

  public getPeersArray(): SpatialVoicePeer[] {
    return Array.from(this.peers.values())
  }
}

export const spatialVoice = new SpatialVoiceEngine()
