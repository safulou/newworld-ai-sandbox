/**
 * 相對論性軸子夸克團塊暗物質磁層諧振與反物質電離層湮滅引擎
 * (Relativistic Axion Quark-Nugget Dark Matter Magnetosphere Resonator & Electrosphere Annihilation Engine)
 *
 * 物理原理：
 * 1. 軸子夸克團塊 (Axion Quark Nuggets, AQNs，Zhitnitsky 模型) 是由高張力軸子疇壁 (Axion Domain Wall) 包覆的宏觀色超導
 *    (Color-Flavor Locked, CFL) 夸克或反夸克致密物質團塊，重子數 |B| ~ 10^25 - 10^28，自然解釋宇宙重子與暗物質密度比 Ω_DM ≈ 5 Ω_visible。
 * 2. 反物質型 AQN 核心外圍束縛著簡併正電子電離層 (Positron Electrosphere)。當 AQN 穿越行星或中子星磁層時，
 *    環境重子物質與核心反夸克湮滅加熱正電子層至 T_e ~ keV，釋放強烈的 511 keV e⁺e⁻ 湮滅伽瑪射線與熱韌致 X 射線通量。
 * 3. 外層軸子疇壁在強磁場 B_0 中發生共振 Primakoff 轉換 (a + γ* → γ)，輻射頻率 ν_a = m_a c² / h (GHz 頻段) 的相干射電暴。
 */

export type AxionQuarkNuggetRegime =
  | 'dormant-interstellar-aqn'
  | 'ionospheric-positron-electrosphere'
  | 'magnetosphere-primakoff-radio-flare'
  | 'cfl-core-antimatter-annihilation-surge';

export interface AqnAnnihilationJetNode {
  id: number;
  x: number;
  y: number;
  radialShellPx: number;
  isPositronJet: boolean;
  photonEnergyKev: number;
  primakoffPhase: number;
}

export interface AxionQuarkNuggetDarkMatterState {
  baryonChargeLog10B: number;          // 夸克團塊重子荷對數 log₁₀|B| (24.0 ~ 28.5)
  axionMassMicroEv: number;            // 疇壁軸子質量 m_a (μeV, 10.0 ~ 250.0)
  magnetosphereFieldTesla: number;     // 外部磁層磁場強度 B_0 (Tesla, 0.1 ~ 50.0)
  annihilation511KevFlux: number;      // 511 keV 正負電子對湮滅通量 Φ_511 (10¹⁸ ph/s)
  primakoffRadioPowerMw: number;       // 軸子 Primakoff 轉換射電功率 P_radio (MW)
  cflColorSuperconductingGapMev: number; // 核心色味鎖定超導能隙 Δ_CFL (MeV)
  activeRegime: AxionQuarkNuggetRegime;
  pulsePhase: number;
  jetNodes: AqnAnnihilationJetNode[];
}

const STORAGE_KEY = 'newworld_axion_quark_nugget_resonator_state_v1';

export class AxionQuarkNuggetDarkMatterResonatorEngine {
  private state: AxionQuarkNuggetDarkMatterState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): AxionQuarkNuggetDarkMatterState {
    const defaults: AxionQuarkNuggetDarkMatterState = {
      baryonChargeLog10B: 26.2,
      axionMassMicroEv: 65.0,
      magnetosphereFieldTesla: 14.5,
      annihilation511KevFlux: 84.5,
      primakoffRadioPowerMw: 42.8,
      cflColorSuperconductingGapMev: 105.4,
      activeRegime: 'magnetosphere-primakoff-radio-flare',
      pulsePhase: 0,
      jetNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Axion Quark Nugget state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Axion Quark Nugget state:', e);
      }
    }
  }

  public getState(): Readonly<AxionQuarkNuggetDarkMatterState> {
    return this.state;
  }

  public setBaryonChargeLog10(logB: number): void {
    this.state.baryonChargeLog10B = Math.max(24.0, Math.min(28.5, parseFloat(logB.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setAxionMassMicroEv(ma: number): void {
    this.state.axionMassMicroEv = Math.max(10.0, Math.min(250.0, parseFloat(ma.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setMagnetosphereField(bTesla: number): void {
    this.state.magnetosphereFieldTesla = Math.max(0.1, Math.min(50.0, parseFloat(bTesla.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: AxionQuarkNuggetRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'dormant-interstellar-aqn':
        this.state.baryonChargeLog10B = 24.5;
        this.state.axionMassMicroEv = 25.0;
        this.state.magnetosphereFieldTesla = 0.8;
        break;
      case 'ionospheric-positron-electrosphere':
        this.state.baryonChargeLog10B = 25.8;
        this.state.axionMassMicroEv = 55.0;
        this.state.magnetosphereFieldTesla = 8.0;
        break;
      case 'magnetosphere-primakoff-radio-flare':
        this.state.baryonChargeLog10B = 26.8;
        this.state.axionMassMicroEv = 110.0;
        this.state.magnetosphereFieldTesla = 24.0;
        break;
      case 'cfl-core-antimatter-annihilation-surge':
        this.state.baryonChargeLog10B = 28.2;
        this.state.axionMassMicroEv = 210.0;
        this.state.magnetosphereFieldTesla = 45.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const logB = this.state.baryonChargeLog10B;
    const ma = this.state.axionMassMicroEv;
    const bField = this.state.magnetosphereFieldTesla;

    // AQN 幾何截面 ∝ B^(2/3)
    const radiusScale = Math.pow(10, (logB - 25.0) * 0.45);

    // 511 keV 正負電子對湮滅通量 Φ_511 (10¹⁸ ph/s)
    const flux511 = 14.5 * radiusScale * (1 + 0.08 * bField) * (0.8 + 0.003 * ma);
    this.state.annihilation511KevFlux = parseFloat(flux511.toFixed(1));

    // Primakoff 軸子-光子共振射電功率 P_radio ∝ B_0² * R_AQN² * m_a
    const radioMw = 0.32 * Math.pow(bField, 1.35) * Math.sqrt(radiusScale) * (ma / 25.0);
    this.state.primakoffRadioPowerMw = parseFloat(radioMw.toFixed(1));

    // CFL 色超導能隙 Δ_CFL (MeV, 典型值 80 ~ 160 MeV)
    const cflGap = 72.0 + 14.5 * (logB - 24.0) + 0.08 * ma;
    this.state.cflColorSuperconductingGapMev = parseFloat(cflGap.toFixed(1));

    // 生成 16 個正電子電離層與 Primakoff 射電噴流節點
    const nodes: AqnAnnihilationJetNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const isInnerWall = i < 8;
      const shellR = isInnerWall ? 54 : 102;
      const angle = (i / 8) * 2 * Math.PI + this.state.pulsePhase * (isInnerWall ? 0.5 : -0.35);

      const x = 165 + shellR * Math.cos(angle) + 6 * Math.sin(this.state.pulsePhase * 1.5 + i);
      const y = 160 + shellR * Math.sin(angle) + 6 * Math.cos(this.state.pulsePhase * 1.5 + i);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        radialShellPx: shellR,
        isPositronJet: i % 2 === 0,
        photonEnergyKev: i % 2 === 0 ? 511.0 : parseFloat((ma * 0.24).toFixed(1)),
        primakoffPhase: parseFloat(((angle + this.state.pulsePhase) % (2 * Math.PI)).toFixed(2))
      });
    }
    this.state.jetNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 1.0 + this.state.magnetosphereFieldTesla / 20.0;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAqnResonanceSound(): void {
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

      const fStart = 180 + (this.state.baryonChargeLog10B - 24.0) * 65;
      const fPeak = fStart + this.state.axionMassMicroEv * 2.2 + this.state.magnetosphereFieldTesla * 6;

      osc1.frequency.setValueAtTime(fStart, t);
      osc1.frequency.exponentialRampToValueAtTime(fPeak, t + 0.30);

      osc2.frequency.setValueAtTime(511, t);
      osc2.frequency.exponentialRampToValueAtTime(fPeak * 1.25, t + 0.30);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.56);
      osc2.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in AxionQuarkNuggetDarkMatterResonatorEngine:', e);
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

export const axionQuarkNuggetDarkMatterResonatorEngine = new AxionQuarkNuggetDarkMatterResonatorEngine();
