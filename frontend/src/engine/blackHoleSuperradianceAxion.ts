/**
 * 旋轉黑洞超輻射不穩定性與軸子玻色子星雲引擎
 * (Black Hole Superradiance & Gravitational Atom Axion Cloud Engine)
 *
 * 核心物理理論：
 * 1. 克爾黑洞超輻射不穩定性條件 (Kerr Superradiance Condition)：
 *    當旋轉黑洞事件地平線旋轉角速度為 $\Omega_H = \frac{a_* c^3}{2 G M (1 + \sqrt{1 - a_*^2})}$ 時，
 *    入射玻色波滿足超輻射條件：$\omega < m \Omega_H$ (式中 $m$ 為方位角量子數)。
 *    波在穿過能層 (Ergosphere) 反射後振幅增大，從黑洞自旋角動量中抽取能量與角動量。
 * 2. 引力原子與軸子玻色-愛因斯坦凝聚星雲 (Gravitational Atom & Axion BEC Cloud)：
 *    若超輕玻色子 (如微小質量超弦軸子 $m_a \sim 10^{-13} - 10^{-11}\text{ eV}$) 的康普頓波長與黑洞半徑匹配，
 *    引力耦合精細結構常數 $\alpha_g = \frac{G M \mu}{\hbar c} \sim 0.05 - 0.45$。
 *    玻色子在黑洞外引力勢阱中形成類氫「引力原子」束縛態，其中增長最快的主導態為 $(n,l,m) = (2,1,1)$。
 * 3. 自旋降速與連續單色引力波輻射 (Black Hole Spin-Down & Monochromatic GWs)：
 *    超輻射使得軸子星雲粒子數 $N_{\text{cloud}}$ 指數暴增，黑洞無量綱自旋 $a_*$ 隨之顯著下降 (Regge Trajectory)。
 *    凝聚軸子對透過引力四極偶極湮滅自發釋放高相干連續單色引力波：
 *    f_{\text{GW}} \approx \frac{\mu}{\pi \hbar}, \quad P_{\text{GW}} \propto \left(\frac{M_{\text{cloud}}}{M}\right)^2 \alpha_g^{14}
 * 4. 玻色子星震塌縮 (Bosenova Collapse)：
 *    若軸子存在吸引自相互作用 (Attractive Self-Interaction $\lambda \phi^4$)，
 *    當星雲質量超過臨界極限 $M_{\text{cloud}} \gtrsim \frac{f_a^2 M}{\alpha_g}$ 時，
 *    引力原子星雲發生災變性非線性內爆 (Bosenova)，部分軸子墜入地平線，部分被炸飛至無窮遠！
 */

export type SuperradianceRegime =
  | 'quiescent-kerr-horizon'              // 寧靜期克爾黑洞相 (α_g 失配或 a_* 接近零)
  | 'exponential-superradiant-instability'// 指數超輻射引力原子激發相 (星雲高速凝聚)
  | 'continuous-gravitational-wave-hum'  // 單色相干引力波鳴響輻射相 (雙軸子湮滅發射)
  | 'bosenova-explosive-collapse';        // 玻色星震非線性內爆崩潰相 (自相互作用失穩)

export interface BlackHoleSuperradianceState {
  blackHoleMassSolar: number;             // 黑洞質量 M (單位太陽質量 M_sun, 3 ~ 100)
  dimensionlessSpinAStar: number;         // 無量綱自旋參數 a_* (0.01 ~ 0.99)
  axionMassEv: number;                    // 超輕軸子質量 \mu (10^-13 ~ 10^-11 eV)
  selfCouplingFaGev: number;              // 軸子衰變常數 f_a (10^14 ~ 10^17 GeV)
  regime: SuperradianceRegime;

  // 動態演算物理指標
  gravitationalAlphaG: number;            // 引力精細結構常數 \alpha_g
  horizonFrequencyHz: number;             // 地平線旋轉頻率 \Omega_H / 2\pi (Hz)
  superradianceThresholdHz: number;       // 超輻射閾值頻率 (Hz)
  cloudMassFraction: number;              // 軸子星雲質量佔黑洞質量比 M_cloud / M (0 ~ 0.12)
  continuousGwFrequencyHz: number;        // 連續引力波頻率 f_GW (Hz)
  gwLuminosityErgS: number;               // 引力波輻射光度 P_GW (erg/s)
  bosenovaThresholdFraction: number;      // Bosenova 塌縮臨界質量比
  bosenovaCollapseCount: number;          // 累計 Bosenova 爆發次數
  telemetryHistory: Array<{
    timestamp: number;
    spin: number;
    cloudMass: number;
    gwLuminosity: number;
  }>;
}

const STORAGE_KEY = 'newworld_black_hole_superradiance_axion_state_v1';
const PLANCK_HBAR_EV_S = 6.582e-16;

class BlackHoleSuperradianceEngine {
  private state: BlackHoleSuperradianceState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): BlackHoleSuperradianceState {
    return {
      blackHoleMassSolar: 10.0,            // 10 太陽質量恆星級黑洞
      dimensionlessSpinAStar: 0.85,        // a_* = 0.85 高速自旋
      axionMassEv: 5.0e-13,                // 0.5 * 10^-12 eV (精確滿足超輻射條件 f_Axion < f_H)
      selfCouplingFaGev: 1.0e16,           // GUT 尺度軸子衰變常數
      regime: 'exponential-superradiant-instability',
      gravitationalAlphaG: 0.074,
      horizonFrequencyHz: 179.8,
      superradianceThresholdHz: 179.8,
      cloudMassFraction: 0.02,
      continuousGwFrequencyHz: 241.8,
      gwLuminosityErgS: 1.2e40,
      bosenovaThresholdFraction: 0.086,
      bosenovaCollapseCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): BlackHoleSuperradianceState {
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
      console.warn('[BlackHoleSuperradianceEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[BlackHoleSuperradianceEngine] 儲存失敗', e);
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
   * 播放引力原子連續單色引力波鳴響 (Continuous Gravitational Wave Hum)
   */
  public playGravitationalAtomHum(freq: number = 144): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('[BlackHoleSuperradianceEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放 Bosenova 星震引力坍縮深層爆裂音 (Bosenova Implosion Shock Boom)
   */
  public playBosenovaCollapseSound(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(24, ctx.currentTime + 0.7);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('[BlackHoleSuperradianceEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算引力原子光譜、超輻射增益、星雲質量與 GW 光度
   */
  public recalculatePhysics(): void {
    const M = Math.max(2.0, this.state.blackHoleMassSolar);
    const a = Math.max(0.01, Math.min(0.998, this.state.dimensionlessSpinAStar));
    const mu = Math.max(1e-14, this.state.axionMassEv);

    // 1. 引力精細結構常數 \alpha_g = G M \mu / (\hbar c)
    // 數值化：\alpha_g \approx 0.148 * (M / 10 M_sun) * (\mu / 10^-12 eV)
    const alphaG = 0.148 * (M / 10.0) * (mu / 1.0e-12);
    this.state.gravitationalAlphaG = Number(alphaG.toFixed(3));

    // 2. 黑洞地平線角速度 \Omega_H 與頻率 (Hz)
    // f_H = c^3 a_* / (4\pi G M (1 + \sqrt{1 - a_*^2})) \approx 3230 * a_* / (M * (1 + \sqrt{1 - a_*^2}))
    const rPlus = 1.0 + Math.sqrt(1.0 - a * a);
    const fHorizon = (3230.0 * a) / (M * rPlus);
    this.state.horizonFrequencyHz = Number(fHorizon.toFixed(1));

    // 3. 軸子頻率與超輻射閾值 (m = 1 主量子態)
    const fAxion = mu / (2.0 * Math.PI * PLANCK_HBAR_EV_S);
    this.state.superradianceThresholdHz = Number(fHorizon.toFixed(1));
    const isSuperradiant = fAxion < fHorizon;

    // 4. 連續單色引力波頻率 f_GW \approx 2 * f_Axion (Hz)
    const fGw = 2.0 * fAxion;
    this.state.continuousGwFrequencyHz = Number(fGw.toFixed(1));

    // 5. Bosenova 塌縮臨界質量比例 M_crit / M
    const fa = Math.max(1e13, this.state.selfCouplingFaGev);
    const bosenovaThreshold = Math.min(0.15, Math.max(0.01, 0.08 * (fa / 1.0e16) / Math.max(0.05, alphaG)));
    this.state.bosenovaThresholdFraction = Number(bosenovaThreshold.toFixed(3));

    // 6. 星雲質量佔比與 GW 光度
    const cloudFrac = Math.min(0.12, this.state.cloudMassFraction);
    const lum = 1e42 * Math.pow(cloudFrac / 0.05, 2) * Math.pow(Math.min(0.5, alphaG) / 0.2, 14);
    this.state.gwLuminosityErgS = Number(lum.toExponential(2));

    // 7. 相態邏輯判定
    if (cloudFrac >= bosenovaThreshold || this.state.regime === 'bosenova-explosive-collapse') {
      this.state.regime = 'bosenova-explosive-collapse';
    } else if (cloudFrac > 0.03 && isSuperradiant) {
      this.state.regime = 'continuous-gravitational-wave-hum';
    } else if (isSuperradiant && a > 0.3) {
      this.state.regime = 'exponential-superradiant-instability';
    } else {
      this.state.regime = 'quiescent-kerr-horizon';
    }
  }

  public update(deltaSeconds: number): void {
    // 模擬 Bosenova 坍縮後的質量部分耗散與自旋降低
    if (this.state.regime === 'bosenova-explosive-collapse') {
      this.state.cloudMassFraction = Math.max(0.01, this.state.cloudMassFraction - deltaSeconds * 0.05);
      this.state.dimensionlessSpinAStar = Math.max(0.3, this.state.dimensionlessSpinAStar - deltaSeconds * 0.05);
      if (this.state.cloudMassFraction < this.state.bosenovaThresholdFraction * 0.75) {
        this.state.regime = 'continuous-gravitational-wave-hum';
      }
      this.recalculatePhysics();
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        spin: this.state.dimensionlessSpinAStar,
        cloudMass: this.state.cloudMassFraction,
        gwLuminosity: this.state.gwLuminosityErgS
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setBlackHoleMass(solar: number): void {
    this.state.blackHoleMassSolar = Math.max(3.0, Math.min(100.0, solar));
    this.recalculatePhysics();
    this.saveState();
  }

  public setSpin(aStar: number): void {
    this.state.dimensionlessSpinAStar = Math.max(0.05, Math.min(0.99, aStar));
    this.recalculatePhysics();
    this.saveState();
  }

  public setAxionMass(ev: number): void {
    this.state.axionMassEv = Math.max(1e-13, Math.min(1e-11, ev));
    this.recalculatePhysics();
    this.saveState();
  }

  public setAxionMassEv(ev: number): void {
    this.setAxionMass(ev);
  }

  public setCloudMassFraction(fraction: number): void {
    this.state.cloudMassFraction = Math.max(0.001, Math.min(0.12, fraction));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動引發 Bosenova 星震內爆 (Trigger Bosenova Implosion Collapse)
   */
  public triggerBosenova(): void {
    this.state.cloudMassFraction = this.state.bosenovaThresholdFraction + 0.015;
    this.state.bosenovaCollapseCount += 1;
    this.state.regime = 'bosenova-explosive-collapse';
    this.recalculatePhysics();
    this.playBosenovaCollapseSound();
    this.playGravitationalAtomHum(120);
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: SuperradianceRegime[] = [
      'quiescent-kerr-horizon',
      'exponential-superradiant-instability',
      'continuous-gravitational-wave-hum',
      'bosenova-explosive-collapse'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'quiescent-kerr-horizon') {
      this.state.dimensionlessSpinAStar = 0.15;
      this.state.cloudMassFraction = 0.005;
    } else if (this.state.regime === 'exponential-superradiant-instability') {
      this.state.dimensionlessSpinAStar = 0.88;
      this.state.cloudMassFraction = 0.02;
    } else if (this.state.regime === 'continuous-gravitational-wave-hum') {
      this.state.dimensionlessSpinAStar = 0.82;
      this.state.cloudMassFraction = 0.05;
      this.playGravitationalAtomHum(165);
    } else {
      this.triggerBosenova();
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

  public getState(): Readonly<BlackHoleSuperradianceState> {
    return this.state;
  }
}

export const blackHoleSuperradianceEngine = new BlackHoleSuperradianceEngine();
