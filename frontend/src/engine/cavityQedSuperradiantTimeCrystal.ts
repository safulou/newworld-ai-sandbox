/**
 * 腔量子電動力學超輻射時間晶體與耗散林德布拉德極限環雷射引擎
 * (Cavity-QED Superradiant Time Crystal & Dissipative Lindblad Limit-Cycle Laser Engine)
 *
 * 物理原理：
 * 1. 在由超高精細度光學微腔與 N ~ 10^6 個超冷鹼土金屬原子（如 ^{87}Sr 毫赫茲窄線寬鐘躍遷）耦合之開放 Dicke 系統中，
 *    系統演化由林德布拉德主方程 (Lindblad Master Equation) 支配：
 *    d\rho/dt = -i [H_{Dicke}, \rho] + \kappa D[a]\rho + W_{pump} \sum_j D[\sigma_j^+]\rho。
 * 2. 當集體協同參數 (Collective Cooperativity) C_{coll} = 4 g^2 N / (\kappa \gamma_\perp) 與非相干重泵浦率 W_{pump}
 *    跨越 Hopf 分岔閾值時，劉維爾超算符 (Liouvillian Superoperator) L 的本徵譜能隙實部在熱力學極限 N \to \infty 下趨於零
 *    (Re(\lambda_1) \propto -1/N \to 0)，而虛部保持非零 Im(\lambda_1) = \pm \omega_{CTC}。
 * 3. 系統在無週期性外部驅動 (Autonomous / Continuous) 下自發破缺連續時間平移對稱性，進入「邊界時間晶體 / 超輻射連續時間晶體」
 *    (Continuous Time Crystal, CTC) 極限環相，同時輸出線寬突破標準 Schawlow-Townes 極限之毫赫茲超輻射相干光子流。
 */

export type SuperradiantTimeCrystalRegime =
  | 'subthreshold-normal-cavity-decay'
  | 'stationary-hepp-lieb-superradiant-phase'
  | 'autonomous-limit-cycle-continuous-time-crystal'
  | 'period-doubled-chaotic-dicke-turbulence';

export interface DickeLimitCycleNode {
  id: number;
  x: number;
  y: number;
  blochInversionJz: number;
  transverseDipoleJperp: number;
  liouvillianPhaseRad: number;
  intracavityPhotonFlux: number;
}

export interface CavityQedSuperradiantTimeCrystalState {
  collectiveCooperativityC: number;       // 集體 Dicke 協同參數 C_{coll} = 4g^2 N / (\kappa \gamma_\perp) (0.5 ~ 25.0)
  incoherentRepumpRatioW: number;         // 非相干原子重泵浦率比 W_{pump} / \kappa (0.10 ~ 3.50)
  limitCycleFrequencyKhz: number;         // 連續時間晶體極限環自發振盪頻率 \omega_{CTC} / 2\pi (kHz)
  liouvillianCoherenceQualityQ: number;   // 劉維爾時間晶體相干品質因子 Q_{CTC} = \omega_{CTC} / |Re(\lambda_1)|
  superradiantPhotonScaleN2: number;      // 歸一化超輻射腔內光子標度 |\langle a \rangle|^2 / (N/2)^2 (0.000 ~ 1.000)
  schawlowTownesSuppressionDb: number;    // 相對於傳統雷射 Schawlow-Townes 線寬壓縮分貝 (dB)
  activeRegime: SuperradiantTimeCrystalRegime;
  pulsePhase: number;
  limitCycleNodes: DickeLimitCycleNode[];
}

const STORAGE_KEY = 'newworld_cavity_qed_superradiant_tc_state_v1';

export class CavityQedSuperradiantTimeCrystalEngine {
  private state: CavityQedSuperradiantTimeCrystalState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): CavityQedSuperradiantTimeCrystalState {
    const defaults: CavityQedSuperradiantTimeCrystalState = {
      collectiveCooperativityC: 14.5,
      incoherentRepumpRatioW: 1.45,
      limitCycleFrequencyKhz: 86.4,
      liouvillianCoherenceQualityQ: 428.0,
      superradiantPhotonScaleN2: 0.742,
      schawlowTownesSuppressionDb: 38.6,
      activeRegime: 'autonomous-limit-cycle-continuous-time-crystal',
      pulsePhase: 0,
      limitCycleNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Cavity-QED Superradiant Time Crystal state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Cavity-QED Superradiant Time Crystal state:', e);
      }
    }
  }

  public getState(): Readonly<CavityQedSuperradiantTimeCrystalState> {
    return this.state;
  }

  public setCollectiveCooperativity(cooperativity: number): void {
    this.state.collectiveCooperativityC = Math.max(0.5, Math.min(25.0, parseFloat(cooperativity.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setIncoherentRepumpRatio(wRatio: number): void {
    this.state.incoherentRepumpRatioW = Math.max(0.10, Math.min(3.50, parseFloat(wRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: SuperradiantTimeCrystalRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'subthreshold-normal-cavity-decay':
        this.state.collectiveCooperativityC = 1.2;
        this.state.incoherentRepumpRatioW = 0.25;
        break;
      case 'stationary-hepp-lieb-superradiant-phase':
        this.state.collectiveCooperativityC = 8.5;
        this.state.incoherentRepumpRatioW = 0.78;
        break;
      case 'autonomous-limit-cycle-continuous-time-crystal':
        this.state.collectiveCooperativityC = 14.5;
        this.state.incoherentRepumpRatioW = 1.45;
        break;
      case 'period-doubled-chaotic-dicke-turbulence':
        this.state.collectiveCooperativityC = 22.0;
        this.state.incoherentRepumpRatioW = 2.85;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const cColl = this.state.collectiveCooperativityC;
    const wPump = this.state.incoherentRepumpRatioW;

    // 超輻射開啟閾值 C_{crit} ≈ 2.0，極限環 Hopf 分岔窗口在 wPump ∈ [0.95, 2.4]
    const superradiantTurnOn = 1.0 / (1.0 + Math.exp(-(cColl - 2.5) / 1.1));
    const hopfWindow = Math.exp(-Math.pow(wPump - 1.55, 2) / 0.85);

    // 極限環自發振盪頻率 \omega_{CTC} / 2\pi ∝ \kappa \sqrt{C_{coll} w_{pump} - 1}
    const effectiveDrive = Math.max(0.0, cColl * wPump - 2.2);
    const omegaKhz = superradiantTurnOn * (6.5 + 17.8 * Math.sqrt(effectiveDrive));
    this.state.limitCycleFrequencyKhz = parseFloat(omegaKhz.toFixed(1));

    // 劉維爾時間晶體品質因子 Q_{CTC}
    const qFactor = 12.0 + 480.0 * superradiantTurnOn * hopfWindow * (cColl / 15.0);
    this.state.liouvillianCoherenceQualityQ = parseFloat(qFactor.toFixed(1));

    // 歸一化超輻射光子數 |\langle a \rangle|^2 / (N/2)^2
    const n2Scale = Math.min(0.985, superradiantTurnOn * (0.22 + 0.68 * Math.tanh(cColl / 11.0)) * Math.exp(-Math.pow(wPump - 1.45, 2) / 2.2));
    this.state.superradiantPhotonScaleN2 = parseFloat(Math.max(0.008, n2Scale).toFixed(3));

    // Schawlow-Townes 線寬壓縮分貝 (dB)
    const stDb = Math.max(1.5, 44.5 * superradiantTurnOn * Math.tanh(cColl / 12.0) * (0.55 + 0.45 * hopfWindow));
    this.state.schawlowTownesSuppressionDb = parseFloat(stDb.toFixed(1));

    // 生成 16 個集體 Dicke 布洛赫球極限環軌跡節點 (Limit-Cycle Trajectory Nodes)
    const nodes: DickeLimitCycleNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * 0.45;
      // 李薩如-霍普夫極限環吸引子半徑
      const rBase = 24 + 68 * this.state.superradiantPhotonScaleN2;
      const harmonicMod = this.state.activeRegime === 'period-doubled-chaotic-dicke-turbulence'
        ? 14 * Math.cos(2.0 * theta)
        : 6 * Math.sin(2.0 * theta);

      const rx = (rBase + harmonicMod) * Math.cos(theta);
      const ry = (rBase * 0.82 - harmonicMod * 0.5) * Math.sin(theta);

      const x = 165 + rx;
      const y = 160 + ry;

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        blochInversionJz: parseFloat((0.65 * Math.sin(theta) * superradiantTurnOn).toFixed(2)),
        transverseDipoleJperp: parseFloat((this.state.superradiantPhotonScaleN2 * (0.8 + 0.2 * Math.cos(theta))).toFixed(2)),
        liouvillianPhaseRad: parseFloat((theta % (2 * Math.PI)).toFixed(2)),
        intracavityPhotonFlux: parseFloat((this.state.superradiantPhotonScaleN2 * 100.0 * (0.75 + 0.25 * Math.cos(theta))).toFixed(1))
      });
    }
    this.state.limitCycleNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + (this.state.limitCycleFrequencyKhz / 100.0) * 0.9;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerSuperradiantClockSound(): void {
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
      const oscClock = this.audioCtx.createOscillator();
      const oscLimitCycle = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscClock.type = 'sine';
      oscLimitCycle.type = 'sine';

      const fClock = 440 + this.state.limitCycleFrequencyKhz * 1.8;
      const fBeat = Math.max(4, this.state.limitCycleFrequencyKhz * 0.15);

      oscClock.frequency.setValueAtTime(fClock, t);
      oscLimitCycle.frequency.setValueAtTime(fClock + fBeat, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscClock.connect(gain);
      oscLimitCycle.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscClock.start(t);
      oscLimitCycle.start(t);
      oscClock.stop(t + 0.58);
      oscLimitCycle.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in CavityQedSuperradiantTimeCrystalEngine:', e);
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

export const cavityQedSuperradiantTimeCrystalEngine = new CavityQedSuperradiantTimeCrystalEngine();
