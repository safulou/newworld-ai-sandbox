/**
 * 莫爾分數量子自旋霍爾效應與雙重自旋液體反應堆引擎 (Fractional QSH & Dual Spin Liquid Engine)
 * 
 * 物理原理：
 * 1. 扭轉雙層 TMD 莫爾超晶格中，時間反演對稱性 (TRS) 保護自旋向上與自旋向下電子各自具有相反的非平庸陳數 (C_↑ = +1, C_↓ = -1)，
 *    形成時間反演不變量 Z₂ = 1 的量子自旋霍爾態 (QSH)。
 * 2. 在平帶分數填充 ν = 2/3, 1/3 下，強電子庫侖排斥 (U/W > 4.0) 抑制平凡費米液體基態，湧現「分數量子自旋霍爾效應」(FQSH)。
 * 3. 伴隨自旋-電荷分離 (Spin-Charge Separation)：低能準粒子分裂為攜帶電荷但無自旋的「荷子」(Holon, q = e*, S = 0)
 *    與攜帶自旋但為電中性的「自旋子」(Spinon, q = 0, S = 1/2)，兩者具有不同的集體激發群速度 (v_holon ≠ v_spinon)。
 * 4. 系統在體內形成雙重 Z₂ / U(1) 拓撲自旋液體基態，展現非零拓撲糾纏熵 γ = ln 2 ≈ 0.6931 與分數化自旋霍爾電導 σ_xy^s = (e/4π) · ν_s。
 */

export type FQSHRegime = 
  | 'integer-qsh'
  | 'fractional-qsh'
  | 'spin-charge-separation'
  | 'dual-spin-liquid';

export interface FQSHState {
  twistAngleDeg: number;             // 扭轉角 (度, 1.0° ~ 4.0°)
  fillingNu: number;                 // 莫爾帶分數填充 (0.1 ~ 1.0, 常用 1/3, 2/3, 1)
  coulombU: number;                  // 庫侖相互作用強度 U (meV, 1 ~ 20)
  spinHallConductance: number;       // 分數自旋霍爾電導 σ_xy^s (e/4π 單位)
  spinonVelocity: number;            // 自旋子激發速度 v_s (10^4 m/s)
  holonVelocity: number;             // 荷子激發速度 v_h (10^4 m/s)
  spinChargeSeparationRatio: number; // 速度分離比 v_h / v_s
  topologicalEntropy: number;        // 拓撲糾纏熵 γ
  spinFlavorsDegeneracy: number;     // 基態拓撲簡併度
  helicalEdgeDecayLength: number;    // 螺旋邊緣態橫向穿透長度 (nm)
  activeRegime: FQSHRegime;
  pulsePhase: number;
  separationActive: boolean;
  history: Array<{ time: number; spinHallCond: number; separation: number }>;
}

const STORAGE_KEY = 'newworld_fractional_qsh_spin_liquid_state_v1';

export class FractionalQshSpinLiquidEngine {
  private state: FQSHState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): FQSHState {
    const defaults: FQSHState = {
      twistAngleDeg: 1.85,
      fillingNu: 0.667, // 2/3
      coulombU: 8.5,    // meV
      spinHallConductance: 0.667,
      spinonVelocity: 3.2,
      holonVelocity: 7.8,
      spinChargeSeparationRatio: 7.8 / 3.2,
      topologicalEntropy: 0.6931, // ln 2
      spinFlavorsDegeneracy: 4,
      helicalEdgeDecayLength: 12.4, // nm
      activeRegime: 'fractional-qsh',
      pulsePhase: 0,
      separationActive: false,
      history: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load FQSH state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save FQSH state to localStorage:', e);
      }
    }
  }

  public getState(): FQSHState {
    return { ...this.state };
  }

  public setTwistAngle(deg: number): void {
    this.state.twistAngleDeg = Math.max(1.0, Math.min(4.0, deg));
    this.recomputePhysics();
    this.saveState();
  }

  public setFillingNu(nu: number): void {
    this.state.fillingNu = Math.max(0.1, Math.min(1.0, nu));
    this.recomputePhysics();
    this.saveState();
  }

  public setCoulombU(u: number): void {
    this.state.coulombU = Math.max(1.0, Math.min(20.0, u));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FQSHRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'integer-qsh':
        this.state.fillingNu = 1.0;
        this.state.coulombU = 2.0;
        break;
      case 'fractional-qsh':
        this.state.fillingNu = 0.667;
        this.state.coulombU = 8.5;
        break;
      case 'spin-charge-separation':
        this.state.fillingNu = 0.333;
        this.state.coulombU = 14.0;
        this.state.separationActive = true;
        break;
      case 'dual-spin-liquid':
        this.state.fillingNu = 0.500;
        this.state.coulombU = 18.0;
        break;
    }
    this.recomputePhysics();
    this.playRegimeTransitionTone(regime);
    this.saveState();
  }

  public triggerSpinChargePulse(): void {
    this.state.separationActive = true;
    this.state.pulsePhase = 1.0;
    this.playSeparationTone();
  }

  private recomputePhysics(): void {
    const { twistAngleDeg, fillingNu, coulombU, activeRegime } = this.state;

    // 自旋霍爾電導：整數時為 1.0，分數時依填充量子化
    if (activeRegime === 'integer-qsh') {
      this.state.spinHallConductance = 1.0;
      this.state.topologicalEntropy = 0.0;
      this.state.spinFlavorsDegeneracy = 1;
    } else if (activeRegime === 'fractional-qsh') {
      this.state.spinHallConductance = fillingNu; // e.g. 2/3 或 1/3
      this.state.topologicalEntropy = Math.log(2); // ln 2 ≈ 0.6931
      this.state.spinFlavorsDegeneracy = 4;
    } else if (activeRegime === 'spin-charge-separation') {
      this.state.spinHallConductance = fillingNu;
      this.state.topologicalEntropy = Math.log(2) + 0.301; // ln 2 + ln √2
      this.state.spinFlavorsDegeneracy = 4;
    } else { // dual-spin-liquid
      this.state.spinHallConductance = 0.5; // 拓撲自旋液體共振
      this.state.topologicalEntropy = 2 * Math.log(2); // 雙重自旋液體 2 ln 2 ≈ 1.386
      this.state.spinFlavorsDegeneracy = 8;
    }

    // 自旋子與荷子速度模型：庫侖排斥顯著加速荷子 (電荷等離子體激發)，而自旋子主要受超交換作用 J 支配
    const moireBandwidth = 25.0 / Math.max(1.0, twistAngleDeg * 1.5); // meV
    const J_exchange = 4.0 * Math.pow(moireBandwidth, 2) / Math.max(1.0, coulombU); // meV
    this.state.spinonVelocity = 1.5 + 0.4 * J_exchange;
    this.state.holonVelocity = 2.0 + 0.6 * coulombU;
    this.state.spinChargeSeparationRatio = this.state.holonVelocity / Math.max(0.1, this.state.spinonVelocity);

    // 螺旋邊緣態穿透長度：隨帶隙成反比
    const gap = Math.abs(coulombU - moireBandwidth) + 1.0;
    this.state.helicalEdgeDecayLength = Math.min(30.0, 120.0 / gap);
  }

  public update(dt: number): void {
    if (this.state.pulsePhase > 0) {
      this.state.pulsePhase = Math.max(0, this.state.pulsePhase - dt * 1.2);
    }

    // 維護即時歷史紀錄
    const now = Date.now();
    if (!this.state.history) this.state.history = [];
    if (this.state.history.length === 0 || now - this.state.history[this.state.history.length - 1].time > 500) {
      this.state.history.push({
        time: now,
        spinHallCond: this.state.spinHallConductance,
        separation: this.state.spinChargeSeparationRatio
      });
      if (this.state.history.length > 20) {
        this.state.history.shift();
      }
    }
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

  private playRegimeTransitionTone(regime: FQSHRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const freqs: Record<FQSHRegime, number[]> = {
        'integer-qsh': [440, 660],
        'fractional-qsh': [330, 495, 660],
        'spin-charge-separation': [280, 560, 840],
        'dual-spin-liquid': [220, 330, 440, 550]
      };

      const selectedFreqs = freqs[regime] || [440];
      selectedFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
      });
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  private playSeparationTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      // 雙滑音模擬荷子與自旋子以不同速度分流
      // 荷子：高頻快速滑音 (400 -> 900 Hz)
      const oscHolon = ctx.createOscillator();
      const gainHolon = ctx.createGain();
      oscHolon.type = 'sawtooth';
      oscHolon.frequency.setValueAtTime(400, ctx.currentTime);
      oscHolon.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
      gainHolon.gain.setValueAtTime(0.06, ctx.currentTime);
      gainHolon.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      oscHolon.connect(gainHolon);
      gainHolon.connect(ctx.destination);
      oscHolon.start();
      oscHolon.stop(ctx.currentTime + 0.35);

      // 自旋子：低頻沉穩滑音 (220 -> 330 Hz)
      const oscSpinon = ctx.createOscillator();
      const gainSpinon = ctx.createGain();
      oscSpinon.type = 'sine';
      oscSpinon.frequency.setValueAtTime(220, ctx.currentTime);
      oscSpinon.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.4);
      gainSpinon.gain.setValueAtTime(0.08, ctx.currentTime);
      gainSpinon.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      oscSpinon.connect(gainSpinon);
      gainSpinon.connect(ctx.destination);
      oscSpinon.start();
      oscSpinon.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn('Separation tone error:', e);
    }
  }
}

export const fractionalQshSpinLiquidEngine = new FractionalQshSpinLiquidEngine();
