/**
 * 拓撲歐拉類多能隙超材料與非阿貝爾四元數節點編織引擎
 * (Topological Euler-Class Multi-Gap Metamaterial & Non-Abelian Quaternion Nodal Braiding Engine)
 *
 * 物理原理：
 * 1. 在具備時空反演對稱性 C_2 T (滿足 (C_2 T)² = +1) 的實數哈密頓量 H(k) ∈ SO(N) 超材料中，
 *    多能隙拓撲相由布里淵區區塊 D 上的整數「歐拉類不變量」(Patch Euler Class χ_D) 表徵：
 *    χ_D = (1/2π) ∫_D Eu(k) d²k - (1/2π) ∮_∂D a(k)·dk ∈ Z，其中 Eu(k) = Pf[⟨∇u_n | ∇u_m⟩] 為歐拉曲率。
 * 2. 相鄰能隙中的能帶簡併節點 (Dirac/Weyl Band Nodes) 攜帶非阿貝爾四元數群 Q_8 = {±1, ±i, ±j, ±k} 拓撲荷。
 *    當透過應變或超材料耦合調制，將一對主能隙節點繞行鄰近能隙節點進行動量空間編織 (k-Space Braiding) 時，
 *    其中一個節點的四元數標架荷反號，使同手性節點對獲得非零歐拉類 χ_D = 2，產生「拓撲阻挫無法成對湮滅」(Unannihilatable Nodes)。
 * 3. 非零歐拉類同時決定多能隙邊界態的量子化扎克相位 (Zak Phase) 纏繞與聲光超材料邊界通道透射增益。
 */

export type EulerClassMetamaterialRegime =
  | 'trivial-zero-euler-annihilated'
  | 'single-gap-stiefel-whitney-dipole'
  | 'braided-euler-class-two-obstruction'
  | 'high-euler-quaternionic-meron-lattice';

export type QuaternionChargeLabel = '+1' | '-1' | '+i' | '-i' | '+j' | '-j' | '+k' | '-k';

export interface EulerBandNode {
  id: number;
  x: number;
  y: number;
  gapIndex: number; // 1 (First Gap) or 2 (Second Adjacent Gap)
  quaternionCharge: QuaternionChargeLabel;
  eulerCurvatureDensity: number;
  isAnnihilationProtected: boolean;
}

export interface TopologicalEulerClassMetamaterialState {
  patchEulerInvariantChi: number;      // 區塊歐拉類拓撲不變量 χ_D (0, 1, 2, 4)
  braidingStrainPercent: number;       // 動量空間節點編織應變度 ε_braid (%, 0.0 ~ 6.0)
  intergapCouplingThz: number;         // 多能隙耦合強度 J_gap (THz, 0.5 ~ 15.0)
  nonAbelianFramePhasePi: number;      // 四元數標架非阿貝爾編織相位 Φ_Q8 / π
  annihilationBarrierMev: number;      // 同手性節點拓撲湮滅能壘 ΔE_obst (meV)
  edgeAcousticTransmissionDb: number;  // 歐拉拓撲邊界波導透射增益 T_edge (dB)
  activeRegime: EulerClassMetamaterialRegime;
  pulsePhase: number;
  bandNodes: EulerBandNode[];
}

const STORAGE_KEY = 'newworld_topological_euler_class_metamaterial_state_v1';

const QUATERNION_LABELS: QuaternionChargeLabel[] = ['+i', '+j', '+k', '-1', '-i', '-j', '-k', '+1'];

export class TopologicalEulerClassMetamaterialEngine {
  private state: TopologicalEulerClassMetamaterialState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): TopologicalEulerClassMetamaterialState {
    const defaults: TopologicalEulerClassMetamaterialState = {
      patchEulerInvariantChi: 2,
      braidingStrainPercent: 3.2,
      intergapCouplingThz: 6.8,
      nonAbelianFramePhasePi: 1.0,
      annihilationBarrierMev: 48.6,
      edgeAcousticTransmissionDb: 26.4,
      activeRegime: 'braided-euler-class-two-obstruction',
      pulsePhase: 0,
      bandNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Topological Euler-Class state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Topological Euler-Class state:', e);
      }
    }
  }

  public getState(): Readonly<TopologicalEulerClassMetamaterialState> {
    return this.state;
  }

  public setPatchEulerInvariant(chi: number): void {
    const valid = chi <= 0 ? 0 : chi === 1 ? 1 : chi <= 2 ? 2 : 4;
    this.state.patchEulerInvariantChi = valid;
    this.recomputePhysics();
    this.saveState();
  }

  public setBraidingStrain(strainPct: number): void {
    this.state.braidingStrainPercent = Math.max(0.0, Math.min(6.0, parseFloat(strainPct.toFixed(2))));
    if (this.state.braidingStrainPercent < 0.8 && this.state.intergapCouplingThz < 2.0) {
      this.state.patchEulerInvariantChi = 0;
    } else if (this.state.braidingStrainPercent >= 2.0 && this.state.patchEulerInvariantChi === 0) {
      this.state.patchEulerInvariantChi = 2;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public setIntergapCoupling(couplingThz: number): void {
    this.state.intergapCouplingThz = Math.max(0.5, Math.min(15.0, parseFloat(couplingThz.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: EulerClassMetamaterialRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'trivial-zero-euler-annihilated':
        this.state.patchEulerInvariantChi = 0;
        this.state.braidingStrainPercent = 0.2;
        this.state.intergapCouplingThz = 1.2;
        break;
      case 'single-gap-stiefel-whitney-dipole':
        this.state.patchEulerInvariantChi = 1;
        this.state.braidingStrainPercent = 1.6;
        this.state.intergapCouplingThz = 4.2;
        break;
      case 'braided-euler-class-two-obstruction':
        this.state.patchEulerInvariantChi = 2;
        this.state.braidingStrainPercent = 3.4;
        this.state.intergapCouplingThz = 7.5;
        break;
      case 'high-euler-quaternionic-meron-lattice':
        this.state.patchEulerInvariantChi = 4;
        this.state.braidingStrainPercent = 5.4;
        this.state.intergapCouplingThz = 13.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const chi = this.state.patchEulerInvariantChi;
    const strain = this.state.braidingStrainPercent;
    const coupling = this.state.intergapCouplingThz;

    // 非阿貝爾四元數標架相位 Φ_Q8 / π
    const framePhase = chi * 0.5 + 0.12 * strain;
    this.state.nonAbelianFramePhasePi = parseFloat(framePhase.toFixed(2));

    // 拓撲阻挫湮滅能壘 ΔE_obst (meV)
    const barrier = chi === 0 ? 0.0 : (14.5 * chi + 4.2 * strain) * (0.6 + 0.08 * coupling);
    this.state.annihilationBarrierMev = parseFloat(barrier.toFixed(1));

    // 多能隙邊界波導透射增益 T_edge (dB)
    const edgeDb = 6.0 + 7.5 * chi + 1.4 * coupling + 0.8 * strain;
    this.state.edgeAcousticTransmissionDb = parseFloat(edgeDb.toFixed(1));

    // 生成 12 個相鄰能隙動量空間編織節點 (Gap 1 與 Gap 2)
    const nodes: EulerBandNode[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const gapIdx = i % 2 === 0 ? 1 : 2;
      const orbitR = gapIdx === 1 ? 58 + strain * 4 : 96;
      const braidOffset = gapIdx === 1 ? this.state.pulsePhase * 0.45 : -this.state.pulsePhase * 0.3;
      const angle = (i / count) * 2 * Math.PI + braidOffset;

      const x = 165 + orbitR * Math.cos(angle) + 8 * Math.sin(this.state.pulsePhase + i);
      const y = 160 + orbitR * Math.sin(angle) + 8 * Math.cos(this.state.pulsePhase + i);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        gapIndex: gapIdx,
        quaternionCharge: QUATERNION_LABELS[i % QUATERNION_LABELS.length],
        eulerCurvatureDensity: parseFloat((0.25 + 0.22 * chi + 0.03 * coupling).toFixed(2)),
        isAnnihilationProtected: chi >= 2
      });
    }
    this.state.bandNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.85 + this.state.intergapCouplingThz * 0.12;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerEulerBraidingSound(): void {
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

      osc1.type = 'triangle';
      osc2.type = 'sine';

      const fBase = 260 + this.state.patchEulerInvariantChi * 95;
      const fEnd = fBase + this.state.intergapCouplingThz * 24 + this.state.braidingStrainPercent * 18;

      osc1.frequency.setValueAtTime(fBase, t);
      osc1.frequency.exponentialRampToValueAtTime(fEnd, t + 0.34);

      osc2.frequency.setValueAtTime(fBase * 1.333, t);
      osc2.frequency.exponentialRampToValueAtTime(fEnd * 1.5, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.57);
      osc2.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in TopologicalEulerClassMetamaterialEngine:', e);
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

export const topologicalEulerClassMetamaterialEngine = new TopologicalEulerClassMetamaterialEngine();
