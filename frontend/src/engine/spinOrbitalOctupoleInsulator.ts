/**
 * 非阿貝爾量子自旋軌道液體與四極矩拓撲八極子絕緣體引擎
 * (Non-Abelian Spin-Orbital Liquid & Quadrupolar Topological Octupole Insulator Engine)
 *
 * 物理原理：
 * 1. 在具有自旋 S=1/2 與簡併 d 軌道贗自旋 τ=1/2 的過渡金屬氧化物中，Kugel-Khomskii 超交換作用
 *    H_KK = J_SO ∑ (S_i·S_j + 1/4)(τ_i·τ_j + 1/4) 使自旋與軌道自由度深度糾纏為 SU(4) 非阿貝爾自旋-軌道液體 (Spin-Orbital Liquid)。
 * 2. 當三維立方晶格的每個晶胞面嵌入規範 π-磁通 (π-Flux Plaquette) 並具有交錯躍遷比 λ/γ > 1 時，
 *    系統進入三階拓撲絕緣體——Benalcazar-Bernevig-Hughes (BBH) 拓撲八極子絕緣體相 (Topological Octupole Insulator)。
 * 3. 體偶極矩 p_i = 0 且體四極矩 q_ij = 0，唯獨體拓撲八極矩量子化為 q_xyz = e/2 (mod e)，
 *    在三維立方體的 8 個頂角上保護分數化頂角電荷 Q_corner = ±e/2 與非阿貝爾自旋-軌道激發態 (Spin-Orbitalons)。
 */

export type SpinOrbitalOctupoleRegime =
  | 'trivial-dipolar-mott-insulator'
  | 'quadrupolar-hinge-semimetal'
  | 'bbh-quantized-octupole-corner'
  | 'su4-non-abelian-spin-orbital-liquid';

export interface OctupoleCornerVertex {
  id: number;
  x: number;
  y: number;
  z: number;
  fractionalChargeE: number;
  spinOrbitalEntanglement: number;
  octupoleSign: number;
}

export interface SpinOrbitalOctupoleState {
  intercellHoppingRatioLambda: number;// 晶胞間/晶胞內躍遷比 λ/γ (0.3 ~ 3.5)
  kugelKhomskiiCouplingJso: number;   // Kugel-Khomskii 自旋軌道耦合 J_SO (meV, 2.0 ~ 60.0)
  plaquettePiFluxRatio: number;       // 晶格面規範磁通比 Φ/π (0.10 ~ 1.00)
  quantizedOctupoleIndexQxyz: number; // 拓撲八極矩不變量 q_xyz / e (0 或 0.5)
  cornerFractionalChargeE: number;    // 頂角分數化累積電荷 |Q_corner| (e)
  su4SpinOrbitalGapMev: number;       // SU(4) 自旋-軌道糾纏能隙 Δ_SO (meV)
  activeRegime: SpinOrbitalOctupoleRegime;
  pulsePhase: number;
  cornerVertices: OctupoleCornerVertex[];
}

const STORAGE_KEY = 'newworld_spin_orbital_octupole_state_v1';

export class SpinOrbitalOctupoleInsulatorEngine {
  private state: SpinOrbitalOctupoleState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): SpinOrbitalOctupoleState {
    const defaults: SpinOrbitalOctupoleState = {
      intercellHoppingRatioLambda: 2.1,
      kugelKhomskiiCouplingJso: 28.0,
      plaquettePiFluxRatio: 1.0,
      quantizedOctupoleIndexQxyz: 0.5,
      cornerFractionalChargeE: 0.49,
      su4SpinOrbitalGapMev: 19.6,
      activeRegime: 'bbh-quantized-octupole-corner',
      pulsePhase: 0,
      cornerVertices: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Spin-Orbital Octupole state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Spin-Orbital Octupole state:', e);
      }
    }
  }

  public getState(): Readonly<SpinOrbitalOctupoleState> {
    return this.state;
  }

  public setHoppingRatioLambda(ratio: number): void {
    this.state.intercellHoppingRatioLambda = Math.max(0.3, Math.min(3.5, parseFloat(ratio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setKugelKhomskiiCoupling(jso: number): void {
    this.state.kugelKhomskiiCouplingJso = Math.max(2.0, Math.min(60.0, parseFloat(jso.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setPlaquettePiFlux(fluxRatio: number): void {
    this.state.plaquettePiFluxRatio = Math.max(0.1, Math.min(1.0, parseFloat(fluxRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: SpinOrbitalOctupoleRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'trivial-dipolar-mott-insulator':
        this.state.intercellHoppingRatioLambda = 0.55;
        this.state.kugelKhomskiiCouplingJso = 6.0;
        this.state.plaquettePiFluxRatio = 0.25;
        break;
      case 'quadrupolar-hinge-semimetal':
        this.state.intercellHoppingRatioLambda = 1.15;
        this.state.kugelKhomskiiCouplingJso = 18.0;
        this.state.plaquettePiFluxRatio = 0.65;
        break;
      case 'bbh-quantized-octupole-corner':
        this.state.intercellHoppingRatioLambda = 2.25;
        this.state.kugelKhomskiiCouplingJso = 32.0;
        this.state.plaquettePiFluxRatio = 1.00;
        break;
      case 'su4-non-abelian-spin-orbital-liquid':
        this.state.intercellHoppingRatioLambda = 3.20;
        this.state.kugelKhomskiiCouplingJso = 54.0;
        this.state.plaquettePiFluxRatio = 1.00;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const lambda = this.state.intercellHoppingRatioLambda;
    const jso = this.state.kugelKhomskiiCouplingJso;
    const flux = this.state.plaquettePiFluxRatio;

    // 當 λ/γ > 1.0 且 Φ/π >= 0.5 時，拓撲八極矩量子化為 q_xyz = 0.5 e
    const isTopologicalOctupole = lambda > 1.0 && flux >= 0.5;
    this.state.quantizedOctupoleIndexQxyz = isTopologicalOctupole ? 0.5 : 0.0;

    // 頂角分數化累積電荷 |Q_corner| 趨近 0.5 e
    const qCorner = isTopologicalOctupole
      ? 0.5 * Math.tanh((lambda - 0.8) * 1.6) * Math.sin((flux * Math.PI) / 2.0)
      : 0.08 * lambda * flux;
    this.state.cornerFractionalChargeE = parseFloat(Math.min(0.5, qCorner).toFixed(3));

    // SU(4) 自旋-軌道糾纏能隙 Δ_SO (meV)
    const gapSo = 0.58 * jso * Math.sqrt(lambda) * (0.4 + 0.6 * flux);
    this.state.su4SpinOrbitalGapMev = parseFloat(gapSo.toFixed(1));

    // 生成三維 BBH 立方體的 8 個頂角 + 4 個中心內核軌道糾纏節點 (共 12 個頂點)
    const cubeSigns = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];

    const vertices: OctupoleCornerVertex[] = [];
    const rot = this.state.pulsePhase * 0.45;
    const halfSize = 68;

    for (let i = 0; i < 8; i++) {
      const [sx, sy, sz] = cubeSigns[i];
      const x0 = sx * halfSize;
      const y0 = sy * halfSize;
      const z0 = sz * halfSize;

      // 繞 Y 軸與 X 軸微幅三維旋轉投影
      const rx = x0 * Math.cos(rot) - z0 * Math.sin(rot);
      const rz = x0 * Math.sin(rot) + z0 * Math.cos(rot);
      const projX = 165 + rx + rz * 0.28;
      const projY = 160 + y0 + rz * 0.22;

      const octSign = sx * sy * sz;
      vertices.push({
        id: i,
        x: parseFloat(projX.toFixed(1)),
        y: parseFloat(projY.toFixed(1)),
        z: parseFloat(rz.toFixed(1)),
        fractionalChargeE: parseFloat((octSign * this.state.cornerFractionalChargeE).toFixed(3)),
        spinOrbitalEntanglement: parseFloat((0.6 + 0.35 * Math.sin(this.state.pulsePhase + i)).toFixed(2)),
        octupoleSign: octSign
      });
    }

    this.state.cornerVertices = vertices;
  }

  public update(dtSeconds: number): void {
    const speed = 1.0 + this.state.kugelKhomskiiCouplingJso / 30.0;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerOctupoleSound(): void {
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

      const base = this.state.quantizedOctupoleIndexQxyz > 0 ? 384 : 256;
      const target = base + this.state.kugelKhomskiiCouplingJso * 6.5;

      osc1.frequency.setValueAtTime(base, t);
      osc1.frequency.exponentialRampToValueAtTime(target, t + 0.32);

      osc2.frequency.setValueAtTime(base * 2, t);
      osc2.frequency.exponentialRampToValueAtTime(target * 1.5, t + 0.32);

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
      console.warn('Web Audio playback failed in SpinOrbitalOctupoleInsulatorEngine:', e);
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

export const spinOrbitalOctupoleInsulatorEngine = new SpinOrbitalOctupoleInsulatorEngine();
