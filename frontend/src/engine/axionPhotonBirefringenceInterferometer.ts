/**
 * 軸子-光子強磁場雙折射干涉儀與暗物質普里馬科夫共振腔引擎
 * (Axion-Photon Vacuum Birefringence Interferometer & Primakoff Dark-Matter Resonator Engine)
 *
 * 物理原理：
 * 1. 根據陳-西蒙斯軸子電動力學拉格朗日量 L_{aγγ} = -(1/4) g_{aγγ} a F_{μν} \tilde{F}^{μν} = g_{aγγ} a E · B，
 *    宇宙暗物質背景相干振盪的軸子場 a(t) = a_0 cos(m_a c^2 t / ħ) 會使左旋 (LCP) 與右旋 (RCP) 圓偏振光子產生相反的相速度偏移：
 *    \omega_{\pm}^2 = c^2 k^2 \pm g_{aγγ} \dot{a} c k。
 * 2. 在領結型高精細度法布里-珀羅光學干涉腔 (Bow-Tie Fabry-Pérot Interferometer, 如 ADBC/DANCE) 與橫向強超導偶極磁場 B_{ext}
 *    協同下，線偏振雷射經過 N_{pass} \sim F_{cav}/\pi 次腔內往返反射後，累積可量測的軸子真空磁雙折射偏振旋轉角 \Delta\theta_{biref} (nrad)
 *    與「穿牆光」(Light-Shining-Through-a-Wall, LSW, ALPS-II) 普里馬科夫光子-軸子-光子再生率 P_{\gamma\to a\to \gamma} \propto (g_{aγγ} B_{ext} L)^4 F_{cav}^2。
 */

export type AxionBirefringenceRegime =
  | 'qcd-axion-bowtie-birefringence-cavity'
  | 'primakoff-light-shining-through-wall-alps'
  | 'ultralight-alp-dark-matter-stochastic-halo'
  | 'quantum-squeezed-vacuum-shot-noise-bypass';

export interface AxionOpticalCavityNode {
  id: number;
  x: number;
  y: number;
  polarizationChirality: 'LCP' | 'RCP';
  birefringentPhaseShiftNrad: number;
  primakoffConversionAmp: number;
  intracavityPowerMw: number;
}

export interface AxionPhotonBirefringenceState {
  axionPhotonCouplingG11: number;         // 軸子-雙光子耦合常數 g_{aγγ} (10^{-11} GeV^{-1}, 0.10 ~ 12.00)
  transverseMagneticFieldTesla: number;   // 超導偶極磁鐵橫向磁場 B_{ext} (T, 1.0 ~ 18.0)
  opticalCavityFinesseK: number;          // 法布里-珀羅光學諧振腔精細度 F_{cav} (×10^3, 5.0 ~ 250.0)
  birefringenceRotationNrad: number;      // 軸子誘導真空雙折射偏振旋轉角 \Delta\theta_{biref} (nrad)
  primakoffRegenerationLogProb: number;   // 普里馬科夫穿牆光子再生對數機率 log10(P_{\gamma\to a\to \gamma})
  shotNoiseSqueezedSnr: number;           // 壓縮真空輔助軸子探測訊噪比 SNR
  activeRegime: AxionBirefringenceRegime;
  pulsePhase: number;
  cavityNodes: AxionOpticalCavityNode[];
}

const STORAGE_KEY = 'newworld_axion_photon_birefringence_state_v1';

export class AxionPhotonBirefringenceInterferometerEngine {
  private state: AxionPhotonBirefringenceState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): AxionPhotonBirefringenceState {
    const defaults: AxionPhotonBirefringenceState = {
      axionPhotonCouplingG11: 3.50,
      transverseMagneticFieldTesla: 9.5,
      opticalCavityFinesseK: 120.0,
      birefringenceRotationNrad: 42.8,
      primakoffRegenerationLogProb: -21.4,
      shotNoiseSqueezedSnr: 18.6,
      activeRegime: 'qcd-axion-bowtie-birefringence-cavity',
      pulsePhase: 0,
      cavityNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Axion-Photon Birefringence state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Axion-Photon Birefringence state:', e);
      }
    }
  }

  public getState(): Readonly<AxionPhotonBirefringenceState> {
    return this.state;
  }

  public setAxionPhotonCoupling(g11: number): void {
    this.state.axionPhotonCouplingG11 = Math.max(0.10, Math.min(12.00, parseFloat(g11.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setTransverseMagneticField(bTesla: number): void {
    this.state.transverseMagneticFieldTesla = Math.max(1.0, Math.min(18.0, parseFloat(bTesla.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setOpticalCavityFinesse(finesseK: number): void {
    this.state.opticalCavityFinesseK = Math.max(5.0, Math.min(250.0, parseFloat(finesseK.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: AxionBirefringenceRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'qcd-axion-bowtie-birefringence-cavity':
        this.state.axionPhotonCouplingG11 = 3.50;
        this.state.transverseMagneticFieldTesla = 9.5;
        this.state.opticalCavityFinesseK = 120.0;
        break;
      case 'primakoff-light-shining-through-wall-alps':
        this.state.axionPhotonCouplingG11 = 5.20;
        this.state.transverseMagneticFieldTesla = 5.3;
        this.state.opticalCavityFinesseK = 150.0;
        break;
      case 'ultralight-alp-dark-matter-stochastic-halo':
        this.state.axionPhotonCouplingG11 = 1.80;
        this.state.transverseMagneticFieldTesla = 14.0;
        this.state.opticalCavityFinesseK = 195.0;
        break;
      case 'quantum-squeezed-vacuum-shot-noise-bypass':
        this.state.axionPhotonCouplingG11 = 8.40;
        this.state.transverseMagneticFieldTesla = 16.5;
        this.state.opticalCavityFinesseK = 240.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const g11 = this.state.axionPhotonCouplingG11;
    const bExt = this.state.transverseMagneticFieldTesla;
    const finesseK = this.state.opticalCavityFinesseK;

    // 真空磁雙折射偏振旋轉角 \Delta\theta_{biref} (nrad) ∝ g_{aγγ} * (1 + 0.12 B_{ext}) * F_{cav}
    const rotNrad = 0.048 * g11 * (1.0 + 0.15 * bExt) * finesseK;
    this.state.birefringenceRotationNrad = parseFloat(rotNrad.toFixed(2));

    // 普里馬科夫穿牆再生機率對數值 log10(P_{\gamma\to a\to \gamma}) ∝ 4 log10(g B) + 2 log10(F)
    const logProb = -29.8 + 4.0 * Math.log10(Math.max(0.05, g11 * bExt * 0.12)) + 2.0 * Math.log10(finesseK);
    this.state.primakoffRegenerationLogProb = parseFloat(logProb.toFixed(2));

    // 壓縮真空輔助探測訊噪比 SNR
    const squeezeBoost = this.state.activeRegime === 'quantum-squeezed-vacuum-shot-noise-bypass' ? 1.85 : 1.0;
    const snr = 0.22 * Math.pow(rotNrad, 0.85) * Math.sqrt(bExt / 5.0) * squeezeBoost;
    this.state.shotNoiseSqueezedSnr = parseFloat(Math.max(0.5, snr).toFixed(1));

    // 生成 16 個領結型 (Bow-Tie) 四鏡光學諧振腔與 LCP/RCP 雙折射偏振節點
    const nodes: AxionOpticalCavityNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const chirality: 'LCP' | 'RCP' = i % 2 === 0 ? 'LCP' : 'RCP';
      const u = ((i / count) + (this.state.pulsePhase * 0.08)) % 1.0;
      const theta = u * 2.0 * Math.PI;
      // 領結型 (Lemniscate / Bow-Tie) 參數軌跡
      const x = 165 + 96 * Math.cos(theta);
      const y = 160 + 68 * Math.sin(2.0 * theta);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        polarizationChirality: chirality,
        birefringentPhaseShiftNrad: parseFloat(((chirality === 'LCP' ? 1 : -1) * this.state.birefringenceRotationNrad).toFixed(2)),
        primakoffConversionAmp: parseFloat(Math.min(1.0, (g11 * bExt) / 90.0).toFixed(3)),
        intracavityPowerMw: parseFloat((0.45 * finesseK * (0.85 + 0.15 * Math.cos(theta))).toFixed(1))
      });
    }
    this.state.cavityNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.75 + (this.state.shotNoiseSqueezedSnr / 45.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAxionBirefringenceSound(): void {
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
      const oscLcp = this.audioCtx.createOscillator();
      const oscRcp = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscLcp.type = 'sine';
      oscRcp.type = 'sine';

      // LCP 與 RCP 圓偏振光在軸子場中之雙折射相速度劈裂拍頻
      const fCarrier = 410 + this.state.transverseMagneticFieldTesla * 14;
      const deltaBiref = Math.min(80, 4 + this.state.birefringenceRotationNrad * 0.35);

      oscLcp.frequency.setValueAtTime(fCarrier + deltaBiref, t);
      oscRcp.frequency.setValueAtTime(fCarrier - deltaBiref, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscLcp.connect(gain);
      oscRcp.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscLcp.start(t);
      oscRcp.start(t);
      oscLcp.stop(t + 0.58);
      oscRcp.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in AxionPhotonBirefringenceInterferometerEngine:', e);
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

export const axionPhotonBirefringenceInterferometerEngine = new AxionPhotonBirefringenceInterferometerEngine();
