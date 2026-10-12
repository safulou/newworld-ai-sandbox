/**
 * 拓撲分數量子自旋液體與基塔耶夫蜂巢晶格反應堆 (Topological Fractional Quantum Spin Liquid & Kitaev Honeycomb Reactor)
 *
 * 核心物理理論：
 * 1. 基塔耶夫蜂巢晶格模型 (Kitaev Honeycomb Model)：
 *    在二維蜂巢晶格中，三個鍵向具有強烈的鍵各向異性伊辛超交換相互作用：
 *    H = -J_x \sum_{x-link} \sigma_i^x \sigma_j^x - J_y \sum_{y-link} \sigma_i^y \sigma_j^y - J_z \sum_{z-link} \sigma_i^z \sigma_j^z。
 * 2. 自旋分數化與馬約拉納費米子 (Spin Fractionalization & Majorana Fermions)：
 *    自旋算符精確分數化為游走馬約拉納費米子 c_i 與靜態 \mathbb{Z}_2 規範通量場 u_{jk} = i b_j^\alpha b_k^\alpha = \pm 1；
 *    六角面規範不變通量算符 W_p = \prod_{p} \sigma^\alpha = \pm 1 激發具有限能隙的 \mathbb{Z}_2 磁通渦旋 (Visons)。
 * 3. 非阿貝爾任意子與量子化半整數熱霍爾電導 (Non-Abelian Ising Anyons & Half-Quantized Thermal Hall Effect)：
 *    外加磁場 \mathbf{B} 破缺時間反演對稱性，誘導有效三自旋擾動項 \kappa \propto B_x B_y B_z / \Delta^2，
 *    打開拓撲能隙並賦予非零陳數 C = \pm 1；游走馬約拉納模成為手性格拉斯曼流，
 *    \mathbb{Z}_2 渦旋核束縛馬約拉納零能模，轉化為具備量子維度 d = \sqrt{2} 的非阿貝爾伊辛任意子 (\sigma \times \sigma = 1 + \psi)；
 *    其邊界熱霍爾電導精確量子化為：
 *    K_{xy} = \frac{1}{2} \left( \frac{\pi^2 k_B^2}{3h} T \right)，中心荷 c = 1/2。
 */

export type SpinLiquidRegime =
  | 'non-abelian-ising'     // 非阿貝爾伊辛任意子手性拓撲相 (C = ±1)
  | 'gapless-majorana-metal' // 無能隙馬約拉納費米狄拉克半金屬相
  | 'toric-code-abelian'     // 阿貝爾 Z2 拓撲環面編碼相 (Jx,Jy << Jz)
  | 'flux-vison-crystal';    // 緻密 Vison 磁通晶格激發相

export interface FractionalSpinLiquidState {
  exchangeJxMev: number;        // X 鍵基塔耶夫交換能量 J_x (meV, 1.0 ~ 20.0)
  exchangeJyMev: number;        // Y 鍵基塔耶夫交換能量 J_y (meV, 1.0 ~ 20.0)
  exchangeJzMev: number;        // Z 鍵基塔耶夫交換能量 J_z (meV, 1.0 ~ 20.0)
  magneticFieldTesla: number;   // 外加磁場 B_xyz (T, 0.0 ~ 10.0)
  temperatureKelvin: number;    // 操作溫度 T (K, 0.01 ~ 15.0)
  regime: SpinLiquidRegime;
  // 動態演算物理指標
  majoranaBandgapMev: number;   // 馬約拉納拓撲能隙 \Delta_M (meV)
  visonFluxGapMev: number;      // \mathbb{Z}_2 磁通渦旋能隙 \Delta_v (meV)
  thermalHallConductanceRatio: number; // 量子化熱霍爾電導比率 K_xy / K_0 (目標 0.50)
  topologicalEntanglementEntropy: number; // 拓撲糾纏熵 \gamma = \ln 2 \approx 0.693
  visonDensityPerPlaquette: number; // 單位面平均 Vison 密度 (0 ~ 1)
  anyonBraidingPhaseDeg: number; // 任意子編織幾何 Berry 相位 (度)
  telemetryHistory: Array<{
    timestamp: number;
    bandgap: number;
    thermalHallRatio: number;
    visonDensity: number;
  }>;
}

const STORAGE_KEY = 'newworld_spin_liquid_state_v1';

class FractionalSpinLiquidEngine {
  private state: FractionalSpinLiquidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): FractionalSpinLiquidState {
    return {
      exchangeJxMev: 8.5,
      exchangeJyMev: 8.5,
      exchangeJzMev: 8.5,
      magneticFieldTesla: 3.8,
      temperatureKelvin: 0.8,
      regime: 'non-abelian-ising',
      majoranaBandgapMev: 2.14,
      visonFluxGapMev: 1.28,
      thermalHallConductanceRatio: 0.50,
      topologicalEntanglementEntropy: 0.693,
      visonDensityPerPlaquette: 0.08,
      anyonBraidingPhaseDeg: 90.0,
      telemetryHistory: []
    };
  }

  private loadState(): FractionalSpinLiquidState {
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

  public getState(): Readonly<FractionalSpinLiquidState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<FractionalSpinLiquidState,
    'exchangeJxMev' | 'exchangeJyMev' | 'exchangeJzMev' | 'magneticFieldTesla' | 'temperatureKelvin' | 'regime'
  >>): void {
    if (params.exchangeJxMev !== undefined) {
      this.state.exchangeJxMev = Math.max(1.0, Math.min(20.0, params.exchangeJxMev));
    }
    if (params.exchangeJyMev !== undefined) {
      this.state.exchangeJyMev = Math.max(1.0, Math.min(20.0, params.exchangeJyMev));
    }
    if (params.exchangeJzMev !== undefined) {
      this.state.exchangeJzMev = Math.max(1.0, Math.min(20.0, params.exchangeJzMev));
    }
    if (params.magneticFieldTesla !== undefined) {
      this.state.magneticFieldTesla = Math.max(0.0, Math.min(10.0, params.magneticFieldTesla));
    }
    if (params.temperatureKelvin !== undefined) {
      this.state.temperatureKelvin = Math.max(0.01, Math.min(15.0, params.temperatureKelvin));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
      if (params.regime === 'flux-vison-crystal') {
        this.state.visonDensityPerPlaquette = Math.max(0.65, this.state.visonDensityPerPlaquette);
      }
    }
    this.recomputePhysics();
    this.saveState();
  }

  public injectVisonVortex(): void {
    this.playSpinLiquidSound(620, 0.35, 'triangle');
    this.state.visonDensityPerPlaquette = Math.min(0.85, this.state.visonDensityPerPlaquette + 0.15);
    this.recomputePhysics();
    this.saveState();
  }

  public braidIsingAnyonPair(): void {
    this.playSpinLiquidSound(880, 0.45, 'sine');
    this.state.anyonBraidingPhaseDeg = (this.state.anyonBraidingPhaseDeg + 90.0) % 360.0;
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 弛豫多餘 Vison 密度回到熱平衡態
    const equilibriumVison = 0.05 + 0.03 * Math.tanh(this.state.temperatureKelvin / 3.0);
    const decay = Math.exp(-delta * 0.5);
    this.state.visonDensityPerPlaquette = equilibriumVison + (this.state.visonDensityPerPlaquette - equilibriumVison) * decay;

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        bandgap: Number(this.state.majoranaBandgapMev.toFixed(2)),
        thermalHallRatio: Number(this.state.thermalHallConductanceRatio.toFixed(3)),
        visonDensity: Number(this.state.visonDensityPerPlaquette.toFixed(3))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const jx = this.state.exchangeJxMev;
    const jy = this.state.exchangeJyMev;
    const jz = this.state.exchangeJzMev;
    const b = this.state.magneticFieldTesla;
    const t = this.state.temperatureKelvin;

    // 平均交換能 J_avg 與各向異性
    const jAvg = (jx + jy + jz) / 3.0;
    const isAnisotropic = jz > (jx + jy) || jx > (jy + jz) || jy > (jx + jz);

    // 磁場破缺時間反演誘導之有效三自旋擾動項 \kappa \approx B^3 / J^2
    const kappa = (Math.pow(b, 2.5) * 0.08) / Math.max(1.0, jAvg);

    // 馬約拉納能隙
    if (b > 0.1 && !isAnisotropic) {
      this.state.majoranaBandgapMev = Number(Math.min(8.0, 3.0 * Math.sqrt(3) * kappa).toFixed(2));
    } else if (isAnisotropic) {
      this.state.majoranaBandgapMev = Number((Math.abs(jz - (jx + jy)) * 0.45).toFixed(2));
    } else {
      this.state.majoranaBandgapMev = 0.0;
    }

    // Vison 磁通渦旋能隙 \Delta_v \approx 0.15 * J_z
    this.state.visonFluxGapMev = Number((0.15 * jz * (1.0 - 0.05 * b)).toFixed(2));

    // 熱霍爾電導比率 K_xy / K_0 (非阿貝爾相嚴格鎖定近 0.50)
    if (this.state.regime === 'non-abelian-ising') {
      const thermalDev = 0.015 * Math.tanh(t / 2.0);
      this.state.thermalHallConductanceRatio = Number((0.50 - thermalDev).toFixed(3));
      this.state.topologicalEntanglementEntropy = 0.693; // \ln 2
    } else if (this.state.regime === 'toric-code-abelian') {
      this.state.thermalHallConductanceRatio = 0.0;
      this.state.topologicalEntanglementEntropy = 1.386; // 2 * \ln 2
    } else {
      this.state.thermalHallConductanceRatio = Number((0.15 * (b / 10.0)).toFixed(3));
      this.state.topologicalEntanglementEntropy = 0.35;
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

  private playSpinLiquidSound(freq: number, duration: number, type: OscillatorType): void {
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

export const fractionalSpinLiquidEngine = new FractionalSpinLiquidEngine();
export const spinLiquidEngine = fractionalSpinLiquidEngine;
