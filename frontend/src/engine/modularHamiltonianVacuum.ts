/**
 * 拓撲超導富田-竹崎模態流與量子糾纏真空引擎
 * (Tomita-Takesaki Modular Flow & Entanglement Vacuum Energy Engine)
 *
 * 核心物理理論：
 * 1. 富田-竹崎定理 (Tomita-Takesaki Modular Theory) 與模態哈密頓量：
 *    在馮紐曼代數 (von Neumann Algebra) 中，給定循環分離真空態 |\Omega\rangle 與區域代數 \mathcal{M}，
 *    定義模態算子 \Delta = S^\dagger S 與模態哈密頓量 K = -\ln \Delta。
 *    模態流 \sigma_t(A) = \Delta^{it} A \Delta^{-it} 構成自發之內稟單參量自同構群。
 * 2. Bisognano-Wichmann 定理與林德勒雙曲旋轉對偶：
 *    對於閔可夫斯基時空平坦半空間 (楔區 Rindler Wedge x > |t|)，
 *    模態流幾何精確對偶於均勻加速度 a = 2\pi 觀測者的勞倫茲洛倫茲升力 (Lorentz Boosts)
 *    旋轉流動，將微觀量子資訊糾纏轉化為宏觀巨觀重力加速場效應。
 * 3. 糾纏第一定律 (First Law of Entanglement) 與量子能量不等式 (QEI)：
 *    在真空態微擾下，局部廣義糾纏熵變量嚴格等於模態能量期望值變量：
 *    \delta S_A = \delta \langle K_A \rangle。
 *    量子能量不等式 (Quantum Energy Inequalities, QEI) 限制局部負能量聚焦時空持續時間，
 *    防止巨觀因果律崩潰並穩定局部真空相變。
 */

export type ModularVacuumRegime =
  | 'bisognano-wichmann-rindler'     // Bisognano-Wichmann 林德勒模態流相 (幾何角加速對偶)
  | 'entanglement-first-law-saturation' // 糾纏第一定律飽和態 (\delta S = \delta \langle K \rangle)
  | 'quantum-energy-inequality-ward' // QEI 負能量量子聚焦力場相 (抵禦局部真空塌縮)
  | 'relative-entropy-monotonicity'; // 相對熵單調收斂相 (Araki 資訊單調守恆)

export interface ModularVacuumState {
  entangledRegionRadiusLp: number;   // 糾纏區域半徑 R (\ell_p 普朗克長度, 1.0 ~ 50.0)
  unruhAccelerationScaleE20: number; // 等效安魯加速度 a (10^20 m/s^2, 0.1 ~ 10.0)
  modularTimeParameterS: number;     // 模態時間參數 s (-5.0 ~ 5.0)
  vacuumNegativeEnergyFlux: number;  // 局部負能量通量注入 (0.0 ~ 25.0)
  uvCutoffScaleGev: number;          // 紫外截斷能標 \Lambda_UV (10^16 ~ 10^19 GeV)
  regime: ModularVacuumRegime;

  // 動態演算物理指標
  modularHamiltonianExpectation: number; // 模態能量期望值 \langle K \rangle
  entanglementEntropyDeviation: number;  // 糾纏熵增量 \delta S_A
  unruhTemperatureKelvin: number;        // 等效安魯熱輻射溫度 T_U (K)
  qeiStabilityBound: number;             // QEI 量子能量穩定係數 (0.0 ~ 1.0)
  relativeEntropyMonotonic: number;      // Araki 相對熵 S(\rho || \sigma)
  vacuumStressTensorT00: number;         // 能量動量張量期望值 \langle T_{00} \rangle
  telemetryHistory: Array<{
    timestamp: number;
    modularK: number;
    entropyS: number;
    unruhTemp: number;
  }>;
}

const STORAGE_KEY = 'newworld_modular_vacuum_state_v1';

class ModularHamiltonianVacuumEngine {
  private state: ModularVacuumState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): ModularVacuumState {
    return {
      entangledRegionRadiusLp: 18.5,
      unruhAccelerationScaleE20: 2.4, // 2.4 x 10^20 m/s^2
      modularTimeParameterS: 0.8,
      vacuumNegativeEnergyFlux: 4.5,
      uvCutoffScaleGev: 1.22e19,
      regime: 'bisognano-wichmann-rindler',
      modularHamiltonianExpectation: 86.4,
      entanglementEntropyDeviation: 86.4, // 初始完美飽和第一定律
      unruhTemperatureKelvin: 965.2,
      qeiStabilityBound: 0.94,
      relativeEntropyMonotonic: 1.42,
      vacuumStressTensorT00: -0.15,
      telemetryHistory: []
    };
  }

  private loadState(): ModularVacuumState {
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

  public getState(): ModularVacuumState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<ModularVacuumState, 'entangledRegionRadiusLp' | 'unruhAccelerationScaleE20' | 'modularTimeParameterS' | 'vacuumNegativeEnergyFlux' | 'uvCutoffScaleGev' | 'regime'>>): void {
    if (params.entangledRegionRadiusLp !== undefined) {
      this.state.entangledRegionRadiusLp = Math.max(1.0, Math.min(50.0, Number(params.entangledRegionRadiusLp)));
    }
    if (params.unruhAccelerationScaleE20 !== undefined) {
      this.state.unruhAccelerationScaleE20 = Math.max(0.1, Math.min(10.0, Number(params.unruhAccelerationScaleE20)));
    }
    if (params.modularTimeParameterS !== undefined) {
      this.state.modularTimeParameterS = Math.max(-5.0, Math.min(5.0, Number(params.modularTimeParameterS)));
    }
    if (params.vacuumNegativeEnergyFlux !== undefined) {
      this.state.vacuumNegativeEnergyFlux = Math.max(0.0, Math.min(25.0, Number(params.vacuumNegativeEnergyFlux)));
    }
    if (params.uvCutoffScaleGev !== undefined) {
      this.state.uvCutoffScaleGev = Math.max(1.0e16, Math.min(2.0e19, Number(params.uvCutoffScaleGev)));
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

  public saturateEntanglementFirstLaw(): void {
    // 激發糾纏第一定律精密校準 \delta S_A = \delta \langle K_A \rangle
    this.state.entanglementEntropyDeviation = this.state.modularHamiltonianExpectation;
    this.state.regime = 'entanglement-first-law-saturation';
    this.recalculatePhysics();
    this.playTone(659.25, 'triangle'); // E5
    this.saveState();
  }

  public stepModularFlow(): void {
    // 模態流單參量自同構演進一次
    this.state.modularTimeParameterS = Number((this.state.modularTimeParameterS + 0.5).toFixed(1));
    if (this.state.modularTimeParameterS > 4.5) {
      this.state.modularTimeParameterS = -4.5;
    }
    this.recalculatePhysics();
    this.playTone(830.61, 'sine'); // G#5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { entangledRegionRadiusLp, unruhAccelerationScaleE20, modularTimeParameterS, vacuumNegativeEnergyFlux, regime } = this.state;

    // 1. 安魯溫度 T_U = \hbar a / (2\pi c k_B)
    // 比例於加速度尺度
    this.state.unruhTemperatureKelvin = Number((unruhAccelerationScaleE20 * 402.16).toFixed(1));

    // 2. 模態能量期望值 \langle K_A \rangle \propto 2\pi \int x T_{00} d^3x
    const boostFactor = 1.0 + Math.cosh(modularTimeParameterS * 0.4) * 0.35;
    this.state.modularHamiltonianExpectation = Number((
      entangledRegionRadiusLp * 3.8 * boostFactor + unruhAccelerationScaleE20 * 8.2
    ).toFixed(1));

    // 3. 糾纏熵增量 (在飽和體制下嚴格等於模態能量)
    if (regime === 'entanglement-first-law-saturation') {
      this.state.entanglementEntropyDeviation = this.state.modularHamiltonianExpectation;
    } else {
      const entropyOffset = (vacuumNegativeEnergyFlux * 0.4) + Math.sin(modularTimeParameterS) * 2.5;
      this.state.entanglementEntropyDeviation = Number((this.state.modularHamiltonianExpectation + entropyOffset).toFixed(1));
    }

    // 4. QEI 量子能量不等式穩定邊界 (受到負能量通量注入壓抑)
    const rawQei = 1.0 - (vacuumNegativeEnergyFlux / 30.0) * (1.0 / Math.max(0.2, unruhAccelerationScaleE20));
    this.state.qeiStabilityBound = Math.max(0.05, Math.min(1.0, Number(rawQei.toFixed(2))));

    // 5. Araki 相對熵 S(\rho || \sigma) >= 0 (單調守恆)
    this.state.relativeEntropyMonotonic = Number((
      Math.abs(this.state.entanglementEntropyDeviation - this.state.modularHamiltonianExpectation) * 0.12 + 0.85
    ).toFixed(2));

    // 6. 能量動量張量 \langle T_{00} \rangle
    this.state.vacuumStressTensorT00 = Number((
      (unruhAccelerationScaleE20 * 0.08) - (vacuumNegativeEnergyFlux * 0.05)
    ).toFixed(3));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.sin(now * 0.003) * 0.02;
    this.state.modularHamiltonianExpectation = Math.max(1.0, Number((this.state.modularHamiltonianExpectation + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        modularK: this.state.modularHamiltonianExpectation,
        entropyS: this.state.entanglementEntropyDeviation,
        unruhTemp: this.state.unruhTemperatureKelvin
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

  private playTone(freq = 523.25, type: OscillatorType = 'sine'): void { // C5
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.33);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const modularHamiltonianVacuumEngine = new ModularHamiltonianVacuumEngine();
