/**
 * 克爾黑洞極端光子球與事件視界全息陰影重構陣列 (Kerr Extremal Photon Sphere & Event Horizon Shadow Reconstruction Array)
 *
 * 核心物理理論：
 * 1. 克爾度規與零測地線卡特常數 (Carter Constant & Kerr Null Geodesics)：
 *    克爾黑洞自旋參數 a = J/M \in [0, M]，外事件視界 r_+ = M + \sqrt{M^2 - a^2}；
 *    光子運動滿足一階卡特方程式，守恆量包含能量 E、軸向角動量 L_z 與卡特常數 \mathcal{Q}；
 *    衝擊參數 \xi = L_z / E, \eta = \mathcal{Q} / E^2。
 * 2. 巴丁天球坐標與 D 型黑洞陰影 (Bardeen Celestial Coordinates & D-Shaped Shadow)：
 *    遠處觀測者（傾角 \theta_o）天球坐標平面上的黑洞陰影邊界由臨界曲線給出：
 *    \alpha = -\frac{\xi}{\sin\theta_o}, \quad \beta = \pm \sqrt{\eta + a^2\cos^2\theta_o - \xi^2\cot^2\theta_o}；
 *    極端自旋 a \to M 時，順行側光子軌道拖曳至 r_{\text{ph}}^- \to M，陰影呈現經典 D 型非對稱壓扁輪廓。
 * 3. 相對論光子環次環指數收斂 (Relativistic Photon Sub-rings & Lyapunov Exponent)：
 *    光子在光子球附近繞轉 n 次形成的次環寬度滿足指數衰減：
 *    w_n \approx w_0 e^{-n \gamma}，其中 \gamma 為束縛光子徑向李雅普諾夫指數 (Lyapunov Exponent)。
 */

export type KerrShadowRegime =
  | 'extremal-d-shadow'         // 極端自旋 D 型非對稱陰影相
  | 'photon-ring-multiloop'     // 多級相對論光子次環相
  | 'frame-dragging-ergosphere' // 能層參考系拖曳與彭羅斯發電相
  | 'shadow-asymmetry-metric';  // 幾何非對稱度規相

export interface KerrPhotonShadowState {
  kerrSpinParameterA: number;    // 無量綱自旋參數 a/M (0.0 ~ 0.998)
  blackHoleMassSolar: number;    // 黑洞質量 M (M_sun, 3.0 ~ 100.0)
  observerInclinationDeg: number;// 觀測傾角 \theta_o (0 ~ 89 度)
  accretionDiskRadiusRg: number; // 吸積盤半徑 R_disk / r_g (6.0 ~ 50.0)
  regime: KerrShadowRegime;
  // 動態演算物理指標
  shadowAreaRg2: number;         // 陰影幾何截面積 A_shadow / r_g^2
  shadowAsymmetryRatio: number;  // 陰影左右非對稱度 D_asym (0.0 ~ 1.0)
  outerHorizonRg: number;        // 外事件視界半徑 r_+ / r_g
  photonSphereProgradeRg: number;// 順行光子球半徑 r_ph^- / r_g
  photonSphereRetrogradeRg: number; // 逆行光子球半徑 r_ph^+ / r_g
  ergosphereBoundaryMaxRg: number;  // 能層赤道外半徑 (定值 2.0 r_g)
  lyapunovExponent: number;      // 光子環衰減李雅普諾夫指數 \gamma
  penroseExtractionPowerMw: number; // 能層彭羅斯萃取功率 (MW)
  telemetryHistory: Array<{
    timestamp: number;
    spin: number;
    shadowArea: number;
    asymmetry: number;
  }>;
}

const STORAGE_KEY = 'newworld_kerr_shadow_state_v1';

class KerrPhotonShadowEngine {
  private state: KerrPhotonShadowState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): KerrPhotonShadowState {
    return {
      kerrSpinParameterA: 0.94,
      blackHoleMassSolar: 24.0,
      observerInclinationDeg: 68.0,
      accretionDiskRadiusRg: 18.0,
      regime: 'extremal-d-shadow',
      shadowAreaRg2: 24.6,
      shadowAsymmetryRatio: 0.42,
      outerHorizonRg: 1.34,
      photonSphereProgradeRg: 1.45,
      photonSphereRetrogradeRg: 3.82,
      ergosphereBoundaryMaxRg: 2.0,
      lyapunovExponent: 2.15,
      penroseExtractionPowerMw: 1850.0,
      telemetryHistory: []
    };
  }

  private loadState(): KerrPhotonShadowState {
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

  public getState(): Readonly<KerrPhotonShadowState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<KerrPhotonShadowState,
    'kerrSpinParameterA' | 'blackHoleMassSolar' | 'observerInclinationDeg' | 'accretionDiskRadiusRg' | 'regime'
  >>): void {
    if (params.kerrSpinParameterA !== undefined) {
      this.state.kerrSpinParameterA = Math.max(0.0, Math.min(0.998, params.kerrSpinParameterA));
    }
    if (params.blackHoleMassSolar !== undefined) {
      this.state.blackHoleMassSolar = Math.max(3.0, Math.min(100.0, params.blackHoleMassSolar));
    }
    if (params.observerInclinationDeg !== undefined) {
      this.state.observerInclinationDeg = Math.max(0.0, Math.min(89.0, params.observerInclinationDeg));
    }
    if (params.accretionDiskRadiusRg !== undefined) {
      this.state.accretionDiskRadiusRg = Math.max(6.0, Math.min(50.0, params.accretionDiskRadiusRg));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public pulseErgosphereExtraction(): void {
    this.playKerrSound(320, 0.45, 'sawtooth');
    this.state.penroseExtractionPowerMw += 450.0;
    this.recomputePhysics();
    this.saveState();
  }

  public stepInclinationAngle(deltaDeg: number = 15.0): void {
    let nextInc = this.state.observerInclinationDeg + deltaDeg;
    if (nextInc > 89.0) nextInc = 5.0;
    this.state.observerInclinationDeg = Number(nextInc.toFixed(1));
    this.playKerrSound(580, 0.25, 'sine');
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 彭羅斯功率緩慢衰減至名義基準
    const nominalPower = 1200.0 + 800.0 * Math.pow(this.state.kerrSpinParameterA, 2);
    const decay = Math.exp(-delta * 0.4);
    this.state.penroseExtractionPowerMw = nominalPower + (this.state.penroseExtractionPowerMw - nominalPower) * decay;

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        spin: Number(this.state.kerrSpinParameterA.toFixed(3)),
        shadowArea: Number(this.state.shadowAreaRg2.toFixed(1)),
        asymmetry: Number(this.state.shadowAsymmetryRatio.toFixed(3))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const a = this.state.kerrSpinParameterA;
    const incRad = (this.state.observerInclinationDeg * Math.PI) / 180;

    // 外事件視界 r_+ = 1 + \sqrt{1 - a^2}
    const rPlus = 1.0 + Math.sqrt(Math.max(0.001, 1.0 - a * a));
    this.state.outerHorizonRg = Number(rPlus.toFixed(2));

    // 順行光子球 r_ph^- 與 逆行光子球 r_ph^+
    // r_ph^\pm = 2 [1 + \cos(\frac{2}{3} \arccos(\mp a))]
    const acosTerm1 = Math.acos(Math.max(-0.999, Math.min(0.999, a)));
    const acosTerm2 = Math.acos(Math.max(-0.999, Math.min(0.999, -a)));
    const rPhPro = 2.0 * (1.0 + Math.cos((2.0 / 3.0) * acosTerm1));
    const rPhRetro = 2.0 * (1.0 + Math.cos((2.0 / 3.0) * acosTerm2));
    this.state.photonSphereProgradeRg = Number(rPhPro.toFixed(2));
    this.state.photonSphereRetrogradeRg = Number(rPhRetro.toFixed(2));

    // 陰影幾何非對稱度 D_asym \propto a * \sin\theta_o
    const asym = a * Math.sin(incRad) * 0.45;
    this.state.shadowAsymmetryRatio = Number(asym.toFixed(3));

    // 陰影無量綱面積 A_shadow \approx \pi [ (3\sqrt{3})^2 - \delta(a, \theta) ]
    const standardArea = Math.PI * 27.0; // 史瓦西極限約 84.8
    const areaReduction = (6.2 * a * a + 4.5 * Math.sin(incRad)) * 0.8;
    this.state.shadowAreaRg2 = Number((standardArea * 0.32 - areaReduction).toFixed(1));

    // 李雅普諾夫指數 \gamma \approx \pi \sqrt{1 - a^2 / (2 r_ph^2)}
    const gamma = Math.PI * Math.sqrt(Math.max(0.2, 1.0 - (a * a) / (2.0 * rPhPro * rPhPro)));
    this.state.lyapunovExponent = Number(gamma.toFixed(2));
  }

  private initAudioContext(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playKerrSound(freq: number, duration: number, type: OscillatorType): void {
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

export const kerrPhotonShadowEngine = new KerrPhotonShadowEngine();
export const kerrShadowEngine = kerrPhotonShadowEngine;
