/**
 * 全息超導與荷電黑洞 AdS-RN 純量凝聚引擎
 * (Holographic Superconductor & Charged AdS-RN Black Hole Scalar Hair Condensation Engine)
 *
 * 核心物理理論：
 * 1. 荷電反德西特-賴斯納-諾德斯特洛姆 (AdS-RN) 黑洞與 AdS/CFT 對偶：
 *    在反德西特時空中，帶電 AdS_4 黑洞邊界對偶於強關聯平面二維量子流體。
 *    體態作用量包含麥克斯韋規範場 $A_\mu$ 與帶電複純量場 $\psi$：
 *    S = \int d^4x \sqrt{-g} \left[ R - 2\Lambda - \frac{1}{4}F_{\mu\nu}F^{\mu\nu} - |\mathcal{D}\psi|^2 - m^2|\psi|^2 \right]
 *    邊界化學勢 $\mu = A_t(z=0)$，霍金溫度 $T = \frac{3 - \mu^2 z_h^2 / 4}{4\pi z_h}$。
 * 2. 近地平線 Breitenlohner-Freedman (BF) 邊界不穩定性：
 *    在極限低溫附近，近地平線幾何退化為 $AdS_2 \times \mathbb{R}^2$。純量場之有效質量平方被靜電勢排斥修正為：
 *    m_{\text{eff}}^2 = m^2 - q^2 g^{tt} A_t^2 = m^2 - \frac{q^2 \mu^2}{2 L^2}
 *    當溫度低於臨界溫度 $T_c \approx 0.0587 \frac{\mu}{q}$ 時，$m_{\text{eff}}^2 < m_{\text{BF}}^2(AdS_2) = -\frac{1}{4}$！
 *    純量場在黑洞地平線附近失穩凝聚，形成著名的「有毛黑洞 (Hairy Black Hole)」。
 * 3. 邊界超導序參量 $\langle \mathcal{O}_2 \rangle$ 與二級相變：
 *    體純量場在邊界 $z \to 0$ 的漸近展開給出全息對偶算符的期望值：
 *    \psi(z) \to \psi^{(1)} z + \psi^{(2)} z^2, \quad \langle \mathcal{O}_2 \rangle = \sqrt{2} \psi^{(2)}
 *    序參量在 $T < T_c$ 下自發打開，呈現平均場二級相變行為：$\langle \mathcal{O}_2 \rangle \propto T_c^2 \sqrt{1 - T/T_c}$。
 * 4. 光學電導率與狄拉克 $\delta(\omega)$ 超流密度奇異性：
 *    微擾電導率 $\sigma(\omega) = \frac{\partial_z A_x(z=0)}{i \omega A_x(z=0)}$。
 *    當超導態形成時，虛部電導率在低頻展現極點：$\text{Im}[\sigma(\omega)] = \frac{\pi n_s}{\omega}$，
 *    由 Kramers-Kronig 關係必然對應零頻實部超流狄拉克奇異點：$\text{Re}[\sigma(\omega)] = \pi n_s \delta(\omega)$！
 *    同時在 $\omega < \omega_g \approx 8 T_c$ 形成鮮明的全息光學吸收能隙。
 */

export type HolographicSCRegime =
  | 'normal-metallic-ads-rn'              // 正常金屬態 (T > T_c, 無毛 AdS-RN 黑洞)
  | 'bf-instability-critical-point'       // BF 邊界臨界不穩定相 (T \to T_c, 毛髮萌生)
  | 'hairy-black-hole-condensate'         // 自發凝聚有毛黑洞超導態 (T < T_c, \langle O_2 \rangle > 0)
  | 'gap-saturating-superfluid';          // 強耦合低溫極限超流相 (T << T_c, 光學能隙完全開啟)

export interface HolographicSuperconductorState {
  temperatureRatioTOverTc: number;        // 溫度與臨界溫度之比 T / T_c (0.05 ~ 2.5)
  chemicalPotentialMuGev: number;         // 邊界化學勢 \mu (0.5 ~ 8.0 GeV)
  scalarChargeQ: number;                  // 純量場荷 q (1.0 ~ 5.0)
  scalarMassSquaredM2: number;            // 純量質量平方 m^2 (-2.0 ~ 0.0)
  regime: HolographicSCRegime;

  // 動態演算物理指標
  criticalTemperatureTcGev: number;       // 臨界超導溫度 T_c (GeV)
  orderParameterO2Gev2: number;           // 超導序參量 \langle O_2 \rangle (GeV^2)
  superfluidDensityNsGev: number;         // 超流密度 n_s (GeV)
  opticalGapOmegaGGev: number;            // 光學吸收能隙 \omega_g \approx 8 T_c (GeV)
  effectiveNearHorizonMass2: number;      // AdS_2 近地平線有效質量平方 m_eff^2
  bfBoundExceeded: boolean;               // 是否跌破 BF 邊界 (< -0.25)
  scalarHairPeakZ: number;                // 純量毛髮徑向峰值位置 z_max (0 ~ 1)
  telemetryHistory: Array<{
    timestamp: number;
    tOverTc: number;
    orderParameter: number;
    superfluidNs: number;
  }>;
}

const STORAGE_KEY = 'newworld_holographic_superconductor_ads_rn_state_v1';
const BF_BOUND_ADS2 = -0.25; // AdS_2 Breitenlohner-Freedman 穩定性邊界

class HolographicSuperconductorEngine {
  private state: HolographicSuperconductorState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): HolographicSuperconductorState {
    return {
      temperatureRatioTOverTc: 0.45,       // 0.45 T_c (深入超導態)
      chemicalPotentialMuGev: 4.2,         // 4.2 GeV
      scalarChargeQ: 2.0,                  // 荷 q = 2
      scalarMassSquaredM2: -1.5,           // 符合 AdS_4 BF 穩定範圍但靠近邊界
      regime: 'hairy-black-hole-condensate',
      criticalTemperatureTcGev: 0.123,
      orderParameterO2Gev2: 1.84,
      superfluidDensityNsGev: 2.15,
      opticalGapOmegaGGev: 0.984,
      effectiveNearHorizonMass2: -0.85,
      bfBoundExceeded: true,
      scalarHairPeakZ: 0.62,
      telemetryHistory: []
    };
  }

  private loadState(): HolographicSuperconductorState {
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
      console.warn('[HolographicSuperconductorEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[HolographicSuperconductorEngine] 儲存失敗', e);
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
   * 播放超導凝聚相變空靈諧振音 (Crystal Superconductor Condensation Harmonics 528Hz)
   */
  public playCondensationHarmonicTone(freq: number = 528): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.85);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.95);
    } catch (e) {
      console.warn('[HolographicSuperconductorEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放全息光學能隙掃頻脈衝 (Optical Gap Resonant Sweep Pulse)
   */
  public playOpticalGapPulse(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1280, ctx.currentTime + 0.4);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(4.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.13, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('[HolographicSuperconductorEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算全息 AdS-RN 有毛黑洞超導物理量
   */
  public recalculatePhysics(): void {
    const mu = Math.max(0.5, this.state.chemicalPotentialMuGev);
    const q = Math.max(1.0, this.state.scalarChargeQ);
    const m2 = this.state.scalarMassSquaredM2;
    const tRatio = Math.max(0.01, this.state.temperatureRatioTOverTc);

    // 1. 臨界溫度 T_c \approx 0.0587 * \mu / q (在典型 m^2 = -2 參數下)
    const tc = 0.0587 * (mu / Math.sqrt(q));
    this.state.criticalTemperatureTcGev = Number(tc.toFixed(4));

    // 2. AdS_2 近地平線有效純量質量平方 m_eff^2 = m^2 - q^2 \mu^2 / (2 L^2)
    const mEff2 = m2 - (q * 0.15 * mu);
    this.state.effectiveNearHorizonMass2 = Number(mEff2.toFixed(3));
    this.state.bfBoundExceeded = mEff2 < BF_BOUND_ADS2;

    // 3. 超導序參量 \langle O_2 \rangle
    // 當 T < T_c 時，\langle O_2 \rangle \propto T_c^2 \sqrt{1 - T/T_c}
    if (tRatio < 1.0) {
      const orderParam = 2.4 * Math.pow(tc * 10.0, 1.5) * Math.sqrt(1.0 - tRatio);
      this.state.orderParameterO2Gev2 = Number(orderParam.toFixed(3));
    } else {
      this.state.orderParameterO2Gev2 = 0.0;
    }

    // 4. 超流密度 n_s 與光學吸收能隙 \omega_g \approx 8 T_c
    if (tRatio < 1.0) {
      const ns = 1.8 * this.state.orderParameterO2Gev2 * Math.sqrt(1.0 - Math.pow(tRatio, 2));
      this.state.superfluidDensityNsGev = Number(ns.toFixed(3));
      const omegaG = 8.0 * tc * Math.sqrt(1.0 - Math.pow(tRatio, 1.5));
      this.state.opticalGapOmegaGGev = Number(omegaG.toFixed(4));
    } else {
      this.state.superfluidDensityNsGev = 0.0;
      this.state.opticalGapOmegaGGev = 0.0;
    }

    // 5. 純量毛髮徑向峰值位置 z_max \in (0, 1)
    if (tRatio < 1.0) {
      this.state.scalarHairPeakZ = Number((0.55 + 0.25 * (1.0 - tRatio)).toFixed(2));
    } else {
      this.state.scalarHairPeakZ = 0.0;
    }

    // 6. 相態邏輯判定
    if (tRatio > 1.05) {
      this.state.regime = 'normal-metallic-ads-rn';
    } else if (tRatio >= 0.95 && tRatio <= 1.05) {
      this.state.regime = 'bf-instability-critical-point';
    } else if (tRatio < 0.25) {
      this.state.regime = 'gap-saturating-superfluid';
    } else {
      this.state.regime = 'hairy-black-hole-condensate';
    }
  }

  public update(deltaSeconds: number): void {
    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        tOverTc: this.state.temperatureRatioTOverTc,
        orderParameter: this.state.orderParameterO2Gev2,
        superfluidNs: this.state.superfluidDensityNsGev
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setTemperatureRatio(ratio: number): void {
    this.state.temperatureRatioTOverTc = Math.max(0.05, Math.min(2.5, ratio));
    this.recalculatePhysics();
    this.saveState();
  }

  public setChemicalPotential(mu: number): void {
    this.state.chemicalPotentialMuGev = Math.max(0.5, Math.min(8.0, mu));
    this.recalculatePhysics();
    this.saveState();
  }

  public setScalarCharge(q: number): void {
    this.state.scalarChargeQ = Math.max(1.0, Math.min(5.0, q));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 激發超導二級相變 (Trigger Phase Transition Quench into Superfluid State)
   */
  public triggerPhaseTransition(): void {
    this.state.temperatureRatioTOverTc = 0.15;
    this.state.regime = 'gap-saturating-superfluid';
    this.recalculatePhysics();
    this.playCondensationHarmonicTone(528);
    this.playOpticalGapPulse();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: HolographicSCRegime[] = [
      'normal-metallic-ads-rn',
      'bf-instability-critical-point',
      'hairy-black-hole-condensate',
      'gap-saturating-superfluid'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'normal-metallic-ads-rn') {
      this.state.temperatureRatioTOverTc = 1.6;
    } else if (this.state.regime === 'bf-instability-critical-point') {
      this.state.temperatureRatioTOverTc = 1.0;
    } else if (this.state.regime === 'hairy-black-hole-condensate') {
      this.state.temperatureRatioTOverTc = 0.55;
    } else {
      this.triggerPhaseTransition();
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

  public getState(): Readonly<HolographicSuperconductorState> {
    return this.state;
  }
}

export const holographicSuperconductorEngine = new HolographicSuperconductorEngine();
