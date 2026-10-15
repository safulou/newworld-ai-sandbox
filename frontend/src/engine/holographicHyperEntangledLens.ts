/**
 * 旋轉黑洞全息超糾纏引力透鏡天線引擎 (Holographic Hyper-Entangled Lens Antenna Engine)
 * 
 * 物理原理：
 * 1. 克爾旋轉黑洞 (Kerr Black Hole) 周圍存在臨界光子球 (Photon Sphere, r_ph) 與黑洞影子 (Black Hole Shadow)；
 *    當光子衝擊參數 b 逼近臨界值 b_c 時，進入強偏折極限 (Strong Deflection Limit, SDL)，偏折角對數發散：
 *    α(b) = -ā · ln(b/b_c - 1) + b̄
 *    光線沿著光子球旋轉多圈，在遠端觀察者處成像為無窮同心相對論愛因斯坦環 (Relativistic Einstein Rings)。
 * 2. 引力場強幾何曲率與時空拖曳將穿行光子之三重獨立自由度強烈耦合：
 *    - 偏振自由度 (Polarization: |H⟩, |V⟩)
 *    - 軌道角動量自由度 (Orbital Angular Momentum OAM: e^(iℓφ), ℓ = ±1, ±2)
 *    - 時域時隙自由度 (Time-Bin: |early⟩, |late⟩)
 *    構成高維超糾纏態 (Hyper-Entangled State) |Ψ_hyper⟩ = |Φ+⟩_pol ⊗ |Ψ+⟩_OAM ⊗ |Φ+⟩_time。
 * 3. 透過 AdS/CFT 對偶引力熱化與全息體積映射，黑洞視界對超糾纏態實施拓撲幾何糾錯，
 *    抑制外在環境退相干，使超糾纏傳輸保真度顯著提升至 F_hyper > 96%，建立跨維度量子星際通訊天線。
 */

export type HyperLensRegime = 
  | 'weak-deflection-lensing'
  | 'strong-deflection-einstein-ring'
  | 'hyper-entangled-multiplexing'
  | 'holographic-fidelity-amplification';

export interface HyperLensState {
  blackHoleSpinAStar: number;      // 黑洞無因次自旋參數 a* (0.0 ~ 0.998)
  blackHoleMassSolar: number;      // 黑洞質量 M (太陽質量單位, 10 ~ 100)
  impactParameterRatio: number;    // 衝擊參數比 b/b_c (1.001 ~ 2.5)
  deflectionAngleRad: number;      // 相對論光線偏折角 α(b) (rad)
  einsteinRingRadiusArcsec: number;// 愛因斯坦環角半徑 θ_E (角秒)
  oamModeNumberL: number;          // 軌道角動量量子數 ℓ (1 ~ 5)
  hyperEntanglementFidelity: number;// 三重超糾纏保真度 F_hyper (0.50 ~ 0.99)
  holographicGainDb: number;       // 全息引力透鏡增益 (dB)
  activeRegime: HyperLensRegime;
  pulsePhase: number;
  relativisticRings: Array<{ order: number; radius: number; intensity: number }>;
}

const STORAGE_KEY = 'newworld_holographic_hyper_entangled_lens_state_v1';

export class HolographicHyperEntangledLensEngine {
  private state: HyperLensState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HyperLensState {
    const defaults: HyperLensState = {
      blackHoleSpinAStar: 0.92,
      blackHoleMassSolar: 35.0,
      impactParameterRatio: 1.015,
      deflectionAngleRad: 4.85,
      einsteinRingRadiusArcsec: 18.4,
      oamModeNumberL: 2,
      hyperEntanglementFidelity: 0.968,
      holographicGainDb: 34.6,
      activeRegime: 'hyper-entangled-multiplexing',
      pulsePhase: 0,
      relativisticRings: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load HyperLens state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save HyperLens state to localStorage:', e);
      }
    }
  }

  public getState(): HyperLensState {
    return { ...this.state };
  }

  public setBlackHoleSpin(a: number): void {
    this.state.blackHoleSpinAStar = Math.max(0.0, Math.min(0.998, a));
    this.recomputePhysics();
    this.saveState();
  }

  public setImpactParameter(ratio: number): void {
    this.state.impactParameterRatio = Math.max(1.001, Math.min(2.5, ratio));
    this.recomputePhysics();
    this.saveState();
  }

  public setOamMode(l: number): void {
    this.state.oamModeNumberL = Math.max(1, Math.min(5, Math.round(l)));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HyperLensRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'weak-deflection-lensing':
        this.state.blackHoleSpinAStar = 0.2;
        this.state.impactParameterRatio = 2.2;
        this.state.oamModeNumberL = 1;
        break;
      case 'strong-deflection-einstein-ring':
        this.state.blackHoleSpinAStar = 0.7;
        this.state.impactParameterRatio = 1.05;
        this.state.oamModeNumberL = 2;
        break;
      case 'hyper-entangled-multiplexing':
        this.state.blackHoleSpinAStar = 0.92;
        this.state.impactParameterRatio = 1.015;
        this.state.oamModeNumberL = 3;
        break;
      case 'holographic-fidelity-amplification':
        this.state.blackHoleSpinAStar = 0.995;
        this.state.impactParameterRatio = 1.002;
        this.state.oamModeNumberL = 4;
        break;
    }
    this.recomputePhysics();
    this.playRegimeTransitionTone(regime);
    this.saveState();
  }

  public triggerHolographicFocusPulse(): void {
    this.state.pulsePhase = 1.0;
    this.playFocusTone();
  }

  private recomputePhysics(): void {
    const { blackHoleSpinAStar: a, impactParameterRatio: bRatio, oamModeNumberL: L, activeRegime } = this.state;

    // 強偏折極限 SDL：α(b) = -ā · ln(b/b_c - 1) + b̄
    const aBar = 0.95 + 0.3 * a;
    const bBar = 1.25 + 0.5 * a;
    const deltaB = bRatio - 1.0;
    const deflection = -aBar * Math.log(deltaB) + bBar;
    this.state.deflectionAngleRad = Math.max(0.1, deflection);

    // 愛因斯坦環半徑
    this.state.einsteinRingRadiusArcsec = 12.0 * Math.sqrt(this.state.blackHoleMassSolar / 20.0) * (1 + 0.25 * a);

    // 同心相對論愛因斯坦環序列生成
    const rings: Array<{ order: number; radius: number; intensity: number }> = [];
    for (let n = 1; n <= 4; n++) {
      const ringRadius = this.state.einsteinRingRadiusArcsec * (1.0 + 0.25 * Math.exp(-n * 0.8));
      const ringIntensity = Math.exp(-n * 0.7) * (1.0 + 0.2 * a);
      rings.push({ order: n, radius: ringRadius, intensity: ringIntensity });
    }
    this.state.relativisticRings = rings;

    // 超糾纏保真度 F_hyper 與全息增益
    if (activeRegime === 'weak-deflection-lensing') {
      this.state.hyperEntanglementFidelity = 0.65;
      this.state.holographicGainDb = 12.0;
    } else if (activeRegime === 'strong-deflection-einstein-ring') {
      this.state.hyperEntanglementFidelity = 0.82;
      this.state.holographicGainDb = 24.5;
    } else if (activeRegime === 'hyper-entangled-multiplexing') {
      this.state.hyperEntanglementFidelity = 0.94 + 0.01 * L;
      this.state.holographicGainDb = 35.0;
    } else { // holographic-fidelity-amplification
      this.state.hyperEntanglementFidelity = 0.985;
      this.state.holographicGainDb = 48.2;
    }
  }

  public update(dt: number): void {
    if (this.state.pulsePhase > 0) {
      this.state.pulsePhase = Math.max(0, this.state.pulsePhase - dt * 1.2);
    }
  }

  // 純代碼 Web Audio 程序化合成音效
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private playRegimeTransitionTone(regime: HyperLensRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const tones: Record<HyperLensRegime, number[]> = {
        'weak-deflection-lensing': [220, 330],
        'strong-deflection-einstein-ring': [261.63, 392.00, 523.25],
        'hyper-entangled-multiplexing': [329.63, 493.88, 659.25, 987.77],
        'holographic-fidelity-amplification': [440, 554.37, 659.25, 880]
      };

      const selected = tones[regime] || [330];
      selected.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
      });
    } catch (e) {
      console.warn('Lens audio error:', e);
    }
  }

  private playFocusTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      // 旋轉黑洞全息超糾纏引力透鏡聚焦共振音 (180 -> 720 Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Focus tone error:', e);
    }
  }
}

export const holographicHyperEntangledLensEngine = new HolographicHyperEntangledLensEngine();
