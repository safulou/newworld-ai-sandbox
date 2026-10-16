/**
 * 超對稱量子色動力學磁單極玻色凝聚環引擎 (Supersymmetric QCD Magnetic Monopole BEC Ring Engine)
 * 
 * 物理原理：
 * 1. 在 𝒩=2 超對稱楊-米爾斯理論 (Seiberg-Witten Theory) 中，當庫侖支 (Coulomb Branch) 模參數 u 調諧至
 *    阿蓋爾斯-道格拉斯 (Argyres-Douglas) 奇異臨界點時，磁性荷物態（特霍夫特-波利亞科夫磁單極子與雙離子）變為無質量。
 * 2. 磁單極子自發發生玻色-愛因斯坦凝聚態 (Monopole BEC)，激發對偶邁斯納效應 (Dual Meissner Effect)：
 *    超導體排斥磁場；對偶超導體排斥電場，將夸克-反夸克之間的色電通量擠壓為一維阿布里科索夫-尼爾森-奧爾森色弦管 (Color Flux Tubes)，
 *    產生線性夸克禁閉勢 V(r) = σ_string · r。
 * 3. 在環狀圓環面 (Toroidal Ring) 幾何邊界下，凝聚的磁單極子誘導對偶阿哈羅諾夫-玻姆效應 (Dual AB Effect)
 *    並支撐宏觀無耗散持久磁超電流 (Persistent Magnetic Supercurrent I_mag)。
 */

export type SusyMonopoleRegime = 
  | 'coulomb-massless-monopole'
  | 'dual-meissner-condensation'
  | 'confined-color-string-tube'
  | 'argyres-douglas-critical-point';

export interface MonopoleRingNode {
  id: number;
  thetaRad: number;
  xProj: number;
  yProj: number;
  monopolePhase: number;
  electricFluxDensity: number;
  isCondensed: boolean;
}

export interface SusyMonopoleState {
  monopoleDensityRhoM: number;    // 磁單極凝聚密度 ρ_M (10¹⁶ cm⁻³, 1.0 ~ 50.0)
  colorStringTensionGevFm: number;// 色弦張力 σ_E (GeV/fm, 0.2 ~ 5.0)
  seibergWittenTauReal: number;   // SW 模參數實部 Re(τ) = θ/π (-1.0 ~ 1.0)
  seibergWittenTauImag: number;   // SW 模參數虛部 Im(τ) = 8π/g² (0.5 ~ 6.0)
  persistentDualCurrentUa: number;// 對偶持久磁超電流 I_mag (μA)
  dualMeissnerPenetrationNm: number;// 對偶穿透深度 λ_dual (nm)
  activeRegime: SusyMonopoleRegime;
  pulsePhase: number;
  ringNodes: MonopoleRingNode[];
}

const STORAGE_KEY = 'newworld_susy_qcd_monopole_bec_state_v1';

export class SusyQcdMonopoleBecRingEngine {
  private state: SusyMonopoleState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): SusyMonopoleState {
    const defaults: SusyMonopoleState = {
      monopoleDensityRhoM: 18.5,
      colorStringTensionGevFm: 1.15,
      seibergWittenTauReal: 0.1,
      seibergWittenTauImag: 2.8,
      persistentDualCurrentUa: 42.6,
      dualMeissnerPenetrationNm: 8.4,
      activeRegime: 'dual-meissner-condensation',
      pulsePhase: 0,
      ringNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load SUSY Monopole state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save SUSY Monopole state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<SusyMonopoleState> {
    return this.state;
  }

  public setMonopoleDensity(rho: number): void {
    this.state.monopoleDensityRhoM = Math.max(1.0, Math.min(50.0, rho));
    this.recomputePhysics();
    this.saveState();
  }

  public setStringTension(sigma: number): void {
    this.state.colorStringTensionGevFm = Math.max(0.2, Math.min(5.0, sigma));
    this.recomputePhysics();
    this.saveState();
  }

  public setSeibergWittenCoupling(imTau: number): void {
    this.state.seibergWittenTauImag = Math.max(0.5, Math.min(6.0, imTau));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: SusyMonopoleRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'coulomb-massless-monopole':
        this.state.monopoleDensityRhoM = 3.5;
        this.state.colorStringTensionGevFm = 0.35;
        this.state.seibergWittenTauImag = 5.2;
        break;
      case 'dual-meissner-condensation':
        this.state.monopoleDensityRhoM = 16.0;
        this.state.colorStringTensionGevFm = 1.2;
        this.state.seibergWittenTauImag = 3.0;
        break;
      case 'confined-color-string-tube':
        this.state.monopoleDensityRhoM = 32.0;
        this.state.colorStringTensionGevFm = 3.8;
        this.state.seibergWittenTauImag = 1.8;
        break;
      case 'argyres-douglas-critical-point':
        this.state.monopoleDensityRhoM = 46.0;
        this.state.colorStringTensionGevFm = 4.6;
        this.state.seibergWittenTauImag = 0.8;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rho = this.state.monopoleDensityRhoM;
    const sigma = this.state.colorStringTensionGevFm;
    const imTau = this.state.seibergWittenTauImag;

    // 對偶穿透深度 λ_dual = 1 / sqrt(ρ_M)
    const lambdaDual = 36.0 / Math.sqrt(rho);
    this.state.dualMeissnerPenetrationNm = parseFloat(Math.min(50.0, Math.max(2.0, lambdaDual)).toFixed(1));

    // 持久對偶磁超電流 I_mag = 2.5 * rho * sigma / imTau
    const iMag = (2.2 * rho * sigma) / Math.max(0.4, imTau);
    this.state.persistentDualCurrentUa = parseFloat(iMag.toFixed(1));

    // 生成圓環環面上 12 個對偶磁單極凝聚節點
    const nodes: MonopoleRingNode[] = [];
    const count = 12;
    const ringRadius = 75;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * 2 * Math.PI;
      const dynAngle = theta + this.state.pulsePhase * 0.8;
      const rMod = ringRadius + 12 * Math.sin(theta * 3 + this.state.pulsePhase);
      
      const cx = 150 + rMod * Math.cos(dynAngle);
      const cy = 150 + rMod * Math.sin(dynAngle);

      const dynFlux = (sigma / 5.0) * 0.7 + 0.3 * Math.cos(theta * 2 + this.state.pulsePhase * 1.5);
      const isCond = this.state.activeRegime !== 'coulomb-massless-monopole';

      nodes.push({
        id: i,
        thetaRad: parseFloat(theta.toFixed(2)),
        xProj: parseFloat(cx.toFixed(1)),
        yProj: parseFloat(cy.toFixed(1)),
        monopolePhase: parseFloat(((dynAngle) % (2 * Math.PI)).toFixed(2)),
        electricFluxDensity: parseFloat(Math.min(1.0, Math.max(0.05, dynFlux)).toFixed(2)),
        isCondensed: isCond
      });
    }
    this.state.ringNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 1.0 + (this.state.colorStringTensionGevFm / 2.0);
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerMonopoleSound(): void {
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

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';

      const baseFreq = 200 + this.state.monopoleDensityRhoM * 6;
      const peakFreq = baseFreq + this.state.colorStringTensionGevFm * 120;

      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(peakFreq, t + 0.22);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, t + 0.48);

      osc2.frequency.setValueAtTime(baseFreq * 1.25, t);
      osc2.frequency.exponentialRampToValueAtTime(peakFreq * 1.25, t + 0.22);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.52);
      osc2.stop(t + 0.52);
    } catch (e) {
      console.warn('Web Audio playback failed in SusyQcdMonopoleBecRingEngine:', e);
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

export const susyQcdMonopoleBecRingEngine = new SusyQcdMonopoleBecRingEngine();
