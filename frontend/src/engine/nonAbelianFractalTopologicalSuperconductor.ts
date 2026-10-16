/**
 * 非阿貝爾分形高階拓撲超導體引擎 (Non-Abelian Fractal Higher-Order Topological Superconductor Engine)
 * 
 * 物理原理：
 * 1. 在分形幾何晶格（例如豪斯多夫維數 d_f ≈ 1.893 的謝爾賓斯基地毯）中，結合 p_x + i p_y 拓撲超導配對
 *    與非阿貝爾 Rashba 自旋軌道耦合 (SOC α)。
 * 2. 系統進入高階拓撲超導相 (HOTSC)：體帶隙與一階分形邊緣帶隙同時開啟，而在分形自相似幾何的
 *    外角隅與自相似內角隅處，湧現指數定域化的非阿貝爾零能馬約拉納角隅模 (Majorana Corner Modes, MCMs)。
 * 3. 每個馬約拉納角隅模對應一個伊辛任意子 (Ising Anyon γ_i)，滿足非阿貝爾聚變規則 σ × σ = 1 + ψ。
 * 4. 透過在分形角隅間進行量子態絕熱編織 (Braiding)，構建受分形拓撲同調保護的容錯量子位元，
 *    在布洛赫球面 (Bloch Sphere) 上實現幾何相位旋轉與高保真度量子邏輯運算。
 */

export type FractalHOTSCRegime = 
  | 'trivial-fractal-metal'
  | 'first-order-chiral-sc'
  | 'second-order-fractal-corner'
  | 'non-abelian-braiding-qubit';

export interface FractalCornerNode {
  id: number;
  x: number;
  y: number;
  wavefunctionDensity: number;
  phase: number;
  isExterior: boolean;
}

export interface FractalHOTSCState {
  pairingGapDelta: number;         // 超導配對能隙 Δ₀ (meV, 0.5 ~ 5.0)
  socStrengthAlpha: number;        // 自旋軌道耦合強度 α_SOC (meV, 5.0 ~ 50.0)
  chemicalPotentialMu: number;     // 化學勢 μ (meV, -2.0 ~ 2.0)
  fractalGeneration: number;       // 分形遞歸層數 (1 ~ 3)
  cornerModeLocalizationNm: number;// 馬約拉納角隅定域長度 ξ_M (nm)
  braidingFidelity: number;        // 編織保真度 (0.0 ~ 1.0)
  qubitBlochThetaRad: number;      // 布洛赫球天頂角 θ (0 ~ π)
  qubitBlochPhiRad: number;        // 布洛赫球方位角 φ (0 ~ 2π)
  activeRegime: FractalHOTSCRegime;
  pulsePhase: number;
  cornerModes: FractalCornerNode[];
}

const STORAGE_KEY = 'newworld_fractal_hotsc_state_v1';

export class NonAbelianFractalTopologicalSuperconductorEngine {
  private state: FractalHOTSCState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): FractalHOTSCState {
    const defaults: FractalHOTSCState = {
      pairingGapDelta: 2.8,
      socStrengthAlpha: 28.0,
      chemicalPotentialMu: 0.15,
      fractalGeneration: 2,
      cornerModeLocalizationNm: 12.4,
      braidingFidelity: 0.994,
      qubitBlochThetaRad: Math.PI / 4,
      qubitBlochPhiRad: Math.PI / 3,
      activeRegime: 'second-order-fractal-corner',
      pulsePhase: 0,
      cornerModes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Fractal HOTSC state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Fractal HOTSC state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<FractalHOTSCState> {
    return this.state;
  }

  public setPairingGap(delta: number): void {
    this.state.pairingGapDelta = Math.max(0.5, Math.min(5.0, delta));
    this.recomputePhysics();
    this.saveState();
  }

  public setSocStrength(alpha: number): void {
    this.state.socStrengthAlpha = Math.max(5.0, Math.min(50.0, alpha));
    this.recomputePhysics();
    this.saveState();
  }

  public setChemicalPotential(mu: number): void {
    this.state.chemicalPotentialMu = Math.max(-2.0, Math.min(2.0, mu));
    this.recomputePhysics();
    this.saveState();
  }

  public setFractalGeneration(gen: number): void {
    this.state.fractalGeneration = Math.max(1, Math.min(3, Math.round(gen)));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FractalHOTSCRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'trivial-fractal-metal':
        this.state.pairingGapDelta = 0.6;
        this.state.socStrengthAlpha = 8.0;
        this.state.chemicalPotentialMu = 1.8;
        break;
      case 'first-order-chiral-sc':
        this.state.pairingGapDelta = 2.0;
        this.state.socStrengthAlpha = 18.0;
        this.state.chemicalPotentialMu = 0.8;
        break;
      case 'second-order-fractal-corner':
        this.state.pairingGapDelta = 3.2;
        this.state.socStrengthAlpha = 32.0;
        this.state.chemicalPotentialMu = 0.1;
        break;
      case 'non-abelian-braiding-qubit':
        this.state.pairingGapDelta = 4.2;
        this.state.socStrengthAlpha = 42.0;
        this.state.chemicalPotentialMu = 0.02;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const delta = this.state.pairingGapDelta;
    const alpha = this.state.socStrengthAlpha;
    const mu = this.state.chemicalPotentialMu;

    // 馬約拉納定域長度: ξ_M = ℏ v_F / Δ ∝ α / (Δ * sqrt(1 + (μ/Δ)²))
    const loc = (alpha * 1.5) / (delta * Math.sqrt(1 + Math.pow(mu / delta, 2)));
    this.state.cornerModeLocalizationNm = parseFloat(Math.min(35.0, Math.max(4.0, loc)).toFixed(1));

    // 編織保真度: F = 1 - 0.05 * exp(-2 * delta) - 0.02 * |mu|
    const fid = 1 - 0.05 * Math.exp(-0.8 * delta) - 0.015 * Math.abs(mu);
    this.state.braidingFidelity = parseFloat(Math.min(0.999, Math.max(0.75, fid)).toFixed(4));

    // 布洛赫球天頂角與方位角更新
    this.state.qubitBlochThetaRad = (Math.PI / 4) + 0.2 * Math.sin(this.state.pulsePhase * 0.7);
    this.state.qubitBlochPhiRad = ((this.state.pulsePhase * 0.9) % (2 * Math.PI));

    // 謝爾賓斯基分形幾何角隅節點計算 (8 個特徵角隅模)
    const corners: FractalCornerNode[] = [
      // 4 外角隅
      { id: 0, x: 50, y: 50, wavefunctionDensity: 0.95, phase: 0, isExterior: true },
      { id: 1, x: 250, y: 50, wavefunctionDensity: 0.95, phase: Math.PI / 2, isExterior: true },
      { id: 2, x: 250, y: 250, wavefunctionDensity: 0.95, phase: Math.PI, isExterior: true },
      { id: 3, x: 50, y: 250, wavefunctionDensity: 0.95, phase: (3 * Math.PI) / 2, isExterior: true },
      // 4 內分形自相似角隅 (中央鏤空腔邊界)
      { id: 4, x: 116, y: 116, wavefunctionDensity: 0.72, phase: Math.PI / 4, isExterior: false },
      { id: 5, x: 184, y: 116, wavefunctionDensity: 0.72, phase: (3 * Math.PI) / 4, isExterior: false },
      { id: 6, x: 184, y: 184, wavefunctionDensity: 0.72, phase: (5 * Math.PI) / 4, isExterior: false },
      { id: 7, x: 116, y: 184, wavefunctionDensity: 0.72, phase: (7 * Math.PI) / 4, isExterior: false },
    ];

    // 根據超導能隙與定域程度調制密度
    this.state.cornerModes = corners.map(c => {
      const isCorner = this.state.activeRegime === 'second-order-fractal-corner' || this.state.activeRegime === 'non-abelian-braiding-qubit';
      const factor = isCorner ? (delta / 3.0) : 0.25;
      const dyn = Math.sin(this.state.pulsePhase * 3.0 + c.phase);
      return {
        ...c,
        wavefunctionDensity: parseFloat(Math.min(1.0, Math.max(0.1, c.wavefunctionDensity * factor + dyn * 0.1)).toFixed(2))
      };
    });
  }

  public update(dtSeconds: number): void {
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * 2.5) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerBraidingSound(): void {
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

      const baseFreq = 440;
      const targetFreq = 880 + this.state.pairingGapDelta * 40;

      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.35);

      osc2.frequency.setValueAtTime(baseFreq * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(targetFreq * 1.5, t + 0.35);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.58);
      osc2.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in NonAbelianFractalHOTSCEngine:', e);
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

export const nonAbelianFractalTopologicalSuperconductorEngine = new NonAbelianFractalTopologicalSuperconductorEngine();
