/**
 * supergravitySpinor.ts
 * 旋量網絡超引力旋轉推進引擎 (Supergravity Spinor Propulsion Engine)
 * 
 * 物理與幾何模擬：
 * 1. N=8 極大局部超引力幾何 (Supergravity \mathcal{N}=8) 與格拉斯曼數 (Grassmann odd numbers) 自旋場。
 * 2. 彭羅斯扭量空間 (Twistor Space) 旋量旋轉與局部引力微子 (Gravitino) 相干態。
 * 3. 消除宏觀慣性質量 (Inertia Suppression -> 100%)，實現無慣性角動量瞬時突變與極限測地線躍遷。
 * 4. 4 大超引力多重態模式（N=8 極大超引力、雜化超弦 E8xE8、彭羅斯扭量曲率相移、格拉斯曼宇稱破缺）。
 * 5. 純代碼 Web Audio 合成扭量滑音、超對稱相位共振雙音與無慣性衝擊波音效。
 */

export type SupergravityMode = 'n8_maximal_sugra' | 'heterotic_e8xe8' | 'twistor_spinor_warp' | 'grassmann_parity_slip';

export interface SugraModeConfig {
  id: SupergravityMode;
  name: string;
  desc: string;
  inertiaSuppressionMultiplier: number;
  spinorBandwidthTHz: number;
  baseAudioFreq: number;
  twistorDim: string;
}

export const SUGRA_MODES: Record<SupergravityMode, SugraModeConfig> = {
  n8_maximal_sugra: {
    id: 'n8_maximal_sugra',
    name: 'N=8 極大超引力多重態 (Maximal N=8 SUGRA)',
    desc: '包含 70 個標量場與 56 個引力微子，在四維緊緻化空間中實現極大超對稱慣性消除',
    inertiaSuppressionMultiplier: 1.0,
    spinorBandwidthTHz: 120.0,
    baseAudioFreq: 196.0, // G3
    twistorDim: 'CP^3 Complex Projective',
  },
  heterotic_e8xe8: {
    id: 'heterotic_e8xe8',
    name: '雜化超弦 E8×E8 旋量場 (Heterotic E8×E8 Spinor)',
    desc: '十維超弦奇異卡拉比-丘六維扭轉，激發具有雙倍例外對稱群的超引力旋量幾何',
    inertiaSuppressionMultiplier: 1.35,
    spinorBandwidthTHz: 180.0,
    baseAudioFreq: 246.94, // B3
    twistorDim: '10D Spinor Bundle',
  },
  twistor_spinor_warp: {
    id: 'twistor_spinor_warp',
    name: '彭羅斯扭量空間相移 (Twistor Curvature Warp)',
    desc: '將閔可夫斯基時空射影映射至複射影扭量空間 CP^3，以共形全純曲線取代傳統加速度',
    inertiaSuppressionMultiplier: 1.7,
    spinorBandwidthTHz: 240.0,
    baseAudioFreq: 293.66, // D4
    twistorDim: 'Holomorphic Twistor',
  },
  grassmann_parity_slip: {
    id: 'grassmann_parity_slip',
    name: '格拉斯曼宇稱破缺滑移 (Grassmann Parity Slip)',
    desc: '反對易格拉斯曼坐標 θ, θ̄ 激發微觀費米子反衝，消除一切角加速度與剪切應力',
    inertiaSuppressionMultiplier: 2.1,
    spinorBandwidthTHz: 320.0,
    baseAudioFreq: 370.0, // F#4
    twistorDim: 'Super-Minkowski Space',
  },
};

const STORAGE_KEY = 'newworld_supergravity_spinor_state_v1';

export class SupergravitySpinorEngine {
  private static instance: SupergravitySpinorEngine | null = null;

  public currentMode: SupergravityMode = 'n8_maximal_sugra';
  public inertiaSuppressionPercent: number = 88.5; // 0 ~ 100% (慣性質量消除度)
  public twistorFlux: number = 420.0; // 扭量通量
  public gravitinoCoherence: number = 94.2; // 0 ~ 100% (引力微子相干度)
  public spinorAngularVelocityDeg: number = 720.0; // 度/秒
  public totalSpinorJumps: number = 0;
  public isJumping: boolean = false;
  public jumpProgress: number = 0; // 0 ~ 1

  // Web Audio Context
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): SupergravitySpinorEngine {
    if (!SupergravitySpinorEngine.instance) {
      SupergravitySpinorEngine.instance = new SupergravitySpinorEngine();
    }
    return SupergravitySpinorEngine.instance;
  }

  /**
   * 當前有效等效質量係數 (Effective Inertial Mass)
   * 當慣性抑制達到 100% 時，有效質量降至接近 0
   */
  public get effectiveInertialMassRatio(): number {
    const raw = 1.0 - (this.inertiaSuppressionPercent / 100);
    return Math.max(0.0001, parseFloat(raw.toFixed(4)));
  }

  /**
   * 觸發無慣性超引力幾何躍遷 (Zero-Inertia Spinor Jump)
   */
  public triggerSpinorJump(): boolean {
    if (this.gravitinoCoherence < 20.0) {
      return false;
    }

    const modeCfg = SUGRA_MODES[this.currentMode];
    this.isJumping = true;
    this.jumpProgress = 0;
    this.gravitinoCoherence = Math.max(10.0, this.gravitinoCoherence - 3.5);
    this.twistorFlux += 45.0 * modeCfg.inertiaSuppressionMultiplier;
    this.totalSpinorJumps++;

    this.playSpinorJumpSound();
    this.saveState();
    return true;
  }

  /**
   * 調諧引力微子相干振盪器 (提升相干度)
   */
  public tuneGravitinoCoherence(): void {
    this.gravitinoCoherence = Math.min(100.0, this.gravitinoCoherence + 15.0);
    this.playHarmonicChime();
    this.saveState();
  }

  /**
   * 微調慣性質量消除比率
   */
  public setInertiaSuppression(percent: number): void {
    this.inertiaSuppressionPercent = Math.max(0, Math.min(100, percent));
    this.saveState();
  }

  /**
   * 切換超引力多重態模式
   */
  public setMode(mode: SupergravityMode): void {
    this.currentMode = mode;
    this.playModeSwitchTone();
    this.saveState();
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    // 旋量角動量連續旋轉
    const modeCfg = SUGRA_MODES[this.currentMode];
    this.spinorAngularVelocityDeg = (this.spinorAngularVelocityDeg + 120 * modeCfg.inertiaSuppressionMultiplier * dt) % 3600;

    // 處理跳躍進度
    if (this.isJumping) {
      this.jumpProgress += 1.2 * dt;
      if (this.jumpProgress >= 1.0) {
        this.isJumping = false;
        this.jumpProgress = 0;
      }
    }

    // 扭量通量自然微量聚集
    this.twistorFlux += 0.2 * dt * (this.gravitinoCoherence / 100);
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
   * 播放超引力幾何無慣性跳躍音效 (Zero-Inertia Spinor Jump)
   */
  public playSpinorJumpSound(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const modeCfg = SUGRA_MODES[this.currentMode];

      // 1. 扭量頻率指數滑升
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(modeCfg.baseAudioFreq, t);
      osc.frequency.exponentialRampToValueAtTime(modeCfg.baseAudioFreq * 3.5, t + 0.4);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.48);

      // 2. 超引力相消衝擊波 (Anti-inertia blast)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(90, t);
      subOsc.frequency.exponentialRampToValueAtTime(25, t + 0.5);

      subGain.gain.setValueAtTime(0.35, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(t);
      subOsc.stop(t + 0.55);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放引力微子相干調諧純音
   */
  public playHarmonicChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      [587.33, 739.99, 880.0, 1174.66].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + idx * 0.05);
        gain.gain.setValueAtTime(0.12, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.38);
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
      const f = SUGRA_MODES[this.currentMode].baseAudioFreq;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.setValueAtTime(f * 1.5, t + 0.12);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
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
        inertiaSuppressionPercent: this.inertiaSuppressionPercent,
        twistorFlux: this.twistorFlux,
        gravitinoCoherence: this.gravitinoCoherence,
        totalSpinorJumps: this.totalSpinorJumps,
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
      if (parsed.currentMode && SUGRA_MODES[parsed.currentMode as SupergravityMode]) {
        this.currentMode = parsed.currentMode as SupergravityMode;
      }
      if (typeof parsed.inertiaSuppressionPercent === 'number') this.inertiaSuppressionPercent = parsed.inertiaSuppressionPercent;
      if (typeof parsed.twistorFlux === 'number') this.twistorFlux = parsed.twistorFlux;
      if (typeof parsed.gravitinoCoherence === 'number') this.gravitinoCoherence = parsed.gravitinoCoherence;
      if (typeof parsed.totalSpinorJumps === 'number') this.totalSpinorJumps = parsed.totalSpinorJumps;
    } catch {
      // 忽略
    }
  }
}

export const supergravitySpinor = SupergravitySpinorEngine.getInstance();
