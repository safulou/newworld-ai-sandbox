/**
 * 量子極化拓撲光子晶格引擎 (Quantum Polariton Topological Photonic Lattice Engine)
 * 
 * 物理原理：
 * 1. 在半導體微腔（例如 GaAs/AlGaAs 量子阱）中，光子與激子強耦合雜化形成具有微小有效質量
 *    與強非線性庫侖相互作用的微觀玻色準粒子——激子-極化激元 (Exciton-Polariton)。
 * 2. 在籠目 (Kagome) 或蜂窩超晶格中，微腔光子 TE-TM 自旋軌道有效磁場裂分 (Δ_LT) 破缺時間對稱性，
 *    開啟非平庸拓撲帶隙，並湧現動量空間色散嚴格為零的拓撲「平帶」(Flat Band, v_g = ∇_k E_k = 0)。
 * 3. 伴隨光學量子自旋霍爾效應 (Photonic Spin Hall Effect)，自旋向上與自旋向下極化激元沿邊緣反向無耗散傳輸。
 * 4. 當非相干光學泵浦超越臨界閾值 (P > P_th) 時，非平衡玻色-愛因斯坦凝聚態自發定域於平帶緊束縛態，
 *    激發高相干度拓撲單模雷射 (Topological Polariton Laser)，免受晶格微觀無序散射干擾。
 */

export type PolaritonLatticeRegime = 
  | 'linear-photonic-kagome'
  | 'polariton-spin-hall'
  | 'chiral-edge-soliton'
  | 'flatband-condensation-laser';

export interface PolaritonNode {
  id: number;
  x: number;
  y: number;
  intensity: number;
  spinPseudospinRad: number;
  isFlatBandLocked: boolean;
}

export interface PolaritonLatticeState {
  cavityDetuningDelta: number;     // 激子-光子失諧量 δ (meV, -10.0 ~ 10.0)
  pumpPowerRatioP: number;         // 光泵浦功率 P/P_th (0.1 ~ 5.0)
  teTmSplittingDeltaLt: number;    // TE-TM 自旋軌道裂分 Δ_LT (meV, 0.5 ~ 5.0)
  kagomeHoppingJ: number;          // 籠目晶格躍遷常數 J (meV, 1.0 ~ 10.0)
  polaritonLasingCoherence: number;// 凝聚雷射相干度 (0.0 ~ 1.0)
  chiralEdgeCurrent: number;       // 手性邊緣流強度 (0.0 ~ 1.0)
  flatbandDispersionSlope: number; // 平帶色散斜率 (接近 0 表明完美平帶)
  activeRegime: PolaritonLatticeRegime;
  pulsePhase: number;
  nodes: PolaritonNode[];
}

const STORAGE_KEY = 'newworld_quantum_polariton_lattice_state_v1';

export class QuantumPolaritonTopologicalLatticeEngine {
  private state: PolaritonLatticeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): PolaritonLatticeState {
    const defaults: PolaritonLatticeState = {
      cavityDetuningDelta: 0.5,
      pumpPowerRatioP: 2.4,
      teTmSplittingDeltaLt: 2.8,
      kagomeHoppingJ: 5.5,
      polaritonLasingCoherence: 0.88,
      chiralEdgeCurrent: 0.76,
      flatbandDispersionSlope: 0.04,
      activeRegime: 'flatband-condensation-laser',
      pulsePhase: 0,
      nodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Polariton Lattice state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Polariton Lattice state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<PolaritonLatticeState> {
    return this.state;
  }

  public setCavityDetuning(delta: number): void {
    this.state.cavityDetuningDelta = Math.max(-10.0, Math.min(10.0, delta));
    this.recomputePhysics();
    this.saveState();
  }

  public setPumpPowerRatio(ratio: number): void {
    this.state.pumpPowerRatioP = Math.max(0.1, Math.min(5.0, ratio));
    this.recomputePhysics();
    this.saveState();
  }

  public setTeTmSplitting(lt: number): void {
    this.state.teTmSplittingDeltaLt = Math.max(0.5, Math.min(5.0, lt));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: PolaritonLatticeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'linear-photonic-kagome':
        this.state.pumpPowerRatioP = 0.4;
        this.state.teTmSplittingDeltaLt = 0.8;
        this.state.cavityDetuningDelta = -5.0;
        break;
      case 'polariton-spin-hall':
        this.state.pumpPowerRatioP = 1.2;
        this.state.teTmSplittingDeltaLt = 3.5;
        this.state.cavityDetuningDelta = -1.0;
        break;
      case 'chiral-edge-soliton':
        this.state.pumpPowerRatioP = 2.8;
        this.state.teTmSplittingDeltaLt = 2.5;
        this.state.cavityDetuningDelta = 1.5;
        break;
      case 'flatband-condensation-laser':
        this.state.pumpPowerRatioP = 4.2;
        this.state.teTmSplittingDeltaLt = 4.5;
        this.state.cavityDetuningDelta = 0.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const delta = this.state.cavityDetuningDelta;
    const p = this.state.pumpPowerRatioP;
    const lt = this.state.teTmSplittingDeltaLt;

    // 雷射相干度 C = tanh(1.5 * (P - 1.0)) * (1 - 0.04 * |delta|)
    const coh = Math.tanh(1.5 * Math.max(0, p - 0.9)) * Math.max(0.1, 1 - 0.04 * Math.abs(delta));
    this.state.polaritonLasingCoherence = parseFloat(Math.min(0.99, Math.max(0.05, coh)).toFixed(3));

    // 手性邊緣流 I_edge = (lt / 5.0) * tanh(p)
    const edge = (lt / 5.0) * Math.tanh(p);
    this.state.chiralEdgeCurrent = parseFloat(Math.min(0.98, Math.max(0.02, edge)).toFixed(3));

    // 平帶色散斜率 S = 0.02 + 0.15 * exp(-lt)
    const slope = 0.02 + 0.15 * Math.exp(-lt * 0.8);
    this.state.flatbandDispersionSlope = parseFloat(slope.toFixed(3));

    // 生成 12 個 Kagome 晶格幾何頂點 (環狀與星形分佈)
    const nodes: PolaritonNode[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const isInner = (i % 2 === 0);
      const rad = isInner ? 55 : 95;
      const cx = 150 + rad * Math.cos(angle);
      const cy = 150 + rad * Math.sin(angle);
      
      const dyn = Math.sin(this.state.pulsePhase * 3.0 + i);
      const nodeInt = (p / 5.0) * 0.7 + (isInner ? 0.25 : 0.1) + dyn * 0.15;
      const spinTheta = (i * Math.PI) / 6 + this.state.pulsePhase * (lt / 3.0);

      nodes.push({
        id: i,
        x: parseFloat(cx.toFixed(1)),
        y: parseFloat(cy.toFixed(1)),
        intensity: parseFloat(Math.min(1.0, Math.max(0.05, nodeInt)).toFixed(2)),
        spinPseudospinRad: parseFloat(spinTheta.toFixed(2)),
        isFlatBandLocked: isInner
      });
    }
    this.state.nodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 1.0 + this.state.pumpPowerRatioP * 0.8;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerLaserSound(): void {
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
      osc2.type = 'sine';

      const baseFreq = 523.25; // C5
      const octaveFreq = 1046.5; // C6

      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.linearRampToValueAtTime(baseFreq * 1.05, t + 0.2);
      osc1.frequency.linearRampToValueAtTime(baseFreq, t + 0.45);

      osc2.frequency.setValueAtTime(octaveFreq, t);
      osc2.frequency.linearRampToValueAtTime(octaveFreq * 1.05, t + 0.2);
      osc2.frequency.linearRampToValueAtTime(octaveFreq, t + 0.45);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.52);
      osc2.stop(t + 0.52);
    } catch (e) {
      console.warn('Web Audio playback failed in PolaritonLatticeEngine:', e);
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

export const quantumPolaritonTopologicalLatticeEngine = new QuantumPolaritonTopologicalLatticeEngine();
