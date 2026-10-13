/**
 * 菲波那契金鍵任意子拓撲量子編織處理器
 * (Fibonacci Anyon Non-Abelian Universal Quantum Braiding Processor)
 *
 * 核心物理理論：
 * 1. 菲波那契任意子聚變代數 (Fibonacci Anyon Fusion Rule)：
 *    非阿貝爾任意子中最優雅之體系，聚變規則為 \tau \times \tau = 1 + \tau。
 *    單個任意子具有黃金分割量子維度：
 *    d_\tau = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887...
 *    N 個任意子張成的希爾伯特空間維度隨斐波那契數列 F_{N-1} 指數增長。
 * 2. 楊-巴克斯特方程與 F / R 編織矩陣 (Pentagon & Hexagon Equations)：
 *    聚變基底變換由 F-矩陣給出：
 *    F = [[d_\tau^{-1}, d_\tau^{-1/2}], [d_\tau^{-1/2}, -d_\tau^{-1}]]。
 *    交換編織由 R-矩陣主導：R = diag(e^{-4\pi i/5}, e^{3\pi i/5})。
 * 3. 緻密辮群表示與通用拓撲量子計算 (Universal TQC)：
 *    與伊辛任意子 (Ising Anyon, 僅能生成克里福德群) 不同，菲波那契任意子編織矩陣
 *    在單元群 SU(2) 中稠密 (Dense)，可僅透過編織操作以任意精度編譯
 *    任意單量子比特門與 CNOT 雙量子比特門，完全無需魔術態蒸餾 (Magic State Distillation)。
 */

export type FibonacciAnyonRegime =
  | 'fibonacci-universal-tqc'         // 通用拓撲量子計算相 (SU(2) 緻密編織)
  | 'golden-fusion-tree'              // 黃金比例聚變樹編碼相 (\tau \times \tau = 1 + \tau)
  | 'braid-group-density'             // 辮群表示單元酉變換相 (Solovay-Kitaev 逼近)
  | 'topological-vacuum-protection';  // 無魔態蒸餾拓撲能隙保護相 (零退相干)

export type QuantumGateTarget = 'hadamard-gate' | 'phase-shift-t' | 'cnot-entangling' | 'identity-idle';

export interface FibonacciAnyonState {
  anyonCountN: number;               // 任意子數量 (3 ~ 12 顆)
  braidStepsCount: number;           // 累積拓撲編織步數
  temperatureKelvin: number;         // 系統操作溫度 T (K, 0.001 ~ 0.5)
  topologicalGapMev: number;         // 拓撲超導能隙 \Delta (meV, 0.2 ~ 8.0)
  targetGate: QuantumGateTarget;     // 目標合成量子邏輯門
  regime: FibonacciAnyonRegime;

  // 動態演算物理指標
  goldenRatioDimension: number;      // 任意子量子維度 d_\tau ≈ 1.618
  hilbertSpaceDimension: number;     // 聚變希爾伯特空間維度 dim(H) = F_{N-1}
  braidFidelity: number;             // 編織門保真度 (0.0 ~ 1.0)
  topologicalEntropyS: number;       // 拓撲糾纏熵 S_topo = \ln(d_\tau)
  braidPhaseAccumulatedRad: number;  // 累積非阿貝爾貝里相位 (rad)
  telemetryHistory: Array<{
    timestamp: number;
    fidelity: number;
    braidSteps: number;
    hilbertDim: number;
  }>;
}

const STORAGE_KEY = 'newworld_fibonacci_anyon_state_v1';

// 計算第 n 項斐波那契數列 (F_0=0, F_1=1, F_2=1, F_3=2, F_4=3, F_5=5...)
function fib(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}

class FibonacciAnyonEngine {
  private state: FibonacciAnyonState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): FibonacciAnyonState {
    return {
      anyonCountN: 6,
      braidStepsCount: 14,
      temperatureKelvin: 0.02,
      topologicalGapMev: 2.8,
      targetGate: 'hadamard-gate',
      regime: 'fibonacci-universal-tqc',
      goldenRatioDimension: 1.618,
      hilbertSpaceDimension: 5, // F_5 for N=6
      braidFidelity: 0.9992,
      topologicalEntropyS: 0.4812, // ln(1.61803)
      braidPhaseAccumulatedRad: 3.77,
      telemetryHistory: []
    };
  }

  private loadState(): FibonacciAnyonState {
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

  public getState(): FibonacciAnyonState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<FibonacciAnyonState, 'anyonCountN' | 'temperatureKelvin' | 'topologicalGapMev' | 'targetGate' | 'regime'>>): void {
    if (params.anyonCountN !== undefined) {
      this.state.anyonCountN = Math.max(3, Math.min(12, Math.round(Number(params.anyonCountN))));
    }
    if (params.temperatureKelvin !== undefined) {
      this.state.temperatureKelvin = Math.max(0.001, Math.min(0.5, Number(params.temperatureKelvin)));
    }
    if (params.topologicalGapMev !== undefined) {
      this.state.topologicalGapMev = Math.max(0.2, Math.min(8.0, Number(params.topologicalGapMev)));
    }
    if (params.targetGate !== undefined) {
      this.state.targetGate = params.targetGate;
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

  public executeBraidStep(): void {
    // 執行一次非阿貝爾任意子編織步進 \sigma_i
    this.state.braidStepsCount += 1;
    this.state.braidPhaseAccumulatedRad = Number((this.state.braidPhaseAccumulatedRad + (3.0 * Math.PI / 5.0)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(659.25, 'triangle'); // E5
    this.saveState();
  }

  public synthesizeUniversalGate(target: QuantumGateTarget): void {
    // 依目標邏輯門編譯完整編織序列 (Solovay-Kitaev 逼近)
    this.state.targetGate = target;
    this.state.braidStepsCount += 6;
    this.state.regime = 'fibonacci-universal-tqc';
    this.recalculatePhysics();
    this.playTone(880.0, 'sine'); // A5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { anyonCountN, temperatureKelvin, topologicalGapMev, braidStepsCount } = this.state;

    // 1. 量子維度 d_\tau = (1 + \sqrt{5}) / 2
    const phi = (1.0 + Math.sqrt(5.0)) / 2.0;
    this.state.goldenRatioDimension = Number(phi.toFixed(4));

    // 2. 希爾伯特空間維度 dim = F_{N-1}
    this.state.hilbertSpaceDimension = fib(anyonCountN - 1);

    // 3. 拓撲糾纏熵 S_topo = \ln(d_\tau)
    this.state.topologicalEntropyS = Number(Math.log(phi).toFixed(4));

    // 4. 編織門保真度 (受熱激發能隙壓抑 e^{-\Delta / k_B T}，受編織深度收斂)
    const thermalError = Math.exp(-topologicalGapMev / (Math.max(0.001, temperatureKelvin) * 8.617e-2));
    const depthPrecision = 1.0 - (0.05 / Math.max(1, braidStepsCount));
    const rawFidelity = (1.0 - Math.min(0.2, thermalError)) * depthPrecision;
    this.state.braidFidelity = Number(Math.max(0.85, Math.min(0.9999, rawFidelity)).toFixed(4));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.sin(now * 0.002) * 0.0002;
    this.state.braidFidelity = Math.max(0.85, Math.min(0.9999, Number((this.state.braidFidelity + drift * delta).toFixed(4))));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        fidelity: this.state.braidFidelity,
        braidSteps: this.state.braidStepsCount,
        hilbertDim: this.state.hilbertSpaceDimension
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

export const fibonacciAnyonEngine = new FibonacciAnyonEngine();
