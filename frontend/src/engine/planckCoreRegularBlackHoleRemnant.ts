/**
 * 漸近安全量子引力普朗克核黑洞殘餘與非奇異正則視界共振器引擎
 * (Asymptotically Safe Planck-Core Regular Black Hole Remnant & Inner-Horizon Resonator Engine)
 *
 * 物理原理：
 * 1. 在泛函重整化群改進之漸近安全量子引力黑洞度規 (Bonanno-Reuter / Hayward Regular Black Hole) 中，
 *    跑動牛頓常數 G(r) = G_0 r^3 / (r^3 + \tilde{\omega} G_0 \hbar (r + \gamma G_0 M)) 在超短距離處軟化引力，
 *    使度規函數 f(r) = 1 - 2 G(r) M / r 在核心 r \to 0 處消除經典奇點，代之以有限曲率之「德西特普朗克內核」
 *    (De Sitter Planck Core, f(r) \approx 1 - (\Lambda_{eff}/3) r^2，克雷奇曼曲率不變量有上界 K_{max} \sim \ell_{Pl}^{-4})。
 * 2. 正則黑洞同時具有外部事件視界 r_+ 與內部柯西視界 (Inner Cauchy Horizon) r_-。
 * 3. 當霍金蒸發使質量降低並趨近臨界普朗克殘餘質量 M_{crit} \approx M_{Pl} \sqrt{\tilde{\omega}} 時，
 *    內外雙視界簡併重合 (r_+ - r_- \to 0)，表面重力與霍金溫度歸零 (T_H \propto (r_+ - r_-) / r_+^2 \to 0)，
 *    停止熱蒸發並穩定為零溫暗物質「普朗克核黑洞殘餘」(Planck-Core Remnant)，內部視界勢阱支持長壽命準正則引力回聲駐波。
 */

export type PlanckCoreRemnantRegime =
  | 'semiclassical-two-horizon-hawking-evaporation'
  | 'maximum-hawking-temperature-inflexion-peak'
  | 'extremal-horizon-merger-planck-remnant'
  | 'de-sitter-core-quasinormal-echo-cavity';

export interface RegularHorizonEchoNode {
  id: number;
  x: number;
  y: number;
  horizonZone: 'de-sitter-core' | 'inner-cauchy-horizon' | 'outer-event-horizon';
  metricLapseFr: number;
  kretschmannCurvatureRatio: number;
  trappedEchoAmplitude: number;
}

export interface PlanckCoreRemnantState {
  blackHoleMassPlanckRatio: number;       // 黑洞質量與普朗克質量比 M / M_{Pl} (1.15 ~ 12.00)
  rgQuantumParameterOmega: number;        // 漸近安全重整化群量子修正係數 \tilde{\omega} (0.40 ~ 2.50)
  horizonSeparationPlanck: number;        // 外事件視界與內柯西視界間距 \Delta r_{\pm} = (r_+ - r_-) / \ell_{Pl}
  hawkingTemperaturePlanckRatio: number;  // 修正霍金溫度比 T_H / T_{Pl} (在 M \to M_{crit} 時歸零)
  coreKretschmannBoundedRatio: number;    // 核心最大克雷奇曼曲率有界比 K(0) / K_{Planck} (0.000 ~ 1.000)
  remnantStabilityIndex: number;          // 普朗克核暗物質殘餘熱力學穩定度 S_{remnant} (0.000 ~ 1.000)
  activeRegime: PlanckCoreRemnantRegime;
  pulsePhase: number;
  horizonNodes: RegularHorizonEchoNode[];
}

const STORAGE_KEY = 'newworld_planck_core_black_hole_remnant_state_v1';

export class PlanckCoreRegularBlackHoleRemnantEngine {
  private state: PlanckCoreRemnantState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): PlanckCoreRemnantState {
    const defaults: PlanckCoreRemnantState = {
      blackHoleMassPlanckRatio: 1.85,
      rgQuantumParameterOmega: 1.18,
      horizonSeparationPlanck: 0.42,
      hawkingTemperaturePlanckRatio: 0.014,
      coreKretschmannBoundedRatio: 0.845,
      remnantStabilityIndex: 0.942,
      activeRegime: 'extremal-horizon-merger-planck-remnant',
      pulsePhase: 0,
      horizonNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Planck-Core Black Hole Remnant state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Planck-Core Black Hole Remnant state:', e);
      }
    }
  }

  public getState(): Readonly<PlanckCoreRemnantState> {
    return this.state;
  }

  public setBlackHoleMassRatio(mRatio: number): void {
    this.state.blackHoleMassPlanckRatio = Math.max(1.15, Math.min(12.00, parseFloat(mRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRgQuantumParameter(omegaVal: number): void {
    this.state.rgQuantumParameterOmega = Math.max(0.40, Math.min(2.50, parseFloat(omegaVal.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: PlanckCoreRemnantRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'semiclassical-two-horizon-hawking-evaporation':
        this.state.blackHoleMassPlanckRatio = 8.50;
        this.state.rgQuantumParameterOmega = 1.00;
        break;
      case 'maximum-hawking-temperature-inflexion-peak':
        this.state.blackHoleMassPlanckRatio = 2.95;
        this.state.rgQuantumParameterOmega = 1.15;
        break;
      case 'extremal-horizon-merger-planck-remnant':
        this.state.blackHoleMassPlanckRatio = 1.85;
        this.state.rgQuantumParameterOmega = 1.18;
        break;
      case 'de-sitter-core-quasinormal-echo-cavity':
        this.state.blackHoleMassPlanckRatio = 2.25;
        this.state.rgQuantumParameterOmega = 1.65;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const m = this.state.blackHoleMassPlanckRatio;
    const omega = this.state.rgQuantumParameterOmega;

    // 臨界殘餘質量 M_{crit} = 1.65 * \sqrt{\omega}
    const mCrit = 1.65 * Math.sqrt(omega);
    const massExcess = Math.max(0.0, m - mCrit);

    // 內外視界間距 \Delta r_{\pm} = r_+ - r_-
    const deltaR = 2.0 * Math.sqrt(Math.max(0.0, m * m - mCrit * mCrit));
    this.state.horizonSeparationPlanck = parseFloat(deltaR.toFixed(2));

    // Bonanno-Reuter 正則黑洞霍金溫度：在 M = M_{crit} 處 T_H = 0，在 M \approx 1.7 M_{crit} 達峰值，大質量處 ~ 1/(8\pi M)
    const temp = massExcess <= 0.001
      ? 0.0
      : (0.18 * Math.sqrt(massExcess)) / Math.pow(m, 1.85);
    this.state.hawkingTemperaturePlanckRatio = parseFloat(temp.toFixed(4));

    // 德西特內核有界克雷奇曼曲率比 K(0) / K_{Pl} = 24 / (9 \omega^2) 之歸一化指標
    const kBound = Math.min(0.995, 1.0 / (0.65 + 0.45 * omega));
    this.state.coreKretschmannBoundedRatio = parseFloat(kBound.toFixed(3));

    // 普朗克核殘餘穩定度指標：越接近極端雙視界重合 M_{crit} 越穩定 (T_H \to 0)
    const stability = Math.exp(-Math.pow(massExcess / 2.2, 2));
    this.state.remnantStabilityIndex = parseFloat(Math.max(0.05, stability).toFixed(3));

    // 生成 18 個德西特普朗克核、內柯西視界與外事件視界準正則駐波節點 (3 同心環 × 6 節點)
    const nodes: RegularHorizonEchoNode[] = [];
    const rCore = 28;
    const rInner = 56;
    const rOuter = Math.min(106, 58 + deltaR * 3.2);

    for (let i = 0; i < 18; i++) {
      const ring = Math.floor(i / 6);
      const idx = i % 6;
      const zone: 'de-sitter-core' | 'inner-cauchy-horizon' | 'outer-event-horizon' =
        ring === 0 ? 'de-sitter-core' : ring === 1 ? 'inner-cauchy-horizon' : 'outer-event-horizon';
      const r = ring === 0 ? rCore : ring === 1 ? rInner : rOuter;
      const angle = (idx / 6) * 2.0 * Math.PI + this.state.pulsePhase * (ring === 1 ? -0.35 : 0.28);

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        horizonZone: zone,
        metricLapseFr: parseFloat((ring === 0 ? 0.65 : 0.02).toFixed(2)),
        kretschmannCurvatureRatio: parseFloat((ring === 0 ? kBound : kBound * 0.35).toFixed(3)),
        trappedEchoAmplitude: parseFloat((0.45 + 0.55 * stability * Math.abs(Math.cos(angle * 2))).toFixed(3))
      });
    }
    this.state.horizonNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.68 + this.state.remnantStabilityIndex * 0.72;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerPlanckRemnantSound(): void {
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
      const oscOuter = this.audioCtx.createOscillator();
      const oscInner = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscOuter.type = 'sine';
      oscInner.type = 'triangle';

      // 外事件視界 r_+ 與內柯西視界 r_- 雙視界合併共鳴 (當 r_+ \to r_- 時拍頻收斂為純音)
      const fBase = 240 + this.state.coreKretschmannBoundedRatio * 180;
      const splitHz = this.state.horizonSeparationPlanck * 11.0;

      oscOuter.frequency.setValueAtTime(fBase + splitHz, t);
      oscOuter.frequency.exponentialRampToValueAtTime(fBase, t + 0.42);

      oscInner.frequency.setValueAtTime(Math.max(110, fBase - splitHz), t);
      oscInner.frequency.exponentialRampToValueAtTime(fBase, t + 0.42);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscOuter.connect(gain);
      oscInner.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscOuter.start(t);
      oscInner.start(t);
      oscOuter.stop(t + 0.58);
      oscInner.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in PlanckCoreRegularBlackHoleRemnantEngine:', e);
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

export const planckCoreRegularBlackHoleRemnantEngine = new PlanckCoreRegularBlackHoleRemnantEngine();
