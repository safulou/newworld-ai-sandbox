/**
 * 動態外爾手性引力異常流體引擎 (Dynamical Weyl Chiral Gravitational Anomaly Fluid Engine)
 * 
 * 物理原理：
 * 1. 相對論性外爾費米子流體 (Weyl Relativistic Fluid) 在量子場論中存在混合引力-手性反常
 *    (Mixed Gravitational-Chiral Anomaly):
 *    ∇_μ J₅^μ = (e² / 4π² ℏ² c) E · B + (1 / 384π²) ε^{μνρσ} R^α_{βμν} R^β_{αρσ}
 * 2. 曲率張量反常項打破了手性荷的微觀守恆，引發宏觀流體動力學中的手性渦旋效應 (Chiral Vortical Effect, CVE):
 *    J_v = (μ₅² / 2π² + T² / 6) Ω
 *    其中 Ω = 1/2 ∇ × v 為流體渦度，T 為局部絕對溫度。
 * 3. 系統產生純幾何起源的量子熱霍爾電導異常 κ_xy = (π² k_B² T / 3h) C_grav 與無耗散霍爾黏度 η_H。
 * 4. 在強渦度與高溫下，流體發生量子湍流與極速熱攪動 (Fast Thermal Scrambling)，李雅普諾夫指數飽和 MSS 界限。
 */

export type WeylFluidRegime = 
  | 'laminar-weyl-gas'
  | 'chiral-vortical-fluid'
  | 'gravitational-anomaly-turbulent'
  | 'fast-thermal-scrambling';

export interface FluidStreamlineNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vorticityMag: number;
  curvatureDensity: number;
}

export interface WeylFluidState {
  chiralChemicalPotentialMu5: number; // 手性化學勢 μ₅ (meV, 0 ~ 40)
  fluidVorticityOmega: number;         // 流體渦度 Ω (rad/s, 0 ~ 100)
  fluidTemperatureK: number;           // 流體溫度 T (K, 1.0 ~ 50.0)
  gravitationalAnomalyFactor: number;  // 引力反常係數 C_grav (0.1 ~ 2.0)
  chiralVorticalCurrent: number;       // 手性渦旋流密度 J_v (10⁴ A/m²)
  thermalHallConductivity: number;     // 熱霍爾電導率 κ_xy (W/m·K)
  hallViscosity: number;               // 奇性引力霍爾黏度 η_H (10⁻⁶ Pa·s)
  lyapunovExponent: number;            // 混亂李雅普諾夫指數 λ_L (10¹² s⁻¹)
  activeRegime: WeylFluidRegime;
  pulsePhase: number;
  streamlines: FluidStreamlineNode[];
}

const STORAGE_KEY = 'newworld_weyl_chiral_gravitational_fluid_state_v1';

export class WeylChiralGravitationalFluidEngine {
  private state: WeylFluidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): WeylFluidState {
    const defaults: WeylFluidState = {
      chiralChemicalPotentialMu5: 18.5,
      fluidVorticityOmega: 45.0,
      fluidTemperatureK: 12.0,
      gravitationalAnomalyFactor: 1.0,
      chiralVorticalCurrent: 52.8,
      thermalHallConductivity: 3.42,
      hallViscosity: 14.8,
      lyapunovExponent: 1.57,
      activeRegime: 'chiral-vortical-fluid',
      pulsePhase: 0,
      streamlines: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Weyl Chiral Fluid state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Weyl Chiral Fluid state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<WeylFluidState> {
    return this.state;
  }

  public setChiralPotential(mu5: number): void {
    this.state.chiralChemicalPotentialMu5 = Math.max(0, Math.min(40, mu5));
    this.recomputePhysics();
    this.saveState();
  }

  public setVorticity(omega: number): void {
    this.state.fluidVorticityOmega = Math.max(0, Math.min(100, omega));
    this.recomputePhysics();
    this.saveState();
  }

  public setTemperature(t: number): void {
    this.state.fluidTemperatureK = Math.max(1.0, Math.min(50.0, t));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: WeylFluidRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'laminar-weyl-gas':
        this.state.chiralChemicalPotentialMu5 = 2.0;
        this.state.fluidVorticityOmega = 5.0;
        this.state.fluidTemperatureK = 4.0;
        break;
      case 'chiral-vortical-fluid':
        this.state.chiralChemicalPotentialMu5 = 16.0;
        this.state.fluidVorticityOmega = 45.0;
        this.state.fluidTemperatureK = 15.0;
        break;
      case 'gravitational-anomaly-turbulent':
        this.state.chiralChemicalPotentialMu5 = 28.0;
        this.state.fluidVorticityOmega = 80.0;
        this.state.fluidTemperatureK = 28.0;
        break;
      case 'fast-thermal-scrambling':
        this.state.chiralChemicalPotentialMu5 = 38.0;
        this.state.fluidVorticityOmega = 98.0;
        this.state.fluidTemperatureK = 48.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const mu5 = this.state.chiralChemicalPotentialMu5;
    const omega = this.state.fluidVorticityOmega;
    const T = this.state.fluidTemperatureK;
    const Cgrav = this.state.gravitationalAnomalyFactor;

    // 手性渦旋電流密度 J_v = (μ₅² / 2π² + T² / 6) * Ω * 0.05
    const jv = (Math.pow(mu5, 2) / (2 * Math.PI * Math.PI) + Math.pow(T, 2) / 6.0) * (omega / 20.0);
    this.state.chiralVorticalCurrent = parseFloat(jv.toFixed(1));

    // 熱霍爾電導率 κ_xy = (π² * T / 30) * C_grav
    const kxy = (Math.pow(Math.PI, 2) * T / 30.0) * Cgrav;
    this.state.thermalHallConductivity = parseFloat(kxy.toFixed(2));

    // 霍爾奇異黏度 η_H = 0.5 * mu5 * (omega / 10)^0.5
    const etaH = 0.5 * mu5 * Math.pow(Math.max(0.1, omega) / 10, 0.5) + T * 0.2;
    this.state.hallViscosity = parseFloat(etaH.toFixed(1));

    // 李雅普諾夫指數 λ_L = (2π * k_B * T / ℏ) 比例標度
    const lyap = (2 * Math.PI * T) / 45.0;
    this.state.lyapunovExponent = parseFloat(lyap.toFixed(2));

    // 計算 8 條渦旋流線採樣節點
    const stream: FluidStreamlineNode[] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (this.state.pulsePhase * (omega / 25.0));
      const rad = 75 + 20 * Math.sin(this.state.pulsePhase * 0.8 + i);
      const cx = 150 + rad * Math.cos(angle);
      const cy = 150 + rad * Math.sin(angle);
      
      const vx = -Math.sin(angle) * (omega / 10.0);
      const vy = Math.cos(angle) * (omega / 10.0);
      const curv = (Math.pow(mu5, 1.2) / 20.0) * (1 + 0.3 * Math.cos(this.state.pulsePhase + i));

      stream.push({
        id: i,
        x: parseFloat(cx.toFixed(1)),
        y: parseFloat(cy.toFixed(1)),
        vx: parseFloat(vx.toFixed(2)),
        vy: parseFloat(vy.toFixed(2)),
        vorticityMag: parseFloat((omega * (rad / 100)).toFixed(1)),
        curvatureDensity: parseFloat(curv.toFixed(2))
      });
    }
    this.state.streamlines = stream;
  }

  public update(dtSeconds: number): void {
    const rate = 1.0 + (this.state.fluidVorticityOmega / 30.0);
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerVortexSound(): void {
    try {
      if (typeof window === 'undefined') return;
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      const startFreq = 90 + this.state.fluidVorticityOmega * 2;
      const endFreq = startFreq + this.state.chiralChemicalPotentialMu5 * 8;

      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.3);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.8, t + 0.5);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.55);
    } catch (e) {
      console.warn('Web Audio playback failed in WeylChiralFluidEngine:', e);
    }
  }

  public reset(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    this.state = this.loadState();
    this.recomputePhysics();
  }
}

export const weylChiralGravitationalFluidEngine = new WeylChiralGravitationalFluidEngine();
