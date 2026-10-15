/**
 * 拓撲馬約拉納零模約瑟夫森二極體引擎 (Topological Majorana Josephson Diode Engine)
 * 
 * 物理原理：
 * 1. 在具備自旋軌道耦合 (SOC) 的半導體-拓撲超導結 (SNS / S-NW-S) 中，外加面內磁場 B_x 同時打破時間反演對稱性 (T)
 *    與空間反演對稱性 (P)，在約瑟夫森電流-相位關係 (CPR) 中引入反常相移 φ₀：
 *    I(φ) = I₁ sin(φ - φ₀) + I₂ sin(2(φ - φ₀))
 * 2. 由於高階諧波項與反常相移的存在，正向超導臨界電流 I_c+ 與反向臨界電流 |I_c-| 產生不對稱 (I_c+ ≠ |I_c-|)，
 *    形成無耗散超導約瑟夫森二極體效應 (JDE)，整流效率定義為 η = (I_c+ - |I_c-|) / (I_c+ + |I_c-|) × 100%。
 * 3. 當磁場超過拓撲相變閾值 B > B_c 時，結區兩端湧現未配對的馬約拉納零能模 (MZMs)，
 *    介導電子單粒子穿隧，激發 4π-週期分數約瑟夫森效應 I_M sin((φ - φ₀)/2)，展現宇稱保護的二極體極性可調性。
 */

export type JosephsonDiodeRegime = 
  | 'conventional-symmetric'
  | 'phi0-nonreciprocal'
  | 'giant-diode'
  | 'majorana-4pi-tunneling';

export interface JosephsonDiodeState {
  inPlaneMagneticFieldTesla: number; // 面內磁場 B_x (0.0 ~ 2.5 T)
  spinOrbitCouplingAlpha: number;    // 自旋軌道耦合強度 α (meV·nm, 10 ~ 80)
  anomalousPhaseShiftPhi0Rad: number;// 反常相移 φ₀ (rad, 0 ~ π)
  forwardCriticalCurrentIcPlus: number;  // 正向臨界電流 I_c+ (μA)
  reverseCriticalCurrentIcMinus: number; // 反向臨界電流 |I_c-| (μA)
  diodeEfficiencyEtaPercent: number;     // 二極體整流效率 η (%)
  majoranaTunnelingAmplitude: number;    // 馬約拉納單粒子穿隧振幅 I_M (μA)
  isTopologicalMajoranaActive: boolean;  // 是否處於馬約拉納拓撲相 (B > B_c)
  currentPhase: number;                  // 當前超導相位 φ (0 ~ 4π)
  activeRegime: JosephsonDiodeRegime;
  pulsePhase: number;
  cprCurve: Array<{ phi: number; current: number }>; // 電流-相位關係 CPR 取樣
}

const STORAGE_KEY = 'newworld_majorana_josephson_diode_state_v1';

export class MajoranaJosephsonDiodeEngine {
  private state: JosephsonDiodeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): JosephsonDiodeState {
    const defaults: JosephsonDiodeState = {
      inPlaneMagneticFieldTesla: 1.2,
      spinOrbitCouplingAlpha: 45.0,
      anomalousPhaseShiftPhi0Rad: 0.785, // π/4
      forwardCriticalCurrentIcPlus: 4.82,
      reverseCriticalCurrentIcMinus: 2.94,
      diodeEfficiencyEtaPercent: 24.2,
      majoranaTunnelingAmplitude: 1.65,
      isTopologicalMajoranaActive: true,
      currentPhase: 0,
      activeRegime: 'giant-diode',
      pulsePhase: 0,
      cprCurve: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Majorana Josephson Diode state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Majorana Josephson Diode state to localStorage:', e);
      }
    }
  }

  public getState(): JosephsonDiodeState {
    return { ...this.state };
  }

  public setMagneticField(b: number): void {
    this.state.inPlaneMagneticFieldTesla = Math.max(0.0, Math.min(2.5, b));
    this.recomputePhysics();
    this.saveState();
  }

  public setSpinOrbitAlpha(alpha: number): void {
    this.state.spinOrbitCouplingAlpha = Math.max(10.0, Math.min(80.0, alpha));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: JosephsonDiodeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'conventional-symmetric':
        this.state.inPlaneMagneticFieldTesla = 0.0;
        this.state.spinOrbitCouplingAlpha = 20.0;
        break;
      case 'phi0-nonreciprocal':
        this.state.inPlaneMagneticFieldTesla = 0.6;
        this.state.spinOrbitCouplingAlpha = 35.0;
        break;
      case 'giant-diode':
        this.state.inPlaneMagneticFieldTesla = 1.6;
        this.state.spinOrbitCouplingAlpha = 70.0;
        break;
      case 'majorana-4pi-tunneling':
        this.state.inPlaneMagneticFieldTesla = 2.0;
        this.state.spinOrbitCouplingAlpha = 50.0;
        break;
    }
    this.recomputePhysics();
    this.playRegimeTransitionTone(regime);
    this.saveState();
  }

  public triggerDiodeBreakdownPulse(): void {
    this.state.pulsePhase = 1.0;
    this.playBreakdownTone();
  }

  private recomputePhysics(): void {
    const { inPlaneMagneticFieldTesla: B, spinOrbitCouplingAlpha: alpha, activeRegime } = this.state;

    // 拓撲超導臨界磁場 B_c 約 0.8 T
    const B_c = 0.8;
    this.state.isTopologicalMajoranaActive = B >= B_c;

    // 反常相移 φ₀ = c · α · B
    let phi0 = 0;
    if (activeRegime === 'phi0-nonreciprocal') {
      phi0 = (alpha / 50.0) * (B / 1.5) * 0.8;
    } else if (activeRegime === 'giant-diode') {
      phi0 = Math.PI / 2.0; // π/2 最佳時間反演破缺相移，極大化超導二極體整流率
    } else if (activeRegime === 'majorana-4pi-tunneling') {
      phi0 = (alpha / 50.0) * (B / 1.5) * 1.2;
    }
    this.state.anomalousPhaseShiftPhi0Rad = phi0;

    // 基底電流項
    const I1 = 3.5;
    const I2 = activeRegime === 'conventional-symmetric' 
      ? 0.0 
      : (alpha / 50.0) * (B / 1.5) * 1.5; // 高階二倍頻諧波
    const IM = this.state.isTopologicalMajoranaActive ? 1.5 * (B / 2.0) : 0.0; // 馬約拉納 4π 分數穿隧項
    this.state.majoranaTunnelingAmplitude = IM;

    // 計算 CPR 曲線取樣與 I_c+, |I_c-|
    const samples = 100;
    const cpr: Array<{ phi: number; current: number }> = [];
    let maxI = -Infinity;
    let minI = Infinity;

    for (let i = 0; i <= samples; i++) {
      const phi = (i / samples) * 4 * Math.PI; // 0 ~ 4π
      let current = I1 * Math.sin(phi) + I2 * Math.sin(2 * phi - phi0);
      if (this.state.isTopologicalMajoranaActive) {
        current += IM * Math.sin((phi - phi0) / 2.0);
      }
      cpr.push({ phi, current });
      if (current > maxI) maxI = current;
      if (current < minI) minI = current;
    }

    this.state.cprCurve = cpr;
    this.state.forwardCriticalCurrentIcPlus = Math.max(0.1, maxI);
    this.state.reverseCriticalCurrentIcMinus = Math.max(0.1, Math.abs(minI));

    // 二極體效率 η
    const total = this.state.forwardCriticalCurrentIcPlus + this.state.reverseCriticalCurrentIcMinus;
    const diff = this.state.forwardCriticalCurrentIcPlus - this.state.reverseCriticalCurrentIcMinus;
    this.state.diodeEfficiencyEtaPercent = Math.max(0, Math.min(80, (diff / total) * 100));
  }

  public update(dt: number): void {
    // 相位隨時間連續演化 (約瑟夫森交流效應)
    this.state.currentPhase = (this.state.currentPhase + dt * 2.5) % (4 * Math.PI);

    if (this.state.pulsePhase > 0) {
      this.state.pulsePhase = Math.max(0, this.state.pulsePhase - dt * 1.5);
    }
  }

  // 純代碼 Web Audio 程序化合成音效
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private playRegimeTransitionTone(regime: JosephsonDiodeRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const tones: Record<JosephsonDiodeRegime, number[]> = {
        'conventional-symmetric': [300, 450],
        'phi0-nonreciprocal': [350, 525],
        'giant-diode': [280, 560, 700],
        'majorana-4pi-tunneling': [140, 280, 560] // 4π 次諧波低八度
      };

      const selected = tones[regime] || [400];
      selected.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
      });
    } catch (e) {
      console.warn('Diode audio error:', e);
    }
  }

  private playBreakdownTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      // 模擬非互易正向超導穿隧擊穿突波 (220 -> 880 Hz)
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Breakdown tone error:', e);
    }
  }
}

export const majoranaJosephsonDiodeEngine = new MajoranaJosephsonDiodeEngine();
