/**
 * 拓撲量子自旋霍爾螺旋邊緣態與分數量子電荷孤子引擎
 * (Quantum Spin Hall Helical Edge & Fractional Soliton Charge Separation Engine)
 *
 * 核心物理理論：
 * 1. 量子自旋霍爾效應與 BHZ 能帶反轉 (Quantum Spin Hall Effect & BHZ Band Inversion)：
 *    在 HgTe/CdTe 二維半導體量子阱中，當量子阱厚度 $d$ 超過臨界厚度 $d_c \approx 6.3\text{ nm}$ 時，
 *    強自旋-軌道耦合促使倒置能帶結構形成，體態質量項 $M = \epsilon_s - \epsilon_p < 0$，
 *    系統跨越拓撲量子相變，進入時間反演不變量 $\mathbb{Z}_2 = 1$ 的二維拓撲絕緣體相。
 * 2. 螺旋邊緣態與零背向散射 (Helical Edge States & Zero Backscattering)：
 *    樣品一維物理邊界上受時間反演對稱性 ($\mathcal{T}^2 = -1$) 保護，湧現無能隙交叉狄拉克邊緣態：
 *    動量 $+k$ 的右行電子嚴格極化為自旋向上 $|\uparrow\rangle$，動量 $-k$ 的左行電子嚴格極化為自旋向下 $|\downarrow\rangle$。
 *    克拉莫斯定理 (Kramers Theorem) 禁戒非磁性雜質誘發的自旋翻轉，實現無耗散彈道傳輸，雙端量子化電導精確為：
 *    G = 2 \frac{e^2}{h} \approx 77.48\ \mu\text{S}
 * 3. 磁性疇壁與 Jackiw-Rebbi 分數量子化電荷 (Magnetic Domain Wall & Fractional Soliton)：
 *    若在螺旋邊界透過磁性絕緣體鄰近效應引入局部交換場 $m_z(x) \sigma_z$，邊界狄拉克錐打開質量能隙。
 *    當磁化反轉形成疇壁 ($m_z(x)$ 由負變正) 時，由 Jackiw-Rebbi 機制在疇壁處必然束縛一個中性零能費米子模，
 *    導致該拓撲孤子激發攜帶精確的半整數分數量子電荷：
 *    Q_{\text{soliton}} = \pm \frac{e}{2}
 * 4. 自旋-電荷分離 (Spin-Charge Separation)：
 *    在分數量子孤子激發中，電荷自由度 ($e/2$) 與自旋自由度 ($S = 0$ 或 $S = 1/2$) 發生解耦，
 *    展現一維強關聯 Tomonaga-Luttinger 液體的分餾化本徵特性。
 */

export type QSHRegime =
  | 'normal-band-insulator'               // 平庸正常帶絕緣相 (d < d_c, M > 0, 無邊緣態)
  | 'topological-qsh-helical-edge'        // 量子自旋霍爾螺旋邊緣態 (d > d_c, G = 2 e^2/h, 零背散射)
  | 'magnetic-domain-wall-gap'            // 磁性交換場能隙開啟相 (破缺時間反演, 狄拉克錐打開)
  | 'fractional-soliton-confinement';     // Jackiw-Rebbi 分數電荷 (e/2) 孤子束縛態

export interface QuantumSpinHallState {
  quantumWellThicknessNm: number;         // 量子阱厚度 d (4.0 ~ 9.0 nm, d_c ≈ 6.3 nm)
  spinOrbitCouplingEv: number;            // 自旋-軌道耦合強度 \lambda_SOC (0.1 ~ 0.8 eV)
  magneticExchangeFieldTesla: number;     // 邊界磁性交換場 B_ex (0 ~ 5.0 Tesla)
  luttingerInteractionK: number;          // 魯丁格相互作用參數 K (0.4 ~ 1.0, 1 為無相互作用)
  regime: QSHRegime;

  // 動態演算物理指標
  bandInversionMassMev: number;           // BHZ 能帶質量參數 M (meV, < 0 為拓撲反轉)
  quantizedConductanceMicroSiemens: number;// 雙端電導 G (\mu S)
  helicalDriftVelocityKmS: number;        // 螺旋邊緣態費米漂移速度 v_F (km/s)
  solitonFractionalChargeE: number;       // 疇壁孤子分數電荷 Q/e (0 或 \pm 0.5)
  backscatteringSuppressionPercent: number;// 背向散射抑制率 (0 ~ 100%)
  solitonCreationsCount: number;          // 累計孤子創生次數
  telemetryHistory: Array<{
    timestamp: number;
    thickness: number;
    conductance: number;
    mass: number;
  }>;
}

const STORAGE_KEY = 'newworld_quantum_spin_hall_fractional_soliton_state_v1';
const D_CRIT_NM = 6.3; // 臨界厚度 6.3 nm

class QuantumSpinHallEngine {
  private state: QuantumSpinHallState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): QuantumSpinHallState {
    return {
      quantumWellThicknessNm: 7.2,         // 7.2 nm (處於拓撲能帶反轉區)
      spinOrbitCouplingEv: 0.38,
      magneticExchangeFieldTesla: 0.0,     // 零磁場時間反演守恆
      luttingerInteractionK: 0.82,
      regime: 'topological-qsh-helical-edge',
      bandInversionMassMev: -14.5,
      quantizedConductanceMicroSiemens: 77.48, // 2 e^2/h
      helicalDriftVelocityKmS: 550.0,
      solitonFractionalChargeE: 0.5,
      backscatteringSuppressionPercent: 99.8,
      solitonCreationsCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): QuantumSpinHallState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.getDefaultState(),
            ...parsed,
            telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
          };
        }
      }
    } catch (e) {
      console.warn('[QuantumSpinHallEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[QuantumSpinHallEngine] 儲存失敗', e);
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
   * 播放螺旋邊緣態雙聲道自旋極化啁啾音 (Helical Counter-Propagating Binaural Chirp)
   */
  public playHelicalEdgeBinauralChirp(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // 左耳下掃 (自旋向下逆行)
      const oscL = ctx.createOscillator();
      const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gainL = ctx.createGain();

      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(660, ctx.currentTime);
      oscL.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.35);

      gainL.gain.setValueAtTime(0.001, ctx.currentTime);
      gainL.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
      gainL.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      if (pannerL) {
        pannerL.pan.setValueAtTime(-0.85, ctx.currentTime);
        oscL.connect(pannerL);
        pannerL.connect(gainL);
      } else {
        oscL.connect(gainL);
      }
      gainL.connect(ctx.destination);
      oscL.start();
      oscL.stop(ctx.currentTime + 0.45);

      // 右耳上掃 (自旋向上順行)
      const oscR = ctx.createOscillator();
      const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gainR = ctx.createGain();

      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(330, ctx.currentTime);
      oscR.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.35);

      gainR.gain.setValueAtTime(0.001, ctx.currentTime);
      gainR.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
      gainR.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      if (pannerR) {
        pannerR.pan.setValueAtTime(0.85, ctx.currentTime);
        oscR.connect(pannerR);
        pannerR.connect(gainR);
      } else {
        oscR.connect(gainR);
      }
      gainR.connect(ctx.destination);
      oscR.start();
      oscR.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn('[QuantumSpinHallEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放 Jackiw-Rebbi 分數電荷 (e/2) 孤子捕獲高頻共鳴音 (Fractional Soliton Ping)
   */
  public playFractionalSolitonCaptureSound(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1650, ctx.currentTime + 0.25);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1300, ctx.currentTime);
      filter.Q.setValueAtTime(8.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('[QuantumSpinHallEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算 BHZ 質量、電導量子化、邊緣費米速度與孤子電荷
   */
  public recalculatePhysics(): void {
    const d = this.state.quantumWellThicknessNm;
    const soc = Math.max(0.05, this.state.spinOrbitCouplingEv);
    const B = Math.max(0, this.state.magneticExchangeFieldTesla);

    // 1. BHZ 能帶質量 M(d) \approx -18.0 * (d - d_c) meV
    const massMev = -18.5 * (d - D_CRIT_NM);
    this.state.bandInversionMassMev = Number(massMev.toFixed(2));
    const isTopological = massMev < 0;

    // 2. 邊緣態電導量子化 G
    // 當處於拓撲相 (M < 0) 且外加磁性交換場 B 為零時，G = 2 e^2/h = 77.48 \mu S
    // 若外加磁場破壞時間反演對稱性，能隙打開，電導崩塌
    let conductance = 0.0;
    if (isTopological) {
      const gapSuppression = 1.0 / (1.0 + Math.pow(B * 3.5, 2));
      conductance = 77.48 * gapSuppression;
      this.state.backscatteringSuppressionPercent = Number((99.9 * gapSuppression).toFixed(1));
    } else {
      conductance = 0.5; // 平庸絕緣體殘留漏電導
      this.state.backscatteringSuppressionPercent = 0.0;
    }
    this.state.quantizedConductanceMicroSiemens = Number(conductance.toFixed(2));

    // 3. 螺旋費米速度 v_F \approx \frac{A}{\hbar} \sim 5.5 * 10^5 m/s
    const vf = isTopological ? Math.min(800.0, Math.max(100.0, 520.0 + soc * 180.0)) : 0.0;
    this.state.helicalDriftVelocityKmS = Number(vf.toFixed(1));

    // 4. Jackiw-Rebbi 分數電荷 Q/e
    // 當能帶反轉且存在疇壁 (B > 0.5 Tesla) 時，激發精確 e/2 孤子
    if (isTopological && B > 0.4) {
      this.state.solitonFractionalChargeE = 0.5;
    } else if (isTopological) {
      this.state.solitonFractionalChargeE = 0.5;
    } else {
      this.state.solitonFractionalChargeE = 0.0;
    }

    // 5. 相態邏輯判定
    if (!isTopological) {
      this.state.regime = 'normal-band-insulator';
    } else if (B >= 1.5) {
      this.state.regime = 'fractional-soliton-confinement';
    } else if (B > 0.05) {
      this.state.regime = 'magnetic-domain-wall-gap';
    } else {
      this.state.regime = 'topological-qsh-helical-edge';
    }
  }

  public update(deltaSeconds: number): void {
    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        thickness: this.state.quantumWellThicknessNm,
        conductance: this.state.quantizedConductanceMicroSiemens,
        mass: this.state.bandInversionMassMev
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setWellThickness(nm: number): void {
    this.state.quantumWellThicknessNm = Math.max(4.0, Math.min(9.0, nm));
    this.recalculatePhysics();
    this.saveState();
  }

  public setSpinOrbitCoupling(socEv: number): void {
    this.state.spinOrbitCouplingEv = Math.max(0.1, Math.min(0.8, socEv));
    this.recalculatePhysics();
    this.saveState();
  }

  public setExchangeField(tesla: number): void {
    this.state.magneticExchangeFieldTesla = Math.max(0, Math.min(5.0, tesla));
    this.recalculatePhysics();
    this.saveState();
  }

  public setExchangeFieldTesla(tesla: number): void {
    this.setExchangeField(tesla);
  }

  /**
   * 激發磁性疇壁創生 Jackiw-Rebbi 分數電荷孤子 (Trigger Soliton Domain Wall)
   */
  public triggerSolitonCreation(): void {
    this.state.quantumWellThicknessNm = 7.5;
    this.state.magneticExchangeFieldTesla = 2.2;
    this.state.solitonCreationsCount += 1;
    this.state.regime = 'fractional-soliton-confinement';
    this.recalculatePhysics();
    this.playFractionalSolitonCaptureSound();
    this.playHelicalEdgeBinauralChirp();
    this.saveState();
  }

  public createFractionalSoliton(): void {
    this.triggerSolitonCreation();
  }

  public cycleRegime(): void {
    const regimes: QSHRegime[] = [
      'normal-band-insulator',
      'topological-qsh-helical-edge',
      'magnetic-domain-wall-gap',
      'fractional-soliton-confinement'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'normal-band-insulator') {
      this.state.quantumWellThicknessNm = 5.2; // d < d_c
      this.state.magneticExchangeFieldTesla = 0.0;
    } else if (this.state.regime === 'topological-qsh-helical-edge') {
      this.state.quantumWellThicknessNm = 7.2;
      this.state.magneticExchangeFieldTesla = 0.0;
      this.playHelicalEdgeBinauralChirp();
    } else if (this.state.regime === 'magnetic-domain-wall-gap') {
      this.state.quantumWellThicknessNm = 7.2;
      this.state.magneticExchangeFieldTesla = 0.6;
    } else {
      this.triggerSolitonCreation();
      return;
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<QuantumSpinHallState> {
    return this.state;
  }
}

export const quantumSpinHallEngine = new QuantumSpinHallEngine();
