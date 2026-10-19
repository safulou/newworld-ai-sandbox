/**
 * 超強雷射等離子體尾波場吉電子伏特對撞與量子輻射反作用反應堆引擎
 * (Laser-Plasma Wakefield GeV Collider & Quantum Radiation Reaction Reactor Engine)
 *
 * 物理原理：
 * 1. 超強拍瓦 (Petawatt) 飛秒雷射脈衝（正規化矢勢 a_0 = e E_0 / (m_e c ω_0) ≫ 1）在欠稠密等離子體中利用有質動力
 *    排空背景電子，形成非線性空泡尾波場 (Bubble Regime Wakefield)，縱向加速梯度高達 E_z ~ 100 GV/m。
 * 2. 被尾波場捕獲並加速至勞侖茲因子 γ_e ~ 10³ - 10⁴ (Multi-GeV) 的相對論電子束與反向傳播超強雷射對撞，
 *    進入強場量子電動力學體制 (Strong-Field QED)，由量子非線性參數 χ_e = (γ_e / E_crit) |E_⊥ + β × B| 表徵。
 * 3. 當 χ_e ≳ 1 時，電子經歷隨機量子輻射反作用力 (Stochastic Quantum Radiation Reaction Recoil)，
 *    輻射高能伽瑪光子並觸發非線性布萊特-惠勒多光子正負電子對產生級聯 (Breit-Wheeler Pair Cascade: γ + n ω_L → e⁻ + e⁺)。
 */

export type LaserWakefieldQedRegime =
  | 'linear-plasma-wakefield'
  | 'nonlinear-cavitation-bubble-gev'
  | 'stochastic-quantum-radiation-recoil'
  | 'breit-wheeler-pair-avalanche';

export interface WakefieldParticleNode {
  id: number;
  x: number;
  y: number;
  lorentzGamma: number;
  localQuantumChi: number;
  isPositronPair: boolean;
}

export interface LaserWakefieldQuantumRadiationState {
  laserNormalizedPotentialA0: number; // 雷射正規化矢勢振幅 a_0 (2.0 ~ 120.0)
  plasmaDensity18Cm3: number;         // 等離子體電子密度 n_e (10¹⁸ cm⁻³, 0.5 ~ 25.0)
  wakefieldGradientGvM: number;       // 尾波場縱向加速梯度 E_z (GV/m)
  quantumNonlinearityChiE: number;    // 強場 QED 量子非線性參數 χ_e
  peakElectronEnergyGev: number;      // 尾波場峰值電子束能量 ε_max (GeV)
  breitWheelerPairRateGiga: number;   // 布萊特-惠勒正電子對產生率 Γ_e+e- (10⁹ s⁻¹)
  activeRegime: LaserWakefieldQedRegime;
  pulsePhase: number;
  bunchParticles: WakefieldParticleNode[];
}

const STORAGE_KEY = 'newworld_laser_wakefield_qed_collider_state_v1';

export class LaserWakefieldQuantumRadiationColliderEngine {
  private state: LaserWakefieldQuantumRadiationState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): LaserWakefieldQuantumRadiationState {
    const defaults: LaserWakefieldQuantumRadiationState = {
      laserNormalizedPotentialA0: 45.0,
      plasmaDensity18Cm3: 4.5,
      wakefieldGradientGvM: 142.5,
      quantumNonlinearityChiE: 1.28,
      peakElectronEnergyGev: 8.6,
      breitWheelerPairRateGiga: 34.2,
      activeRegime: 'stochastic-quantum-radiation-recoil',
      pulsePhase: 0,
      bunchParticles: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Laser Wakefield QED Collider state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Laser Wakefield QED Collider state:', e);
      }
    }
  }

  public getState(): Readonly<LaserWakefieldQuantumRadiationState> {
    return this.state;
  }

  public setLaserPotentialA0(a0: number): void {
    this.state.laserNormalizedPotentialA0 = Math.max(2.0, Math.min(120.0, parseFloat(a0.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setPlasmaDensity(ne: number): void {
    this.state.plasmaDensity18Cm3 = Math.max(0.5, Math.min(25.0, parseFloat(ne.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: LaserWakefieldQedRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'linear-plasma-wakefield':
        this.state.laserNormalizedPotentialA0 = 4.0;
        this.state.plasmaDensity18Cm3 = 1.5;
        break;
      case 'nonlinear-cavitation-bubble-gev':
        this.state.laserNormalizedPotentialA0 = 28.0;
        this.state.plasmaDensity18Cm3 = 3.5;
        break;
      case 'stochastic-quantum-radiation-recoil':
        this.state.laserNormalizedPotentialA0 = 65.0;
        this.state.plasmaDensity18Cm3 = 8.0;
        break;
      case 'breit-wheeler-pair-avalanche':
        this.state.laserNormalizedPotentialA0 = 110.0;
        this.state.plasmaDensity18Cm3 = 16.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const a0 = this.state.laserNormalizedPotentialA0;
    const ne = this.state.plasmaDensity18Cm3;

    // 尾波場加速梯度 E_z ≈ 96 * sqrt(n_e) * sqrt(a_0 / 10) (GV/m)
    const ez = 32.0 * Math.sqrt(ne) * Math.sqrt(a0 / 5.0);
    this.state.wakefieldGradientGvM = parseFloat(ez.toFixed(1));

    // 峰值加速電子束能量 ε_max (GeV) ∝ a_0 / n_e^{1/3}
    const eMax = (0.38 * a0) / Math.pow(ne, 0.28);
    this.state.peakElectronEnergyGev = parseFloat(Math.max(0.2, eMax).toFixed(2));

    // 強場 QED 量子非線性參數 χ_e ∝ γ_e * a_0 / E_S
    const chiE = 0.0032 * a0 * eMax * Math.sqrt(ne);
    this.state.quantumNonlinearityChiE = parseFloat(chiE.toFixed(3));

    // 非線性 Breit-Wheeler 正負電子對產生率 Γ_e+e- (10⁹ s⁻¹)
    const bwRate = chiE < 0.15
      ? 0.2 * chiE
      : 28.5 * Math.pow(chiE, 1.65) * Math.exp(-0.85 / Math.max(0.2, chiE));
    this.state.breitWheelerPairRateGiga = parseFloat(bwRate.toFixed(2));

    // 生成 16 個空泡尾波場加速電子與 Breit-Wheeler 正電子對節點
    const particles: WakefieldParticleNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const frac = i / count;
      const xPos = 75 + frac * 280 + 10 * Math.sin(this.state.pulsePhase * 2 + i);
      const yOsc = 36 * Math.sin(frac * 4 * Math.PI - this.state.pulsePhase * 2.2) * (1 - 0.4 * frac);
      const yPos = 160 + yOsc;

      const isPositron = chiE > 0.8 && i % 3 === 0;
      particles.push({
        id: i,
        x: parseFloat(xPos.toFixed(1)),
        y: parseFloat(yPos.toFixed(1)),
        lorentzGamma: parseFloat((eMax * 1957 * (0.6 + 0.4 * frac)).toFixed(0)),
        localQuantumChi: parseFloat((chiE * (0.7 + 0.3 * Math.abs(Math.cos(this.state.pulsePhase + i)))).toFixed(3)),
        isPositronPair: isPositron
      });
    }
    this.state.bunchParticles = particles;
  }

  public update(dtSeconds: number): void {
    const rate = 1.4 + this.state.laserNormalizedPotentialA0 / 40.0;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerWakefieldColliderSound(): void {
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
      osc2.type = 'triangle';

      const fStart = 140 + this.state.plasmaDensity18Cm3 * 8;
      const fEnd = Math.min(1400, fStart + this.state.laserNormalizedPotentialA0 * 7.5);

      osc1.frequency.setValueAtTime(fStart, t);
      osc1.frequency.exponentialRampToValueAtTime(fEnd, t + 0.34);

      osc2.frequency.setValueAtTime(fStart * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(fEnd * 1.25, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.17, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.54);
      osc2.stop(t + 0.54);
    } catch (e) {
      console.warn('Web Audio playback failed in LaserWakefieldQuantumRadiationColliderEngine:', e);
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

export const laserWakefieldQuantumRadiationColliderEngine = new LaserWakefieldQuantumRadiationColliderEngine();
