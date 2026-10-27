/**
 * 菱方五層石墨烯分數陳絕緣體與手性拓撲超導引擎
 * (Rhombohedral Pentalayer Graphene Fractional Chern Insulator & Chiral Topological Superconductor Engine)
 *
 * 物理原理：
 * 1. 菱方堆疊 (ABCDE-Stacked Rhombohedral) 五層石墨烯在垂直位移電場 D 作用下，低能電子波函數高度局域於單側表層，
 *    形成能量極度平坦且富含非零貝里曲率 (Berry Curvature Ω_k) 的孤立平帶。
 * 2. 強庫侖排斥自發破缺自旋與能谷對稱性，形成「自旋-能谷四分之一金屬」(Quarter-Metal) 與零磁場「反常霍爾晶體」
 *    (Anomalous Hall Crystal, AHC)；在分數填充 ν = 2/3, 3/5 處湧現零磁場分數量子反常霍爾態 (FQAH)，霍爾電阻量子化為 R_xy = h/(νe²)。
 * 3. 在四分之一金屬相邊界調節載子填充與位移場時，完全自旋-能谷極化費米面湧現手性 p + ip 或 f-波非常規超導態，
 *    具備自發時間反演破缺磁滯回線、手性邊界馬約拉納模與非互易臨界超電流 I_c。
 */

export type RhombohedralGrapheneRegime =
  | 'unpolarized-rhombohedral-semimetal'
  | 'spin-valley-quarter-metal'
  | 'anomalous-hall-crystal-fqah'
  | 'chiral-p-ip-topological-superconductor';

export interface RhombohedralFlatBandNode {
  id: number;
  x: number;
  y: number;
  valleyChiralityK: number; // +1 (K) or -1 (K')
  berryCurvatureFlux: number;
  fractionalChargeNu: number;
  chiralPairingPhaseRad: number;
}

export interface RhombohedralGrapheneState {
  displacementFieldVNm: number;         // 垂直位移電場強度 D (V/nm, 0.10 ~ 1.40)
  moirélessFillingFactorNu: number;     // 平帶分數填充因子 ν (0.20 ~ 1.00)
  spinValleyPolarizationPsv: number;    // 自旋-能谷同位旋極化度 P_sv (0 ~ 1)
  quantizedHallResistanceHOverE2: number; // 零場霍爾電阻 R_xy / (h/e²)
  chiralCriticalCurrentNa: number;      // 手性 p+ip 超導臨界電流 I_c (nA)
  berryCurvatureDipoleNm: number;       // 貝里曲率偶極矩 Λ_BCD (nm)
  activeRegime: RhombohedralGrapheneRegime;
  pulsePhase: number;
  flatBandNodes: RhombohedralFlatBandNode[];
}

const STORAGE_KEY = 'newworld_rhombohedral_graphene_superconductor_state_v1';

export class RhombohedralGrapheneChiralSuperconductorEngine {
  private state: RhombohedralGrapheneState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): RhombohedralGrapheneState {
    const defaults: RhombohedralGrapheneState = {
      displacementFieldVNm: 0.88,
      moirélessFillingFactorNu: 0.67,
      spinValleyPolarizationPsv: 0.92,
      quantizedHallResistanceHOverE2: 1.50,
      chiralCriticalCurrentNa: 145.0,
      berryCurvatureDipoleNm: 18.4,
      activeRegime: 'chiral-p-ip-topological-superconductor',
      pulsePhase: 0,
      flatBandNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Rhombohedral Graphene state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Rhombohedral Graphene state:', e);
      }
    }
  }

  public getState(): Readonly<RhombohedralGrapheneState> {
    return this.state;
  }

  public setDisplacementField(dFieldVNm: number): void {
    this.state.displacementFieldVNm = Math.max(0.10, Math.min(1.40, parseFloat(dFieldVNm.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setFillingFactorNu(nu: number): void {
    this.state.moirélessFillingFactorNu = Math.max(0.20, Math.min(1.00, parseFloat(nu.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setSpinValleyPolarization(psv: number): void {
    this.state.spinValleyPolarizationPsv = Math.max(0.05, Math.min(1.00, parseFloat(psv.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: RhombohedralGrapheneRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'unpolarized-rhombohedral-semimetal':
        this.state.displacementFieldVNm = 0.18;
        this.state.moirélessFillingFactorNu = 0.25;
        this.state.spinValleyPolarizationPsv = 0.15;
        break;
      case 'spin-valley-quarter-metal':
        this.state.displacementFieldVNm = 0.65;
        this.state.moirélessFillingFactorNu = 0.50;
        this.state.spinValleyPolarizationPsv = 0.85;
        break;
      case 'anomalous-hall-crystal-fqah':
        this.state.displacementFieldVNm = 0.95;
        this.state.moirélessFillingFactorNu = 0.67;
        this.state.spinValleyPolarizationPsv = 0.96;
        break;
      case 'chiral-p-ip-topological-superconductor':
        this.state.displacementFieldVNm = 1.22;
        this.state.moirélessFillingFactorNu = 0.80;
        this.state.spinValleyPolarizationPsv = 0.99;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const dField = this.state.displacementFieldVNm;
    const nu = this.state.moirélessFillingFactorNu;
    const psv = this.state.spinValleyPolarizationPsv;

    // 零場量子反常霍爾電阻 R_xy / (h/e²) ≈ P_sv / ν (在 ν=2/3 時接近 1.5 h/e²)
    const rxy = (psv / Math.max(0.2, nu)) * Math.tanh(dField * 1.8);
    this.state.quantizedHallResistanceHOverE2 = parseFloat(rxy.toFixed(2));

    // 手性 p+ip 超導臨界電流 I_c (nA)
    const icNa = 195.0 * Math.pow(psv, 1.5) * Math.tanh(dField * 1.4) * (0.4 + 0.6 * nu);
    this.state.chiralCriticalCurrentNa = parseFloat(icNa.toFixed(1));

    // 貝里曲率偶極矩 Λ_BCD (nm)
    const bcdNm = 14.5 * dField * psv * (1.0 + 0.35 * Math.sin(nu * Math.PI));
    this.state.berryCurvatureDipoleNm = parseFloat(bcdNm.toFixed(1));

    // 生成 18 個 ABCDE 五層菱方石墨烯平帶同位旋與 Laughlin 準空穴節點
    const nodes: RhombohedralFlatBandNode[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const layer = i < 6 ? 45 : i < 12 ? 78 : 110;
      const idx = i % 6;
      const rhomboShift = (i / 6) * (Math.PI / 9);
      const angle = (idx / 6) * 2 * Math.PI + rhomboShift + this.state.pulsePhase * 0.28;

      const x = 165 + layer * Math.cos(angle) + 5 * Math.sin(this.state.pulsePhase + i);
      const y = 160 + layer * Math.sin(angle) + 5 * Math.cos(this.state.pulsePhase + i);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        valleyChiralityK: psv > 0.7 ? 1 : i % 2 === 0 ? 1 : -1,
        berryCurvatureFlux: parseFloat((0.3 + 0.55 * dField * psv).toFixed(2)),
        fractionalChargeNu: parseFloat(nu.toFixed(2)),
        chiralPairingPhaseRad: parseFloat(((angle + this.state.pulsePhase) % (2 * Math.PI)).toFixed(2))
      });
    }
    this.state.flatBandNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.85 + this.state.displacementFieldVNm * 0.85;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerRhombohedralSound(): void {
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

      const fBase = 320 + this.state.displacementFieldVNm * 180;
      const fTarget = fBase + this.state.spinValleyPolarizationPsv * 220;

      osc1.frequency.setValueAtTime(fBase, t);
      osc1.frequency.exponentialRampToValueAtTime(fTarget, t + 0.34);

      osc2.frequency.setValueAtTime(fBase * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(fTarget * 1.5, t + 0.34);

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
      console.warn('Web Audio playback failed in RhombohedralGrapheneChiralSuperconductorEngine:', e);
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

export const rhombohedralGrapheneChiralSuperconductorEngine = new RhombohedralGrapheneChiralSuperconductorEngine();
