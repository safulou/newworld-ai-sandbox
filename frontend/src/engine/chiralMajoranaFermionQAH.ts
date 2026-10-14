/**
 * 👼 量子反常霍爾-超導雜化手性馬約拉納費米子 (天使粒子) 引擎
 * Chiral Majorana Fermion Modes & Half-Quantized Conductance in QAH-Superconductor Hybrids
 *
 * 理論物理基礎：
 * 1. QAH-超導體拓撲近鄰效應 (QAH-SC Proximity Effect)：
 *    在磁性摻雜拓撲絕緣體 ((Bi,Sb)₂Te₃) 表面沉積常規 s-波超導體 (Nb)，
 *    博戈留玻夫-德熱納 (BdG) 哈密頓量統御電子-電洞激發態：
 *    H_{\text{BdG}} = [v_F (\mathbf{k} \times \boldsymbol{\sigma})_z + M \sigma_z - \mu] \tau_z + \Delta_0 \tau_x
 * 2. 拓撲相變與手性馬約拉納模式 (Chern Number & Chiral Edge Modes)：
 *    當外加磁場交換能隙與超導能隙滿足臨界條件 $M = \sqrt{\Delta_0^2 + \mu^2}$ 時，體能隙閉合並重新打開，
 *    陳數發生階躍 $\Delta N = 1$。手性狄拉克費米邊緣態解耦為一對獨立手性馬約拉納費米子：
 *    c(x) = \frac{1}{\sqrt{2}} (\gamma_1(x) + i \gamma_2(x))
 * 3. 半整數量子化霍爾電導平台 (Half-Quantized Hall Plateau)：
 *    由於單一馬約拉納費米子僅攜帶傳統費米子一半的自由度，兩端霍爾電導呈現精確的半整數平台：
 *    \sigma_{12} = \frac{1}{2} \frac{e^2}{h} \approx 19.374\ \mu\text{S}
 * 4. 半整數熱霍爾電導 (Half-Quantized Thermal Hall Conductance)：
 *    熱霍爾係數嚴格量子化為中央荷 $c = 1/2$：
 *    \kappa_{xy} = \frac{c}{2} \frac{\pi^2 k_B^2}{3h} T = \frac{1}{4} \frac{\pi^2 k_B^2}{3h} T
 */

export type ChiralMajoranaRegime =
  | 'integer-qah-chiral-dirac-mode'         // 整數量子反常霍爾相 (M >> Δ, σ12 = e²/h, 狄拉克邊緣通道)
  | 'half-quantized-chiral-majorana-plateau'// 手性馬約拉納半整數平台相 (M ~ Δ, σ12 = 0.5 e²/h, 天使粒子)
  | 'trivial-superconducting-gap'           // 平庸超導相 (M << Δ, σ12 = 0, 體態超導能隙完全屏蔽)
  | 'non-abelian-majorana-braiding-active'; // 非阿貝爾馬約拉納邊界網絡編織態

export interface ChiralMajoranaState {
  exchangeFieldMev: number;                 // 磁性交換能隙 M (meV, 0.0 ~ 4.5 meV)
  superconductingPairGapMev: number;        // 超導近鄰配對能隙 Δ₀ (meV, 0.2 ~ 3.0 meV)
  chemicalPotentialUev: number;             // 化學勢偏離 μ (μeV, -500 ~ +500 μeV)
  magneticFieldTesla: number;               // 外加垂直磁場 B (Tesla, 0.0 ~ 2.5 T)
  regime: ChiralMajoranaRegime;

  // 動態演算物理指標
  hallConductanceE2OverH: number;           // 兩端霍爾電導 \sigma_{12} (e²/h, 0.0, 0.5, 1.0)
  hallConductanceMicroSiemens: number;      // 絕對電導 (μS)
  majoranaDecouplingRatio: number;          // 狄拉克費米子解離為馬約拉納度 (0.0 ~ 1.0)
  thermalHallConductanceCentralC: number;   // 拓撲熱霍爾中心荷 c (0.0, 0.5, 1.0)
  braidingFidelityRatio: number;            // 非阿貝爾幾何編織保真度 (0.95 ~ 0.999)
  accumulatedMajoranaEventsCount: number;   // 累計手性馬約拉納傳輸週期
  telemetryHistory: Array<{
    timestamp: number;
    exchangeM: number;
    conductance: number;
    decoupling: number;
  }>;
}

const STORAGE_KEY = 'newworld_chiral_majorana_qah_state_v1';
const CONDUCTANCE_QUANTUM_US = 38.74045; // e²/h in μS

class ChiralMajoranaFermionEngine {
  private state: ChiralMajoranaState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): ChiralMajoranaState {
    return {
      exchangeFieldMev: 1.55,               // M ≈ Δ₀
      superconductingPairGapMev: 1.50,      // Δ₀ = 1.50 meV
      chemicalPotentialUev: 0.0,            // μ = 0
      magneticFieldTesla: 0.85,             // 0.85 T
      regime: 'half-quantized-chiral-majorana-plateau',
      hallConductanceE2OverH: 0.5,          // 0.5 e²/h 精確半整數平台
      hallConductanceMicroSiemens: 19.37,   // ~ 19.37 μS
      majoranaDecouplingRatio: 0.98,
      thermalHallConductanceCentralC: 0.5,  // c = 1/2
      braidingFidelityRatio: 0.996,
      accumulatedMajoranaEventsCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): ChiralMajoranaState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.getDefaultState(),
            ...parsed,
            telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
          };
        }
      }
    } catch (e) {
      console.warn('[ChiralMajoranaEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[ChiralMajoranaEngine] 儲存失敗', e);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * 播放半整數霍爾電導躍遷雙音 (Half-Quantized Majorana Doublet Step)
   */
  public playHalfQuantizedStepTone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.linearRampToValueAtTime(880.0, ctx.currentTime + 0.22); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('[ChiralMajoranaEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放手性非阿貝爾編織諧波 (Non-Abelian Braiding Resonance)
   */
  public playMajoranaBraidingHarmonic(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(1100, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.28);
      osc2.stop(ctx.currentTime + 0.28);
    } catch (e) {
      console.warn('[ChiralMajoranaEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算手性馬約拉納能隙比、電導平台與熱霍爾中心荷
   */
  public recalculatePhysics(): void {
    const M = Math.max(0.0, this.state.exchangeFieldMev);
    const delta0 = Math.max(0.1, this.state.superconductingPairGapMev);
    const mu = this.state.chemicalPotentialUev * 1e-3; // 转为 meV

    // 拓撲臨界相變點 M_crit = \sqrt{\Delta_0^2 + \mu^2}
    const mCrit = Math.sqrt(Math.pow(delta0, 2) + Math.pow(mu, 2));
    const deltaDiff = Math.abs(M - mCrit);

    // 1. 解離度 (Decoupling Ratio): 當 M 接近 mCrit 時解離達到峰值
    const decoupling = Math.exp(-Math.pow(deltaDiff / 0.45, 2));
    this.state.majoranaDecouplingRatio = Number(decoupling.toFixed(3));

    // 2. 霍爾電導平台演算
    // M << delta0: 0 e²/h (平庸超導)
    // M \approx delta0: 0.5 e²/h (手性馬約拉納平台)
    // M >> delta0: 1.0 e²/h (整數量子反常霍爾狄拉克態)
    let gRatio = 0.5;
    let centralC = 0.5;

    if (M < mCrit - 0.45) {
      gRatio = 0.0;
      centralC = 0.0;
      this.state.regime = 'trivial-superconducting-gap';
    } else if (M > mCrit + 0.65) {
      gRatio = 1.0;
      centralC = 1.0;
      this.state.regime = 'integer-qah-chiral-dirac-mode';
    } else {
      gRatio = 0.5;
      centralC = 0.5;
      if (this.state.braidingFidelityRatio > 0.99) {
        this.state.regime = 'half-quantized-chiral-majorana-plateau';
      } else {
        this.state.regime = 'non-abelian-majorana-braiding-active';
      }
    }

    this.state.hallConductanceE2OverH = gRatio;
    this.state.thermalHallConductanceCentralC = centralC;
    this.state.hallConductanceMicroSiemens = Number((gRatio * CONDUCTANCE_QUANTUM_US).toFixed(2));

    // 3. 非阿貝爾編織保真度 (Fidelity)
    const fidelity = 0.998 - 0.03 * Math.min(1.0, deltaDiff);
    this.state.braidingFidelityRatio = Number(fidelity.toFixed(3));
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime === 'half-quantized-chiral-majorana-plateau' || this.state.regime === 'non-abelian-majorana-braiding-active') {
      this.state.accumulatedMajoranaEventsCount += Math.floor(deltaSeconds * 4);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        exchangeM: this.state.exchangeFieldMev,
        conductance: this.state.hallConductanceE2OverH,
        decoupling: this.state.majoranaDecouplingRatio
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setExchangeField(mev: number): void {
    this.state.exchangeFieldMev = Math.max(0.0, Math.min(4.5, mev));
    this.recalculatePhysics();
    this.saveState();
  }

  public setSuperconductingGap(mev: number): void {
    this.state.superconductingPairGapMev = Math.max(0.2, Math.min(3.0, mev));
    this.recalculatePhysics();
    this.saveState();
  }

  public setChemicalPotential(uev: number): void {
    this.state.chemicalPotentialUev = Math.max(-500.0, Math.min(500.0, uev));
    this.recalculatePhysics();
    this.saveState();
  }

  public setMagneticField(tesla: number): void {
    this.state.magneticFieldTesla = Math.max(0.0, Math.min(2.5, tesla));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發手性馬約拉納半整數電導平台共振 (Trigger Chiral Majorana Half Plateau)
   */
  public triggerMajoranaPlateau(): void {
    this.state.exchangeFieldMev = 1.50;
    this.state.superconductingPairGapMev = 1.50;
    this.state.chemicalPotentialUev = 0.0;
    this.state.accumulatedMajoranaEventsCount += 100;
    this.state.regime = 'half-quantized-chiral-majorana-plateau';
    this.recalculatePhysics();
    this.playHalfQuantizedStepTone();
    this.playMajoranaBraidingHarmonic();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: ChiralMajoranaRegime[] = [
      'integer-qah-chiral-dirac-mode',
      'half-quantized-chiral-majorana-plateau',
      'trivial-superconducting-gap',
      'non-abelian-majorana-braiding-active'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];

    if (this.state.regime === 'integer-qah-chiral-dirac-mode') {
      this.state.exchangeFieldMev = 3.2;
      this.state.superconductingPairGapMev = 1.0;
      this.playHalfQuantizedStepTone();
    } else if (this.state.regime === 'half-quantized-chiral-majorana-plateau') {
      this.triggerMajoranaPlateau();
      return;
    } else if (this.state.regime === 'trivial-superconducting-gap') {
      this.state.exchangeFieldMev = 0.4;
      this.state.superconductingPairGapMev = 2.0;
    } else {
      this.state.exchangeFieldMev = 1.55;
      this.state.superconductingPairGapMev = 1.50;
      this.playMajoranaBraidingHarmonic();
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<ChiralMajoranaState> {
    return this.state;
  }
}

export const chiralMajoranaEngine = new ChiralMajoranaFermionEngine();
