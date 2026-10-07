/**
 * 相對論性量子資訊穿梭超流波導 (Relativistic Quantum Teleportation Superfluid Waveguide)
 * 
 * 理論基礎：
 * 1. 相對論性量子資訊與烏魯赫熱力學效應 (Alsing & Milburn 2003)
 * 2. 加速度 a 導致烏魯赫輻射 T_U = ħa/(2πc k_B) 降解真空糾纏保真度
 * 3. 超流體 BEC 拓撲聲子波導透過相干幾何相位補償建立「加速免疫貝爾基糾纏對」
 * 4. 突破傳統因果光錐限制之跨視界量子隱形傳態協定
 * 5. 4 大傳態體制：
 *    - unruh_immune_bell: 烏魯赫免疫貝爾態穿梭
 *    - cross_horizon_phonon: 聲學視界跨界傳態
 *    - ctc_gravity_channel: 閉合類時曲線時空引力通道
 *    - lossless_relativistic_qkd: 零丟包相對論性量子密鑰中繼
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成量子傳態穿梭音、烏魯赫噪聲相消定音與貝爾基相干純音
 * - HTML5 Canvas 2D 呈現雙曲閔可夫斯基時空光錐、加速世界線與糾纏聲子波導密度矩陣
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type RelativisticTeleportRegime = 
  | 'unruh_immune_bell' 
  | 'cross_horizon_phonon' 
  | 'ctc_gravity_channel' 
  | 'lossless_relativistic_qkd';

export interface TeleportEventRecord {
  id: string;
  qubitState: string; // e.g. "α|0⟩ + β|1⟩"
  accelerationG: number;
  fidelityPercent: number;
  entanglementPreservedPercent: number;
  unruhNoiseSuppressedDb: number;
  timestamp: number;
}

export interface RelativisticTeleportState {
  regime: RelativisticTeleportRegime;
  accelerationG: number; // 加速度 (1 ~ 500 g)
  unruhTemperatureMicroK: number; // 烏魯赫溫度 (μK)
  bellFidelityPercent: number; // 貝爾態保真度
  waveguidePhononSpeedMs: number; // 超流聲波導流速
  quantumInformationThroughputQps: number; // 量子位元吞吐量 (Q/s)
  teleportFlux: number; // 傳態通量
  eventHistory: TeleportEventRecord[];
  autoTeleport: boolean;
  totalTeleportsExecuted: number;
}

const STORAGE_KEY = 'newworld_relativistic_teleportation';

class RelativisticTeleportationEngine {
  private state: RelativisticTeleportState = {
    regime: 'unruh_immune_bell',
    accelerationG: 85.0,
    unruhTemperatureMicroK: 3.42,
    bellFidelityPercent: 99.4,
    waveguidePhononSpeedMs: 14.8,
    quantumInformationThroughputQps: 420.0,
    teleportFlux: 620.0,
    eventHistory: [],
    autoTeleport: true,
    totalTeleportsExecuted: 21
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeRelativity();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): RelativisticTeleportState {
    return { ...this.state, eventHistory: [...this.state.eventHistory] };
  }

  public setRegime(regime: RelativisticTeleportRegime): void {
    this.state.regime = regime;
    this.recomputeRelativity();
    this.playBellStatePurityPing();
    this.saveState();
  }

  public setAccelerationG(g: number): void {
    this.state.accelerationG = Math.max(1.0, Math.min(500.0, parseFloat(g.toFixed(1))));
    this.recomputeRelativity();
    this.saveState();
  }

  public setAutoTeleport(enabled: boolean): void {
    this.state.autoTeleport = enabled;
    this.saveState();
  }

  /**
   * 計算相對論性加速時空參數與糾纏保真度
   */
  public recomputeRelativity(): void {
    const a = this.state.accelerationG;
    
    // 烏魯赫效應溫度 T_U = (ħ a) / (2π c k_B)
    this.state.unruhTemperatureMicroK = parseFloat((a * 0.0402).toFixed(3));

    // 超流波導主動抑制噪聲因子
    let immuneFactor = 0.95;
    if (this.state.regime === 'unruh_immune_bell') immuneFactor = 0.995;
    if (this.state.regime === 'cross_horizon_phonon') immuneFactor = 0.985;
    if (this.state.regime === 'ctc_gravity_channel') immuneFactor = 0.992;
    if (this.state.regime === 'lossless_relativistic_qkd') immuneFactor = 0.998;

    // 保真度計算 (避免高加速度產生熱退相干)
    const thermalDepolarization = (this.state.unruhTemperatureMicroK * 0.008) * (1.0 - immuneFactor);
    const fidelity = 99.9 - thermalDepolarization * 100.0;
    this.state.bellFidelityPercent = parseFloat(Math.min(99.99, Math.max(70.0, fidelity)).toFixed(2));

    // 吞吐量
    this.state.quantumInformationThroughputQps = parseFloat((250.0 + (a / 500.0) * 450.0 * immuneFactor).toFixed(1));
  }

  /**
   * 執行跨視界量子隱形傳態 (Teleport Quantum State)
   */
  public teleportQuantumState(): TeleportEventRecord {
    this.recomputeRelativity();
    const fidelity = parseFloat((this.state.bellFidelityPercent * (0.997 + Math.random() * 0.003)).toFixed(2));
    const noiseSuppressed = parseFloat((18.0 + (this.state.accelerationG / 500.0) * 15.0 + Math.random() * 3.0).toFixed(1));

    const record: TeleportEventRecord = {
      id: `teleport-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      qubitState: `${(Math.random() * 0.8 + 0.2).toFixed(2)}|0⟩ + ${(Math.random() * 0.8 + 0.2).toFixed(2)}|1⟩`,
      accelerationG: this.state.accelerationG,
      fidelityPercent: Math.min(100, fidelity),
      entanglementPreservedPercent: parseFloat((fidelity * 0.998).toFixed(2)),
      unruhNoiseSuppressedDb: noiseSuppressed,
      timestamp: Date.now()
    };

    this.state.eventHistory.unshift(record);
    if (this.state.eventHistory.length > 20) {
      this.state.eventHistory.pop();
    }

    this.state.totalTeleportsExecuted++;
    this.state.teleportFlux += 48.0 + (this.state.accelerationG * 0.1);

    this.playTeleportWoosh();
    this.saveState();
    return record;
  }

  /**
   * 校準超流波導流速與抑制烏魯赫噪聲
   */
  public calibrateWaveguide(): void {
    this.state.teleportFlux += 80.0;
    this.playUnruhNoiseSuppression();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoTeleport) {
      this.state.teleportFlux += delta * (1.2 + this.state.quantumInformationThroughputQps * 0.003);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playTeleportWoosh(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260.0, now);
      osc.frequency.exponentialRampToValueAtTime(1400.0, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(440.0, now + 0.4);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // 容錯靜音
    }
  }

  public playUnruhNoiseSuppression(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660.0, now);
      osc.frequency.linearRampToValueAtTime(330.0, now + 0.25);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // 容錯靜音
    }
  }

  public playBellStatePurityPing(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now); // G5
      osc.frequency.setValueAtTime(1174.66, now + 0.08); // D6

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
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

export const relativisticTeleportEngine = new RelativisticTeleportationEngine();
