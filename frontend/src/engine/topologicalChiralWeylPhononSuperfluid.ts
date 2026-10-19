/**
 * 拓撲手性時間反演破缺外爾聲子超流體與熱霍爾渦旋晶格引擎
 * (Topological Chiral Time-Reversal-Broken Weyl Phonon Superfluid & Thermal Hall Vortex Lattice Engine)
 *
 * 物理原理：
 * 1. 在手性磁有序晶體或強自旋-晶格拉曼耦合 (Spin-Phonon Raman Coupling g_sp) 材料中，時間反演對稱性破缺賦予晶格振動模
 *    非零聲子貝里曲率 Ω_ph(q)，並在三維聲子布里淵區中湧現攜帶拓撲單極荷 C_ph = ±1, ±2 的外爾聲子節點 (Weyl Phonon Nodes)。
 * 2. 圓偏振手性聲子攜帶量子化贗角動量 l_ph = ±ℏ，在非平衡太赫茲共振泵浦下發生玻色-愛因斯坦凝聚 (Chiral Phonon BEC)，
 *    形成無黏滯手性聲子超流體，並在晶體表面產生連接不同手性外爾聲子節點的表面聲子費米弧 (Phonon Surface Arcs)。
 * 3. 聲子貝里曲率在橫向溫度梯度 ∇T 下誘導宏觀無耗散聲子熱霍爾效應 (Phonon Thermal Hall Effect)，
 *    熱霍爾電導率 κ_xy^ph ∝ (k_B² T / ℏ) ∫ c_2(n_B) Ω_ph^z d³q，並伴隨手性聲子渦旋晶格自組裝。
 */

export type ChiralWeylPhononRegime =
  | 'achiral-acoustic-lattice'
  | 'single-weyl-phonon-monopole'
  | 'double-weyl-surface-arc-condensate'
  | 'quantized-thermal-hall-superfluid';

export interface WeylPhononNode {
  id: number;
  x: number;
  y: number;
  chiralityCharge: number;
  phononAngularMomentum: number;
  berryFluxDensity: number;
  arcPhaseRad: number;
}

export interface TopologicalChiralWeylPhononState {
  phononMonopoleChargeC: number;      // 外爾聲子拓撲陳數單極荷 |C_ph| (1 ~ 4)
  spinPhononCouplingMeV: number;      // 自旋-聲子拉曼耦合強度 g_sp (meV, 1.0 ~ 45.0)
  thermalGradientKelvinUm: number;    // 橫向熱梯度 ΔT/L (K/μm, 0.5 ~ 30.0)
  thermalHallConductivityMw: number;  // 聲子熱霍爾電導率 κ_xy^ph (mW/K·m)
  chiralAngularMomentumDensity: number;// 手性聲子角動量密度 J_z^ph (ℏ/nm³)
  superfluidCoherenceFraction: number;// 聲子超流凝聚相干度 f_BEC (0 ~ 1)
  activeRegime: ChiralWeylPhononRegime;
  pulsePhase: number;
  phononNodes: WeylPhononNode[];
}

const STORAGE_KEY = 'newworld_chiral_weyl_phonon_superfluid_state_v1';

export class TopologicalChiralWeylPhononSuperfluidEngine {
  private state: TopologicalChiralWeylPhononState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): TopologicalChiralWeylPhononState {
    const defaults: TopologicalChiralWeylPhononState = {
      phononMonopoleChargeC: 2,
      spinPhononCouplingMeV: 18.5,
      thermalGradientKelvinUm: 12.0,
      thermalHallConductivityMw: 36.4,
      chiralAngularMomentumDensity: 2.85,
      superfluidCoherenceFraction: 0.76,
      activeRegime: 'double-weyl-surface-arc-condensate',
      pulsePhase: 0,
      phononNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Chiral Weyl Phonon state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Chiral Weyl Phonon state:', e);
      }
    }
  }

  public getState(): Readonly<TopologicalChiralWeylPhononState> {
    return this.state;
  }

  public setPhonopoleCharge(c: number): void {
    this.state.phononMonopoleChargeC = Math.max(1, Math.min(4, Math.round(c)));
    this.recomputePhysics();
    this.saveState();
  }

  public setSpinPhononCoupling(gsp: number): void {
    this.state.spinPhononCouplingMeV = Math.max(1.0, Math.min(45.0, parseFloat(gsp.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setThermalGradient(gradT: number): void {
    this.state.thermalGradientKelvinUm = Math.max(0.5, Math.min(30.0, parseFloat(gradT.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: ChiralWeylPhononRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'achiral-acoustic-lattice':
        this.state.phononMonopoleChargeC = 1;
        this.state.spinPhononCouplingMeV = 3.0;
        this.state.thermalGradientKelvinUm = 2.0;
        break;
      case 'single-weyl-phonon-monopole':
        this.state.phononMonopoleChargeC = 1;
        this.state.spinPhononCouplingMeV = 14.0;
        this.state.thermalGradientKelvinUm = 9.0;
        break;
      case 'double-weyl-surface-arc-condensate':
        this.state.phononMonopoleChargeC = 2;
        this.state.spinPhononCouplingMeV = 26.0;
        this.state.thermalGradientKelvinUm = 16.5;
        break;
      case 'quantized-thermal-hall-superfluid':
        this.state.phononMonopoleChargeC = 4;
        this.state.spinPhononCouplingMeV = 40.0;
        this.state.thermalGradientKelvinUm = 26.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const cPh = this.state.phononMonopoleChargeC;
    const gsp = this.state.spinPhononCouplingMeV;
    const gradT = this.state.thermalGradientKelvinUm;

    // 聲子熱霍爾電導率 κ_xy^ph (mW/K·m)
    const kappaXy = 2.4 * cPh * Math.sqrt(gsp) * (0.5 + 0.12 * gradT);
    this.state.thermalHallConductivityMw = parseFloat(kappaXy.toFixed(2));

    // 手性聲子角動量密度 J_z^ph (ℏ/nm³)
    const jz = 0.35 * cPh * (gsp / 10.0) * (1 + 0.03 * gradT);
    this.state.chiralAngularMomentumDensity = parseFloat(jz.toFixed(2));

    // 超流凝聚相干度 f_BEC
    const fBec = Math.min(0.98, 0.18 + 0.55 * Math.tanh(gsp / 22.0) + 0.06 * cPh);
    this.state.superfluidCoherenceFraction = parseFloat(fBec.toFixed(2));

    // 生成 14 個布里淵區外爾聲子單極對與熱霍爾渦旋節點
    const nodes: WeylPhononNode[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + this.state.pulsePhase * 0.4;
      const isInner = i < 6;
      const radius = isInner ? 50 : 98;
      const chirality = i % 2 === 0 ? cPh : -cPh;

      const x = 165 + radius * Math.cos(angle) + 8 * Math.sin(this.state.pulsePhase + i);
      const y = 160 + radius * Math.sin(angle) + 8 * Math.cos(this.state.pulsePhase + i);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        chiralityCharge: chirality,
        phononAngularMomentum: parseFloat((0.5 * cPh * (0.8 + 0.2 * Math.cos(this.state.pulsePhase + i))).toFixed(2)),
        berryFluxDensity: parseFloat((0.4 + 0.15 * cPh + 0.02 * gsp).toFixed(2)),
        arcPhaseRad: parseFloat(((angle + this.state.pulsePhase) % (2 * Math.PI)).toFixed(2))
      });
    }
    this.state.phononNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 1.0 + this.state.spinPhononCouplingMeV / 18.0;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerWeylPhononSound(): void {
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

      osc1.type = 'sine';
      osc2.type = 'triangle';

      const fBase = 310 + this.state.phononMonopoleChargeC * 85;
      const fPeak = fBase + this.state.spinPhononCouplingMeV * 10;

      osc1.frequency.setValueAtTime(fBase, t);
      osc1.frequency.exponentialRampToValueAtTime(fPeak, t + 0.32);

      osc2.frequency.setValueAtTime(fBase * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(fPeak * 1.5, t + 0.32);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.56);
      osc2.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in TopologicalChiralWeylPhononSuperfluidEngine:', e);
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

export const topologicalChiralWeylPhononSuperfluidEngine = new TopologicalChiralWeylPhononSuperfluidEngine();
