/**
 * 非阿貝爾拓撲聲子準晶與高維超空間相子泵浦聲學二極體引擎
 * (Non-Abelian Topological Phonon Quasicrystal & Higher-Dimensional Superspace Phason-Pump Acoustic Diode Engine)
 *
 * 物理原理：
 * 1. 根據 कट-與-投影 (Cut-and-Project) 幾何理論，五重對稱彭羅斯 (Penrose) 或八重對稱 Ammann-Beenker 聲子準晶
 *    可視為高維週期超空間晶格 (4D/5D/6D Superspace Lattice) 在物理平行空間 E_∥ 的非公度無理數截面投影
 *    (黃金比例 τ = (1+√5)/2 ≈ 1.618)。
 * 2. 正交垂直超空間 E_⊥ 中的連續平移自由度對應於準晶特有的「相子模」(Phason Mode, 相子滑移相位 φ_{phason})；
 *    絕熱驅動相子相位 φ_{phason}(t) 等效於高維量子霍爾絕緣體中的 Thouless 拓撲電荷泵浦，由高維第二陳數 C₂ ∈ ℤ 保護，
 *    在無需布洛赫平移對稱性的情況下驅動單向無背向散射之手性邊界聲子流。
 * 3. 結合聲學克爾非線性與非互易相子規範場，實現超高正向/反向聲隔離度 ISO_{dB} > 40 dB 的拓撲聲學二極體。
 */

export type QuasicrystalPhononRegime =
  | 'Fibonacci-1d-phason-pump-chain'
  | 'penrose-5fold-superspace-c2-insulator'
  | 'ammann-beenker-8fold-chiral-edge'
  | 'non-abelian-acoustic-diode-isolator';

export interface PenroseSuperspaceTileNode {
  id: number;
  x: number;
  y: number;
  rotationalSymmetryFold: 5 | 8 | 10;
  phasonFlipAmplitude: number;
  superspaceChernC2: number;
  unidirectionalEdgeFlux: number;
}

export interface QuasicrystalPhononDiodeState {
  phasonPumpPhasePi: number;            // 正交超空間相子泵浦相位 φ_⊥ / π (0.00 ~ 2.00)
  superspaceSecondChernC2: number;      // 高維超空間第二陳數 |C₂| (1 ~ 6)
  goldenRatioApproximantOrder: number;  // 黃金分割無理數逼近階數 F_n / F_{n-1} → τ ≈ 1.618 (3 ~ 12)
  fractalBandgapWidthKhz: number;       // 霍夫施塔特碎形聲子能隙寬度 Δf_{gap} (kHz)
  acousticDiodeIsolationDb: number;     // 拓撲聲學二極體正反向隔離度 ISO (dB)
  phasonBoundaryVelocityMs: number;     // 手性相子-聲子邊界群速度 v_{edge} (m/s)
  activeRegime: QuasicrystalPhononRegime;
  pulsePhase: number;
  tileNodes: PenroseSuperspaceTileNode[];
}

const STORAGE_KEY = 'newworld_quasicrystal_phonon_diode_state_v1';

export class QuasicrystalTopologicalPhononDiodeEngine {
  private state: QuasicrystalPhononDiodeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): QuasicrystalPhononDiodeState {
    const defaults: QuasicrystalPhononDiodeState = {
      phasonPumpPhasePi: 0.62,
      superspaceSecondChernC2: 2,
      goldenRatioApproximantOrder: 8,
      fractalBandgapWidthKhz: 38.4,
      acousticDiodeIsolationDb: 44.2,
      phasonBoundaryVelocityMs: 685.0,
      activeRegime: 'penrose-5fold-superspace-c2-insulator',
      pulsePhase: 0,
      tileNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Quasicrystal Phonon Diode state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Quasicrystal Phonon Diode state:', e);
      }
    }
  }

  public getState(): Readonly<QuasicrystalPhononDiodeState> {
    return this.state;
  }

  public setPhasonPumpPhase(phasePi: number): void {
    this.state.phasonPumpPhasePi = Math.max(0.00, Math.min(2.00, parseFloat(phasePi.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setSuperspaceSecondChern(c2: number): void {
    this.state.superspaceSecondChernC2 = Math.max(1, Math.min(6, Math.round(c2)));
    this.recomputePhysics();
    this.saveState();
  }

  public setApproximantOrder(order: number): void {
    this.state.goldenRatioApproximantOrder = Math.max(3, Math.min(12, Math.round(order)));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: QuasicrystalPhononRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'Fibonacci-1d-phason-pump-chain':
        this.state.superspaceSecondChernC2 = 1;
        this.state.phasonPumpPhasePi = 0.38;
        this.state.goldenRatioApproximantOrder = 5;
        break;
      case 'penrose-5fold-superspace-c2-insulator':
        this.state.superspaceSecondChernC2 = 2;
        this.state.phasonPumpPhasePi = 0.62;
        this.state.goldenRatioApproximantOrder = 8;
        break;
      case 'ammann-beenker-8fold-chiral-edge':
        this.state.superspaceSecondChernC2 = 4;
        this.state.phasonPumpPhasePi = 1.24;
        this.state.goldenRatioApproximantOrder = 10;
        break;
      case 'non-abelian-acoustic-diode-isolator':
        this.state.superspaceSecondChernC2 = 6;
        this.state.phasonPumpPhasePi = 1.62;
        this.state.goldenRatioApproximantOrder = 12;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const phiPi = this.state.phasonPumpPhasePi;
    const c2 = this.state.superspaceSecondChernC2;
    const order = this.state.goldenRatioApproximantOrder;
    const tau = (1.0 + Math.sqrt(5.0)) / 2.0;

    // 霍夫施塔特碎形主能隙寬度 Δf_{gap} (kHz)
    const gapKhz = 12.5 * c2 * (0.7 + 0.3 * Math.sin(phiPi * Math.PI * 0.5)) * (order / 8.0);
    this.state.fractalBandgapWidthKhz = parseFloat(gapKhz.toFixed(1));

    // 拓撲聲學二極體正反向隔離度 ISO (dB)
    const isoDb = 18.0 + 9.2 * c2 + 1.8 * order + 4.5 * Math.abs(Math.sin(phiPi * Math.PI));
    this.state.acousticDiodeIsolationDb = parseFloat(isoDb.toFixed(1));

    // 手性相子-聲子邊界群速度 v_{edge} (m/s)
    const vEdge = 343.0 * (1.0 + 0.32 * c2 * (tau - 1.0) + 0.08 * phiPi);
    this.state.phasonBoundaryVelocityMs = parseFloat(vEdge.toFixed(1));

    // 生成 15 個五重/八重彭羅斯超空間投影聲子準晶格點
    const nodes: PenroseSuperspaceTileNode[] = [];
    const count = 15;
    const symFold: 5 | 8 | 10 = this.state.activeRegime === 'ammann-beenker-8fold-chiral-edge' ? 8 : 5;
    for (let i = 0; i < count; i++) {
      const ring = i < 5 ? 46 : i < 10 ? 46 * tau : 46 * tau * 1.32;
      const idx = i % 5;
      const ringOffset = i >= 5 && i < 10 ? Math.PI / 5.0 : 0.0;
      const angle = (idx / 5) * 2.0 * Math.PI + ringOffset + this.state.pulsePhase * 0.24;

      const x = 165 + ring * Math.cos(angle);
      const y = 160 + ring * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        rotationalSymmetryFold: symFold,
        phasonFlipAmplitude: parseFloat((0.35 + 0.45 * Math.abs(Math.cos(phiPi * Math.PI + i))).toFixed(2)),
        superspaceChernC2: c2,
        unidirectionalEdgeFlux: parseFloat((0.4 + 0.1 * c2).toFixed(2))
      });
    }
    this.state.tileNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + this.state.superspaceSecondChernC2 * 0.22;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerQuasicrystalPhononSound(): void {
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
      const oscTau1 = this.audioCtx.createOscillator();
      const oscTau2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscTau1.type = 'sine';
      oscTau2.type = 'triangle';

      // 黃金分割比 τ = 1.6180339887 非公度準晶雙頻諧音
      const tau = 1.6180339887;
      const fBase = 280 + this.state.superspaceSecondChernC2 * 45;

      oscTau1.frequency.setValueAtTime(fBase, t);
      oscTau1.frequency.exponentialRampToValueAtTime(fBase * 1.25, t + 0.34);

      oscTau2.frequency.setValueAtTime(fBase * tau, t);
      oscTau2.frequency.exponentialRampToValueAtTime(fBase * tau * 1.25, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscTau1.connect(gain);
      oscTau2.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscTau1.start(t);
      oscTau2.start(t);
      oscTau1.stop(t + 0.57);
      oscTau2.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in QuasicrystalTopologicalPhononDiodeEngine:', e);
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

export const quasicrystalTopologicalPhononDiodeEngine = new QuasicrystalTopologicalPhononDiodeEngine();
