/**
 * 非平衡態 Floquet 預熱拓撲時間晶體 (Floquet Prethermal Topological Time Crystal & Dynamic Symmetry Breaker)
 * 
 * 理論基礎：
 * 1. 週期性 Floquet 驅動動力學 (Periodically Driven Floquet Systems, Shirley 1965, Bukov et al. 2015)
 *    H(t) = H(t + T)，驅動頻率 Ω = 2π / T。
 * 2. 離散時間平移對稱破缺 (Discrete Time Translation Symmetry Breaking, DTTSB, Wilczek 2012, Khemani et al. 2016)
 *    自旋長程可觀測量表現出亞諧波響應 (例如 2T 週期，ω = Ω/2)。
 * 3. 預熱高原 (Prethermal Plateau, Mori et al. 2016, Kuwahara et al. 2016)
 *    高頻驅動下能量吸收率被指數級抑制 τ_pre ~ exp(ħΩ / J)，阻止熱化死寂。
 * 4. 反常 Floquet-Chern 拓撲相 (Anomalous Floquet Topological Insulator, Rudner et al. 2013)
 *    周期驅動圓偏振光打開拓撲能隙，產生手性單向 Floquet 邊緣傳播態。
 * 5. 4 大非平衡動力學體制：
 *    - subharmonic_2t_time_crystal: 2T 亞諧波離散時間平移對稱破缺晶體
 *    - floquet_prethermal_plateau: 高頻反熱化預熱拓撲高原保護態
 *    - anomalous_floquet_chern_insulator: 反常 Floquet 手性邊緣流與拓撲能隙打開
 *    - many_body_localized_dtc: 多體局域化 (MBL) 紊亂保護時間晶體
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成 2T 頻閃節奏敲擊音、Floquet 亞諧波分頻純音、能隙共振掃頻音
 * - HTML5 Canvas 2D 呈現頻閃自旋晶格翻轉動態、2T 週期磁化振盪曲線與 Floquet 準能量譜 (-π/T ~ π/T)
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type FloquetRegime = 
  | 'subharmonic_2t_time_crystal' 
  | 'floquet_prethermal_plateau' 
  | 'anomalous_floquet_chern_insulator' 
  | 'many_body_localized_dtc';

export interface StroboscopicRecord {
  cycle: number;
  magnetization: number; // (-1.0 ~ 1.0)
  subharmonicPhase: number;
  prethermalEnergy: number;
  timestamp: number;
}

export interface FloquetTimeCrystalState {
  regime: FloquetRegime;
  drivePeriodMs: number; // 驅動週期 T (1.0 ~ 20.0 ms)
  driveFrequencyKhz: number; // Ω / 2π (kHz)
  subharmonicOrder: number; // 亞諧波倍率 (通常為 2，即 2T)
  stroboscopicMagnetization: number; // 頻閃磁化強度 M(nT)
  floquetGapMev: number; // Floquet 拓撲能隙 (meV)
  prethermalLifetimeSec: number; // 預熱高原壽命 τ_pre (s)
  timeTranslationSymmetryBreakingPercent: number; // 破缺純度 (0 ~ 100%)
  floquetChernIndex: number; // Floquet-Chern 數
  stroboscopicHistory: StroboscopicRecord[];
  autoStroboscopicDriving: boolean;
  totalDrivenCycles: number;
}

const STORAGE_KEY = 'newworld_floquet_time_crystal';

class FloquetTimeCrystalEngine {
  private state: FloquetTimeCrystalState = {
    regime: 'subharmonic_2t_time_crystal',
    drivePeriodMs: 5.0,
    driveFrequencyKhz: 0.2, // 1 / 5ms = 0.2 kHz
    subharmonicOrder: 2,
    stroboscopicMagnetization: 0.92,
    floquetGapMev: 14.5,
    prethermalLifetimeSec: 120.0,
    timeTranslationSymmetryBreakingPercent: 96.8,
    floquetChernIndex: 1,
    stroboscopicHistory: [],
    autoStroboscopicDriving: true,
    totalDrivenCycles: 240
  };

  private currentCycleCounter: number = 0;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeFloquetPhysics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): FloquetTimeCrystalState {
    return { ...this.state, stroboscopicHistory: [...this.state.stroboscopicHistory] };
  }

  public setRegime(regime: FloquetRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'subharmonic_2t_time_crystal':
        this.state.subharmonicOrder = 2;
        this.state.floquetChernIndex = 0;
        break;
      case 'floquet_prethermal_plateau':
        this.state.subharmonicOrder = 2;
        this.state.floquetChernIndex = 0;
        break;
      case 'anomalous_floquet_chern_insulator':
        this.state.subharmonicOrder = 1;
        this.state.floquetChernIndex = 1;
        break;
      case 'many_body_localized_dtc':
        this.state.subharmonicOrder = 2;
        this.state.floquetChernIndex = 0;
        break;
    }
    this.recomputeFloquetPhysics();
    this.playStroboscopicBeat();
    this.saveState();
  }

  public setDrivePeriod(periodMs: number): void {
    this.state.drivePeriodMs = Math.max(1.0, Math.min(20.0, parseFloat(periodMs.toFixed(1))));
    this.state.driveFrequencyKhz = parseFloat((1.0 / this.state.drivePeriodMs).toFixed(3));
    this.recomputeFloquetPhysics();
    this.saveState();
  }

  public setFloquetGap(gapMev: number): void {
    this.state.floquetGapMev = Math.max(2.0, Math.min(40.0, parseFloat(gapMev.toFixed(1))));
    this.recomputeFloquetPhysics();
    this.saveState();
  }

  public toggleAutoDriving(): void {
    this.state.autoStroboscopicDriving = !this.state.autoStroboscopicDriving;
    this.saveState();
  }

  public triggerCycleFlip(): void {
    this.currentCycleCounter += 1;
    this.state.totalDrivenCycles += 1;
    
    // 2T 週期中，奇數週期自旋向下，偶數週期自旋向上
    const sign = (this.currentCycleCounter % 2 === 0) ? 1 : -1;
    const noise = (Math.random() - 0.5) * 0.08;
    const mag = parseFloat((sign * (0.90 + noise)).toFixed(3));
    this.state.stroboscopicMagnetization = mag;

    const record: StroboscopicRecord = {
      cycle: this.currentCycleCounter,
      magnetization: mag,
      subharmonicPhase: (this.currentCycleCounter % 2) * Math.PI,
      prethermalEnergy: 100.0 - (this.currentCycleCounter % 50) * 0.2,
      timestamp: Date.now()
    };
    this.state.stroboscopicHistory.unshift(record);
    if (this.state.stroboscopicHistory.length > 30) {
      this.state.stroboscopicHistory.pop();
    }

    this.playStroboscopicBeat();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoStroboscopicDriving) {
      // 依驅動週期累積翻轉
      const cyclesToAdvance = deltaSeconds / (this.state.drivePeriodMs * 0.001);
      if (cyclesToAdvance >= 0.8 || Math.random() < 0.25) {
        this.triggerCycleFlip();
      }
    }
  }

  private recomputeFloquetPhysics(): void {
    // 預熱指數受抑壽命 τ ~ exp(ħΩ / J)
    const omega = 1000.0 / this.state.drivePeriodMs; // Hz
    const expFactor = Math.min(5.0, omega / 300.0);
    this.state.prethermalLifetimeSec = parseFloat((30.0 * Math.exp(expFactor)).toFixed(1));

    // 時間平移對稱破缺度
    let symmetryBreaking = 90.0 + (this.state.floquetGapMev / 40.0) * 8.5;
    if (this.state.regime === 'subharmonic_2t_time_crystal') symmetryBreaking += 1.2;
    if (this.state.regime === 'many_body_localized_dtc') symmetryBreaking += 1.8;
    this.state.timeTranslationSymmetryBreakingPercent = Math.min(99.9, parseFloat(symmetryBreaking.toFixed(1)));
  }

  // --- Web Audio 程序化合成 ---

  public playStroboscopicBeat(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 節奏敲擊脈衝
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      
      // 亞諧波音高：偶數週期較高，奇數週期較低 (例如 300Hz 與 150Hz)
      const baseFreq = (this.currentCycleCounter % 2 === 0) ? 330 : 165;
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch { /* ignore */ }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* ignore */ }
  }
}

export const floquetTimeCrystalEngine = new FloquetTimeCrystalEngine();
