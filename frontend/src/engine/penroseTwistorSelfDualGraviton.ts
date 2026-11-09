/**
 * 彭羅斯扭量理論與全息自對偶引力子散射振幅儀引擎
 * (Penrose Twistor Theory & Holographic Self-Dual Graviton Scattering Amplitude Engine)
 *
 * 物理原理：
 * 1. 根據 Roger Penrose 扭量理論 (Twistor Theory)，四維複化閔考斯基時空 \mathbb{CM} 中的零測地線 (Null Rays)
 *    對應射影扭量空間 \mathbb{PT} = \mathbb{CP}^3 \setminus \mathbb{CP}^1 中的一點 Z^\alpha = (\omega^A, \pi_{A'})，
 *    滿足關聯關係 (Incidence Relation) \omega^A = i x^{AA'} \pi_{A'}；而時空點 x 則對應 \mathbb{PT} 中的一條射影直線 \mathbb{CP}^1_x。
 * 2. Penrose「非線性引力子構造」(Non-Linear Graviton Construction) 證明：反自對偶外爾張量為零 (W^-_{A'B'C'D'} = 0)
 *    之自對偶愛因斯坦真空度規，一一對應於扭量空間纖維叢 \mathbb{PT} \to \mathbb{CP}^1 的全純複結構形變 (Dolbeault 上同調類
 *    h \in H^1(\mathbb{PT}, \mathcal{O}(2)))。
 * 3. 在扭量弦論與天球全息中，n 個正螺旋度引力子與 2 個負螺旋度引力子之最大螺旋度破缺 (MHV) 散射振幅由 Hodges 行列式公式給出，
 *    而軟引力子算符在扭量空間生成無窮維楔形環代數 w_{1+\infty} (Soft Graviton Symmetry Tower)。
 */

export type PenroseTwistorRegime =
  | 'null-ray-incidence-cp1-riemann-sphere'
  | 'nonlinear-graviton-self-dual-weyl-deformation'
  | 'hodges-mhv-graviton-determinant-scattering'
  | 'w-infinity-soft-graviton-symmetry-tower';

export interface ProjectiveTwistorLineNode {
  id: number;
  x: number;
  y: number;
  helicityState: '+2-self-dual-graviton' | '-2-anti-self-dual' | 'cp1-holomorphic-line';
  homogeneityWeight: number;
  hodgesMinorContribution: number;
  wInfinityModeIndex: number;
}

export interface PenroseTwistorGravitonState {
  holomorphicDeformationNormH1: number;   // 扭量複結構形變上同調範數 ||h||_{H^1(PT, O(2))} (0.05 ~ 1.80)
  externalGravitonMultiplicityN: number;  // 散射外部引力子總粒子數 n (4 ~ 12)
  selfDualWeylCurvatureScalar: number;    // 自對偶外爾旋量曲率不變量 |\Psi_{ABCD}| (相對普朗克單位)
  hodgesMhvAmplitudeLogMod: number;       // Hodges MHV 引力子散射振幅對數模值 log10 |M_n^{MHV}|
  wInfinityWardIdentityFidelity: number;  // w_{1+\infty} 軟引力子流代數沃德恆等式保真度 (0.000 ~ 1.000)
  celestialTwistorOPEIndex: number;       // 扭量-天球算符乘積展開 (OPE) 全純共形權重 \Delta_{OPE}
  activeRegime: PenroseTwistorRegime;
  pulsePhase: number;
  twistorNodes: ProjectiveTwistorLineNode[];
}

const STORAGE_KEY = 'newworld_penrose_twistor_graviton_state_v1';

export class PenroseTwistorSelfDualGravitonEngine {
  private state: PenroseTwistorGravitonState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): PenroseTwistorGravitonState {
    const defaults: PenroseTwistorGravitonState = {
      holomorphicDeformationNormH1: 0.78,
      externalGravitonMultiplicityN: 6,
      selfDualWeylCurvatureScalar: 2.46,
      hodgesMhvAmplitudeLogMod: 3.84,
      wInfinityWardIdentityFidelity: 0.968,
      celestialTwistorOPEIndex: 1.92,
      activeRegime: 'nonlinear-graviton-self-dual-weyl-deformation',
      pulsePhase: 0,
      twistorNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Penrose Twistor Graviton state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Penrose Twistor Graviton state:', e);
      }
    }
  }

  public getState(): Readonly<PenroseTwistorGravitonState> {
    return this.state;
  }

  public setHolomorphicDeformationNorm(hNorm: number): void {
    this.state.holomorphicDeformationNormH1 = Math.max(0.05, Math.min(1.80, parseFloat(hNorm.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setExternalGravitonMultiplicity(nParticles: number): void {
    this.state.externalGravitonMultiplicityN = Math.max(4, Math.min(12, Math.round(nParticles)));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: PenroseTwistorRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'null-ray-incidence-cp1-riemann-sphere':
        this.state.holomorphicDeformationNormH1 = 0.22;
        this.state.externalGravitonMultiplicityN = 4;
        break;
      case 'nonlinear-graviton-self-dual-weyl-deformation':
        this.state.holomorphicDeformationNormH1 = 0.85;
        this.state.externalGravitonMultiplicityN = 6;
        break;
      case 'hodges-mhv-graviton-determinant-scattering':
        this.state.holomorphicDeformationNormH1 = 1.15;
        this.state.externalGravitonMultiplicityN = 8;
        break;
      case 'w-infinity-soft-graviton-symmetry-tower':
        this.state.holomorphicDeformationNormH1 = 1.48;
        this.state.externalGravitonMultiplicityN = 10;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const hNorm = this.state.holomorphicDeformationNormH1;
    const nGrav = this.state.externalGravitonMultiplicityN;

    // Penrose-Ward 變換：自對偶外爾曲率 |\Psi_{ABCD}| 正比於 \oint \pi^A \pi^B \pi^C \pi^D h(Z)
    const weyl = 2.85 * hNorm * (1.0 + 0.04 * nGrav);
    this.state.selfDualWeylCurvatureScalar = parseFloat(weyl.toFixed(2));

    // Hodges MHV 引力子散射振幅對數模值 log10 |\langle 1 2 \rangle^8 \det'(\Phi)|
    const mhvLog = 1.45 + 0.36 * nGrav + 1.12 * Math.log10(1.0 + hNorm * 3.5);
    this.state.hodgesMhvAmplitudeLogMod = parseFloat(mhvLog.toFixed(2));

    // w_{1+\infty} 楔形代數沃德恆等式保真度
    const wBoost = this.state.activeRegime === 'w-infinity-soft-graviton-symmetry-tower' ? 0.025 : 0.0;
    const fidelity = Math.min(0.996, 0.89 + 0.08 * Math.exp(-Math.pow(hNorm - 0.95, 2) / 0.8) + wBoost);
    this.state.wInfinityWardIdentityFidelity = parseFloat(fidelity.toFixed(3));

    // 天球全純 OPE 共形指標
    this.state.celestialTwistorOPEIndex = parseFloat((1.2 + 0.65 * hNorm + 0.05 * nGrav).toFixed(2));

    // 生成 16 個射影扭量空間 \mathbb{PT} 全純曲線 \mathbb{CP}^1_x 與正/負螺旋度引力子插入點
    const nodes: ProjectiveTwistorLineNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let hState: '+2-self-dual-graviton' | '-2-anti-self-dual' | 'cp1-holomorphic-line' = '+2-self-dual-graviton';
      if (i === 0 || i === 8) hState = '-2-anti-self-dual';
      else if (i % 3 === 1) hState = 'cp1-holomorphic-line';

      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * (hState === '-2-anti-self-dual' ? -0.32 : 0.38);
      // 全純複結構形變引起黎曼球面截面扭曲
      const deformR = 14.0 * hNorm * Math.sin(angle * 3 + this.state.pulsePhase);
      const baseR = hState === 'cp1-holomorphic-line' ? 52 : 88;
      const r = baseR + deformR;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        helicityState: hState,
        homogeneityWeight: hState === '+2-self-dual-graviton' ? 2 : hState === '-2-anti-self-dual' ? -6 : 0,
        hodgesMinorContribution: parseFloat((0.45 + 0.55 * Math.abs(Math.cos(angle * 2)) * hNorm).toFixed(3)),
        wInfinityModeIndex: (i % 6) + 2
      });
    }
    this.state.twistorNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.75 + (this.state.selfDualWeylCurvatureScalar / 4.5) * 0.72;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerPenroseTwistorSound(): void {
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
      const oscSelfDual = this.audioCtx.createOscillator();
      const oscWInfinity = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscSelfDual.type = 'sine';
      oscWInfinity.type = 'triangle';

      // 自對偶引力子齊次度 +2 與反自對偶 -6 模之全純扭量共鳴
      const fBase = 260 + this.state.holomorphicDeformationNormH1 * 120;
      const fTower = fBase * (1.0 + 0.08 * this.state.externalGravitonMultiplicityN);

      oscSelfDual.frequency.setValueAtTime(fBase, t);
      oscWInfinity.frequency.setValueAtTime(fTower, t);
      oscWInfinity.frequency.exponentialRampToValueAtTime(fBase * 1.5, t + 0.44);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscSelfDual.connect(gain);
      oscWInfinity.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscSelfDual.start(t);
      oscWInfinity.start(t);
      oscSelfDual.stop(t + 0.58);
      oscWInfinity.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in PenroseTwistorSelfDualGravitonEngine:', e);
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

export const penroseTwistorSelfDualGravitonEngine = new PenroseTwistorSelfDualGravitonEngine();
