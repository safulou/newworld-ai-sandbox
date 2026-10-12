/**
 * 手性超材料動態拓撲卡西米爾斥力發電機 (Chiral Metamaterial Topological Repulsive Casimir Generator)
 *
 * 核心物理理論：
 * 1. 拓撲斥力卡西米爾-里夫席茲效應 (Topological Repulsive Casimir-Lifshitz Effect)：
 *    在常規真空中兩平行導體板間的卡西米爾力永遠為吸引力 (F < 0)，導致微機電奈米元件嚴重「靜黏滯」(Stiction) 損壞；
 *    透過導入具備交叉偏振反射係數 (Cross-polarization reflection r_sp) 的手性超材料或 3D 拓撲絕緣體 \theta-電動力學，
 *    當滿足 r_ss r_pp < |r_sp|^2 時，里夫席茲自由能積分符號反轉，激發完全無接觸的量子真空斥力：
 *    F_{\text{Casimir}}(d) = \frac{\hbar c}{d^4} \mathcal{F}_{\text{chiral}}(\theta_1, \theta_2) > 0。
 * 2. 量子真空懸浮穩定平衡 (Quantum Vacuum Levitation Equilibrium)：
 *    斥力卡西米爾力隨距離 d^{-4} 遞減，與外加引力/預載力平衡於穩定間距 d_{\text{eq}}，實現零摩擦量子磁浮。
 * 3. 幾何各向異性量子扭矩馬達 (Quantum Vacuum Torque Motor)：
 *    雙板光學各向異性主軸夾角 \phi 產生量子真空旋轉力矩：
 *    \tau(\phi) = -\frac{\partial E_c}{\partial \phi} \propto \frac{\hbar c}{d^3} \sin(2\phi)，驅動奈米轉子高速運轉。
 */

export type CasimirMotorRegime =
  | 'quantum-repulsive-levitation' // 量子真空斥力懸浮態
  | 'topological-torque-motor'     // 拓撲卡西米爾真空扭矩馬達相
  | 'zero-stiction-nanogap'         // 零黏滯超滑奈米間隙態
  | 'lifshitz-crossover-balance';   // 斥力-引力零平衡交叉相

export interface RepulsiveCasimirState {
  cavitySeparationNm: number;       // 腔體間距 d (nm, 10 ~ 250)
  topologicalThetaAngleRad: number; // 拓撲磁電角 \theta (rad, 0.0 ~ 3.1415)
  chiralPolarizationDegree: number; // 手性超材料極化度 \kappa (0.0 ~ 1.0)
  rotorAngularOffsetDeg: number;    // 轉子光軸偏轉角 \phi (0 ~ 180 度)
  regime: CasimirMotorRegime;
  // 動態演算物理指標
  casimirForcePn: number;           // 卡西米爾力 F_C (pN, 正值為斥力)
  isRepulsive: boolean;             // 是否處於斥力狀態
  levitationEquilibriumNm: number;  // 穩定浮置平衡間隙 d_eq (nm)
  quantumTorquePnNm: number;        // 量子真空扭矩 \tau (pN·nm)
  rotorRpm: number;                 // 奈米轉子轉速 (RPM)
  lifshitzKernelSign: number;       // Lifshitz 自由能積分核係數
  telemetryHistory: Array<{
    timestamp: number;
    forcePn: number;
    torquePnNm: number;
    rotorRpm: number;
  }>;
}

const STORAGE_KEY = 'newworld_repulsive_casimir_state_v1';

class RepulsiveCasimirMotorEngine {
  private state: RepulsiveCasimirState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): RepulsiveCasimirState {
    return {
      cavitySeparationNm: 45.0,
      topologicalThetaAngleRad: 2.85,
      chiralPolarizationDegree: 0.82,
      rotorAngularOffsetDeg: 45.0,
      regime: 'quantum-repulsive-levitation',
      casimirForcePn: 12.4,
      isRepulsive: true,
      levitationEquilibriumNm: 42.5,
      quantumTorquePnNm: 8.6,
      rotorRpm: 12400.0,
      lifshitzKernelSign: 1.0,
      telemetryHistory: []
    };
  }

  private loadState(): RepulsiveCasimirState {
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
      // 降級取預設值
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 略過儲存異常
    }
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.saveState();
  }

  public getState(): Readonly<RepulsiveCasimirState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<RepulsiveCasimirState,
    'cavitySeparationNm' | 'topologicalThetaAngleRad' | 'chiralPolarizationDegree' | 'rotorAngularOffsetDeg' | 'regime'
  >>): void {
    if (params.cavitySeparationNm !== undefined) {
      this.state.cavitySeparationNm = Math.max(10.0, Math.min(250.0, params.cavitySeparationNm));
    }
    if (params.topologicalThetaAngleRad !== undefined) {
      this.state.topologicalThetaAngleRad = Math.max(0.0, Math.min(3.14159, params.topologicalThetaAngleRad));
    }
    if (params.chiralPolarizationDegree !== undefined) {
      this.state.chiralPolarizationDegree = Math.max(0.0, Math.min(1.0, params.chiralPolarizationDegree));
    }
    if (params.rotorAngularOffsetDeg !== undefined) {
      this.state.rotorAngularOffsetDeg = Math.max(0.0, Math.min(180.0, params.rotorAngularOffsetDeg));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public pulseTorqueBoost(): void {
    this.playMotorSound(480, 0.35, 'square');
    this.state.rotorRpm += 3500.0;
    this.recomputePhysics();
    this.saveState();
  }

  public tuneToEquilibriumGap(): void {
    this.playMotorSound(660, 0.45, 'sine');
    this.state.cavitySeparationNm = this.state.levitationEquilibriumNm;
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 轉速隨摩擦與量子阻尼維持平衡
    const targetRpm = Math.max(0, this.state.quantumTorquePnNm * 1450.0);
    const decay = Math.exp(-delta * 0.3);
    this.state.rotorRpm = targetRpm + (this.state.rotorRpm - targetRpm) * decay;

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        forcePn: Number(this.state.casimirForcePn.toFixed(2)),
        torquePnNm: Number(this.state.quantumTorquePnNm.toFixed(2)),
        rotorRpm: Number(this.state.rotorRpm.toFixed(0))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const d = this.state.cavitySeparationNm;
    const theta = this.state.topologicalThetaAngleRad;
    const kappa = this.state.chiralPolarizationDegree;
    const phiRad = (this.state.rotorAngularOffsetDeg * Math.PI) / 180;

    // 拓撲極化反轉判據：當 \theta > \pi/2 且 \kappa > 0.4 時反轉為斥力
    const chiralThreshold = (theta / Math.PI) * kappa;
    const isRep = chiralThreshold > 0.35 || this.state.regime === 'quantum-repulsive-levitation' || this.state.regime === 'zero-stiction-nanogap';
    this.state.isRepulsive = isRep;

    // 斥力規模 F \propto \pm \frac{\hbar c}{d^4}
    const sign = isRep ? 1.0 : -1.0;
    this.state.lifshitzKernelSign = sign;
    const rawForce = sign * (1.8e6 / Math.pow(d, 3.2)) * (0.5 + 0.5 * kappa);
    this.state.casimirForcePn = Number(rawForce.toFixed(2));

    // 穩定平衡懸浮間距估算 d_eq (力為 0 或抵消標準預載之平衡點)
    const eqGap = 35.0 + 20.0 * (theta / Math.PI) * kappa;
    this.state.levitationEquilibriumNm = Number(eqGap.toFixed(1));

    // 量子真空扭矩 \tau \propto \frac{\hbar c}{d^3} \sin(2\phi)
    const torque = (8.5e4 / Math.pow(d, 2.5)) * Math.sin(2.0 * phiRad) * kappa;
    this.state.quantumTorquePnNm = Number(Math.abs(torque).toFixed(2));
  }

  private initAudioContext(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playMotorSound(freq: number, duration: number, type: OscillatorType): void {
    try {
      this.initAudioContext();
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.045, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 略過 Web Audio 異常
    }
  }
}

export const repulsiveCasimirEngine = new RepulsiveCasimirMotorEngine();
export const repulsiveCasimirMotorEngine = repulsiveCasimirEngine;
export const casimirMotorEngine = repulsiveCasimirEngine;
