/**
 * 動態拓撲磁電效應軸子絕緣體諧振腔 (Dynamical Axion Insulator Resonator)
 *
 * 核心物理理論：
 * 1. 軸子電動力學與拓撲磁電效應 (Topological Magnetoelectric Effect, TME)：
 *    在反鐵磁拓撲絕緣體 (如偶數層 MnBi2Te4 薄膜) 中，體態軸子角被空間反演結合時間反演對稱性嚴格量子化為：
 *    \theta = \pi \pmod{2\pi}。
 *    作用量具有軸子拓撲項 \Delta \mathcal{L}_\theta = \frac{\theta \alpha}{4\pi^2} \mathbf{E}\cdot\mathbf{B}。
 *    上下相反磁化表面各自具備半整數量子化霍爾電導 \sigma_{xy}^{\text{top}} = -\sigma_{xy}^{\text{bottom}} = \frac{1}{2}\frac{e^2}{h}，
 *    使淨縱向電場感生拓撲磁化強度 \mathbf{M} = \frac{\alpha}{\pi}\frac{e^2}{h} \mathbf{E}。
 * 2. 動態軸子極化激元 (Dynamical Axion Polaritons)：
 *    反鐵磁奈爾向量動力學波動誘導軸子角動態微擾 \delta\theta(\mathbf{r}, t)，
 *    滿足波動方程式 (\nabla^2 - \frac{1}{c^2}\partial_t^2 - m_a^2)\delta\theta = \frac{\alpha}{\pi} \mathbf{E}\cdot\mathbf{B}。
 *    動態軸子場與微波/太赫茲諧振腔光子強烈雜化，形成抗雜散干擾之軸子極化激元，
 *    激發顯著的真空拉比劈裂 \Omega_{\text{Rabi}} \sim 2\text{--}8\text{ GHz}。
 * 3. 巨反常量子化法拉第與克爾效應：
 *    透射電磁波經歷量子化法拉第旋轉 \theta_F \approx \alpha \approx 1/137 \approx 0.418^\circ，
 *    反射光經歷巨克爾旋轉 \theta_K \approx \pi/2，成為太赫茲非互易拓撲光學隔離器。
 */

export type AxionInsulatorRegime =
  | 'quantized-tme-theta-pi'        // 量子化軸子角 \theta = \pi 磁電相
  | 'axion-polariton-hybrid'       // 動態軸子極化激元腔體雜化相
  | 'surface-half-hall-chiral'      // 上下表面相反半整數霍爾傳導相
  | 'canted-antiferro-crossover';   // 外場傾斜反鐵磁相變交叉相

export interface AxionInsulatorState {
  sampleLayerCount: number;         // 反鐵磁偶數層數 (2 ~ 12)
  magneticExchangeEnergyMev: number;// 反鐵磁交換能量 J_ex (meV, 5.0 ~ 40.0)
  cavityResonanceGhz: number;       // 腔體共振微波頻率 f_cav (GHz, 10.0 ~ 120.0)
  externalMagneticBiasTesla: number;// 外加垂直磁場 B_z (T, 0.0 ~ 8.0)
  temperatureKelvin: number;        // 腔體操作溫度 T (K, 0.01 ~ 30.0)
  regime: AxionInsulatorRegime;
  // 動態演算物理指標
  quantizedThetaRad: number;        // 軸子角 \theta (rad, 接近 \pi \approx 3.14159)
  magnetoelectricResponseAlpha: number; // 拓撲磁電係數 \alpha_tme / \alpha (接近 1.0)
  faradayRotationAngleDeg: number;  // 量子化法拉第旋轉角 \theta_F (度)
  kerrRotationAngleDeg: number;     // 表面克爾旋轉角 \theta_K (度)
  axionPolaritonRabiSplitGhz: number; // 軸子極化激元拉比劈裂 \Omega_R (GHz)
  surfaceDiracGapMev: number;       // 表面態狄拉克能隙 \Delta_D (meV)
  telemetryHistory: Array<{
    timestamp: number;
    thetaRad: number;
    faradayDeg: number;
    rabiSplitGhz: number;
  }>;
}

const STORAGE_KEY = 'newworld_axion_insulator_state_v1';

class AxionInsulatorResonatorEngine {
  private state: AxionInsulatorState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): AxionInsulatorState {
    return {
      sampleLayerCount: 6,
      magneticExchangeEnergyMev: 18.5,
      cavityResonanceGhz: 48.0,
      externalMagneticBiasTesla: 0.8,
      temperatureKelvin: 1.8,
      regime: 'quantized-tme-theta-pi',
      quantizedThetaRad: 3.141,
      magnetoelectricResponseAlpha: 0.998,
      faradayRotationAngleDeg: 0.418,
      kerrRotationAngleDeg: 88.5,
      axionPolaritonRabiSplitGhz: 5.4,
      surfaceDiracGapMev: 45.2,
      telemetryHistory: []
    };
  }

  private loadState(): AxionInsulatorState {
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

  public getState(): Readonly<AxionInsulatorState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<AxionInsulatorState,
    'sampleLayerCount' | 'magneticExchangeEnergyMev' | 'cavityResonanceGhz' | 'externalMagneticBiasTesla' | 'temperatureKelvin' | 'regime'
  >>): void {
    if (params.sampleLayerCount !== undefined) {
      // 約束為 2 ~ 12 偶數層
      const rounded = Math.round(params.sampleLayerCount / 2) * 2;
      this.state.sampleLayerCount = Math.max(2, Math.min(12, rounded));
    }
    if (params.magneticExchangeEnergyMev !== undefined) {
      this.state.magneticExchangeEnergyMev = Math.max(5.0, Math.min(40.0, params.magneticExchangeEnergyMev));
    }
    if (params.cavityResonanceGhz !== undefined) {
      this.state.cavityResonanceGhz = Math.max(10.0, Math.min(120.0, params.cavityResonanceGhz));
    }
    if (params.externalMagneticBiasTesla !== undefined) {
      this.state.externalMagneticBiasTesla = Math.max(0.0, Math.min(8.0, params.externalMagneticBiasTesla));
    }
    if (params.temperatureKelvin !== undefined) {
      this.state.temperatureKelvin = Math.max(0.01, Math.min(30.0, params.temperatureKelvin));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public pumpDynamicalAxionWave(): void {
    this.playAxionSound(830, 0.35, 'sine');
    this.state.axionPolaritonRabiSplitGhz = Number(Math.min(25.0, this.state.axionPolaritonRabiSplitGhz + 2.5).toFixed(2));
    this.saveState();
  }

  public toggleLayerParity(): void {
    this.playAxionSound(560, 0.45, 'triangle');
    let nextLayer = this.state.sampleLayerCount + 2;
    if (nextLayer > 12) nextLayer = 2;
    this.state.sampleLayerCount = nextLayer;
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 拉比劈裂緩慢隨光子耗散衰減至名義基準
    const couplingTerm = Math.sqrt(this.state.cavityResonanceGhz) * (this.state.magneticExchangeEnergyMev / 20.0);
    const nominalSplit = Math.max(1.5, Math.min(18.0, couplingTerm * 0.78));
    const decay = Math.exp(-delta * 0.4);
    this.state.axionPolaritonRabiSplitGhz = Number(
      (nominalSplit + (this.state.axionPolaritonRabiSplitGhz - nominalSplit) * decay).toFixed(2)
    );

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        thetaRad: Number(this.state.quantizedThetaRad.toFixed(3)),
        faradayDeg: Number(this.state.faradayRotationAngleDeg.toFixed(3)),
        rabiSplitGhz: Number(this.state.axionPolaritonRabiSplitGhz.toFixed(2))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const layers = this.state.sampleLayerCount;
    const jEx = this.state.magneticExchangeEnergyMev;
    const bField = this.state.externalMagneticBiasTesla;
    const t = this.state.temperatureKelvin;

    // 奈爾溫度 T_N \approx 25.0 K (隨交換能增長)
    const neelTemp = 18.0 + 0.35 * jEx;

    // 軸子角 \theta: 在 T < T_N 且偶數層反鐵磁下精確鎖定 \pi
    if (t < neelTemp && bField < 6.0) {
      const thermalFluct = 0.03 * (t / neelTemp);
      const bTilt = 0.02 * (bField / 6.0);
      this.state.quantizedThetaRad = Number((Math.PI - thermalFluct - bTilt).toFixed(3));
      this.state.magnetoelectricResponseAlpha = Number((1.0 - 0.05 * (t / neelTemp)).toFixed(3));
    } else {
      // 進入傾斜鐵磁相或順磁相
      this.state.quantizedThetaRad = Number((Math.PI * (neelTemp / Math.max(neelTemp, t))).toFixed(3));
      this.state.magnetoelectricResponseAlpha = Number((0.45 * Math.tanh(neelTemp / t)).toFixed(3));
    }

    // 表面狄拉克能隙 \Delta_D \propto J_ex * \sqrt{layers}
    const baseGap = (jEx * 1.8) * Math.sqrt(layers / 6.0) * (1.0 - t / (neelTemp + 5.0));
    this.state.surfaceDiracGapMev = Number(Math.max(1.0, baseGap).toFixed(1));

    // 量子化法拉第旋轉角 \theta_F \approx \alpha * \alpha_{tme} = 0.418^\circ
    const thetaF = 0.418 * this.state.magnetoelectricResponseAlpha;
    this.state.faradayRotationAngleDeg = Number(thetaF.toFixed(3));

    // 克爾角 \theta_K \to 90^\circ (巨反常旋轉)
    const kerr = 89.2 * this.state.magnetoelectricResponseAlpha;
    this.state.kerrRotationAngleDeg = Number(Math.min(89.9, kerr).toFixed(1));

    // 軸子極化激元拉比劈裂邊界約束
    this.state.axionPolaritonRabiSplitGhz = Number(Math.max(1.5, Math.min(25.0, this.state.axionPolaritonRabiSplitGhz)).toFixed(2));
  }

  private initAudioContext(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playAxionSound(freq: number, duration: number, type: OscillatorType): void {
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

export const axionInsulatorResonatorEngine = new AxionInsulatorResonatorEngine();
export const axionResonatorEngine = axionInsulatorResonatorEngine;
