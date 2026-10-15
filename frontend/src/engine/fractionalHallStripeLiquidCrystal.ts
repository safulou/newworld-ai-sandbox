/**
 * 分數量子霍爾條紋相與向列液晶相變引擎 (Fractional Quantum Hall Stripe & Nematic Liquid Crystal Engine)
 * 
 * 物理原理：
 * 1. 在半填充高朗道能級（Higher Landau Levels, 例如 ν = 9/2, 11/2, 5/2）的超高遷移率二維電子氣 (2DEG) 中，
 *    電子間庫侖排斥相互作用克服均勻液體基態，自發破缺空間連續平移與二維空間旋轉對稱性。
 * 2. 系統發生電荷密度波 (CDW) 不穩定性，形成單向空間週期性調製的「條紋相」(Stripe Phase)。
 * 3. 伴隨電子向列液晶相 (Electronic Nematic Phase)：液晶指向矢 n = (cos θ, sin θ) 沿特定結晶方向鎖定，
 *    展現極端各向異性傳輸，沿條紋方向與垂直條紋方向的縱向電阻率比值出現巨磁阻各向異性 (α_nem = ρ_xx / ρ_yy > 100)。
 * 4. 在偏離半整數填充時，條紋破裂凝聚為三角晶格陣列的「泡泡晶相」(Triangular Bubble Lattice Phase)。
 */

export type FqhStripeRegime = 
  | 'isotropic-fermi-liquid'
  | 'electronic-nematic'
  | 'giant-anisotropic-stripe'
  | 'triangular-bubble-lattice';

export interface FqhStripeState {
  landauFillingNu: number;           // 朗道能級填充因子 ν (e.g. 4.5, 5.5)
  nematicDirectorAngleDeg: number;   // 向列指向矢方向角 θ_nem (度, 0° ~ 180°)
  anisotropyRatio: number;           // 巨各向異性比 α_nem = ρ_xx / ρ_yy (1.0 ~ 120.0)
  stripePeriodNm: number;            // 條紋空間調製週期 λ_s (nm, 20 ~ 100)
  nematicOrderParameterS: number;    // 向列液晶秩序參數 S (0.0 ~ 1.0)
  bubbleClusterRadiusNm: number;     // 泡泡晶格團簇半徑 (nm)
  longitudinalResistivityXx: number; // 縱向電阻率 ρ_xx (kΩ/□)
  longitudinalResistivityYy: number; // 縱向電阻率 ρ_yy (kΩ/□)
  activeRegime: FqhStripeRegime;
  pulsePhase: number;
  stripeDensityField: number[];      // 1D 密度波切面採樣
}

const STORAGE_KEY = 'newworld_fractional_hall_stripe_liquid_crystal_state_v1';

export class FractionalHallStripeLiquidCrystalEngine {
  private state: FqhStripeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): FqhStripeState {
    const defaults: FqhStripeState = {
      landauFillingNu: 4.5, // 9/2
      nematicDirectorAngleDeg: 45.0,
      anisotropyRatio: 85.0,
      stripePeriodNm: 48.0,
      nematicOrderParameterS: 0.92,
      bubbleClusterRadiusNm: 15.0,
      longitudinalResistivityXx: 42.5,
      longitudinalResistivityYy: 0.5,
      activeRegime: 'giant-anisotropic-stripe',
      pulsePhase: 0,
      stripeDensityField: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load FQH Stripe state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save FQH Stripe state to localStorage:', e);
      }
    }
  }

  public getState(): FqhStripeState {
    return { ...this.state };
  }

  public setLandauFilling(nu: number): void {
    this.state.landauFillingNu = Math.max(4.0, Math.min(6.0, nu));
    if (Math.abs(nu - Math.round(nu)) < 0.05) {
      this.state.activeRegime = 'isotropic-fermi-liquid';
    } else if (Math.abs(nu - 4.5) < 0.12 || Math.abs(nu - 5.5) < 0.12) {
      this.state.activeRegime = 'giant-anisotropic-stripe';
    } else if (Math.abs(nu - 4.25) < 0.12 || Math.abs(nu - 4.75) < 0.12 || Math.abs(nu - 5.25) < 0.12) {
      this.state.activeRegime = 'triangular-bubble-lattice';
    } else {
      this.state.activeRegime = 'electronic-nematic';
    }
    this.recomputePhysics();
    this.saveState();
  }

  public setDirectorAngle(deg: number): void {
    this.state.nematicDirectorAngleDeg = (deg % 180 + 180) % 180;
    this.recomputePhysics();
    this.saveState();
  }

  public setNematicAngle(deg: number): void {
    this.setDirectorAngle(deg);
  }

  public setRegime(regime: FqhStripeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'isotropic-fermi-liquid':
        this.state.landauFillingNu = 4.0;
        this.state.nematicOrderParameterS = 0.05;
        break;
      case 'electronic-nematic':
        this.state.landauFillingNu = 4.4;
        this.state.nematicOrderParameterS = 0.65;
        break;
      case 'giant-anisotropic-stripe':
        this.state.landauFillingNu = 4.5; // 9/2
        this.state.nematicOrderParameterS = 0.95;
        break;
      case 'triangular-bubble-lattice':
        this.state.landauFillingNu = 4.25; // 泡泡相
        this.state.nematicOrderParameterS = 0.40;
        break;
    }
    this.recomputePhysics();
    this.playRegimeTransitionTone(regime);
    this.saveState();
  }

  public triggerNematicDirectorPulse(): void {
    this.state.pulsePhase = 1.0;
    this.playAnisotropicBurstTone();
  }

  public triggerChirpAudio(): void {
    this.triggerNematicDirectorPulse();
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
    const { landauFillingNu: nu, activeRegime } = this.state;

    // 計算向列秩序參數 S
    let baseXx = 2.0;
    let baseYy = 1.9;
    if (activeRegime === 'isotropic-fermi-liquid') {
      this.state.nematicOrderParameterS = 0.05;
      this.state.anisotropyRatio = 1.0;
      baseXx = 2.0;
      baseYy = 2.0;
    } else if (activeRegime === 'electronic-nematic') {
      this.state.nematicOrderParameterS = 0.68;
      this.state.anisotropyRatio = 18.5;
      baseXx = 14.8;
      baseYy = 0.8;
    } else if (activeRegime === 'giant-anisotropic-stripe') {
      this.state.nematicOrderParameterS = 0.96;
      this.state.anisotropyRatio = 105.0;
      baseXx = 52.5;
      baseYy = 0.5;
    } else { // triangular-bubble-lattice
      this.state.nematicOrderParameterS = 0.35;
      this.state.anisotropyRatio = 2.8;
      baseXx = 8.4;
      baseYy = 3.0;
    }

    // 依據指向矢角度旋轉電阻率張量
    const rad = (this.state.nematicDirectorAngleDeg * Math.PI) / 180;
    const cos2 = Math.cos(rad) ** 2;
    const sin2 = Math.sin(rad) ** 2;
    this.state.longitudinalResistivityXx = Number((baseXx * cos2 + baseYy * sin2).toFixed(2));
    this.state.longitudinalResistivityYy = Number((baseXx * sin2 + baseYy * cos2).toFixed(2));

    // 條紋空間週期 λ_s = 2.8 · R_c (回旋半徑 R_c 隨磁能標)
    this.state.stripePeriodNm = 35.0 + 15.0 * (nu - 4.0);
    this.state.bubbleClusterRadiusNm = 12.0 + 4.0 * (nu - 4.0);

    // 密度波切面採樣
    const samples = 40;
    const density: number[] = [];
    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * 4 * Math.PI;
      const val = Math.cos(x) * this.state.nematicOrderParameterS;
      density.push(val);
    }
    this.state.stripeDensityField = density;
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

  private playRegimeTransitionTone(regime: FqhStripeRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const tones: Record<FqhStripeRegime, number[]> = {
        'isotropic-fermi-liquid': [440, 550],
        'electronic-nematic': [330, 495, 660],
        'giant-anisotropic-stripe': [220, 440, 880], // 巨各向異性倍頻
        'triangular-bubble-lattice': [300, 450, 600, 750]
      };

      const selected = tones[regime] || [440];
      selected.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
      });
    } catch (e) {
      console.warn('Stripe audio error:', e);
    }
  }

  private playAnisotropicBurstTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      // 向列指向矢偏轉巨磁阻突波音效 (220 -> 660 Hz 滑音)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Burst audio error:', e);
    }
  }
}

export const fractionalHallStripeLiquidCrystalEngine = new FractionalHallStripeLiquidCrystalEngine();
