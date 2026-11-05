/**
 * 全息張量網路表面/狀態對偶與量子糾錯碼體重構器引擎
 * (Holographic Tensor-Network Surface/State Duality & HaPPY Quantum Error-Correcting Bulk Reconstruction Engine)
 *
 * 物理原理：
 * 1. 根據 Pastawski-Yoshida-Harlow-Preskill (HaPPY) 全息量子糾錯碼與 Almheiri-Dong-Harlow (ADH) 子區域對偶，
 *    龐加萊雙曲圓盤 (Poincaré Disk) 上的 {5,4} 五邊形完美張量 (Perfect Tensor, 6-leg AME state) 鑲嵌網路
 *    定義了從體邏輯量子位元 (Bulk Logical Qubits) 到共形邊界物理量子位元 (Boundary Physical Qubits) 的等距映射 V_{holo}。
 * 2. 對於邊界子區域 A (覆蓋比例 f_A = |A| / |\partial M|)，極小測地線切面 \gamma_A (Ryu-Takayanagi 曲面)
 *    所包圍的「糾纏楔形區」(Entanglement Wedge, W_E(A)) 內之所有體算符 \phi_x，皆可透過貪婪演算法 (Greedy Algorithm)
 *    重構為僅支撐於邊界 A 上的物理算符 O_A，且對邊界補集 A^c 的擦除錯誤 (Erasure Rate p_{erase}) 具備容錯保護。
 * 3. 廣義笠-高柳 (RT/JLMS) 公式：
 *    S(A) = Area(\gamma_A) / (4 G_N) + S_{bulk}(W_E(A))。
 */

export type HolographicQecRegime =
  | 'happy-pentagon-perfect-tensor-code'
  | 'greedy-entanglement-wedge-reconstruction'
  | 'erasure-threshold-phase-transition'
  | 'uberholography-fractal-operator-support';

export interface HyperbolicPentagonTensorNode {
  id: number;
  x: number;
  y: number;
  radialLayer: 0 | 1 | 2;
  insideEntanglementWedge: boolean;
  logicalQubitFidelity: number;
  rtCutBondWeight: number;
}

export interface HolographicQecState {
  boundarySubregionFractionFa: number;    // 邊界保留子區域覆蓋率 f_A = |A| / N_bdy (0.15 ~ 0.95)
  boundaryErasureRatePerase: number;      // 邊界量子通道擦除錯誤率 p_{erase} (0.00 ~ 0.65)
  hyperbolicTessellationDepthL: 2 | 3 | 4; // 雙曲 {5,4} 五邊形鑲嵌層深 L
  wedgeReconstructionFidelity: number;    // 糾纏楔形區體算符重構保真度 F_{Wedge} (0.000 ~ 1.000)
  rtMinimalCutBondCount: number;          // Ryu-Takayanagi 極小測地線切割張量鍵數 |\gamma_A|
  holoEntanglementEntropyBits: number;    // 廣義全息糾纏熵 S(A) (bits)
  logicalEncodingRateKPerN: number;       // 全息邏輯編碼率 k_{bulk} / n_{bdy}
  activeRegime: HolographicQecRegime;
  pulsePhase: number;
  tensorNodes: HyperbolicPentagonTensorNode[];
}

const STORAGE_KEY = 'newworld_holographic_qec_bulk_state_v1';

export class HolographicQuantumErrorCorrectionCodeEngine {
  private state: HolographicQecState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HolographicQecState {
    const defaults: HolographicQecState = {
      boundarySubregionFractionFa: 0.68,
      boundaryErasureRatePerase: 0.14,
      hyperbolicTessellationDepthL: 3,
      wedgeReconstructionFidelity: 0.986,
      rtMinimalCutBondCount: 9,
      holoEntanglementEntropyBits: 24.8,
      logicalEncodingRateKPerN: 0.214,
      activeRegime: 'happy-pentagon-perfect-tensor-code',
      pulsePhase: 0,
      tensorNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Holographic QEC state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Holographic QEC state:', e);
      }
    }
  }

  public getState(): Readonly<HolographicQecState> {
    return this.state;
  }

  public setBoundarySubregionFraction(fa: number): void {
    this.state.boundarySubregionFractionFa = Math.max(0.15, Math.min(0.95, parseFloat(fa.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setBoundaryErasureRate(pErase: number): void {
    this.state.boundaryErasureRatePerase = Math.max(0.00, Math.min(0.65, parseFloat(pErase.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setHyperbolicDepth(depth: 2 | 3 | 4): void {
    this.state.hyperbolicTessellationDepthL = depth === 2 ? 2 : depth === 4 ? 4 : 3;
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HolographicQecRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'happy-pentagon-perfect-tensor-code':
        this.state.boundarySubregionFractionFa = 0.68;
        this.state.boundaryErasureRatePerase = 0.14;
        this.state.hyperbolicTessellationDepthL = 3;
        break;
      case 'greedy-entanglement-wedge-reconstruction':
        this.state.boundarySubregionFractionFa = 0.82;
        this.state.boundaryErasureRatePerase = 0.08;
        this.state.hyperbolicTessellationDepthL = 4;
        break;
      case 'erasure-threshold-phase-transition':
        this.state.boundarySubregionFractionFa = 0.50;
        this.state.boundaryErasureRatePerase = 0.48;
        this.state.hyperbolicTessellationDepthL = 3;
        break;
      case 'uberholography-fractal-operator-support':
        this.state.boundarySubregionFractionFa = 0.62;
        this.state.boundaryErasureRatePerase = 0.22;
        this.state.hyperbolicTessellationDepthL = 4;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const fa = this.state.boundarySubregionFractionFa;
    const pErase = this.state.boundaryErasureRatePerase;
    const depth = this.state.hyperbolicTessellationDepthL;

    // 有效保留邊界比例 f_{eff} = f_A * (1 - p_{erase})
    const fEff = fa * (1.0 - pErase);
    // HaPPY 碼中心體量子位元重構閾值在 f_{eff} ≈ 0.50
    const sigmoidWedge = 1.0 / (1.0 + Math.exp(-(fEff - 0.46) / 0.065));
    const fidelity = Math.max(0.05, Math.min(0.999, sigmoidWedge));
    this.state.wedgeReconstructionFidelity = parseFloat(fidelity.toFixed(3));

    // Ryu-Takayanagi 測地線切割張量鍵數 |\gamma_A| 隨邊界開角 sin(\pi f_A) 與雙曲層深 L 標度
    const sinArc = Math.sin(Math.PI * Math.min(fa, 1.0 - fa * 0.15));
    const rtCut = Math.max(2, Math.round(depth * 3.4 * (0.45 + 0.85 * sinArc)));
    this.state.rtMinimalCutBondCount = rtCut;

    // 廣義全息糾纏熵 S(A) = |\gamma_A| * log2(D_bond) + S_{bulk}
    const sBulk = depth * 1.45 * fidelity;
    const sTotal = rtCut * 2.32 + sBulk;
    this.state.holoEntanglementEntropyBits = parseFloat(sTotal.toFixed(1));

    // 雙曲 {5,4} 鑲嵌之漸近邏輯編碼率 k_{bulk} / n_{bdy}
    const rate = 0.145 + 0.023 * depth;
    this.state.logicalEncodingRateKPerN = parseFloat(rate.toFixed(3));

    // 生成 19 個龐加萊圓盤雙曲 {5,4} 五邊形張量節點 (1 中心 + 6 內環 + 12 外環)
    const nodes: HyperbolicPentagonTensorNode[] = [];

    // 中心體邏輯節點 (r = 0)
    nodes.push({
      id: 0,
      x: 165,
      y: 160,
      radialLayer: 0,
      insideEntanglementWedge: fEff >= 0.48,
      logicalQubitFidelity: this.state.wedgeReconstructionFidelity,
      rtCutBondWeight: parseFloat((rtCut * 0.25).toFixed(2))
    });

    // 內環 6 個雙曲五邊形張量節點
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2.0 * Math.PI + this.state.pulsePhase * 0.18;
      const r = 48;
      const normAngle = ((i / 6) + 1.0) % 1.0;
      const inWedge = normAngle <= fa && pErase < 0.46;

      nodes.push({
        id: i + 1,
        x: parseFloat((165 + r * Math.cos(angle)).toFixed(1)),
        y: parseFloat((160 + r * Math.sin(angle)).toFixed(1)),
        radialLayer: 1,
        insideEntanglementWedge: inWedge,
        logicalQubitFidelity: parseFloat((inWedge ? Math.min(0.995, fidelity * 1.02) : fidelity * 0.45).toFixed(3)),
        rtCutBondWeight: parseFloat((1.2 + 0.6 * Math.cos(angle)).toFixed(2))
      });
    }

    // 外環 UV 共形邊界附近 12 個五邊形張量節點
    for (let j = 0; j < 12; j++) {
      const angle = (j / 12) * 2.0 * Math.PI - this.state.pulsePhase * 0.12;
      const r = 94;
      const normAngle = j / 12;
      const inWedge = normAngle <= fa && (j % 5 !== 0 || pErase < 0.25);

      nodes.push({
        id: j + 7,
        x: parseFloat((165 + r * Math.cos(angle)).toFixed(1)),
        y: parseFloat((160 + r * Math.sin(angle)).toFixed(1)),
        radialLayer: 2,
        insideEntanglementWedge: inWedge,
        logicalQubitFidelity: parseFloat((inWedge ? 0.96 : 0.28).toFixed(3)),
        rtCutBondWeight: parseFloat((1.8 + 0.5 * Math.sin(angle)).toFixed(2))
      });
    }

    this.state.tensorNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.65 + this.state.wedgeReconstructionFidelity * 0.65;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerHolographicQecSound(): void {
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
      const oscBulk = this.audioCtx.createOscillator();
      const oscBoundary = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscBulk.type = 'sine';
      oscBoundary.type = 'triangle';

      // 五邊形 {5,4} 雙曲完美張量五度音程全息共鳴
      const fBulk = 280 + this.state.wedgeReconstructionFidelity * 240;
      const fBdy = fBulk * 1.5;

      oscBulk.frequency.setValueAtTime(fBulk, t);
      oscBulk.frequency.exponentialRampToValueAtTime(fBulk * 1.25, t + 0.38);

      oscBoundary.frequency.setValueAtTime(fBdy, t);
      oscBoundary.frequency.exponentialRampToValueAtTime(fBdy * 0.85, t + 0.38);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscBulk.connect(gain);
      oscBoundary.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscBulk.start(t);
      oscBoundary.start(t);
      oscBulk.stop(t + 0.57);
      oscBoundary.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicQuantumErrorCorrectionCodeEngine:', e);
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

export const holographicQuantumErrorCorrectionCodeEngine = new HolographicQuantumErrorCorrectionCodeEngine();
