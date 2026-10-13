/**
 * 拓撲四維量子霍爾效應與第二陳數合成維度反應堆
 * (4D Quantum Hall Effect & Second Chern Number Synthetic Dimension Reactor)
 *
 * 核心物理理論：
 * 1. 四維量子霍爾效應與第二陳數 (4D QHE & Second Chern Number c_2)：
 *    在四維流形 \mathcal{M}_4 (S^4 或 T^4) 中，非阿貝爾 SU(2) 規範場之拓撲不變量為第二陳數：
 *    c_2 = \frac{1}{8\pi^2} \int_{\mathcal{M}_4} \text{Tr}(\mathcal{F} \wedge \mathcal{F}) = \frac{1}{8\pi^2} \int d^4k \, \epsilon^{\mu\nu\rho\sigma} \text{Tr}(F_{\mu\nu} F_{\rho\sigma}) \in \mathbb{Z}。
 * 2. 合成維度 (Synthetic Dimensions in Optical & Atomic Lattices)：
 *    利用二維真實空間晶格 (x, y) 結合光子微腔頻率梳能級或冷原子超精細自旋態，
 *    構造虛擬的 (z, w) 正交合成維度，在實驗室桌面上完美實現四維拓撲空間。
 * 3. 非線性量子化霍爾響應 (Nonlinear Quantized Hall Response)：
 *    與二維霍爾效應不同，4D QHE 表現為由第二陳數保護的非線性電磁三重響應電流：
 *    J^\mu = \frac{c_2 e^4}{(2\pi)^3 \hbar^3} \epsilon^{\mu\nu\rho\sigma} E_\nu B_{\rho\sigma}。
 * 4. 三維手性邊界外爾超表面 (3D Chiral Boundary Weyl States)：
 *    4D 體態之拓撲非平庸性 (c_2 \neq 0)  строго 保證其 3D 邊界超表面上存在無質量、
 *    手性拓撲保護的三維外爾費米子，免於任何微觀雜質背散射。
 */

export type FourDHallRegime =
  | 'second-chern-synthetic-4d-hall'       // 第二陳數 c_2 量子化四維霍爾相
  | '3d-chiral-weyl-hypersurface'          // 三維手性邊界外爾費米子超表面相
  | 'nonlinear-quantized-current-surge'    // 非線性電磁三重外積霍爾電流相
  | 'synthetic-dimension-decoupled-lattice';// 合成維度解耦平庸布洛赫相

export interface FourDQuantumHallState {
  secondChernNumberC2: number;             // 第二陳數 c_2 (整數, -2, -1, 0, 1, 2)
  syntheticCouplingStrengthOmega: number;  // 合成維度跳躍耦合 \Omega_w (0.1 ~ 5.0)
  drivingElectricFieldExVcm: number;       // 驅動電場 E_x (V/cm, 0.5 ~ 25.0)
  magneticTensorBzwTesla: number;          // 4D 磁場分量 B_{zw} (T, 0.2 ~ 15.0)
  regime: FourDHallRegime;

  // 動態演算物理指標
  nonlinearHallCurrentDensityMicroAmp: number; // 4D 非線性霍爾電流密度 J_{4D} (\mu A/cm^3)
  hypersurfaceWeylVelocityNormalized: number;  // 3D 邊界外爾費米子速度 v_W / c (0.01 ~ 0.95)
  topologicalNonlinearConductivityG: number;   // 拓撲非線性電導率 G_4D (10^-6 A*m / V^2)
  fourDimensionalBrillouinVolume: number;      // 4D 布里淵區歸一化體積 (1.0 ~ 8.0)
  chiralSurfaceStateDensityE11: number;        // 手性超表面態密度 (10^11 cm^-2)
  telemetryHistory: Array<{
    timestamp: number;
    hallCurrent: number;
    chernNumber: number;
    weylVelocity: number;
  }>;
}

const STORAGE_KEY = 'newworld_four_d_quantum_hall_synthetic_state_v1';

class FourDQuantumHallEngine {
  private state: FourDQuantumHallState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): FourDQuantumHallState {
    return {
      secondChernNumberC2: 1,
      syntheticCouplingStrengthOmega: 2.4,
      drivingElectricFieldExVcm: 6.5,
      magneticTensorBzwTesla: 4.2,
      regime: 'second-chern-synthetic-4d-hall',
      nonlinearHallCurrentDensityMicroAmp: 45.8,
      hypersurfaceWeylVelocityNormalized: 0.68,
      topologicalNonlinearConductivityG: 3.12,
      fourDimensionalBrillouinVolume: 4.8,
      chiralSurfaceStateDensityE11: 8.6,
      telemetryHistory: []
    };
  }

  private loadState(): FourDQuantumHallState {
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
      // 略過儲存例外
    }
  }

  public getState(): FourDQuantumHallState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // 拓撲非線性電導 G_4D \propto c_2 * \Omega_w
    s.topologicalNonlinearConductivityG = Number((s.secondChernNumberC2 * (s.syntheticCouplingStrengthOmega * 1.3)).toFixed(2));

    // 非線性電流響應 J = G_4D * E_x * B_zw
    const rawCurrent = s.topologicalNonlinearConductivityG * s.drivingElectricFieldExVcm * s.magneticTensorBzwTesla * 0.42;
    s.nonlinearHallCurrentDensityMicroAmp = Number(rawCurrent.toFixed(1));

    // 3D 邊界外爾費米子速度
    if (s.secondChernNumberC2 !== 0 && s.syntheticCouplingStrengthOmega > 0.8) {
      s.hypersurfaceWeylVelocityNormalized = Number((0.25 + 0.15 * Math.abs(s.secondChernNumberC2) + 0.08 * s.syntheticCouplingStrengthOmega).toFixed(2));
      s.chiralSurfaceStateDensityE11 = Number((Math.abs(s.secondChernNumberC2) * 5.2 + s.syntheticCouplingStrengthOmega * 1.4).toFixed(1));
    } else {
      s.hypersurfaceWeylVelocityNormalized = 0.02;
      s.chiralSurfaceStateDensityE11 = 0.4;
    }

    // 4D 布里淵區體積
    s.fourDimensionalBrillouinVolume = Number((2.0 + s.syntheticCouplingStrengthOmega * 1.2).toFixed(1));

    // 狀態判定
    if (s.secondChernNumberC2 === 0 || s.syntheticCouplingStrengthOmega < 0.6) {
      s.regime = 'synthetic-dimension-decoupled-lattice';
    } else if (Math.abs(s.nonlinearHallCurrentDensityMicroAmp) > 80.0) {
      s.regime = 'nonlinear-quantized-current-surge';
    } else if (s.hypersurfaceWeylVelocityNormalized > 0.75) {
      s.regime = '3d-chiral-weyl-hypersurface';
    } else {
      s.regime = 'second-chern-synthetic-4d-hall';
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
        hallCurrent: this.state.nonlinearHallCurrentDensityMicroAmp,
        chernNumber: this.state.secondChernNumberC2,
        weylVelocity: this.state.hypersurfaceWeylVelocityNormalized
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public pumpSyntheticCoupling(omegaDelta: number = 0.5): void {
    this.state.syntheticCouplingStrengthOmega = Number(Math.max(0.1, Math.min(5.0, this.state.syntheticCouplingStrengthOmega + omegaDelta)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(520, 780, 0.18, 'sine');
  }

  public invertSecondChernTopology(): void {
    if (this.state.secondChernNumberC2 === 1) {
      this.state.secondChernNumberC2 = 2;
    } else if (this.state.secondChernNumberC2 === 2) {
      this.state.secondChernNumberC2 = -1;
    } else if (this.state.secondChernNumberC2 === -1) {
      this.state.secondChernNumberC2 = -2;
    } else {
      this.state.secondChernNumberC2 = 1;
    }
    this.recalculatePhysics();
    this.playTone(380, 880, 0.25, 'triangle');
  }

  public applyNonlinearDrive(electricBoost: number = 4.0): void {
    this.state.drivingElectricFieldExVcm = Number(Math.min(25.0, this.state.drivingElectricFieldExVcm + electricBoost).toFixed(1));
    this.recalculatePhysics();
    this.playTone(660, 1100, 0.22, 'sawtooth');
  }

  public dampHypersurfaceModes(): void {
    this.state.drivingElectricFieldExVcm = 4.0;
    this.state.magneticTensorBzwTesla = 2.0;
    this.recalculatePhysics();
    this.playTone(440, 220, 0.2, 'sine');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(330, 220, 0.2, 'sine');
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
      // 忽視靜音
    }
  }
}

export const fourDQuantumHallEngine = new FourDQuantumHallEngine();
