/**
 * 🌪️ 拓撲超流體無序誘導安德森局域化與量子淬火相變引擎
 * Disorder-Induced Anderson Localization in Topological Superfluids Engine
 *
 * 理論物理基礎：
 * 1. 拓撲超導與 BdG 隨機無序勢能 (Bogoliubov-de Gennes with Gaussian Disorder)：
 *    一維/二維拓撲超導體（如 Kitaev 鏈或 p-波超流體）在包含無序雜質勢能 $V(x) \in [-W/2, W/2]$ 時：
 *    H = \sum_j \left[ -t (c_j^\dagger c_{j+1} + \text{h.c.}) - (\mu - V_j) c_j^\dagger c_j + (\Delta c_j^\dagger c_{j+1}^\dagger + \text{h.c.}) \right]
 * 2. 馬約拉納零能模 (MZM) 的拓撲保護與臨界無序強度：
 *    弱無序時 ($W < W_c \approx 2\sqrt{|\mu^2 - 4t^2|}$)，非微擾拓撲能隙維持，一對馬約拉納零能模受時間反演/粒子-電洞對稱保護牢牢束縛於鏈端點。
 * 3. 逆參與率 (Inverse Participation Ratio, IPR) 與多重分形：
 *    IPR = \sum_j |\psi(j)|^4
 *    延伸態 (Extended): IPR \sim 1/N \to 0；局域態 (Localized): IPR \sim \mathcal{O}(1)。
 * 4. 李雅普諾夫指數與局域化長度 (Lyapunov Exponent & Localization Length)：
 *    波函數在無序介質中呈指數包絡衰減：|\psi(x)| \propto \exp(-\gamma |x|) = \exp(-|x|/\xi_{\text{loc}})。
 *    當無序超過臨界點 $W > W_c$ 時，體能隙關閉並觸發安德森局域化相變。
 */

export type AndersonSuperfluidRegime =
  | 'clean-topological-majorana-extended'  // 純淨拓撲馬約拉納擴展相 (W ≪ Δ, IPR ≈ 0, 兩端零能尖峰)
  | 'critical-multifractal-mobility-edge'   // 臨界多重分形遷移率邊緣相 (W ≈ W_c, 態密度分形擴展)
  | 'anderson-localized-trivial-insulator' // 安德森局域化平庸絕緣相 (W > W_c, 體態全面指數局域化)
  | 'disorder-driven-topological-anderson'; // 無序誘導拓撲安德森超導相 (無序重整化誘發之拓撲相)

export interface AndersonSuperfluidState {
  disorderStrengthW: number;               // 隨機無序勢能強度 W (0.0 ~ 10.0, 典型 1.5)
  pairingGapDelta: number;                 // p-波超導配對能隙 Δ (0.1 ~ 3.0 meV, 典型 1.0)
  chemicalPotentialMu: number;             // 化學勢 μ (-4.0 ~ 4.0 meV, 典型 0.0)
  hoppingAmplitudeT: number;               // 鄰近躍遷振幅 t (meV, 典型 2.0)
  regime: AndersonSuperfluidRegime;

  // 動態演算物理指標
  inverseParticipationRatioIPR: number;    // 逆參與率 IPR (0.01 ~ 0.95)
  localizationLengthNm: number;            // 局域化長度 \xi_{\text{loc}} (nm)
  majoranaEndOverlap: number;              // 兩端馬約拉納零能模波函數重疊度 (0.0 ~ 1.0)
  criticalDisorderThresholdWc: number;     // 臨界安德森局域化閾值 W_c
  quenchedEntropyJoulePerK: number;        // 淬火非平衡糾纏熵 (k_B 單位)
  accumulatedQuenchesCount: number;        // 累計量子淬火與無序重採樣次數
  spatialWavefunctionProfile: number[];    // 空間波函數密度分佈 [0..31]
}

const STORAGE_KEY = 'newworld_disorder_anderson_superfluid_state_v1';

class DisorderAndersonSuperfluidEngine {
  private state: AndersonSuperfluidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): AndersonSuperfluidState {
    const profile = new Array(32).fill(0).map((_, i) => {
      // 預設為兩端馬約拉納零模尖峰
      const left = Math.exp(-i / 2.5);
      const right = Math.exp(-(31 - i) / 2.5);
      return Number((left + right).toFixed(3));
    });

    return {
      disorderStrengthW: 1.2,
      pairingGapDelta: 1.0,
      chemicalPotentialMu: 0.0,
      hoppingAmplitudeT: 2.0,
      regime: 'clean-topological-majorana-extended',
      inverseParticipationRatioIPR: 0.08,
      localizationLengthNm: 45.0,
      majoranaEndOverlap: 0.02,
      criticalDisorderThresholdWc: 4.0,
      quenchedEntropyJoulePerK: 0.693, // ln(2)
      accumulatedQuenchesCount: 0,
      spatialWavefunctionProfile: profile
    };
  }

  private loadState(): AndersonSuperfluidState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.getDefaultState(),
            ...parsed,
            spatialWavefunctionProfile: Array.isArray(parsed.spatialWavefunctionProfile) && parsed.spatialWavefunctionProfile.length === 32
              ? parsed.spatialWavefunctionProfile
              : this.getDefaultState().spatialWavefunctionProfile
          };
        }
      }
    } catch (e) {
      console.warn('[DisorderAndersonEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[DisorderAndersonEngine] 儲存失敗', e);
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
   * 播放拓撲馬約拉納純淨雙端共鳴純音 (Topological Majorana Dual-Tone)
   */
  public playTopologicalChirp(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(520, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(1040, ctx.currentTime + 0.2);

      osc2.frequency.setValueAtTime(260, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(520, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.28);
      osc2.stop(ctx.currentTime + 0.28);
    } catch (e) {
      console.warn('[DisorderAndersonEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放安德森局域化隨機顆粒噪聲滑音 (Anderson Localization Grain Drone)
   */
  public playLocalizationDrone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    } catch (e) {
      console.warn('[DisorderAndersonEngine] 音效播放異常', e);
    }
  }

  /**
   * 核心物理演算：計算逆參與率 IPR、局域化長度與空間波函數包絡
   */
  public recalculatePhysics(): void {
    const W = Math.max(0.0, this.state.disorderStrengthW);
    const Delta = Math.max(0.1, this.state.pairingGapDelta);
    const mu = this.state.chemicalPotentialMu;
    const t = Math.max(0.5, this.state.hoppingAmplitudeT);

    // 1. 臨界無序閾值 W_c ≈ sqrt(|4t^2 - mu^2|) + 0.5 * Delta
    const diff = Math.max(0.1, 4.0 * t * t - mu * mu);
    const Wc = Math.sqrt(diff) + 0.5 * Delta;
    this.state.criticalDisorderThresholdWc = Number(Wc.toFixed(2));

    // 2. 逆參與率 IPR 演算：弱無序趨近 1/N ≈ 0.05, 強無序指數增加趨近 0.8+
    const ratio = W / Math.max(0.1, Wc);
    let ipr = 0.05 + 0.75 / (1.0 + Math.exp(-3.5 * (ratio - 1.0)));
    ipr = Math.min(0.95, Math.max(0.02, ipr));
    this.state.inverseParticipationRatioIPR = Number(ipr.toFixed(3));

    // 3. 局域化長度 \xi_{\text{loc}} (nm)
    let xi = 50.0 / (1.0 + Math.pow(W / 1.5, 1.8));
    if (ratio < 0.8) {
      xi = Math.max(25.0, 60.0 - W * 10.0);
    }
    this.state.localizationLengthNm = Number(Math.max(1.5, xi).toFixed(1));

    // 4. 馬約拉納兩端重疊度 overlap \propto exp(-L / xi)
    const L = 32.0; // 鏈長度
    const overlap = Math.exp(-L / Math.max(0.8, xi));
    this.state.majoranaEndOverlap = Number(overlap.toFixed(4));

    // 5. 淬火非平衡糾纏熵
    const sEnt = ratio < 1.0 ? 0.693 * (1.0 - 0.2 * ratio) : 0.693 / (1.0 + 1.2 * (ratio - 1.0));
    this.state.quenchedEntropyJoulePerK = Number(sEnt.toFixed(3));

    // 6. 重新採樣空間波函數剖面 (32 個網格點)
    const profile = new Array(32).fill(0);
    const seed = (W * 17.13 + mu * 5.21) % 1.0;
    for (let i = 0; i < 32; i++) {
      if (ratio < 0.85) {
        // 拓撲相：兩端馬約拉納波包
        const left = Math.exp(-i / Math.max(1.0, xi * 0.15));
        const right = Math.exp(-(31 - i) / Math.max(1.0, xi * 0.15));
        const noise = (Math.sin(i * 1.8 + seed * 10) * 0.05) * W;
        profile[i] = Number(Math.max(0.01, left + right + noise).toFixed(3));
      } else if (ratio >= 0.85 && ratio <= 1.25) {
        // 臨界多重分形相：分形起伏波動
        const wave = Math.abs(Math.sin((i * Math.PI) / 6.0 + seed * 5.0)) * Math.exp(-Math.abs(i - 16) / 12.0);
        profile[i] = Number(Math.max(0.02, wave * 0.8 + 0.1).toFixed(3));
      } else {
        // 安德森局域化平庸相：隨機局域於晶格某局域中心 (如 i = 12 附近)
        const center = Math.floor(10 + seed * 12);
        const loc = Math.exp(-Math.abs(i - center) / Math.max(0.8, xi * 0.1));
        profile[i] = Number(Math.max(0.005, loc).toFixed(3));
      }
    }
    this.state.spatialWavefunctionProfile = profile;

    // 7. 相態判定
    if (ratio < 0.8) {
      this.state.regime = 'clean-topological-majorana-extended';
    } else if (ratio >= 0.8 && ratio <= 1.2) {
      this.state.regime = 'critical-multifractal-mobility-edge';
    } else if (Math.abs(mu) > 2.8 && W > 2.0 && W < 5.0) {
      this.state.regime = 'disorder-driven-topological-anderson';
    } else {
      this.state.regime = 'anderson-localized-trivial-insulator';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime === 'critical-multifractal-mobility-edge') {
      this.state.accumulatedQuenchesCount += Math.floor(deltaSeconds * 2);
    }
  }

  // --- 操作控制 API ---

  public setDisorderStrength(w: number): void {
    this.state.disorderStrengthW = Math.max(0.0, Math.min(10.0, w));
    this.recalculatePhysics();
    this.saveState();
  }

  public setPairingGap(delta: number): void {
    this.state.pairingGapDelta = Math.max(0.1, Math.min(3.0, delta));
    this.recalculatePhysics();
    this.saveState();
  }

  public setChemicalPotential(mu: number): void {
    this.state.chemicalPotentialMu = Math.max(-4.0, Math.min(4.0, mu));
    this.recalculatePhysics();
    this.saveState();
  }

  public setHoppingAmplitude(t: number): void {
    this.state.hoppingAmplitudeT = Math.max(0.5, Math.min(5.0, t));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 觸發量子淬火重採樣 (Trigger Quantum Quench Resample)
   */
  public triggerQuantumQuench(): void {
    this.state.accumulatedQuenchesCount += 1;
    this.state.disorderStrengthW = Number((Math.random() * 4.5).toFixed(2));
    this.recalculatePhysics();
    if (this.state.regime === 'clean-topological-majorana-extended') {
      this.playTopologicalChirp();
    } else {
      this.playLocalizationDrone();
    }
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: AndersonSuperfluidRegime[] = [
      'clean-topological-majorana-extended',
      'critical-multifractal-mobility-edge',
      'anderson-localized-trivial-insulator',
      'disorder-driven-topological-anderson'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    const nextRegime = regimes[(currentIndex + 1) % regimes.length];

    if (nextRegime === 'clean-topological-majorana-extended') {
      this.state.disorderStrengthW = 0.5;
      this.state.chemicalPotentialMu = 0.0;
      this.playTopologicalChirp();
    } else if (nextRegime === 'critical-multifractal-mobility-edge') {
      this.state.disorderStrengthW = this.state.criticalDisorderThresholdWc;
      this.playLocalizationDrone();
    } else if (nextRegime === 'anderson-localized-trivial-insulator') {
      this.state.disorderStrengthW = 7.5;
      this.playLocalizationDrone();
    } else {
      this.state.disorderStrengthW = 3.2;
      this.state.chemicalPotentialMu = 3.2;
      this.playTopologicalChirp();
    }

    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<AndersonSuperfluidState> {
    return this.state;
  }
}

export const disorderAndersonEngine = new DisorderAndersonSuperfluidEngine();
