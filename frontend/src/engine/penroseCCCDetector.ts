/**
 * penroseCCCDetector.ts
 * 潘洛斯宇宙循環相干引力波測量儀引擎 (Penrose CCC Graviton Detector Engine)
 * 
 * 物理與宇宙學模擬：
 * 1. 羅傑·潘洛斯 (Roger Penrose) 共形循環宇宙學 (Conformal Cyclic Cosmology, CCC)。
 * 2. 上一個宇宙紀元 (Previous Aeon) 的超大質量黑洞碰撞於當前宇宙微波背景 (CMB) 留下同心同溫環「霍金點」(Hawking Points)。
 * 3. 共形度規縮放 \hat{g}_{ab} = \Omega^2 g_{ab}，在終極質量蒸發後抹平空間尺度，無縫連接新紀元大爆炸。
 * 4. 4 大跨紀元觀測模式（前紀元黑洞碰撞環、CMB 霍金點陣列、共形重整化度規、跨紀元因果視界）。
 * 5. 純代碼 Web Audio 合成跨紀元低頻引力波嗡鳴、霍金點微晶提示音與共形調和純音。
 */

export type CCCMode = 'previous_aeon_collision' | 'hawking_points_cmb' | 'conformal_rescaling_metric' | 'aeon_crossover_bridge';

export interface CCCModeConfig {
  id: CCCMode;
  name: string;
  desc: string;
  snrMultiplier: number;
  omegaSensitivity: number;
  baseAudioFreq: number;
}

export const CCC_MODES: Record<CCCMode, CCCModeConfig> = {
  previous_aeon_collision: {
    id: 'previous_aeon_collision',
    name: '前紀元超大黑洞碰撞 (SMBH Collision Rings)',
    desc: '觀測前一宇宙紀元星系團中心超巨黑洞併合釋放之極限相干引力波遺留環',
    snrMultiplier: 1.25,
    omegaSensitivity: 1.0,
    baseAudioFreq: 110.0, // A2
  },
  hawking_points_cmb: {
    id: 'hawking_points_cmb',
    name: 'CMB 霍金點同心環陣列 (Hawking Points Array)',
    desc: '在普朗克衛星與 BICEP 微波背景偏振天圖中定位黑洞蒸發熱聚焦特徵點',
    snrMultiplier: 1.6,
    omegaSensitivity: 1.35,
    baseAudioFreq: 146.83, // D3
  },
  conformal_rescaling_metric: {
    id: 'conformal_rescaling_metric',
    name: '共形因子度規重整化 (Conformal Rescaling Metric)',
    desc: '調諧平滑度規比例因子 Ω，於無質量光子流體中抹平暴脹與冷卻的奇點幾何',
    snrMultiplier: 2.0,
    omegaSensitivity: 1.8,
    baseAudioFreq: 174.61, // F3
  },
  aeon_crossover_bridge: {
    id: 'aeon_crossover_bridge',
    name: '跨紀元因果交界面視界 (Aeon Crossover Horizon)',
    desc: '穿越過去宇宙紀元的未來類光無窮遠 (I+) 與當前宇宙紀元的過去類光無窮遠 (I-)',
    snrMultiplier: 2.5,
    omegaSensitivity: 2.2,
    baseAudioFreq: 220.0, // A3
  },
};

const STORAGE_KEY = 'newworld_penrose_ccc_state_v1';

export class PenroseCCCDetectorEngine {
  private static instance: PenroseCCCDetectorEngine | null = null;

  public currentMode: CCCMode = 'previous_aeon_collision';
  public aeonIndex: number = 4; // 當前為第 4 宇宙紀元 (Aeon IV)
  public conformalFactorOmega: number = 1.28; // 共形比例因子 Ω
  public hawkingPointsLogged: number = 24; // 累積捕獲霍金點數量
  public cccGravitonSNR: number = 6.42; // 信噪比
  public horizonIntegrity: number = 91.5; // 0 ~ 100% (跨紀元交界面相干度)
  public isScanning: boolean = false;

  // Web Audio Context
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): PenroseCCCDetectorEngine {
    if (!PenroseCCCDetectorEngine.instance) {
      PenroseCCCDetectorEngine.instance = new PenroseCCCDetectorEngine();
    }
    return PenroseCCCDetectorEngine.instance;
  }

  /**
   * 當前共形幾何平滑曲率指標
   */
  public get metricCurvatureSmoothness(): number {
    return parseFloat(((this.horizonIntegrity / 100) * this.conformalFactorOmega).toFixed(3));
  }

  /**
   * 執行一次跨宇宙紀元霍金點同溫環掃描
   */
  public scanHawkingPoints(): number {
    this.isScanning = true;
    const modeCfg = CCC_MODES[this.currentMode];
    this.playHawkingPointChime();

    const pointsGained = Math.floor(1 + Math.random() * 3 * modeCfg.snrMultiplier);
    this.hawkingPointsLogged += pointsGained;
    this.cccGravitonSNR = parseFloat((4.5 + Math.random() * 4.0 * modeCfg.snrMultiplier).toFixed(2));
    this.horizonIntegrity = Math.min(100.0, this.horizonIntegrity + 2.0);

    this.saveState();
    this.isScanning = false;
    return pointsGained;
  }

  /**
   * 調諧共形度規因子 Ω
   */
  public setConformalOmega(omega: number): void {
    this.conformalFactorOmega = Math.max(0.1, Math.min(5.0, omega));
    this.playConformalShiftTone();
    this.saveState();
  }

  /**
   * 切換跨紀元觀測模式
   */
  public setMode(mode: CCCMode): void {
    this.currentMode = mode;
    this.playModeSwitchTone();
    this.saveState();
  }

  /**
   * 邁向下一宇宙紀元循環 (Aeon Leap)
   */
  public advanceAeon(): void {
    this.aeonIndex += 1;
    this.horizonIntegrity = 100.0;
    this.hawkingPointsLogged += 12;
    this.playAeonGravitonDrone();
    this.saveState();
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    // 信噪比微幅隨宇宙微波背景自然波動
    this.cccGravitonSNR = parseFloat((this.cccGravitonSNR + (Math.random() * 0.04 - 0.02) * dt).toFixed(2));
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
   * 播放跨紀元引力波低頻嗡鳴 (Aeon Graviton Drone)
   */
  public playAeonGravitonDrone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55.0, t); // A1
      osc.frequency.exponentialRampToValueAtTime(110.0, t + 0.6);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.75);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放霍金點捕獲微晶提示音
   */
  public playHawkingPointChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      [880.0, 1108.73, 1318.51, 1760.0].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + idx * 0.06);
        gain.gain.setValueAtTime(0.18, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.38);
      });
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放共形相變調頻音
   */
  public playConformalShiftTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, t); // E4
      osc.frequency.exponentialRampToValueAtTime(493.88, t + 0.25); // B4

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 模式切換音
   */
  public playModeSwitchTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const baseF = CCC_MODES[this.currentMode].baseAudioFreq;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseF, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    } catch {
      // 靜默處理
    }
  }

  // ================= 儲存與讀取 =================

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = {
        currentMode: this.currentMode,
        aeonIndex: this.aeonIndex,
        conformalFactorOmega: this.conformalFactorOmega,
        hawkingPointsLogged: this.hawkingPointsLogged,
        cccGravitonSNR: this.cccGravitonSNR,
        horizonIntegrity: this.horizonIntegrity,
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
      if (parsed.currentMode && CCC_MODES[parsed.currentMode as CCCMode]) {
        this.currentMode = parsed.currentMode as CCCMode;
      }
      if (typeof parsed.aeonIndex === 'number') this.aeonIndex = parsed.aeonIndex;
      if (typeof parsed.conformalFactorOmega === 'number') this.conformalFactorOmega = parsed.conformalFactorOmega;
      if (typeof parsed.hawkingPointsLogged === 'number') this.hawkingPointsLogged = parsed.hawkingPointsLogged;
      if (typeof parsed.cccGravitonSNR === 'number') this.cccGravitonSNR = parsed.cccGravitonSNR;
      if (typeof parsed.horizonIntegrity === 'number') this.horizonIntegrity = parsed.horizonIntegrity;
    } catch {
      // 忽略
    }
  }
}

export const penroseCCCDetector = PenroseCCCDetectorEngine.getInstance();
