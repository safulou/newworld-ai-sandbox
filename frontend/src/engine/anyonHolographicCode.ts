/**
 * 非阿貝爾任意子全息量子糾錯編碼室 (Non-Abelian Anyon Holographic Surface Code)
 * 
 * 理論基礎：
 * 1. 斐波那契非阿貝爾任意子 (Fibonacci Anyons) 與全息量子糾錯碼 (HaPPY Code, Pastawski et al. 2015)
 * 2. 任意子融合規則 τ × τ = 1 + τ，量子維度為黃金比例 d_τ = (1 + √5)/2 ≈ 1.618
 * 3. 雙曲五邊形 AdS/CFT 體積張量網絡保護邊界邏輯量子位元，實現超多項式拓撲量子容錯
 * 4. 4 大編碼體制：
 *    - happy_pentagon_code: 五邊形 AdS3/CFT2 HaPPY 全息表面碼
 *    - fibonacci_braiding: 斐波那契任意子編織量子閘
 *    - stabilizer_syndrome: 拓撲穩定子校正矩陣
 *    - fault_tolerant_memory: 容錯量子邏輯記憶庫
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成黃金比例和弦、任意子融合相干音與全息症候群校正音
 * - HTML5 Canvas 2D 呈現龐加萊圓盤雙曲五邊形鋪砌幾何與任意子編織線段
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type HolographicCodeRegime = 
  | 'happy_pentagon_code' 
  | 'fibonacci_braiding' 
  | 'stabilizer_syndrome' 
  | 'fault_tolerant_memory';

export interface AnyonFusionRecord {
  id: string;
  channel: 'vacuum_1' | 'anyon_tau';
  goldenRatioWeight: number;
  logicalFidelityPercent: number;
  syndromeErrorCount: number;
  timestamp: number;
}

export interface AnyonCodeState {
  regime: HolographicCodeRegime;
  adsCurvatureRadius: number; // AdS 曲率半徑 R (1.0 ~ 8.0)
  codeDistanceD: number; // 代碼距離 d (3, 5, 7, 9)
  logicalQubitsCount: number; // 邏輯量子位元數
  physicalQubitsCount: number; // 物理張量節點數
  logicalErrorRatePercent: number; // 邏輯錯誤率
  anyonBraidingFidelity: number; // 編織保真度 (0 ~ 1.0)
  holographicEntropyFlux: number; // 全息糾纏熵通量
  fusionHistory: AnyonFusionRecord[];
  autoCorrect: boolean;
  totalSyndromesCorrected: number;
}

const STORAGE_KEY = 'newworld_anyon_holographic_code';

class AnyonHolographicEngine {
  private state: AnyonCodeState = {
    regime: 'happy_pentagon_code',
    adsCurvatureRadius: 3.2,
    codeDistanceD: 5,
    logicalQubitsCount: 6,
    physicalQubitsCount: 30,
    logicalErrorRatePercent: 0.0042,
    anyonBraidingFidelity: 0.9985,
    holographicEntropyFlux: 490.0,
    fusionHistory: [],
    autoCorrect: true,
    totalSyndromesCorrected: 19
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeHolography();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): AnyonCodeState {
    return { ...this.state, fusionHistory: [...this.state.fusionHistory] };
  }

  public setRegime(regime: HolographicCodeRegime): void {
    this.state.regime = regime;
    this.recomputeHolography();
    this.playGoldenRatioChord();
    this.saveState();
  }

  public setAdSCurvatureRadius(radius: number): void {
    this.state.adsCurvatureRadius = Math.max(1.0, Math.min(8.0, parseFloat(radius.toFixed(1))));
    this.recomputeHolography();
    this.saveState();
  }

  public setCodeDistance(d: number): void {
    this.state.codeDistanceD = Math.max(3, Math.min(9, d));
    this.recomputeHolography();
    this.saveState();
  }

  public setAutoCorrect(enabled: boolean): void {
    this.state.autoCorrect = enabled;
    this.saveState();
  }

  /**
   * 計算雙曲全息幾何與邏輯量子位元容錯率
   */
  public recomputeHolography(): void {
    const R = this.state.adsCurvatureRadius;
    const d = this.state.codeDistanceD;

    // 物理節點數 N_phys ∝ 5 * d * (R / 2)
    this.state.physicalQubitsCount = Math.floor(5 * d * (R * 0.4 + 0.6));
    this.state.logicalQubitsCount = Math.max(1, Math.floor(this.state.physicalQubitsCount / 5));

    // 邏輯錯誤率 (隨代碼距離指數級衰減 p_L ∝ p^(d/2))
    const decay = Math.pow(0.12, d / 2.0) / (R + 0.5);
    this.state.logicalErrorRatePercent = parseFloat((decay * 10.0).toFixed(6));

    // 編織保真度 (黃金比例維度保護)
    this.state.anyonBraidingFidelity = parseFloat((0.9999 - decay * 0.05).toFixed(4));
  }

  /**
   * 執行斐波那契任意子融合測試 (Fibonacci Anyon Fusion)
   */
  public performFibonacciFusion(): AnyonFusionRecord {
    this.recomputeHolography();
    // 融合結果遵從黃金比例概率：P(τ) = 1/φ ≈ 0.618, P(1) = 1/φ² ≈ 0.382
    const phi = 1.6180339887;
    const isTau = Math.random() < (1.0 / phi);
    const channel: 'vacuum_1' | 'anyon_tau' = isTau ? 'anyon_tau' : 'vacuum_1';

    const fidelity = parseFloat(((this.state.anyonBraidingFidelity * 100) * (0.998 + Math.random() * 0.002)).toFixed(2));
    const errors = Math.floor(Math.random() * 2);

    const record: AnyonFusionRecord = {
      id: `fusion-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      channel,
      goldenRatioWeight: isTau ? phi : 1.0,
      logicalFidelityPercent: Math.min(100, fidelity),
      syndromeErrorCount: errors,
      timestamp: Date.now()
    };

    this.state.fusionHistory.unshift(record);
    if (this.state.fusionHistory.length > 20) {
      this.state.fusionHistory.pop();
    }

    this.state.totalSyndromesCorrected += (1 + errors);
    this.state.holographicEntropyFlux += 42.0 * record.goldenRatioWeight;

    this.playAnyonFusionTone(channel === 'anyon_tau');
    this.saveState();
    return record;
  }

  /**
   * 提取拓撲穩定子症候群校正子 (Syndrome Extraction)
   */
  public extractSyndrome(): void {
    this.state.holographicEntropyFlux += 65.0;
    this.state.totalSyndromesCorrected += 2;
    this.playSyndromeDecodePing();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoCorrect) {
      this.state.holographicEntropyFlux += delta * (1.1 + this.state.logicalQubitsCount * 0.3);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playGoldenRatioChord(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // 以黃金比例 φ = 1.618 建立非對稱頻率音階
      const base = 432.0; // 宇宙調諧 A
      const freqs = [base, base * 1.618, base * (1.618 * 1.618)];
      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);

        gain.gain.setValueAtTime(0.0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.42);
      });
    } catch {
      // 容錯靜音
    }
  }

  public playAnyonFusionTone(isTau: boolean): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = isTau ? 'triangle' : 'sine';
      const freq = isTau ? 698.46 : 523.25; // F5 or C5
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.2);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // 容錯靜音
    }
  }

  public playSyndromeDecodePing(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880.0, now);
      osc.frequency.linearRampToValueAtTime(1320.0, now + 0.15);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // 容錯靜音
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 忽略儲存例外
    }
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch {
      // 忽略載入例外
    }
  }
}

export const anyonHolographicEngine = new AnyonHolographicEngine();
