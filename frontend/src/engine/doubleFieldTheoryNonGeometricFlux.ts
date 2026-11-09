/**
 * 弦論 T-對偶雙場論與非幾何 R-磁通量子時空引擎
 * (String T-Duality Double Field Theory & Non-Geometric R-Flux Quantum Spacetime Engine)
 *
 * 物理原理：
 * 1. 在 Hull-Zwiebach 雙場論 (Double Field Theory, DFT) 中，為了將超弦理論之 O(d,d;\mathbb{Z}) T-對偶對稱性
 *    提升為作用量的顯式規範對稱，時空流形擴展為雙倍維度環面 \mathbb{T}^{2d}，同時包含標準動量座標 x^\mu 與閉弦纏繞座標
 *    (Winding Coordinates) \tilde{x}_\mu，並由廣義度規 \mathcal{H}_{MN}(x, \tilde{x}) 統一描述度規 g_{\mu\nu} 與 Kalb-Ramond B-場。
 * 2. 沿三維環面 \mathbb{T}^3 連續執行 Buscher T-對偶變換將生成著名的「磁通鏈」(T-Duality Flux Chain)：
 *    H_{xyz} (NS-NS 幾何三形式通量) \xrightarrow{T_x} f^x_{yz} (扭曲環面幾何通量) \xrightarrow{T_y} Q_z^{xy}
 *    (全局非幾何 T-摺皺 T-Fold 通量) \xrightarrow{T_z} R^{xyz} (局域非幾何 R-磁通)。
 * 3. 在非幾何 R-磁通背景下，閉弦座標算符違反強截面條件 (Strong Section Condition) 並湧現非結合三元星積代數
 *    (Non-Associative Phase Space): [x^i, x^j, x^k] = \ell_s^4 R^{ijk}，產生最小量子空間體積元 \Delta V_{min} \sim \ell_s^3 \sqrt{|R|}。
 */

export type DoubleFieldTheoryRegime =
  | 'kalb-ramond-h-flux-geometric-torus'
  | 'twisted-torus-metric-f-flux-frame'
  | 'monodromy-t-fold-nongeometric-q-flux'
  | 'locally-nongeometric-nonassociative-r-flux';

export interface DoubledTorusCoordinateNode {
  id: number;
  x: number;
  y: number;
  dualityFrameType: 'momentum-x-sector' | 'winding-tilde-x-sector' | 'nonassociative-r-triad';
  generalizedMetricComponent: number;
  windingModeOccupation: number;
  jacobiatorDefectAmplitude: number;
}

export interface DoubleFieldTheoryFluxState {
  nonGeometricRFluxQuantum: number;       // 非幾何 R-磁通量子數 R^{xyz} \ell_s^2 (0.00 ~ 6.00)
  windingMomentumMixAngleDeg: number;     // O(d,d) 廣義度規動量-纏繞混合角 \theta_{O(d,d)} (deg, 0.0 ~ 90.0)
  jacobiatorNonAssociativity: number;     // 座標三元雅可比子非結合性不變量 |[x^1, x^2, x^3]| / \ell_s^3
  minimumQuantumVolumeLs3: number;        // 非幾何 R-磁通誘導最小三維體積量子 \Delta V_{min} / \ell_s^3
  sectionConditionViolationIndex: number; // 雙場論弱/強截面條件破缺指數 |\partial_M \cdot \partial^M| (0.000 ~ 1.000)
  tDualityBuscherChainStep: number;       // T-對偶鏈階數 (0: H_{xyz}, 1: f^x_{yz}, 2: Q_z^{xy}, 3: R^{xyz})
  activeRegime: DoubleFieldTheoryRegime;
  pulsePhase: number;
  doubledNodes: DoubledTorusCoordinateNode[];
}

const STORAGE_KEY = 'newworld_double_field_theory_flux_state_v1';

export class DoubleFieldTheoryNonGeometricFluxEngine {
  private state: DoubleFieldTheoryFluxState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): DoubleFieldTheoryFluxState {
    const defaults: DoubleFieldTheoryFluxState = {
      nonGeometricRFluxQuantum: 3.20,
      windingMomentumMixAngleDeg: 62.5,
      jacobiatorNonAssociativity: 2.84,
      minimumQuantumVolumeLs3: 1.79,
      sectionConditionViolationIndex: 0.742,
      tDualityBuscherChainStep: 3,
      activeRegime: 'locally-nongeometric-nonassociative-r-flux',
      pulsePhase: 0,
      doubledNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Double Field Theory Flux state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Double Field Theory Flux state:', e);
      }
    }
  }

  public getState(): Readonly<DoubleFieldTheoryFluxState> {
    return this.state;
  }

  public setNonGeometricRFlux(rFlux: number): void {
    this.state.nonGeometricRFluxQuantum = Math.max(0.00, Math.min(6.00, parseFloat(rFlux.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setWindingMomentumMixAngle(angleDeg: number): void {
    this.state.windingMomentumMixAngleDeg = Math.max(0.0, Math.min(90.0, parseFloat(angleDeg.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: DoubleFieldTheoryRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'kalb-ramond-h-flux-geometric-torus':
        this.state.tDualityBuscherChainStep = 0;
        this.state.nonGeometricRFluxQuantum = 0.15;
        this.state.windingMomentumMixAngleDeg = 8.0;
        break;
      case 'twisted-torus-metric-f-flux-frame':
        this.state.tDualityBuscherChainStep = 1;
        this.state.nonGeometricRFluxQuantum = 0.85;
        this.state.windingMomentumMixAngleDeg = 30.0;
        break;
      case 'monodromy-t-fold-nongeometric-q-flux':
        this.state.tDualityBuscherChainStep = 2;
        this.state.nonGeometricRFluxQuantum = 2.10;
        this.state.windingMomentumMixAngleDeg = 52.0;
        break;
      case 'locally-nongeometric-nonassociative-r-flux':
        this.state.tDualityBuscherChainStep = 3;
        this.state.nonGeometricRFluxQuantum = 4.20;
        this.state.windingMomentumMixAngleDeg = 76.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rFlux = this.state.nonGeometricRFluxQuantum;
    const mixRad = (this.state.windingMomentumMixAngleDeg * Math.PI) / 180.0;

    // 決定 T-對偶鏈階數 (0: H, 1: f, 2: Q, 3: R)
    if (this.state.windingMomentumMixAngleDeg < 20) {
      this.state.tDualityBuscherChainStep = 0;
    } else if (this.state.windingMomentumMixAngleDeg < 42) {
      this.state.tDualityBuscherChainStep = 1;
    } else if (this.state.windingMomentumMixAngleDeg < 65) {
      this.state.tDualityBuscherChainStep = 2;
    } else {
      this.state.tDualityBuscherChainStep = 3;
    }

    // 三元雅可比子非結合性不變量 |[x^1, x^2, x^3]| = R^{xyz} \sin(\theta_{O(d,d)})
    const jacobiator = rFlux * (0.35 + 0.65 * Math.sin(mixRad));
    this.state.jacobiatorNonAssociativity = parseFloat(jacobiator.toFixed(2));

    // 最小三維量子空間體積元 \Delta V_{min} / \ell_s^3 = \sqrt{\hbar_{eff} |R^{xyz}|}
    const minVol = Math.sqrt(0.12 + jacobiator * 1.15);
    this.state.minimumQuantumVolumeLs3 = parseFloat(minVol.toFixed(2));

    // 截面條件破缺指數 \partial_x \tilde{\partial}_{\tilde{x}} \ne 0
    const secViol = Math.min(0.992, Math.tanh(0.38 * rFlux * Math.sin(mixRad)));
    this.state.sectionConditionViolationIndex = parseFloat(secViol.toFixed(3));

    // 生成 16 個雙倍環面 \mathbb{T}^{2d} 動量座標 x^\mu 與纏繞座標 \tilde{x}_\mu 對偶節點
    const nodes: DoubledTorusCoordinateNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const sector: 'momentum-x-sector' | 'winding-tilde-x-sector' | 'nonassociative-r-triad' =
        i % 3 === 0 ? 'nonassociative-r-triad' : i % 2 === 0 ? 'momentum-x-sector' : 'winding-tilde-x-sector';

      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * (sector === 'winding-tilde-x-sector' ? -0.36 : 0.32);
      const r = sector === 'momentum-x-sector' ? 50 : sector === 'winding-tilde-x-sector' ? 82 : 98;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        dualityFrameType: sector,
        generalizedMetricComponent: parseFloat((Math.cos(mixRad) + 0.5 * rFlux * Math.sin(mixRad)).toFixed(2)),
        windingModeOccupation: parseFloat((Math.sin(mixRad) * (1.0 + 0.3 * rFlux)).toFixed(2)),
        jacobiatorDefectAmplitude: parseFloat((jacobiator * (0.6 + 0.4 * Math.abs(Math.sin(angle * 3)))).toFixed(2))
      });
    }
    this.state.doubledNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.72 + (this.state.jacobiatorNonAssociativity / 5.0) * 0.76;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerDoubleFieldTheorySound(): void {
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
      const oscMomentum = this.audioCtx.createOscillator();
      const oscWinding = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscMomentum.type = 'sine';
      oscWinding.type = 'triangle';

      // T-對偶互換 (R \leftrightarrow \alpha' / R)：動量模頻率上升時纏繞模頻率成反比下降
      const fCenter = 310;
      const ratio = 1.0 + 0.14 * this.state.nonGeometricRFluxQuantum;

      oscMomentum.frequency.setValueAtTime(fCenter * ratio, t);
      oscMomentum.frequency.exponentialRampToValueAtTime(fCenter / ratio, t + 0.42);

      oscWinding.frequency.setValueAtTime(fCenter / ratio, t);
      oscWinding.frequency.exponentialRampToValueAtTime(fCenter * ratio, t + 0.42);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscMomentum.connect(gain);
      oscWinding.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscMomentum.start(t);
      oscWinding.start(t);
      oscMomentum.stop(t + 0.58);
      oscWinding.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in DoubleFieldTheoryNonGeometricFluxEngine:', e);
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

export const doubleFieldTheoryNonGeometricFluxEngine = new DoubleFieldTheoryNonGeometricFluxEngine();
