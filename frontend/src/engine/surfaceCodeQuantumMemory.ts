/**
 * 🧩 非阿貝爾拓撲任意子同調量子記憶體與拓撲表面碼引擎
 * Surface Code Topological Quantum Memory & Toric Anyons Engine
 *
 * 理論物理基礎：
 * 1. Kitaev 表面碼與二維同調穩定子量子代碼 (Surface Code / Toric Code)：
 *    在 $L \times L$ 棋盤晶格中，物理量子位元 (Data Qubits) 置於晶格邊緣，
 *    總物理位元數為 $N_{\text{data}} = 2d^2 - 1$ 或 $d^2 + (d-1)^2$（其中 $d$ 為拓撲碼距）。
 * 2. 局部穩定子生成元 (Stabilizer Generators)：
 *    頂點星形算符 $A_s = \prod_{j \in v(s)} X_j$ （偵測位元翻轉 $Z$-錯誤，激發磁荷 $m$-任意子）；
 *    面心方塊算符 $B_p = \prod_{j \in p} Z_j$ （偵測相位翻轉 $X$-錯誤，激發電荷 $e$-任意子）。
 * 3. 任意子編織統計與非阿貝爾同調群：
 *    $e$ 與 $m$ 互為半子 (Semion)，其互繞統計相位為 $\theta_{e, m} = \pi$；
 *    同調非平庸閉合弦算子 $W_X, W_Z$ 貫穿晶格邊界，對應邏輯代數 $\bar{X}, \bar{Z}$，構成容錯邏輯位元。
 * 4. 最小權重完全匹配 (MWPM) 糾錯與容錯閾值定理：
 *    在二維晶格上隨機泡利錯誤率 $p$ 下，表面碼的容錯閾值約為 $p_{\text{th}} \approx 1.05\%$。
 *    當 $p < p_{\text{th}}$ 時，邏輯錯誤率隨碼距 $d$ 指數抑制：
 *    P_L \approx 0.1 \times \left( \frac{p}{p_{\text{th}}} \right)^{(d+1)/2}
 *    邏輯量子相干壽命隨晶格擴展實現指數級延長！
 */

export type SurfaceCodeRegime =
  | 'quiescent-fault-tolerant-code-space'  // 寧靜容錯基態代碼空間相 (p ≪ p_th, 零徵候差錯, 邏輯壽命極大化)
  | 'active-syndrome-extraction-stabilizer'// 動態穩定子徵候提取相 (週期性量測 As, Bp, 生成點狀任意子對)
  | 'mwpm-topological-string-correction'  // MWPM 拓撲弦匹配糾錯中相 (弦算子收縮, 湮滅 e-m 任意子對)
  | 'logical-error-percolation-threshold'; // 邏輯錯誤滲流臨界相 (p ≥ p_th, 任意子弦貫穿晶格邊界, 邏輯態翻轉)

export interface StabilizerDefect {
  x: number; // 晶格坐標 x
  y: number; // 晶格坐標 y
  type: 'star-Z' | 'plaquette-X';
  isMatched: boolean;
}

export interface SurfaceCodeState {
  codeDistanceD: number;                   // 表面碼拓撲碼距 d (奇數 3, 5, 7, 9, 11)
  physicalErrorRateP: number;              // 物理單量子門錯誤率 p (0.0005 ~ 0.03, 0.05% ~ 3.0%)
  measurementRoundsPerCycle: number;       // 每週期穩定子徵候量測輪數 (1 ~ 10 輪)
  latticeSizeL: number;                    // 晶格維度 L
  regime: SurfaceCodeRegime;

  // 動態演算物理指標
  totalDataQubitsCount: number;            // 物理數據量子位元數 N_data
  totalSyndromeQubitsCount: number;        // 輔助檢驗徵候位元數 N_syndrome
  faultToleranceThresholdPth: number;      // 表面碼容錯閾值 p_th (0.0105 = 1.05%)
  logicalErrorRatePerCycle: number;        // 邏輯位元錯誤率 P_L
  logicalFidelityPercent: number;          // 邏輯保真度 F_L (%)
  activeAnyonDefectsCount: number;         // 當前活化任意子缺陷數 (e / m 任意子)
  accumulatedCyclesCount: number;          // 累計糾錯週期數
  defectsList: StabilizerDefect[];         // 當前晶格缺陷坐標清單
}

const STORAGE_KEY = 'newworld_surface_code_quantum_memory_state_v1';

class SurfaceCodeQuantumMemoryEngine {
  private state: SurfaceCodeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): SurfaceCodeState {
    return {
      codeDistanceD: 5,
      physicalErrorRateP: 0.001, // 0.1% (在 1.05% 閾值之內)
      measurementRoundsPerCycle: 4,
      latticeSizeL: 5,
      regime: 'quiescent-fault-tolerant-code-space',
      totalDataQubitsCount: 41, // d^2 + (d-1)^2 = 25 + 16 = 41
      totalSyndromeQubitsCount: 40,
      faultToleranceThresholdPth: 0.0105,
      logicalErrorRatePerCycle: 0.000025,
      logicalFidelityPercent: 99.997,
      activeAnyonDefectsCount: 2,
      accumulatedCyclesCount: 0,
      defectsList: [
        { x: 1, y: 2, type: 'star-Z', isMatched: true },
        { x: 2, y: 2, type: 'star-Z', isMatched: true }
      ]
    };
  }

  private loadState(): SurfaceCodeState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.getDefaultState(),
            ...parsed,
            defectsList: Array.isArray(parsed.defectsList) ? parsed.defectsList : []
          };
        }
      }
    } catch (e) {
      console.warn('[SurfaceCodeEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[SurfaceCodeEngine] 儲存失敗', e);
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
   * 播放穩定子徵候量測雙頻嗶聲 (Syndrome Extraction Bip)
   */
  public playSyndromeExtractionBeep(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn('[SurfaceCodeEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放 MWPM 任意子對收縮湮滅重置音 (Anyon Pair Annihilation Chord)
   */
  public playAnyonAnnihilationChord(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const freqs = [330, 440, 660];
      freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(f * 1.5, ctx.currentTime + 0.22);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      });
    } catch (e) {
      console.warn('[SurfaceCodeEngine] 音效播放異常', e);
    }
  }

  /**
   * 核心物理演算：計算物理/邏輯量子位元、MWPM 糾錯與邏輯錯誤率
   */
  public recalculatePhysics(): void {
    let d = Math.max(3, Math.min(11, Math.round(this.state.codeDistanceD)));
    if (d % 2 === 0) d += 1;
    this.state.codeDistanceD = d;
    this.state.latticeSizeL = d;

    // 1. 物理數據量子位元數 N_data = d^2 + (d-1)^2
    const nData = d * d + (d - 1) * (d - 1);
    this.state.totalDataQubitsCount = nData;
    this.state.totalSyndromeQubitsCount = nData - 1;

    // 2. 邏輯錯誤率計算：P_L ≈ 0.1 * (p / p_th)^((d+1)/2)
    const p = Math.max(0.0001, Math.min(0.05, this.state.physicalErrorRateP));
    const pTh = 0.0105; // 1.05%
    this.state.faultToleranceThresholdPth = pTh;

    const exponent = (d + 1) / 2.0;
    let pLogical = 0.1 * Math.pow(p / pTh, exponent);
    if (p >= pTh) {
      // 突破臨界閾值：滲流崩潰
      pLogical = Math.min(0.5, 0.1 + 0.4 * (1.0 - Math.exp(-(p - pTh) * 50.0)));
    }
    this.state.logicalErrorRatePerCycle = Number(pLogical.toExponential(3));
    this.state.logicalFidelityPercent = Number(Math.max(50.0, (1.0 - pLogical) * 100.0).toFixed(4));

    // 3. 生成隨機任意子缺陷 (e / m 任意子)
    const defects: StabilizerDefect[] = [];
    const defectChance = Math.min(0.8, p * 40.0);
    for (let x = 0; x < d; x++) {
      for (let y = 0; y < d; y++) {
        if (Math.sin(x * 12.3 + y * 7.7 + p * 100) > (1.0 - defectChance)) {
          const type = (x + y) % 2 === 0 ? 'star-Z' : 'plaquette-X';
          defects.push({
            x,
            y,
            type,
            isMatched: p < pTh
          });
        }
      }
    }
    this.state.defectsList = defects;
    this.state.activeAnyonDefectsCount = defects.length;

    // 4. 相態判定
    if (p < 0.002) {
      this.state.regime = 'quiescent-fault-tolerant-code-space';
    } else if (p >= pTh) {
      this.state.regime = 'logical-error-percolation-threshold';
    } else if (defects.length > 4) {
      this.state.regime = 'mwpm-topological-string-correction';
    } else {
      this.state.regime = 'active-syndrome-extraction-stabilizer';
    }
  }

  public update(deltaSeconds: number): void {
    this.state.accumulatedCyclesCount += Math.floor(deltaSeconds * 4);
  }

  // --- 操作控制 API ---

  public setCodeDistance(d: number): void {
    // 確保為奇數 3, 5, 7, 9, 11
    let odd = Math.max(3, Math.min(11, Math.round(d)));
    if (odd % 2 === 0) odd += 1;
    this.state.codeDistanceD = odd;
    this.recalculatePhysics();
    this.saveState();
  }

  public setPhysicalErrorRate(p: number): void {
    this.state.physicalErrorRateP = Math.max(0.0005, Math.min(0.03, p));
    this.recalculatePhysics();
    this.saveState();
  }

  public setMeasurementRounds(rounds: number): void {
    this.state.measurementRoundsPerCycle = Math.max(1, Math.min(10, Math.round(rounds)));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 觸發 MWPM 拓撲弦匹配與任意子湮滅 (Trigger MWPM Correction)
   */
  public triggerMwpmCorrection(): void {
    this.state.physicalErrorRateP = 0.0025; // 恢復至安全容錯區間
    this.recalculatePhysics();
    this.state.regime = 'mwpm-topological-string-correction';
    this.playSyndromeExtractionBeep();
    this.playAnyonAnnihilationChord();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: SurfaceCodeRegime[] = [
      'quiescent-fault-tolerant-code-space',
      'active-syndrome-extraction-stabilizer',
      'mwpm-topological-string-correction',
      'logical-error-percolation-threshold'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    const nextRegime = regimes[(currentIndex + 1) % regimes.length];

    if (nextRegime === 'quiescent-fault-tolerant-code-space') {
      this.state.physicalErrorRateP = 0.0008; // 0.08%
      this.playAnyonAnnihilationChord();
    } else if (nextRegime === 'active-syndrome-extraction-stabilizer') {
      this.state.physicalErrorRateP = 0.005; // 0.5%
      this.playSyndromeExtractionBeep();
    } else if (nextRegime === 'mwpm-topological-string-correction') {
      this.triggerMwpmCorrection();
      return;
    } else {
      this.state.physicalErrorRateP = 0.018; // 1.8% 突破閾值
      this.playSyndromeExtractionBeep();
    }

    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<SurfaceCodeState> {
    return this.state;
  }
}

export const surfaceCodeEngine = new SurfaceCodeQuantumMemoryEngine();
