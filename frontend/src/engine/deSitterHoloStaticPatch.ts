/**
 * 德西特宇宙全息對偶與靜態膜極端熵反應堆
 * (de Sitter Static Patch Holography & Cosmological Horizon Entropy Reactor)
 *
 * 核心物理理論：
 * 1. 德西特空間 (dS_4) 與宇宙學視界 (Cosmological Horizon)：
 *    正宇宙常數 \Lambda > 0 導致度規 ds^2 = -(1 - H^2 r^2) dt^2 + (1 - H^2 r^2)^{-1} dr^2 + r^2 d\Omega^2。
 *    靜態膜 (Static Patch) 定義於觀測者世界線周圍半徑 r \le r_c = 1/H = l_{\text{dS}} 之因果鑽石區域內。
 * 2. 吉本斯-霍金視界熱力學 (Gibbons-Hawking Horizon Radiation & Entropy)：
 *    視界散發微觀量子熱輻射 T_{\text{GH}} = \frac{\hbar H}{2\pi k_B} \approx 10^{-30} \text{ K}。
 *    宇宙學視界面積蘊含可觀測宇宙之最大熱力學熵界：
 *    S_{\text{GH}} = \frac{k_B A_{\text{hor}}}{4 G \hbar} = \frac{\pi k_B c^3}{G \hbar \Lambda} \sim 10^{122} k_B。
 * 3. 靜態膜中 Type II_1 馮諾依曼代數 (Witten-Chandrasekaran dS Operator Algebra)：
 *    德西特緊緻視界使得觀測者代數不具備傳統 Type I 或 Type III_1 真空分解，
 *    而展現 Type II_1 因子代數：存在歸一化跡態 (Tr(I)=1) 與唯一的最大混合熱平衡態。
 * 4. 德西特量子島嶼與佩奇曲線 (Cosmological Quantum Islands & dS Page Transition)：
 *    當靜態膜內部存在微觀原初黑洞時，量子極值面 (QES) 跨越視界形成量子島，
 *    避免全息資訊悖論，霍金輻射與宇宙視界糾纏熵遵從德西特佩奇曲線。
 * 5. Coleman-De Luccia 真空泡泡核化 (Vacuum Bubble Nucleation Decay)：
 *    假真空向真真空或鄰近宇宙學極小值之量子穿隧核化，幾率 \Gamma \sim A e^{-B_{\text{CDL}}}。
 */

export type DeSitterRegime =
  | 'gibbons-hawking-thermal-equilibrium'  // 吉本斯-霍金宇宙學視界熱平衡態
  | 'witten-type-ii1-maximal-entropy'      // Witten Type II_1 馮諾依曼全息最大熵因子態
  | 'desitter-page-entanglement-transition'// 德西特佩奇島嶼糾纏轉折態 (QES 島嶼形成)
  | 'coleman-deluccia-bubble-nucleation';  // 真假真空泡泡量子穿隧核化態

export interface DeSitterHoloState {
  cosmologicalConstantLambda: number;      // 歸一化宇宙常數 \Lambda (10^-52 m^-2 基準, 0.2 ~ 8.0)
  hubbleExpansionRateH: number;            // 哈伯常數 H (km/s/Mpc, 30.0 ~ 120.0)
  staticPatchBlackHoleMassSolar: number;   // 內部微型黑洞質量 M_bh (M_\odot, 0.0 ~ 40.0)
  bubbleNucleationTension: number;         // 真空泡壁表面張力 \sigma (0.1 ~ 5.0)
  regime: DeSitterRegime;

  // 動態演算物理指標
  horizonRadiusLdsGigaLy: number;          // 宇宙學視界半徑 l_dS (十億光年, 8.0 ~ 60.0)
  gibbonsHawkingTempKelvin: number;        // 視界溫度 T_GH (10^-30 K, 0.5 ~ 15.0)
  gibbonsHawkingEntropyS120: number;       // 視界熵 S_GH (10^120 k_B, 1.0 ~ 35.0)
  pageEntanglementIslandRatio: number;     // 佩奇糾纏轉折島嶼覆蓋度 (0.0 ~ 1.0)
  vonNeumannMaximalEntropyRank: number;    // Type II_1 代數最大熵因子度 (0.0 ~ 1.0)
  maximalEntropySampleBoost: number;       // 全息採樣增益 (0.0 ~ 0.2)
  telemetryHistory: Array<{
    timestamp: number;
    horizonRadius: number;
    ghEntropy: number;
    islandRatio: number;
  }>;
}

const STORAGE_KEY = 'newworld_desitter_holo_static_patch_state_v1';

class DeSitterHoloEngine {
  private state: DeSitterHoloState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): DeSitterHoloState {
    return {
      cosmologicalConstantLambda: 1.10, // 典型加速膨脹宇宙
      hubbleExpansionRateH: 67.4,
      staticPatchBlackHoleMassSolar: 4.5,
      bubbleNucleationTension: 1.8,
      regime: 'gibbons-hawking-thermal-equilibrium',
      horizonRadiusLdsGigaLy: 16.2,
      gibbonsHawkingTempKelvin: 2.38,
      gibbonsHawkingEntropyS120: 12.4,
      pageEntanglementIslandRatio: 0.32,
      vonNeumannMaximalEntropyRank: 0.94,
      maximalEntropySampleBoost: 0.0,
      telemetryHistory: []
    };
  }

  private loadState(): DeSitterHoloState {
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
      // 略過儲存例外
    }
  }

  public getState(): DeSitterHoloState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // 視界半徑 l_dS \propto 1 / \sqrt{\Lambda}
    const safeLambda = Math.max(0.1, s.cosmologicalConstantLambda);
    s.horizonRadiusLdsGigaLy = Number((16.0 / Math.sqrt(safeLambda)).toFixed(2));

    // 哈伯膨脹率 H \propto \sqrt{\Lambda}
    s.hubbleExpansionRateH = Number((65.0 * Math.sqrt(safeLambda)).toFixed(1));

    // 吉本斯-霍金溫度 T_GH \propto H
    s.gibbonsHawkingTempKelvin = Number((2.3 * Math.sqrt(safeLambda)).toFixed(3));

    // 視界熵 S_GH \propto A_hor \propto l_dS^2 \propto 1 / \Lambda
    // 內部黑洞會佔用部分靜態膜體積，使宇宙學視界面積微小收縮 (Nariai 極限幾何)
    const massDeduction = (s.staticPatchBlackHoleMassSolar / 40.0) * 0.22;
    s.gibbonsHawkingEntropyS120 = Number(Math.max(0.5, ((14.0 / safeLambda) * (1.0 - massDeduction))).toFixed(2));

    // 佩奇量子島嶼轉折度：當黑洞蒸發至佩奇時間或黑洞質量與視界糾纏飽和
    const islandBase = (s.staticPatchBlackHoleMassSolar / 30.0) * (s.hubbleExpansionRateH / 70.0);
    s.pageEntanglementIslandRatio = Number(Math.max(0.0, Math.min(1.0, islandBase)).toFixed(3));

    // Type II_1 代數最大熵因子 (接近 1.0 表明完全飽和最大混態)
    const baseRank = 0.82 + 0.12 * (1.0 - massDeduction) + s.maximalEntropySampleBoost;
    s.vonNeumannMaximalEntropyRank = Number(Math.min(1.0, baseRank).toFixed(3));

    // 判斷系統狀態
    if (s.bubbleNucleationTension < 0.8) {
      s.regime = 'coleman-deluccia-bubble-nucleation';
    } else if (s.pageEntanglementIslandRatio > 0.65) {
      s.regime = 'desitter-page-entanglement-transition';
    } else if (s.vonNeumannMaximalEntropyRank >= 0.98) {
      s.regime = 'witten-type-ii1-maximal-entropy';
    } else {
      s.regime = 'gibbons-hawking-thermal-equilibrium';
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
        horizonRadius: this.state.horizonRadiusLdsGigaLy,
        ghEntropy: this.state.gibbonsHawkingEntropyS120,
        islandRatio: this.state.pageEntanglementIslandRatio
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public modulateCosmologicalConstant(deltaLambda: number): void {
    this.state.cosmologicalConstantLambda = Number(Math.max(0.2, Math.min(8.0, this.state.cosmologicalConstantLambda + deltaLambda)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(180, 240, 0.25, 'sine');
  }

  public injectStaticPatchMass(massDeltaSolar: number): void {
    this.state.staticPatchBlackHoleMassSolar = Number(Math.max(0.0, Math.min(40.0, this.state.staticPatchBlackHoleMassSolar + massDeltaSolar)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(120, 80, 0.3, 'sawtooth');
  }

  public triggerBubbleNucleation(): void {
    // 激發泡泡穿隧核化
    this.state.bubbleNucleationTension = 0.5;
    this.recalculatePhysics();
    this.playTone(400, 880, 0.35, 'square');
  }

  public sampleHorizonMicrostates(): void {
    // 重建 Type II_1 最大混態
    this.state.bubbleNucleationTension = 2.0;
    this.state.maximalEntropySampleBoost = 0.12;
    this.recalculatePhysics();
    this.playTone(520, 650, 0.18, 'triangle');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(200, 150, 0.2, 'sine');
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
      // 忽視靜音
    }
  }
}

export const deSitterHoloEngine = new DeSitterHoloEngine();
