/**
 * 莫爾平帶富比尼-斯特迪量子度規幾何超流反應堆
 * (Quantum Metric Superfluidity & Flat Band Geodesic Reactor)
 *
 * 核心物理理論：
 * 1. 常規 BCS 理論於平帶之崩潰與幾何超流 (Geometric Superfluid Weight)：
 *    在魔角扭轉雙層石墨烯 (MATBG) 等莫爾平帶系統中，費米速度 v_F \to 0、有效質量 m^* \to \infty。
 *    常規 BCS 超流剛度 D_s^{\text{BCS}} \propto n_s / m^* 趨近於零，無法解釋強超導電性。
 * 2. 富比尼-斯特迪量子度規 (Fubini-Study Quantum Metric g_{\mu\nu})：
 *    布洛赫波函數量子幾何張量 Q_{\mu\nu} = g_{\mu\nu} - \frac{i}{2} \Omega_{\mu\nu}。
 *    虛部為貝里曲率 \Omega_{\mu\nu}，實部為富比尼-斯特迪度規 g_{\mu\nu}。
 * 3. 幾何超流下界定理 (Geometric Bound on Superfluid Stiffness)：
 *    超流剛度嚴格由布里淵區量子度規之動量空間幾何積分給予下界：
 *    D_s \ge \frac{4e^2}{\hbar} \int_{\text{BZ}} \sqrt{\det g(\mathbf{k})} \, d^2\mathbf{k}。
 *    量子波函數的非平庸幾何擴展提供了庫珀對運動慣性，賦予平帶巨大的超流剛度與臨界電流 I_c。
 * 4. 莫爾超晶格反常軌道抗磁響應：
 *    非阿貝爾假自旋幾何相位產生巨反常軌道抗磁磁化率 \chi_{\text{dia}}。
 */

export type QuantumMetricRegime =
  | 'quantum-metric-geometric-superfluid' // 富比尼-斯特迪幾何度規超流主導相 (幾何剛度 D_s)
  | 'fubini-study-flat-band-bound'       // 量子度規理論下界飽和態 (D_s \ge 4e^2/\hbar \int g)
  | 'berry-curvature-anomalous-diamagnet'// 莫爾非阿貝爾反常軌道抗磁相
  | 'moire-pseudospin-texture-vortex';   // 莫爾假自旋紋理拓撲渦旋態

export interface QuantumMetricState {
  twistAngleDegrees: number;             // 莫爾扭轉角 \theta (度, 0.80 ~ 1.80, 魔角 1.08)
  quantumMetricIntegralG: number;        // 量子度規布里淵區積分 \int g d^2k (0.5 ~ 12.0)
  effectiveBandwidthWMev: number;        // 莫爾扁帶能寬 W (meV, 1.0 ~ 30.0)
  pairingPotentialUMev: number;          // 吸引相互作用能 U (meV, 2.0 ~ 40.0)
  carrierDensityE12Cm2: number;          // 載流子面密度 n_e (10^12 cm^-2, 0.1 ~ 8.0)
  regime: QuantumMetricRegime;

  // 動態演算物理指標
  geometricSuperfluidWeightDs: number;   // 幾何超流剛度 D_s^{geom} (meV)
  conventionalBcsWeightDs: number;       // 常規 BCS 超流剛度 D_s^{BCS} (meV)
  superfluidCriticalCurrentMicroAmp: number; // 臨界超電流 I_c (\mu A)
  orbitalDiamagneticSusceptibility: number;  // 軌道抗磁磁化率 \chi_dia (10^-5)
  geometricDominanceRatioPercent: number;// 幾何剛度佔比 (%)
  telemetryHistory: Array<{
    timestamp: number;
    dsGeom: number;
    dsBcs: number;
    criticalCurrent: number;
  }>;
}

const STORAGE_KEY = 'newworld_quantum_metric_superfluid_state_v1';

class QuantumMetricSuperfluidEngine {
  private state: QuantumMetricState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): QuantumMetricState {
    return {
      twistAngleDegrees: 1.08, // 魔角
      quantumMetricIntegralG: 5.6,
      effectiveBandwidthWMev: 3.5,
      pairingPotentialUMev: 18.0,
      carrierDensityE12Cm2: 2.4,
      regime: 'quantum-metric-geometric-superfluid',
      geometricSuperfluidWeightDs: 36.8,
      conventionalBcsWeightDs: 1.2, // 扁帶常規剛度極低
      superfluidCriticalCurrentMicroAmp: 84.5,
      orbitalDiamagneticSusceptibility: -14.2,
      geometricDominanceRatioPercent: 96.8,
      telemetryHistory: []
    };
  }

  private loadState(): QuantumMetricState {
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

  public getState(): QuantumMetricState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<QuantumMetricState, 'twistAngleDegrees' | 'quantumMetricIntegralG' | 'effectiveBandwidthWMev' | 'pairingPotentialUMev' | 'carrierDensityE12Cm2' | 'regime'>>): void {
    if (params.twistAngleDegrees !== undefined) {
      this.state.twistAngleDegrees = Math.max(0.8, Math.min(1.8, Number(params.twistAngleDegrees)));
    }
    if (params.quantumMetricIntegralG !== undefined) {
      this.state.quantumMetricIntegralG = Math.max(0.5, Math.min(12.0, Number(params.quantumMetricIntegralG)));
    }
    if (params.effectiveBandwidthWMev !== undefined) {
      this.state.effectiveBandwidthWMev = Math.max(1.0, Math.min(30.0, Number(params.effectiveBandwidthWMev)));
    }
    if (params.pairingPotentialUMev !== undefined) {
      this.state.pairingPotentialUMev = Math.max(2.0, Math.min(40.0, Number(params.pairingPotentialUMev)));
    }
    if (params.carrierDensityE12Cm2 !== undefined) {
      this.state.carrierDensityE12Cm2 = Math.max(0.1, Math.min(8.0, Number(params.carrierDensityE12Cm2)));
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

  public tuneToMagicAngle(): void {
    // 快速鎖定魔角 \theta = 1.08°，最小化帶寬並最大化量子度規剛度
    this.state.twistAngleDegrees = 1.08;
    this.state.effectiveBandwidthWMev = 2.0;
    this.state.quantumMetricIntegralG = 8.4;
    this.state.regime = 'quantum-metric-geometric-superfluid';
    this.recalculatePhysics();
    this.playTone(440.0, 'sine'); // A4
    this.saveState();
  }

  public pulseGeometricFlux(): void {
    // 注入莫爾幾何超流通量微擾
    this.state.superfluidCriticalCurrentMicroAmp = Number((this.state.superfluidCriticalCurrentMicroAmp + 8.5).toFixed(1));
    this.state.orbitalDiamagneticSusceptibility = Number((this.state.orbitalDiamagneticSusceptibility - 2.4).toFixed(1));
    this.playTone(698.46, 'triangle'); // F5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { twistAngleDegrees, quantumMetricIntegralG, effectiveBandwidthWMev, pairingPotentialUMev, carrierDensityE12Cm2 } = this.state;

    // 1. 魔角共振敏感度 (偏離 1.08° 則扁帶變寬，度規主導減弱)
    const angleDev = Math.abs(twistAngleDegrees - 1.08);
    const magicResonance = Math.exp(-angleDev * 6.0);

    // 2. 幾何超流剛度 D_s^{geom} \propto U \int g d^2k
    const rawDsGeom = (pairingPotentialUMev * 0.38) * quantumMetricIntegralG * (0.4 + magicResonance * 0.6);
    this.state.geometricSuperfluidWeightDs = Number(rawDsGeom.toFixed(1));

    // 3. 常規 BCS 超流剛度 D_s^{BCS} \propto W (在平帶極低)
    const rawDsBcs = (effectiveBandwidthWMev * 0.35) * (carrierDensityE12Cm2 / 4.0);
    this.state.conventionalBcsWeightDs = Number(rawDsBcs.toFixed(1));

    // 4. 幾何剛度主導佔比 (%)
    const totalDs = this.state.geometricSuperfluidWeightDs + this.state.conventionalBcsWeightDs;
    this.state.geometricDominanceRatioPercent = Number((
      (this.state.geometricSuperfluidWeightDs / Math.max(0.1, totalDs)) * 100.0
    ).toFixed(1));

    // 5. 臨界超電流 I_c \propto D_s
    this.state.superfluidCriticalCurrentMicroAmp = Number((totalDs * 2.15).toFixed(1));

    // 6. 軌道抗磁磁化率 \chi_dia \propto - \int g
    this.state.orbitalDiamagneticSusceptibility = Number((-quantumMetricIntegralG * 2.2 * (1.0 + magicResonance * 0.5)).toFixed(1));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.cos(now * 0.002) * 0.04;
    this.state.geometricSuperfluidWeightDs = Math.max(1.0, Number((this.state.geometricSuperfluidWeightDs + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        dsGeom: this.state.geometricSuperfluidWeightDs,
        dsBcs: this.state.conventionalBcsWeightDs,
        criticalCurrent: this.state.superfluidCriticalCurrentMicroAmp
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

  private playTone(freq = 520.0, type: OscillatorType = 'sine'): void {
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

export const quantumMetricSuperfluidEngine = new QuantumMetricSuperfluidEngine();
