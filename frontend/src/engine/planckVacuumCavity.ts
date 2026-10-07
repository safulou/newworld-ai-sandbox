/**
 * 極限普朗克常數真空相變臨界諧振腔 (Planck Constant Dynamical Vacuum Cavity)
 * 
 * 理論基礎：
 * 1. 動態卡西米爾效應 (Dynamical Casimir Effect, Moore 1970, Wilson et al. 2011)
 * 2. SQUID 超導反射鏡以高達 GHz 頻率相對論性抖動邊界，將量子真空零點虛光子轉化為成對真實微波光子
 * 3. 臨界真空相變：當微觀有效普朗克作用量接近臨界點時，真空自發對稱破缺湧現宏觀量子凝聚
 * 4. 4 大共振腔體制：
 *    - squid_dynamical_vacuum: SQUID 動態微波光子激發
 *    - vibrating_mirror: 超導反射鏡光速抖動
 *    - critical_vacuum_bec: 臨界真空玻色凝聚相變
 *    - planck_fluctuation_tap: 普朗克微觀量子起伏萃取
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成動態卡西米爾微波光子雙音、反射鏡震鳴與真空臨界相變衝擊波
 * - HTML5 Canvas 2D 呈現超導振動鏡面、量子真空虛粒子湧現轉化真實光子對波紋與腔內駐波
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type PlanckCavityRegime = 
  | 'squid_dynamical_vacuum' 
  | 'vibrating_mirror' 
  | 'critical_vacuum_bec' 
  | 'planck_fluctuation_tap';

export interface DynamicalPhotonPair {
  id: string;
  frequencyGhz: number;
  modeNumber: number;
  quantumSqueezingDb: number;
  entangled: boolean;
  emittedAt: number;
}

export interface PlanckCavityState {
  regime: PlanckCavityRegime;
  mirrorFrequencyGhz: number; // 鏡面振動頻率 ω_m (2.0 ~ 24.0 GHz)
  cavityQualityFactor: number; // 品質因子 Q (10^4 ~ 10^7)
  photonProductionRateKps: number; // 光子產生率 (kilo-photons/s)
  effectivePlanckScale: number; // 有效普朗克作用量標度 ħ_eff
  phaseTransitionCriticalityPercent: number; // 真空相變臨界度 (0 ~ 100%)
  extractedVacuumEnergyPj: number; // 萃取真空能量 (pJ)
  photonPairs: DynamicalPhotonPair[];
  autoExcite: boolean;
  totalPhotonsHarvested: number;
}

const STORAGE_KEY = 'newworld_planck_vacuum_cavity';

class PlanckVacuumCavityEngine {
  private state: PlanckCavityState = {
    regime: 'squid_dynamical_vacuum',
    mirrorFrequencyGhz: 10.4,
    cavityQualityFactor: 250000.0,
    photonProductionRateKps: 185.0,
    effectivePlanckScale: 1.054,
    phaseTransitionCriticalityPercent: 78.4,
    extractedVacuumEnergyPj: 830.0,
    photonPairs: [],
    autoExcite: true,
    totalPhotonsHarvested: 26
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeCavityDynamics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): PlanckCavityState {
    return { ...this.state, photonPairs: [...this.state.photonPairs] };
  }

  public setRegime(regime: PlanckCavityRegime): void {
    this.state.regime = regime;
    this.recomputeCavityDynamics();
    this.playVacuumPhaseShockwave();
    this.saveState();
  }

  public setMirrorFrequencyGhz(freq: number): void {
    this.state.mirrorFrequencyGhz = Math.max(2.0, Math.min(24.0, parseFloat(freq.toFixed(1))));
    this.recomputeCavityDynamics();
    this.saveState();
  }

  public setCavityQualityFactor(q: number): void {
    this.state.cavityQualityFactor = Math.max(10000, Math.min(10000000, q));
    this.recomputeCavityDynamics();
    this.saveState();
  }

  public setAutoExcite(enabled: boolean): void {
    this.state.autoExcite = enabled;
    this.saveState();
  }

  /**
   * 計算動態卡西米爾效應產生率與臨界相變度
   */
  public recomputeCavityDynamics(): void {
    const f = this.state.mirrorFrequencyGhz;
    const q = this.state.cavityQualityFactor;

    // 動態卡西米爾光子產生率 N_photons ∝ (v/c)² · (f / 2) · log(Q)
    let boost = 1.0;
    if (this.state.regime === 'squid_dynamical_vacuum') boost = 1.6;
    if (this.state.regime === 'vibrating_mirror') boost = 1.2;
    if (this.state.regime === 'critical_vacuum_bec') boost = 2.4;
    if (this.state.regime === 'planck_fluctuation_tap') boost = 1.9;

    const rate = (f * f * 1.8 + Math.log10(q) * 22.0) * boost;
    this.state.photonProductionRateKps = parseFloat(rate.toFixed(1));

    // 真空相變臨界度 (隨頻率逼近閾值上升)
    const criticality = Math.min(99.9, 45.0 + (f / 24.0) * 45.0 + (boost * 4.0));
    this.state.phaseTransitionCriticalityPercent = parseFloat(criticality.toFixed(1));

    // 有效普朗克作用量偏離
    this.state.effectivePlanckScale = parseFloat((1.05457 + (f / 24.0) * 0.042 * (criticality / 100.0)).toFixed(5));
  }

  /**
   * 激發動態真空微波光子對 (Generate Dynamical Photons)
   */
  public generateDynamicalPhotons(): DynamicalPhotonPair {
    this.recomputeCavityDynamics();
    const halfFreq = parseFloat((this.state.mirrorFrequencyGhz / 2.0 + (Math.random() - 0.5) * 0.2).toFixed(2));
    const squeezing = parseFloat((6.5 + (this.state.mirrorFrequencyGhz / 24.0) * 12.0 + Math.random() * 2.0).toFixed(1));

    const pair: DynamicalPhotonPair = {
      id: `dce-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      frequencyGhz: halfFreq,
      modeNumber: Math.floor(Math.random() * 4) + 1,
      quantumSqueezingDb: squeezing,
      entangled: true,
      emittedAt: Date.now()
    };

    this.state.photonPairs.unshift(pair);
    if (this.state.photonPairs.length > 20) {
      this.state.photonPairs.pop();
    }

    this.state.totalPhotonsHarvested += 2;
    this.state.extractedVacuumEnergyPj += pair.frequencyGhz * 18.0;

    this.playDynamicalPhotonPing(pair.frequencyGhz);
    this.saveState();
    return pair;
  }

  /**
   * 觸發臨界真空玻色凝聚相變
   */
  public triggerPhaseTransition(): void {
    this.recomputeCavityDynamics();
    this.state.phaseTransitionCriticalityPercent = 99.8;
    this.state.extractedVacuumEnergyPj += 140.0;
    this.playVacuumPhaseShockwave();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoExcite) {
      this.state.extractedVacuumEnergyPj += delta * (0.9 + this.state.photonProductionRateKps * 0.01);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playDynamicalPhotonPing(freqGhz: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // 微波雙光子發射對應雙音
      const f1 = 587.33 + (freqGhz * 40.0); // D5 基底
      const f2 = f1 * 1.5; // 五度泛音

      [f1, f2].forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.03);

        gain.gain.setValueAtTime(0.0, now + idx * 0.03);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.03 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.3);
      });
    } catch {
      // 容錯靜音
    }
  }

  public playVibratingMirrorRumble(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110.0, now);
      osc.frequency.linearRampToValueAtTime(220.0, now + 0.3);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // 容錯靜音
    }
  }

  public playVacuumPhaseShockwave(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(740.0, now);
      osc.frequency.exponentialRampToValueAtTime(120.0, now + 0.5);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.58);
    } catch {
      // 容錯靜音
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 忽略儲存例外
    }
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch {
      // 忽略載入例外
    }
  }
}

export const planckVacuumEngine = new PlanckVacuumCavityEngine();
