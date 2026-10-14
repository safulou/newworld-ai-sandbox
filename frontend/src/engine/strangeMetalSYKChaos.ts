/**
 * 奇異金屬普朗克極限耗散與 SYK 模型全息量子混亂引擎
 * (Strange Metal Planckian Dissipation & SYK Holographic Quantum Chaos Engine)
 *
 * 核心物理理論：
 * 1. 奇異金屬與普朗克極限耗散 (Strange Metal & Planckian Dissipation Limit)：
 *    在高溫超導銅氧化物與重費米子量子臨界點附近，電子輸送徹底破壞朗道費米液體傳統準粒子圖像 ($T^2$ 電阻率失效)，
 *    展現廣泛溫度區間內嚴格線性的電阻率：$\rho(T) = \rho_0 + A T$。
 *    準粒子散射弛豫速率達到由海森堡不確定性與熱力學決定的普朗克極限：
 *    \frac{\hbar}{\tau_{\text{Planck}}} = C \cdot k_B T, \quad C \approx 1.0 \pm 0.2
 * 2. 薩赫德夫-葉-北田 (Sachdev-Ye-Kitaev, SYK) 全對全隨機模型：
 *    $N$ 個無序馬約拉納費米子 $\chi_i$ 具有隨機全對全四費米子相互作用：
 *    \mathcal{H}_{\text{SYK}} = \frac{1}{4!} \sum_{i,j,k,l=1}^N J_{ijkl} \chi_i \chi_j \chi_k \chi_l, \quad \overline{J_{ijkl}^2} = \frac{3! J^2}{N^3}
 *    在強耦合紅外低溫極限 ($1 \ll \beta J \ll N$)，模型自發湧現共形對稱性，展現非費米液體連續能譜。
 * 3. 飽和量子混亂上界與信息爬亂 (Saturated Quantum Chaos & Fast Scrambling)：
 *    時序倒序關聯函數 (Out-of-Time-Order Correlators, OTOC)：
 *    F(t) = \langle \chi_i(t) \chi_j(0) \chi_i(t) \chi_j(0) \rangle \approx 1 - \frac{c}{N} e^{\lambda_L t}
 *    其熱化李雅普諾夫指數 $\lambda_L$ 嚴格飽和 Maldacena-Shenker-Stanford (MSS) 極限：
 *    \lambda_L = \frac{2\pi k_B T}{\hbar}
 *    信息爬亂時間 (Scrambling Time) 達到自然界最快極限：$t_* = \frac{\hbar}{2\pi k_B T} \ln N$。
 * 4. AdS₂/CFT₁ 全息引力雙重對偶 (JT Gravity Duality)：
 *    SYK 模型低能有效作用量（施瓦茨作用量 Schwarzian action）與二維 Jackiw-Teitelboim (JT) 近反德西特 (AdS₂)
 *    黑洞邊界重參數化引力模式完全等價，提供可微觀求解的全息黑洞資訊熱化範式。
 */

export type StrangeMetalRegime =
  | 'fermi-liquid-sub-planckian'          // 傳統低溫費米液體相 (T << T_FL, \rho ~ T^2)
  | 'strange-metal-planckian-linear'      // 奇異金屬普朗克極限耗散相 (\rho ~ T, \tau ~ \hbar / k_B T)
  | 'syk-fast-scrambling-chaos'           // SYK 飽和量子混亂相 (\lambda_L \to 2\pi k_B T / \hbar)
  | 'jt-black-hole-holographic-thermal';  // JT 全息二維近極值黑洞熱化態 (Schwarzian 幾何)

export interface StrangeMetalSYKState {
  temperatureKelvin: number;              // 系統溫度 T (0.1 ~ 300 K)
  sykCouplingJEv: number;                 // SYK 四費米子相互作用強度 J (0.05 ~ 2.5 eV)
  majoranaFermionsN: number;              // 馬約拉納費米子數 N (16 ~ 1024)
  planckianConstantC: number;             // 普朗克耗散常數 C (0.5 ~ 2.0)
  regime: StrangeMetalRegime;

  // 動態演算物理指標
  planckianScatteringTimeFs: number;      // 普朗克散射時間 \tau_Planck (fs)
  lyapunovExponentPerFs: number;          // 量子混亂李雅普諾夫指數 \lambda_L (fs^-1)
  scramblingTimeFs: number;               // 信息爬亂時間 t_scramble (fs)
  linearResistivityMicroOhmCm: number;    // 奇異金屬線性電阻率 \rho (\mu\Omega\cdot cm)
  mssBoundSaturationRatio: number;        // MSS 混亂上界飽和率 (\lambda_L / \lambda_MSS) (0.0 ~ 1.0)
  telemetryHistory: Array<{
    timestamp: number;
    temperature: number;
    resistivity: number;
    lyapunov: number;
  }>;
}

const STORAGE_KEY = 'newworld_strange_metal_syk_chaos_state_v1';
const KB_OVER_HBAR_PER_K_FS = 0.1309; // k_B / \hbar (單位 K^-1 fs^-1)

class StrangeMetalSYKEngine {
  private state: StrangeMetalSYKState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): StrangeMetalSYKState {
    return {
      temperatureKelvin: 45.0,            // 45 K (高溫超導奇異金屬區)
      sykCouplingJEv: 0.85,               // 0.85 eV
      majoranaFermionsN: 64,              // N = 64
      planckianConstantC: 1.05,           // C ≈ 1.05 普朗克耗散
      regime: 'strange-metal-planckian-linear',
      planckianScatteringTimeFs: 8.2,
      lyapunovExponentPerFs: 0.37,
      scramblingTimeFs: 11.2,
      linearResistivityMicroOhmCm: 56.4,
      mssBoundSaturationRatio: 0.985,
      telemetryHistory: []
    };
  }

  private loadState(): StrangeMetalSYKState {
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
      console.warn('[StrangeMetalSYKEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[StrangeMetalSYKEngine] 儲存失敗', e);
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
   * 播放全息量子混亂多相位信息爬亂合成音 (Holographic Chaos Phase Scrambling Glitch)
   */
  public playQuantumScramblingNoise(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // 雙微調正弦波產生調製拍頻
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(320, ctx.currentTime);
      osc2.frequency.setValueAtTime(327, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.35);
      osc2.frequency.exponentialRampToValueAtTime(749, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.45);
      osc2.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn('[StrangeMetalSYKEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放普朗克耗散短脈衝阻尼音 (Planckian Dissipation Pulse Damping Click)
   */
  public playPlanckianDissipationPulse(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('[StrangeMetalSYKEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算普朗克散射時間、李雅普諾夫混亂指數、電阻率與爬亂時間
   */
  public recalculatePhysics(): void {
    const T = Math.max(0.1, this.state.temperatureKelvin);
    const J = Math.max(0.05, this.state.sykCouplingJEv);
    const N = Math.max(16, this.state.majoranaFermionsN);
    const C = Math.max(0.5, this.state.planckianConstantC);

    // 1. 普朗克極限散射弛豫時間 \tau_Planck = \hbar / (C * k_B * T)
    const tauPlanck = 1.0 / (C * KB_OVER_HBAR_PER_K_FS * T);
    this.state.planckianScatteringTimeFs = Number(tauPlanck.toFixed(2));

    // 2. MSS 上界李雅普諾夫指數 \lambda_MSS = 2\pi k_B T / \hbar
    const lambdaMss = 2.0 * Math.PI * KB_OVER_HBAR_PER_K_FS * T * 0.01; // 尺度化為 fs^-1
    // 強耦合下飽和 MSS 界 (\lambda_L \to \lambda_MSS)
    const betaJ = (J * 11604.0) / T; // 無量綱耦合 \beta J
    const saturation = Math.min(0.999, Math.tanh(betaJ / 6.0));
    this.state.mssBoundSaturationRatio = Number(saturation.toFixed(3));

    const lambdaL = lambdaMss * saturation;
    this.state.lyapunovExponentPerFs = Number(lambdaL.toFixed(3));

    // 3. 信息爬亂時間 t_scramble = (1 / \lambda_L) * \ln N
    const tScramble = (1.0 / Math.max(0.005, lambdaL)) * Math.log(N);
    this.state.scramblingTimeFs = Number(tScramble.toFixed(1));

    // 4. 線性電阻率 \rho(T) = \rho_0 + A * T
    // 殘餘電阻率 \rho_0 \approx 5 \mu\Omega\cdot cm，斜率 A \approx 1.15 \mu\Omega\cdot cm / K
    const rho0 = 6.0;
    const rhoLinear = rho0 + (1.12 * C) * T;
    this.state.linearResistivityMicroOhmCm = Number(rhoLinear.toFixed(1));

    // 5. 相態邏輯判定
    if (T < 4.0 && J < 0.2) {
      this.state.regime = 'fermi-liquid-sub-planckian';
    } else if (J >= 1.5 && T < 15.0) {
      this.state.regime = 'jt-black-hole-holographic-thermal';
    } else if (J >= 1.5 || this.state.regime === 'syk-fast-scrambling-chaos') {
      this.state.regime = 'syk-fast-scrambling-chaos';
    } else {
      this.state.regime = 'strange-metal-planckian-linear';
    }
  }

  public update(deltaSeconds: number): void {
    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        temperature: this.state.temperatureKelvin,
        resistivity: this.state.linearResistivityMicroOhmCm,
        lyapunov: this.state.lyapunovExponentPerFs
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setTemperature(tKelvin: number): void {
    this.state.temperatureKelvin = Math.max(0.1, Math.min(300.0, tKelvin));
    this.recalculatePhysics();
    this.saveState();
  }

  public setSykCoupling(jEv: number): void {
    this.state.sykCouplingJEv = Math.max(0.05, Math.min(2.5, jEv));
    this.recalculatePhysics();
    this.saveState();
  }

  public setMajoranaN(n: number): void {
    this.state.majoranaFermionsN = Math.max(16, Math.min(1024, n));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 激發快速量子混亂爬亂 (Trigger Fast Scrambling Burst)
   */
  public triggerFastScrambling(): void {
    this.state.sykCouplingJEv = 1.8;
    this.state.planckianConstantC = 1.0;
    this.state.regime = 'syk-fast-scrambling-chaos';
    this.recalculatePhysics();
    this.playQuantumScramblingNoise();
    this.playPlanckianDissipationPulse();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: StrangeMetalRegime[] = [
      'fermi-liquid-sub-planckian',
      'strange-metal-planckian-linear',
      'syk-fast-scrambling-chaos',
      'jt-black-hole-holographic-thermal'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'fermi-liquid-sub-planckian') {
      this.state.temperatureKelvin = 2.5;
      this.state.sykCouplingJEv = 0.1;
    } else if (this.state.regime === 'strange-metal-planckian-linear') {
      this.state.temperatureKelvin = 50.0;
      this.state.sykCouplingJEv = 0.85;
    } else if (this.state.regime === 'syk-fast-scrambling-chaos') {
      this.triggerFastScrambling();
      return;
    } else {
      this.state.temperatureKelvin = 8.0;
      this.state.sykCouplingJEv = 2.2;
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<StrangeMetalSYKState> {
    return this.state;
  }
}

export const strangeMetalSYKEngine = new StrangeMetalSYKEngine();
