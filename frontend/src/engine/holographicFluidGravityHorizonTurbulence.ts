/**
 * 全息流體-引力對偶與反德西特黑洞視界相對論性量子湍流引擎
 * (Holographic Fluid/Gravity Correspondence & AdS Black Hole Horizon Relativistic Quantum Turbulence Engine)
 *
 * 物理原理：
 * 1. 根據 Bhattacharyya-Minwalla-Hubeny-Rangamani「流體/引力對偶」(Fluid/Gravity Correspondence)，
 *    漸近反德西特時空 \text{AdS}_{d+1} 中緩變長波動態黑膜 (Black Brane) 的愛因斯坦場方程，在逐階梯度展開下
 *    一對一精確映射為邊界強耦合共形流體之相對論性納維-斯托克斯方程：\nabla_\mu T^{\mu\nu} = 0。
 * 2. 黑洞事件視界的霍金吸收截面決定了 Kovtun-Son-Starinets (KSS) 剪切黏滯度與熵密度比之普適下界：
 *    \eta / s = \frac{\hbar}{4\pi k_B} (1 - 4\lambda_{GB})，其中高階 Gauss-Bonnet 引力修正 \lambda_{GB} 可微幅突破 KSS 界。
 * 3. 在 (2+1) 維邊界全息共形流體與對偶 (3+1) 維黑洞視界上，非線性流體渦度觸發「逆能量級聯」(Inverse Energy Cascade,
 *    動能譜 E(k) \propto k^{-5/3} 向長波大尺度聚集形成巨型偶極渦旋凝聚) 與「正擬渦能級聯」(Direct Enstrophy Cascade,
 *    E(k) \propto k^{-3})，而體黑洞視界則呈現面積碎形化 (Fractal Horizon Dimension D_H > 2) 與 Raychaudhuri 視界膨脹耗散。
 */

export type HolographicFluidGravityRegime =
  | 'kss-minimal-viscosity-hydrodynamic-shear'
  | 'inverse-energy-cascade-kolmogorov-k53'
  | 'fractal-black-brane-horizon-vortex-shedding'
  | 'giant-vortex-dipole-superfluid-condensate';

export interface HorizonTurbulenceEddyNode {
  id: number;
  x: number;
  y: number;
  eddyPolarity: 'cyclonic-positive-vorticity' | 'anticyclonic-negative-vorticity' | 'horizon-raychaudhuri-shear';
  wavenumberK: number;
  kolmogorovSpectralPower: number;
  localHorizonExpansionTheta: number;
}

export interface HolographicFluidGravityState {
  superfluidReynoldsNumberLog10: number;  // 全息邊界相對論性雷諾數對數 log10(Re_s) (1.5 ~ 6.0)
  gaussBonnetCouplingLambda: number;      // 高階曲率 Gauss-Bonnet 耦合常數 \lambda_{GB} (-0.15 ~ +0.09)
  kssViscosityToEntropyRatio4Pi: number;  // 正規化剪切黏滯度與熵密度比 4\pi (\eta / s) = 1 - 4\lambda_{GB}
  horizonFractalDimensionDh: number;      // 湍流黑洞事件視界碎形維度 D_H = 2 + \Delta D_{Kolmogorov} (2.000 ~ 2.667)
  inverseCascadeSpectralSlope: number;    // 逆能量級聯科爾莫戈羅夫冪律斜率 -\alpha_E (趨近 5/3 \approx 1.667)
  raychaudhuriEntropyProduction: number;  // 黑洞視界 Raychaudhuri 剪切面積熵增率 dA_H / dt
  activeRegime: HolographicFluidGravityRegime;
  pulsePhase: number;
  eddyNodes: HorizonTurbulenceEddyNode[];
}

const STORAGE_KEY = 'newworld_holographic_fluid_gravity_turbulence_state_v1';

export class HolographicFluidGravityHorizonTurbulenceEngine {
  private state: HolographicFluidGravityState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HolographicFluidGravityState {
    const defaults: HolographicFluidGravityState = {
      superfluidReynoldsNumberLog10: 4.2,
      gaussBonnetCouplingLambda: 0.04,
      kssViscosityToEntropyRatio4Pi: 0.84,
      horizonFractalDimensionDh: 2.385,
      inverseCascadeSpectralSlope: 1.667,
      raychaudhuriEntropyProduction: 3.42,
      activeRegime: 'inverse-energy-cascade-kolmogorov-k53',
      pulsePhase: 0,
      eddyNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Holographic Fluid-Gravity Turbulence state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Holographic Fluid-Gravity Turbulence state:', e);
      }
    }
  }

  public getState(): Readonly<HolographicFluidGravityState> {
    return this.state;
  }

  public setSuperfluidReynoldsNumberLog10(logRe: number): void {
    this.state.superfluidReynoldsNumberLog10 = Math.max(1.5, Math.min(6.0, parseFloat(logRe.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setGaussBonnetCouplingLambda(lambdaGb: number): void {
    this.state.gaussBonnetCouplingLambda = Math.max(-0.15, Math.min(0.09, parseFloat(lambdaGb.toFixed(3))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HolographicFluidGravityRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'kss-minimal-viscosity-hydrodynamic-shear':
        this.state.superfluidReynoldsNumberLog10 = 2.2;
        this.state.gaussBonnetCouplingLambda = 0.00;
        break;
      case 'inverse-energy-cascade-kolmogorov-k53':
        this.state.superfluidReynoldsNumberLog10 = 4.4;
        this.state.gaussBonnetCouplingLambda = 0.04;
        break;
      case 'fractal-black-brane-horizon-vortex-shedding':
        this.state.superfluidReynoldsNumberLog10 = 5.3;
        this.state.gaussBonnetCouplingLambda = 0.075;
        break;
      case 'giant-vortex-dipole-superfluid-condensate':
        this.state.superfluidReynoldsNumberLog10 = 5.8;
        this.state.gaussBonnetCouplingLambda = 0.085;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const logRe = this.state.superfluidReynoldsNumberLog10;
    const lambdaGb = this.state.gaussBonnetCouplingLambda;

    // Brigante-Liu-Myers-Shenker-Yaida 修正 KSS 黏滯度比: 4\pi (\eta / s) = 1 - 4\lambda_{GB}
    const kssRatio = Math.max(0.64, 1.0 - 4.0 * lambdaGb);
    this.state.kssViscosityToEntropyRatio4Pi = parseFloat(kssRatio.toFixed(3));

    // 湍流黑洞視界碎形維度 D_H \in [2.000, 2.667] (Adams-Chesler-Liu 全息湍流視界定理)
    const turbulenceFactor = 1.0 / (1.0 + Math.exp(-(logRe - 3.2) / 0.85));
    const dh = 2.0 + 0.65 * turbulenceFactor * (1.15 - 0.35 * kssRatio);
    this.state.horizonFractalDimensionDh = parseFloat(Math.min(2.666, dh).toFixed(3));

    // 科爾莫戈羅夫-Kraichnan 逆能量級聯斜率 (由層流 3.0 過渡至湍流 5/3 \approx 1.667)
    const slope = 1.667 + 1.333 * (1.0 - turbulenceFactor);
    this.state.inverseCascadeSpectralSlope = parseFloat(slope.toFixed(3));

    // Raychaudhuri 方程視界剪切耗散面積增長率 dA_H / dt \propto (\eta/s) |\sigma_{AB}|^2
    const entropyRate = 0.85 * logRe * kssRatio * (1.0 + 0.45 * turbulenceFactor);
    this.state.raychaudhuriEntropyProduction = parseFloat(entropyRate.toFixed(2));

    // 生成 16 個全息視界正/反氣旋渦旋與 Raychaudhuri 剪切波紋節點
    const nodes: HorizonTurbulenceEddyNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let polarity: 'cyclonic-positive-vorticity' | 'anticyclonic-negative-vorticity' | 'horizon-raychaudhuri-shear' =
        i % 2 === 0 ? 'cyclonic-positive-vorticity' : 'anticyclonic-negative-vorticity';
      if (i % 5 === 4) polarity = 'horizon-raychaudhuri-shear';

      // 逆能量級聯使渦旋向左右兩大巨型偶極中心聚攏
      const isGiantDipole = this.state.activeRegime === 'giant-vortex-dipole-superfluid-condensate' || logRe > 4.8;
      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * (polarity === 'cyclonic-positive-vorticity' ? 0.52 : -0.48);
      const rBase = isGiantDipole ? (i < 8 ? 46 : 86) : 38 + (i % 4) * 18;
      const offsetX = isGiantDipole ? (i % 2 === 0 ? -24 : 24) : 0;

      const x = 165 + offsetX + rBase * Math.cos(angle);
      const y = 160 + rBase * Math.sin(angle);
      const kWave = (i % 6) + 1;

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        eddyPolarity: polarity,
        wavenumberK: kWave,
        kolmogorovSpectralPower: parseFloat(Math.pow(kWave, -this.state.inverseCascadeSpectralSlope).toFixed(3)),
        localHorizonExpansionTheta: parseFloat((0.22 * entropyRate * (0.5 + 0.5 * Math.abs(Math.sin(angle * 2)))).toFixed(2))
      });
    }
    this.state.eddyNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.75 + (this.state.superfluidReynoldsNumberLog10 / 6.0) * 0.85;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerFluidGravityTurbulenceSound(): void {
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
      const oscCascade = this.audioCtx.createOscillator();
      const oscHorizon = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscCascade.type = 'sine';
      oscHorizon.type = 'triangle';

      // 逆能量級聯：高波數小渦旋頻率向低波數巨型偶極基頻匯聚 (頻率向下滑移 5/3 倍)
      const fHighK = 520 + this.state.superfluidReynoldsNumberLog10 * 35;
      const fLowK = fHighK / this.state.inverseCascadeSpectralSlope;

      oscCascade.frequency.setValueAtTime(fHighK, t);
      oscCascade.frequency.exponentialRampToValueAtTime(fLowK, t + 0.45);

      oscHorizon.frequency.setValueAtTime(fLowK * this.state.kssViscosityToEntropyRatio4Pi, t);
      oscHorizon.frequency.exponentialRampToValueAtTime(fLowK, t + 0.45);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscCascade.connect(gain);
      oscHorizon.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscCascade.start(t);
      oscHorizon.start(t);
      oscCascade.stop(t + 0.58);
      oscHorizon.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicFluidGravityHorizonTurbulenceEngine:', e);
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

export const holographicFluidGravityHorizonTurbulenceEngine = new HolographicFluidGravityHorizonTurbulenceEngine();
