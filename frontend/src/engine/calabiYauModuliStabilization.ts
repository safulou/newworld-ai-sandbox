/**
 * 超弦緊緻化卡拉比-丘流形模場穩定性與宇宙暴脹真空發電機
 * (Calabi-Yau Moduli Stabilization & Cosmological Inflation Dynamo)
 *
 * 核心物理理論：
 * 1. 卡拉比-丘流形緊緻化 (Calabi-Yau Compactification CY_3)：
 *    10D 超弦理論緊緻化於 6D 複流形 CY_3，其幾何自由度由霍奇數 (h^{1,1}, h^{2,1}) 決定，
 *    分別對應凱勒模場 T (體積模) 與複結構模場 U (形變模)。
 * 2. 通量緊緻化與 GVW 超勢 (Flux Compactification & Gukov-Vafa-Witten Superpotential)：
 *    時空背景嵌入三形式通量 G_3，誘導經典超勢 W_0 = \int_{CY_3} G_3 \wedge \Omega，
 *    完全穩定全部複結構模場與軸子-伸展子場於超對稱極小點。
 * 3. KKLT 機制與亞穩德西特真空 (KKLT Mechanism & Metastable de Sitter Vacuum)：
 *    非微擾 D3-膜瞬子超勢 W = W_0 + A e^{-a T} 與凱勒勢 K = -3 \ln(T + \bar{T}) 形成 AdS 負真空；
 *    位於幾何翹曲喉管底部的抗 D3-膜 (\overline{D3}) 提供局域正能上推 \Delta V = \frac{D}{\sigma^3}，
 *    將系統提升至具有微小正宇宙常數的亞穩德西特 (dS) 真空。
 * 4. 模場暴脹慢滾動力學 (Moduli Slow-Roll Inflation)：
 *    模場在平坦勢能高原上滾動，慢滾參數 \epsilon = \frac{M_{\text{Pl}}^2}{2}\left(\frac{V'}{V}\right)^2 \ll 1，
 *    產生標度不變的原初曲率微擾，張標比 r = 16\epsilon 符合宇宙微波背景輻射 (CMB) 觀測界限。
 */

export type CalabiYauRegime =
  | 'kklt-metastable-desitter-vacuum'       // KKLT 亞穩德西特真空相 (V_eff > 0)
  | 'supersymmetric-anti-desitter-trough'   // 超對稱 AdS 深度通量陷阱相 (V_eff < 0)
  | 'cosmological-slow-roll-inflation'      // 宇宙慢滾暴脹平坦勢能相 (\epsilon << 1)
  | 'decompactification-runaway-limit';     // 解緊緻化十維逃逸發散相 (\sigma -> \infty)

export interface CalabiYauState {
  kaehlerModulusSigma: number;              // 凱勒模場實部 \sigma = Re(T) (流形體積, 2.0 ~ 35.0)
  fluxSuperpotentialW0: number;             // 通量常數超勢 W_0 (0.01 ~ 1.50)
  warpedUpliftTensionD: number;             // 翹曲喉抗 D3-膜上推強度 D (0.0 ~ 5.0)
  nonPerturbativeCoeffA: number;            // 非微擾瞬子係數 A (0.5 ~ 5.0)
  regime: CalabiYauRegime;

  // 動態演算物理指標
  effectiveVacuumEnergyEv: number;          // 有效真空能量密度 V_eff (10^-120 M_Pl^4, -20.0 ~ +25.0)
  slowRollEpsilon: number;                  // 慢滾參數 \epsilon (0.0001 ~ 0.08)
  tensorToScalarRatioR: number;             // 張標比 r = 16\epsilon (0.001 ~ 0.05)
  spectralIndexNs: number;                  // 標度譜指數 n_s (0.950 ~ 0.980, 觀測約 0.965)
  calabiYauVolumeNormalized: number;        // CY_3 幾何體積 \mathcal{V} \propto \sigma^{3/2}
  telemetryHistory: Array<{
    timestamp: number;
    vacuumEnergy: number;
    sigmaVolume: number;
    slowRollEps: number;
  }>;
}

const STORAGE_KEY = 'newworld_calabi_yau_moduli_stabilization_state_v1';

class CalabiYauModuliEngine {
  private state: CalabiYauState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): CalabiYauState {
    return {
      kaehlerModulusSigma: 8.5,
      fluxSuperpotentialW0: 0.12,
      warpedUpliftTensionD: 2.35,
      nonPerturbativeCoeffA: 1.8,
      regime: 'kklt-metastable-desitter-vacuum',
      effectiveVacuumEnergyEv: 3.45,
      slowRollEpsilon: 0.0018,
      tensorToScalarRatioR: 0.0288,
      spectralIndexNs: 0.966,
      calabiYauVolumeNormalized: 24.8,
      telemetryHistory: []
    };
  }

  private loadState(): CalabiYauState {
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

  public getState(): CalabiYauState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // CY_3 流形體積 \mathcal{V} = \sigma^{3/2}
    s.calabiYauVolumeNormalized = Number(Math.pow(s.kaehlerModulusSigma, 1.5).toFixed(1));

    // KKLT 勢能：V = V_AdS + V_uplift
    // V_AdS \propto - e^{-2a\sigma} / \sigma^2, V_uplift = D / \sigma^3
    const a = 0.1;
    const vAdS = -18.0 * (s.fluxSuperpotentialW0 * s.nonPerturbativeCoeffA) * Math.exp(-a * s.kaehlerModulusSigma) / Math.max(1, s.kaehlerModulusSigma);
    const vUplift = (s.warpedUpliftTensionD * 35.0) / Math.max(1, s.kaehlerModulusSigma * s.kaehlerModulusSigma);
    s.effectiveVacuumEnergyEv = Number((vAdS + vUplift).toFixed(2));

    // 慢滾參數 \epsilon \propto 1 / \sigma^2
    s.slowRollEpsilon = Number(Math.max(0.0001, (0.15 / (s.kaehlerModulusSigma * s.kaehlerModulusSigma))).toFixed(4));
    s.tensorToScalarRatioR = Number((16.0 * s.slowRollEpsilon).toFixed(4));
    s.spectralIndexNs = Number((0.968 - 2.0 * s.slowRollEpsilon).toFixed(3));

    // 狀態判定
    if (s.kaehlerModulusSigma > 25.0) {
      s.regime = 'decompactification-runaway-limit';
    } else if (s.slowRollEpsilon < 0.0015 && s.effectiveVacuumEnergyEv > 0.0) {
      s.regime = 'cosmological-slow-roll-inflation';
    } else if (s.effectiveVacuumEnergyEv > 0.0) {
      s.regime = 'kklt-metastable-desitter-vacuum';
    } else {
      s.regime = 'supersymmetric-anti-desitter-trough';
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
        vacuumEnergy: this.state.effectiveVacuumEnergyEv,
        sigmaVolume: this.state.calabiYauVolumeNormalized,
        slowRollEps: this.state.slowRollEpsilon
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public adjustWarpedThroatUplift(deltaD: number): void {
    this.state.warpedUpliftTensionD = Number(Math.max(0.0, Math.min(5.0, this.state.warpedUpliftTensionD + deltaD)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(420, 680, 0.18, 'sine');
  }

  public slowRollInflationRoll(sigmaDelta: number = 1.2): void {
    this.state.kaehlerModulusSigma = Number(Math.max(2.0, Math.min(35.0, this.state.kaehlerModulusSigma + sigmaDelta)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(520, 740, 0.16, 'triangle');
  }

  public stabilizeFluxVacua(): void {
    this.state.fluxSuperpotentialW0 = 0.15;
    this.state.warpedUpliftTensionD = 2.4;
    this.state.kaehlerModulusSigma = 8.5;
    this.recalculatePhysics();
    this.playTone(330, 660, 0.25, 'sine');
  }

  public preventRunawayDecompactification(): void {
    if (this.state.kaehlerModulusSigma > 15.0) {
      this.state.kaehlerModulusSigma = 8.5;
    }
    this.recalculatePhysics();
    this.playTone(600, 300, 0.22, 'sawtooth');
  }

  public adjustWarpedUplift(deltaD: number): void {
    this.adjustWarpedThroatUplift(deltaD);
  }

  public driveSlowRollInflation(sigmaStep: number = 2.0): void {
    this.slowRollInflationRoll(sigmaStep);
  }

  public lockFluxSuperpotential(): void {
    this.stabilizeFluxVacua();
  }

  public preventDecompactificationRunaway(): void {
    this.preventRunawayDecompactification();
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
      // 忽視靜音
    }
  }
}

export const calabiYauModuliEngine = new CalabiYauModuliEngine();
