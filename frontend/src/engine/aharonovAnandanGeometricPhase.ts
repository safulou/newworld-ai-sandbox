/**
 * 阿哈羅諾夫-安丹幾何相位與非阿貝爾非絕熱拓撲泵浦處理器
 * (Aharonov-Anandan Geometric Phase & Non-Adiabatic Gauge Pump Processor)
 *
 * 核心物理理論：
 * 1. 阿哈羅諾夫-安丹 (Aharonov-Anandan, AA) 幾何相位：
 *    貝里相位 (Berry Phase) 嚴重依賴絕熱演化假設。1987年 Aharonov 與 Anandan 證明：
 *    對於量子態 |\psi(t)> 在希爾伯特空間之任何任意演化週期 |\psi(\tau)> = e^{i\phi} |\psi(0)>，
 *    在射影希爾伯特空間 P(H) 中對應一條閉合軌線 C。總相位可精確分解為：
 *    \phi = \beta_{\text{AA}} - \delta_{\text{dyn}}，
 *    其中動態相 \delta_{\text{dyn}} = \frac{1}{\hbar}\int_0^\tau \langle\psi(t)|H(t)|\psi(t)\rangle dt，
 *    而幾何相 \beta_{\text{AA}} = \oint_{\tilde{C}} \langle\tilde{\psi}|i d|\tilde{\psi}\rangle = \iint_S \Omega_{\text{AA}}
 *    為軌線在射影空間之純幾何整體不變量，完全不依賴演化速度或哈密頓量具體能譜，超高速演化亦嚴格成立！
 * 2. 威爾切克-齊 (Wilczek-Zee) 非阿貝爾完整群 (Non-Abelian Non-Adiabatic Holonomy)：
 *    若態空間包含 N 重非阿貝爾簡併子空間，AA 幾何相推廣為非對易酉完整矩陣：
 *    U_{\text{AA}} = \mathcal{P} \exp\left( i \oint \mathcal{A}_{\text{AA}} \right)，
 *    式中 \mathcal{A}_{\text{AA}}^{ab} = i \langle \psi^a(t) | \frac{d}{dt} | \psi^b(t) \rangle 為非阿貝爾連絡。
 * 3. 動態相消除與純幾何量子門 (Dynamical Phase Cancellation & Pure Geometric Gates)：
 *    透過自旋回波 (Spin-Echo) 或正反雙迴路路徑消除動態相 (\delta_{\text{dyn}} \to 0)，
 *    量子邏輯門完全由射影流形之立體角 \Omega 所決定，具備抵禦脈衝時序噪聲與控制起伏之本徵拓撲強韌性。
 * 4. 非絕熱幾何拓撲量子泵浦 (Non-Adiabatic Quantum Pump)：
 *    在光學晶格或超導波導陣列中，以微波驅動非絕熱閉環，每個驅動週期傳輸量子化電荷
 *    Q = \frac{e}{2\pi} \oint \Omega_{\text{AA}}，打破常規 Thouless 慢速絕熱泵浦速度瓶頸。
 */

export type AARegime =
  | 'aa-non-adiabatic-geometric-phase'    // 純非絕熱阿哈羅諾夫-安丹幾何相 (\delta_dyn ≈ 0)
  | 'wilczek-zee-non-abelian-holonomy'    // 威爾切克-齊非阿貝爾單元完整群 (U_AA ∈ U(N))
  | 'ultra-fast-geometric-quantum-gate'   // 超高速容錯幾何量子門操作相 (Gate Fidelity > 0.999)
  | 'mixed-dynamical-dominated-regime';   // 動態相位主導雜散退相干相 (\delta_dyn >> \beta_AA)

export interface AharonovAnandanState {
  projectiveSolidAngleOmegaRad: number;    // 射影空間立體角 \Omega (0.05 ~ 6.28 rad)
  evolutionPeriodTauNs: number;            // 非絕熱演化週期 \tau (0.1 ~ 50.0 ns)
  dynamicalPhaseCancellationRate: number;  // 動態相位消除率 (0.0 ~ 1.0, 1.0 為完全抵消)
  nonAbelianDegeneracyN: number;           // 非阿貝爾簡併子空間維度 N (1 ~ 4)
  regime: AARegime;

  // 動態演算物理指標
  aaGeometricPhaseBetaRad: number;         // AA 幾何相位 \beta_AA (rad)
  dynamicalPhaseDeltaRad: number;          // 剩餘動態相位 \delta_dyn (rad)
  geometricGateFidelity: number;           // 純幾何量子門保真度 (0.80 ~ 0.9999)
  nonAdiabaticPumpedChargeE: number;       // 每個週期泵浦電荷 Q (單位 e)
  curvatureIntensityOmegaAA: number;       // 射影空間曲率強度 \Omega_AA
  telemetryHistory: Array<{
    timestamp: number;
    betaAA: number;
    deltaDyn: number;
    fidelity: number;
  }>;
}

const STORAGE_KEY = 'newworld_aharonov_anandan_geometric_phase_state_v1';

class AharonovAnandanEngine {
  private state: AharonovAnandanState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): AharonovAnandanState {
    return {
      projectiveSolidAngleOmegaRad: Math.PI, // 預設立體角 \pi (產生 \pi/2 幾何相)
      evolutionPeriodTauNs: 2.5,             // 快速 2.5 ns
      dynamicalPhaseCancellationRate: 0.95,  // 95% 動態相消除
      nonAbelianDegeneracyN: 2,              // 二重簡併子空間
      regime: 'aa-non-adiabatic-geometric-phase',
      aaGeometricPhaseBetaRad: 1.571,
      dynamicalPhaseDeltaRad: 0.12,
      geometricGateFidelity: 0.9985,
      nonAdiabaticPumpedChargeE: 1.0,
      curvatureIntensityOmegaAA: 2.0,
      telemetryHistory: []
    };
  }

  private loadState(): AharonovAnandanState {
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
      // 降級使用預設
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 忽略儲存例外
    }
  }

  public getState(): AharonovAnandanState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;

    // 1. AA 幾何相 \beta_AA = \Omega / 2 (對於自旋 1/2 系統) * 簡併係數
    const baseBeta = (s.projectiveSolidAngleOmegaRad / 2.0) * (s.nonAbelianDegeneracyN >= 2 ? 1.0 : 1.0);
    s.aaGeometricPhaseBetaRad = Number(baseBeta.toFixed(3));

    // 2. 剩餘動態相 \delta_dyn \propto \tau * (1 - 消除率)
    const rawDelta = (s.evolutionPeriodTauNs * 0.8) * (1.0 - s.dynamicalPhaseCancellationRate);
    s.dynamicalPhaseDeltaRad = Number(rawDelta.toFixed(3));

    // 3. 幾何量子門保真度：依賴動態相消除程度與演化時間 (越快噪聲越低，幾何保護越強)
    const fidelityPenalty = Math.min(0.2, s.dynamicalPhaseDeltaRad * 0.05 + (s.evolutionPeriodTauNs > 10.0 ? 0.05 : 0.0));
    s.geometricGateFidelity = Number(Math.max(0.80, 0.9999 - fidelityPenalty).toFixed(4));

    // 4. 非絕熱泵浦電荷 Q = \frac{e}{2\pi} \beta_AA * N
    const pumpedQ = (s.aaGeometricPhaseBetaRad / Math.PI) * (s.nonAbelianDegeneracyN === 1 ? 1.0 : s.nonAbelianDegeneracyN * 0.5);
    s.nonAdiabaticPumpedChargeE = Number(pumpedQ.toFixed(2));

    // 5. 射影空間曲率強度
    s.curvatureIntensityOmegaAA = Number((s.projectiveSolidAngleOmegaRad / (s.evolutionPeriodTauNs + 0.1)).toFixed(2));

    // 狀態判定
    if (s.nonAbelianDegeneracyN >= 3) {
      s.regime = 'wilczek-zee-non-abelian-holonomy';
    } else if (s.dynamicalPhaseCancellationRate > 0.92 && s.evolutionPeriodTauNs <= 5.0) {
      s.regime = 'ultra-fast-geometric-quantum-gate';
    } else if (s.dynamicalPhaseCancellationRate > 0.70) {
      s.regime = 'aa-non-adiabatic-geometric-phase';
    } else {
      s.regime = 'mixed-dynamical-dominated-regime';
    }

    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (deltaSeconds <= 0) return;
    this.recalculatePhysics();

    const now = Date.now();
    const lastTime = this.state.telemetryHistory.length > 0
      ? this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp
      : 0;

    if (now - lastTime >= 1000) {
      this.state.telemetryHistory.push({
        timestamp: now,
        betaAA: this.state.aaGeometricPhaseBetaRad,
        deltaDyn: this.state.dynamicalPhaseDeltaRad,
        fidelity: this.state.geometricGateFidelity
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public tuneProjectiveSolidAngle(deltaOmega: number): void {
    this.state.projectiveSolidAngleOmegaRad = Number(Math.max(0.05, Math.min(6.283, this.state.projectiveSolidAngleOmegaRad + deltaOmega)).toFixed(3));
    this.recalculatePhysics();
    this.playTone(480, 720, 0.18, 'sine');
  }

  public rampEvolutionPeriod(deltaTau: number): void {
    this.state.evolutionPeriodTauNs = Number(Math.max(0.1, Math.min(50.0, this.state.evolutionPeriodTauNs + deltaTau)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(360, 580, 0.15, 'triangle');
  }

  public optimizeDynamicalCancellation(rateDelta: number = 0.05): void {
    this.state.dynamicalPhaseCancellationRate = Number(Math.max(0.0, Math.min(1.0, this.state.dynamicalPhaseCancellationRate + rateDelta)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(600, 960, 0.22, 'square');
  }

  public toggleNonAbelianDegeneracy(level: number): void {
    this.state.nonAbelianDegeneracyN = Math.max(1, Math.min(4, Math.round(level)));
    this.recalculatePhysics();
    this.playTone(520, 840, 0.2, 'sawtooth');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(300, 200, 0.2, 'sine');
  }

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playTone(fStart: number, fEnd: number, duration: number, type: OscillatorType = 'sine'): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(fStart, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 忽略音效異常
    }
  }
}

export const aharonovAnandanEngine = new AharonovAnandanEngine();
export const aaGeometricPhaseEngine = aharonovAnandanEngine;
