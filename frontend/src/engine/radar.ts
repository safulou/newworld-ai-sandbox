import * as THREE from 'three'
import { npcManager } from './npc'
import { cyberFauna } from './cyberFauna'
import { survivalCombat } from './survivalCombat'
import { multiplayerSync } from './multiplayerSync'

export type BlipType = 'npc' | 'hound' | 'boss' | 'player'

export interface RadarBlip {
  id: string
  name: string
  type: BlipType
  x: number
  z: number
  distance: number
  color: string
  icon: string
}

export class RadarEngine {
  public sweepAngle: number = 0
  public sweepSpeed: number = 2.4 // radians per second (~2.6s per 360 sweep)
  public zoomLevels: number[] = [1, 2, 4]
  public currentZoomIdx: number = 0 // default 1x
  public baseRange: number = 48 // blocks at 1x

  public get currentZoom(): number {
    return this.zoomLevels[this.currentZoomIdx]
  }

  public get currentRange(): number {
    return this.baseRange * this.currentZoom
  }

  public cycleZoom(): number {
    this.currentZoomIdx = (this.currentZoomIdx + 1) % this.zoomLevels.length
    return this.currentZoom
  }

  public update(delta: number): void {
    this.sweepAngle = (this.sweepAngle + this.sweepSpeed * delta) % (Math.PI * 2)
  }

  /**
   * Scans all entities in range and returns radar blips relative to player position
   */
  public scan(playerPos: THREE.Vector3): RadarBlip[] {
    const range = this.currentRange
    const blips: RadarBlip[] = []

    // 1. Scan NPCs
    try {
      const npcs = npcManager.getNPCs()
      for (const npc of npcs) {
        const group = npc.getGroup()
        if (!group) continue
        const pos = group.position
        const dx = pos.x - playerPos.x
        const dz = pos.z - playerPos.z
        const dist = Math.hypot(dx, dz)
        if (dist <= range) {
          blips.push({
            id: `npc-${npc.def.id}`,
            name: npc.def.name,
            type: 'npc',
            x: dx,
            z: dz,
            distance: Math.round(dist),
            color: '#00ff88',
            icon: '🤖',
          })
        }
      }
    } catch {
      // safe fallback if npcManager is mock or unit test
    }

    // 2. Scan Cyber Hounds
    try {
      const hounds = cyberFauna.getHounds()
      for (const hound of hounds) {
        const pos = hound.group.position
        const dx = pos.x - playerPos.x
        const dz = pos.z - playerPos.z
        const dist = Math.hypot(dx, dz)
        if (dist <= range) {
          const isTamed = hound.state !== 'wild'
          blips.push({
            id: `hound-${hound.id}`,
            name: isTamed ? '護衛獵犬' : '荒野機械獸',
            type: 'hound',
            x: dx,
            z: dz,
            distance: Math.round(dist),
            color: isTamed ? '#00f0ff' : '#ffb800',
            icon: '🐕',
          })
        }
      }
    } catch {
      // safe fallback
    }

    // 3. Scan Dungeon Boss Guardian
    try {
      const boss = survivalCombat.getBoss()
      if (boss && !boss.isDefeated) {
        const pos = boss.mesh.position
        const dx = pos.x - playerPos.x
        const dz = pos.z - playerPos.z
        const dist = Math.hypot(dx, dz)
        if (dist <= range) {
          blips.push({
            id: 'boss-guardian',
            name: '領主守護核心',
            type: 'boss',
            x: dx,
            z: dz,
            distance: Math.round(dist),
            color: '#ff0055',
            icon: '👾',
          })
        }
      }
    } catch {
      // safe fallback
    }

    // 4. Scan Remote Multiplayer Players
    try {
      multiplayerSync.remotePlayers.forEach((player, id) => {
        const pos = player.position
        const dx = pos.x - playerPos.x
        const dz = pos.z - playerPos.z
        const dist = Math.hypot(dx, dz)
        if (dist <= range) {
          blips.push({
            id: `player-${id}`,
            name: player.name || '旅人',
            type: 'player',
            x: dx,
            z: dz,
            distance: Math.round(dist),
            color: '#a371f7',
            icon: '🧑‍🚀',
          })
        }
      })
    } catch {
      // safe fallback
    }

    return blips
  }

  /**
   * Renders the complete tactical circular radar onto a 2D HTML5 canvas
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    playerPos: THREE.Vector3,
    playerYaw: number = 0
  ): void {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 8
    const range = this.currentRange

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Clip to circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.clip()

    // 1. Radar background
    ctx.fillStyle = 'rgba(7, 12, 22, 0.95)'
    ctx.fillRect(0, 0, width, height)

    // 2. Grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)'
    ctx.lineWidth = 1
    const gridStep = radius / 3
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, gridStep * i, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Crosshairs
    ctx.beginPath()
    ctx.moveTo(centerX - radius, centerY)
    ctx.lineTo(centerX + radius, centerY)
    ctx.moveTo(centerX, centerY - radius)
    ctx.lineTo(centerX, centerY + radius)
    ctx.stroke()

    // 3. Rotating Radar Sweep
    const sweepGrad = ctx.createConicGradient(this.sweepAngle, centerX, centerY)
    sweepGrad.addColorStop(0, 'rgba(0, 255, 255, 0.35)')
    sweepGrad.addColorStop(0.12, 'rgba(0, 255, 255, 0.05)')
    sweepGrad.addColorStop(0.2, 'rgba(0, 255, 255, 0)')
    sweepGrad.addColorStop(1, 'rgba(0, 255, 255, 0)')

    ctx.fillStyle = sweepGrad
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()

    // Sweep leading beam line
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.85)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + Math.cos(this.sweepAngle) * radius,
      centerY + Math.sin(this.sweepAngle) * radius
    )
    ctx.stroke()

    // 4. Draw Entity Blips
    const blips = this.scan(playerPos)
    for (const b of blips) {
      // Calculate normalized position on radar circle
      // Rotate by player yaw so top of radar is forward
      const cosY = Math.cos(-playerYaw)
      const sinY = Math.sin(-playerYaw)
      const rotX = b.x * cosY - b.z * sinY
      const rotZ = b.x * sinY + b.z * cosY

      const blipRadius = (Math.hypot(rotX, rotZ) / range) * radius
      if (blipRadius > radius - 4) continue // Don't draw outside circle

      const angle = Math.atan2(rotZ, rotX)
      const screenX = centerX + Math.cos(angle) * blipRadius
      const screenY = centerY + Math.sin(angle) * blipRadius

      // Blip pulse dot
      ctx.fillStyle = b.color
      ctx.shadowColor = b.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.arc(screenX, screenY, b.type === 'boss' ? 5 : 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Blip ring for boss / players
      if (b.type === 'boss' || b.type === 'player') {
        ctx.strokeStyle = b.color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(screenX, screenY, 7, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // 5. Player Arrow at center
    ctx.fillStyle = '#00ffff'
    ctx.shadowColor = '#00ffff'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 6)
    ctx.lineTo(centerX - 4.5, centerY + 5)
    ctx.lineTo(centerX, centerY + 2.5)
    ctx.lineTo(centerX + 4.5, centerY + 5)
    ctx.closePath()
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.restore()

    // 6. Glowing Radar Outer Ring
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Range display text
    ctx.fillStyle = 'rgba(0, 240, 255, 0.7)'
    ctx.font = '9px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${this.currentRange}m (${this.currentZoom}x)`, width - 12, height - 8)
  }
}

export const radar = new RadarEngine()
