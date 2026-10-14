/**
 * 舒溫格效應與強場量子電動力學真空衰變雪崩引擎
 * (Schwinger Effect & Strong-Field QED Vacuum Breakdown Engine)
 *
 * 核心物理理論：
 * 1. 舒溫格臨界電場 (Schwinger Critical Electric Field)：
 *    當電場在一個電子康普頓波長 $\lambda_C = \hbar / (m_e c)$ 內所做的功達到電子靜止能量 $m_e c^2$ 時：
 *    E_{\text{crit}} = \frac{m_e^2 c^3}{e \hbar} \approx 1.32 \times 10^{18}\text{ V/m}
 *    對應激光極限強度 $I_{\text{crit}} \approx 4.3 \times 10^{29}\text{ W/cm}^2$。
 * 2. 非微擾真空衰變率 (Non-Perturbative Schwinger Pair Creation Rate)：
 *    在強電場作用下，狄拉克海負能量電子跨越 $2 m_e c^2$ 能隙透過量子穿隧效應進入正能量態，
 *    自發產生電子-正電子對 (e⁺-e⁻)。單位四維時空體積產率：
 *    \Gamma = \frac{(eE)^2}{4\pi^3 \hbar^2 c} \sum_{n=1}^\infty \frac{1}{n^2} \exp\left( - \frac{n \pi m_e^2 c^3}{e \hbar E} \right)
 *    當無量綱場強 $\epsilon = E / E_{\text{crit}} \ge 0.1$ 時，穿隧指數壓制顯著減弱。
 * 3. QED 級聯雪崩等離子體 (QED Avalanche & Breit-Wheeler Cascades)：
 *    產生的初級正負電子在超強激光場中以極端相對論性加速度加速 ($\gamma \gg 10^3$)，發射高能硬伽瑪射線光子；
 *    硬光子與強激光場碰撞透過非線性 Breit-Wheeler 過程 ($\gamma + n\omega \to e^+ + e^-$) 繁衍第二代帶電粒子，
 *    引發自我維持的指數級正負電子等離子體雪崩 (Exponential Pair Avalanche)。
 * 4. 真空極化非線性遮蔽與場衰減 (Vacuum Polarization Screening)：
 *    高密度生成的電子-正電子等離子體雲產生反向感應電場，使局部強場衰退並在微觀皮秒內達到等離子體飽和臨界。
 */

export type SchwingerRegime =
  | 'sub-critical-tunneling-suppressed'   // 亞臨界極弱場相 (E << E_crit, 穿隧被指數壓制)
  | 'quantum-schwinger-pair-onset'        // 舒溫格真空電離萌生相 (E ~ 0.1 - 0.5 E_crit)
  | 'qed-cascade-avalanche'               // 非線性 Breit-Wheeler 級聯雪崩相 (等離子體指數暴增)
  | 'plasma-screening-saturation';        // 正負電子對真空極化反向遮蔽飽和態 (場強自限)

export interface SchwingerVacuumState {
  electricFieldVm: number;                // 施加強電場強度 E (10^16 ~ 3 * 10^18 V/m)
  laserIntensityWcm2: number;             // 等效激光焦點強度 I (10^26 ~ 10^30 W/cm^2)
  avalancheMultiplicationFactor: number;  // 級聯倍增因子 (1 ~ 10^6)
  magneticGuidingTesla: number;           // 側向約束磁場 B (0 ~ 1000 Tesla)
  regime: SchwingerRegime;

  // 動態演算物理指標
  fieldRatioEOverEcrit: number;           // 電場與臨界場之比 \epsilon = E / E_crit
  pairProductionRateM4S: number;          // 單位時空體積正負電子對產率 \Gamma (m^-3 s^-1)
  positronDensityM3: number;              // 累積正電子等離子體密度 n_e (m^-3)
  avalancheGrowthRatePerFs: number;       // 雪崩增長率 (fs^-1)
  screeningBackFieldVm: number;           // 真空等離子體反向感應遮蔽場 (V/m)
  totalPairCreationsCount: number;        // 累計穿隧創生事件計數
  telemetryHistory: Array<{
    timestamp: number;
    eField: number;
    pairRate: number;
    density: number;
  }>;
}

const STORAGE_KEY = 'newworld_schwinger_vacuum_breakdown_state_v1';
const E_CRIT_VM = 1.32e18; // 舒溫格臨界電場 (1.32 * 10^18 V/m)

class SchwingerVacuumEngine {
  private state: SchwingerVacuumState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): SchwingerVacuumState {
    return {
      electricFieldVm: 2.64e17,            // 0.20 E_crit (典型強場萌生區)
      laserIntensityWcm2: 1.7e28,
      avalancheMultiplicationFactor: 150,
      magneticGuidingTesla: 150.0,
      regime: 'quantum-schwinger-pair-onset',
      fieldRatioEOverEcrit: 0.20,
      pairProductionRateM4S: 4.8e32,
      positronDensityM3: 1.2e26,
      avalancheGrowthRatePerFs: 0.18,
      screeningBackFieldVm: 1.2e16,
      totalPairCreationsCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): SchwingerVacuumState {
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
      console.warn('[SchwingerVacuumEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[SchwingerVacuumEngine] 儲存失敗', e);
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
   * 播放超強激光場聚焦蓄能衝擊音 (High-Energy Laser Focus Charging Sweep)
   */
  public playLaserChargingSweep(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.45);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.45);
      filter.Q.setValueAtTime(4.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch (e) {
      console.warn('[SchwingerVacuumEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放舒溫格真空電離雪崩電漿爆裂音 (Vacuum Breakdown Pair Avalanche Crackle)
   */
  public playBreakdownAvalancheBurst(intensity: number = 1.0): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // 1. 低頻真空穿隧下潛衝擊
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18 * intensity, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);

      // 2. 隨機雪崩爆裂噪聲 (Avalanche plasma micro-bursts)
      const bufferSize = ctx.sampleRate * 0.35;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1200, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12 * intensity, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start();
    } catch (e) {
      console.warn('[SchwingerVacuumEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算舒溫格產率、級聯雪崩倍增與等離子體遮蔽
   */
  public recalculatePhysics(): void {
    const E = Math.max(1e15, this.state.electricFieldVm);
    const eps = E / E_CRIT_VM;
    this.state.fieldRatioEOverEcrit = Number(eps.toFixed(3));

    // 等效激光強度 I = (1/2) \epsilon_0 c E^2
    const intensity = 1.327e-3 * E * E;
    this.state.laserIntensityWcm2 = Number(intensity.toExponential(2));

    // 1. 舒溫格真空電離率 \Gamma \propto (eE)^2 * \exp(-\pi / \epsilon)
    // 透過標準尺度截斷保護數值穩定
    const exponent = Math.PI / Math.max(0.01, eps);
    let rate: number;
    if (exponent > 80) {
      rate = 1e12; // 極小亞臨界背景
    } else {
      rate = 1e36 * Math.pow(eps, 2) * Math.exp(-exponent);
    }
    this.state.pairProductionRateM4S = Number(rate.toExponential(3));

    // 2. 級聯雪崩增長率 (fs^-1) 與累積正負電子密度
    // 當 eps > 0.1 且能量足夠激發 Breit-Wheeler 過程時，雪崩增長為正
    const growth = Math.max(0.001, (eps - 0.08) * 1.25);
    this.state.avalancheGrowthRatePerFs = Number(growth.toFixed(3));

    const factor = Math.max(1, this.state.avalancheMultiplicationFactor);
    const density = rate * 1e-10 * factor;
    this.state.positronDensityM3 = Number(density.toExponential(3));

    // 3. 真空極化反向感應遮蔽場 (Screening Back Field)
    // E_back \propto e * n_e * L_plasma
    const backField = Math.min(E * 0.92, density * 1.6e-19 * 1e-5 * 0.08);
    this.state.screeningBackFieldVm = Number(backField.toExponential(3));

    // 4. 相態邏輯判定
    if (eps < 0.08) {
      this.state.regime = 'sub-critical-tunneling-suppressed';
    } else if (backField > E * 0.6) {
      this.state.regime = 'plasma-screening-saturation';
    } else if (factor > 2000 && eps > 0.15) {
      this.state.regime = 'qed-cascade-avalanche';
    } else {
      this.state.regime = 'quantum-schwinger-pair-onset';
    }
  }

  public update(deltaSeconds: number): void {
    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        eField: this.state.electricFieldVm,
        pairRate: this.state.pairProductionRateM4S,
        density: this.state.positronDensityM3
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setElectricField(vm: number): void {
    this.state.electricFieldVm = Math.max(1e16, Math.min(3.5e18, vm));
    this.recalculatePhysics();
    this.saveState();
  }

  public setElectricFieldRatio(ratio: number): void {
    this.setElectricField(ratio * E_CRIT_VM);
  }

  public setAvalancheFactor(factor: number): void {
    this.state.avalancheMultiplicationFactor = Math.max(1, Math.min(1e6, factor));
    this.recalculatePhysics();
    this.saveState();
  }

  public setMagneticGuiding(tesla: number): void {
    this.state.magneticGuidingTesla = Math.max(0, Math.min(1000.0, tesla));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發強場真空衰變雪崩 (Trigger QED Vacuum Breakdown Event)
   */
  public triggerVacuumBreakdown(): void {
    this.state.electricFieldVm = 1.32e18 * 0.65; // 0.65 E_crit
    this.state.avalancheMultiplicationFactor = 50000;
    this.state.totalPairCreationsCount += 1;
    this.state.regime = 'qed-cascade-avalanche';
    this.recalculatePhysics();
    this.playLaserChargingSweep();
    this.playBreakdownAvalancheBurst(1.5);
    this.saveState();
  }

  public triggerCascadeAvalanche(): void {
    this.triggerVacuumBreakdown();
  }

  public cycleRegime(): void {
    const regimes: SchwingerRegime[] = [
      'sub-critical-tunneling-suppressed',
      'quantum-schwinger-pair-onset',
      'qed-cascade-avalanche',
      'plasma-screening-saturation'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'sub-critical-tunneling-suppressed') {
      this.state.electricFieldVm = 4.5e16;
      this.state.avalancheMultiplicationFactor = 5;
    } else if (this.state.regime === 'quantum-schwinger-pair-onset') {
      this.state.electricFieldVm = 2.64e17;
      this.state.avalancheMultiplicationFactor = 50;
    } else if (this.state.regime === 'qed-cascade-avalanche') {
      this.triggerVacuumBreakdown();
      return;
    } else {
      this.state.electricFieldVm = 1.8e18;
      this.state.avalancheMultiplicationFactor = 200000;
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<SchwingerVacuumState> {
    return this.state;
  }
}

export const schwingerVacuumEngine = new SchwingerVacuumEngine();
