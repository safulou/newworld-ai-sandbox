import * as THREE from 'three'
import { sound } from './audio'

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  channel: 'global' | 'local' | 'party' | 'system'
  timestamp: string
}

export interface EmoteData {
  id: string
  name: string
  icon: string
  animation: 'wave' | 'cheer' | 'dance' | 'bow' | 'spin'
}

export const EMOTE_LIST: EmoteData[] = [
  { id: 'wave', name: '揮手致意 (Wave)', icon: '👋', animation: 'wave' },
  { id: 'cheer', name: '勝利歡呼 (Cheer)', icon: '🎉', animation: 'cheer' },
  { id: 'dance', name: '賽博狂舞 (Dance)', icon: '💃', animation: 'dance' },
  { id: 'bow', name: '謙遜鞠躬 (Bow)', icon: '🙇', animation: 'bow' },
  { id: 'spin', name: '量子旋轉 (Spin)', icon: '🌀', animation: 'spin' },
]

export class ChatBubbleManager {
  private scene: THREE.Scene | null = null

  public init(scene: THREE.Scene): void {
    this.scene = scene
  }

  public showSpeechBubble(avatarGroup: THREE.Group, text: string, durationMs: number = 4000): void {
    if (!this.scene) return

    const canvas = document.createElement('canvas')
    canvas.width = 380
    canvas.height = 120
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw stylized speech bubble
    ctx.fillStyle = 'rgba(14, 18, 32, 0.88)'
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(8, 8, 364, 104, 16)
    ctx.fill()
    ctx.stroke()

    ctx.font = 'bold 24px Inter, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Truncate text if too long
    const displayText = text.length > 20 ? text.substring(0, 18) + '...' : text
    ctx.fillText(displayText, 190, 60)

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(3.2, 1.0, 1.0)
    sprite.position.set(0, 2.4, 0)

    avatarGroup.add(sprite)
    sound.playUiClick()

    setTimeout(() => {
      avatarGroup.remove(sprite)
      spriteMat.dispose()
      texture.dispose()
    }, durationMs)
  }
}

export const chatBubbleManager = new ChatBubbleManager()
