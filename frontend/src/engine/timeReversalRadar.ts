/**
 * timeReversalRadar.ts
 * 量子糾纏時間鏡像拓撲雷達引擎 (Quantum Entangled Time-Reversal Radar Engine)
 * 
 * 物理與探測模擬：
 * 1. 時間反演對稱性 (T-Symmetry) 與非線性光學相位共軛鏡 (Phase Conjugate Mirror, PCM)。
 * 2. 糾纏光子對逆時序波前自發收縮反向聚焦 (Self-Focusing Time-Reversal Echo)，穿透超材料吸波塗層與相位隱形。
 * 3. 4 大時間反演掃描模式（相位共軛回波、次泊松量子雷達、封閉類時曲線微擾、逆因果時空反衝）。
 * 4. 探測與解析 4 大極限隱形天體/星艦（幽靈相位巡洋艦、隱匿暗脈衝星、逆時因果漩渦、超材料偵察機）。
 * 5. 純代碼 Web Audio 合成時間倒流逆向包絡聲波 (Reverse Envelope Ping)、共振鎖定音與量子顫音。
 */

export type TimeReversalMode = 'phase_conjugate' | 'entangled_sub_poisson' | 'closed_timelike_loop' | 'retrocausal_matrix';

export interface RadarTarget {
  id: string;
  name: string;
  distanceAU: number;
  bearingDeg: number;
  cloakingPercent: number; // 隱形程度 0 ~ 100%
  uncloaked: boolean;
  type: 'ship' | 'celestial' | 'anomaly';
}

export interface TimeReversalConfig {
  id: TimeReversalMode;
  name: string;
  desc: string;
  penetrationFactor: number;
  echoSpeed: number;
  baseFreq: number;
}

export const TIME_REVERSAL_MODES: Record<TimeReversalMode, TimeReversalConfig> = {
  phase_conjugate: {
    id: 'phase_conjugate',
    name: '非線性光學相位共軛反射 (Phase Conjugation)',
    desc: '利用四波混頻介質反轉散射光子相位，使發散波前在原點反向自聚焦重構',
    penetrationFactor: 1.25,
    echoSpeed: 1.0,
    baseFreq: 330,
  },
  entangled_sub_poisson: {
    id: 'entangled_sub_poisson',
    name: '次泊松糾纏光子計數雷達 (Sub-Poisson Quantum Lidar)',
    desc: '發射非經典糾纏光子態，利用光子數壓縮極限壓制宇宙微波熱噪聲背景',
    penetrationFactor: 1.6,
    echoSpeed: 1.3,
    baseFreq: 440,
  },
  closed_timelike_loop: {
    id: 'closed_timelike_loop',
    name: '封閉類時曲線微擾掃描 (CTC Perturbation Scan)',
    desc: '將微擾探針注入局部格德爾型時空幾何閉環，捕捉穿越事件地平線的逆時回波',
    penetrationFactor: 2.1,
    echoSpeed: 1.7,
    baseFreq: 587.33,
  },
  retrocausal_matrix: {
    id: 'retrocausal_matrix',
    name: '逆因果時空反衝測繪 (Retrocausal Impulse Matrix)',
    desc: '先於訊號反射發生前接收微觀反衝關聯，精確還原被完全吸波塗層抹除的物體輪廓',
    penetrationFactor: 2.8,
    echoSpeed: 2.2,
    baseFreq: 740,
  },
};

const DEFAULT_TARGETS: RadarTarget[] = [
  { id: 'phantom_cruiser', name: '幽靈相位巡洋艦 [隱匿階數 IV]', distanceAU: 0.78, bearingDeg: 42, cloakingPercent: 94, uncloaked: false, type: 'ship' },
  { id: 'dark_pulsar', name: '隱匿暗脈衝星殘骸 [引力透鏡畸變]', distanceAU: 1.65, bearingDeg: 135, cloakingPercent: 88, uncloaked: false, type: 'celestial' },
  { id: 'ctc_eddy', name: '逆時因果微型時空漩渦', distanceAU: 0.45, bearingDeg: 280, cloakingPercent: 98, uncloaked: false, type: 'anomaly' },
  { id: 'metamaterial_drone', name: '超材料吸波匿蹤偵察機群', distanceAU: 0.28, bearingDeg: 330, cloakingPercent: 91, uncloaked: false, type: 'ship' },
];

const STORAGE_KEY = 'newworld_time_reversal_radar_state_v1';

export class TimeReversalRadarEngine {
  private static instance: TimeReversalRadarEngine | null = null;

  public currentMode: TimeReversalMode = 'phase_conjugate';
  public coherenceIntegrity: number = 88.5; // 0 ~ 100%
  public radarGainDb: number = 42.0; // dB
  public sweepPhase: number = 0; // 0 ~ 360
  public isPulsing: boolean = false;
  public pulseProgress: number = 0; // 0 ~ 1
  public accumulatedEchoes: number = 142;
  public targets: RadarTarget[] = [...DEFAULT_TARGETS];

  // Web Audio
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): TimeReversalRadarEngine {
    if (!TimeReversalRadarEngine.instance) {
      TimeReversalRadarEngine.instance = new TimeReversalRadarEngine();
    }
    return TimeReversalRadarEngine.instance;
  }

  /**
   * 觸發一次時間鏡像反向聚焦脈衝
   */
  public triggerPulse(): void {
    if (this.isPulsing) return;
    this.isPulsing = true;
    this.pulseProgress = 0;
    this.playReverseEnvelopePing();

    const modeCfg = TIME_REVERSAL_MODES[this.currentMode];
    const power = (this.coherenceIntegrity / 100) * modeCfg.penetrationFactor;

    // 破除目標隱形偽裝
    this.targets.forEach((target) => {
      if (!target.uncloaked) {
        const penetration = 35 * power;
        target.cloakingPercent = Math.max(0, target.cloakingPercent - penetration);
        if (target.cloakingPercent <= 15) {
          target.uncloaked = true;
          this.accumulatedEchoes += 25;
        }
      }
    });

    this.saveState();
  }

  /**
   * 調諧量子相干性穩定器 (提升保真度)
   */
  public tuneCoherenceStabilizer(): void {
    this.coherenceIntegrity = Math.min(100, this.coherenceIntegrity + 12.0);
    this.playCoherenceTuneTone();
    this.saveState();
  }

  /**
   * 切換時間反演掃描模式
   */
  public setMode(mode: TimeReversalMode): void {
    this.currentMode = mode;
    this.playModeSwitchTone();
    this.saveState();
  }

  /**
   * 重新重置或刷新周圍目標
   */
  public refreshTargets(): void {
    this.targets = DEFAULT_TARGETS.map(t => ({
      ...t,
      bearingDeg: Math.floor(Math.random() * 360),
      distanceAU: parseFloat((0.2 + Math.random() * 1.8).toFixed(2)),
      cloakingPercent: 85 + Math.floor(Math.random() * 15),
      uncloaked: false,
    }));
    this.saveState();
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    this.sweepPhase = (this.sweepPhase + 45 * dt) % 360;

    // 處理脈衝動畫波前進度
    if (this.isPulsing) {
      this.pulseProgress += 0.8 * dt;
      if (this.pulseProgress >= 1.0) {
        this.isPulsing = false;
        this.pulseProgress = 0;
      }
    }

    // 相干度微弱自然退相干
    if (this.coherenceIntegrity > 40) {
      this.coherenceIntegrity = Math.max(40, this.coherenceIntegrity - 0.15 * dt);
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
   * 播放時間倒流逆向包絡聲波 (Reverse Envelope Ping)
   * 聲音自安靜逐漸放大，並於峰值瞬間截斷
   */
  public playReverseEnvelopePing(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const modeCfg = TIME_REVERSAL_MODES[this.currentMode];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // 逆向頻率滑動：自高頻滑向基頻
      osc.frequency.setValueAtTime(modeCfg.baseFreq * 2.2, t);
      osc.frequency.exponentialRampToValueAtTime(modeCfg.baseFreq, t + 0.45);

      // 逆向包絡線：自 0 漸增至 0.35 後驟停
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.45);
      gain.gain.setValueAtTime(0.0001, t + 0.46);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.48);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放相干度調諧和弦
   */
  public playCoherenceTuneTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + idx * 0.05);
        gain.gain.setValueAtTime(0.12, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.32);
      });
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放模式切換音
   */
  public playModeSwitchTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(TIME_REVERSAL_MODES[this.currentMode].baseFreq, t);
      osc.frequency.setValueAtTime(TIME_REVERSAL_MODES[this.currentMode].baseFreq * 1.33, t + 0.1);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
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
        coherenceIntegrity: this.coherenceIntegrity,
        radarGainDb: this.radarGainDb,
        accumulatedEchoes: this.accumulatedEchoes,
        targets: this.targets,
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
      if (parsed.currentMode && TIME_REVERSAL_MODES[parsed.currentMode as TimeReversalMode]) {
        this.currentMode = parsed.currentMode as TimeReversalMode;
      }
      if (typeof parsed.coherenceIntegrity === 'number') this.coherenceIntegrity = parsed.coherenceIntegrity;
      if (typeof parsed.radarGainDb === 'number') this.radarGainDb = parsed.radarGainDb;
      if (typeof parsed.accumulatedEchoes === 'number') this.accumulatedEchoes = parsed.accumulatedEchoes;
      if (Array.isArray(parsed.targets)) this.targets = parsed.targets;
    } catch {
      // 忽略
    }
  }
}

export const timeReversalRadar = TimeReversalRadarEngine.getInstance();
