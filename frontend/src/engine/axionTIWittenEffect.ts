/**
 * 三維拓撲絕緣體軸子電動力學與維騰效應反應堆
 * (3D Topological Insulator Axion Electrodynamics & Witten Effect Reactor)
 *
 * 核心物理理論：
 * 1. 軸子電動力學與拓撲 \theta-項 (Axion Electrodynamics & Topological \theta-Term)：
 *    在 3D 拓撲絕緣體 (TI) 中，電磁作用量包含拓撲項 S_\theta = \frac{\theta e^2}{4\pi^2} \int \mathbf{E}\cdot\mathbf{B} \, d^3x dt。
 *    時間反演不變性 (\mathcal{T}) 嚴格量子化 \theta = \pi \pmod{2\pi}，形成強拓撲絕緣相。
 * 2. 維騰效應與分數二元荷 (Witten Effect & Fractional Dyons)：
 *    當單位狄拉克磁單極子 (g = 2\pi\hbar / e) 穿透或嵌入 3D TI 體積內部時，
 *    拓撲真空角度 \theta 自發誘導非零半整數電荷：
 *    q = e (n - \frac{\theta}{2\pi}) = \pm \frac{e}{2}，使純磁單極子轉變為帶半電荷的「二元荷 (Dyon)」。
 * 3. 拓撲磁電效應 (Topological Magnetoelectric Effect, TME)：
 *    外加電場 \mathbf{E} 在介質內部誘發同向平行磁化 \mathbf{M} = \alpha \frac{\theta}{\pi} \mathbf{E}；
 *    外加磁場 \mathbf{B} 誘發同向電極化 \mathbf{P} = \alpha \frac{\theta}{\pi} \mathbf{B}，其中 \alpha \approx 1/137 為精細結構常數。
 * 4. 表面半整數量子霍爾效應 (Surface Half-Integer Quantum Hall Effect)：
 *    在 3D TI 表面鍍磁性薄膜破缺 \mathcal{T} 打開狄拉克表面能隙時，表面展現未配對半整數量子霍爾電導：
 *    \sigma_{xy} = (n + \frac{1}{2})\frac{e^2}{h}，軸子疇壁交界處湧現單向手性拓撲導電通道。
 */

export type WittenEffectRegime =
  | 'witten-effect-fractional-dyon'            // 維騰效應半整數分數二元荷相 (q = e/2)
  | 'topological-magnetoelectric-polarization' // 拓撲磁電交叉極化相 (TME)
  | 'axion-domain-wall-chiral-edge'            // 軸子疇壁手性無耗散邊界態相
  | 'time-reversal-broken-half-hall';          // 時間反演破缺半整數量子霍爾相

export interface AxionTIWittenState {
  axionAngleThetaRad: number;                  // 軸子角度 \theta (rad, 0.0 ~ 6.28 ≈ 2\pi)
  appliedElectricFieldVPerM: number;           // 外加電場 E (10^4 V/m, 0.1 ~ 30.0)
  appliedMagneticFieldTesla: number;           // 外加磁場 B (T, 0.05 ~ 12.0)
  surfaceMagneticGapDeltaMev: number;          // 表面磁能隙 \Delta_m (meV, 0.0 ~ 25.0)
  regime: WittenEffectRegime;

  // 動態演算物理指標
  inducedMonopoleChargeFractionalE: number;   // 感應單極子電荷 q / e (±0.50)
  magnetoelectricPolarizationPE10: number;     // 拓撲電極化 P (10^-10 C/m^2)
  topologicalMagnetizationM: number;           // 拓撲磁化強度 M (A/m)
  surfaceHallConductanceUnitsE2H: number;      // 表面霍爾電導 \sigma_{xy} (e^2/h)
  fineStructureConstantAlpha: number;          // 精細結構常數 \alpha (約 0.007297)
  telemetryHistory: Array<{
    timestamp: number;
    inducedCharge: number;
    polarizationP: number;
    magnetizationM: number;
  }>;
}

const STORAGE_KEY = 'newworld_axion_ti_witten_effect_state_v1';

class AxionTIWittenEffectEngine {
  private state: AxionTIWittenState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): AxionTIWittenState {
    return {
      axionAngleThetaRad: 3.1416, // \pi
      appliedElectricFieldVPerM: 8.5,
      appliedMagneticFieldTesla: 3.2,
      surfaceMagneticGapDeltaMev: 4.5,
      regime: 'witten-effect-fractional-dyon',
      inducedMonopoleChargeFractionalE: 0.50,
      magnetoelectricPolarizationPE10: 2.28,
      topologicalMagnetizationM: 6.20,
      surfaceHallConductanceUnitsE2H: 0.50,
      fineStructureConstantAlpha: 0.007297,
      telemetryHistory: []
    };
  }

  private loadState(): AxionTIWittenState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
        };
      }
    } catch {
      // 降級使用預設
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 忽略儲存例外
    }
  }

  public getState(): AxionTIWittenState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    const alpha = s.fineStructureConstantAlpha;

    // 1. 維騰效應單極子電荷 q / e = -(theta / 2\pi) mod 1
    const charge = (s.axionAngleThetaRad / (2 * Math.PI));
    s.inducedMonopoleChargeFractionalE = Number(charge.toFixed(3));

    // 2. 拓撲電極化 P = \alpha * (\theta / \pi) * B * const
    // B in Tesla, P in 10^-10 C/m^2
    const pVal = alpha * (s.axionAngleThetaRad / Math.PI) * s.appliedMagneticFieldTesla * 100.0;
    s.magnetoelectricPolarizationPE10 = Number(pVal.toFixed(2));

    // 3. 拓撲磁化強度 M = \alpha * (\theta / \pi) * E * const
    const mVal = alpha * (s.axionAngleThetaRad / Math.PI) * s.appliedElectricFieldVPerM * 10.0;
    s.topologicalMagnetizationM = Number(mVal.toFixed(2));

    // 4. 表面半整數量子霍爾電導 \sigma_{xy} = (\theta / 2\pi) * sgn(Delta_m)
    if (s.surfaceMagneticGapDeltaMev > 0.5) {
      s.surfaceHallConductanceUnitsE2H = Number((s.axionAngleThetaRad / (2 * Math.PI)).toFixed(2));
    } else {
      s.surfaceHallConductanceUnitsE2H = 0.0;
    }

    // 狀態判定
    if (s.surfaceMagneticGapDeltaMev > 10.0) {
      s.regime = 'time-reversal-broken-half-hall';
    } else if (s.appliedElectricFieldVPerM > 15.0 || s.appliedMagneticFieldTesla > 6.0) {
      s.regime = 'topological-magnetoelectric-polarization';
    } else if (Math.abs(s.axionAngleThetaRad - Math.PI) < 0.15 && Math.abs(s.inducedMonopoleChargeFractionalE - 0.5) < 0.05) {
      s.regime = 'witten-effect-fractional-dyon';
    } else {
      s.regime = 'axion-domain-wall-chiral-edge';
    }

    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (deltaSeconds <= 0) return;
    this.recalculatePhysics();

    const now = Date.now();
    const lastTime = this.state.telemetryHistory.length > 0
      ? this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp
      : 0;

    if (now - lastTime >= 1000) {
      this.state.telemetryHistory.push({
        timestamp: now,
        inducedCharge: this.state.inducedMonopoleChargeFractionalE,
        polarizationP: this.state.magnetoelectricPolarizationPE10,
        magnetizationM: this.state.topologicalMagnetizationM
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public setAxionVacuumTheta(thetaRad: number): void {
    this.state.axionAngleThetaRad = Number(Math.max(0.0, Math.min(2 * Math.PI, thetaRad)).toFixed(4));
    this.recalculatePhysics();
    this.playTone(440, 880, 0.18, 'sine');
  }

  public pulseElectricField(deltaE: number = 3.0): void {
    this.state.appliedElectricFieldVPerM = Number(Math.max(0.1, Math.min(30.0, this.state.appliedElectricFieldVPerM + deltaE)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(550, 750, 0.16, 'sawtooth');
  }

  public rampMagneticField(deltaB: number = 1.0): void {
    this.state.appliedMagneticFieldTesla = Number(Math.max(0.05, Math.min(12.0, this.state.appliedMagneticFieldTesla + deltaB)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(320, 640, 0.2, 'triangle');
  }

  public breakTimeReversalGap(gapDeltaMev: number = 5.0): void {
    this.state.surfaceMagneticGapDeltaMev = Number(Math.max(0.0, Math.min(25.0, this.state.surfaceMagneticGapDeltaMev + gapDeltaMev)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(480, 920, 0.24, 'square');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(300, 200, 0.2, 'sine');
  }

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playTone(fStart: number, fEnd: number, duration: number, type: OscillatorType = 'sine'): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(fStart, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 忽略音效異常
    }
  }
}

export const axionTIWittenEngine = new AxionTIWittenEffectEngine();
