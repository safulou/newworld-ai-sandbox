/**
 * 微觀黑洞全息引力子糾纏隱形傳態天線引擎 (Micro-Black Hole Holographic Teleportation Antenna Engine)
 * 
 * 物理原理：
 * 1. 基於全息 ER=EPR 假說（愛因斯坦-羅森橋與量子糾纏雙重對偶），由雙面 AdS 施瓦西黑洞構成跨空間量子中繼通道。
 * 2. 引入 Gao-Jafferis-Wall 雙邊邊界耦合算符 h · O_L(-t) O_R(t)，在引力喉管中激發負能量衝擊波 (Negative Energy Shockwave, ⟨T_kk⟩ < 0)，
 *    打破零能量條件 (NEC)，使愛因斯坦-羅森橋暫時開啟為「可穿越蟲洞」(Traversable Wormhole)。
 * 3. 量子資訊位元 |ψ⟩ 墜入左側黑洞視界後經歷快速量子攪拌 (Quantum Scrambling)，
 *    隨後在時間 Δt = (β/2π) ln(1/G_N) 內透過引力子重組在右側視界解擾射出，隱形傳態保真度達 F_teleport > 98%。
 * 4. 喉管開啟時間尺度與有效直徑 r_throat 決定跨星際量子通信之頻寬與抗環境退相干容量。
 */

export type HoleTeleportRegime = 
  | 'non-traversable-dual-bh'
  | 'negative-energy-shockwave'
  | 'holographic-teleportation-active'
  | 'planckian-descrambling-emission';

export interface HoleTeleportState {
  hawkingTemperatureKelvin: number;   // 霍金溫度 T_H (10 ~ 100 nK)
  negativeEnergyFlux: number;         // 負能量衝擊波強度 |⟨T_kk⟩| (10⁻²¹ J/m³)
  wormholeThroatRadiusNm: number;     // 可穿越蟲洞喉管半徑 r_throat (nm, 0.0 ~ 25.0)
  teleportationFidelity: number;      // 全息量子隱形傳態保真度 F (0.0 ~ 0.999)
  scramblingTimeMs: number;           // 快速量子攪拌時間 t_* (ms)
  traversalWindowDurationMs: number;  // 喉管可穿越時間窗口 (ms)
  qubitStateTransferred: boolean;     // 當前量子位元是否傳態成功
  activeRegime: HoleTeleportRegime;
  pulsePhase: number;
}

const STORAGE_KEY = 'newworld_micro_black_hole_teleportation_state_v1';

export class MicroBlackHoleTeleportationEngine {
  private state: HoleTeleportState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HoleTeleportState {
    const defaults: HoleTeleportState = {
      hawkingTemperatureKelvin: 45.0,
      negativeEnergyFlux: 8.5,
      wormholeThroatRadiusNm: 16.4,
      teleportationFidelity: 0.985,
      scramblingTimeMs: 12.8,
      traversalWindowDurationMs: 42.0,
      qubitStateTransferred: true,
      activeRegime: 'holographic-teleportation-active',
      pulsePhase: 0
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Micro-BH Teleport state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Micro-BH Teleport state to localStorage:', e);
      }
    }
  }

  public getState(): HoleTeleportState {
    return { ...this.state };
  }

  public setHawkingTemperature(temp: number): void {
    this.state.hawkingTemperatureKelvin = Math.max(10, Math.min(100, temp));
    this.recomputePhysics();
    this.saveState();
  }

  public setNegativeEnergyFlux(flux: number): void {
    this.state.negativeEnergyFlux = Math.max(0, Math.min(20, flux));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HoleTeleportRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'non-traversable-dual-bh':
        this.state.negativeEnergyFlux = 0.0;
        this.state.qubitStateTransferred = false;
        break;
      case 'negative-energy-shockwave':
        this.state.negativeEnergyFlux = 5.0;
        this.state.qubitStateTransferred = false;
        break;
      case 'holographic-teleportation-active':
        this.state.negativeEnergyFlux = 12.0;
        this.state.qubitStateTransferred = true;
        break;
      case 'planckian-descrambling-emission':
        this.state.negativeEnergyFlux = 18.0;
        this.state.qubitStateTransferred = true;
        break;
    }
    this.recomputePhysics();
    this.playRegimeTransitionTone(regime);
    this.saveState();
  }

  public triggerShockwaveTeleport(): void {
    this.state.pulsePhase = 1.0;
    this.state.qubitStateTransferred = true;
    this.playTeleportChimeTone();
  }

  public triggerChirpAudio(): void {
    this.triggerShockwaveTeleport();
  }

  public resetDefaults(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private recomputePhysics(): void {
    const { hawkingTemperatureKelvin: T, negativeEnergyFlux: flux, activeRegime } = this.state;

    // 攪拌時間 t_* = (ℏ / 2π k_B T) · ln(S_BH)
    this.state.scramblingTimeMs = Math.max(2.0, 500.0 / T);

    // 負能量衝擊波打開蟲洞喉管半徑 r_throat
    if (activeRegime === 'non-traversable-dual-bh' || flux <= 0.1) {
      this.state.wormholeThroatRadiusNm = 0.0;
      this.state.teleportationFidelity = 0.02;
      this.state.traversalWindowDurationMs = 0.0;
      this.state.qubitStateTransferred = false;
    } else {
      this.state.wormholeThroatRadiusNm = Math.min(24.0, Math.sqrt(flux) * 4.8);
      this.state.traversalWindowDurationMs = flux * 3.5;

      if (activeRegime === 'negative-energy-shockwave') {
        this.state.teleportationFidelity = 0.72;
      } else if (activeRegime === 'holographic-teleportation-active') {
        this.state.teleportationFidelity = Math.min(0.995, 0.95 + (flux / 20.0) * 0.045);
      } else { // planckian-descrambling-emission
        this.state.teleportationFidelity = 0.998;
      }
    }
  }

  public update(dt: number): void {
    this.state.pulsePhase = (this.state.pulsePhase + dt * 2.0) % (2 * Math.PI);
  }

  // 純代碼 Web Audio 程序化合成音效
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private playRegimeTransitionTone(regime: HoleTeleportRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const tones: Record<HoleTeleportRegime, number[]> = {
        'non-traversable-dual-bh': [180, 240],
        'negative-energy-shockwave': [350, 480],
        'holographic-teleportation-active': [528, 660, 792], // 528 Hz 核心泛音
        'planckian-descrambling-emission': [528, 792, 1056]
      };

      const selected = tones[regime] || [440];
      selected.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
      });
    } catch (e) {
      console.warn('Hole audio error:', e);
    }
  }

  private playTeleportChimeTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      // 負能量衝擊波反向滑音 (600 -> 150 Hz)
      const oscShock = ctx.createOscillator();
      const gainShock = ctx.createGain();
      oscShock.type = 'sawtooth';
      oscShock.frequency.setValueAtTime(600, ctx.currentTime);
      oscShock.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);

      gainShock.gain.setValueAtTime(0.07, ctx.currentTime);
      gainShock.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      oscShock.connect(gainShock);
      gainShock.connect(ctx.destination);
      oscShock.start();
      oscShock.stop(ctx.currentTime + 0.35);

      // 528 Hz 隱形傳態成功清澈鐘鳴
      const oscChime = ctx.createOscillator();
      const gainChime = ctx.createGain();
      oscChime.type = 'sine';
      oscChime.frequency.setValueAtTime(528, ctx.currentTime + 0.2);
      gainChime.gain.setValueAtTime(0.09, ctx.currentTime + 0.2);
      gainChime.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);

      oscChime.connect(gainChime);
      gainChime.connect(ctx.destination);
      oscChime.start(ctx.currentTime + 0.2);
      oscChime.stop(ctx.currentTime + 0.75);
    } catch (e) {
      console.warn('Teleport chime error:', e);
    }
  }
}

export const microBlackHoleTeleportationEngine = new MicroBlackHoleTeleportationEngine();
