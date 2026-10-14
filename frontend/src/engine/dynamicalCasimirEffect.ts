/**
 * 🌌 動力學卡西米爾效應與超導量子干涉儀 (SQUID) 加速運動反射鏡引擎
 * Dynamical Casimir Effect (DCE) & SQUID Accelerating Boundary Quantum Optics Engine
 *
 * 理論物理基礎：
 * 1. 非絕熱運動邊界條件 (Non-adiabatic Moving Boundary Condition)：
 *    當腔體反射鏡以相對論速度或超高頻率振動時（速度 $v(t) \sim \beta c$），
 *    電磁場零點能波動無法絕熱適應邊界，激發非平庸玻戈留玻夫 (Bogoliubov) 變換：
 *    a_{\text{out}}(\omega) = \alpha_{\omega\omega'} a_{\text{in}}(\omega') + \beta_{\omega\omega'} a_{\text{in}}^\dagger(\omega')
 * 2. 真空光子對產生率 (Photon Pair Production Rate)：
 *    自發將虛光子對拉出狄拉克真空，轉化為真實糾纏光子對：
 *    \Gamma \approx \frac{\omega_0}{6\pi} \left(\frac{v_{\text{max}}}{c}\right)^2 \quad (\text{光子對/秒})
 * 3. 超導量子干涉儀 (SQUID) 運動反射鏡對偶：
 *    利用磁通量調製 SQUID 的約瑟夫森電感 $L_J(\Phi)$，在共振微波傳輸線端點實現
 *    等效運動速度高達 $v_{\text{eff}} \approx 0.25 c$ 之超高速電磁邊界。
 * 4. 雙模壓縮真空態與量子噪聲抑制 (Two-Mode Squeezing & Entanglement)：
 *    輻射場呈現雙模壓縮真空 (TMSV)，壓縮參量 $r = \frac{1}{2}\ln(1 + 2\Gamma \tau)$，
 *    單正交分量噪聲降至標準量子極限以下：$\langle (\Delta X_1)^2 \rangle = \frac{1}{4} e^{-2r}$。
 */

export type DynamicalCasimirRegime =
  | 'quiescent-vacuum-virtual-pairs'         // 寧靜基態虛光子對起伏相 (β << 0.01)
  | 'sub-threshold-parametric-amplification' // 亞臨界參量共振微波放大態 (β ~ 0.05 - 0.15)
  | 'relativistic-dynamical-casimir-emission'// 相對論性運動反射鏡連續光子對輻射相 (β ~ 0.25)
  | 'quantum-squeezing-saturation';          // 正交分量極限量子噪聲壓縮飽和態 (r > 1.2)

export interface DynamicalCasimirState {
  boundaryOscillationFreqGhz: number;        // 邊界調製頻率 f_0 (GHz, 2.0 ~ 25.0 GHz)
  effectiveMirrorVelocityBeta: number;       // 等效運動反射鏡速度 v_eff / c (0.01 ~ 0.40)
  squidMagneticFluxPhi0: number;             // SQUID 外加磁通量 Φ / Φ_0 (0.0 ~ 0.50)
  cavityQualityFactorQ: number;              // 微波傳輸線腔品質因數 Q (1000 ~ 50000)
  regime: DynamicalCasimirRegime;

  // 動態演算物理指標
  photonPairRatePerSec: number;              // 真空光子對生成率 \Gamma (對/秒)
  quantumSqueezingDb: number;                // 正交壓縮度 (dB, 10 log10(e^(2r)))
  quadratureNoiseRatio: number;              // 相對標準量子極限噪聲比 (< 1.0 為次泊松分佈)
  twoModeEntanglementEntropy: number;        // 雙模糾纏熵 S_ent (nats)
  microwaveEmissionPowerPw: number;          // 輻射微波功率 (pW)
  totalEmittedPhotonsCount: number;          // 累計輻射光子計數
  telemetryHistory: Array<{
    timestamp: number;
    beta: number;
    rate: number;
    squeezingDb: number;
  }>;
}

const STORAGE_KEY = 'newworld_dynamical_casimir_effect_state_v1';
const PLANCK_H_J_S = 6.62607015e-34;

class DynamicalCasimirEngine {
  private state: DynamicalCasimirState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): DynamicalCasimirState {
    return {
      boundaryOscillationFreqGhz: 10.4,       // 10.4 GHz (典型 DCE 微波共振帶)
      effectiveMirrorVelocityBeta: 0.25,      // 0.25 c (Chalmers DCE 實驗極限速度)
      squidMagneticFluxPhi0: 0.35,            // 0.35 Φ_0
      cavityQualityFactorQ: 15000,
      regime: 'relativistic-dynamical-casimir-emission',
      photonPairRatePerSec: 1.85e6,
      quantumSqueezingDb: 8.6,
      quadratureNoiseRatio: 0.138,
      twoModeEntanglementEntropy: 1.45,
      microwaveEmissionPowerPw: 0.024,
      totalEmittedPhotonsCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): DynamicalCasimirState {
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
      console.warn('[DynamicalCasimirEngine] 載入存檔失敗，使用預設值', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[DynamicalCasimirEngine] 儲存失敗', e);
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
   * 播放真空光子對產生微波爆音 (Microwave Photon Pair Pop)
   */
  public playPhotonPairPop(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.warn('[DynamicalCasimirEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放壓縮真空諧振笛音 (Squeezed Vacuum Resonator Whistle)
   */
  public playSqueezedResonanceWhistle(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('[DynamicalCasimirEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算動態卡西米爾產生率、壓縮因子與雙模糾纏熵
   */
  public recalculatePhysics(): void {
    const fGhz = Math.max(1.0, this.state.boundaryOscillationFreqGhz);
    const beta = Math.max(0.001, Math.min(0.40, this.state.effectiveMirrorVelocityBeta));
    const flux = Math.max(0.0, Math.min(0.5, this.state.squidMagneticFluxPhi0));
    const Q = Math.max(500, this.state.cavityQualityFactorQ);

    const omega0 = 2.0 * Math.PI * fGhz * 1e9; // rad/s

    // 1. 光子對產生率 \Gamma = (\omega_0 / 6\pi) * \beta^2 * (1 + 0.5 \cos(\pi \Phi / \Phi_0))
    const fluxFactor = 1.0 + 0.5 * Math.cos(Math.PI * flux / 0.5);
    const pairRate = (omega0 / (6.0 * Math.PI)) * Math.pow(beta, 2) * fluxFactor * (Q / 10000.0);
    this.state.photonPairRatePerSec = Number(pairRate.toExponential(2));

    // 2. 雙模壓縮參量 r = 0.5 * ln(1 + 2 \beta * Q / 1000)
    const effectiveSqueezingR = 0.5 * Math.log(1.0 + (beta * Q) / 800.0);
    const noiseRatio = Math.exp(-2.0 * effectiveSqueezingR);
    this.state.quadratureNoiseRatio = Number(noiseRatio.toFixed(3));

    // 3. 正交壓縮度 (dB) = -10 * log10(noiseRatio)
    const squeezingDb = -10.0 * Math.log10(Math.max(0.01, noiseRatio));
    this.state.quantumSqueezingDb = Number(squeezingDb.toFixed(1));

    // 4. 雙模糾纏熵 S_ent = cosh^2(r) ln(cosh^2 r) - sinh^2(r) ln(sinh^2 r)
    const cosh2 = Math.pow(Math.cosh(effectiveSqueezingR), 2);
    const sinh2 = Math.pow(Math.sinh(effectiveSqueezingR), 2);
    const sEnt = cosh2 * Math.log(cosh2) - (sinh2 > 1e-4 ? sinh2 * Math.log(sinh2) : 0);
    this.state.twoModeEntanglementEntropy = Number(sEnt.toFixed(2));

    // 5. 輻射微波功率 P = \Gamma * \hbar * \omega_0 (pW)
    const powerW = pairRate * (PLANCK_H_J_S / (2.0 * Math.PI)) * omega0;
    this.state.microwaveEmissionPowerPw = Number((powerW * 1e12).toFixed(3));

    // 6. 相態邏輯判定
    if (beta < 0.05) {
      this.state.regime = 'quiescent-vacuum-virtual-pairs';
    } else if (effectiveSqueezingR > 1.25 || squeezingDb > 10.0) {
      this.state.regime = 'quantum-squeezing-saturation';
    } else if (beta >= 0.20) {
      this.state.regime = 'relativistic-dynamical-casimir-emission';
    } else {
      this.state.regime = 'sub-threshold-parametric-amplification';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime === 'relativistic-dynamical-casimir-emission' || this.state.regime === 'quantum-squeezing-saturation') {
      const newPhotons = Math.floor(this.state.photonPairRatePerSec * deltaSeconds * 1e-5);
      this.state.totalEmittedPhotonsCount += Math.max(1, newPhotons);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        beta: this.state.effectiveMirrorVelocityBeta,
        rate: this.state.photonPairRatePerSec,
        squeezingDb: this.state.quantumSqueezingDb
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setMirrorVelocityBeta(beta: number): void {
    this.state.effectiveMirrorVelocityBeta = Math.max(0.01, Math.min(0.40, beta));
    this.recalculatePhysics();
    this.saveState();
  }

  public setOscillationFreq(ghz: number): void {
    this.state.boundaryOscillationFreqGhz = Math.max(2.0, Math.min(25.0, ghz));
    this.recalculatePhysics();
    this.saveState();
  }

  public setSquidFlux(phi0: number): void {
    this.state.squidMagneticFluxPhi0 = Math.max(0.0, Math.min(0.50, phi0));
    this.recalculatePhysics();
    this.saveState();
  }

  public setCavityQ(q: number): void {
    this.state.cavityQualityFactorQ = Math.max(1000, Math.min(50000, q));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發相對論性光子對爆發 (Trigger DCE Burst)
   */
  public triggerDceEmission(): void {
    this.state.effectiveMirrorVelocityBeta = 0.32;
    this.state.squidMagneticFluxPhi0 = 0.42;
    this.state.totalEmittedPhotonsCount += 25000;
    this.state.regime = 'relativistic-dynamical-casimir-emission';
    this.recalculatePhysics();
    this.playPhotonPairPop();
    this.playSqueezedResonanceWhistle();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: DynamicalCasimirRegime[] = [
      'quiescent-vacuum-virtual-pairs',
      'sub-threshold-parametric-amplification',
      'relativistic-dynamical-casimir-emission',
      'quantum-squeezing-saturation'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'quiescent-vacuum-virtual-pairs') {
      this.state.effectiveMirrorVelocityBeta = 0.02;
    } else if (this.state.regime === 'sub-threshold-parametric-amplification') {
      this.state.effectiveMirrorVelocityBeta = 0.12;
      this.playSqueezedResonanceWhistle();
    } else if (this.state.regime === 'relativistic-dynamical-casimir-emission') {
      this.state.effectiveMirrorVelocityBeta = 0.25;
      this.playPhotonPairPop();
    } else {
      this.state.effectiveMirrorVelocityBeta = 0.36;
      this.state.cavityQualityFactorQ = 35000;
      this.playSqueezedResonanceWhistle();
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<DynamicalCasimirState> {
    return this.state;
  }
}

export const dynamicalCasimirEngine = new DynamicalCasimirEngine();
