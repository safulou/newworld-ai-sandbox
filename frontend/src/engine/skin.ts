export interface AvatarSkin {
  suitColor: number
  visorColor: number
  jetpackEnabled: boolean
  title: string
  skinName: string
}

export const PRESET_SKINS: AvatarSkin[] = [
  { suitColor: 0x00ffff, visorColor: 0x00ff88, jetpackEnabled: true, title: '賽博先鋒 (Cyber Pioneer)', skinName: 'Cyber Neon' },
  { suitColor: 0x111116, visorColor: 0xff0055, jetpackEnabled: false, title: '幽靈行者 (Ghost Operative)', skinName: 'Stealth Black' },
  { suitColor: 0xffd700, visorColor: 0xffffff, jetpackEnabled: true, title: '太陽君主 (Solar Monarch)', skinName: 'Solar Gold' },
  { suitColor: 0xffffff, visorColor: 0x00e5ff, jetpackEnabled: true, title: '極地遊俠 (Glacier Ranger)', skinName: 'Frost White' },
  { suitColor: 0x8800ff, visorColor: 0xff00bb, jetpackEnabled: false, title: '量子秘術師 (Quantum Mage)', skinName: 'Abyss Purple' },
]

export class SkinManager {
  private currentSkin: AvatarSkin = PRESET_SKINS[0]

  constructor() {
    this.load()
  }

  private load(): void {
    const saved = localStorage.getItem('nw_player_skin')
    if (saved) {
      try {
        this.currentSkin = JSON.parse(saved)
      } catch { /* ignore */ }
    }
  }

  public save(): void {
    localStorage.setItem('nw_player_skin', JSON.stringify(this.currentSkin))
  }

  public getSkin(): AvatarSkin {
    return this.currentSkin
  }

  public setSkin(skin: AvatarSkin): void {
    this.currentSkin = skin
    this.save()
    window.dispatchEvent(new CustomEvent('skin-updated', { detail: skin }))
  }
}

export const skinManager = new SkinManager()
