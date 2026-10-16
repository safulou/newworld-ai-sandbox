/**
 * 相對論性引力波磁流體阿爾文孤子共振腔引擎
 * (Relativistic Gravitational-Wave Magnetohydrodynamic Alfvén Soliton Resonator Engine)
 *
 * 物理原理：
 * 1. 在廣義相對論磁流體力學 (GRMHD) 框架下，強磁化雙中子星併合或磁星磁層 (B ~ 10¹³ - 10¹⁶ G) 中的張量引力波度規微擾 h_{+,×}
 *    透過蓋爾森斯坦-阿爾文參量耦合 (Gertsenshtein-Alfvén Parametric Coupling) 直接驅動相對論性磁聲波與阿爾文波。
 * 2. 相對論阿爾文波速由磁化參數 σ_mag 決定：v_A / c = √(σ_mag / (1 + σ_mag))，其中 σ_mag = B² / (4π ρ h c²)。
 * 3. 當引力波應變振幅 h_0 超過非線性色散閾值時，導數非線性薛丁格方程 (DNLS) 的包絡塌縮為高相干相對論阿爾文孤子 (Relativistic Alfvén Soliton)，
 *    觸發坡印廷通量激增 (Poynting Flux Surge, S_EM) 與快速電波爆發 (Fast Radio Burst, FRB) 相干前兆輻射。
 */

export type GravitationalAlfvenRegime =
  | 'linear-alfven-gw-dispersion'
  | 'parametric-gertsenshtein-resonance'
  | 'dnls-alfven-envelope-soliton'
  | 'relativistic-frb-poynting-shock';

export interface AlfvenWavefrontNode {
  id: number;
  x: number;
  y: number;
  bTransverseRatio: number;
  metricStrainLocal: number;
  solitonEnvelope: number;
}

export interface GravitationalAlfvenSolitonState {
  gwStrainLog10: number;              // 引力波特徵應變對數 log10(h_0) (-22.0 ~ -16.0)
  magnetizationSigma: number;         // 相對論磁化參數 σ_mag = B²/(4πρhc²) (0.5 ~ 50.0)
  alfvenVelocityRatioC: number;       // 相對論阿爾文波速比 v_A / c (0.577 ~ 0.990)
  poyntingFluxLuminosity: number;     // 電磁坡印廷輻射光度 L_EM (10⁴⁴ erg/s)
  gertsenshteinConversionPct: number; // 引力波-阿爾文孤子參量轉換率 η_GW→A (%)
  solitonMachNumber: number;          // 相對論磁聲孤子馬赫數 M_A
  activeRegime: GravitationalAlfvenRegime;
  pulsePhase: number;
  waveNodes: AlfvenWavefrontNode[];
}

const STORAGE_KEY = 'newworld_gravitational_alfven_soliton_state_v1';

export class GravitationalAlfvenSolitonResonatorEngine {
  private state: GravitationalAlfvenSolitonState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): GravitationalAlfvenSolitonState {
    const defaults: GravitationalAlfvenSolitonState = {
      gwStrainLog10: -18.5,
      magnetizationSigma: 14.0,
      alfvenVelocityRatioC: 0.966,
      poyntingFluxLuminosity: 42.8,
      gertsenshteinConversionPct: 18.4,
      solitonMachNumber: 2.35,
      activeRegime: 'dnls-alfven-envelope-soliton',
      pulsePhase: 0,
      waveNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Gravitational Alfven Soliton state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Gravitational Alfven Soliton state:', e);
      }
    }
  }

  public getState(): Readonly<GravitationalAlfvenSolitonState> {
    return this.state;
  }

  public setGwStrainLog10(logH: number): void {
    this.state.gwStrainLog10 = Math.max(-22.0, Math.min(-16.0, parseFloat(logH.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setMagnetizationSigma(sigma: number): void {
    this.state.magnetizationSigma = Math.max(0.5, Math.min(50.0, parseFloat(sigma.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setSolitonMachNumber(mach: number): void {
    this.state.solitonMachNumber = Math.max(1.05, Math.min(5.0, parseFloat(mach.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: GravitationalAlfvenRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'linear-alfven-gw-dispersion':
        this.state.gwStrainLog10 = -21.5;
        this.state.magnetizationSigma = 2.0;
        this.state.solitonMachNumber = 1.15;
        break;
      case 'parametric-gertsenshtein-resonance':
        this.state.gwStrainLog10 = -19.5;
        this.state.magnetizationSigma = 10.0;
        this.state.solitonMachNumber = 1.85;
        break;
      case 'dnls-alfven-envelope-soliton':
        this.state.gwStrainLog10 = -18.0;
        this.state.magnetizationSigma = 22.0;
        this.state.solitonMachNumber = 2.80;
        break;
      case 'relativistic-frb-poynting-shock':
        this.state.gwStrainLog10 = -16.5;
        this.state.magnetizationSigma = 45.0;
        this.state.solitonMachNumber = 4.40;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const logH = this.state.gwStrainLog10;
    const sigma = this.state.magnetizationSigma;
    const mach = this.state.solitonMachNumber;

    // 相對論阿爾文波速比 v_A / c = sqrt(σ / (1 + σ))
    const vaRatio = Math.sqrt(sigma / (1.0 + sigma));
    this.state.alfvenVelocityRatioC = parseFloat(vaRatio.toFixed(4));

    // 正規化應變因子 (0.1 ~ 6.1)
    const strainFactor = logH + 22.1;

    // 蓋爾森斯坦-阿爾文參量轉換率 η (%)
    const conversion = Math.min(96.5, 1.8 * strainFactor * Math.sqrt(sigma) * (0.7 + 0.3 * mach));
    this.state.gertsenshteinConversionPct = parseFloat(conversion.toFixed(1));

    // 電磁坡印廷輻射光度 L_EM (10⁴⁴ erg/s)
    const lum = 3.5 * Math.pow(strainFactor, 1.4) * (sigma / 5.0) * mach;
    this.state.poyntingFluxLuminosity = parseFloat(lum.toFixed(1));

    // 生成 18 個相對論阿爾文-引力波孤子波前節點
    const nodes: AlfvenWavefrontNode[] = [];
    const count = 18;
    const centerIdx = (count - 1) / 2;
    for (let i = 0; i < count; i++) {
      const normX = (i - centerIdx) / 4.2;
      const movingOffset = normX - 1.6 * Math.sin(this.state.pulsePhase * 0.7);
      // DNLS sech 雙曲正割孤子包絡
      const sechEnv = 1.0 / Math.cosh(movingOffset * (0.8 + 0.25 * mach));
      const carrier = Math.cos(i * 0.9 - this.state.pulsePhase * 2.5);
      const bRatio = sechEnv * carrier * (0.35 + 0.1 * strainFactor);

      const xPos = 35 + (i / (count - 1)) * 370;
      const yPos = 180 - bRatio * 105;

      nodes.push({
        id: i,
        x: parseFloat(xPos.toFixed(1)),
        y: parseFloat(yPos.toFixed(1)),
        bTransverseRatio: parseFloat(bRatio.toFixed(3)),
        metricStrainLocal: parseFloat((0.2 * strainFactor * Math.sin(i * 0.6 + this.state.pulsePhase)).toFixed(3)),
        solitonEnvelope: parseFloat(sechEnv.toFixed(3))
      });
    }
    this.state.waveNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const rate = 1.2 + this.state.alfvenVelocityRatioC * 1.8;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAlfvenSolitonSound(): void {
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

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      const startFreq = 95 + this.state.magnetizationSigma * 3.5;
      const chirpPeak = startFreq + this.state.solitonMachNumber * 120;

      osc1.frequency.setValueAtTime(startFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(chirpPeak, t + 0.38);

      osc2.frequency.setValueAtTime(startFreq * 2.0, t);
      osc2.frequency.exponentialRampToValueAtTime(chirpPeak * 1.5, t + 0.38);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.56);
      osc2.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in GravitationalAlfvenSolitonResonatorEngine:', e);
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

export const gravitationalAlfvenSolitonResonatorEngine = new GravitationalAlfvenSolitonResonatorEngine();
