/**
 * 超導拓撲磁通子扭結結晶器引擎 (Superconducting Topological Fluxon Knot Crystallizer Engine)
 * 
 * 物理原理：
 * 1. 在多帶超導體（例如 MgB₂ 或手性 p-波超導約瑟夫森結陣列）中，自發破缺的連續規範對稱性允許磁通線在三維空間中
 *    發生自我糾纏與幾何扭結，形成受拓撲保護的非線性孤子——法捷耶夫-涅米霍普夫子 (Faddeev-Niemi Hopfions)
 *    或磁通子扭結 (Fluxon Knots)。
 * 2. 磁通子扭結由整數霍普夫不變量 (Hopf Invariant) 拓撲表徵：
 *    Q_H = (1 / 16π²) ∫ d³x A · B = (1 / 16π²) ∫ A ∧ F ∈ ℤ
 *    代表磁通線與磁通線之間的雙向高斯環繞數 (Gauss Linking Number)。
 * 3. 系統產生非零扭結螺旋度密度 (Knot Helicity Density) H_k 與有限拓撲束縛能 E_knot ∝ |Q_H|^{3/4}。
 * 4. 在臨界超流驅動下，多個霍普夫子透過幾何庫侖斥力與自旋交換自組裝成三維六角或面心立方霍普夫晶格 (Hopfion Crystal)，
 *    當外加偏置電流超過臨界解結閾值 (I > I_untying) 時，引發拓撲解結雪崩 (Topological Untying Avalanche)，
 *    並伴隨量子渦旋相滑移 (Phase Slip) 與突波電壓脈衝。
 */

export type FluxonKnotRegime = 
  | 'unknotted-vortex-gas'
  | 'trefoil-fluxon-knot'
  | 'hopfion-link-lattice'
  | 'topological-untying-avalanche';

export interface KnotCurvePoint {
  id: number;
  x: number;
  y: number;
  z: number;
  tangentX: number;
  tangentY: number;
  magneticFieldB: number;
}

export interface FluxonKnotState {
  hopfInvariantQ: number;          // 霍普夫拓撲不變量 Q_H (0 ~ 3)
  knotHelicityDensity: number;     // 扭結螺旋度密度 H_k (10¹² Wb²/m³)
  josephsonCouplingEjMeVR: number; // 約瑟夫森耦合能量 E_J (meV, 1.0 ~ 30.0)
  fluxonLatticeConstantNm: number; // 霍普夫晶格常數 a₀ (nm, 5.0 ~ 60.0)
  untyingCurrentThresholdMa: number;// 臨界解結電流閾值 I_untying (mA)
  topologicalBindingEnergyMev: number;// 拓撲扭結束縛能 E_knot (meV)
  activeRegime: FluxonKnotRegime;
  pulsePhase: number;
  knotPoints: KnotCurvePoint[];
}

const STORAGE_KEY = 'newworld_fluxon_knot_crystallizer_state_v1';

export class SuperconductingFluxonKnotCrystallizerEngine {
  private state: FluxonKnotState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): FluxonKnotState {
    const defaults: FluxonKnotState = {
      hopfInvariantQ: 2,
      knotHelicityDensity: 42.5,
      josephsonCouplingEjMeVR: 15.0,
      fluxonLatticeConstantNm: 24.0,
      untyingCurrentThresholdMa: 38.6,
      topologicalBindingEnergyMev: 28.4,
      activeRegime: 'trefoil-fluxon-knot',
      pulsePhase: 0,
      knotPoints: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Fluxon Knot state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Fluxon Knot state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<FluxonKnotState> {
    return this.state;
  }

  public setHopfInvariant(q: number): void {
    this.state.hopfInvariantQ = Math.max(0, Math.min(3, Math.round(q)));
    this.recomputePhysics();
    this.saveState();
  }

  public setJosephsonCoupling(ej: number): void {
    this.state.josephsonCouplingEjMeVR = Math.max(1.0, Math.min(30.0, ej));
    this.recomputePhysics();
    this.saveState();
  }

  public setFluxonLatticeConstant(a0: number): void {
    this.state.fluxonLatticeConstantNm = Math.max(5.0, Math.min(60.0, a0));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FluxonKnotRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'unknotted-vortex-gas':
        this.state.hopfInvariantQ = 0;
        this.state.josephsonCouplingEjMeVR = 3.5;
        this.state.fluxonLatticeConstantNm = 50.0;
        break;
      case 'trefoil-fluxon-knot':
        this.state.hopfInvariantQ = 1;
        this.state.josephsonCouplingEjMeVR = 14.0;
        this.state.fluxonLatticeConstantNm = 28.0;
        break;
      case 'hopfion-link-lattice':
        this.state.hopfInvariantQ = 2;
        this.state.josephsonCouplingEjMeVR = 22.0;
        this.state.fluxonLatticeConstantNm = 18.0;
        break;
      case 'topological-untying-avalanche':
        this.state.hopfInvariantQ = 3;
        this.state.josephsonCouplingEjMeVR = 28.0;
        this.state.fluxonLatticeConstantNm = 10.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const q = this.state.hopfInvariantQ;
    const ej = this.state.josephsonCouplingEjMeVR;
    const a0 = this.state.fluxonLatticeConstantNm;

    // 拓撲束縛能 E_knot = 12 * |Q_H|^0.75 * sqrt(E_J)
    const eKnot = q === 0 ? 0 : 12.0 * Math.pow(q, 0.75) * Math.sqrt(ej / 10.0);
    this.state.topologicalBindingEnergyMev = parseFloat(eKnot.toFixed(1));

    // 扭結螺旋度密度 H_k = 18.0 * Q_H * (25.0 / a0)
    const helicity = q === 0 ? 0.5 : 18.0 * q * (25.0 / a0);
    this.state.knotHelicityDensity = parseFloat(helicity.toFixed(1));

    // 臨界解結電流閾值 I_untying = 8.5 * sqrt(ej * (q + 1)) * (30 / a0)
    const iUntying = 8.5 * Math.sqrt(ej * (q + 1)) * (30.0 / a0);
    this.state.untyingCurrentThresholdMa = parseFloat(iUntying.toFixed(1));

    // 生成三葉扭結 (Trefoil 3_1) 或霍普夫環鏈 (Hopf Link) 的 3D 空間參數化取樣 (16 個頂點)
    const points: KnotCurvePoint[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * 2 * Math.PI;
      let x3d = 0;
      let y3d = 0;
      let z3d = 0;

      if (q === 0) {
        // 平庸阿布里科索夫渦旋單環
        x3d = 70 * Math.cos(t);
        y3d = 70 * Math.sin(t);
        z3d = 10 * Math.sin(this.state.pulsePhase + t);
      } else if (q === 1) {
        // 三葉扭結 (Trefoil Knot 3_1): x = sin t + 2 sin 2t, y = cos t - 2 cos 2t, z = -sin 3t
        x3d = 26 * (Math.sin(t) + 2 * Math.sin(2 * t));
        y3d = 26 * (Math.cos(t) - 2 * Math.cos(2 * t));
        z3d = -32 * Math.sin(3 * t);
      } else if (q === 2) {
        // 霍普夫環鏈 (Hopf Link 2^2_1): 兩個相互環繞的雙橢圓環
        const isRingA = i < count / 2;
        const subT = ((i % (count / 2)) / (count / 2)) * 2 * Math.PI;
        if (isRingA) {
          x3d = 45 * Math.cos(subT) - 20;
          y3d = 45 * Math.sin(subT);
          z3d = 15 * Math.cos(subT);
        } else {
          x3d = 45 * Math.cos(subT) + 20;
          y3d = 15 * Math.cos(subT);
          z3d = 45 * Math.sin(subT);
        }
      } else {
        // 高階霍普夫八字扭結 (Figure-Eight 4_1)
        x3d = 28 * (2 + Math.cos(2 * t)) * Math.cos(3 * t);
        y3d = 28 * (2 + Math.cos(2 * t)) * Math.sin(3 * t);
        z3d = 35 * Math.sin(4 * t);
      }

      // 三維旋轉投影至 2D 畫布平面 (中心 150, 150)
      const rotAngle = this.state.pulsePhase * 0.8;
      const rotX = x3d * Math.cos(rotAngle) - z3d * Math.sin(rotAngle);
      const rotZ = x3d * Math.sin(rotAngle) + z3d * Math.cos(rotAngle);
      const projX = 150 + rotX * 1.1;
      const projY = 150 + y3d * 0.95 + rotZ * 0.3;

      const magB = 0.5 + 0.5 * Math.sin(this.state.pulsePhase * 2.0 + i) * (ej / 15.0);

      points.push({
        id: i,
        x: parseFloat(projX.toFixed(1)),
        y: parseFloat(projY.toFixed(1)),
        z: parseFloat(rotZ.toFixed(1)),
        tangentX: parseFloat(Math.cos(t + rotAngle).toFixed(2)),
        tangentY: parseFloat(Math.sin(t + rotAngle).toFixed(2)),
        magneticFieldB: parseFloat(Math.max(0.1, magB).toFixed(2))
      });
    }
    this.state.knotPoints = points;
  }

  public update(dtSeconds: number): void {
    const rate = 1.0 + (this.state.josephsonCouplingEjMeVR / 12.0);
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerKnotSound(): void {
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
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      const baseFreq = 320 + this.state.hopfInvariantQ * 120;
      const peakFreq = baseFreq + this.state.josephsonCouplingEjMeVR * 18;

      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(peakFreq, t + 0.28);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, t + 0.52);

      osc2.frequency.setValueAtTime(baseFreq * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(peakFreq * 1.5, t + 0.28);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.17, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.56);
      osc2.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in SuperconductingFluxonKnotCrystallizerEngine:', e);
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

export const superconductingFluxonKnotCrystallizerEngine = new SuperconductingFluxonKnotCrystallizerEngine();
