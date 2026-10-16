/**
 * 旋量超流全息奇異孤子碰撞反應堆引擎 (Spinor Superfluid Holographic Soliton Collider Engine)
 * 
 * 物理原理：
 * 1. 自旋-1 (F=1) 玻色-愛因斯坦凝聚態（例如 ⁸⁷Rb 或 ²³Na）具有三組分宏觀向量序參量
 *    ψ = (ψ₊₁, ψ₀, ψ₋₁)^T，由自旋交換相互作用常數 c₂ 調控鐵磁 (c₂ < 0) 或極性 (c₂ > 0) 基態。
 * 2. 系統支撐非阿貝爾拓撲孤子——亮-暗自旋孤子 (Bright-Dark Spin Solitons) 與手性疇壁。
 * 3. 透過全息 AdS/CFT 引力對偶，將二維超流體中的雙孤子高速對撞動力學精確映射為
 *    五維 AdS 空間中雙微觀黑洞的相對論碰撞與事件視界幾何融合。
 * 4. 碰撞過程產生特徵相位躍遷、孤子穿透彈性散射或束縛態共振，並伴隨高能自旋波輻射與
 *    全息貝肯斯坦-霍金視界幾何熵增 ΔS_holo = k_B ΔA / 4G_N。
 */

export type SpinorSolitonRegime = 
  | 'polar-ground-fluid'
  | 'soliton-pair-acceleration'
  | 'relativistic-soliton-collision'
  | 'holographic-black-hole-merger';

export interface SolitonPacket {
  xLeft: number;
  xRight: number;
  yPos: number;
  widthUm: number;
  spinDensityPlus1: number;
  spinDensityZero: number;
  spinDensityMinus1: number;
}

export interface SpinorSolitonState {
  spinInteractionC2Hz: number;          // 自旋交換相互作用 c₂ (Hz, -20.0 ~ 20.0)
  collisionVelocityRatio: number;       // 相對碰撞速度 v_rel / v_s (0.1 ~ 2.0)
  impactParameterUm: number;            // 碰撞衝擊參數 b (μm, 0.0 ~ 10.0)
  solitonWavepacketWidthUm: number;     // 孤子特徵寬度 ξ_s (μm)
  holographicHorizonEntropyDelta: number;// 全息視界熵增 ΔS / k_B
  spinPrecessionRateHz: number;         // 自旋進動頻率 (Hz)
  transmittedEnergyFraction: number;    // 碰撞穿透能量比例 (0.0 ~ 1.0)
  activeRegime: SpinorSolitonRegime;
  pulsePhase: number;
  packet: SolitonPacket;
}

const STORAGE_KEY = 'newworld_spinor_soliton_collider_state_v1';

export class SpinorSolitonColliderEngine {
  private state: SpinorSolitonState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): SpinorSolitonState {
    const defaults: SpinorSolitonState = {
      spinInteractionC2Hz: -6.5, // 弱鐵磁相
      collisionVelocityRatio: 0.85,
      impactParameterUm: 1.2,
      solitonWavepacketWidthUm: 3.4,
      holographicHorizonEntropyDelta: 48.6,
      spinPrecessionRateHz: 12.8,
      transmittedEnergyFraction: 0.74,
      activeRegime: 'relativistic-soliton-collision',
      pulsePhase: 0,
      packet: {
        xLeft: 80,
        xRight: 220,
        yPos: 150,
        widthUm: 3.4,
        spinDensityPlus1: 0.45,
        spinDensityZero: 0.20,
        spinDensityMinus1: 0.35
      }
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Spinor Soliton Collider state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Spinor Soliton Collider state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<SpinorSolitonState> {
    return this.state;
  }

  public setSpinInteraction(c2: number): void {
    this.state.spinInteractionC2Hz = Math.max(-20.0, Math.min(20.0, c2));
    this.recomputePhysics();
    this.saveState();
  }

  public setCollisionVelocity(v: number): void {
    this.state.collisionVelocityRatio = Math.max(0.1, Math.min(2.0, v));
    this.recomputePhysics();
    this.saveState();
  }

  public setImpactParameter(b: number): void {
    this.state.impactParameterUm = Math.max(0.0, Math.min(10.0, b));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: SpinorSolitonRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'polar-ground-fluid':
        this.state.spinInteractionC2Hz = 15.0; // 極性相
        this.state.collisionVelocityRatio = 0.2;
        this.state.impactParameterUm = 6.0;
        break;
      case 'soliton-pair-acceleration':
        this.state.spinInteractionC2Hz = -4.0;
        this.state.collisionVelocityRatio = 0.6;
        this.state.impactParameterUm = 2.5;
        break;
      case 'relativistic-soliton-collision':
        this.state.spinInteractionC2Hz = -12.0;
        this.state.collisionVelocityRatio = 1.1;
        this.state.impactParameterUm = 0.8;
        break;
      case 'holographic-black-hole-merger':
        this.state.spinInteractionC2Hz = -18.0;
        this.state.collisionVelocityRatio = 1.85;
        this.state.impactParameterUm = 0.1;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const c2 = this.state.spinInteractionC2Hz;
    const v = this.state.collisionVelocityRatio;
    const b = this.state.impactParameterUm;

    // 孤子特徵寬度 ξ_s = 2.5 / sqrt(1 + |c2| / 10)
    const width = 4.5 / Math.sqrt(1 + Math.abs(c2) / 8.0);
    this.state.solitonWavepacketWidthUm = parseFloat(width.toFixed(2));

    // 自旋進動頻率 ω_spin = |c2| * (1 + v)
    const prec = Math.abs(c2) * (1 + v * 0.5);
    this.state.spinPrecessionRateHz = parseFloat(prec.toFixed(1));

    // 穿透能量分額 T_trans = exp(-0.8 * (1/v) * (1 - b/12))
    const trans = Math.exp(-0.6 * (1.0 / Math.max(0.2, v)) * Math.max(0.1, 1 - b / 12.0));
    this.state.transmittedEnergyFraction = parseFloat(Math.min(0.99, Math.max(0.05, trans)).toFixed(2));

    // 全息視界熵增 ΔS / k_B = 25 * v² * (1 + Math.abs(c2)/15) * exp(-b/4)
    const entropy = 20 * Math.pow(v, 2) * (1 + Math.abs(c2) / 12.0) * Math.exp(-b / 4.0);
    this.state.holographicHorizonEntropyDelta = parseFloat(entropy.toFixed(1));

    // 雙孤子動態軌跡計算 (在 150 像素中心對撞)
    const progress = Math.abs(Math.sin(this.state.pulsePhase * 0.8));
    const distance = 80 * (1 - progress);
    const xL = 150 - distance;
    const xR = 150 + distance;
    const yL = 150 - (b * 2.5) * (1 - progress);
    const yR = 150 + (b * 2.5) * (1 - progress);

    this.state.packet = {
      xLeft: parseFloat(xL.toFixed(1)),
      xRight: parseFloat(xR.toFixed(1)),
      yPos: parseFloat(((yL + yR) / 2).toFixed(1)),
      widthUm: this.state.solitonWavepacketWidthUm,
      spinDensityPlus1: parseFloat((0.4 + 0.2 * Math.sin(this.state.pulsePhase + c2)).toFixed(2)),
      spinDensityZero: parseFloat((0.2 + 0.1 * Math.cos(this.state.pulsePhase)).toFixed(2)),
      spinDensityMinus1: parseFloat((0.4 - 0.2 * Math.sin(this.state.pulsePhase + c2)).toFixed(2))
    };
  }

  public update(dtSeconds: number): void {
    const rate = 1.0 + this.state.collisionVelocityRatio * 1.5;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerCollisionSound(): void {
    try {
      if (typeof window === 'undefined') return;
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      const baseFreq = 120 + this.state.collisionVelocityRatio * 80;
      const peakFreq = baseFreq + Math.abs(this.state.spinInteractionC2Hz) * 25;

      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(peakFreq, t + 0.15);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.45);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch (e) {
      console.warn('Web Audio playback failed in SpinorSolitonEngine:', e);
    }
  }

  public reset(): void {
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
}

export const spinorSolitonColliderEngine = new SpinorSolitonColliderEngine();
