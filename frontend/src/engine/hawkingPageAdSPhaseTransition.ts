/**
 * 霍金-佩奇黑洞相變與全息引力凝聚反應堆
 * (Hawking-Page AdS Phase Transition & Holographic Gravitational Condensation)
 *
 * 核心物理理論：
 * 1. 霍金-佩奇相變 (Hawking-Page Phase Transition in AdS)：
 *    在反德西特時空 (AdS) 中，存在兩個具相同邊界溫度的引力幾何解：熱 AdS (Thermal AdS) 與史瓦西-AdS 大黑洞。
 *    在臨界霍金-佩奇溫度 T_HP = 3 / (2\pi L_AdS)，兩者吉布斯自由能反轉 \Delta F = F_BH - F_AdS = 0，
 *    發生一階拓撲引力相變。
 * 2. 全息禁閉-解禁閉對偶 (Holographic Confinement-Deconfinement)：
 *    根據 AdS/CFT 對偶，T < T_HP 時為熱 AdS 幾何，對偶於 N=4 超楊-米爾斯規範場論的顏色禁閉相 (O(1) 自由度)；
 *    T > T_HP 時為穩定大黑洞幾何，對偶於夸克-膠子等離子體解禁閉相 (O(N^2) 自由度)。
 * 3. 大黑洞與小黑洞分枝 (Large vs Small AdS Black Holes)：
 *    史瓦西-AdS 存在最小溫度 T_min = \sqrt{3} / (\pi L_AdS)。黑洞半徑 r_+ > L_AdS/\sqrt{3} 為正比熱穩定大黑洞；
 *    r_+ < L_AdS/\sqrt{3} 為負比熱不穩定小黑洞，因霍金輻射自發蒸發或坍縮。
 * 4. 拓撲黑洞熵與全息威爾森圈 (Black Hole Entropy & Polyakov Loop Order Parameter)：
 *    貝肯斯坦-霍金視界熵 S = A / (4 G_N) \propto r_+^2，波利亞科夫圈期望值 \langle L\rangle 扮演解禁閉序參量。
 */

export type HawkingPageRegime =
  | 'thermal-ads-confined-gas'        // 熱 AdS 幾何顏色禁閉相 (T < T_HP)
  | 'large-bh-deconfined-plasma'      // 大黑洞幾何解禁閉等離子相 (T > T_HP)
  | 'metastable-coexistence-threshold'// 臨界霍金-佩奇雙穩態相變點 (T ~ T_HP)
  | 'small-bh-evaporation-runaway';   // 負比熱小黑洞蒸發暴走態 (C_v < 0)

export interface HawkingPageState {
  adsRadiusL: number;                 // AdS 曲率半徑 L_AdS (1.0 ~ 15.0)
  boundaryTemperatureT: number;       // 邊界溫度 T (0.05 ~ 3.50)
  horizonRadiusRPlus: number;         // 黑洞視界半徑 r_+ (0.0 ~ 12.0)
  gaugeGroupRankN: number;            // 規範群秩數 N (大 N 極限, 10 ~ 100)
  regime: HawkingPageRegime;

  // 動態演算物理指標
  hawkingPageTempThp: number;         // 臨界霍金-佩奇溫度 T_HP = 3/(2\pi L)
  freeEnergyDifferenceDeltaF: number; // 自由能差 \Delta F = F_BH - F_AdS
  polyakovLoopExpectation: number;    // 波利亞科夫圈序參量 \langle L\rangle (0.0 ~ 1.0)
  blackHoleHorizonEntropyS: number;   // 視界貝肯斯坦-霍金熵 S (10^4 k_B)
  specificHeatCv: number;             // 比熱 C_V
  telemetryHistory: Array<{
    timestamp: number;
    temperature: number;
    freeEnergy: number;
    entropy: number;
  }>;
}

const STORAGE_KEY = 'newworld_hawking_page_ads_phase_transition_state_v1';

class HawkingPageAdSPhaseTransitionEngine {
  private state: HawkingPageState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): HawkingPageState {
    return {
      adsRadiusL: 4.0,
      boundaryTemperatureT: 0.35,
      horizonRadiusRPlus: 4.8,
      gaugeGroupRankN: 40,
      regime: 'large-bh-deconfined-plasma',
      hawkingPageTempThp: 0.119,
      freeEnergyDifferenceDeltaF: -18.5,
      polyakovLoopExpectation: 0.95,
      blackHoleHorizonEntropyS: 182.0,
      specificHeatCv: 42.6,
      telemetryHistory: []
    };
  }

  private loadState(): HawkingPageState {
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

  public getState(): HawkingPageState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    const L = s.adsRadiusL;

    // 1. 臨界霍金-佩奇溫度 T_HP = 3 / (2\pi L)
    s.hawkingPageTempThp = Number((3 / (2 * Math.PI * L)).toFixed(3));

    // 2. 最小存在溫度 T_min = 0.85 * T_HP
    const tMin = 0.85 * s.hawkingPageTempThp;

    // 3. 視界半徑由溫度反算或設定
    if (s.boundaryTemperatureT < tMin) {
      // 低於最小溫度無法形成黑洞，只能為熱 AdS
      s.freeEnergyDifferenceDeltaF = Number((15.0 * (tMin - s.boundaryTemperatureT)).toFixed(2));
      s.polyakovLoopExpectation = Number(Math.max(0.01, 0.05 * (s.boundaryTemperatureT / tMin)).toFixed(3));
      s.blackHoleHorizonEntropyS = 0.0;
      s.specificHeatCv = 0.0;
      s.regime = 'thermal-ads-confined-gas';
    } else {
      // 大黑洞半徑 r_+ (在 T_HP 時 r_+ = L，T > T_HP 時 r_+ > L，T < T_HP 時 r_+ < L)
      const tempRatio = s.boundaryTemperatureT / s.hawkingPageTempThp;
      const rLarge = L * (0.577 + 0.423 * Math.pow(tempRatio, 1.2));
      s.horizonRadiusRPlus = Number(rLarge.toFixed(2));

      // 自由能差 \Delta F = \frac{\pi r_+^2 (L^2 - r_+^2)}{4 L^2}
      const deltaF = (Math.PI * s.horizonRadiusRPlus * s.horizonRadiusRPlus * (L * L - s.horizonRadiusRPlus * s.horizonRadiusRPlus)) / (4 * L * L);
      s.freeEnergyDifferenceDeltaF = Number(deltaF.toFixed(2));

      // 熵 S \propto N^2 r_+^2
      s.blackHoleHorizonEntropyS = Number(((s.gaugeGroupRankN * s.gaugeGroupRankN / 16) * s.horizonRadiusRPlus * s.horizonRadiusRPlus / (L * L)).toFixed(1));

      // 比熱 C_V
      s.specificHeatCv = Number((2 * Math.PI * s.horizonRadiusRPlus * s.horizonRadiusRPlus).toFixed(1));

      // 狀態分類
      if (Math.abs(s.boundaryTemperatureT - s.hawkingPageTempThp) < 0.02 || Math.abs(s.freeEnergyDifferenceDeltaF) <= 5.0) {
        s.polyakovLoopExpectation = 0.50;
        s.regime = 'metastable-coexistence-threshold';
      } else if (s.freeEnergyDifferenceDeltaF < 0) {
        s.polyakovLoopExpectation = Number(Math.min(1.0, 0.5 + 0.5 * Math.tanh(-s.freeEnergyDifferenceDeltaF / 20.0)).toFixed(3));
        s.regime = 'large-bh-deconfined-plasma';
      } else {
        s.polyakovLoopExpectation = 0.12;
        s.regime = 'thermal-ads-confined-gas';
      }
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
        temperature: this.state.boundaryTemperatureT,
        freeEnergy: this.state.freeEnergyDifferenceDeltaF,
        entropy: this.state.blackHoleHorizonEntropyS
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public heatBoundaryCFT(tempDelta: number = 0.15): void {
    this.state.boundaryTemperatureT = Number(Math.max(0.05, Math.min(3.50, this.state.boundaryTemperatureT + tempDelta)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(400, 750, 0.18, 'sawtooth');
  }

  public coolToThermalAdS(): void {
    this.state.boundaryTemperatureT = 0.08;
    this.recalculatePhysics();
    this.playTone(600, 240, 0.22, 'sine');
  }

  public tuneAdSCurvatureRadius(deltaL: number): void {
    this.state.adsRadiusL = Number(Math.max(1.0, Math.min(15.0, this.state.adsRadiusL + deltaL)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(320, 520, 0.16, 'triangle');
  }

  public triggerHawkingPageTransition(): void {
    // 設置在相變點
    this.state.boundaryTemperatureT = this.state.hawkingPageTempThp;
    this.recalculatePhysics();
    this.playTone(550, 900, 0.3, 'square');
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

export const hawkingPageAdSEngine = new HawkingPageAdSPhaseTransitionEngine();
