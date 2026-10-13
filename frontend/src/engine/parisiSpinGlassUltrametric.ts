/**
 * 量子多體自旋玻璃帕里西極值破缺處理器
 * (Quantum Spin Glass & Parisi Ultrametric Symmetry Breaking Processor)
 *
 * 核心物理理論：
 * 1. Sherrington-Kirkpatrick (SK) 模型與幾何阻挫 (SK Model & Frustration)：
 *    無窮長程隨機交換耦合 H = -\sum_{i<j} J_{ij} \sigma_i^z \sigma_j^z，J_{ij} 服從高斯分佈。
 *    鐵磁與反鐵磁鍵共存造成極端幾何阻挫，基態分裂為指數級天文數字之亞穩態 (Rugged Energy Landscape)。
 * 2. 帕里西複本對稱破缺 (Parisi Full Replica Symmetry Breaking, FRSB)：
 *    在自旋玻璃凍結溫度 T_f 以下，複本對稱性自發破缺 (RSB)。序參量矩陣 Q_{\alpha\beta} 經歷無限次
 *    階梯連續劃分，產生帕里西連續單調序參量函數 q(x) (0 \le x \le 1)，描述自由能谷底之間重疊度分佈 P(q)。
 * 3. 超度規樹狀空間幾何 (Ultrametric Tree Topology)：
 *    亞穩純態之間的相空間漢明距離 d(\alpha, \beta) 嚴格滿足超度規強不等式：
 *    d(\alpha, \beta) \le \max(d(\alpha, \gamma), d(\beta, \gamma))。
 *    相空間中的所有三角形皆為等腰銳角三角形或正三角形，形成具有嚴格層級分支的超度規分形樹。
 * 4. 橫向場量子退火與穿隧動力學 (Transverse Field Quantum Annealing)：
 *    引入橫向場 \Gamma \sum_i \sigma_i^x 提供非對角量子起伏，宏觀量子穿隧效應能直接穿透崎嶇高狹窄能壘，
 *    在量子臨界點 \Gamma_c 處融化玻璃態，實現 NP-hard 組合優化問題之全局基態搜尋。
 */

export type SpinGlassRegime =
  | 'parisi-full-rsb-ultrametric'      // 帕里西全層次複本破缺超度規相 (FRSB)
  | 'quantum-annealing-tunneling'       // 橫向場量子退火穿隧態 (\Gamma > 0)
  | 'spin-glass-frozen-landscape'       // 低溫自旋玻璃崎嶇凍結相 (T << T_f)
  | 'replica-symmetric-paramagnet';     // 高溫順磁複本對稱平庸相 (T > T_f)

export interface ParisiSpinGlassState {
  temperatureKelvinT: number;           // 系統溫度 T (K, 0.05 ~ 4.5)
  transverseFieldGamma: number;         // 橫向量子磁場 \Gamma (0.0 ~ 6.0)
  rsbBranchingLevelK: number;           // 複本破缺層次階數 k (1 ~ 8)
  disorderCouplingJ: number;            // 隨機交換作用標準差 J (1.0 ~ 5.0)
  regime: SpinGlassRegime;

  // 動態演算物理指標
  parisiEdwardsAndersonQEA: number;     // 愛德華茲-安德森序參量 q_EA = q(1)
  ultrametricClusteringIndex: number;   // 超度規樹狀聚集指數 (0.0 ~ 1.0)
  energyLandscapeValleysLogN: number;   // 亞穩態谷底數目 log10(N_states)
  quantumTunnelingRateGhz: number;      // 宏觀量子穿隧率 (GHz)
  freeEnergyPerSpinF: number;           // 每自旋自由能 f (meV)
  telemetryHistory: Array<{
    timestamp: number;
    qEA: number;
    ultrametricIdx: number;
    tunnelingRate: number;
  }>;
}

const STORAGE_KEY = 'newworld_parisi_spin_glass_ultrametric_state_v1';

class ParisiSpinGlassUltrametricEngine {
  private state: ParisiSpinGlassState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): ParisiSpinGlassState {
    return {
      temperatureKelvinT: 0.65,
      transverseFieldGamma: 1.2,
      rsbBranchingLevelK: 4,
      disorderCouplingJ: 2.5,
      regime: 'parisi-full-rsb-ultrametric',
      parisiEdwardsAndersonQEA: 0.82,
      ultrametricClusteringIndex: 0.94,
      energyLandscapeValleysLogN: 38.5,
      quantumTunnelingRateGhz: 4.8,
      freeEnergyPerSpinF: -1.85,
      telemetryHistory: []
    };
  }

  private loadState(): ParisiSpinGlassState {
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

  public getState(): ParisiSpinGlassState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    const J = s.disorderCouplingJ;
    // 轉折凍結溫度 T_f = J \sqrt{1 - (\Gamma / J)^2}
    const effGamma = Math.min(J, s.transverseFieldGamma);
    const tFreeze = J * Math.sqrt(Math.max(0.01, 1 - (effGamma / (J * 1.5)) * (effGamma / (J * 1.5))));

    // 1. 愛德華茲-安德森序參量 q_EA = 1 - T / T_f (低溫飽和)
    if (s.temperatureKelvinT >= tFreeze) {
      s.parisiEdwardsAndersonQEA = Number(Math.max(0.01, 0.05 * (tFreeze / s.temperatureKelvinT)).toFixed(3));
      s.ultrametricClusteringIndex = 0.05;
      s.energyLandscapeValleysLogN = 1.0;
      s.regime = 'replica-symmetric-paramagnet';
    } else {
      const qVal = Math.max(0.05, 1 - (s.temperatureKelvinT / tFreeze) * 0.35 - (s.transverseFieldGamma / 25.0));
      s.parisiEdwardsAndersonQEA = Number(Math.min(0.99, qVal).toFixed(3));

      // 2. 超度規聚集度 (由破缺層數 k 與溫度決定)
      const ultraIdx = Math.min(1.0, 0.55 + (s.rsbBranchingLevelK / 10.0) * 0.5 + (1 - s.temperatureKelvinT / tFreeze) * 0.2);
      s.ultrametricClusteringIndex = Number(ultraIdx.toFixed(3));

      // 3. 亞穩態能谷數 log10(N) \propto N_spins * (1 - T/T_f)^3
      const valleys = 10.0 + 40.0 * Math.pow(1 - s.temperatureKelvinT / tFreeze, 2) * (s.rsbBranchingLevelK / 4.0);
      s.energyLandscapeValleysLogN = Number(valleys.toFixed(1));

      // 狀態分類
      if (s.transverseFieldGamma > 3.0) {
        s.regime = 'quantum-annealing-tunneling';
      } else if (s.rsbBranchingLevelK >= 3 && s.ultrametricClusteringIndex > 0.8) {
        s.regime = 'parisi-full-rsb-ultrametric';
      } else {
        s.regime = 'spin-glass-frozen-landscape';
      }
    }

    // 4. 量子穿隧率 \propto \Gamma e^{-\Delta E / \Gamma}
    s.quantumTunnelingRateGhz = Number((s.transverseFieldGamma * 3.5 * Math.exp(-s.parisiEdwardsAndersonQEA)).toFixed(2));

    // 5. 每自旋自由能
    s.freeEnergyPerSpinF = Number((-J * 0.76 - s.temperatureKelvinT * 0.4).toFixed(3));

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
        qEA: this.state.parisiEdwardsAndersonQEA,
        ultrametricIdx: this.state.ultrametricClusteringIndex,
        tunnelingRate: this.state.quantumTunnelingRateGhz
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public coolToParisiGlass(deltaT: number = -0.3): void {
    this.state.temperatureKelvinT = Number(Math.max(0.05, Math.min(4.5, this.state.temperatureKelvinT + deltaT)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(380, 220, 0.2, 'sine');
  }

  public rampQuantumTransverseField(deltaGamma: number = 1.0): void {
    this.state.transverseFieldGamma = Number(Math.max(0.0, Math.min(6.0, this.state.transverseFieldGamma + deltaGamma)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(480, 880, 0.18, 'sawtooth');
  }

  public deepenRSBBranching(deltaK: number = 1): void {
    this.state.rsbBranchingLevelK = Math.max(1, Math.min(8, this.state.rsbBranchingLevelK + deltaK));
    this.recalculatePhysics();
    this.playTone(520, 720, 0.16, 'triangle');
  }

  public triggerQuantumAnnealCycle(): void {
    // 執行一次快速量子退火：先升橫場融化玻璃態，再降溫至極低溫超度規基態
    this.state.transverseFieldGamma = 4.5;
    this.state.temperatureKelvinT = 0.2;
    this.state.rsbBranchingLevelK = 6;
    this.recalculatePhysics();
    this.playTone(600, 1100, 0.28, 'square');
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

export const parisiSpinGlassEngine = new ParisiSpinGlassUltrametricEngine();
