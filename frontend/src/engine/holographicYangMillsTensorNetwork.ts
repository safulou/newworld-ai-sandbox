/**
 * 全息楊-米爾斯張量網路與多體糾纏幾何湧現重整化流引擎
 * (Holographic Yang-Mills Tensor Network & Entanglement Geometry Renormalization Flow Engine)
 *
 * 物理原理：
 * 1. 透過多尺度糾纏重整化擬設 (MERA) 與規範不變 HaPPY 雙曲張量網路，將邊界 SU(N_c) 楊-米爾斯規範場論
 *    映射至湧現的龐加萊雙曲圓盤 (Poincaré Disk H²) 反德西特 (AdS) 體時空幾何。
 * 2. 根據笠-高柳公式 (Ryu-Takayanagi Formula) 與規範場修正，邊界區域 A 的全息糾纏熵由體空間極小測地線 γ_A 決定：
 *    S_RT = Area(γ_A) / (4 G_N) = N_cut · ln(χ) + (N_c² - 1) · ln(g_YM⁻¹)，其中 χ 為張量鍵維度 (Bond Dimension)。
 * 3. 沿重整化群 (RG) 徑向流向紅外 (IR) 體空間深處時，威爾森迴路 (Wilson Loop) 展現從庫侖周長律向強禁閉面積律
 *    ⟨W(C)⟩ ~ exp(-σ_YM · Area) 的全息禁閉-解禁閉相變。
 */

export type HolographicYmTensorRegime =
  | 'uv-conformal-perimeter-law'
  | 'mera-entanglement-rg-flow'
  | 'su-n-area-law-confinement'
  | 'ads-black-hole-deconfinement-horizon';

export interface TensorNetworkNode {
  id: number;
  x: number;
  y: number;
  rgLayer: number;
  bondEntanglementWeight: number;
  wilsonFluxPhase: number;
  isGeodesicCut: boolean;
}

export interface HolographicYangMillsTensorState {
  gaugeGroupRankNc: number;           // SU(N_c) 規範群階數 N_c (2 ~ 8)
  tensorBondDimensionChi: number;     // 張量網路鍵維度 χ (2 ~ 32)
  ymCouplingSquaredG2: number;        // 楊-米爾斯耦合常數 g_YM² (0.2 ~ 6.0)
  ryuTakayanagiEntropyKb: number;     // 笠-高柳極小測地線糾纏熵 S_RT (k_B)
  emergentAdsCurvatureR: number;      // 湧現體空間里奇曲率 |R_AdS| (ℓ_P⁻²)
  wilsonStringTensionSigma: number;   // 全息威爾森迴路面積律弦張力 σ_YM (GeV²/fm)
  activeRegime: HolographicYmTensorRegime;
  pulsePhase: number;
  tensorNodes: TensorNetworkNode[];
}

const STORAGE_KEY = 'newworld_holographic_ym_tensor_network_state_v1';

export class HolographicYangMillsTensorNetworkEngine {
  private state: HolographicYangMillsTensorState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HolographicYangMillsTensorState {
    const defaults: HolographicYangMillsTensorState = {
      gaugeGroupRankNc: 3,
      tensorBondDimensionChi: 8,
      ymCouplingSquaredG2: 1.8,
      ryuTakayanagiEntropyKb: 24.6,
      emergentAdsCurvatureR: 1.42,
      wilsonStringTensionSigma: 1.95,
      activeRegime: 'mera-entanglement-rg-flow',
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
        console.warn('Failed to load Holographic YM Tensor state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Holographic YM Tensor state:', e);
      }
    }
  }

  public getState(): Readonly<HolographicYangMillsTensorState> {
    return this.state;
  }

  public setGaugeGroupRank(nc: number): void {
    this.state.gaugeGroupRankNc = Math.max(2, Math.min(8, Math.round(nc)));
    this.recomputePhysics();
    this.saveState();
  }

  public setTensorBondDimension(chi: number): void {
    this.state.tensorBondDimensionChi = Math.max(2, Math.min(32, Math.round(chi)));
    this.recomputePhysics();
    this.saveState();
  }

  public setYmCouplingSquared(g2: number): void {
    this.state.ymCouplingSquaredG2 = Math.max(0.2, Math.min(6.0, parseFloat(g2.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HolographicYmTensorRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'uv-conformal-perimeter-law':
        this.state.gaugeGroupRankNc = 2;
        this.state.tensorBondDimensionChi = 4;
        this.state.ymCouplingSquaredG2 = 0.4;
        break;
      case 'mera-entanglement-rg-flow':
        this.state.gaugeGroupRankNc = 3;
        this.state.tensorBondDimensionChi = 10;
        this.state.ymCouplingSquaredG2 = 1.8;
        break;
      case 'su-n-area-law-confinement':
        this.state.gaugeGroupRankNc = 5;
        this.state.tensorBondDimensionChi = 18;
        this.state.ymCouplingSquaredG2 = 3.8;
        break;
      case 'ads-black-hole-deconfinement-horizon':
        this.state.gaugeGroupRankNc = 8;
        this.state.tensorBondDimensionChi = 30;
        this.state.ymCouplingSquaredG2 = 5.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const nc = this.state.gaugeGroupRankNc;
    const chi = this.state.tensorBondDimensionChi;
    const g2 = this.state.ymCouplingSquaredG2;

    const gluonDof = nc * nc - 1;
    // 笠-高柳極小測地線糾纏熵 S_RT = 6 * ln(χ) + 0.85 * (N_c² - 1) * sqrt(g_YM²)
    const sRt = 6.0 * Math.log(chi) + 0.85 * gluonDof * Math.sqrt(g2);
    this.state.ryuTakayanagiEntropyKb = parseFloat(sRt.toFixed(2));

    // 湧現體空間里奇曲率 |R_AdS| ∝ 12 / (ln(χ) * sqrt(N_c * g²))
    const rAds = 3.8 / (Math.log(chi + 1) * Math.pow(nc * g2, 0.25));
    this.state.emergentAdsCurvatureR = parseFloat(rAds.toFixed(3));

    // ’t Hooft 耦合 λ = N_c * g_YM² 決定全息威爾森迴路弦張力 σ_YM
    const tHooftLambda = nc * g2;
    const sigmaYm = 0.42 * Math.sqrt(tHooftLambda) * (1 + 0.08 * Math.log(chi));
    this.state.wilsonStringTensionSigma = parseFloat(sigmaYm.toFixed(2));

    // 生成龐加萊雙曲圓盤 3 層 MERA 重整化張量節點 (1 中心 IR + 5 中層 + 10 UV 邊界 = 16 節點)
    const nodes: TensorNetworkNode[] = [];
    let id = 0;

    // Layer 0 (Deep Bulk IR Center)
    nodes.push({
      id: id++,
      x: 165,
      y: 160,
      rgLayer: 0,
      bondEntanglementWeight: parseFloat(Math.min(1.0, 0.4 + 0.15 * Math.log(chi)).toFixed(2)),
      wilsonFluxPhase: parseFloat((this.state.pulsePhase % (2 * Math.PI)).toFixed(2)),
      isGeodesicCut: true
    });

    // Layer 1 (Intermediate RG Scale, 5 Pentagonal Hyperbolic Tensors)
    for (let i = 0; i < 5; i++) {
      const theta = (i * 2 * Math.PI) / 5 + this.state.pulsePhase * 0.25;
      const r1 = 54;
      nodes.push({
        id: id++,
        x: parseFloat((165 + r1 * Math.cos(theta)).toFixed(1)),
        y: parseFloat((160 + r1 * Math.sin(theta)).toFixed(1)),
        rgLayer: 1,
        bondEntanglementWeight: parseFloat((0.55 + 0.2 * Math.sin(this.state.pulsePhase + i)).toFixed(2)),
        wilsonFluxPhase: parseFloat(((theta + this.state.pulsePhase) % (2 * Math.PI)).toFixed(2)),
        isGeodesicCut: i < 3
      });
    }

    // Layer 2 (UV CFT Boundary Scale, 10 Boundary Tensors)
    for (let i = 0; i < 10; i++) {
      const theta = (i * 2 * Math.PI) / 10 - this.state.pulsePhase * 0.15;
      const r2 = 108;
      nodes.push({
        id: id++,
        x: parseFloat((165 + r2 * Math.cos(theta)).toFixed(1)),
        y: parseFloat((160 + r2 * Math.sin(theta)).toFixed(1)),
        rgLayer: 2,
        bondEntanglementWeight: parseFloat((0.45 + 0.25 * Math.cos(this.state.pulsePhase + i)).toFixed(2)),
        wilsonFluxPhase: parseFloat(((theta * nc + this.state.pulsePhase) % (2 * Math.PI)).toFixed(2)),
        isGeodesicCut: i === 1 || i === 5
      });
    }

    this.state.tensorNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const rate = 0.9 + Math.log(this.state.tensorBondDimensionChi) * 0.45;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerYmTensorSound(): void {
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
      osc2.type = 'sawtooth';

      const f1 = 220 + this.state.gaugeGroupRankNc * 30;
      const f2 = f1 * 1.5;

      osc1.frequency.setValueAtTime(f1, t);
      osc1.frequency.exponentialRampToValueAtTime(f1 * 1.35, t + 0.36);

      osc2.frequency.setValueAtTime(f2, t);
      osc2.frequency.exponentialRampToValueAtTime(f2 * 1.25, t + 0.36);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.56);
      osc2.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicYangMillsTensorNetworkEngine:', e);
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

export const holographicYangMillsTensorNetworkEngine = new HolographicYangMillsTensorNetworkEngine();
