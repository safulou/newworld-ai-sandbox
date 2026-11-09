/**
 * 阿秒雷射強場高次諧波外爾半金屬與非微擾貝里曲率動態布洛赫譜儀引擎
 * (Attosecond Strong-Field High-Harmonic Weyl Semimetal & Non-Perturbative Berry Curvature Bloch Spectrometer Engine)
 *
 * 物理原理：
 * 1. 當少週期強場中紅外飛秒雷射脈衝 (電場峰值 E_0 \sim 5 - 35 MV/cm，Keldysh 絕熱參數 \gamma_K = \omega_0 \sqrt{2 m^* \Delta} / (e E_0) \lesssim 1)
 *    驅動非中心對稱拓撲外爾半金屬 (如 TaAs, RhSi) 時，布洛赫電子在單一光學半週期內跨越布里淵區執行非微擾動態布洛赫振盪
 *    (Dynamic Bloch Oscillations) 與帶間 Landau-Zener-Stückelberg 穿隧復合，輻射出延伸至極紫外 (XUV) 區間的高次諧波譜 (HHG)。
 * 2. 外爾節點處攜帶拓撲荷 C = \pm 1 之貝里曲率單極子 \boldsymbol{\Omega}(\mathbf{k}) = \pm \mathbf{k} / (2 k^3)
 *    產生強大的橫向反常霍爾速度 \mathbf{v}_{anom}(t) = -\frac{e}{\hbar} \mathbf{E}(t) \times \boldsymbol{\Omega}(\mathbf{k}(t))，
 *    打破反演對稱並激發垂直於驅動雷射偏振方向的純淨「偶次諧波」(Even-Order Harmonics, 2n\omega_0)。
 * 3. 對高次諧波高原區 (Harmonic Plateau up to N_{cutoff}) 進行阿秒色散相位鎖定，可合成脈寬短於 100 阿秒
 *    (\tau_{atto} \sim 45 - 110 as，突破原子時間單位 24.2 as 尺度) 之圓偏振手性阿秒 XUV 脈衝，直接重建三維動量空間貝里曲率場。
 */

export type AttosecondWeylHhgRegime =
  | 'intraband-dynamic-bloch-oscillation-comb'
  | 'berry-monopole-anomalous-even-harmonics'
  | 'keldysh-tunneling-xuv-cutoff-extension'
  | 'isolated-sub100as-chiral-xuv-attosecond-pulse';

export interface WeylBlochHarmonicNode {
  id: number;
  x: number;
  y: number;
  harmonicChannel: 'odd-intraband-bloch-harmonic' | 'even-berry-anomalous-harmonic' | 'attosecond-xuv-chirp-burst';
  harmonicOrderN: number;
  spectralYieldLog10: number;
  transverseEllipticity: number;
}

export interface AttosecondWeylHhgBerryState {
  peakLaserElectricFieldMvCm: number;     // 強場驅動雷射峰值電場 E_0 (MV/cm, 4.0 ~ 36.0)
  weylMonopoleChiralityCharge: number;    // 外爾節點手性拓撲陳數模值 |C_{Weyl}| (1, 2, 4 如手性費米子 RhSi)
  keldyshAdiabaticityGamma: number;       // Keldysh 非微擾穿隧絕熱參數 \gamma_K (0.15 ~ 2.20)
  highHarmonicCutoffOrderN: number;       // 高次諧波極紫外截止階數 N_{cutoff} (\hbar\omega_{max} / \hbar\omega_0)
  evenToOddBerryHarmonicRatio: number;    // 貝里反常偶次諧波與奇次諧波強度比 I_{2n}^\perp / I_{2n+1}^\parallel
  isolatedAttosecondPulseWidthAs: number; // 合成孤立手性阿秒 XUV 脈衝寬度 \tau_{atto} (as, 阿秒)
  activeRegime: AttosecondWeylHhgRegime;
  pulsePhase: number;
  harmonicNodes: WeylBlochHarmonicNode[];
}

const STORAGE_KEY = 'newworld_attosecond_weyl_hhg_berry_state_v1';

export class AttosecondWeylHighHarmonicBerrySpectrometerEngine {
  private state: AttosecondWeylHhgBerryState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): AttosecondWeylHhgBerryState {
    const defaults: AttosecondWeylHhgBerryState = {
      peakLaserElectricFieldMvCm: 22.0,
      weylMonopoleChiralityCharge: 2,
      keldyshAdiabaticityGamma: 0.44,
      highHarmonicCutoffOrderN: 29,
      evenToOddBerryHarmonicRatio: 0.785,
      isolatedAttosecondPulseWidthAs: 64.5,
      activeRegime: 'berry-monopole-anomalous-even-harmonics',
      pulsePhase: 0,
      harmonicNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Attosecond Weyl HHG Berry state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Attosecond Weyl HHG Berry state:', e);
      }
    }
  }

  public getState(): Readonly<AttosecondWeylHhgBerryState> {
    return this.state;
  }

  public setPeakLaserElectricField(eFieldMvCm: number): void {
    this.state.peakLaserElectricFieldMvCm = Math.max(4.0, Math.min(36.0, parseFloat(eFieldMvCm.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setWeylMonopoleChiralityCharge(cCharge: number): void {
    const valid = [1, 2, 4];
    const closest = valid.reduce((prev, curr) => Math.abs(curr - cCharge) < Math.abs(prev - cCharge) ? curr : prev);
    this.state.weylMonopoleChiralityCharge = closest;
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: AttosecondWeylHhgRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'intraband-dynamic-bloch-oscillation-comb':
        this.state.peakLaserElectricFieldMvCm = 12.0;
        this.state.weylMonopoleChiralityCharge = 1;
        break;
      case 'berry-monopole-anomalous-even-harmonics':
        this.state.peakLaserElectricFieldMvCm = 22.5;
        this.state.weylMonopoleChiralityCharge = 2;
        break;
      case 'keldysh-tunneling-xuv-cutoff-extension':
        this.state.peakLaserElectricFieldMvCm = 30.0;
        this.state.weylMonopoleChiralityCharge = 2;
        break;
      case 'isolated-sub100as-chiral-xuv-attosecond-pulse':
        this.state.peakLaserElectricFieldMvCm = 34.5;
        this.state.weylMonopoleChiralityCharge = 4;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const eField = this.state.peakLaserElectricFieldMvCm;
    const cWeyl = this.state.weylMonopoleChiralityCharge;

    // Keldysh 絕熱參數 \gamma_K \propto 1 / E_0 (\gamma_K < 1 為非微擾強場穿隧區)
    const gammaK = 9.6 / eField;
    this.state.keldyshAdiabaticityGamma = parseFloat(gammaK.toFixed(3));

    // 固態高次諧波線性截止定律 N_{cutoff} \approx 5 + 1.08 E_0 (MV/cm)
    const nCut = Math.round(5 + 1.08 * eField + 0.8 * cWeyl);
    this.state.highHarmonicCutoffOrderN = nCut;

    // 貝里曲率單極子誘導之正交偶次諧波比 I_{2n}^\perp / I_{2n+1}^\parallel
    const evenOddRatio = Math.min(1.35, 0.22 * cWeyl * (1.0 + 0.045 * eField));
    this.state.evenToOddBerryHarmonicRatio = parseFloat(evenOddRatio.toFixed(3));

    // 傅立葉合成阿秒脈寬 \tau_{atto} (as) \propto T_0 / \Delta N_{plateau}
    const attoWidth = Math.max(42.0, 210.0 / (1.0 + 0.095 * nCut));
    this.state.isolatedAttosecondPulseWidthAs = parseFloat(attoWidth.toFixed(1));

    // 生成 16 個布里淵區動態布洛赫軌跡與奇/偶次諧波梳節點
    const nodes: WeylBlochHarmonicNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const hOrder = i + 2;
      let channel: 'odd-intraband-bloch-harmonic' | 'even-berry-anomalous-harmonic' | 'attosecond-xuv-chirp-burst' =
        hOrder % 2 === 0 ? 'even-berry-anomalous-harmonic' : 'odd-intraband-bloch-harmonic';
      if (hOrder >= 14) channel = 'attosecond-xuv-chirp-burst';

      // 電子在動量空間繞過外爾節點時受貝里曲率洛倫茲力產生橫向 8 字形偏折
      const tPhase = (i / count) * 2.0 * Math.PI + this.state.pulsePhase;
      const kxDisp = 92 * Math.cos(tPhase);
      const kyAnom = (28 + 8 * cWeyl) * Math.sin(2.0 * tPhase);

      const x = 165 + kxDisp;
      const y = 160 + kyAnom;

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        harmonicChannel: channel,
        harmonicOrderN: hOrder,
        spectralYieldLog10: parseFloat((-0.12 * hOrder + (hOrder % 2 === 0 ? Math.log10(evenOddRatio + 0.1) : 0)).toFixed(2)),
        transverseEllipticity: parseFloat(Math.min(0.98, 0.25 * cWeyl * Math.abs(Math.sin(tPhase))).toFixed(2))
      });
    }
    this.state.harmonicNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.82 + (this.state.peakLaserElectricFieldMvCm / 36.0) * 0.85;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAttosecondWeylHhgSound(): void {
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
      const oscOdd = this.audioCtx.createOscillator();
      const oscEvenBerry = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscOdd.type = 'sawtooth';
      oscEvenBerry.type = 'sine';

      // 帶內奇次諧波梳 (3\omega_0) 與貝里曲率反常偶次諧波 (2\omega_0, 4\omega_0) 啾頻合成阿秒脈衝
      const f0 = 180 + this.state.peakLaserElectricFieldMvCm * 4.5;
      oscOdd.frequency.setValueAtTime(f0 * 3, t);
      oscOdd.frequency.exponentialRampToValueAtTime(f0 * 5, t + 0.38);

      oscEvenBerry.frequency.setValueAtTime(f0 * 2 * this.state.weylMonopoleChiralityCharge * 0.5, t);
      oscEvenBerry.frequency.exponentialRampToValueAtTime(f0 * 4, t + 0.38);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      oscOdd.connect(gain);
      oscEvenBerry.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscOdd.start(t);
      oscEvenBerry.start(t);
      oscOdd.stop(t + 0.54);
      oscEvenBerry.stop(t + 0.54);
    } catch (e) {
      console.warn('Web Audio playback failed in AttosecondWeylHighHarmonicBerrySpectrometerEngine:', e);
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

export const attosecondWeylHighHarmonicBerrySpectrometerEngine = new AttosecondWeylHighHarmonicBerrySpectrometerEngine();
