/**
 * AdS_4/CFT_3 拓撲引力外爾半金屬全息量子臨界流體引擎
 * (Holographic Weyl Semimetal Quantum Critical Fluid Engine)
 *
 * 核心物理理論：
 * 1. AdS_4/CFT_3 全息對偶與愛因斯坦-麥克斯韋-陳-西蒙斯 (EMCS) 引力：
 *    在五維或四維反德西特 (AdS) 體空間黑洞背景中引入軸向規範場與陳-西蒙斯拓撲項
 *    S_{\text{CS}} \propto \int A \wedge F \wedge F。體空間軸向規範場分裂對偶於
 *    邊界 CFT_3 上具有手性外爾錐節點分離 \mathbf{b} 之強關聯外爾半金屬。
 * 2. 科夫通-松-斯塔里涅茨 (KSS) 宇宙最小剪切黏滯極限：
 *    在強耦合無準粒子量子臨界點，全息流體之剪切黏滯係數 \eta 與熵密度 s 之比
 *    嚴格飽和著名之 KSS 邊界：
 *    \frac{\eta}{s} = \frac{\hbar}{4\pi k_B} \approx 0.0796，
 *    展現大自然已知最光滑、流動阻力最低之「近完美量子流體」(Nearly Perfect Fluid)。
 * 3. 量子臨界奇異金屬與普朗克極限耗散 (Planckian Dissipation)：
 *    無特徵尺度能量耗散速率達到不確定性原理極限 \tau_P^{-1} \sim \frac{k_B T}{\hbar}，
 *    導致電阻率展現嚴格線性隨溫度增加 \rho(T) \propto T。
 * 4. 全息反常霍爾傳導與手性渦度效應 (Chiral Vortical Effect)：
 *    體空間拓撲陳-西蒙斯項在邊界誘發無耗散反常霍爾電導 \sigma_{xy} \propto b，
 *    並於旋轉流體中產生沿旋渦方向流動之手性軸向電流。
 */

export type HoloWeylFluidRegime =
  | 'kss-minimal-viscosity-fluid'     // KSS 極限最小黏滯流態 (\eta/s = 1/(4\pi) 完美流動)
  | 'holographic-anomalous-hall'      // 全息拓撲反常霍爾流動相 (體陳-西蒙斯邊界傳導)
  | 'quantum-critical-strange-metal'  // 量子臨界奇異金屬散射相 (普朗克極限線性耗散)
  | 'axial-gravitational-anomaly';    // 軸向引力反常全息渦旋相 (量子引力混合渦度極化)

export interface HoloWeylFluidState {
  temperatureRatioTOverTc: number;    // 操作溫度比 T/T_c (0.05 ~ 5.0)
  axialNodeSeparationB: number;       // 體空間外爾節點動量分離 b (0.1 ~ 8.0)
  chemicalPotentialMu: number;        // 化學勢 \mu / T (0.0 ~ 12.0)
  chernSimonsCouplingAlpha: number;   // 全息陳-西蒙斯拓撲耦合強度 \alpha (0.1 ~ 5.0)
  adsCurvatureRadiusL: number;        // AdS 空間曲率半徑 L (1.0 ~ 20.0)
  regime: HoloWeylFluidRegime;

  // 動態演算物理指標
  viscosityToEntropyRatioEtaOverS: number; // 剪切黏滯與熵密度比 \eta/s (理想為 0.0796 = 1/4\pi)
  anomalousHallConductanceE2H: number;    // 全息反常霍爾電導率 \sigma_{xy} (e^2/h)
  planckianDissipationRateThz: number;    // 普朗克弛豫耗散速率 \tau_P^{-1} (THz)
  chiralVorticalConductivityCv: number;   // 手性渦度反常導率 C_V
  quantumEntropyDensity: number;          // 視界黑洞全息熵密度 s
  telemetryHistory: Array<{
    timestamp: number;
    etaOverS: number;
    hallConductance: number;
    dissipationThz: number;
  }>;
}

const STORAGE_KEY = 'newworld_holo_weyl_fluid_state_v1';

class HolographicWeylFluidEngine {
  private state: HoloWeylFluidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): HoloWeylFluidState {
    return {
      temperatureRatioTOverTc: 1.15,
      axialNodeSeparationB: 3.2,
      chemicalPotentialMu: 1.8,
      chernSimonsCouplingAlpha: 1.45,
      adsCurvatureRadiusL: 5.0,
      regime: 'kss-minimal-viscosity-fluid',
      viscosityToEntropyRatioEtaOverS: 0.0796, // 1 / (4\pi)
      anomalousHallConductanceE2H: 1.85,
      planckianDissipationRateThz: 42.8,
      chiralVorticalConductivityCv: 0.68,
      quantumEntropyDensity: 84.5,
      telemetryHistory: []
    };
  }

  private loadState(): HoloWeylFluidState {
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
      // 降級取預設
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 略過儲存例外
    }
  }

  public getState(): HoloWeylFluidState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<HoloWeylFluidState, 'temperatureRatioTOverTc' | 'axialNodeSeparationB' | 'chemicalPotentialMu' | 'chernSimonsCouplingAlpha' | 'adsCurvatureRadiusL' | 'regime'>>): void {
    if (params.temperatureRatioTOverTc !== undefined) {
      this.state.temperatureRatioTOverTc = Math.max(0.05, Math.min(5.0, Number(params.temperatureRatioTOverTc)));
    }
    if (params.axialNodeSeparationB !== undefined) {
      this.state.axialNodeSeparationB = Math.max(0.1, Math.min(8.0, Number(params.axialNodeSeparationB)));
    }
    if (params.chemicalPotentialMu !== undefined) {
      this.state.chemicalPotentialMu = Math.max(0.0, Math.min(12.0, Number(params.chemicalPotentialMu)));
    }
    if (params.chernSimonsCouplingAlpha !== undefined) {
      this.state.chernSimonsCouplingAlpha = Math.max(0.1, Math.min(5.0, Number(params.chernSimonsCouplingAlpha)));
    }
    if (params.adsCurvatureRadiusL !== undefined) {
      this.state.adsCurvatureRadiusL = Math.max(1.0, Math.min(20.0, Number(params.adsCurvatureRadiusL)));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }

    this.recalculatePhysics();
    this.playTone();
    this.saveState();
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public pulseAxialAnomalyPacket(): void {
    // 注入一次軸向規範微擾激發反常霍爾脈衝
    this.state.anomalousHallConductanceE2H = Number((this.state.anomalousHallConductanceE2H + 0.35).toFixed(2));
    this.state.chiralVorticalConductivityCv = Number((this.state.chiralVorticalConductivityCv + 0.12).toFixed(2));
    this.playTone(739.99, 'triangle'); // F#5
    this.saveState();
  }

  public toggleKSSPrecision(): void {
    // 快速對齊至 KSS 嚴格理論界限
    this.state.viscosityToEntropyRatioEtaOverS = 0.0796;
    this.state.regime = 'kss-minimal-viscosity-fluid';
    this.recalculatePhysics();
    this.playTone(493.88, 'sine'); // B4
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { temperatureRatioTOverTc, axialNodeSeparationB, chemicalPotentialMu, chernSimonsCouplingAlpha, adsCurvatureRadiusL, regime } = this.state;

    // 1. KSS 黏滯-熵密度比 \eta/s (KSS 邊界為 1/(4\pi) \approx 0.079577)
    if (regime === 'kss-minimal-viscosity-fluid') {
      this.state.viscosityToEntropyRatioEtaOverS = 0.0796;
    } else {
      // 軸向外爾節點各向異性導致在垂直方向微幅偏離 KSS
      const deviation = (axialNodeSeparationB * 0.005) + (temperatureRatioTOverTc > 2.0 ? 0.012 : 0.002);
      this.state.viscosityToEntropyRatioEtaOverS = Number((0.0796 + deviation).toFixed(4));
    }

    // 2. 全息反常霍爾電導 \sigma_{xy} \propto \alpha * b
    const hallBase = chernSimonsCouplingAlpha * axialNodeSeparationB * 0.42;
    this.state.anomalousHallConductanceE2H = Number((hallBase * (1.0 + (regime === 'holographic-anomalous-hall' ? 0.45 : 0.0))).toFixed(3));

    // 3. 普朗克耗散速率 \tau_P^{-1} = k_B T / \hbar (THz)
    this.state.planckianDissipationRateThz = Number((38.0 * temperatureRatioTOverTc).toFixed(1));

    // 4. 手性渦度導率 C_V \propto \mu^2 + T^2
    const cvVal = (chemicalPotentialMu * 0.15 + temperatureRatioTOverTc * 0.22) * chernSimonsCouplingAlpha;
    this.state.chiralVorticalConductivityCv = Number(cvVal.toFixed(2));

    // 5. 全息黑洞視界熵密度 s \propto T^2 * L^2
    this.state.quantumEntropyDensity = Number((18.5 * (temperatureRatioTOverTc ** 2) * (adsCurvatureRadiusL * 0.6)).toFixed(1));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.cos(now * 0.0028) * 0.02;
    this.state.quantumEntropyDensity = Math.max(1.0, Number((this.state.quantumEntropyDensity + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        etaOverS: this.state.viscosityToEntropyRatioEtaOverS,
        hallConductance: this.state.anomalousHallConductanceE2H,
        dissipationThz: this.state.planckianDissipationRateThz
      });
      if (this.state.telemetryHistory.length > 25) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private initAudio(): void {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq = 415.3, type: OscillatorType = 'sine'): void { // G#4
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.36);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const holographicWeylFluidEngine = new HolographicWeylFluidEngine();
