/**
 * 量子反常分數霍爾效應與莫爾平帶分數量子化反應堆 (Fractional Quantum Anomalous Hall & Moiré Flat-Band Anyon Reactor)
 *
 * 核心物理理論：
 * 1. 零磁場分數量子反常霍爾效應 (Zero-Field FQAH Effect)：
 *    在扭轉雙層過渡金屬二硫屬化物 (如 tMoTe2, \theta \sim 2.1^\circ ~ 3.8^\circ) 中，
 *    莫爾超晶格形成的微能隙超平帶具備非零陳數 (C = \pm 1) 與高均勻性貝里曲率分佈。
 *    強庫侖相互作用 (U/W \gg 1) 在完全無外加磁場條件下自發破缺時間反演對稱性，
 *    並於特定分數填充因子 \nu = -2/3, -3/5, -1/3 湧現不可壓縮拓撲量子流體。
 * 2. 分數量子化電導與 Laughlin 分數電荷準粒子：
 *    霍爾電導精確量子化為分數量子階躍：
 *    \sigma_{xy} = \nu \frac{e^2}{h}，
 *    基態激發具有局域分數電荷 e^* = e/3 或 e/5 之勞夫林準粒子 (Laughlin Anyons)。
 * 3. 量子度規均勻性 (Quantum Metric Uniformity & Ideal Chern Bands)：
 *    當富比尼-施圖迪 (Fubini-Study) 量子度規 g_{\mu\nu}(\mathbf{k}) 與貝里曲率 \Omega(\mathbf{k})
 *    滿足凱勒流形條件 \det(g) = \frac{1}{4} \Omega^2 時，平帶達到理想陳帶極限，
 *    分數量子霍爾態具備最強拓撲保護能隙 \Delta_{\text{FQAH}} \sim 0.1 \frac{e^2}{\epsilon L_M}。
 */

export type FQAHRegime =
  | 'fractional-anyon-laughlin'    // 分數量子反常霍爾 Laughlin 任意子態 (nu = -2/3, -1/3)
  | 'composite-fermi-liquid'       // 零磁場複合費米液體金屬態 (nu = -1/2)
  | 'non-abelian-moore-read'       // 非阿貝爾 Moore-Read 普法芬態 (nu = -5/2)
  | 'wigner-crystal-charge-order';  // 莫爾超晶格電荷有序維格納晶體態

export interface FractionalAnomalousHallState {
  moiréTwistAngleDeg: number;       // 莫爾扭轉角 \theta (度, 1.2 ~ 4.5)
  fillingFactorNu: number;          // 分數填充因子 \nu (-0.9 ~ -0.1)
  displacementFieldMvNm: number;    // 垂直位移電場 D (mV/nm, 0.0 ~ 50.0)
  interactionStrengthUOverW: number;// 庫侖相互作用能與平帶帶寬比 U/W (1.0 ~ 15.0)
  temperatureKelvin: number;        // 操作溫度 T (K, 0.01 ~ 10.0)
  regime: FQAHRegime;
  // 動態演算物理指標
  fractionalConductanceE2H: number; // 霍爾電導率 \sigma_{xy} / (e^2/h)
  quasiParticleChargeFraction: number; // 準粒子有效分數電荷 e^* / e (如 1/3, 1/5)
  topologicalGapMev: number;        // 拓撲分數量子能隙 \Delta_FQAH (meV)
  berryCurvatureUniformity: number; // 貝里曲率均勻係數 (0.0 ~ 1.0, 越大越均勻)
  quantumMetricDeterminant: number; // 量子度規行列式 \det(g)
  chiralEdgeCurrentNanoAmp: number; // 無耗散分數手性邊緣電流 (nA)
  incompressibleFluidDensity: number; // 不可壓縮量子流體凝結度 (0.0 ~ 1.0)
  telemetryHistory: Array<{
    timestamp: number;
    conductance: number;
    gapMev: number;
    edgeCurrent: number;
  }>;
}

const STORAGE_KEY = 'newworld_fqah_reactor_state_v1';

class FractionalAnomalousHallEngine {
  private state: FractionalAnomalousHallState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): FractionalAnomalousHallState {
    return {
      moiréTwistAngleDeg: 2.15,
      fillingFactorNu: -0.667, // -2/3
      displacementFieldMvNm: 18.5,
      interactionStrengthUOverW: 8.4,
      temperatureKelvin: 0.25,
      regime: 'fractional-anyon-laughlin',
      fractionalConductanceE2H: 0.667,
      quasiParticleChargeFraction: 0.333,
      topologicalGapMev: 4.85,
      berryCurvatureUniformity: 0.88,
      quantumMetricDeterminant: 0.76,
      chiralEdgeCurrentNanoAmp: 142.0,
      incompressibleFluidDensity: 0.94,
      telemetryHistory: []
    };
  }

  private loadState(): FractionalAnomalousHallState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
        };
      }
    } catch {
      // 降級取預設值
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 略過儲存異常
    }
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.saveState();
  }

  public getState(): Readonly<FractionalAnomalousHallState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<FractionalAnomalousHallState,
    'moiréTwistAngleDeg' | 'fillingFactorNu' | 'displacementFieldMvNm' | 'interactionStrengthUOverW' | 'temperatureKelvin' | 'regime'
  >>): void {
    if (params.moiréTwistAngleDeg !== undefined) {
      this.state.moiréTwistAngleDeg = Math.max(1.2, Math.min(4.5, params.moiréTwistAngleDeg));
    }
    if (params.fillingFactorNu !== undefined) {
      this.state.fillingFactorNu = Math.max(-0.95, Math.min(-0.05, params.fillingFactorNu));
    }
    if (params.displacementFieldMvNm !== undefined) {
      this.state.displacementFieldMvNm = Math.max(0.0, Math.min(50.0, params.displacementFieldMvNm));
    }
    if (params.interactionStrengthUOverW !== undefined) {
      this.state.interactionStrengthUOverW = Math.max(1.0, Math.min(15.0, params.interactionStrengthUOverW));
    }
    if (params.temperatureKelvin !== undefined) {
      this.state.temperatureKelvin = Math.max(0.01, Math.min(10.0, params.temperatureKelvin));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public injectLaughlinQuasiParticle(): void {
    this.playFQAHSound(740, 0.35, 'sine');
    this.state.chiralEdgeCurrentNanoAmp += 35.0;
    this.recomputePhysics();
    this.saveState();
  }

  public cycleFillingFraction(): void {
    this.playFQAHSound(520, 0.45, 'triangle');
    const fractions = [-0.667, -0.600, -0.333, -0.500]; // -2/3, -3/5, -1/3, -1/2
    const currentIdx = fractions.findIndex(f => Math.abs(f - this.state.fillingFactorNu) < 0.04);
    const nextIdx = (currentIdx + 1) % fractions.length;
    this.state.fillingFactorNu = fractions[nextIdx];
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 邊緣電流隨微觀耗散緩慢恢復穩定基準
    const nominalCurrent = Math.abs(this.state.fractionalConductanceE2H) * 165.0;
    const decay = Math.exp(-delta * 0.4);
    this.state.chiralEdgeCurrentNanoAmp = nominalCurrent + (this.state.chiralEdgeCurrentNanoAmp - nominalCurrent) * decay;

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        conductance: Number(this.state.fractionalConductanceE2H.toFixed(3)),
        gapMev: Number(this.state.topologicalGapMev.toFixed(2)),
        edgeCurrent: Number(this.state.chiralEdgeCurrentNanoAmp.toFixed(1))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const theta = this.state.moiréTwistAngleDeg;
    const nu = this.state.fillingFactorNu;
    const dField = this.state.displacementFieldMvNm;
    const uOverW = this.state.interactionStrengthUOverW;
    const t = this.state.temperatureKelvin;

    // 莫爾波長 L_M \approx a / (2 \sin(\theta/2))
    const moiréWavelengthNm = 0.352 / (2.0 * Math.sin(((theta * Math.PI) / 180) / 2.0));

    // 貝里曲率均勻係數：隨位移場 D 與扭角協調增長
    const optAngleDist = Math.abs(theta - 2.15);
    const anglePenalty = Math.exp(-optAngleDist * 1.5);
    const dFieldFactor = 1.0 - 0.012 * Math.abs(dField - 20.0);
    this.state.berryCurvatureUniformity = Number(Math.max(0.1, Math.min(0.98, anglePenalty * dFieldFactor)).toFixed(2));

    // 凱勒條件量子度規決定度 det(g)
    this.state.quantumMetricDeterminant = Number((0.6 + 0.35 * this.state.berryCurvatureUniformity).toFixed(2));

    // 判斷不同填充數之分數量子化電導與準粒子電荷
    if (Math.abs(nu - (-0.667)) < 0.04) {
      // \nu = -2/3
      this.state.fractionalConductanceE2H = 0.667;
      this.state.quasiParticleChargeFraction = 0.333; // e/3
    } else if (Math.abs(nu - (-0.600)) < 0.04) {
      // \nu = -3/5
      this.state.fractionalConductanceE2H = 0.600;
      this.state.quasiParticleChargeFraction = 0.200; // e/5
    } else if (Math.abs(nu - (-0.333)) < 0.04) {
      // \nu = -1/3
      this.state.fractionalConductanceE2H = 0.333;
      this.state.quasiParticleChargeFraction = 0.333; // e/3
    } else if (Math.abs(nu - (-0.500)) < 0.04) {
      // 複合費米液體金屬態
      this.state.fractionalConductanceE2H = 0.500;
      this.state.quasiParticleChargeFraction = 0.0;
    } else {
      this.state.fractionalConductanceE2H = Number(Math.abs(nu).toFixed(3));
      this.state.quasiParticleChargeFraction = 0.333;
    }

    // 拓撲能隙 \Delta_FQAH \propto (U/W) * (1 / L_M) * \exp(-T / T_c)
    const baseGap = (uOverW * 0.85) * (10.0 / moiréWavelengthNm) * this.state.berryCurvatureUniformity;
    const thermalDepress = Math.exp(-t / 1.8);
    const finalGap = baseGap * thermalDepress;
    this.state.topologicalGapMev = Number(Math.max(0.05, Math.min(12.0, finalGap)).toFixed(2));

    // 不可壓縮量子流體凝結度
    if (this.state.regime === 'composite-fermi-liquid') {
      this.state.incompressibleFluidDensity = 0.15;
    } else if (this.state.regime === 'wigner-crystal-charge-order') {
      this.state.incompressibleFluidDensity = 0.05;
      this.state.fractionalConductanceE2H = 0.0;
    } else {
      this.state.incompressibleFluidDensity = Number(Math.min(0.99, (this.state.topologicalGapMev / 6.0)).toFixed(2));
    }
  }

  private initAudioContext(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playFQAHSound(freq: number, duration: number, type: OscillatorType): void {
    try {
      this.initAudioContext();
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.045, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 略過 Web Audio 異常
    }
  }
}

export const fractionalAnomalousHallEngine = new FractionalAnomalousHallEngine();
export const fqahEngine = fractionalAnomalousHallEngine;
