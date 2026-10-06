/**
 * antimatterPropulsion.ts
 * 反物質暗能量湮滅推進矩陣引擎 (Antimatter Dark Energy Annihilation Propulsion Engine)
 * 
 * 物理與航行模擬：
 * 1. 正反物質（反質子 \bar{p}、正電子 e^+）與暗能量負壓強斥力場的微爆湮滅推進。
 * 2. 相對論性比衝 (I_sp ~ 10^7 s) 與逼近光速 (v/c -> 0.999c) 勞侖茲因子 (\gamma = 1 / \sqrt{1 - v^2/c^2}) 膨脹計算。
 * 3. 4 大磁約束微爆模式（反質子極限硬光子微爆、暗能量負壓曲率推進、繆子催化微爆、快子超光速尾流脈衝）。
 * 4. 磁鏡噴嘴 (Magnetic Mirror Nozzle) 發散角約束防護與暗能量混合比調控。
 * 5. 純代碼 Web Audio 合成相對論多普勒音爆、湮滅高能脈衝與磁約束震鳴。
 */

export type AntimatterMode = 'relativistic_pbar' | 'dark_energy_warp' | 'muon_catalyzed_burst' | 'tachyonic_pulse';

export interface AntimatterModeConfig {
  id: AntimatterMode;
  name: string;
  desc: string;
  ispBase: number; // 秒
  thrustScale: number;
  gammaMultiplier: number;
  baseFrequency: number;
}

export const ANTIMATTER_MODES: Record<AntimatterMode, AntimatterModeConfig> = {
  relativistic_pbar: {
    id: 'relativistic_pbar',
    name: '反質子極限光子微爆 (Relativistic p̄-p)',
    desc: '反質子與質子湮滅產生中性介子並衰變成超高能硬伽馬光子束，提供純淨動量推力',
    ispBase: 1.2e7,
    thrustScale: 1.0,
    gammaMultiplier: 1.0,
    baseFrequency: 140,
  },
  dark_energy_warp: {
    id: 'dark_energy_warp',
    name: '暗能量負壓曲率推進 (Dark Energy Negative Pressure)',
    desc: '注入負壓強暗能量流擴展局部時空，在湮滅前端形成相對論性拉伸微引力窪',
    ispBase: 2.5e7,
    thrustScale: 1.6,
    gammaMultiplier: 1.45,
    baseFrequency: 95,
  },
  muon_catalyzed_burst: {
    id: 'muon_catalyzed_burst',
    name: '繆子催化正反物質微爆 (Muon-Catalyzed Burst)',
    desc: '利用重負繆子縮小原子軌道半徑，大幅提升湮滅橫截面並降低磁約束熱損耗',
    ispBase: 1.8e7,
    thrustScale: 1.3,
    gammaMultiplier: 1.2,
    baseFrequency: 220,
  },
  tachyonic_pulse: {
    id: 'tachyonic_pulse',
    name: '快子超光速尾流脈衝 (Tachyonic Wake Pulse)',
    desc: '引導微爆釋放之虛快子場波紋，於船尾形成類空幾何反衝，推動勞侖茲因子極限躍遷',
    ispBase: 3.8e7,
    thrustScale: 2.2,
    gammaMultiplier: 2.1,
    baseFrequency: 310,
  },
};

const STORAGE_KEY = 'newworld_antimatter_propulsion_state_v1';

export class AntimatterPropulsionEngine {
  private static instance: AntimatterPropulsionEngine | null = null;

  public velocityFraction: number = 0.42; // v/c (0.0 ~ 0.9999)
  public antimatterReserveMg: number = 150.0; // mg
  public darkEnergyRatio: number = 0.35; // 0.0 ~ 1.0
  public magneticNozzleIntegrity: number = 96.5; // 0 ~ 100%
  public currentThrustKN: number = 450.0; // kN
  public accumulatedLightYears: number = 2.45; // 累計光年
  public totalBursts: number = 0;
  public currentMode: AntimatterMode = 'relativistic_pbar';
  public lastBurstTime: number = 0;

  // Web Audio Context
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): AntimatterPropulsionEngine {
    if (!AntimatterPropulsionEngine.instance) {
      AntimatterPropulsionEngine.instance = new AntimatterPropulsionEngine();
    }
    return AntimatterPropulsionEngine.instance;
  }

  /**
   * 勞侖茲時間膨脹因子 \gamma = 1 / \sqrt{1 - (v/c)^2}
   */
  public get lorentzGamma(): number {
    const v = Math.min(0.9999, Math.max(0, this.velocityFraction));
    const denom = Math.sqrt(1 - v * v);
    return denom > 0.0001 ? 1 / denom : 100.0;
  }

  /**
   * 當前比衝 (Isp in seconds)
   */
  public get currentIsp(): number {
    const modeCfg = ANTIMATTER_MODES[this.currentMode];
    return modeCfg.ispBase * (1 + this.darkEnergyRatio * 0.8) * (this.magneticNozzleIntegrity / 100);
  }

  /**
   * 啟動一次高能湮滅推進微爆
   */
  public triggerAnnihilationBurst(): boolean {
    if (this.antimatterReserveMg < 1.0) {
      return false;
    }

    const modeCfg = ANTIMATTER_MODES[this.currentMode];
    const mgUsed = 1.2;
    this.antimatterReserveMg = Math.max(0, this.antimatterReserveMg - mgUsed);

    // 計算推力躍增
    const thrustBoost = 1200 * modeCfg.thrustScale * (1 + this.darkEnergyRatio * 0.5);
    this.currentThrustKN += thrustBoost;

    // 逼近光速計算 (v_new = (v + dv) / (1 + v*dv/c^2) 相對論速度相加)
    const dvFraction = 0.045 * modeCfg.gammaMultiplier * (this.magneticNozzleIntegrity / 100);
    const newV = (this.velocityFraction + dvFraction) / (1 + this.velocityFraction * dvFraction);
    this.velocityFraction = Math.min(0.9995, Math.max(0.01, newV));

    // 噴嘴磨損與修復微擾
    const wear = 0.45 * (1 + (1 - this.darkEnergyRatio));
    this.magneticNozzleIntegrity = Math.max(10, this.magneticNozzleIntegrity - wear);

    this.totalBursts++;
    this.lastBurstTime = Date.now();

    this.playAnnihilationBlast();
    this.saveState();
    return true;
  }

  /**
   * 調控暗能量混合比
   */
  public setDarkEnergyRatio(ratio: number): void {
    this.darkEnergyRatio = Math.max(0.0, Math.min(1.0, ratio));
    this.saveState();
  }

  /**
   * 切換推進模式
   */
  public setMode(mode: AntimatterMode): void {
    this.currentMode = mode;
    this.playModeSwitchTone();
    this.saveState();
  }

  /**
   * 修復校準超導磁約束噴嘴
   */
  public repairMagneticNozzle(): void {
    this.magneticNozzleIntegrity = Math.min(100, this.magneticNozzleIntegrity + 18.0);
    this.playNozzleCalibrationChime();
    this.saveState();
  }

  /**
   * 補給反物質儲備 (毫克)
   */
  public restockAntimatter(amountMg: number = 25.0): void {
    this.antimatterReserveMg = Math.min(500.0, this.antimatterReserveMg + amountMg);
    this.saveState();
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    // 推力自然衰減至巡航水平
    if (this.currentThrustKN > 200) {
      this.currentThrustKN = Math.max(200, this.currentThrustKN - 150 * dt);
    }

    // 累計相對論航行光年
    const speedInC = this.velocityFraction;
    const lyPerSecond = (speedInC * 0.00015);
    this.accumulatedLightYears += lyPerSecond * dt;

    // 極微量環境冷反物質被動收集
    if (this.antimatterReserveMg < 20.0) {
      this.antimatterReserveMg = Math.min(20.0, this.antimatterReserveMg + 0.05 * dt);
    }
  }

  // ================= 音效合成 (純 Web Audio API) =================

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * 播放正反物質微爆音爆 (Annihilation Blast with Doppler Tail)
   */
  public playAnnihilationBlast(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const modeCfg = ANTIMATTER_MODES[this.currentMode];

      // 1. 低頻震爆正弦波 (Sub-bass impact)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(modeCfg.baseFrequency * 1.8, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.55);

      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.65);

      // 2. 高能伽馬射線白噪聲微爆 (Gamma Burst Noise)
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.07));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(2.5, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.36);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放模式切換和弦
   */
  public playModeSwitchTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const freq = ANTIMATTER_MODES[this.currentMode].baseFrequency;

      [freq, freq * 1.25, freq * 1.5].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + idx * 0.06);
        gain.gain.setValueAtTime(0.12, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.26);
      });
    } catch {
      // 靜默處理
    }
  }

  /**
   * 噴嘴校準晶片音
   */
  public playNozzleCalibrationChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, t); // D5
      osc.frequency.exponentialRampToValueAtTime(880.0, t + 0.3); // A5
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    } catch {
      // 靜默處理
    }
  }

  // ================= 儲存與讀取 =================

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = {
        velocityFraction: this.velocityFraction,
        antimatterReserveMg: this.antimatterReserveMg,
        darkEnergyRatio: this.darkEnergyRatio,
        magneticNozzleIntegrity: this.magneticNozzleIntegrity,
        currentThrustKN: this.currentThrustKN,
        accumulatedLightYears: this.accumulatedLightYears,
        totalBursts: this.totalBursts,
        currentMode: this.currentMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // 忽略
    }
  }

  public loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.velocityFraction === 'number') this.velocityFraction = parsed.velocityFraction;
      if (typeof parsed.antimatterReserveMg === 'number') this.antimatterReserveMg = parsed.antimatterReserveMg;
      if (typeof parsed.darkEnergyRatio === 'number') this.darkEnergyRatio = parsed.darkEnergyRatio;
      if (typeof parsed.magneticNozzleIntegrity === 'number') this.magneticNozzleIntegrity = parsed.magneticNozzleIntegrity;
      if (typeof parsed.currentThrustKN === 'number') this.currentThrustKN = parsed.currentThrustKN;
      if (typeof parsed.accumulatedLightYears === 'number') this.accumulatedLightYears = parsed.accumulatedLightYears;
      if (typeof parsed.totalBursts === 'number') this.totalBursts = parsed.totalBursts;
      if (parsed.currentMode && ANTIMATTER_MODES[parsed.currentMode as AntimatterMode]) {
        this.currentMode = parsed.currentMode as AntimatterMode;
      }
    } catch {
      // 忽略
    }
  }
}

export const antimatterPropulsion = AntimatterPropulsionEngine.getInstance();
