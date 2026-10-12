/**
 * AdS/CFT 蟲洞微觀態與哈密頓量截斷弦網張量重構機
 * (Holographic Black Hole Microstate Mesh & Fuzzball Tensor Network Engine)
 *
 * 核心物理理論：
 * 1. 絨毛球假說 (Fuzzball Hypothesis) 與平滑微觀態幾何 (Superstrata)：
 *    在弦理論中，經典貝肯斯坦-霍金黑洞之事件視界與內部奇異點，本質上是大量
 *    微觀量子重力幾何態 (Microstates) 的統計粗粒化平均。單一微觀態在普朗克尺度下
 *    完全平滑、無視界且無奇點，由 D1-D5-P 弦膜荷構成緊緻化幾何冠帽 (Geometric Cap)。
 * 2. 全息張量網絡 (HaPPY Holographic Tensor Network) 與體空間湧現：
 *    利用完美張量 (Perfect Tensors) 構建雙曲彭加萊圓盤晶格 MERA/HaPPY 編碼網絡。
 *    邊界 CFT 量子糾錯碼將局部量子位元非局域編碼至體空間深處，
 *    實現雙曲幾何度規在離散量子糾纏網絡中的自然湧現。
 * 3. 突破無毛定理之高階多極矩 (Multipole Moments) 與量子引力回波：
 *    微觀態幾何破缺完全球對稱性，展現非平凡質量/自旋高階多極矩 (M_\ell, S_\ell)。
 *    引力波穿透至普朗克尺度表面時產生部分量子反射，產生等間距微觀態重力回波 (Echoes)。
 */

export type HoloMicrostateRegime =
  | 'fuzzball-smooth-microstate'      // 絨毛球平滑無視界超重力幾何相 (無奇異點)
  | 'tensor-network-mera-emergence'   // MERA/HaPPY 完美張量網絡幾何湧現相
  | 'multipole-structure-resolution'  // 黑洞微觀態高階多極矩全息重構相 (突破無毛定理)
  | 'gravitational-quantum-echo';     // 量子視界重力回波干涉相 (普朗克反射)

export interface HoloMicrostateState {
  microstateDimensionLog10: number;   // 微觀態 Hilbert 空間維度 log10(D) (2.0 ~ 12.0)
  stringChargeProductQ: number;       // D1-D5-P 弦荷乘積 Q_1 Q_5 Q_p (10 ~ 1200)
  tensorNetworkDepth: number;         // 張量網絡深度層級 (3 ~ 12 層)
  echoReflectivityPercent: number;    // 視界表面量子回波反射率 % (0.0 ~ 99.0)
  fuzzballCapRadiusPlanck: number;    // 幾何冠帽半徑 r_cap (\ell_p, 1.0 ~ 25.0)
  regime: HoloMicrostateRegime;

  // 動態演算物理指標
  microstateEntropyBekenstein: number; // 統計微觀態熵 S = \ln \Omega
  multipoleMomentsCount: number;       // 可解析非零多極矩數量
  tensorContractionFidelity: number;   // 張量網絡全息重構保真度 (0.0 ~ 1.0)
  echoDelayTimeMilliSec: number;       // 引力波回波延遲時間 \Delta t_echo (ms)
  geometricSmoothnessIndex: number;    // 幾何平滑無視點度量 (0.0 ~ 1.0)
  telemetryHistory: Array<{
    timestamp: number;
    entropy: number;
    fidelity: number;
    echoDelayMs: number;
  }>;
}

const STORAGE_KEY = 'newworld_holo_microstate_state_v1';

class HolographicMicrostateEngine {
  private state: HoloMicrostateState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): HoloMicrostateState {
    return {
      microstateDimensionLog10: 7.5,
      stringChargeProductQ: 320,
      tensorNetworkDepth: 6,
      echoReflectivityPercent: 68.5,
      fuzzballCapRadiusPlanck: 4.8,
      regime: 'fuzzball-smooth-microstate',
      microstateEntropyBekenstein: 112.5,
      multipoleMomentsCount: 32,
      tensorContractionFidelity: 0.985,
      echoDelayTimeMilliSec: 28.4,
      geometricSmoothnessIndex: 0.99,
      telemetryHistory: []
    };
  }

  private loadState(): HoloMicrostateState {
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

  public getState(): HoloMicrostateState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<HoloMicrostateState, 'microstateDimensionLog10' | 'stringChargeProductQ' | 'tensorNetworkDepth' | 'echoReflectivityPercent' | 'fuzzballCapRadiusPlanck' | 'regime'>>): void {
    if (params.microstateDimensionLog10 !== undefined) {
      this.state.microstateDimensionLog10 = Math.max(2.0, Math.min(12.0, Number(params.microstateDimensionLog10)));
    }
    if (params.stringChargeProductQ !== undefined) {
      this.state.stringChargeProductQ = Math.max(10, Math.min(1200, Math.round(Number(params.stringChargeProductQ))));
    }
    if (params.tensorNetworkDepth !== undefined) {
      this.state.tensorNetworkDepth = Math.max(3, Math.min(12, Math.round(Number(params.tensorNetworkDepth))));
    }
    if (params.echoReflectivityPercent !== undefined) {
      this.state.echoReflectivityPercent = Math.max(0.0, Math.min(99.0, Number(params.echoReflectivityPercent)));
    }
    if (params.fuzzballCapRadiusPlanck !== undefined) {
      this.state.fuzzballCapRadiusPlanck = Math.max(1.0, Math.min(25.0, Number(params.fuzzballCapRadiusPlanck)));
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

  public emitEchoWavepacket(): void {
    // 發射一次測試重力波探針並捕捉微觀態反射回波
    this.state.echoDelayTimeMilliSec = Number((this.state.echoDelayTimeMilliSec + 1.5).toFixed(1));
    this.state.multipoleMomentsCount += 2;
    this.playTone(830.61, 'triangle'); // G#5
    this.saveState();
  }

  public toggleFuzzballCap(): void {
    // 快速切換平滑冠帽 ⇄ 張量幾何湧現
    if (this.state.regime !== 'fuzzball-smooth-microstate') {
      this.state.regime = 'fuzzball-smooth-microstate';
    } else {
      this.state.regime = 'tensor-network-mera-emergence';
    }
    this.recalculatePhysics();
    this.playTone(523.25, 'sine'); // C5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { microstateDimensionLog10, stringChargeProductQ, tensorNetworkDepth, echoReflectivityPercent, fuzzballCapRadiusPlanck, regime } = this.state;

    // 1. 貝肯斯坦-霍金微觀態熵 S \approx 2\pi \sqrt{Q_1 Q_5 Q_p}
    const chargeEntropy = 2.0 * Math.PI * Math.sqrt(stringChargeProductQ);
    this.state.microstateEntropyBekenstein = Number((chargeEntropy * (microstateDimensionLog10 / 8.0)).toFixed(1));

    // 2. 張量網絡重構保真度 (隨深度穩定)
    const fidelity = 1.0 - (0.08 / Math.max(1, tensorNetworkDepth));
    this.state.tensorContractionFidelity = Number(fidelity.toFixed(3));

    // 3. 多極矩數量
    this.state.multipoleMomentsCount = Math.round(12 + (stringChargeProductQ / 30.0) + tensorNetworkDepth * 2);

    // 4. 引力波回波延遲時間 \Delta t_echo \propto M \ln(M/\ell_p)
    this.state.echoDelayTimeMilliSec = Number((
      Math.sqrt(stringChargeProductQ) * 1.45 + (fuzzballCapRadiusPlanck * 0.5)
    ).toFixed(1));

    // 5. 幾何平滑性指數
    if (regime === 'fuzzball-smooth-microstate') {
      this.state.geometricSmoothnessIndex = 0.99;
    } else if (regime === 'gravitational-quantum-echo') {
      this.state.geometricSmoothnessIndex = Number((echoReflectivityPercent / 100.0).toFixed(2));
    } else {
      this.state.geometricSmoothnessIndex = 0.94;
    }
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.cos(now * 0.003) * 0.02;
    this.state.tensorContractionFidelity = Math.max(0.1, Number((this.state.tensorContractionFidelity + drift * delta * 0.01).toFixed(3)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        entropy: this.state.microstateEntropyBekenstein,
        fidelity: this.state.tensorContractionFidelity,
        echoDelayMs: this.state.echoDelayTimeMilliSec
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

  private playTone(freq = 440.0, type: OscillatorType = 'sine'): void { // A4
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

export const holographicMicrostateEngine = new HolographicMicrostateEngine();
