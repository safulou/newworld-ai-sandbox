/**
 * 動態自旋極化子玻色凝聚膠體引擎 (Dynamical Spin-Polaron Bose Gel Engine)
 * 
 * 物理原理：
 * 1. 在旋量玻色-愛因斯坦凝聚態 (Spinor BEC) 或強關聯磁性介質中，自旋雜質激發自旋極化子 (Spin-Polaron)，
 *    自旋反轉與縱向/橫向聲子雲形成緊密耦合的準粒子態。
 * 2. 弗洛利希 (Fröhlich) 自旋-聲子耦合常數 g_sp 引發極化子有效質量重整化 m* / m = exp(S_HR · g_sp²)，
 *    並伴隨顯著的局域自旋極化率 χ_spin。
 * 3. 聲子介導的吸引力促使多個極化子自組裝形成微觀骨架網絡，進入黏彈性玻色膠體態 (Viscoelastic Quantum Gel)。
 * 4. 系統在動態剪切下展現複數剪切模量 G*(ω) = G'(ω) + i G''(ω)，儲能模量 G'（固態彈性）與損耗模量 G''（液態耗散）
 *    定義黏彈損耗角正切 tan δ = G'' / G'。在超固態凝膠相下展現無耗散超流與剪切剛性的奇妙共存。
 */

export type SpinPolaronGelRegime = 
  | 'polaron-fermi-liquid'
  | 'viscoelastic-bose-gel'
  | 'coherent-supersolid-gel'
  | 'viscoelastic-avalanche';

export interface PolaronCluster {
  id: number;
  x: number;
  y: number;
  radius: number;
  spinPolarization: number;
  strainAmplitude: number;
}

export interface SpinPolaronGelState {
  spinPhononCouplingG: number;         // 自旋-聲子耦合強度 g_sp (0.1 ~ 3.0)
  gelDensity1e18: number;              // 膠體密度 ρ_gel (10¹⁸ cm⁻³, 1.0 ~ 10.0)
  shearFrequencyHz: number;            // 剪切震盪頻率 ω_shear (Hz, 10.0 ~ 120.0)
  effectiveMassRatio: number;          // 有效質量重整比 m* / m (1.0 ~ 30.0)
  storageModulusGPrimeKPa: number;     // 彈性儲能模量 G' (kPa)
  lossModulusGDoublePrimeKPa: number;  // 黏性損耗模量 G'' (kPa)
  lossFactorTanDelta: number;          // 損耗因子 tan δ = G'' / G'
  spinPolarizabilityChi: number;       // 自旋極化率 χ_spin (10⁻³ μ_B / T)
  activeRegime: SpinPolaronGelRegime;
  pulsePhase: number;
  clusters: PolaronCluster[];
}

const STORAGE_KEY = 'newworld_spin_polaron_bose_gel_state_v1';

export class DynamicalSpinPolaronBoseGelEngine {
  private state: SpinPolaronGelState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): SpinPolaronGelState {
    const defaults: SpinPolaronGelState = {
      spinPhononCouplingG: 1.6,
      gelDensity1e18: 5.2,
      shearFrequencyHz: 45.0,
      effectiveMassRatio: 4.8,
      storageModulusGPrimeKPa: 124.5,
      lossModulusGDoublePrimeKPa: 38.2,
      lossFactorTanDelta: 0.307,
      spinPolarizabilityChi: 8.42,
      activeRegime: 'viscoelastic-bose-gel',
      pulsePhase: 0,
      clusters: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Spin-Polaron Gel state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Spin-Polaron Gel state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<SpinPolaronGelState> {
    return this.state;
  }

  public setSpinPhononCoupling(g: number): void {
    this.state.spinPhononCouplingG = Math.max(0.1, Math.min(3.0, g));
    this.recomputePhysics();
    this.saveState();
  }

  public setGelDensity(rho: number): void {
    this.state.gelDensity1e18 = Math.max(1.0, Math.min(10.0, rho));
    this.recomputePhysics();
    this.saveState();
  }

  public setShearFrequency(omega: number): void {
    this.state.shearFrequencyHz = Math.max(10.0, Math.min(120.0, omega));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: SpinPolaronGelRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'polaron-fermi-liquid':
        this.state.spinPhononCouplingG = 0.4;
        this.state.gelDensity1e18 = 2.0;
        this.state.shearFrequencyHz = 20.0;
        break;
      case 'viscoelastic-bose-gel':
        this.state.spinPhononCouplingG = 1.7;
        this.state.gelDensity1e18 = 5.5;
        this.state.shearFrequencyHz = 50.0;
        break;
      case 'coherent-supersolid-gel':
        this.state.spinPhononCouplingG = 2.4;
        this.state.gelDensity1e18 = 8.5;
        this.state.shearFrequencyHz = 80.0;
        break;
      case 'viscoelastic-avalanche':
        this.state.spinPhononCouplingG = 2.85;
        this.state.gelDensity1e18 = 9.8;
        this.state.shearFrequencyHz = 110.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const g = this.state.spinPhononCouplingG;
    const rho = this.state.gelDensity1e18;
    const omega = this.state.shearFrequencyHz;

    // 有效質量重整比 m* / m = 1 + exp(0.55 * g²) * 0.4
    const mRatio = 1 + Math.exp(0.55 * Math.pow(g, 2)) * 0.4;
    this.state.effectiveMassRatio = parseFloat(Math.min(30.0, mRatio).toFixed(2));

    // 自旋極化率 χ = (rho * 1.5) / (1 + 0.3 * g)
    const chi = (rho * 1.5) / (1 + 0.3 * g);
    this.state.spinPolarizabilityChi = parseFloat(chi.toFixed(2));

    // 儲能模量 G' (kPa) = 8.0 * rho * g² * (omega / 40)^0.5
    const gPrime = 8.0 * rho * Math.pow(g, 2) * Math.pow(omega / 40, 0.5);
    this.state.storageModulusGPrimeKPa = parseFloat(gPrime.toFixed(1));

    // 損耗模量 G'' (kPa) = 3.5 * rho * g * (omega / 40)^0.3
    const gDoublePrime = 3.5 * rho * g * Math.pow(omega / 40, 0.3);
    this.state.lossModulusGDoublePrimeKPa = parseFloat(gDoublePrime.toFixed(1));

    // 損耗因子 tan δ = G'' / G'
    const tanDelta = gPrime > 0.01 ? (gDoublePrime / gPrime) : 1.0;
    this.state.lossFactorTanDelta = parseFloat(Math.min(5.0, tanDelta).toFixed(3));

    // 骨架極化子網絡生成 (7 節點)
    const clusters: PolaronCluster[] = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + 0.3 * Math.sin(this.state.pulsePhase * 0.4);
      const rad = 65 + 20 * Math.cos(this.state.pulsePhase * 0.6 + i * 1.2);
      const cx = 150 + rad * Math.cos(angle);
      const cy = 150 + rad * Math.sin(angle);
      const pol = 0.5 + 0.5 * Math.sin(this.state.pulsePhase + i);
      const strain = 0.2 + 0.8 * (omega / 120) * Math.abs(Math.sin(this.state.pulsePhase * 0.8 + i));

      clusters.push({
        id: i,
        x: parseFloat(cx.toFixed(1)),
        y: parseFloat(cy.toFixed(1)),
        radius: parseFloat((8 + g * 3 + pol * 4).toFixed(1)),
        spinPolarization: parseFloat(pol.toFixed(2)),
        strainAmplitude: parseFloat(strain.toFixed(2))
      });
    }
    this.state.clusters = clusters;
  }

  public update(dtSeconds: number): void {
    const speed = (this.state.shearFrequencyHz / 40.0) * 2.5;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerGelResonanceSound(): void {
    try {
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
      osc2.type = 'sine';

      const baseFreq = 160 + this.state.spinPhononCouplingG * 60;
      const shearMod = this.state.shearFrequencyHz * 1.5;

      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq + shearMod, t + 0.22);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.45);

      osc2.frequency.setValueAtTime(baseFreq * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, t + 0.25);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.52);
      osc2.stop(t + 0.52);
    } catch (e) {
      console.warn('Web Audio playback failed in SpinPolaronGelEngine:', e);
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

export const dynamicalSpinPolaronBoseGelEngine = new DynamicalSpinPolaronBoseGelEngine();
