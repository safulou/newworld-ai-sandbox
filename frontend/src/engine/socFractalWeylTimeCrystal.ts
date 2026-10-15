/**
 * 自旋軌道耦合分形外爾時間晶體引擎 (Spin-Orbit Coupled Fractal Weyl Time Crystal Engine)
 * 
 * 物理原理：
 * 1. 在分形幾何晶格（三維謝爾賓斯基四面體分形，分形豪斯多夫維度 d_f = ln 4 / ln 2 = 2.0，或曼格海綿 d_f = ln 20 / ln 3 ≈ 2.727）上，
 *    電子波函數在非整數維度空間中傳播，受到外爾節點的分形費米弧與強自旋軌道耦合 (SOC, λ_SOC) 的交織調製。
 * 2. 引入週期性弗洛凱 (Floquet) 自旋反轉驅動 H(t) = H(t + T)，自旋系統自發破缺離散時間平移對稱性 (DTTS)，
 *    形成時間維度的離散拓撲晶體，展現強健的次諧波響應（4T 週期四倍化 / Period Quadrupling, f = 1/4T）。
 * 3. 分形霍夫施塔特蝴蝶 (Hofstadter Butterfly) 剛性機制：在分形晶格磁通比 Φ/Φ₀ 與驅動微擾 ε 下，
 *    多體局域化 (MBL) 效應抑制加熱與熱化退相干，使時間晶體序參量 ⟨σ_z(t)⟩ 的次諧波振盪呈現拓撲保護的晶體剛性 (Rigidity)。
 * 4. 系統提供可視化分形能隙投影、次諧波傅立葉功率譜峰值、以及非平衡拓撲邊界特徵。
 */

export type SocFractalCrystalRegime = 
  | 'thermalized-ergodic'
  | 'prethermal-weyl-oscillator'
  | 'soc-subharmonic-time-crystal'
  | 'hofstadter-fractal-topological-rigid';

export interface SocFractalTimeCrystalState {
  socStrengthLambda: number;           // 自旋軌道耦合強度 λ_SOC (meV, 0 ~ 50)
  floquetDriveFreqKhz: number;         // 弗洛凱驅動頻率 Ω / 2π (kHz, 1.0 ~ 50.0)
  perturbationEpsilon: number;         // 翻轉脈衝角度微擾 ε (0.0 ~ 0.25 rad)
  fractalRecursionDepth: number;       // 分形遞歸深度 (1 ~ 5)
  fractalHausdorffDim: number;         // 豪斯多夫分形維度 d_f (2.0 ~ 2.727)
  subharmonicPeriodMultiple: number;   // 次諧波週期倍數 (固定為 4T)
  timeCrystalRigidityIndex: number;    // 時間晶體剛性指數 R (0.0 ~ 1.0)
  orderParameterSigmaZ: number;        // 當前時間晶體序參量 ⟨σ_z(t)⟩ (-1.0 ~ 1.0)
  fourierSubharmonicPeakDb: number;    // 傅立葉次諧波峰值功率 (dB, -60 ~ +12 dB)
  activeRegime: SocFractalCrystalRegime;
  pulsePhase: number;
  fourierSpectrumSeries: number[];     // 次諧波頻譜分佈採樣 (0 ~ 2Ω)
  magnetizationTrajectory: number[];   // 序參量時間軌跡歷程
}

const STORAGE_KEY = 'newworld_soc_fractal_weyl_time_crystal_state_v1';

export class SocFractalWeylTimeCrystalEngine {
  private state: SocFractalTimeCrystalState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): SocFractalTimeCrystalState {
    const defaults: SocFractalTimeCrystalState = {
      socStrengthLambda: 28.5,
      floquetDriveFreqKhz: 16.0,
      perturbationEpsilon: 0.04,
      fractalRecursionDepth: 3,
      fractalHausdorffDim: 2.585,
      subharmonicPeriodMultiple: 4,
      timeCrystalRigidityIndex: 0.942,
      orderParameterSigmaZ: 0.88,
      fourierSubharmonicPeakDb: 8.6,
      activeRegime: 'soc-subharmonic-time-crystal',
      pulsePhase: 0,
      fourierSpectrumSeries: [],
      magnetizationTrajectory: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load SocFractalWeylTimeCrystalEngine state:', e);
      }
    }
    return defaults;
  }

  public saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save SocFractalWeylTimeCrystalEngine state:', e);
      }
    }
  }

  public getState(): Readonly<SocFractalTimeCrystalState> {
    return this.state;
  }

  public setSocStrength(lambda: number): void {
    this.state.socStrengthLambda = Math.max(0, Math.min(50, lambda));
    this.recomputePhysics();
    this.saveState();
  }

  public setFloquetDriveFrequency(freqKhz: number): void {
    this.state.floquetDriveFreqKhz = Math.max(1.0, Math.min(50.0, freqKhz));
    this.recomputePhysics();
    this.saveState();
  }

  public setPerturbationEpsilon(eps: number): void {
    this.state.perturbationEpsilon = Math.max(0.0, Math.min(0.25, eps));
    this.recomputePhysics();
    this.saveState();
  }

  public setFractalRecursionDepth(depth: number): void {
    this.state.fractalRecursionDepth = Math.max(1, Math.min(5, Math.floor(depth)));
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const { socStrengthLambda, perturbationEpsilon, fractalRecursionDepth } = this.state;

    // 計算分形豪斯多夫維度 (曼格-謝爾賓斯基複合分形維度，隨遞歸深度微調)
    // 基準維度 d_f = 2.0 + 0.585 * (1 - e^(-depth/2))
    this.state.fractalHausdorffDim = Number((2.0 + 0.585 * (1 - Math.exp(-fractalRecursionDepth / 2.0)) + 0.142 * Math.log10(fractalRecursionDepth)).toFixed(3));

    // 計算時間晶體剛性 (Rigidity Index)
    // 當 SOC 強度 (20~50 meV) 且微擾 epsilon 在臨界門檻 (<0.15 rad) 以內時，剛性達到 0.85+
    const socFactor = Math.min(1.0, Math.sqrt(socStrengthLambda / 50.0) * 1.25);
    const pertDecay = Math.max(0, 1.0 - Math.pow(perturbationEpsilon / 0.15, 2.0));
    const fractalProtection = 0.85 + 0.15 * (fractalRecursionDepth / 5.0);
    this.state.timeCrystalRigidityIndex = Number(Math.max(0, Math.min(0.999, socFactor * pertDecay * fractalProtection)).toFixed(3));

    // 判斷體系模式
    if (this.state.timeCrystalRigidityIndex > 0.85 && perturbationEpsilon < 0.08) {
      this.state.activeRegime = 'hofstadter-fractal-topological-rigid';
    } else if (this.state.timeCrystalRigidityIndex > 0.5) {
      this.state.activeRegime = 'soc-subharmonic-time-crystal';
    } else if (this.state.timeCrystalRigidityIndex > 0.2) {
      this.state.activeRegime = 'prethermal-weyl-oscillator';
    } else {
      this.state.activeRegime = 'thermalized-ergodic';
    }

    // 計算次諧波傅立葉峰值功率 (dB)
    const baseDb = -40;
    const peakGain = 50 * this.state.timeCrystalRigidityIndex;
    this.state.fourierSubharmonicPeakDb = Number((baseDb + peakGain).toFixed(1));

    // 生成次諧波頻譜 series (64 個採樣點，次諧波峰在 1/4 處，即 index 16)
    const spectrumPoints: number[] = [];
    for (let i = 0; i < 64; i++) {
      const fRatio = i / 64; // 0 to 1 (對應 0 to 4 * f_subharmonic)
      // 在 fRatio = 0.25 (次諧波 4T 對應頻率 f_drive / 4) 出現銳利峰
      const dist4T = Math.abs(fRatio - 0.25);
      const lorentzian4T = (this.state.timeCrystalRigidityIndex * 0.9) / (1 + Math.pow(dist4T * 80, 2));
      // 在 fRatio = 1.0 (基頻驅動頻率) 出現次峰
      const distDrive = Math.abs(fRatio - 1.0);
      const lorentzianDrive = 0.3 / (1 + Math.pow(distDrive * 60, 2));
      // 熱化底噪
      const noise = (1 - this.state.timeCrystalRigidityIndex) * 0.2 * Math.sin(i * 1.7 + 0.5);
      spectrumPoints.push(Math.max(0.01, Math.min(1.0, lorentzian4T + lorentzianDrive + Math.abs(noise))));
    }
    this.state.fourierSpectrumSeries = spectrumPoints;

    // 生成序參量時間軌跡 (50 個採樣點)
    if (this.state.magnetizationTrajectory.length === 0) {
      const traj: number[] = [];
      for (let step = 0; step < 50; step++) {
        const phi = (step / 4.0) * (2 * Math.PI); // 4T 週期四倍化
        const val = this.state.timeCrystalRigidityIndex * Math.cos(phi) * Math.cos(step * perturbationEpsilon);
        traj.push(Number(val.toFixed(3)));
      }
      this.state.magnetizationTrajectory = traj;
    }
  }

  public update(deltaSeconds: number): void {
    // 依據驅動頻率推進相角
    const angularFreq = (this.state.floquetDriveFreqKhz * 1000) * (2 * Math.PI) * 0.0001; // 時間縮放
    this.state.pulsePhase = (this.state.pulsePhase + angularFreq * deltaSeconds) % (8 * Math.PI);

    // 4T 週期四倍化次諧波序參量計算
    const period4TPhase = this.state.pulsePhase / 4.0;
    const pertNoise = Math.sin(this.state.pulsePhase * 3.7) * this.state.perturbationEpsilon * 0.2;
    this.state.orderParameterSigmaZ = Number(
      (this.state.timeCrystalRigidityIndex * Math.cos(period4TPhase) + pertNoise).toFixed(3)
    );

    // 滾動時間軌跡
    if (this.state.magnetizationTrajectory.length > 50) {
      this.state.magnetizationTrajectory.shift();
    }
    this.state.magnetizationTrajectory.push(this.state.orderParameterSigmaZ);
  }

  public triggerChirpAudio(): void {
    if (typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // 4T 週期次諧波晶體風鈴雙音合成 (基頻 540 Hz + 次諧波 135 Hz 四倍週期共鳴)
      const baseFreq = 540.0;
      const subharmonicFreq = 135.0;

      // 主振盪器 (晶體諧波)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.35);

      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      // 次諧波振盪器 (4T 重音擊打)
      const oscSub = this.audioCtx.createOscillator();
      const gainSub = this.audioCtx.createGain();
      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(subharmonicFreq, now);
      oscSub.frequency.setValueAtTime(subharmonicFreq * 2, now + 0.2);

      gainSub.gain.setValueAtTime(0.0001, now);
      gainSub.gain.exponentialRampToValueAtTime(0.18, now + 0.06);
      gainSub.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc1.connect(gain1);
      oscSub.connect(gainSub);
      gain1.connect(this.audioCtx.destination);
      gainSub.connect(this.audioCtx.destination);

      osc1.start(now);
      oscSub.start(now);
      osc1.stop(now + 0.5);
      oscSub.stop(now + 0.5);
    } catch (e) {
      console.warn('Web Audio synthesis not supported or blocked:', e);
    }
  }

  public resetDefaults(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    this.state = this.loadState();
    this.recomputePhysics();
  }

  public destroy(): void {
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch (e) {
        console.warn('AudioContext close error:', e);
      }
      this.audioCtx = null;
    }
  }
}

export const socFractalWeylTimeCrystalEngine = new SocFractalWeylTimeCrystalEngine();
