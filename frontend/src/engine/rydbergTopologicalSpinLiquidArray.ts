/**
 * 里德堡光鑷陣列非阿貝爾拓撲自旋液體與共振價鍵干涉儀引擎
 * (Rydberg Optical Tweezer Array Non-Abelian Topological Spin Liquid & RVB Dimer Interferometer Engine)
 *
 * 物理原理：
 * 1. 在紅寶石晶格 (Ruby Lattice) 或籠目對偶晶格上排列的中性原子光鑷陣列，透過雷射激發至高主量子數里德堡態 |r⟩，
 *    凡得瓦交互作用 V(R) = C_6 / R^6 產生里德堡阻塞半徑 R_b = (C_6 / ℏΩ)^(1/6)。當 1.5 < R_b / a < 1.85 時，
 *    阻塞條件嚴格限制每個頂點僅能連接單一里德堡激發，湧現量子共振價鍵 (Resonating Valence Bond, RVB) 二聚體拓撲自旋液體。
 * 2. 拓撲序由非局域封閉威爾森弦算符 ⟨W_Z(C)⟩ (度量二聚體奇偶不變量) 與開放 't Hooft 弦算符 ⟨T_X(L)⟩ (創建並移動磁通子 Vison 準粒子)
 *    共同刻畫，並透過 Fredenhagen-Marcu 非局域拓撲序參量 O_FM 嚴格區分量子自旋液體與平庸順磁相。
 * 3. 在絕熱失諧掃描 Δ/Ω 下，移動式光鑷可對分數化任意子 (Semions / Non-Abelian Anyons) 進行實空間編織並讀出拓撲貝里相位。
 */

export type RydbergSpinLiquidRegime =
  | 'disordered-paramagnetic-monomer'
  | 'valence-bond-solid-crystal'
  | 'z2-rvb-topological-spin-liquid'
  | 'non-abelian-vison-braiding-liquid';

export interface RydbergDimerLinkNode {
  id: number;
  x: number;
  y: number;
  blockadeRadiusNorm: number;
  dimerOccupationProb: number;
  visonParityCharge: number; // +1 or -1
  rvbCoherencePhase: number;
}

export interface RydbergTopologicalSpinLiquidState {
  blockadeRatioRbOverA: number;        // 里德堡阻塞比 R_b / a (1.10 ~ 2.40)
  normalizedDetuningDeltaOmega: number;// 歸一化雷射失諧 Δ / Ω (-1.0 ~ 4.5)
  rabiFrequencyMhz: number;            // 里德堡拉比頻率 Ω / 2π (MHz, 0.5 ~ 12.0)
  fredenhagenMarcuOrder: number;       // Fredenhagen-Marcu 拓撲序參量 O_FM (0 ~ 1)
  wilsonLoopParityExpectation: number; // 封閉威爾森迴路期望值 ⟨W_Z⟩ (0 ~ 1)
  topologicalEntanglementGamma: number;// 拓撲糾纏熵 γ_top (ln 2 單位)
  activeRegime: RydbergSpinLiquidRegime;
  pulsePhase: number;
  dimerNodes: RydbergDimerLinkNode[];
}

const STORAGE_KEY = 'newworld_rydberg_topological_spin_liquid_state_v1';

export class RydbergTopologicalSpinLiquidArrayEngine {
  private state: RydbergTopologicalSpinLiquidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): RydbergTopologicalSpinLiquidState {
    const defaults: RydbergTopologicalSpinLiquidState = {
      blockadeRatioRbOverA: 1.68,
      normalizedDetuningDeltaOmega: 1.85,
      rabiFrequencyMhz: 4.2,
      fredenhagenMarcuOrder: 0.84,
      wilsonLoopParityExpectation: 0.79,
      topologicalEntanglementGamma: 0.96,
      activeRegime: 'z2-rvb-topological-spin-liquid',
      pulsePhase: 0,
      dimerNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Rydberg Spin Liquid state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Rydberg Spin Liquid state:', e);
      }
    }
  }

  public getState(): Readonly<RydbergTopologicalSpinLiquidState> {
    return this.state;
  }

  public setBlockadeRatio(rbOverA: number): void {
    this.state.blockadeRatioRbOverA = Math.max(1.10, Math.min(2.40, parseFloat(rbOverA.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setNormalizedDetuning(deltaOmega: number): void {
    this.state.normalizedDetuningDeltaOmega = Math.max(-1.0, Math.min(4.5, parseFloat(deltaOmega.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRabiFrequency(omegaMhz: number): void {
    this.state.rabiFrequencyMhz = Math.max(0.5, Math.min(12.0, parseFloat(omegaMhz.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: RydbergSpinLiquidRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'disordered-paramagnetic-monomer':
        this.state.blockadeRatioRbOverA = 1.18;
        this.state.normalizedDetuningDeltaOmega = -0.4;
        this.state.rabiFrequencyMhz = 2.0;
        break;
      case 'valence-bond-solid-crystal':
        this.state.blockadeRatioRbOverA = 2.15;
        this.state.normalizedDetuningDeltaOmega = 3.6;
        this.state.rabiFrequencyMhz = 3.5;
        break;
      case 'z2-rvb-topological-spin-liquid':
        this.state.blockadeRatioRbOverA = 1.68;
        this.state.normalizedDetuningDeltaOmega = 1.85;
        this.state.rabiFrequencyMhz = 5.0;
        break;
      case 'non-abelian-vison-braiding-liquid':
        this.state.blockadeRatioRbOverA = 1.76;
        this.state.normalizedDetuningDeltaOmega = 2.35;
        this.state.rabiFrequencyMhz = 9.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rb = this.state.blockadeRatioRbOverA;
    const det = this.state.normalizedDetuningDeltaOmega;
    const omega = this.state.rabiFrequencyMhz;

    // 紅寶石晶格 QSL 窗口中心在 R_b/a ≈ 1.70, Δ/Ω ≈ 2.0
    const windowFactorRb = Math.exp(-Math.pow((rb - 1.72) / 0.36, 2));
    const windowFactorDet = det > 0.4 ? Math.exp(-Math.pow((det - 2.1) / 1.45, 2)) : 0.12;
    const rabiCoherence = 0.55 + 0.45 * Math.tanh(omega / 6.0);

    // Fredenhagen-Marcu 拓撲序參量 O_FM
    const fmOrder = Math.min(0.98, 0.10 + 0.86 * windowFactorRb * windowFactorDet * rabiCoherence);
    this.state.fredenhagenMarcuOrder = parseFloat(fmOrder.toFixed(2));

    // 封閉威爾森迴路期望值 ⟨W_Z⟩
    const wilsonZ = Math.min(0.97, 0.14 + 0.80 * windowFactorRb * (0.5 + 0.5 * Math.tanh(det / 1.8)));
    this.state.wilsonLoopParityExpectation = parseFloat(wilsonZ.toFixed(2));

    // 拓撲糾纏熵 γ_top (以 ln 2 為基準，Z2 自旋液體 γ = 1.0, 非阿貝爾相可達 1.5)
    const nonAbelianBoost = this.state.activeRegime === 'non-abelian-vison-braiding-liquid' ? 1.45 : 1.05;
    const gammaTop = parseFloat((fmOrder * nonAbelianBoost).toFixed(2));
    this.state.topologicalEntanglementGamma = gammaTop;

    // 生成 18 個紅寶石/籠目晶格里德堡光鑷二聚體鍵節點
    const nodes: RydbergDimerLinkNode[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const ring = i < 6 ? 46 : i < 12 ? 82 : 114;
      const idxInRing = i % 6;
      const angle = (idxInRing / 6) * 2 * Math.PI + (i >= 6 ? Math.PI / 6 : 0) + this.state.pulsePhase * 0.2;

      const x = 165 + ring * Math.cos(angle) + 4 * Math.sin(this.state.pulsePhase + i);
      const y = 160 + ring * Math.sin(angle) + 4 * Math.cos(this.state.pulsePhase + i);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        blockadeRadiusNorm: parseFloat((rb * 14).toFixed(1)),
        dimerOccupationProb: parseFloat((0.22 + 0.68 * fmOrder * (0.7 + 0.3 * Math.cos(this.state.pulsePhase + i))).toFixed(2)),
        visonParityCharge: i % 3 === 0 ? -1 : 1,
        rvbCoherencePhase: parseFloat(((angle + this.state.pulsePhase) % (2 * Math.PI)).toFixed(2))
      });
    }
    this.state.dimerNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + this.state.rabiFrequencyMhz * 0.18;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerRydbergArraySound(): void {
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

      const fBase = 340 + this.state.blockadeRatioRbOverA * 120;
      const fTarget = fBase + this.state.rabiFrequencyMhz * 32;

      osc1.frequency.setValueAtTime(fBase, t);
      osc1.frequency.exponentialRampToValueAtTime(fTarget, t + 0.35);

      osc2.frequency.setValueAtTime(fBase * 1.414, t);
      osc2.frequency.exponentialRampToValueAtTime(fTarget * 1.414, t + 0.35);

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
      console.warn('Web Audio playback failed in RydbergTopologicalSpinLiquidArrayEngine:', e);
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

export const rydbergTopologicalSpinLiquidArrayEngine = new RydbergTopologicalSpinLiquidArrayEngine();
