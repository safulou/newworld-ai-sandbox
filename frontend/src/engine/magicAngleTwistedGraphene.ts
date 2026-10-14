/**
 * ⚛️ 魔角扭轉雙層石墨烯平帶與非常規關聯超導引擎
 * Magic-Angle Twisted Bilayer Graphene (MATBG) & Correlated Flat-Band Superconductivity Engine
 *
 * 理論物理基礎：
 * 1. Bistritzer-MacDonald 連續介質模型與魔角條件 (Bistritzer-MacDonald BM Model)：
 *    當兩層石墨烯以微小夾角 $\theta$ 相對扭轉時，莫爾超晶格週期擴展為：
 *    L_M = \frac{a_0}{2 \sin(\theta/2)} \approx 13.4\ \text{nm} \quad (a_0 = 0.246\ \text{nm})
 *    在第一「魔角」$\theta_{\text{magic}} \approx 1.08^\circ$ 處，層間隧穿抵消狄拉克費米速度 ($v_F^* \to 0$)，
 *    在費米能級附近壓縮出帶寬僅 $W \sim 5 - 10\ \text{meV}$ 的極限平帶 (Flat Band)。
 * 2. 強關聯莫特絕緣體 (Correlated Mott Insulator)：
 *    莫爾單胞庫侖排斥能 $U \approx \frac{e^2}{4\pi\epsilon L_M} \sim 25\ \text{meV} \gg W$，
 *    在半填充整數摩爾載流子數 ($\nu = \pm 2$) 處打開關聯莫特能隙 $\Delta_{\text{Mott}} \sim 2-4\ \text{meV}$。
 * 3. 非常規超導穹頂 (Unconventional Superconducting Dome)：
 *    靜電柵壓微量摻雜偏離 $\nu = -2$ ($\delta \sim \pm 0.2$) 時，莫特絕緣態失穩崩潰，
 *    湧現非常規超導拱頂 ($T_c \approx 1.7\ \text{K}$)，超導-費米能比值 $T_c / T_F \sim 0.1$ 媲美銅氧化物高溫超導！
 */

export type MatbgRegime =
  | 'dispersive-dirac-semimetal'            // 大角度色散狄拉克半金屬態 (θ > 1.3°, W >> U)
  | 'quenched-magic-flat-band'              // 魔角淬火極限超窄平帶態 (θ ≈ 1.08°, W ~ 7 meV)
  | 'correlated-mott-insulator'             // 半填充整數關聯莫特絕緣相 (ν = ±2, 打开能隙)
  | 'unconventional-superconducting-dome';  // 微量摻雜非常規超導穹頂相 (Tc ≈ 1.7 K, 零電阻)

export interface MatbgState {
  twistAngleDeg: number;                    // 扭轉夾角 \theta (度, 0.85° ~ 1.45°, 魔角 1.08°)
  moireFillingFactorNu: number;             // 莫爾單胞填充分數 \nu (-4.0 ~ +4.0)
  perpendicularDisplacementVNm: number;     // 垂直層間電位移場 D (V/nm, 0.0 ~ 0.8)
  temperatureKelvin: number;                // 系統溫度 T (0.1 ~ 20.0 K)
  regime: MatbgRegime;

  // 動態演算物理指標
  flatBandWidthMev: number;                 // 活性平帶帶寬 W (meV)
  coulombInteractionUMev: number;           // 莫爾單胞有效庫侖排斥能 U (meV)
  superconductingTcKelvin: number;          // 臨界超導轉變溫度 T_c (K)
  mottInsulatingGapMev: number;             // 關聯莫特能隙 \Delta_Mott (meV)
  moireSuperlatticePeriodNm: number;        // 莫爾超晶格週期 L_M (nm)
  superconductingPhaseEventsCount: number;  // 累計超導相變激發次數
  telemetryHistory: Array<{
    timestamp: number;
    angle: number;
    bandwidth: number;
    tc: number;
  }>;
}

const STORAGE_KEY = 'newworld_magic_angle_twisted_graphene_state_v1';
const GRAPHENE_A0_NM = 0.246; // 石墨烯晶格常數 0.246 nm
const MAGIC_ANGLE_DEG = 1.08; // 第一魔角 1.08°

class MagicAngleTwistedGrapheneEngine {
  private state: MatbgState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): MatbgState {
    return {
      twistAngleDeg: 1.08,                  // 精確第一魔角 1.08°
      moireFillingFactorNu: -2.2,           // ν ≈ -2.2 (超導拱頂中心)
      perpendicularDisplacementVNm: 0.15,
      temperatureKelvin: 1.2,               // 1.2 K (< Tc)
      regime: 'unconventional-superconducting-dome',
      flatBandWidthMev: 8.0,                // 8.0 meV (超窄平帶)
      coulombInteractionUMev: 26.5,         // 26.5 meV (U / W ≈ 3.9 >> 1)
      superconductingTcKelvin: 1.72,        // Tc ≈ 1.72 K
      mottInsulatingGapMev: 3.2,
      moireSuperlatticePeriodNm: 13.05,     // L_M ≈ 13.05 nm
      superconductingPhaseEventsCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): MatbgState {
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
      console.warn('[MagicAngleGrapheneEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[MagicAngleGrapheneEngine] 儲存失敗', e);
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
   * 播放超導拱頂零電阻諧振音 (Superconducting Dome Zero-Resistance Chime)
   */
  public playSuperconductingChime(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3); // C6

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    } catch (e) {
      console.warn('[MagicAngleGrapheneEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放莫爾晶格干涉調諧音 (Moiré Lattice Tuning Sweep)
   */
  public playMoireTuningSweep(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('[MagicAngleGrapheneEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算莫爾超晶格常數、平帶帶寬、庫侖能與超導 Tc
   */
  public recalculatePhysics(): void {
    const theta = Math.max(0.7, Math.min(1.6, this.state.twistAngleDeg));
    const nu = this.state.moireFillingFactorNu;
    const T = Math.max(0.05, this.state.temperatureKelvin);
    const D = Math.max(0.0, this.state.perpendicularDisplacementVNm);

    // 1. 莫爾超晶格週期 L_M = a_0 / [2 sin(\theta / 2)] (nm)
    const thetaRad = (theta * Math.PI) / 180.0;
    const lMoire = GRAPHENE_A0_NM / (2.0 * Math.sin(thetaRad / 2.0));
    this.state.moireSuperlatticePeriodNm = Number(lMoire.toFixed(2));

    // 2. 活性平帶帶寬 W \approx W_0 + 850 * (\theta - \theta_magic)^2 (meV)
    const deltaTheta = theta - MAGIC_ANGLE_DEG;
    const bandwidth = Math.min(85.0, 6.2 + 820.0 * Math.pow(deltaTheta, 2) + 12.0 * D);
    this.state.flatBandWidthMev = Number(bandwidth.toFixed(1));

    // 3. 有效庫侖排斥能 U \approx e^2 / (4\pi\epsilon L_M) \sim 350 / L_M (meV)
    const uCoulomb = 345.0 / lMoire;
    this.state.coulombInteractionUMev = Number(uCoulomb.toFixed(1));

    // 4. 關聯莫特能隙 \Delta_Mott (在 \nu = \pm 2 附近出現)
    const distToNu2 = Math.min(Math.abs(nu - 2.0), Math.abs(nu + 2.0));
    const mottGap = (bandwidth < 15.0 && distToNu2 < 0.25) ? Math.max(0, 3.8 - distToNu2 * 12.0) : 0.0;
    this.state.mottInsulatingGapMev = Number(mottGap.toFixed(1));

    // 5. 非常規超導臨界溫度 T_c (K)
    // 出現在 \nu = -2 附近微量摻雜處 (\nu \in [-2.4, -1.8] 或 [+1.8, +2.4]) 且 W < 14 meV
    let tc = 0.0;
    if (bandwidth < 15.0) {
      if ((nu >= -2.45 && nu <= -1.75) || (nu >= 1.75 && nu <= 2.45)) {
        const optimalNu = nu < 0 ? -2.15 : 2.15;
        const distToOpt = Math.abs(nu - optimalNu);
        tc = Math.max(0, (1.85 - distToOpt * 4.5) * Math.max(0, 1.0 - Math.pow(deltaTheta / 0.15, 2)));
      }
    }
    this.state.superconductingTcKelvin = Number(tc.toFixed(2));

    // 6. 相態邏輯判定
    if (bandwidth > 25.0 || Math.abs(deltaTheta) > 0.25) {
      this.state.regime = 'dispersive-dirac-semimetal';
    } else if (tc > 0.1 && T < tc) {
      this.state.regime = 'unconventional-superconducting-dome';
    } else if (mottGap > 0.5) {
      this.state.regime = 'correlated-mott-insulator';
    } else {
      this.state.regime = 'quenched-magic-flat-band';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime === 'unconventional-superconducting-dome') {
      this.state.superconductingPhaseEventsCount += Math.floor(deltaSeconds * 2);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        angle: this.state.twistAngleDeg,
        bandwidth: this.state.flatBandWidthMev,
        tc: this.state.superconductingTcKelvin
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setTwistAngle(deg: number): void {
    this.state.twistAngleDeg = Math.max(0.85, Math.min(1.45, deg));
    this.recalculatePhysics();
    this.saveState();
  }

  public setFillingFactor(nu: number): void {
    this.state.moireFillingFactorNu = Math.max(-4.0, Math.min(4.0, nu));
    this.recalculatePhysics();
    this.saveState();
  }

  public setTemperature(tKelvin: number): void {
    this.state.temperatureKelvin = Math.max(0.05, Math.min(20.0, tKelvin));
    this.recalculatePhysics();
    this.saveState();
  }

  public setDisplacementField(dField: number): void {
    this.state.perpendicularDisplacementVNm = Math.max(0.0, Math.min(0.8, dField));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發魔角超導相變 (Trigger Superconducting Dome Phase)
   */
  public triggerSuperconductivity(): void {
    this.state.twistAngleDeg = 1.08;
    this.state.moireFillingFactorNu = -2.15;
    this.state.temperatureKelvin = 0.5;
    this.state.superconductingPhaseEventsCount += 10;
    this.state.regime = 'unconventional-superconducting-dome';
    this.recalculatePhysics();
    this.playSuperconductingChime();
    this.playMoireTuningSweep();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: MatbgRegime[] = [
      'dispersive-dirac-semimetal',
      'quenched-magic-flat-band',
      'correlated-mott-insulator',
      'unconventional-superconducting-dome'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'dispersive-dirac-semimetal') {
      this.state.twistAngleDeg = 1.35;
      this.state.moireFillingFactorNu = 0.0;
    } else if (this.state.regime === 'quenched-magic-flat-band') {
      this.state.twistAngleDeg = 1.08;
      this.state.moireFillingFactorNu = 0.0;
      this.playMoireTuningSweep();
    } else if (this.state.regime === 'correlated-mott-insulator') {
      this.state.twistAngleDeg = 1.08;
      this.state.moireFillingFactorNu = -2.0;
    } else {
      this.triggerSuperconductivity();
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

  public getState(): Readonly<MatbgState> {
    return this.state;
  }
}

export const magicAngleGrapheneEngine = new MagicAngleTwistedGrapheneEngine();
