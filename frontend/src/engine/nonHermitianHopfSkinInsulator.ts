/**
 * 非厄米奇異環霍普夫絕緣體與高階皮膚渦旋反應器引擎
 * (Non-Hermitian Exceptional-Ring Hopf Insulator & Higher-Order Skin Vortex Reactor Engine)
 *
 * 物理原理：
 * 1. 三維雙帶非厄米霍普夫絕緣體 (3D Two-Band Non-Hermitian Hopf Insulator) 由布里淵區 S³ → S² 映射定義，
 *    其拓撲特性由整數霍普夫環繞不變量 W_H ∈ ℤ 以及複數能譜編織指數 (Complex Eigenenergy Braiding Index) ν_braid 共同刻畫。
 * 2. 引入非互易躍遷不對稱性 (Non-Reciprocal Hopping Asymmetry γ_skin, t_R ≠ t_L) 與增益-損耗項 iΓσ_z 後，
 *    原本的節點線分裂為三維動量空間中的外爾奇異環 (Weyl Exceptional Ring, WER)，在環上本徵態與本徵值同時簡併 (det H(k) = 0)。
 * 3. 在開邊界條件 (OBC) 下，高階非厄米趨膚效應 (Higher-Order Non-Hermitian Skin Effect, HONHSE) 迫使體態與表面態
 *    宏觀塌縮至三維晶格的頂角與稜線，形成手性皮膚渦旋凝聚態 (Corner Skin Vortex Condensate)，其局域化長度 ξ_skin ∝ 1 / ln|(t + γ)/(t - γ)|。
 */

export type NonHermitianHopfRegime =
  | 'hermitian-hopf-link'
  | 'weyl-exceptional-ring'
  | 'higher-order-corner-skin'
  | 'complex-braiding-vortex-collapse';

export interface HopfSkinNode {
  id: number;
  x: number;
  y: number;
  z: number;
  skinWeight: number;
  complexPhaseRad: number;
  vortexChirality: number;
}

export interface NonHermitianHopfSkinState {
  hopfLinkingNumberWh: number;        // 霍普夫拓撲環繞數 W_H (1 ~ 4)
  nonReciprocalGamma: number;         // 非互易趨膚不對稱參數 γ_skin (0.05 ~ 1.50)
  gainLossParameterMev: number;       // 非厄米增益損耗強度 Γ (meV, 1.0 ~ 40.0)
  exceptionalRingRadiusNmInv: number; // 外爾奇異環半徑 R_EP (nm⁻¹)
  skinLocalizationXiNm: number;       // 趨膚局域化長度 ξ_skin (nm)
  complexBraidingIndex: number;       // 複數能譜編織指數 ν_braid
  cornerSkinDensity: number;          // 高階頂角皮膚渦旋密度 ρ_corner (10¹² cm⁻²)
  activeRegime: NonHermitianHopfRegime;
  pulsePhase: number;
  nodes: HopfSkinNode[];
}

const STORAGE_KEY = 'newworld_non_hermitian_hopf_skin_state_v1';

export class NonHermitianHopfSkinInsulatorEngine {
  private state: NonHermitianHopfSkinState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): NonHermitianHopfSkinState {
    const defaults: NonHermitianHopfSkinState = {
      hopfLinkingNumberWh: 2,
      nonReciprocalGamma: 0.65,
      gainLossParameterMev: 16.0,
      exceptionalRingRadiusNmInv: 0.42,
      skinLocalizationXiNm: 4.8,
      complexBraidingIndex: 4,
      cornerSkinDensity: 34.2,
      activeRegime: 'higher-order-corner-skin',
      pulsePhase: 0,
      nodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Non-Hermitian Hopf Skin state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Non-Hermitian Hopf Skin state:', e);
      }
    }
  }

  public getState(): Readonly<NonHermitianHopfSkinState> {
    return this.state;
  }

  public setHopfLinkingNumber(wh: number): void {
    this.state.hopfLinkingNumberWh = Math.max(1, Math.min(4, Math.round(wh)));
    this.recomputePhysics();
    this.saveState();
  }

  public setNonReciprocalGamma(gamma: number): void {
    this.state.nonReciprocalGamma = Math.max(0.05, Math.min(1.5, parseFloat(gamma.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setGainLossParameter(gainLoss: number): void {
    this.state.gainLossParameterMev = Math.max(1.0, Math.min(40.0, parseFloat(gainLoss.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: NonHermitianHopfRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'hermitian-hopf-link':
        this.state.hopfLinkingNumberWh = 1;
        this.state.nonReciprocalGamma = 0.08;
        this.state.gainLossParameterMev = 2.0;
        break;
      case 'weyl-exceptional-ring':
        this.state.hopfLinkingNumberWh = 2;
        this.state.nonReciprocalGamma = 0.45;
        this.state.gainLossParameterMev = 18.5;
        break;
      case 'higher-order-corner-skin':
        this.state.hopfLinkingNumberWh = 3;
        this.state.nonReciprocalGamma = 0.95;
        this.state.gainLossParameterMev = 24.0;
        break;
      case 'complex-braiding-vortex-collapse':
        this.state.hopfLinkingNumberWh = 4;
        this.state.nonReciprocalGamma = 1.40;
        this.state.gainLossParameterMev = 36.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const wh = this.state.hopfLinkingNumberWh;
    const gamma = this.state.nonReciprocalGamma;
    const gl = this.state.gainLossParameterMev;

    // 外爾奇異環半徑 R_EP ∝ sqrt(Γ) * (1 + 0.25 * W_H)
    const rEp = 0.08 * Math.sqrt(gl) * (1 + 0.2 * wh);
    this.state.exceptionalRingRadiusNmInv = parseFloat(rEp.toFixed(3));

    // 趨膚局域化長度 ξ_skin = 3.2 / ln(1 + 2 * γ_skin)
    const xi = 3.2 / Math.log(1 + 2.0 * gamma);
    this.state.skinLocalizationXiNm = parseFloat(Math.max(0.8, xi).toFixed(2));

    // 複數能譜編織指數 ν_braid = W_H * round(1 + γ_skin * 1.5)
    this.state.complexBraidingIndex = Math.max(1, Math.round(wh * (1 + gamma * 1.4)));

    // 高階頂角皮膚渦旋密度 ρ_corner
    const rhoCorner = 12.5 * wh * gamma * Math.sqrt(gl / 10.0);
    this.state.cornerSkinDensity = parseFloat(rhoCorner.toFixed(1));

    // 生成 16 個奇異環與高階頂角皮膚渦旋採樣節點
    const nodes: HopfSkinNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * 2 * Math.PI;
      // 結合霍普夫環繞與高階頂角吸引勢
      const ringRadius = 65 * (0.6 + 0.4 * rEp);
      const hopfMod = Math.cos(wh * t + this.state.pulsePhase);
      const xBase = ringRadius * Math.cos(t) + 28 * Math.cos((wh + 1) * t);
      const yBase = ringRadius * Math.sin(t) + 28 * Math.sin((wh + 1) * t);
      const zBase = 35 * hopfMod;

      // 趨膚效應將波函數向右上/左下高階頂角牽引
      const skinPull = Math.min(0.65, gamma * 0.35);
      const cornerX = i % 2 === 0 ? 85 : -85;
      const cornerY = i % 4 < 2 ? -80 : 80;

      const x3d = xBase * (1 - skinPull) + cornerX * skinPull;
      const y3d = yBase * (1 - skinPull) + cornerY * skinPull;

      const projX = 160 + x3d;
      const projY = 155 + y3d + zBase * 0.25;
      const weight = Math.min(1.0, 0.25 + gamma * 0.45 + 0.2 * Math.abs(hopfMod));

      nodes.push({
        id: i,
        x: parseFloat(projX.toFixed(1)),
        y: parseFloat(projY.toFixed(1)),
        z: parseFloat(zBase.toFixed(1)),
        skinWeight: parseFloat(weight.toFixed(2)),
        complexPhaseRad: parseFloat(((t * wh + this.state.pulsePhase) % (2 * Math.PI)).toFixed(2)),
        vortexChirality: i % 2 === 0 ? 1 : -1
      });
    }
    this.state.nodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 1.1 + this.state.nonReciprocalGamma * 1.2;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerHopfSkinSound(): void {
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

      const baseFreq = 260 + this.state.hopfLinkingNumberWh * 75;
      const targetFreq = baseFreq + this.state.nonReciprocalGamma * 240;

      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.1, t + 0.55);

      osc2.frequency.setValueAtTime(baseFreq * 1.414, t);
      osc2.frequency.exponentialRampToValueAtTime(targetFreq * 1.414, t + 0.3);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.58);
      osc2.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in NonHermitianHopfSkinInsulatorEngine:', e);
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

export const nonHermitianHopfSkinInsulatorEngine = new NonHermitianHopfSkinInsulatorEngine();
