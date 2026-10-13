/**
 * 瞬子真空隧道效應與楊-米爾斯拓撲角 \theta 真空結構引擎
 * (Yang-Mills BPST Instanton Vacuum Tunneling & Topological \theta-Angle Engine)
 *
 * 核心物理理論：
 * 1. BPST 瞬子解與自對偶規範場張量 (BPST Instantons & Self-Dual Field Tensor)：
 *    在歐幾里得四維時空中，非阿貝爾 SU(2) 楊-米爾斯規範理論存在有限作用量古典解——BPST 瞬子。
 *    規範場滿足嚴格自對偶條件 $F_{\mu\nu}^a = \tilde{F}_{\mu\nu}^a = \frac{1}{2} \epsilon_{\mu\nu\rho\sigma} F^{\rho\sigma}_a$。
 *    瞬子具有整數拓撲龐特里亞金荷 (Pontryagin Index / Chern-Simons winding number)：
 *    Q = \frac{1}{32\pi^2} \int d^4x F_{\mu\nu}^a \tilde{F}_a^{\mu\nu} = \pm 1, \pm 2, \dots
 * 2. 瞬子古典作用量與真空隧道機率 (Classical Instanton Action & WKB Tunneling)：
 *    瞬子歐幾里得作用量嚴格極小化：$S_{\text{inst}} = \frac{8\pi^2}{g^2}$。
 *    在不同整數拓撲真空態 $|n\rangle \to |n+1\rangle$ 之間，瞬子充當量子穿隧軌跡。
 *    半古典 WKB 真空隧道速率為：$\Gamma \approx C \left(\frac{8\pi^2}{g^2}\right)^4 \exp\left(-\frac{8\pi^2}{g^2}\right)$。
 * 3. 拓撲 $\theta$-真空態與能譜色散 (Topological \theta-Vacuum & Energy Dispersion)：
 *    因大規範變換算符 $\mathcal{T}|n\rangle = |n+1\rangle$ 與哈密頓量對易，真實規範真空為 Bloch 波形式的疊加態：
 *    |\theta\rangle = \sum_{n=-\infty}^\infty e^{i n \theta} |n\rangle
 *    瞬子隧道效應破除真空簡併，真空能量密度展現出對 $\theta$ 角的非微擾週期依賴：
 *    \mathcal{E}(\theta) = -2 K \cos\theta
 *    拓撲磁化率 (Topological Susceptibility) 為 $\chi_t = \left.\frac{d^2\mathcal{E}}{d\theta^2}\right|_{\theta=0} = 2 K$。
 * 4. 強 CP 問題與軸子 Peccei-Quinn 動態消除機制 (Strong CP Problem & Axion Dynamical Restoration)：
 *    若 $\theta \neq 0$，楊-米爾斯拓撲項 $\mathcal{L}_\theta = \frac{\theta g^2}{32\pi^2} F \tilde{F}$ 將導致強烈 CP 破缺（預測中子電偶極矩超標）。
 *    引入動態軸子純量場 $a(x)$ 與衰變常數 $f_a$ 後，有效角變為 $\theta_{\text{eff}} = \theta + \frac{a}{f_a}$。
 *    瞬子誘導勢能將軸子真空期望值動態錨定在 $\langle a \rangle = -f_a \theta$，使得有效 $\bar{\theta} \equiv 0$，動態恢復 CP 對稱性！
 */

export type InstantonRegime =
  | 'classical-vacuum-wells'              // 經典離散真空勢阱態 (隧道被抑制, g 弱)
  | 'quantum-tunneling-bpst'              // BPST 瞬子強穿隧共振相 (非微擾瞬子氣)
  | 'theta-vacuum-interference'           // \theta-真空干涉疊加相 (CP 破缺能量調製)
  | 'axion-cp-restoration';               // 軸子 Peccei-Quinn 動態恢復相 (\bar{\theta} \to 0)

export interface InstantonVacuumState {
  thetaAngleRad: number;                  // 楊-米爾斯拓撲角 \theta (0 ~ 2\pi rad)
  gaugeCouplingConstantG: number;         // 規範耦合常數 g (0.8 ~ 2.4)
  instantonScaleRhoFm: number;            // 瞬子核心尺度 \rho (0.1 ~ 1.0 fm)
  axionScaleFaGev: number;                // 軸子衰變常數 f_a (10^9 ~ 10^12 GeV)
  axionMechanismEnabled: boolean;         // 是否啟動軸子動態補償機制
  regime: InstantonRegime;

  // 動態演算物理指標
  instantonActionS: number;               // 瞬子作用量 S_inst = 8\pi^2 / g^2
  wkbTunnelingRateGamma: number;          // WKB 穿隧速率 \Gamma (fm^-4)
  vacuumEnergyDensityMevFm3: number;      // 真空能量密度 \mathcal{E}(\theta) (MeV/fm^3)
  topologicalSusceptibilityChiT: number;  // 拓撲磁化率 \chi_t (MeV/fm^3)
  effectiveThetaBarRad: number;           // 有效拓撲角 \bar{\theta} (rad)
  axionMassMicroEv: number;               // 瞬子誘導軸子質量 m_a (\mu eV)
  tunnelingEventsCount: number;           // 瞬子穿隧事件計數
  telemetryHistory: Array<{
    timestamp: number;
    theta: number;
    energyDensity: number;
    tunnelingRate: number;
  }>;
}

const STORAGE_KEY = 'newworld_yang_mills_instanton_vacuum_state_v1';

class YangMillsInstantonEngine {
  private state: InstantonVacuumState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): InstantonVacuumState {
    return {
      thetaAngleRad: 1.25,                 // 預設 1.25 rad (明顯 CP 破缺角)
      gaugeCouplingConstantG: 1.45,        // 中等強度強耦合
      instantonScaleRhoFm: 0.33,           // 典型 QCD 瞬子半徑 ~1/3 fm
      axionScaleFaGev: 1.0e11,             // 10^11 GeV (標準可見軸子窗口)
      axionMechanismEnabled: false,
      regime: 'theta-vacuum-interference',
      instantonActionS: 37.5,
      wkbTunnelingRateGamma: 1.2e-4,
      vacuumEnergyDensityMevFm3: -32.5,
      topologicalSusceptibilityChiT: 190.0,
      effectiveThetaBarRad: 1.25,
      axionMassMicroEv: 57.0,
      tunnelingEventsCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): InstantonVacuumState {
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
      console.warn('[YangMillsInstantonEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[YangMillsInstantonEngine] 儲存失敗', e);
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
   * 播放瞬子穿隧爆發低頻轟鳴與高頻色散 (BPST Tunneling Blast & Dispersive Pop)
   */
  public playTunnelingBurst(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(48, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {
      console.warn('[YangMillsInstantonEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放 \theta-真空微音三和弦 (Theta Vacuum Phase Chime with Microtonal Shifts)
   */
  public playThetaVacuumChime(theta: number): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const baseFreq = 220.0 * (1.0 + 0.15 * Math.cos(theta));
      const frequencies = [baseFreq, baseFreq * 1.5, baseFreq * 2.0];

      frequencies.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), ctx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      });
    } catch (e) {
      console.warn('[YangMillsInstantonEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算 BPST 瞬子作用量、WKB 穿隧率、真空能與軸子質量
   */
  public recalculatePhysics(): void {
    const g = Math.max(0.6, this.state.gaugeCouplingConstantG);
    const theta = this.state.thetaAngleRad;
    const axionOn = this.state.axionMechanismEnabled;

    // 1. 瞬子歐幾里得作用量 S_inst = 8\pi^2 / g^2
    const sInst = (8.0 * Math.PI * Math.PI) / (g * g);
    this.state.instantonActionS = Number(sInst.toFixed(2));

    // 2. WKB 穿隧速率 \Gamma \approx 0.05 * (S_inst)^2 * \exp(-S_inst / 3.2)
    // 透過重整化比例確保數值可視性
    const tunnelingRate = 0.05 * Math.pow(sInst, 2) * Math.exp(-sInst / 4.5);
    this.state.wkbTunnelingRateGamma = Number(tunnelingRate.toExponential(3));

    // 3. 軸子機制與有效 \bar{\theta}
    if (axionOn) {
      // 軸子場動態抵消：\bar{\theta} -> 0
      this.state.effectiveThetaBarRad = 0.0001;
      this.state.regime = 'axion-cp-restoration';
    } else {
      this.state.effectiveThetaBarRad = Number(theta.toFixed(4));
    }

    const effTheta = this.state.effectiveThetaBarRad;

    // 4. 拓撲磁化率 \chi_t 與真空能量密度 \mathcal{E}(\theta) = - \chi_t \cos(\theta)
    const chiT = 190.0 * Math.exp(-Math.max(0, sInst - 30) / 10.0);
    this.state.topologicalSusceptibilityChiT = Number(chiT.toFixed(1));

    const energyDensity = -chiT * Math.cos(effTheta);
    this.state.vacuumEnergyDensityMevFm3 = Number(energyDensity.toFixed(2));

    // 5. 軸子質量 m_a \approx \sqrt{\chi_t} / f_a (單位 \mu eV)
    const faGev = Math.max(1e9, this.state.axionScaleFaGev);
    const maUev = (Math.sqrt(chiT) * 1e11) / faGev * 5.7;
    this.state.axionMassMicroEv = Number(maUev.toFixed(2));

    // 6. 相態邏輯判定
    if (!axionOn) {
      if (sInst > 55.0) {
        this.state.regime = 'classical-vacuum-wells';
      } else if (tunnelingRate > 0.05) {
        this.state.regime = 'quantum-tunneling-bpst';
      } else {
        this.state.regime = 'theta-vacuum-interference';
      }
    }
  }

  public update(deltaSeconds: number): void {
    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        theta: this.state.effectiveThetaBarRad,
        energyDensity: this.state.vacuumEnergyDensityMevFm3,
        tunnelingRate: this.state.wkbTunnelingRateGamma
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setThetaAngle(rad: number): void {
    this.state.thetaAngleRad = (rad % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    this.recalculatePhysics();
    this.saveState();
  }

  public setGaugeCoupling(g: number): void {
    this.state.gaugeCouplingConstantG = Math.max(0.6, Math.min(2.5, g));
    this.recalculatePhysics();
    this.saveState();
  }

  public toggleAxionMechanism(): void {
    this.state.axionMechanismEnabled = !this.state.axionMechanismEnabled;
    this.recalculatePhysics();
    this.playThetaVacuumChime(this.state.effectiveThetaBarRad);
    this.saveState();
  }

  /**
   * 手動觸發 BPST 瞬子量子穿隧 (Trigger BPST Instanton Tunneling Event)
   */
  public triggerInstantonTunneling(): void {
    this.state.tunnelingEventsCount += 1;
    this.playTunnelingBurst();
    this.playThetaVacuumChime(this.state.thetaAngleRad);
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: InstantonRegime[] = [
      'classical-vacuum-wells',
      'quantum-tunneling-bpst',
      'theta-vacuum-interference',
      'axion-cp-restoration'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'classical-vacuum-wells') {
      this.state.gaugeCouplingConstantG = 0.85;
      this.state.axionMechanismEnabled = false;
    } else if (this.state.regime === 'quantum-tunneling-bpst') {
      this.state.gaugeCouplingConstantG = 2.1;
      this.state.axionMechanismEnabled = false;
    } else if (this.state.regime === 'theta-vacuum-interference') {
      this.state.gaugeCouplingConstantG = 1.45;
      this.state.axionMechanismEnabled = false;
    } else {
      this.state.axionMechanismEnabled = true;
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<InstantonVacuumState> {
    return this.state;
  }
}

export const yangMillsInstantonEngine = new YangMillsInstantonEngine();
