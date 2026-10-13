/**
 * 非可換阿貝爾-希格斯渦旋弦宇宙暴脹發電機
 * (Non-Abelian Abrikosov-Nielsen-Olesen Cosmic Vortex Dynamo)
 *
 * 核心物理理論：
 * 1. 非可換阿貝爾-尼爾森-奧爾森 (ANO) 拓撲渦旋弦 (Non-Abelian ANO Cosmic String)：
 *    在 U(1) \times SU(2) 對稱性自發破缺至對角群 U(1)_d 的宇宙暴脹真空相變中，
 *    拓撲第一同倫群 \pi_1(G/H) \neq 0 催生攜帶非可換非阿貝爾顏色磁通量之超導宇宙弦。
 * 2. 玻戈莫爾尼-普拉薩德-索莫菲爾德 (BPS) 飽和臨界態 (BPS Saturated Bound)：
 *    當希格斯自耦合 \lambda 與規範耦合 g 滿足比值 \beta = \lambda / (2g^2) = 1 時，
 *    標量相互吸引力與規範相互排斥力嚴格抵消，弦張力精確飽和拓撲下界 \mu = 2\pi v^2 n。
 *    任意數目之平行非阿貝爾渦旋弦可在任意距離維持靜止中性平衡。
 * 3. 非阿貝爾弦重聯幾率與拓撲阻挫 (String Reconnection Probability & Topological Frustration)：
 *    與普通阿貝爾宇宙弦碰撞 100% 重聯 (p=1) 不同，非阿貝爾通量由於辮群不對易性，碰撞重聯幾率顯著低於 1 (p \ll 1)；
 *    碰撞無法重聯時形成無法解開的三叉接頭 (Y-junctions) 與複雜糾纏弦網，延遲宇宙弦網稀釋衰變。
 * 4. 宇宙暴脹弦環坍縮與原初超能重子釋放 (Cosmic Inflation Vortex Loop Collapse)：
 *    閉合非阿貝爾渦旋弦環在張力驅動下以近光速收縮，坍縮奇點爆發 PeV 級大統一理論 (GUT) 原始粒子與相干引力波。
 */

export type CosmicVortexRegime =
  | 'bps-saturated-topological-vortex'     // BPS 臨界飽和拓撲渦旋相 (\beta = 1.0)
  | 'non-abelian-flux-reconnection-surge' // 非阿貝爾磁通碰撞重聯激增相
  | 'abrikosov-vortex-lattice-array'       // 阿布里科索夫六角超流渦旋陣列態
  | 'semilocal-string-network-decay';      // 半局域宇宙弦網衰減輻射相

export interface NonAbelianVortexState {
  bpsCouplingRatioBeta: number;           // BPS 耦合比 \beta = \lambda / (2g^2) (0.2 ~ 3.0)
  higgsVevGevScaleLog10: number;          // 希格斯真空期望值 log10(v / GeV, 10 ~ 16)
  vortexWindingNumberN: number;           // 拓撲環繞數 n (整數, 1 ~ 6)
  stringReconnectionProbP: number;        // 重聯幾率 p (0.01 ~ 1.00)
  regime: CosmicVortexRegime;

  // 動態演算物理指標
  stringTensionMuGev2: number;            // 弦張力 \mu (10^30 GeV^2)
  coreRadiusFemtometer: number;           // 渦旋核心半徑 r_core (fm)
  interVortexForceNormalized: number;     // 渦旋間相互作用力 F_int (負為吸引，正為排斥，0為BPS)
  nonAbelianFluxQuantumHBarC: number;     // 非阿貝爾通量量子 \Phi
  cosmicEnergyDensityGevM3: number;       // 宇宙弦能量密度 (10^24 GeV/m^3)
  telemetryHistory: Array<{
    timestamp: number;
    tensionMu: number;
    forceF: number;
    reconnectionP: number;
  }>;
}

const STORAGE_KEY = 'newworld_non_abelian_cosmic_vortex_state_v1';

class NonAbelianCosmicVortexEngine {
  private state: NonAbelianVortexState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): NonAbelianVortexState {
    return {
      bpsCouplingRatioBeta: 1.0, // 精確 BPS 臨界
      higgsVevGevScaleLog10: 15.2,
      vortexWindingNumberN: 2,
      stringReconnectionProbP: 0.18,
      regime: 'bps-saturated-topological-vortex',
      stringTensionMuGev2: 12.5,
      coreRadiusFemtometer: 0.045,
      interVortexForceNormalized: 0.0,
      nonAbelianFluxQuantumHBarC: 4.0,
      cosmicEnergyDensityGevM3: 88.4,
      telemetryHistory: []
    };
  }

  private loadState(): NonAbelianVortexState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
        };
      }
    } catch {
      // 降級使用預設
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 忽略儲存例外
    }
  }

  public getState(): NonAbelianVortexState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;

    // 1. 弦張力 \mu = 2\pi v^2 n f(\beta)
    // 歸一化張力
    const baseMu = 2 * Math.PI * s.vortexWindingNumberN * (s.higgsVevGevScaleLog10 / 15.0);
    s.stringTensionMuGev2 = Number((baseMu * Math.sqrt(s.bpsCouplingRatioBeta)).toFixed(2));

    // 2. 核心半徑 r_core \sim 1 / (g v)
    s.coreRadiusFemtometer = Number((0.08 / (s.higgsVevGevScaleLog10 / 14.0 * Math.sqrt(s.bpsCouplingRatioBeta))).toFixed(4));

    // 3. 渦旋間相互作用力：\beta < 1 吸引 (Type I)，\beta > 1 排斥 (Type II)，\beta = 1 零力 (BPS)
    const force = (s.bpsCouplingRatioBeta - 1.0) * 1.5;
    s.interVortexForceNormalized = Number(force.toFixed(2));

    // 4. 非阿貝爾通量量子 \Phi = 2 * n
    s.nonAbelianFluxQuantumHBarC = s.vortexWindingNumberN * 2.0;

    // 5. 能量密度
    s.cosmicEnergyDensityGevM3 = Number((s.stringTensionMuGev2 * 7.07 * (1 - s.stringReconnectionProbP * 0.4)).toFixed(1));

    // 狀態判定
    if (s.stringReconnectionProbP > 0.6) {
      s.regime = 'non-abelian-flux-reconnection-surge';
    } else if (Math.abs(s.bpsCouplingRatioBeta - 1.0) <= 0.05) {
      s.regime = 'bps-saturated-topological-vortex';
    } else if (s.bpsCouplingRatioBeta > 1.8) {
      s.regime = 'abrikosov-vortex-lattice-array';
    } else {
      s.regime = 'semilocal-string-network-decay';
    }

    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (deltaSeconds <= 0) return;
    this.recalculatePhysics();

    const now = Date.now();
    const lastTime = this.state.telemetryHistory.length > 0
      ? this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp
      : 0;

    if (now - lastTime >= 1000) {
      this.state.telemetryHistory.push({
        timestamp: now,
        tensionMu: this.state.stringTensionMuGev2,
        forceF: this.state.interVortexForceNormalized,
        reconnectionP: this.state.stringReconnectionProbP
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public tuneBPSCouplingRatio(deltaBeta: number): void {
    this.state.bpsCouplingRatioBeta = Number(Math.max(0.2, Math.min(3.0, this.state.bpsCouplingRatioBeta + deltaBeta)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(420, 640, 0.16, 'sine');
  }

  public lockExactBPSSaturation(): void {
    this.state.bpsCouplingRatioBeta = 1.0;
    this.recalculatePhysics();
    this.playTone(550, 880, 0.22, 'triangle');
  }

  public exciteWindingQuanta(deltaN: number = 1): void {
    this.state.vortexWindingNumberN = Math.max(1, Math.min(6, this.state.vortexWindingNumberN + deltaN));
    this.recalculatePhysics();
    this.playTone(380, 760, 0.18, 'sawtooth');
  }

  public triggerNonAbelianCollision(): void {
    // 激發非阿貝爾碰撞重聯
    this.state.stringReconnectionProbP = 0.85;
    this.recalculatePhysics();
    this.playTone(600, 1200, 0.3, 'square');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(300, 200, 0.2, 'sine');
  }

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playTone(fStart: number, fEnd: number, duration: number, type: OscillatorType = 'sine'): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(fStart, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 忽略音效異常
    }
  }
}

export const nonAbelianCosmicVortexEngine = new NonAbelianCosmicVortexEngine();
export const nonAbelianVortexEngine = nonAbelianCosmicVortexEngine;
