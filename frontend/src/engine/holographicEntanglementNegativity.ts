/**
 * 🌌 全息共形反常與 AdS/CFT 糾纏負度引擎
 * Holographic Conformal Anomaly & Entanglement Negativity in AdS/CFT Engine
 *
 * 理論物理基礎：
 * 1. Ryu-Takayanagi (RT) 幾何公式與共形反常中央荷 (Central Charge c)：
 *    在 AdS_3/CFT_2 全息對偶中，CFT 真空態之單區間糾纏熵由雙曲幾何中的最小測地線長度給出：
 *    S_A = \frac{\text{Length}(\gamma_A)}{4 G_N^{(3)}} = \frac{c}{3} \ln\left(\frac{l}{\epsilon}\right)
 *    布朗-亨諾 (Brown-Henneaux) 公式關聯體引力常數與邊界中央荷：c = \frac{3 R_{\text{AdS}}}{2 G_N^{(3)}}。
 * 2. 混合態量子糾纏純量：對數糾纏負度 (Logarithmic Entanglement Negativity, \mathcal{E})：
 *    對於邊界上分離的兩個子系統 A_1 (長度 l_1) 與 A_2 (長度 l_2)，其間隔距離為 d；
 *    馮·諾伊曼糾纏熵混雜古典關聯與熱熵，而糾纏負度嚴格過濾古典噪聲，僅量化純量子糾纏。
 * 3. 糾纏楔橫截面 (Entanglement Wedge Cross Section, EWCS E_W)：
 *    高柳 (Takayanagi) 與宇摩 (Umemoto) 的全息猜想：
 *    \mathcal{E}(A_1 : A_2) = \frac{3 E_W(A_1 : A_2)}{4 G_N^{(3)}} = \frac{c}{4} \ln\left[ \frac{(l_1 + d)(l_2 + d)}{d(l_1 + l_2 + d)} \right]
 * 4. 糾纏楔拓撲相變 (Entanglement Wedge Phase Transition)：
 *    當子區間間隔 d 超過幾何臨界距離 d_c = \sqrt{l_1 l_2} 時，
 *    體幾何中的糾纏楔斷裂為兩個互不相連的孤立區域，EWCS 發生一級拓撲跳變：
 *    E_W \equiv 0 \implies \mathcal{E} \equiv 0
 *    混合態量子糾纏完全淬火消失，僅存宏觀古典互資訊！
 */

export type HolographicNegativityRegime =
  | 'connected-entanglement-wedge-non-zero-negativity' // 連通糾纏楔相 (d < d_c, 體截面 E_W > 0, 真量子糾纏非零)
  | 'disjoint-disconnected-wedge-vanishing-negativity'// 分離斷開糾纏楔相 (d > d_c, E_W = 0, 負度為零)
  | 'critical-conformal-cross-section-transition'      // 臨界共形橫截面拓撲相變相 (d ≈ d_c, 體測地線重聯)
  | 'large-central-charge-thermal-holo-plasma';        // 大中央荷高溫全息等離子體相 (BTZ 黑洞幾何熱化效應)

export interface HolographicNegativityState {
  centralChargeC: number;                  // 邊界共形場論中央荷 c (1.0 ~ 50.0, 典型 12.0)
  subsystemLengthL1: number;               // 子區間 A_1 長度 l_1 (10.0 ~ 100.0)
  subsystemLengthL2: number;               // 子區間 A_2 長度 l_2 (10.0 ~ 100.0)
  intervalSeparationD: number;             // 區間間隔距離 d (1.0 ~ 120.0)
  temperatureKelvin: number;               // 全息等離子體溫度 T (0.0 ~ 5.0, 0 為純態 AdS)
  regime: HolographicNegativityRegime;

  // 動態演算物理指標
  entanglementWedgeCrossSectionEW: number; // 糾纏楔橫截面長度 E_W
  logarithmicNegativityE: number;          // 對數糾纏負度 \mathcal{E}
  mutualInformationI: number;              // 互資訊 I(A_1 : A_2)
  criticalSeparationDc: number;            // 臨界相變距離 d_c = sqrt(l_1 * l_2)
  ryuTakayanagiAreaA1: number;             // RT 測地線面積 S(A_1)
  accumulatedHoloProjectionsCount: number; // 累計全息投影重構週期數
}

const STORAGE_KEY = 'newworld_holographic_entanglement_negativity_state_v1';

class HolographicEntanglementNegativityEngine {
  private state: HolographicNegativityState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): HolographicNegativityState {
    return {
      centralChargeC: 12.0,
      subsystemLengthL1: 40.0,
      subsystemLengthL2: 40.0,
      intervalSeparationD: 15.0,
      temperatureKelvin: 0.0,
      regime: 'connected-entanglement-wedge-non-zero-negativity',
      entanglementWedgeCrossSectionEW: 2.15,
      logarithmicNegativityE: 3.42,
      mutualInformationI: 4.85,
      criticalSeparationDc: 40.0,
      ryuTakayanagiAreaA1: 14.76,
      accumulatedHoloProjectionsCount: 0
    };
  }

  private loadState(): HolographicNegativityState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.getDefaultState(),
            ...parsed
          };
        }
      }
    } catch (e) {
      console.warn('[HolographicNegativityEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[HolographicNegativityEngine] 儲存失敗', e);
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
   * 播放連通糾纏楔引力張力低音 (Entanglement Wedge Gravity Tone)
   */
  public playEntanglementTensionTone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('[HolographicNegativityEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放拓撲測地線重聯相變鐘琴滑音 (Phase Transition Glockenspiel Chirp)
   */
  public playPhaseTransitionBell(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const freqs = [550, 825, 1100];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.22);
      });
    } catch (e) {
      console.warn('[HolographicNegativityEngine] 音效播放異常', e);
    }
  }

  /**
   * 核心物理演算：計算 RT 測地線、EWCS 糾纏楔橫截面與對數糾纏負度
   */
  public recalculatePhysics(): void {
    const c = Math.max(1.0, this.state.centralChargeC);
    const l1 = Math.max(5.0, this.state.subsystemLengthL1);
    const l2 = Math.max(5.0, this.state.subsystemLengthL2);
    const d = Math.max(0.5, this.state.intervalSeparationD);
    const T = Math.max(0.0, this.state.temperatureKelvin);

    // 1. 臨界相變距離 d_c = sqrt(l1 * l2)
    const dc = Math.sqrt(l1 * l2);
    this.state.criticalSeparationDc = Number(dc.toFixed(2));

    // 2. 單區間 Ryu-Takayanagi 糾纏熵 S(A1) = (c/3) * ln(l1 / \epsilon)
    const epsilon = 0.1;
    const sA1 = (c / 3.0) * Math.log(l1 / epsilon);
    this.state.ryuTakayanagiAreaA1 = Number(sA1.toFixed(2));

    // 3. 互資訊 I(A1 : A2) = S(A1) + S(A2) - S(A1 U A2)
    // 當 d < dc 時連通：I = (c/3) * ln[(l1 + d)(l2 + d) / (d (l1 + l2 + d))]
    const arg = ((l1 + d) * (l2 + d)) / (d * (l1 + l2 + d));
    let mutualInfo = 0.0;
    if (arg > 1.0) {
      mutualInfo = (c / 3.0) * Math.log(arg);
    }
    this.state.mutualInformationI = Number(mutualInfo.toFixed(3));

    // 4. 全息對數糾纏負度 \mathcal{E} 與 EWCS
    // 當 d < dc 時，糾纏楔相連：\mathcal{E} = (c/4) * ln[ (l1 + d)(l2 + d) / (d (l1 + l2 + d)) ]
    let negativity = 0.0;
    let ewcs = 0.0;
    if (d < dc && arg > 1.0) {
      negativity = (c / 4.0) * Math.log(arg);
      // EWCS = (4 G_N / 3) * \mathcal{E}，代入 G_N = 3 / (2c) -> EWCS = (2/c) * \mathcal{E} = 0.5 * ln(arg)
      ewcs = 0.5 * Math.log(arg);

      // 高溫熱效應衰減
      if (T > 0.1) {
        const thermalSuppression = Math.exp(-T * 0.8);
        negativity *= thermalSuppression;
        ewcs *= thermalSuppression;
      }
    } else {
      // 一級相變斷開：EWCS 跌至 0，負度嚴格為零
      negativity = 0.0;
      ewcs = 0.0;
    }

    this.state.logarithmicNegativityE = Number(negativity.toFixed(3));
    this.state.entanglementWedgeCrossSectionEW = Number(ewcs.toFixed(3));

    // 5. 相態判定
    if (T > 2.0) {
      this.state.regime = 'large-central-charge-thermal-holo-plasma';
    } else if (Math.abs(d - dc) < 2.0) {
      this.state.regime = 'critical-conformal-cross-section-transition';
    } else if (d < dc) {
      this.state.regime = 'connected-entanglement-wedge-non-zero-negativity';
    } else {
      this.state.regime = 'disjoint-disconnected-wedge-vanishing-negativity';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime === 'connected-entanglement-wedge-non-zero-negativity') {
      this.state.accumulatedHoloProjectionsCount += Math.floor(deltaSeconds * 3);
    }
  }

  // --- 操作控制 API ---

  public setCentralCharge(c: number): void {
    this.state.centralChargeC = Math.max(1.0, Math.min(50.0, c));
    this.recalculatePhysics();
    this.saveState();
  }

  public setSubsystemLengthL1(l1: number): void {
    this.state.subsystemLengthL1 = Math.max(10.0, Math.min(100.0, l1));
    this.recalculatePhysics();
    this.saveState();
  }

  public setSubsystemLengthL2(l2: number): void {
    this.state.subsystemLengthL2 = Math.max(10.0, Math.min(100.0, l2));
    this.recalculatePhysics();
    this.saveState();
  }

  public setIntervalSeparationD(d: number): void {
    this.state.intervalSeparationD = Math.max(1.0, Math.min(120.0, d));
    this.recalculatePhysics();
    this.saveState();
  }

  public setTemperature(temp: number): void {
    this.state.temperatureKelvin = Math.max(0.0, Math.min(5.0, temp));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 觸發糾纏楔橫截面極大值重整 (Trigger Max Entanglement Wedge)
   */
  public triggerMaxEntanglementWedge(): void {
    this.state.subsystemLengthL1 = 50.0;
    this.state.subsystemLengthL2 = 50.0;
    this.state.intervalSeparationD = 5.0; // 緊密相鄰
    this.state.temperatureKelvin = 0.0;
    this.state.regime = 'connected-entanglement-wedge-non-zero-negativity';
    this.recalculatePhysics();
    this.playEntanglementTensionTone();
    this.playPhaseTransitionBell();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: HolographicNegativityRegime[] = [
      'connected-entanglement-wedge-non-zero-negativity',
      'critical-conformal-cross-section-transition',
      'disjoint-disconnected-wedge-vanishing-negativity',
      'large-central-charge-thermal-holo-plasma'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    const nextRegime = regimes[(currentIndex + 1) % regimes.length];

    if (nextRegime === 'connected-entanglement-wedge-non-zero-negativity') {
      this.state.intervalSeparationD = 10.0;
      this.state.temperatureKelvin = 0.0;
      this.playEntanglementTensionTone();
    } else if (nextRegime === 'critical-conformal-cross-section-transition') {
      this.state.intervalSeparationD = this.state.criticalSeparationDc;
      this.playPhaseTransitionBell();
    } else if (nextRegime === 'disjoint-disconnected-wedge-vanishing-negativity') {
      this.state.intervalSeparationD = this.state.criticalSeparationDc + 25.0;
      this.playPhaseTransitionBell();
    } else {
      this.state.temperatureKelvin = 3.5;
      this.playEntanglementTensionTone();
    }

    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<HolographicNegativityState> {
    return this.state;
  }
}

export const holographicNegativityEngine = new HolographicEntanglementNegativityEngine();
