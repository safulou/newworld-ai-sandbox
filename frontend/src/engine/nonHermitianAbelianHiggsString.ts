/**
 * 非厄米阿貝爾-希格斯弦拓撲渦旋網絡引擎 (Non-Hermitian Abelian-Higgs String Vortex Network Engine)
 * 
 * 物理原理：
 * 1. U(1) 局部規範對稱性的阿貝爾-希格斯模型 (Abelian-Higgs Model) 描述自發對稱性破缺湧現的
 *    尼爾森-奧爾森 (Nielsen-Olesen) 拓撲宇宙弦與量子化磁通渦旋。
 * 2. 磁通量子化 Φ = n Φ₀ (Φ₀ = hc / 2e)，渦旋芯部由希格斯相干長度 ξ_H 與倫敦滲透深度 λ_L 決定，
 *    金茲堡-朗道參數 κ_GL = λ_L / ξ_H 決定弦間排斥或吸引網絡構型。
 * 3. 引入非厄米增益-損耗開放場 γ_NH，系統展現非厄米趨膚效應 (NH Skin Effect)，
 *    將超流磁通與拓撲電荷局域於邊界端點，伴隨非平庸複能譜拓撲卷繞數 W_NH。
 * 4. 在非厄米奇異點 (Exceptional Point, EP) 處，幾何特徵態合併，激發渦旋-反渦旋湮滅與弦網絡超相干重聯，
 *    宇宙弦線張力 μ_string = 2π v² ln(κ_GL) 釋放爆發性拓撲拓撲波。
 */

export type NonHermitianHiggsRegime = 
  | 'abelian-superconducting-vortex'
  | 'non-hermitian-skin-network'
  | 'exceptional-point-annihilation'
  | 'cosmic-string-reconnection';

export interface VortexNode {
  id: number;
  x: number;
  y: number;
  winding: number;
  fluxDensity: number;
  skinLocalization: number;
}

export interface NonHermitianHiggsState {
  higgsVevGev: number;              // 希格斯真空期望值 v (GeV, 0.5 ~ 5.0)
  nhDissipationRate: number;         // 非厄米耗散/增益率 γ_NH (0.0 ~ 1.0)
  vortexWindingN: number;            // 渦旋卷繞數 n (1 ~ 4)
  glParameterKappa: number;          // 金茲堡-朗道參數 κ_GL (0.5 ~ 4.0)
  stringTensionGev2: number;         // 宇宙弦張力 μ (GeV², ~ 2π v² ln κ)
  skinLocalizationFactor: number;    // 非厄米趨膚局域化係數 (0.0 ~ 1.0)
  exceptionalPointProximity: number; // 奇異點接近度 (0.0 ~ 1.0)
  reconnectionRateHz: number;        // 弦重聯率 (Hz)
  activeRegime: NonHermitianHiggsRegime;
  pulsePhase: number;
  vortices: VortexNode[];
}

const STORAGE_KEY = 'newworld_non_hermitian_abelian_higgs_state_v1';

export class NonHermitianAbelianHiggsEngine {
  private state: NonHermitianHiggsState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): NonHermitianHiggsState {
    const defaults: NonHermitianHiggsState = {
      higgsVevGev: 2.4,
      nhDissipationRate: 0.35,
      vortexWindingN: 2,
      glParameterKappa: 2.1,
      stringTensionGev2: 26.8,
      skinLocalizationFactor: 0.72,
      exceptionalPointProximity: 0.58,
      reconnectionRateHz: 42.0,
      activeRegime: 'non-hermitian-skin-network',
      pulsePhase: 0,
      vortices: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Non-Hermitian Higgs state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Non-Hermitian Higgs state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<NonHermitianHiggsState> {
    return this.state;
  }

  public setHiggsVev(vev: number): void {
    this.state.higgsVevGev = Math.max(0.5, Math.min(5.0, vev));
    this.recomputePhysics();
    this.saveState();
  }

  public setNhDissipation(gamma: number): void {
    this.state.nhDissipationRate = Math.max(0.0, Math.min(1.0, gamma));
    this.recomputePhysics();
    this.saveState();
  }

  public setVortexWinding(n: number): void {
    this.state.vortexWindingN = Math.max(1, Math.min(4, Math.round(n)));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: NonHermitianHiggsRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'abelian-superconducting-vortex':
        this.state.nhDissipationRate = 0.05;
        this.state.glParameterKappa = 1.8;
        this.state.vortexWindingN = 1;
        break;
      case 'non-hermitian-skin-network':
        this.state.nhDissipationRate = 0.45;
        this.state.glParameterKappa = 2.4;
        this.state.vortexWindingN = 2;
        break;
      case 'exceptional-point-annihilation':
        this.state.nhDissipationRate = 0.707; // EP condition (1/sqrt(2))
        this.state.glParameterKappa = 3.2;
        this.state.vortexWindingN = 3;
        break;
      case 'cosmic-string-reconnection':
        this.state.nhDissipationRate = 0.88;
        this.state.glParameterKappa = 3.8;
        this.state.vortexWindingN = 4;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const v = this.state.higgsVevGev;
    const gamma = this.state.nhDissipationRate;
    const n = this.state.vortexWindingN;
    const kappa = this.state.glParameterKappa;

    // 宇宙弦張力 μ = 2π v² * ln(max(1.1, κ)) * n
    const baseTension = 2 * Math.PI * Math.pow(v, 2) * Math.log(Math.max(1.1, kappa)) * n;
    this.state.stringTensionGev2 = parseFloat(baseTension.toFixed(2));

    // 非厄米趨膚局域化程度: tanh(3 * γ_NH) * (1 - exp(-v))
    const skin = Math.tanh(3 * gamma) * (1 - Math.exp(-v / 2));
    this.state.skinLocalizationFactor = parseFloat(Math.min(0.99, Math.max(0.01, skin)).toFixed(3));

    // 奇異點接近度 (EP 發生在 γ ≈ 1 / sqrt(2) ≈ 0.707)
    const epDist = Math.abs(gamma - 0.7071);
    const epProx = Math.exp(-Math.pow(epDist / 0.18, 2));
    this.state.exceptionalPointProximity = parseFloat(epProx.toFixed(3));

    // 弦拓撲重聯率: ν_rec = 12 * v * γ * (1 + epProx * 2)
    const recRate = 12 * v * (gamma + 0.1) * (1 + epProx * 2);
    this.state.reconnectionRateHz = parseFloat(recRate.toFixed(1));

    // 構建 6 個空間拓撲渦旋網格節點
    const nodes: VortexNode[] = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (this.state.pulsePhase * 0.1);
      const rad = 70 + 25 * Math.sin(this.state.pulsePhase * 0.5 + i);
      const cx = 150 + rad * Math.cos(angle);
      const cy = 150 + rad * Math.sin(angle);
      
      // 趨膚非對稱分佈 (聚集在右側與邊緣)
      const skinBias = (cx / 300) * this.state.skinLocalizationFactor;
      const flux = (n * v * 0.8) * (1 + skinBias);

      nodes.push({
        id: i,
        x: parseFloat(cx.toFixed(1)),
        y: parseFloat(cy.toFixed(1)),
        winding: (i % 2 === 0) ? n : -n,
        fluxDensity: parseFloat(flux.toFixed(2)),
        skinLocalization: parseFloat(skinBias.toFixed(3))
      });
    }
    this.state.vortices = nodes;
  }

  public update(dtSeconds: number): void {
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * 3.0) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerChirpSound(): void {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      const baseFreq = 300 + this.state.higgsVevGev * 80;
      const targetFreq = baseFreq + this.state.exceptionalPointProximity * 450;

      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.28);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, t + 0.45);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch (e) {
      console.warn('Web Audio playback failed in NonHermitianHiggsEngine:', e);
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

export const nonHermitianAbelianHiggsEngine = new NonHermitianAbelianHiggsEngine();
