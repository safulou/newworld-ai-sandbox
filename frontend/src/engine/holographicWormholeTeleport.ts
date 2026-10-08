/**
 * 全息蟲洞量子隱形傳態對偶反應爐 (Holographic Traversable Wormhole Teleportation Reactor)
 *
 * 核心物理理論：
 * 1. ER=EPR 幾何對偶猜想 (Einstein-Rosen Bridge = Einstein-Podolsky-Rosen Entanglement)：
 *    雙邊黑洞幾何（如雙曲反德西特時空 AdS_2 中的 Jackiw-Teitelboim 引力）
 *    由微觀量子邊界系統的熱場雙重態 (Thermofield Double State, TFD) 完全重構：
 *    |\text{TFD}\rangle = \frac{1}{\sqrt{Z}} \sum_n e^{-\beta E_n/2} |n\rangle_L |n\rangle_R。
 * 2. 高-賈弗里斯-沃爾可穿越蟲洞協定 (Gao-Jafferis-Wall Traversable Wormhole)：
 *    在左右邊界施加非局域雙跡耦合 H_{int} = -g \mathcal{O}_L \mathcal{O}_R，
 *    在引力本體中注入負能量應力能量張量 \langle T_{kk} \rangle < 0，
 *    破缺零能量條件 (Null Energy Condition, NEC)，產生正向夏皮羅時間超前 \Delta v > 0，張開蟲洞喉部。
 * 3. 量子資訊蟲洞穿梭 (Quantum Information Traversal)：
 *    在左側邊界早期射入之量子位元 (Qubit)，被黑洞快速擾亂 (Fast Scrambling, \lambda_L = 2\pi k_B T / \hbar)，
 *    經由張開的蟲洞喉部因果穿梭至右側邊界完成高保真度重構，實現量子隱形傳態之全息引力對偶。
 */

export type WormholeRegime =
  | 'thermofield-double'       // 熱場雙重態雙邊糾纏黑洞靜止態
  | 'negative-energy-throat'   // 負能量脈衝喉部張開通道相
  | 'quantum-teleport-pulse'   // 量子位元高保真度蟲洞穿梭相
  | 'syk-many-body-chaos';     // SYK 隨機非費米液體多體混亂態

export interface WormholeTeleportState {
  couplingStrengthG: number;    // 雙邊非局域耦合常數 g_LR (0.0 ~ 2.0)
  tfdTemperature: number;       // TFD 系統溫度 T (0.05 ~ 1.5)
  insertionTimeSec: number;     // 量子位元注入時機 t_insert (-5.0 ~ 0.0 s)
  sykFermionCount: number;      // SYK 費米子數 N (16 ~ 128)
  regime: WormholeRegime;
  // 動態演算物理指標
  throatOpeningDv: number;      // 蟲洞喉部張開量 \Delta v (正值表示可穿越)
  teleportFidelity: number;     // 隱形傳態保真度 F (0.0 ~ 1.0)
  negativeEnergyDensity: number;// 本體負能量密度 \langle T_{kk} \rangle (<0)
  mutualInformation: number;    // 雙邊互資訊 I(L:R) (nats)
  lyapunovExponent: number;     // 擾亂李雅普諾夫指數 \lambda_L
  qubitTransitPhase: number;    // 量子位元穿梭相位 (0.0 未發射，0~1 穿梭中，1.0 抵達)
  telemetryHistory: Array<{
    timestamp: number;
    throatOpening: number;
    fidelity: number;
    negativeEnergy: number;
  }>;
}

const STORAGE_KEY = 'newworld_wormhole_teleport_state_v1';

class HolographicWormholeTeleportEngine {
  private state: WormholeTeleportState;
  private audioCtx: AudioContext | null = null;
  private isTeleporting = false;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): WormholeTeleportState {
    return {
      couplingStrengthG: 0.85,
      tfdTemperature: 0.45,
      insertionTimeSec: -2.8,
      sykFermionCount: 64,
      regime: 'quantum-teleport-pulse',
      throatOpeningDv: 0.42,
      teleportFidelity: 0.965,
      negativeEnergyDensity: -1.35,
      mutualInformation: 4.88,
      lyapunovExponent: 2.82,
      qubitTransitPhase: 0.0,
      telemetryHistory: []
    };
  }

  private loadState(): WormholeTeleportState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: parsed.telemetryHistory || []
        };
      }
    } catch {
      // fallback
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  public getState(): WormholeTeleportState {
    return this.state;
  }

  public setCouplingG(g: number): void {
    this.state.couplingStrengthG = Math.max(0.0, Math.min(2.0, g));
    this.recalculatePhysics();
  }

  public setTemperature(t: number): void {
    this.state.tfdTemperature = Math.max(0.05, Math.min(1.5, t));
    this.recalculatePhysics();
  }

  public setInsertionTime(time: number): void {
    this.state.insertionTimeSec = Math.max(-5.0, Math.min(0.0, time));
    this.recalculatePhysics();
  }

  public setSykFermions(n: number): void {
    this.state.sykFermionCount = Math.max(16, Math.min(128, n));
    this.recalculatePhysics();
  }

  public setRegime(regime: WormholeRegime): void {
    this.state.regime = regime;
    this.recalculatePhysics();
    this.playRegimeChord(regime);
  }

  public launchQubitTeleport(): void {
    this.isTeleporting = true;
    this.state.qubitTransitPhase = 0.01;
    this.playTeleportLaunchAudio();
  }

  public update(delta: number): void {
    if (this.isTeleporting) {
      this.state.qubitTransitPhase += delta * 0.65;
      if (this.state.qubitTransitPhase >= 1.0) {
        this.state.qubitTransitPhase = 1.0;
        this.isTeleporting = false;
        this.playTeleportArrivalAudio();
      }
    }

    this.recalculatePhysics();

    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        throatOpening: this.state.throatOpeningDv,
        fidelity: this.state.teleportFidelity,
        negativeEnergy: this.state.negativeEnergyDensity
      });
      if (this.state.telemetryHistory.length > 50) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recalculatePhysics(): void {
    const g = this.state.couplingStrengthG;
    const T = this.state.tfdTemperature;
    const t_ins = this.state.insertionTimeSec;

    // 1. 李雅普諾夫指數 (混沌極限 \lambda_L \le 2\pi T)
    this.state.lyapunovExponent = 2 * Math.PI * T * 0.98;

    // 2. 本體注入負能量密度 \langle T_{kk} \rangle \propto -g
    this.state.negativeEnergyDensity = - (1.6 * g) / (1 + 0.5 * T);

    // 3. 夏皮羅超前 / 蟲洞喉部張開量 \Delta v
    // \Delta v \propto g \cdot e^{\lambda_L |t_ins|}
    const scramFactor = Math.min(8.0, Math.exp(Math.min(2.5, this.state.lyapunovExponent * Math.abs(t_ins) * 0.2)));
    const dvRaw = g * 0.35 * scramFactor - 0.1;
    this.state.throatOpeningDv = Math.max(-0.2, dvRaw);

    // 4. 量子隱形傳態保真度 F
    // 喉部必須張開 (\Delta v > 0) 且不能過度畸變
    if (this.state.throatOpeningDv > 0) {
      const optPeak = Math.exp(-Math.pow((this.state.throatOpeningDv - 0.45) / 0.5, 2));
      this.state.teleportFidelity = Math.max(0.5, Math.min(0.995, 0.72 + 0.27 * optPeak));
    } else {
      this.state.teleportFidelity = 0.5; // 經典隨機猜測下限
    }

    // 5. 雙邊互資訊 I(L:R)
    this.state.mutualInformation = Math.max(0.5, 3.5 / (T + 0.2) + 1.2 * g);

    // 體制修正
    switch (this.state.regime) {
      case 'thermofield-double':
        this.state.throatOpeningDv = -0.05;
        this.state.teleportFidelity = 0.5;
        break;
      case 'negative-energy-throat':
        this.state.negativeEnergyDensity *= 1.4;
        break;
      case 'quantum-teleport-pulse':
        this.state.teleportFidelity = Math.max(0.95, this.state.teleportFidelity);
        break;
      case 'syk-many-body-chaos':
        this.state.lyapunovExponent *= 1.05;
        break;
    }
  }

  // === Procedural Web Audio API ===
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playTeleportLaunchAudio(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 負能量脈衝下潛音 (Negative energy downward glide)
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.45);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }

  private playTeleportArrivalAudio(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 抵達重構和弦 (Arpeggiated reconstruction chime)
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  private playRegimeChord(regime: WormholeRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      let freqs = [261.63, 329.63, 392.0]; // C4, E4, G4
      if (regime === 'negative-energy-throat') freqs = [220.0, 277.18, 329.63]; // A3, C#4, E4
      if (regime === 'quantum-teleport-pulse') freqs = [349.23, 440.0, 523.25]; // F4, A4, C5
      if (regime === 'syk-many-body-chaos') freqs = [196.0, 246.94, 293.66]; // G3, B3, D4

      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05 / (idx + 1), this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);
      });
    } catch {
      // ignore
    }
  }
}

export const holographicWormholeEngine = new HolographicWormholeTeleportEngine();
