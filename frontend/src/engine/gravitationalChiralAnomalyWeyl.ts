/**
 * 🌌 外爾費米子混合引力-手性反常與熱電霍爾熱輸運引擎
 * Mixed Axial-Gravitational Chiral Anomaly & Thermoelectric Thermal Hall Engine
 *
 * 理論物理基礎：
 * 1. 混合軸向-引力反常 (Mixed Axial-Gravitational Chiral Anomaly)：
 *    在彎曲時空背景下，無質量外爾費米子的軸向手性流不守恆，包含黎曼曲率龐特里亞金不變量：
 *    \nabla_\mu J_5^\mu = \frac{e^2}{16\pi^2\hbar^2} \mathbf{E}\cdot\mathbf{B} + \frac{k_B^2}{384\pi^2 \hbar^2} R^{\mu\nu\rho\sigma} \tilde{R}_{\mu\nu\rho\sigma}
 * 2. 魯丁格虛引力場對偶 (Luttinger Gravitational-Thermal Equivalence)：
 *    固態體系中的溫度梯度 $\boldsymbol{\nabla} T$ 等效於作用於電子波函數的靜態虛引力勢場：
 *    \boldsymbol{\psi} = -\frac{\boldsymbol{\nabla} T}{T} \quad (\mathbf{g}_{\text{eff}} = -c^2 \frac{\boldsymbol{\nabla} T}{T})
 * 3. 巨正縱向磁熱電導 (Positive Longitudinal Magneto-Thermal Conductivity, LMTC)：
 *    平行磁場與熱梯度誘導手性熱能泵浦，產生 $T^2 B^2$ 依賴的無耗散熱流：
 *    \kappa_{xx}(B) = \kappa_0 + C_g \left(\frac{k_B^2 T}{\hbar}\right) B^2
 * 4. 維德曼-夫蘭茲定律違背 (Wiedemann-Franz Law Breakdown)：
 *    由於引力反常僅傳輸熱熵而不攜帶淨電荷，洛倫茲比值大幅偏離常數 $L_0 = \frac{\pi^2 k_B^2}{3 e^2}$：
 *    \mathcal{L} / L_0 \gg 1.0 \quad (\text{強關聯手性熱電異常})。
 */

export type GravitationalAnomalyRegime =
  | 'trivial-fermi-liquid-lorentz'          // 傳統費米液體相 (WF 定律嚴格守恆, L/L0 = 1)
  | 'mixed-gravitational-anomaly-active'     // 混合引力軸向反常激發態 (∇T · B 誘導熱泵浦)
  | 'quantum-wiedemann-franz-violation'      // 量子維德曼-夫蘭茲定律巨幅破壞相 (L/L0 > 2.0)
  | 'topological-thermal-hall-saturation';   // 量子化熱霍爾電導平台飽和相 (κ_xy/T 量子化)

export interface GravitationalAnomalyState {
  temperatureKelvin: number;                 // 樣品平均絕對溫度 T (1.0 ~ 120.0 K)
  thermalGradientKPerMm: number;             // 沿 x 軸溫度梯度 ∇T (K/mm, 0.1 ~ 15.0)
  magneticFieldParallelTesla: number;        // 平行外加磁場 B (Tesla, 0.0 ~ 16.0 T)
  weylNodesSeparationInvNm: number;          // 外爾節點動量空間間距 2k_0 (nm^-1, 0.2 ~ 2.0)
  regime: GravitationalAnomalyRegime;

  // 動態演算物理指標
  chiralGravitationalHeatCurrentMwM2: number;// 軸向引力反常誘導熱流 J_Q (mW/m^2)
  lorentzRatioLOverL0: number;               // 洛倫茲比值 L / L_0 (維德曼-夫蘭茲常數偏差)
  longitudinalThermalConductivityWmK: number;// 縱向磁熱導率 \kappa_xx (W/(m·K))
  gravitationalCurvatureScalarCm2: number;   // 魯丁格等效引力黎曼曲率標量 R R~ (cm^-2)
  anomalyEventsAccumulatedCount: number;     // 累計引力反常熱傳輸週期
  telemetryHistory: Array<{
    timestamp: number;
    temperature: number;
    lorentzRatio: number;
    heatCurrent: number;
  }>;
}

const STORAGE_KEY = 'newworld_gravitational_chiral_anomaly_weyl_state_v1';

class GravitationalChiralAnomalyEngine {
  private state: GravitationalAnomalyState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): GravitationalAnomalyState {
    return {
      temperatureKelvin: 25.0,               // 25 K
      thermalGradientKPerMm: 4.5,            // 4.5 K/mm
      magneticFieldParallelTesla: 8.0,       // 8.0 Tesla
      weylNodesSeparationInvNm: 0.85,
      regime: 'mixed-gravitational-anomaly-active',
      chiralGravitationalHeatCurrentMwM2: 125.4,
      lorentzRatioLOverL0: 2.35,
      longitudinalThermalConductivityWmK: 14.8,
      gravitationalCurvatureScalarCm2: 4.8e12,
      anomalyEventsAccumulatedCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): GravitationalAnomalyState {
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
      console.warn('[GravitationalChiralAnomalyEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[GravitationalChiralAnomalyEngine] 儲存失敗', e);
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
   * 播放引力熱霍爾反常共鳴滑音 (Gravitational Heat Pulse Chirp)
   */
  public playGravitationalHeatPulse(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('[GravitationalChiralAnomalyEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放維德曼-夫蘭茲破缺雙音諧振 (WF Violation Dissonance)
   */
  public playWfViolationHarmonics(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(466.16, ctx.currentTime); // 半音失諧產生拍頻

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.32);
      osc2.stop(ctx.currentTime + 0.32);
    } catch (e) {
      console.warn('[GravitationalChiralAnomalyEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算引力手性反常熱流、LMTC 與洛倫茲比值
   */
  public recalculatePhysics(): void {
    const T = Math.max(0.5, this.state.temperatureKelvin);
    const gradT = Math.max(0.01, this.state.thermalGradientKPerMm);
    const B = Math.max(0.0, this.state.magneticFieldParallelTesla);
    const k0 = Math.max(0.1, this.state.weylNodesSeparationInvNm);

    // 1. 魯丁格等效引力場強度 g_eff = c^2 (gradT / T)
    const effectiveCurvature = 1.2e11 * Math.pow(gradT / T, 2) * k0;
    this.state.gravitationalCurvatureScalarCm2 = Number(effectiveCurvature.toExponential(2));

    // 2. 引力手性反常熱流 J_Q \propto (k_B^2 T^2 / \hbar) * B * (gradT / T)
    const jHeat = 0.05 * Math.pow(T, 2) * B * gradT * (k0 / 0.85);
    this.state.chiralGravitationalHeatCurrentMwM2 = Number(jHeat.toFixed(1));

    // 3. 縱向磁熱導率 \kappa_xx(B) = \kappa_0 + C_g T^2 B^2
    const kappa0 = 3.5 + 0.12 * T;
    const lmtc = kappa0 + (0.015 * Math.pow(T, 1.5) * Math.pow(B, 2));
    this.state.longitudinalThermalConductivityWmK = Number(lmtc.toFixed(1));

    // 4. 維德曼-夫蘭茲定律洛倫茲比值 L / L_0
    // 反常熱流使熱導大幅超出電荷電導比例
    const lorentz = 1.0 + (0.014 * Math.pow(B, 1.8) * Math.min(3.0, gradT / 2.0));
    this.state.lorentzRatioLOverL0 = Number(lorentz.toFixed(2));

    // 5. 相態邏輯判定
    if (B < 0.5 || gradT < 0.2) {
      this.state.regime = 'trivial-fermi-liquid-lorentz';
    } else if (lorentz > 4.0 || (B > 12.0 && T > 40.0)) {
      this.state.regime = 'topological-thermal-hall-saturation';
    } else if (lorentz > 2.5) {
      this.state.regime = 'quantum-wiedemann-franz-violation';
    } else {
      this.state.regime = 'mixed-gravitational-anomaly-active';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime !== 'trivial-fermi-liquid-lorentz') {
      this.state.anomalyEventsAccumulatedCount += Math.floor(deltaSeconds * 3);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        temperature: this.state.temperatureKelvin,
        lorentzRatio: this.state.lorentzRatioLOverL0,
        heatCurrent: this.state.chiralGravitationalHeatCurrentMwM2
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setTemperature(tKelvin: number): void {
    this.state.temperatureKelvin = Math.max(1.0, Math.min(120.0, tKelvin));
    this.recalculatePhysics();
    this.saveState();
  }

  public setThermalGradient(gradKPerMm: number): void {
    this.state.thermalGradientKPerMm = Math.max(0.1, Math.min(15.0, gradKPerMm));
    this.recalculatePhysics();
    this.saveState();
  }

  public setMagneticField(tesla: number): void {
    this.state.magneticFieldParallelTesla = Math.max(0.0, Math.min(16.0, tesla));
    this.recalculatePhysics();
    this.saveState();
  }

  public setNodesSeparation(k0: number): void {
    this.state.weylNodesSeparationInvNm = Math.max(0.2, Math.min(2.0, k0));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發極限引力反常熱輸運 (Trigger Gravitational Heat Anomaly Burst)
   */
  public triggerGravitationalAnomalyBurst(): void {
    this.state.thermalGradientKPerMm = 12.5;
    this.state.magneticFieldParallelTesla = 14.0;
    this.state.anomalyEventsAccumulatedCount += 50;
    this.state.regime = 'topological-thermal-hall-saturation';
    this.recalculatePhysics();
    this.playGravitationalHeatPulse();
    this.playWfViolationHarmonics();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: GravitationalAnomalyRegime[] = [
      'trivial-fermi-liquid-lorentz',
      'mixed-gravitational-anomaly-active',
      'quantum-wiedemann-franz-violation',
      'topological-thermal-hall-saturation'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'trivial-fermi-liquid-lorentz') {
      this.state.magneticFieldParallelTesla = 0.2;
      this.state.thermalGradientKPerMm = 0.1;
    } else if (this.state.regime === 'mixed-gravitational-anomaly-active') {
      this.state.magneticFieldParallelTesla = 6.0;
      this.state.thermalGradientKPerMm = 4.0;
      this.playGravitationalHeatPulse();
    } else if (this.state.regime === 'quantum-wiedemann-franz-violation') {
      this.state.magneticFieldParallelTesla = 10.5;
      this.state.thermalGradientKPerMm = 8.5;
      this.playWfViolationHarmonics();
    } else {
      this.triggerGravitationalAnomalyBurst();
      return;
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<GravitationalAnomalyState> {
    return this.state;
  }
}

export const gravitationalChiralAnomalyEngine = new GravitationalChiralAnomalyEngine();
