/**
 * 多通道近藤效應與非費米液體奇異金屬反應堆
 * (Multi-Channel Kondo Effect & Non-Fermi Liquid Strange Metal Reactor)
 *
 * 核心物理理論：
 * 1. 雙通道近藤模型 (Two-Channel Kondo Model, 2CK) 與非費米液體臨界點：
 *    當單一局域磁性雜質自旋 (S = 1/2) 同時與 K = 2 個獨立傳導電子軌道通道
 *    進行反鐵磁交換作用 H_K = J_1 \mathbf{S}\cdot\mathbf{s}_1 + J_2 \mathbf{S}\cdot\mathbf{s}_2。
 *    在通道對稱極限 (J_1 = J_2)，電子雲無法形成單一完全屏蔽之單重態，
 *    系統流向著名之過度屏蔽 (Over-screened) 非費米液體 (NFL) 共形場論 (CFT) 量子臨界固定點。
 * 2. 殘餘拓撲分數熵與非阿貝爾馬約拉納費米子：
 *    在絕對零度 (T \to 0) 極限下，雜質自旋並不被完全淬滅，
 *    而是遺留非零分數殘餘熵：
 *    S_{\text{imp}}(0) = \frac{1}{2} \ln 2 \approx 0.3466，
 *    對應於雜質自由度分數化為束縛於臨界點的半個狄拉克費米子（即單個孤立馬約拉納零能模）。
 * 3. 奇異金屬奇異對數標度律 (Non-Fermi Liquid Singularities)：
 *    低溫比熱度係數 C/T \propto -\ln(T/T_K)、磁化率 \chi(T) \propto -\ln(T/T_K)
 *    以及微分電導率展現超越朗道費米液體理論之 \sqrt{T} 或 T 線性反常奇異特徵。
 */

export type MultiChannelKondoRegime =
  | 'two-channel-overscreened-nfl'     // 雙通道過度屏蔽非費米液體相 (殘餘 0.5 ln2 熵)
  | 'fermi-liquid-singlet-crossover'   // 通道各向異性費米液體交叉態 (完全屏蔽 Kondo 單重態)
  | 'quantum-critical-strange-metal'   // 量子臨界奇異金屬傳輸相 (非費米線性電阻)
  | 'non-abelian-majorana-entropy';    // 非阿貝爾殘餘馬約拉納熵鎖定態

export interface MultiChannelKondoState {
  kondoExchangeJkEv: number;          // 近藤反鐵磁交換耦合 J_K (eV, 0.05 ~ 3.0)
  channelAnisotropyDelta: number;     // 通道各向異性 (J_1 - J_2) / J_K (-1.0 ~ 1.0, 0 為完美對稱)
  impurityLevelEdEv: number;          // 雜質能階 \epsilon_d (eV, -4.0 ~ 1.0)
  kondoTemperatureTk: number;         // 近藤標度溫度 T_K (K, 0.5 ~ 120.0)
  temperatureKelvin: number;          // 操作溫度 T (K, 0.001 ~ 50.0)
  regime: MultiChannelKondoRegime;

  // 動態演算物理指標
  residualImpurityEntropy: number;    // 雜質殘餘熵 S_imp / k_B (NFL 相精確為 0.5 ln 2 ≈ 0.3466)
  magneticSusceptibilityLog: number;  // 奇異磁化率 \chi(T) (對數奇異增強)
  differentialConductanceE2H: number; // 低溫微分電導 G / (e^2/h)
  nonFermiLiquidWeight: number;       // 非費米液體相關權重 (0.0 ~ 1.0)
  majoranaCorrelationDegree: number;  // 孤立馬約拉納分數化相干度 (0.0 ~ 1.0)
  strangeMetalResistivityRatio: number; // 奇異金屬電阻率特徵比值
  telemetryHistory: Array<{
    timestamp: number;
    entropy: number;
    nflWeight: number;
    conductance: number;
  }>;
}

const STORAGE_KEY = 'newworld_multi_channel_kondo_state_v1';

class MultiChannelKondoEngine {
  private state: MultiChannelKondoState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): MultiChannelKondoState {
    return {
      kondoExchangeJkEv: 1.25,
      channelAnisotropyDelta: 0.0, // 完美對稱雙通道
      impurityLevelEdEv: -1.8,
      kondoTemperatureTk: 28.5,
      temperatureKelvin: 0.05,
      regime: 'two-channel-overscreened-nfl',
      residualImpurityEntropy: 0.3466, // 1/2 ln 2
      magneticSusceptibilityLog: 4.85,
      differentialConductanceE2H: 0.5, // 雙通道各貢獻 0.5
      nonFermiLiquidWeight: 0.98,
      majoranaCorrelationDegree: 0.96,
      strangeMetalResistivityRatio: 2.45,
      telemetryHistory: []
    };
  }

  private loadState(): MultiChannelKondoState {
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

  public getState(): MultiChannelKondoState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<MultiChannelKondoState, 'kondoExchangeJkEv' | 'channelAnisotropyDelta' | 'impurityLevelEdEv' | 'kondoTemperatureTk' | 'temperatureKelvin' | 'regime'>>): void {
    if (params.kondoExchangeJkEv !== undefined) {
      this.state.kondoExchangeJkEv = Math.max(0.05, Math.min(3.0, Number(params.kondoExchangeJkEv)));
    }
    if (params.channelAnisotropyDelta !== undefined) {
      this.state.channelAnisotropyDelta = Math.max(-1.0, Math.min(1.0, Number(params.channelAnisotropyDelta)));
    }
    if (params.impurityLevelEdEv !== undefined) {
      this.state.impurityLevelEdEv = Math.max(-4.0, Math.min(1.0, Number(params.impurityLevelEdEv)));
    }
    if (params.kondoTemperatureTk !== undefined) {
      this.state.kondoTemperatureTk = Math.max(0.5, Math.min(120.0, Number(params.kondoTemperatureTk)));
    }
    if (params.temperatureKelvin !== undefined) {
      this.state.temperatureKelvin = Math.max(0.001, Math.min(50.0, Number(params.temperatureKelvin)));
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

  public balanceChannelsSymmetry(): void {
    // 快速對齊雙通道各向同性 \Delta = 0
    this.state.channelAnisotropyDelta = 0.0;
    this.state.regime = 'two-channel-overscreened-nfl';
    this.recalculatePhysics();
    this.playTone(440.0, 'sine'); // A4
    this.saveState();
  }

  public tuneToMajoranaPoint(): void {
    // 鎖定非阿貝爾馬約拉納分數殘餘熵態
    this.state.channelAnisotropyDelta = 0.0;
    this.state.temperatureKelvin = 0.005;
    this.state.regime = 'non-abelian-majorana-entropy';
    this.recalculatePhysics();
    this.playTone(587.33, 'triangle'); // D5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { kondoExchangeJkEv, channelAnisotropyDelta, kondoTemperatureTk, temperatureKelvin, regime } = this.state;

    // 1. 通道各向異性與非費米液體權重 (當各向異性 |Δ| > 0 時，相關重整化群流向費米液體單重態)
    const isSymmetric = Math.abs(channelAnisotropyDelta) < 0.08;
    const nflDecay = Math.max(0.0, 1.0 - Math.abs(channelAnisotropyDelta) * 1.5);
    this.state.nonFermiLiquidWeight = Number(nflDecay.toFixed(2));

    // 2. 殘餘雜質熵 S_imp (在 NFL 對稱態下精確為 0.5 * ln 2 ≈ 0.3466)
    if (isSymmetric || regime === 'two-channel-overscreened-nfl' || regime === 'non-abelian-majorana-entropy') {
      this.state.residualImpurityEntropy = 0.3466; // 1/2 ln 2
      this.state.majoranaCorrelationDegree = 0.98;
      this.state.differentialConductanceE2H = 0.5;
    } else {
      // 偏離對稱性，雜質完全被主導通道屏蔽，S_imp -> 0
      this.state.residualImpurityEntropy = Number((0.3466 * (1.0 - Math.abs(channelAnisotropyDelta))).toFixed(4));
      this.state.majoranaCorrelationDegree = Number((1.0 - Math.abs(channelAnisotropyDelta)).toFixed(2));
      this.state.differentialConductanceE2H = Number((0.5 + Math.abs(channelAnisotropyDelta) * 0.5).toFixed(2));
    }

    // 3. 奇異磁化率 \chi(T) \propto -\ln(T/T_K)
    const tempRatio = Math.max(0.001, temperatureKelvin / kondoTemperatureTk);
    const logVal = -Math.log(tempRatio);
    this.state.magneticSusceptibilityLog = Number((Math.max(0.2, logVal * (1.0 + kondoExchangeJkEv * 0.3))).toFixed(2));

    // 4. 奇異金屬電阻率特徵比 (隨 NFL 權重增強)
    this.state.strangeMetalResistivityRatio = Number((
      1.0 + this.state.nonFermiLiquidWeight * 1.8 + Math.sqrt(tempRatio) * 0.6
    ).toFixed(2));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.cos(now * 0.0032) * 0.01;
    this.state.magneticSusceptibilityLog = Math.max(0.1, Number((this.state.magneticSusceptibilityLog + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        entropy: this.state.residualImpurityEntropy,
        nflWeight: this.state.nonFermiLiquidWeight,
        conductance: this.state.differentialConductanceE2H
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

  private playTone(freq = 392.0, type: OscillatorType = 'sine'): void { // G4
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

export const multiChannelKondoEngine = new MultiChannelKondoEngine();
