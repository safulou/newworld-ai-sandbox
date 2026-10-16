/**
 * 超流玻色-費米混合拓撲激子超固體轉子引擎
 * (Superfluid Bose-Fermi Topological Exciton Supersolid Rotor Engine)
 *
 * 物理原理：
 * 1. 在雙層過渡金屬硫族化物 (TMD) 或量子阱玻色-費米混合異質結中，偶極激子玻色凝聚體 (Dipolar Exciton BEC)
 *    與二維簡併費米海 (2DEG Fermi Sea) 透過類 RKKY 費米面嵌套交互作用耦合。
 * 2. 當偶極排斥能與費米海誘導吸引能達到旋子極小值軟化閾值 (Roton Softening Threshold Δ_roton → 0) 時，
 *    系統同時自發破缺空間連續平移對稱性（形成三角晶格密度調製 ρ(r) = ρ_0 + δρ Σ cos(G·r)）與 U(1) 規範相位對稱性，
 *    湧現出兼具晶體剛性與無摩擦超流性的「拓撲激子超固體」(Topological Exciton Supersolid)。
 * 3. 在人工規範角速度 Ω 驅動下，系統展現非經典轉動慣量分數 (Non-Classical Rotational Inertia Fraction, NCRIF f_s)，
 *    受 Leggett 變分上界約束，並在超固體晶格間隙中生成量子化超流渦旋陣列。
 */

export type ExcitonSupersolidRegime =
  | 'normal-exciton-fermi-liquid'
  | 'uniform-dipolar-superfluid'
  | 'roton-softening-supersolid'
  | 'topological-vortex-supersolid-crystal';

export interface SupersolidLatticeDroplet {
  id: number;
  x: number;
  y: number;
  dropletDensity: number;
  superfluidPhaseRad: number;
  hasInterstitialVortex: boolean;
}

export interface BoseFermiExcitonSupersolidState {
  dipolarCouplingDd: number;          // 偶極激子排斥耦合強度 g_dd (meV·nm², 5.0 ~ 80.0)
  fermiSurfaceNestingKf: number;      // 費米面波矢嵌套強度 k_F·d (0.2 ~ 3.5)
  syntheticRotationOmega: number;     // 人工規範旋轉角速度 Ω (GHz, 0.5 ~ 25.0)
  rotonEnergyGapMev: number;          // 旋子極小值能隙 Δ_roton (meV)
  ncriSuperfluidFractionFs: number;   // 非經典轉動慣量超流分數 f_s (0 ~ 1)
  crystalModulationContrast: number;  // 超固體晶格密度調制對比度 C_solid (0 ~ 1)
  activeRegime: ExcitonSupersolidRegime;
  pulsePhase: number;
  droplets: SupersolidLatticeDroplet[];
}

const STORAGE_KEY = 'newworld_bose_fermi_exciton_supersolid_state_v1';

export class BoseFermiExcitonSupersolidRotorEngine {
  private state: BoseFermiExcitonSupersolidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): BoseFermiExcitonSupersolidState {
    const defaults: BoseFermiExcitonSupersolidState = {
      dipolarCouplingDd: 42.0,
      fermiSurfaceNestingKf: 1.85,
      syntheticRotationOmega: 8.5,
      rotonEnergyGapMev: 0.45,
      ncriSuperfluidFractionFs: 0.68,
      crystalModulationContrast: 0.74,
      activeRegime: 'roton-softening-supersolid',
      pulsePhase: 0,
      droplets: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Bose-Fermi Exciton Supersolid state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Bose-Fermi Exciton Supersolid state:', e);
      }
    }
  }

  public getState(): Readonly<BoseFermiExcitonSupersolidState> {
    return this.state;
  }

  public setDipolarCoupling(gdd: number): void {
    this.state.dipolarCouplingDd = Math.max(5.0, Math.min(80.0, parseFloat(gdd.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setFermiSurfaceNesting(kf: number): void {
    this.state.fermiSurfaceNestingKf = Math.max(0.2, Math.min(3.5, parseFloat(kf.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setSyntheticRotation(omega: number): void {
    this.state.syntheticRotationOmega = Math.max(0.5, Math.min(25.0, parseFloat(omega.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: ExcitonSupersolidRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'normal-exciton-fermi-liquid':
        this.state.dipolarCouplingDd = 10.0;
        this.state.fermiSurfaceNestingKf = 0.45;
        this.state.syntheticRotationOmega = 1.5;
        break;
      case 'uniform-dipolar-superfluid':
        this.state.dipolarCouplingDd = 26.0;
        this.state.fermiSurfaceNestingKf = 1.10;
        this.state.syntheticRotationOmega = 5.0;
        break;
      case 'roton-softening-supersolid':
        this.state.dipolarCouplingDd = 48.0;
        this.state.fermiSurfaceNestingKf = 2.15;
        this.state.syntheticRotationOmega = 11.0;
        break;
      case 'topological-vortex-supersolid-crystal':
        this.state.dipolarCouplingDd = 72.0;
        this.state.fermiSurfaceNestingKf = 3.20;
        this.state.syntheticRotationOmega = 21.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const gdd = this.state.dipolarCouplingDd;
    const kf = this.state.fermiSurfaceNestingKf;
    const omega = this.state.syntheticRotationOmega;

    // 旋子極小值能隙 Δ_roton (隨偶極耦合與費米面嵌套增高而軟化趨近 0)
    const softeningParam = (gdd / 50.0) * (kf / 2.0);
    const deltaRoton = Math.max(0.05, 4.5 * Math.exp(-1.1 * softeningParam));
    this.state.rotonEnergyGapMev = parseFloat(deltaRoton.toFixed(2));

    // 晶體密度調制對比度 C_solid (0 ~ 0.96)
    const contrast = Math.min(0.96, 1.0 - Math.exp(-0.95 * softeningParam));
    this.state.crystalModulationContrast = parseFloat(contrast.toFixed(2));

    // Leggett 非經典轉動慣量超流分數上界 f_s = (1 - C_solid² * 0.65) * (0.4 + 0.6 * tanh(gdd / 30))
    const leggettFactor = 1.0 - Math.pow(contrast, 2) * 0.58;
    const fs = Math.max(0.08, Math.min(0.95, leggettFactor * (0.35 + 0.65 * Math.tanh(gdd / 28.0))));
    this.state.ncriSuperfluidFractionFs = parseFloat(fs.toFixed(2));

    // 生成 13 個六角超固體激子液滴晶格節點 (1 中心 + 6 內環 + 6 外環)
    const droplets: SupersolidLatticeDroplet[] = [];
    const rotAngle = this.state.pulsePhase * 0.45 * (omega / 10.0);

    // 中心激子液滴
    droplets.push({
      id: 0,
      x: 165,
      y: 160,
      dropletDensity: parseFloat((0.65 + 0.3 * contrast).toFixed(2)),
      superfluidPhaseRad: parseFloat((this.state.pulsePhase % (2 * Math.PI)).toFixed(2)),
      hasInterstitialVortex: omega > 6.0
    });

    // 內六角環 (6 個液滴)
    const rInner = 52;
    for (let i = 0; i < 6; i++) {
      const theta = (i * Math.PI) / 3 + rotAngle;
      droplets.push({
        id: i + 1,
        x: parseFloat((165 + rInner * Math.cos(theta)).toFixed(1)),
        y: parseFloat((160 + rInner * Math.sin(theta)).toFixed(1)),
        dropletDensity: parseFloat((0.55 + 0.38 * contrast + 0.05 * Math.sin(this.state.pulsePhase + i)).toFixed(2)),
        superfluidPhaseRad: parseFloat(((this.state.pulsePhase + i * 1.047) % (2 * Math.PI)).toFixed(2)),
        hasInterstitialVortex: omega > 10.0 && i % 2 === 0
      });
    }

    // 外六角環 (6 個液滴)
    const rOuter = 96;
    for (let i = 0; i < 6; i++) {
      const theta = (i * Math.PI) / 3 + Math.PI / 6 + rotAngle * 0.85;
      droplets.push({
        id: i + 7,
        x: parseFloat((165 + rOuter * Math.cos(theta)).toFixed(1)),
        y: parseFloat((160 + rOuter * Math.sin(theta)).toFixed(1)),
        dropletDensity: parseFloat((0.48 + 0.42 * contrast + 0.06 * Math.cos(this.state.pulsePhase + i)).toFixed(2)),
        superfluidPhaseRad: parseFloat(((this.state.pulsePhase + (i + 3) * 1.047) % (2 * Math.PI)).toFixed(2)),
        hasInterstitialVortex: omega > 15.0
      });
    }

    this.state.droplets = droplets;
  }

  public update(dtSeconds: number): void {
    const rate = 1.0 + (this.state.syntheticRotationOmega / 12.0);
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerSupersolidSound(): void {
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
      const oscGoldstone = this.audioCtx.createOscillator();
      const oscRoton = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscGoldstone.type = 'sine';
      oscRoton.type = 'triangle';

      const fBase = 440 * (0.8 + 0.4 * this.state.ncriSuperfluidFractionFs);
      const fRoton = fBase * (1.5 + 0.3 * this.state.crystalModulationContrast);

      oscGoldstone.frequency.setValueAtTime(fBase, t);
      oscGoldstone.frequency.exponentialRampToValueAtTime(fBase * 1.2, t + 0.35);

      oscRoton.frequency.setValueAtTime(fRoton, t);
      oscRoton.frequency.exponentialRampToValueAtTime(fRoton * 0.9, t + 0.45);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      oscGoldstone.connect(gain);
      oscRoton.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscGoldstone.start(t);
      oscRoton.start(t);
      oscGoldstone.stop(t + 0.54);
      oscRoton.stop(t + 0.54);
    } catch (e) {
      console.warn('Web Audio playback failed in BoseFermiExcitonSupersolidRotorEngine:', e);
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

export const boseFermiExcitonSupersolidRotorEngine = new BoseFermiExcitonSupersolidRotorEngine();
