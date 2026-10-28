/**
 * 超冷極性分子偶極量子鐵電超流體與自束縛量子液滴引擎
 * (Ultracold Dipolar Quantum Ferroelectric Superfluid & Lee-Huang-Yang Self-Bound Quantum Droplet Engine)
 *
 * 物理原理：
 * 1. 在微波屏蔽超冷極性分子 (如 NaCs, KRb，永久電偶極矩 d_{eff} 達數 Debye) 或強磁性鑭系原子 (Dy, Er) 玻色凝聚體中，
 *    長程各向異性偶極-偶極相互作用 (DDI) 與短程接觸交互作用之比定義為相對偶極強度 ε_{dd} = a_{dd} / a_s。
 * 2. 當 ε_{dd} > 1 時，平均場理論預言系統發生引力式塌縮；然而，超越平均場之李-黃-楊 (Lee-Huang-Yang, LHY)
 *    量子零點漲落提供高階排斥能量密度 E_{LHY} ∝ g_{LHY} n^{5/2} (1 + 3/2 ε_{dd}²)，在無需外部光阱約束下穩定住
 *    自束縛「量子鐵電液滴」(Self-Bound Quantum Ferrofluid Droplet) 與蜂巢液滴超固體陣列。
 * 3. 極性分子偶極矩自發平行排列形成宏觀鐵電向列極化序 P_{ferro}，並在動量 k_{roton} 處展現偶極旋子軟化能隙 Δ_{roton}。
 */

export type DipolarFerroelectricRegime =
  | 'contact-dominated-repulsive-bec'
  | 'roton-minimum-softening-threshold'
  | 'lhy-stabilized-self-bound-droplet'
  | 'ferroelectric-supersolid-droplet-crystal';

export interface DipolarQuantumDropletNode {
  id: number;
  x: number;
  y: number;
  dropletRadiusUm: number;
  dipoleOrientationDeg: number;
  lhyPressureRatio: number;
  peakDensity10To14Cm3: number;
}

export interface DipolarFerroelectricSuperfluidState {
  relativeDipolarStrengthEpsDd: number; // 相對偶極相互作用比 ε_{dd} = a_{dd} / a_s (0.50 ~ 2.20, 臨界點 = 1.00)
  effectiveElectricDipoleDebye: number; // 微波屏蔽有效電偶極矩 d_{eff} (Debye, 0.2 ~ 4.5 D)
  lhyQuantumRepulsionEnergyNhz: number; // 李-黃-楊 (LHY) 量子漲落穩定排斥能 E_{LHY}/h (kHz)
  rotonGapFrequencyHz: number;          // 偶極旋子極小值軟化能隙 Δ_{roton}/h (Hz)
  ferroelectricPolarizationOrder: number;// 鐵電向列偶極極化序參量 P_{ferro} (0 ~ 1)
  dropletEquilibriumDensity: number;    // 自束縛量子液滴平衡核心密度 n_0 (×10¹⁴ cm⁻³)
  activeRegime: DipolarFerroelectricRegime;
  pulsePhase: number;
  dropletNodes: DipolarQuantumDropletNode[];
}

const STORAGE_KEY = 'newworld_dipolar_ferroelectric_superfluid_state_v1';

export class DipolarQuantumFerroelectricSuperfluidEngine {
  private state: DipolarFerroelectricSuperfluidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): DipolarFerroelectricSuperfluidState {
    const defaults: DipolarFerroelectricSuperfluidState = {
      relativeDipolarStrengthEpsDd: 1.42,
      effectiveElectricDipoleDebye: 2.6,
      lhyQuantumRepulsionEnergyNhz: 18.4,
      rotonGapFrequencyHz: 42.0,
      ferroelectricPolarizationOrder: 0.91,
      dropletEquilibriumDensity: 6.8,
      activeRegime: 'lhy-stabilized-self-bound-droplet',
      pulsePhase: 0,
      dropletNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Dipolar Ferroelectric Superfluid state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Dipolar Ferroelectric Superfluid state:', e);
      }
    }
  }

  public getState(): Readonly<DipolarFerroelectricSuperfluidState> {
    return this.state;
  }

  public setRelativeDipolarStrength(epsDd: number): void {
    this.state.relativeDipolarStrengthEpsDd = Math.max(0.50, Math.min(2.20, parseFloat(epsDd.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setEffectiveElectricDipole(debye: number): void {
    this.state.effectiveElectricDipoleDebye = Math.max(0.2, Math.min(4.5, parseFloat(debye.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: DipolarFerroelectricRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'contact-dominated-repulsive-bec':
        this.state.relativeDipolarStrengthEpsDd = 0.65;
        this.state.effectiveElectricDipoleDebye = 0.6;
        break;
      case 'roton-minimum-softening-threshold':
        this.state.relativeDipolarStrengthEpsDd = 1.02;
        this.state.effectiveElectricDipoleDebye = 1.5;
        break;
      case 'lhy-stabilized-self-bound-droplet':
        this.state.relativeDipolarStrengthEpsDd = 1.45;
        this.state.effectiveElectricDipoleDebye = 2.8;
        break;
      case 'ferroelectric-supersolid-droplet-crystal':
        this.state.relativeDipolarStrengthEpsDd = 1.88;
        this.state.effectiveElectricDipoleDebye = 4.1;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const eps = this.state.relativeDipolarStrengthEpsDd;
    const dipole = this.state.effectiveElectricDipoleDebye;

    // LHY 量子漲落排斥能 E_{LHY}/h (kHz) ∝ (1 + 1.5 ε_{dd}²) * d_{eff}^{1.5}
    const lhyKhz = 2.2 * (1.0 + 1.5 * eps * eps) * Math.pow(dipole, 1.25);
    this.state.lhyQuantumRepulsionEnergyNhz = parseFloat(lhyKhz.toFixed(2));

    // 偶極旋子軟化能隙 Δ_{roton}/h (Hz)：在 ε_{dd} → 1.0 時軟化趨近極小值
    const rotonHz = Math.max(8.0, 380.0 * Math.exp(-1.9 * eps) + 18.0 * Math.abs(eps - 1.05));
    this.state.rotonGapFrequencyHz = parseFloat(rotonHz.toFixed(1));

    // 鐵電向列極化序參量 P_{ferro}
    const pFerro = Math.min(0.99, Math.tanh(0.45 * eps * dipole));
    this.state.ferroelectricPolarizationOrder = parseFloat(pFerro.toFixed(2));

    // 自束縛量子液滴平衡峰值密度 n_0 (×10¹⁴ cm⁻³)
    const n0 = 1.2 + 2.8 * Math.pow(Math.max(0.1, eps - 0.5), 1.4) * (0.5 + 0.3 * dipole);
    this.state.dropletEquilibriumDensity = parseFloat(n0.toFixed(2));

    // 生成 13 個六方蜂巢排列之 LHY 自束縛量子鐵電液滴節點 (1 中心 + 6 內環 + 6 外環)
    const nodes: DipolarQuantumDropletNode[] = [];
    const count = 13;
    for (let i = 0; i < count; i++) {
      let x = 165;
      let y = 160;
      if (i > 0 && i <= 6) {
        const angle = ((i - 1) / 6) * 2.0 * Math.PI + this.state.pulsePhase * 0.25;
        x = 165 + 52 * Math.cos(angle);
        y = 160 + 52 * Math.sin(angle);
      } else if (i > 6) {
        const angle = ((i - 7) / 6) * 2.0 * Math.PI + Math.PI / 6.0 + this.state.pulsePhase * 0.25;
        x = 165 + 94 * Math.cos(angle);
        y = 160 + 94 * Math.sin(angle);
      }

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        dropletRadiusUm: parseFloat((6.0 + 2.8 * Math.min(2.0, eps)).toFixed(1)),
        dipoleOrientationDeg: parseFloat(((1.0 - pFerro) * 25.0 * Math.sin(i + this.state.pulsePhase)).toFixed(1)),
        lhyPressureRatio: parseFloat(Math.min(1.0, eps / 1.4).toFixed(2)),
        peakDensity10To14Cm3: this.state.dropletEquilibriumDensity
      });
    }
    this.state.dropletNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + this.state.relativeDipolarStrengthEpsDd * 0.45;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerDipolarDropletSound(): void {
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
      const oscRoton = this.audioCtx.createOscillator();
      const oscLhy = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscRoton.type = 'sine';
      oscLhy.type = 'triangle';

      // 旋子軟化低頻模與 LHY n^{5/2} 高階量子漲落排斥高頻模
      const fRoton = 180 + this.state.rotonGapFrequencyHz * 0.8;
      const fLhy = 320 + this.state.lhyQuantumRepulsionEnergyNhz * 14;

      oscRoton.frequency.setValueAtTime(fRoton, t);
      oscRoton.frequency.exponentialRampToValueAtTime(fLhy * 0.75, t + 0.35);

      oscLhy.frequency.setValueAtTime(fLhy, t);
      oscLhy.frequency.exponentialRampToValueAtTime(fLhy * 1.35, t + 0.35);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscRoton.connect(gain);
      oscLhy.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscRoton.start(t);
      oscLhy.start(t);
      oscRoton.stop(t + 0.57);
      oscLhy.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in DipolarQuantumFerroelectricSuperfluidEngine:', e);
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

export const dipolarQuantumFerroelectricSuperfluidEngine = new DipolarQuantumFerroelectricSuperfluidEngine();
