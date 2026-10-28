/**
 * 因果動力學三角剖分量子時空相變與四維德西特湧現引擎
 * (Causal Dynamical Triangulations Quantum Spacetime Phase Transition & 4D de Sitter Emergence Engine)
 *
 * 物理原理：
 * 1. 因果動力學三角剖分 (Causal Dynamical Triangulations, CDT, Ambjørn-Jurkiewicz-Loll) 透過滿足洛倫茲因果切片結構的
 *    四維單純形 (4-Simplices: N_{4,1} 與 N_{3,2}) Regge 路徑積分 Z = ∑_T exp(i S_{Regge}[T])，提供非微擾背景無關量子引力。
 * 2. 在裸逆引力耦合 κ₀ 與時間-空間各向異性參數 Δ_{CDT} 構成的相圖中，存在四個截然不同的量子幾何相：
 *    - 相 A (Branched Polymer Phase)：大 κ₀，豪斯多夫維度 d_H ≈ 2，不連通樹枝狀分叉聚合物。
 *    - 相 B (Crumpled Phase)：小 Δ_{CDT}，時空塌縮於單一時間片，豪斯多夫維度 d_H → ∞。
 *    - 相 C_{b} (Bifurcation Phase)：空間拓撲分岔相。
 *    - 相 C_{dS} (Emergent 4D de Sitter Phase)：物理宇宙相，大尺度自發湧現滿足 V₃(τ) ∝ cos³(τ / R_{dS}) 之宏觀四維德西特宇宙
 *      (d_H = 4.00)，而紫外線普朗克尺度譜維度動態約化至 d_s(σ → 0) = 1.80 ~ 2.00。
 */

export type CdtQuantumSpacetimeRegime =
  | 'branched-polymer-phase-a'
  | 'crumpled-collapsed-phase-b'
  | 'bifurcation-signature-phase-cb'
  | 'emergent-4d-desitter-universe-cds';

export interface CdtSimplexSliceNode {
  id: number;
  x: number;
  y: number;
  properTimeSliceTau: number;
  spatialThreeVolumeV3: number;
  simplexType: '4-1' | '3-2';
  localSpectralDim: number;
}

export interface CdtSpacetimeState {
  bareInverseNewtonKappa0: number;      // 裸逆牛頓耦合常數 κ₀ (0.50 ~ 4.80)
  causalAnisotropyDelta: number;        // 洛倫茲因果時間-空間不對稱參數 Δ_{CDT} (0.02 ~ 1.20)
  macroscopicHausdorffDimDh: number;    // 大尺度豪斯多夫維度 d_H (在 C_{dS} 相為 4.00)
  uvPlanckSpectralDimDs0: number;       // 紫外線短距離譜維度 d_s(σ → 0)
  deSitterThreeVolumePeak: number;      // 德西特空間三維體積包絡峰值 V₃(τ=0) (×10³ Simplices)
  quantumVolumeFluctuationDeltaV: number;// 量子幾何三維體積漲落 δV₃ / V₃
  activeRegime: CdtQuantumSpacetimeRegime;
  pulsePhase: number;
  simplexNodes: CdtSimplexSliceNode[];
}

const STORAGE_KEY = 'newworld_causal_dynamical_triangulations_state_v1';

export class CausalDynamicalTriangulationsSpacetimeEngine {
  private state: CdtSpacetimeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): CdtSpacetimeState {
    const defaults: CdtSpacetimeState = {
      bareInverseNewtonKappa0: 2.20,
      causalAnisotropyDelta: 0.60,
      macroscopicHausdorffDimDh: 4.00,
      uvPlanckSpectralDimDs0: 1.98,
      deSitterThreeVolumePeak: 164.0,
      quantumVolumeFluctuationDeltaV: 0.08,
      activeRegime: 'emergent-4d-desitter-universe-cds',
      pulsePhase: 0,
      simplexNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load CDT Spacetime state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save CDT Spacetime state:', e);
      }
    }
  }

  public getState(): Readonly<CdtSpacetimeState> {
    return this.state;
  }

  public setBareInverseNewtonKappa0(kappa0: number): void {
    this.state.bareInverseNewtonKappa0 = Math.max(0.50, Math.min(4.80, parseFloat(kappa0.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setCausalAnisotropyDelta(delta: number): void {
    this.state.causalAnisotropyDelta = Math.max(0.02, Math.min(1.20, parseFloat(delta.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: CdtQuantumSpacetimeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'branched-polymer-phase-a':
        this.state.bareInverseNewtonKappa0 = 4.25;
        this.state.causalAnisotropyDelta = 0.55;
        break;
      case 'crumpled-collapsed-phase-b':
        this.state.bareInverseNewtonKappa0 = 1.60;
        this.state.causalAnisotropyDelta = 0.05;
        break;
      case 'bifurcation-signature-phase-cb':
        this.state.bareInverseNewtonKappa0 = 1.85;
        this.state.causalAnisotropyDelta = 0.22;
        break;
      case 'emergent-4d-desitter-universe-cds':
        this.state.bareInverseNewtonKappa0 = 2.20;
        this.state.causalAnisotropyDelta = 0.60;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const k0 = this.state.bareInverseNewtonKappa0;
    const delta = this.state.causalAnisotropyDelta;

    // 判定相圖位置：大 κ₀ (>3.4) 為相 A (d_H≈2)；極小 Δ (<0.12) 為相 B (皺縮相 d_H≈8)；中間為德西特相 C_{dS} (d_H≈4)
    let dh = 4.00;
    if (k0 > 3.4) {
      dh = 2.0 + 2.0 * Math.exp(-(k0 - 3.4) * 1.8);
    } else if (delta < 0.14) {
      dh = 4.0 + 4.5 * Math.pow((0.14 - delta) / 0.14, 1.4);
    } else {
      dh = 4.0 - 0.15 * Math.abs(k0 - 2.2);
    }
    this.state.macroscopicHausdorffDimDh = parseFloat(dh.toFixed(2));

    // 紫外線普朗克尺度譜維度 d_s(σ → 0) ≈ 1.80 ~ 2.05
    const dsUv = 1.82 + 0.26 * Math.tanh(delta * 1.5) * Math.exp(-Math.abs(k0 - 2.2) * 0.3);
    this.state.uvPlanckSpectralDimDs0 = parseFloat(dsUv.toFixed(2));

    // 德西特球體三維空間體積包絡峰值 V₃(τ=0) ∝ cos³(0)
    const deSitterResonance = Math.exp(-Math.pow((k0 - 2.2) / 1.1, 2)) * Math.tanh(delta * 3.2);
    const v3Peak = 45.0 + 135.0 * deSitterResonance;
    this.state.deSitterThreeVolumePeak = parseFloat(v3Peak.toFixed(1));

    // 量子體積漲落 δV₃ / V₃
    const fluct = 0.06 + 0.32 * (1.0 - deSitterResonance);
    this.state.quantumVolumeFluctuationDeltaV = parseFloat(fluct.toFixed(2));

    // 生成 16 個洛倫茲本徵時間片 τ 之 V₃(τ) ∝ cos³(τ/R) 德西特單純形截面節點
    const nodes: CdtSimplexSliceNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const normTau = (i / (count - 1)) * 2.0 - 1.0; // -1 to +1
      const cosProfile = Math.pow(Math.max(0.15, Math.cos(normTau * 1.35)), 3);
      const radiusV3 = 18 + 78 * cosProfile * (0.4 + 0.6 * deSitterResonance);
      const yPos = 42 + ((i / (count - 1)) * 236);
      const sideSign = i % 2 === 0 ? 1 : -1;
      const xPos = 165 + sideSign * radiusV3 + 4 * Math.sin(this.state.pulsePhase + i);

      nodes.push({
        id: i,
        x: parseFloat(xPos.toFixed(1)),
        y: parseFloat(yPos.toFixed(1)),
        properTimeSliceTau: parseFloat((normTau * 10.0).toFixed(1)),
        spatialThreeVolumeV3: parseFloat((v3Peak * cosProfile).toFixed(1)),
        simplexType: i % 2 === 0 ? '4-1' : '3-2',
        localSpectralDim: parseFloat((dsUv + (dh - dsUv) * cosProfile).toFixed(2))
      });
    }
    this.state.simplexNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + this.state.causalAnisotropyDelta * 0.7;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerCdtSpacetimeSound(): void {
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
      const oscUv = this.audioCtx.createOscillator();
      const oscIr = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscUv.type = 'triangle';
      oscIr.type = 'sine';

      // 從 UV d_s≈2 譜維度過渡至 IR d_H=4 德西特體空間共鳴音
      const fUv = 220 * this.state.uvPlanckSpectralDimDs0;
      const fIr = 140 * this.state.macroscopicHausdorffDimDh;

      oscUv.frequency.setValueAtTime(fUv, t);
      oscUv.frequency.exponentialRampToValueAtTime(fIr, t + 0.36);

      oscIr.frequency.setValueAtTime(fIr * 0.75, t);
      oscIr.frequency.exponentialRampToValueAtTime(fIr * 1.25, t + 0.36);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscUv.connect(gain);
      oscIr.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscUv.start(t);
      oscIr.start(t);
      oscUv.stop(t + 0.58);
      oscIr.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in CausalDynamicalTriangulationsSpacetimeEngine:', e);
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

export const causalDynamicalTriangulationsSpacetimeEngine = new CausalDynamicalTriangulationsSpacetimeEngine();
