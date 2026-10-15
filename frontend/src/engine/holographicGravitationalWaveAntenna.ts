/**
 * 全息引力波奇異偏振探測天線引擎 (Holographic Gravitational Wave Exotic Polarization Antenna Engine)
 * 
 * 物理原理：
 * 1. 廣義相對論 (GR) 僅預言兩種無跡橫向張量偏振模 (Tensor Modes: h+, h×)。然而在超越愛因斯坦引力的
 *    修正引力理論（如 f(R) 理論、雙度規引力及全息弦論高階修正）中，引力子湧現多達 6 種獨立偏振自由度：
 *    - 橫向張量模 (Tensor Modes, Spin-2): h+, h×
 *    - 純量呼吸模與縱向模 (Scalar Modes, Spin-0): h_b (Breathing), h_L (Longitudinal)
 *    - 剪切向量模 (Vector Modes, Spin-1): h_x, h_y
 * 2. 透過 AdS/CFT 全息對偶架構，引力波入射於全息量子干涉腔，在邊界共形場論 (CFT) 激發相應的
 *    能動張量跡反常 ⟨T^μ_μ⟩ ∝ h_b 與拓撲自旋流 ⟨J^μ⟩ ∝ (h_x, h_y)。
 * 3. 雙臂長度調制 ΔL / L 響應天線方向矩陣 F_p(θ, φ)，光學法布里-珀羅共振腔品質因數 Q_opt
 *    顯著放大干涉條紋對比度，形成高敏銳度全息信噪比 SNR_dB。
 * 4. 緊湊雙星旋近併合引發特徵引力波 Chirp 頻率演化 f_GW(t)，呼吸標量模調製振幅 envelope。
 */

export type HolographicGwRegime = 
  | 'general-relativity-tensor'
  | 'breathing-scalar-dominant'
  | 'vector-shear-resonance'
  | 'full-six-polarization-extreme';

export interface PolarizationPattern {
  name: string;
  type: 'tensor' | 'scalar' | 'vector';
  amplitude: number;
  phaseShiftRad: number;
  axisRatioX: number;
  axisRatioY: number;
}

export interface HolographicGwState {
  exoticPolarizationRatio: number;   // 奇異偏振比率 ξ_exotic (0.0 ~ 1.0)
  skyInclinationDeg: number;         // 天線傾角 θ_sky (度, 0° ~ 180°)
  cavityQualityLogQ: number;         // 共振腔品質因數 log10(Q_opt) (4.0 ~ 7.0)
  chirpMassSolarM: number;           // 啁啾質量 M_c (M_⊙, 1.0 ~ 60.0)
  strainHPlus: number;               // 張量應變 h+ (10⁻²¹)
  strainHCross: number;              // 張量應變 h× (10⁻²¹)
  strainHBreathing: number;          // 呼吸模應變 h_b (10⁻²¹)
  strainHLongitudinal: number;       // 縱向模應變 h_L (10⁻²¹)
  strainHVector: number;             // 向量模應變 h_v (10⁻²¹)
  holographicSnrDb: number;          // 全息重構信噪比 (dB)
  activeRegime: HolographicGwRegime;
  pulsePhase: number;
  patterns: PolarizationPattern[];
}

const STORAGE_KEY = 'newworld_holographic_gw_antenna_state_v1';

export class HolographicGravitationalWaveAntennaEngine {
  private state: HolographicGwState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HolographicGwState {
    const defaults: HolographicGwState = {
      exoticPolarizationRatio: 0.42,
      skyInclinationDeg: 35.0,
      cavityQualityLogQ: 5.6,
      chirpMassSolarM: 28.5,
      strainHPlus: 1.25,
      strainHCross: 0.98,
      strainHBreathing: 0.65,
      strainHLongitudinal: 0.32,
      strainHVector: 0.54,
      holographicSnrDb: 34.2,
      activeRegime: 'breathing-scalar-dominant',
      pulsePhase: 0,
      patterns: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Holographic GW Antenna state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Holographic GW Antenna state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<HolographicGwState> {
    return this.state;
  }

  public setExoticRatio(ratio: number): void {
    this.state.exoticPolarizationRatio = Math.max(0.0, Math.min(1.0, ratio));
    this.recomputePhysics();
    this.saveState();
  }

  public setSkyInclination(deg: number): void {
    this.state.skyInclinationDeg = Math.max(0.0, Math.min(180.0, deg));
    this.recomputePhysics();
    this.saveState();
  }

  public setCavityQuality(logQ: number): void {
    this.state.cavityQualityLogQ = Math.max(4.0, Math.min(7.0, logQ));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HolographicGwRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'general-relativity-tensor':
        this.state.exoticPolarizationRatio = 0.02;
        this.state.cavityQualityLogQ = 4.8;
        this.state.skyInclinationDeg = 20.0;
        break;
      case 'breathing-scalar-dominant':
        this.state.exoticPolarizationRatio = 0.55;
        this.state.cavityQualityLogQ = 5.8;
        this.state.skyInclinationDeg = 45.0;
        break;
      case 'vector-shear-resonance':
        this.state.exoticPolarizationRatio = 0.72;
        this.state.cavityQualityLogQ = 6.4;
        this.state.skyInclinationDeg = 75.0;
        break;
      case 'full-six-polarization-extreme':
        this.state.exoticPolarizationRatio = 0.95;
        this.state.cavityQualityLogQ = 6.9;
        this.state.skyInclinationDeg = 90.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const xi = this.state.exoticPolarizationRatio;
    const theta = (this.state.skyInclinationDeg * Math.PI) / 180;
    const logQ = this.state.cavityQualityLogQ;
    const mc = this.state.chirpMassSolarM;

    // 基本張量應變振幅 (10⁻²¹)，正比於 (M_c / 30)^(5/6)
    const baseStrain = Math.pow(mc / 30, 0.833) * 1.2;
    this.state.strainHPlus = parseFloat((baseStrain * Math.cos(theta)).toFixed(2));
    this.state.strainHCross = parseFloat((baseStrain * Math.sin(theta) * 0.85).toFixed(2));

    // 奇異純量與向量偏振應變
    this.state.strainHBreathing = parseFloat((baseStrain * xi * 1.15).toFixed(2));
    this.state.strainHLongitudinal = parseFloat((baseStrain * xi * Math.abs(Math.cos(2 * theta)) * 0.75).toFixed(2));
    this.state.strainHVector = parseFloat((baseStrain * xi * Math.sin(theta) * 0.95).toFixed(2));

    // 全息信噪比 SNR (dB) = 15 + logQ * 3.5 + xi * 6.5
    const snr = 15 + logQ * 3.5 + xi * 6.5;
    this.state.holographicSnrDb = parseFloat(snr.toFixed(1));

    // 構建 6 大偏振四極矩受激形變模式
    const phase = this.state.pulsePhase;
    this.state.patterns = [
      {
        name: 'h+ (Tensor Plus)',
        type: 'tensor',
        amplitude: this.state.strainHPlus,
        phaseShiftRad: 0,
        axisRatioX: 1 + 0.3 * Math.cos(phase),
        axisRatioY: 1 - 0.3 * Math.cos(phase)
      },
      {
        name: 'h× (Tensor Cross)',
        type: 'tensor',
        amplitude: this.state.strainHCross,
        phaseShiftRad: Math.PI / 4,
        axisRatioX: 1 + 0.25 * Math.sin(phase),
        axisRatioY: 1 - 0.25 * Math.sin(phase)
      },
      {
        name: 'h_b (Breathing Scalar)',
        type: 'scalar',
        amplitude: this.state.strainHBreathing,
        phaseShiftRad: 0,
        axisRatioX: 1 + 0.35 * Math.cos(phase * 1.2),
        axisRatioY: 1 + 0.35 * Math.cos(phase * 1.2) // 同步呼吸膨脹收縮
      },
      {
        name: 'h_L (Longitudinal Scalar)',
        type: 'scalar',
        amplitude: this.state.strainHLongitudinal,
        phaseShiftRad: Math.PI / 2,
        axisRatioX: 1.0,
        axisRatioY: 1 + 0.4 * Math.sin(phase * 1.2)
      },
      {
        name: 'h_x (Vector Shear X)',
        type: 'vector',
        amplitude: this.state.strainHVector,
        phaseShiftRad: Math.PI / 3,
        axisRatioX: 1 + 0.3 * Math.sin(phase * 1.4),
        axisRatioY: 1 + 0.15 * Math.cos(phase * 1.4)
      },
      {
        name: 'h_y (Vector Shear Y)',
        type: 'vector',
        amplitude: this.state.strainHVector * 0.9,
        phaseShiftRad: (2 * Math.PI) / 3,
        axisRatioX: 1 + 0.15 * Math.cos(phase * 1.4),
        axisRatioY: 1 + 0.3 * Math.sin(phase * 1.4)
      }
    ];
  }

  public update(dtSeconds: number): void {
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * 3.5) % (Math.PI * 200);
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

      osc.type = 'sine';

      // 典型的雙星吸積啁啾音: 從 80 Hz 指數掃頻至 850 Hz + 呼吸調製
      const startFreq = 80;
      const endFreq = 750 + this.state.exoticPolarizationRatio * 200;

      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.55);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.58);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.6);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicGwEngine:', e);
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

export const holographicGravitationalWaveAntennaEngine = new HolographicGravitationalWaveAntennaEngine();
