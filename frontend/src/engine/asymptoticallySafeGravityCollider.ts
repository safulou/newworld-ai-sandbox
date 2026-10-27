/**
 * 漸近安全量子引力與非微擾紫外線不動點對撞引擎
 * (Asymptotically Safe Quantum Gravity & Non-Gaussian UV Fixed-Point Collider Engine)
 *
 * 物理原理：
 * 1. 根據溫伯格 (Weinberg) 漸近安全假設與 Reuter 泛函重整化群 (Functional Renormalization Group, FRG)
 *    精確流方程 ∂_k Γ_k = ½ STr[(Γ_k^(2) + R_k)^(-1) ∂_k R_k]，當動量截斷能標 k / M_Pl → ∞ 時，
 *    無因次牛頓耦合 g(k) = G_N(k) k² 與無因次宇宙學常數 λ(k) = Λ(k) / k² 螺旋收斂至非高斯紫外線不動點
 *    (Reuter UV Fixed Point: g_* ≈ 0.707, λ_* ≈ 0.193)。
 * 2. 在超普朗克能標下，有效引力常數隨能量反比衰減 G_N(k) ≈ g_* / k² (反屏蔽效應 Antiscreening)，
 *    徹底消除微擾量子引力的紫外線發散並恢復超普朗克引力子散射截面 σ_grav(s) 的么正性 (Unitarity)。
 * 3. 重整化群流同時誘導「時空譜維度約化」(Dimensional Reduction)：熱核擴散測得的時空有效譜維度 d_s(k)
 *    由紅外線經典廣義相對論的 d_s = 4.0 連續過渡至紫外線不動點處的分形二維時空 d_s = 2.0。
 */

export type AsymptoticallySafeGravityRegime =
  | 'infrared-einstein-hilbert-4d'
  | 'crossover-planckian-rg-threshold'
  | 'reuter-non-gaussian-uv-fixed-point'
  | 'dimensional-reduction-2d-fractal-spacetime';

export interface RgFlowSpiralNode {
  id: number;
  x: number;
  y: number;
  runningNewtonG: number;
  runningLambda: number;
  localSpectralDim: number;
  isNearUvAttractor: boolean;
}

export interface AsymptoticallySafeGravityState {
  rgMomentumScaleKOverMpl: number;      // 重整化群截斷能標 k / M_Pl (0.05 ~ 12.0)
  curvatureSquaredCouplingTheta3: number;// 高階 R² 曲率耦合強度 θ_3 (0.10 ~ 3.50)
  runningDimensionlessNewtonG: number;  // 跑動無因次牛頓耦合 g(k) → g_* ≈ 0.707
  runningDimensionlessLambda: number;   // 跑動無因次宇宙學常數 λ(k) → λ_* ≈ 0.193
  spacetimeSpectralDimensionDs: number; // 時空有效譜維度 d_s(k) (4.00 → 2.00)
  unitarizedGravitonCrossSectionPb: number; // 漸近安全么正化引力子散射截面 σ_grav (pb)
  activeRegime: AsymptoticallySafeGravityRegime;
  pulsePhase: number;
  rgSpiralNodes: RgFlowSpiralNode[];
}

const STORAGE_KEY = 'newworld_asymptotically_safe_gravity_state_v1';

export class AsymptoticallySafeGravityColliderEngine {
  private state: AsymptoticallySafeGravityState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): AsymptoticallySafeGravityState {
    const defaults: AsymptoticallySafeGravityState = {
      rgMomentumScaleKOverMpl: 3.5,
      curvatureSquaredCouplingTheta3: 1.25,
      runningDimensionlessNewtonG: 0.685,
      runningDimensionlessLambda: 0.188,
      spacetimeSpectralDimensionDs: 2.15,
      unitarizedGravitonCrossSectionPb: 42.6,
      activeRegime: 'reuter-non-gaussian-uv-fixed-point',
      pulsePhase: 0,
      rgSpiralNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Asymptotically Safe Gravity state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Asymptotically Safe Gravity state:', e);
      }
    }
  }

  public getState(): Readonly<AsymptoticallySafeGravityState> {
    return this.state;
  }

  public setRgMomentumScale(kOverMpl: number): void {
    this.state.rgMomentumScaleKOverMpl = Math.max(0.05, Math.min(12.0, parseFloat(kOverMpl.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setCurvatureSquaredCoupling(theta3: number): void {
    this.state.curvatureSquaredCouplingTheta3 = Math.max(0.10, Math.min(3.50, parseFloat(theta3.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: AsymptoticallySafeGravityRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'infrared-einstein-hilbert-4d':
        this.state.rgMomentumScaleKOverMpl = 0.12;
        this.state.curvatureSquaredCouplingTheta3 = 0.25;
        break;
      case 'crossover-planckian-rg-threshold':
        this.state.rgMomentumScaleKOverMpl = 1.05;
        this.state.curvatureSquaredCouplingTheta3 = 0.85;
        break;
      case 'reuter-non-gaussian-uv-fixed-point':
        this.state.rgMomentumScaleKOverMpl = 4.50;
        this.state.curvatureSquaredCouplingTheta3 = 1.65;
        break;
      case 'dimensional-reduction-2d-fractal-spacetime':
        this.state.rgMomentumScaleKOverMpl = 10.80;
        this.state.curvatureSquaredCouplingTheta3 = 3.10;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const kScale = this.state.rgMomentumScaleKOverMpl;
    const theta3 = this.state.curvatureSquaredCouplingTheta3;
    const k2 = kScale * kScale;

    // 非高斯紫外線不動點 Reuter UV Fixed Point (g_* = 0.707, λ_* = 0.193)
    const gStar = 0.707;
    const lambdaStar = 0.193;

    // 跑動無因次牛頓耦合 g(k) = g_* * k² / (k² + 1/g_*)
    const gRun = (gStar * k2) / (k2 + 1.0 / (0.8 + 0.4 * theta3));
    this.state.runningDimensionlessNewtonG = parseFloat(gRun.toFixed(3));

    // 跑動無因次宇宙學常數 λ(k)
    const lamRun = (lambdaStar * k2) / (k2 + 1.2);
    this.state.runningDimensionlessLambda = parseFloat(lamRun.toFixed(3));

    // 時空有效譜維度 d_s(k) = 4 - 2 * k² / (k² + 1.2) ∈ [2.00, 4.00]
    const ds = 4.0 - (2.0 * k2) / (k2 + 1.15);
    this.state.spacetimeSpectralDimensionDs = parseFloat(ds.toFixed(2));

    // 么正化超普朗克引力子散射截面 σ_grav (pb) ∝ g(k)² / (1 + k²)
    const crossSec = (140.0 * gRun * (0.6 + 0.3 * theta3)) / (1.0 + 0.18 * kScale);
    this.state.unitarizedGravitonCrossSectionPb = parseFloat(crossSec.toFixed(1));

    // 生成 16 個 (g_k, λ_k) 相空間螺旋重整化流軌跡節點，收斂向中心不動點 (165, 160)
    const nodes: RgFlowSpiralNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const tFlow = i / (count - 1); // 0 = IR, 1 = UV Fixed Point
      const radius = 112 * Math.exp(-2.1 * tFlow * (0.6 + 0.06 * kScale));
      const spiralAngle = tFlow * 4.2 * Math.PI + this.state.pulsePhase * 0.4;

      const x = 165 + radius * Math.cos(spiralAngle);
      const y = 160 + radius * Math.sin(spiralAngle);

      const nodeDs = 4.0 - 2.0 * tFlow;

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        runningNewtonG: parseFloat((gStar * tFlow).toFixed(3)),
        runningLambda: parseFloat((lambdaStar * tFlow).toFixed(3)),
        localSpectralDim: parseFloat(nodeDs.toFixed(2)),
        isNearUvAttractor: tFlow > 0.65
      });
    }
    this.state.rgSpiralNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + this.state.rgMomentumScaleKOverMpl * 0.15;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAsymptoticSafetySound(): void {
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
      const oscIr = this.audioCtx.createOscillator();
      const oscUv = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscIr.type = 'sine';
      oscUv.type = 'triangle';

      // 從 4D 紅外頻率收斂至 2D 紫外不動點八度倍頻
      const fIr = 220 + this.state.curvatureSquaredCouplingTheta3 * 45;
      const fUv = fIr * (4.0 / Math.max(2.0, this.state.spacetimeSpectralDimensionDs));

      oscIr.frequency.setValueAtTime(fIr, t);
      oscIr.frequency.exponentialRampToValueAtTime(fUv, t + 0.35);

      oscUv.frequency.setValueAtTime(fIr * 1.414, t);
      oscUv.frequency.exponentialRampToValueAtTime(fUv * 1.414, t + 0.35);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscIr.connect(gain);
      oscUv.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscIr.start(t);
      oscUv.start(t);
      oscIr.stop(t + 0.57);
      oscUv.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in AsymptoticallySafeGravityColliderEngine:', e);
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

export const asymptoticallySafeGravityColliderEngine = new AsymptoticallySafeGravityColliderEngine();
