/**
 * 拓撲超導高階角態量子中繼陣列 (Higher-Order Topological Superconductor Relay)
 * 
 * 理論基礎：
 * 1. 高階拓撲絕緣體與拓撲超導體 (Higher-Order Topological Superconductors, HOTSC, Benalcazar et al. 2017)
 * 2. 2D 晶格邊界為絕緣態，但在 4 個頂角湧現拓撲保護之零能馬約拉納角態 (Majorana Zero-Energy Corner Modes)
 * 3. 體四極矩極化 q_xy = e/2，邊界質量疇壁誘導束縛態
 * 4. 角態馬約拉納非阿貝爾幾何編織 (Non-Abelian Braiding) 提供高容錯量子邏輯閘與長程糾纏中繼
 * 5. 4 大拓撲角態架構：
 *    - quadrupole_2d_hotsc: 二維二階四極子拓撲超導體
 *    - hinge_mode_bismuth: 三維三階鉍基拓撲奈米線鉸鏈態
 *    - majorana_braiding_bus: 零能馬約拉納四方編織陣列
 *    - fault_tolerant_relay: 長程容錯量子糾纏中繼節點
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成四極子四音連續和弦、角態編織非阿貝爾旋轉音階與糾纏鎖定純音
 * - HTML5 Canvas 2D 呈現正方形超導奈米晶格、4 頂角馬約拉納束縛態波動與編織幾何路徑
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type CornerArchType = 
  | 'quadrupole_2d_hotsc' 
  | 'hinge_mode_bismuth' 
  | 'majorana_braiding_bus' 
  | 'fault_tolerant_relay';

export interface CornerBraidOperation {
  id: string;
  braidedCorners: [number, number]; // e.g. [1, 2], [2, 3]
  topologicalPhaseDeg: number; // 90° / 180° / 270°
  fidelityPercent: number;
  entangledQubits: number;
  timestamp: number;
}

export interface HOTSCState {
  architecture: CornerArchType;
  quadrupoleMass: number; // 體四極矩質量參數 m (0.2 ~ 2.0)
  cornerLocalizationLengthNm: number; // 角態局域化長度 ξ (nm)
  majoranaZeroEnergyMev: number; // 零能模式能量偏離 (μeV, 逼近 0)
  bulkGapMev: number; // 體拓撲超導能隙 (meV)
  braidingFidelityPercent: number; // 編織保真度 (0 ~ 100%)
  relayEntanglementFidelity: number; // 0 ~ 1.0
  cornerFlux: number; // 拓撲角態通量
  braidHistory: CornerBraidOperation[];
  autoBraid: boolean;
  totalBraidsExecuted: number;
}

const STORAGE_KEY = 'newworld_higher_order_topo_superconductor';

class HigherOrderTopoSuperconductorEngine {
  private state: HOTSCState = {
    architecture: 'quadrupole_2d_hotsc',
    quadrupoleMass: 1.15,
    cornerLocalizationLengthNm: 3.4,
    majoranaZeroEnergyMev: 0.002, // 接近完美 0 能
    bulkGapMev: 4.85,
    braidingFidelityPercent: 99.4,
    relayEntanglementFidelity: 0.985,
    cornerFlux: 540.0,
    braidHistory: [],
    autoBraid: true,
    totalBraidsExecuted: 22
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeTopology();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): HOTSCState {
    return { ...this.state, braidHistory: [...this.state.braidHistory] };
  }

  public setArchitecture(arch: CornerArchType): void {
    this.state.architecture = arch;
    this.recomputeTopology();
    this.playQuadrupoleChord();
    this.saveState();
  }

  public setQuadrupoleMass(mass: number): void {
    this.state.quadrupoleMass = Math.max(0.2, Math.min(2.0, parseFloat(mass.toFixed(2))));
    this.recomputeTopology();
    this.saveState();
  }

  public setAutoBraid(enabled: boolean): void {
    this.state.autoBraid = enabled;
    this.saveState();
  }

  /**
   * 計算體能隙、角態局域化長度與零能模能量
   */
  public recomputeTopology(): void {
    const m = this.state.quadrupoleMass;
    
    // 能隙 Δ ~ |m - 1.0| + 2.0 (在拓撲相區保持全能隙)
    this.state.bulkGapMev = parseFloat((3.5 + Math.abs(m - 0.5) * 1.8).toFixed(2));

    // 局域化長度 ξ = v_F / Δ
    this.state.cornerLocalizationLengthNm = parseFloat((12.0 / (this.state.bulkGapMev + 0.1)).toFixed(2));

    // 零能偏離 (指數衰減 exp(-L / ξ))
    const decay = Math.exp(-18.0 / (this.state.cornerLocalizationLengthNm + 0.1));
    this.state.majoranaZeroEnergyMev = parseFloat((decay * 0.05).toFixed(4));

    // 編織與糾纏保真度
    const fid = 99.8 - this.state.majoranaZeroEnergyMev * 120.0;
    this.state.braidingFidelityPercent = parseFloat(Math.min(99.99, Math.max(90.0, fid)).toFixed(2));
    this.state.relayEntanglementFidelity = parseFloat((this.state.braidingFidelityPercent / 100.0).toFixed(4));
  }

  /**
   * 執行角態馬約拉納非阿貝爾編織 (Majorana Corner Braiding)
   */
  public performMajoranaBraid(c1: number = 1, c2: number = 2): CornerBraidOperation {
    this.recomputeTopology();
    const cornerPair: [number, number] = [c1, c2];
    const fidelity = parseFloat((this.state.braidingFidelityPercent * (0.995 + Math.random() * 0.005)).toFixed(2));

    const op: CornerBraidOperation = {
      id: `braid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      braidedCorners: cornerPair,
      topologicalPhaseDeg: 90 * (Math.floor(Math.random() * 3) + 1),
      fidelityPercent: fidelity,
      entangledQubits: Math.floor(Math.random() * 4) + 2,
      timestamp: Date.now()
    };

    this.state.braidHistory.unshift(op);
    if (this.state.braidHistory.length > 20) {
      this.state.braidHistory.pop();
    }

    this.state.totalBraidsExecuted++;
    this.state.cornerFlux += 40.0 + op.entangledQubits * 15.0;

    this.playBraidingSweep();
    this.saveState();
    return op;
  }

  /**
   * 鎖定中繼糾纏密鑰 (Transmit Entangled Key)
   */
  public transmitEntangledKey(): void {
    this.state.cornerFlux += 80.0;
    this.playRelayEntangleLock();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoBraid) {
      this.state.cornerFlux += delta * (1.2 + this.state.quadrupoleMass * 0.5);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playQuadrupoleChord(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // 4 個頂角對應 4 重四極子和弦 (C5, E5, G5, B5)
      const freqs = [523.25, 659.25, 783.99, 987.77];
      freqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.035);

        gain.gain.setValueAtTime(0.0, now + idx * 0.035);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.035 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.035);
        osc.stop(now + idx * 0.035 + 0.37);
      });
    } catch {
      // 容錯靜音
    }
  }

  public playBraidingSweep(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440.0, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.18);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // 容錯靜音
    }
  }

  public playRelayEntangleLock(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc.frequency.setValueAtTime(1318.5, now + 0.08); // E6

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
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

export const higherOrderTopoEngine = new HigherOrderTopoSuperconductorEngine();
