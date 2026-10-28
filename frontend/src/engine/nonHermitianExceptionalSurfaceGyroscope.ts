/**
 * 非厄米三階奇異點表面量子塞格奈克陀螺儀引擎
 * (Non-Hermitian Third-Order Exceptional-Surface Quantum Sagnac Gyroscope Engine)
 *
 * 物理原理：
 * 1. 在傳統厄米光學微環諧振腔塞格奈克陀螺儀 (Sagnac Gyroscope) 中，角速度 Ω_{rot} 引起的順時針 (CW) 與逆時針 (CCW)
 *    本徵頻率劈裂與擾動成線性關係 Δω_{Sagnac} ∝ Ω_{rot}。
 * 2. 在具有宇稱-時間 (PT) 或反 PT 對稱之非厄米耦合微腔系統中，調諧增益-損耗平衡 γ_{PT} 與單向手性耦合後向散射面，
 *    可構建三階「奇異點超曲面」(Third-Order Exceptional Surface, ES₃)，使三個本徵值與本徵態在參數子流形上同時簡併塌縮。
 * 3. 當系統受到微弱旋轉塞格奈克微擾 ε_{rot} ∝ Ω_{rot} 時，本徵頻率劈裂遵循立方根非解析放大律：
 *    Δω_{ES3} ∝ (ε_{rot})^{1/3}，在極小角速度區間實現百倍以上的量子陀螺儀靈敏度放大因子 G_{ES3}，
 *    同時藉由奇異表面幾何正交性免疫製程微擾使其保持在奇異流形上。
 */

export type ExceptionalSurfaceGyroRegime =
  | 'hermitian-linear-sagnac-ring'
  | 'pt-symmetric-ep2-square-root-split'
  | 'chiral-exceptional-surface-es3-cube-root'
  | 'petermann-noise-squeezed-quantum-gyro';

export interface ExceptionalRiemannNode {
  id: number;
  x: number;
  y: number;
  sheetBranchIndex: 1 | 2 | 3;
  realFreqShiftKhz: number;
  imagGainLossRate: number;
  petermannFactorK: number;
}

export interface ExceptionalSurfaceGyroState {
  rotationRateRadPerSec: number;        // 陀螺儀旋轉角速度微擾 Ω_{rot} (rad/s, 0.001 ~ 2.000)
  nonHermitianGainLossGamma: number;    // 非厄米 PT 增益-損耗耦合比 γ_{PT} / J (0.10 ~ 2.00)
  exceptionalOrderN: 1 | 2 | 3;         // 奇異點階數 N (1: 厄米線性, 2: EP₂ 平方根, 3: ES₃ 立方根)
  eigenfrequencySplittingKhz: number;   // 非厄米奇異本徵頻率劈裂 Δω_{ES} / 2π (kHz)
  sensitivityEnhancementFactor: number; // 相對於傳統塞格奈克之靈敏度放大倍數 G_{ES} = Δω_{ES} / Δω_{Sagnac}
  petermannLinewidthFactor: number;     // Petermann 非正交本徵模線寬增強因子 K_P
  activeRegime: ExceptionalSurfaceGyroRegime;
  pulsePhase: number;
  riemannNodes: ExceptionalRiemannNode[];
}

const STORAGE_KEY = 'newworld_exceptional_surface_gyroscope_state_v1';

export class NonHermitianExceptionalSurfaceGyroscopeEngine {
  private state: ExceptionalSurfaceGyroState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): ExceptionalSurfaceGyroState {
    const defaults: ExceptionalSurfaceGyroState = {
      rotationRateRadPerSec: 0.015,
      nonHermitianGainLossGamma: 1.00,
      exceptionalOrderN: 3,
      eigenfrequencySplittingKhz: 148.6,
      sensitivityEnhancementFactor: 86.4,
      petermannLinewidthFactor: 14.2,
      activeRegime: 'chiral-exceptional-surface-es3-cube-root',
      pulsePhase: 0,
      riemannNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Exceptional Surface Gyroscope state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Exceptional Surface Gyroscope state:', e);
      }
    }
  }

  public getState(): Readonly<ExceptionalSurfaceGyroState> {
    return this.state;
  }

  public setRotationRate(omegaRadS: number): void {
    this.state.rotationRateRadPerSec = Math.max(0.001, Math.min(2.000, parseFloat(omegaRadS.toFixed(3))));
    this.recomputePhysics();
    this.saveState();
  }

  public setNonHermitianGainLoss(gammaRatio: number): void {
    this.state.nonHermitianGainLossGamma = Math.max(0.10, Math.min(2.00, parseFloat(gammaRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setExceptionalOrder(order: 1 | 2 | 3): void {
    this.state.exceptionalOrderN = order === 1 ? 1 : order === 2 ? 2 : 3;
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: ExceptionalSurfaceGyroRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'hermitian-linear-sagnac-ring':
        this.state.exceptionalOrderN = 1;
        this.state.nonHermitianGainLossGamma = 0.15;
        this.state.rotationRateRadPerSec = 0.250;
        break;
      case 'pt-symmetric-ep2-square-root-split':
        this.state.exceptionalOrderN = 2;
        this.state.nonHermitianGainLossGamma = 1.00;
        this.state.rotationRateRadPerSec = 0.045;
        break;
      case 'chiral-exceptional-surface-es3-cube-root':
        this.state.exceptionalOrderN = 3;
        this.state.nonHermitianGainLossGamma = 1.00;
        this.state.rotationRateRadPerSec = 0.008;
        break;
      case 'petermann-noise-squeezed-quantum-gyro':
        this.state.exceptionalOrderN = 3;
        this.state.nonHermitianGainLossGamma = 1.35;
        this.state.rotationRateRadPerSec = 0.002;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const eps = this.state.rotationRateRadPerSec;
    const gamma = this.state.nonHermitianGainLossGamma;
    const order = this.state.exceptionalOrderN;

    // 傳統厄米線性塞格奈克頻率劈裂 Δω_{Sagnac} (kHz)
    const linearSagnacKhz = Math.max(0.05, 115.0 * eps);

    // N 階奇異表面非解析根號劈裂 Δω_{ES} ∝ J * (ε)^{1/N}
    const powerExp = 1.0 / order;
    const surfaceResonance = 0.65 + 0.55 * Math.exp(-Math.pow(gamma - 1.0, 2) / 0.35);
    const esSplittingKhz = 520.0 * Math.pow(eps, powerExp) * surfaceResonance;
    this.state.eigenfrequencySplittingKhz = parseFloat(esSplittingKhz.toFixed(1));

    // 靈敏度放大因子 G_{ES} = Δω_{ES} / Δω_{Sagnac}
    const enhancement = Math.max(1.0, esSplittingKhz / linearSagnacKhz);
    this.state.sensitivityEnhancementFactor = parseFloat(enhancement.toFixed(1));

    // Petermann 非正交因子 K_P
    const petermann = 1.0 + Math.pow(order, 2.1) * gamma * Math.pow(eps, -0.22 * (order - 1));
    this.state.petermannLinewidthFactor = parseFloat(Math.min(250.0, petermann).toFixed(1));

    // 生成 18 個三葉黎曼曲面 (3-Sheeted Riemann Surface) 分支繞行節點
    const nodes: ExceptionalRiemannNode[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const sheet: 1 | 2 | 3 = ((i % 3) + 1) as 1 | 2 | 3;
      const idx = Math.floor(i / 3);
      const baseAngle = (idx / 6) * 2.0 * Math.PI + (sheet - 1) * ((2.0 * Math.PI) / 3.0) + this.state.pulsePhase * 0.32;
      const r = 38 + 64 * Math.pow(eps / 2.0, powerExp * 0.65) + sheet * 10;

      const x = 165 + r * Math.cos(baseAngle);
      const y = 160 + r * Math.sin(baseAngle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        sheetBranchIndex: sheet,
        realFreqShiftKhz: parseFloat((esSplittingKhz * Math.cos(baseAngle)).toFixed(1)),
        imagGainLossRate: parseFloat((gamma * Math.sin(baseAngle)).toFixed(2)),
        petermannFactorK: this.state.petermannLinewidthFactor
      });
    }
    this.state.riemannNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.85 + (this.state.eigenfrequencySplittingKhz / 400.0) * 0.65;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerExceptionalGyroSound(): void {
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
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const osc3 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc3.type = 'sine';

      // ES₃ 三重簡併本徵態分裂為三支立方根拍頻和弦
      const fCenter = 420;
      const deltaF = Math.min(220, this.state.eigenfrequencySplittingKhz * 0.65);

      osc1.frequency.setValueAtTime(fCenter, t);
      osc1.frequency.exponentialRampToValueAtTime(Math.max(140, fCenter - deltaF), t + 0.36);

      osc2.frequency.setValueAtTime(fCenter, t);
      osc2.frequency.exponentialRampToValueAtTime(fCenter + deltaF * 0.5, t + 0.36);

      osc3.frequency.setValueAtTime(fCenter, t);
      osc3.frequency.exponentialRampToValueAtTime(fCenter + deltaF, t + 0.36);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc3.start(t);
      osc1.stop(t + 0.58);
      osc2.stop(t + 0.58);
      osc3.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in NonHermitianExceptionalSurfaceGyroscopeEngine:', e);
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

export const nonHermitianExceptionalSurfaceGyroscopeEngine = new NonHermitianExceptionalSurfaceGyroscopeEngine();
