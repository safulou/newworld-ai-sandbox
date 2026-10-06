/**
 * quantumAnomalousHall.ts
 * 量子霍爾反常邊緣態超流體晶片引擎 (Quantum Anomalous Hall Superfluid Microchip Engine)
 * 
 * 物理與凝聚態微電子模擬：
 * 1. 量子反常霍爾效應 (QAHE)：在零外部磁場下，透過鐵磁拓撲絕緣體實現無耗散量子化霍爾電導 (\sigma_{xy} = C e^2 / h)。
 * 2. 手性邊緣態激子玻色-愛因斯坦凝聚 (BEC) 超流體通道，徹底消除雜質背向散射與焦耳熱。
 * 3. 4 大晶片拓撲架構（Cr 摻雜 Bi2Te3 薄膜、手性激子超流通道、馬約拉納零能模匯流排、零耗散自旋邏輯閘）。
 * 4. 純代碼 Web Audio 合成超流量子渦旋高頻純音、馬約拉納零模三連音與拓撲計算脈衝。
 */

export type QAHArchitecture = 'ferromagnetic_cr_bi2te3' | 'chiral_edge_superfluid' | 'majorana_zero_mode_bus' | 'dissipationless_spin_logic';

export interface QAHConfig {
  id: QAHArchitecture;
  name: string;
  desc: string;
  chernClass: number;
  speedScale: number;
  baseAudioFreq: number;
  defectImmunity: number; // 0 ~ 100%
}

export const QAH_ARCHITECTURES: Record<QAHArchitecture, QAHConfig> = {
  ferromagnetic_cr_bi2te3: {
    id: 'ferromagnetic_cr_bi2te3',
    name: '鉻摻雜磁性拓撲薄膜 (Cr-(Bi,Sb)₂Te₃ Thin Film)',
    desc: '鐵磁交換能隙打破時間反演對稱，在零外磁場下形成本徵單向自旋保護邊界通道',
    chernClass: 1,
    speedScale: 1.0,
    baseAudioFreq: 587.33, // D5
    defectImmunity: 96.5,
  },
  chiral_edge_superfluid: {
    id: 'chiral_edge_superfluid',
    name: '手性激子玻色超流通道 (Chiral Exciton Superfluid)',
    desc: '電子-電洞庫倫配對激子凝聚於邊界通道，零黏滯阻力傳輸高密度量子相干流',
    chernClass: 2,
    speedScale: 1.45,
    baseAudioFreq: 698.46, // F5
    defectImmunity: 99.2,
  },
  majorana_zero_mode_bus: {
    id: 'majorana_zero_mode_bus',
    name: '馬約拉納零能模匯流排 (Majorana Zero-Mode Bus)',
    desc: '超導-拓撲絕緣體界面束縛半費米子準粒子，提供非阿貝爾拓撲量子計算保護',
    chernClass: 1,
    speedScale: 1.8,
    baseAudioFreq: 880.0, // A5
    defectImmunity: 99.8,
  },
  dissipationless_spin_logic: {
    id: 'dissipationless_spin_logic',
    name: '零耗散自旋電子邏輯陣列 (Spintronic Logic Matrix)',
    desc: '純自旋流驅動奈米磁疇壁翻轉，達到零焦耳熱損耗之極限超大規模積體運算',
    chernClass: 3,
    speedScale: 2.2,
    baseAudioFreq: 1046.5, // C6
    defectImmunity: 98.4,
  },
};

const STORAGE_KEY = 'newworld_quantum_anomalous_hall_state_v1';

export class QuantumAnomalousHallEngine {
  private static instance: QuantumAnomalousHallEngine | null = null;

  public currentArchitecture: QAHArchitecture = 'ferromagnetic_cr_bi2te3';
  public bandgapMilliEV: number = 42.5; // meV (拓撲能隙)
  public superfluidVelocityNmPs: number = 8.6; // nm/ps
  public quantumConductanceQuanta: number = 1; // e^2/h
  public qubitOperationsCount: number = 5120; // 累積拓撲量子運算次數
  public chipTemperatureMilliKelvin: number = 28.5; // mK
  public isComputing: boolean = false;

  // Web Audio Context
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): QuantumAnomalousHallEngine {
    if (!QuantumAnomalousHallEngine.instance) {
      QuantumAnomalousHallEngine.instance = new QuantumAnomalousHallEngine();
    }
    return QuantumAnomalousHallEngine.instance;
  }

  /**
   * 雜質散射免疫度百分比
   */
  public get defectImmunityPercent(): number {
    return QAH_ARCHITECTURES[this.currentArchitecture].defectImmunity;
  }

  /**
   * 執行一次零耗散拓撲量子運算
   */
  public executeTopologicalCompute(): number {
    this.isComputing = true;
    const archCfg = QAH_ARCHITECTURES[this.currentArchitecture];
    const ops = Math.round(150 * archCfg.speedScale * (this.bandgapMilliEV / 30));
    this.qubitOperationsCount += ops;

    this.playMajoranaChime();
    this.saveState();
    this.isComputing = false;
    return ops;
  }

  /**
   * 注入超導聲子阻尼冷卻，提升拓撲能隙與超流速度
   */
  public coolAndStabilize(): void {
    this.chipTemperatureMilliKelvin = Math.max(5.0, this.chipTemperatureMilliKelvin - 4.5);
    this.bandgapMilliEV = Math.min(65.0, this.bandgapMilliEV + 3.2);
    this.superfluidVelocityNmPs = parseFloat((this.superfluidVelocityNmPs + 0.6).toFixed(2));

    this.playChiralEdgeTone();
    this.saveState();
  }

  /**
   * 切換晶片拓撲架構
   */
  public setArchitecture(arch: QAHArchitecture): void {
    this.currentArchitecture = arch;
    this.quantumConductanceQuanta = QAH_ARCHITECTURES[arch].chernClass;
    this.playArchSwitchTone();
    this.saveState();
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    // 依據超流速度自然持續微量累積拓撲運算
    const rate = 12 * (this.superfluidVelocityNmPs / 5);
    this.qubitOperationsCount += Math.round(rate * dt);
  }

  // ================= 音效合成 (純 Web Audio API) =================

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * 播放手性邊緣超流純音 (Chiral Edge Tone)
   */
  public playChiralEdgeTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const f = QAH_ARCHITECTURES[this.currentArchitecture].baseAudioFreq;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.25);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放馬約拉納零模三連音 (Majorana Triplet Chime)
   */
  public playMajoranaChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      [1174.66, 1479.98, 1760.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        gain.gain.setValueAtTime(0.15, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.3);
      });
    } catch {
      // 靜默處理
    }
  }

  /**
   * 架構切換和弦
   */
  public playArchSwitchTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const baseF = QAH_ARCHITECTURES[this.currentArchitecture].baseAudioFreq;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseF * 0.8, t);
      osc.frequency.exponentialRampToValueAtTime(baseF * 1.2, t + 0.2);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.27);
    } catch {
      // 靜默處理
    }
  }

  // ================= 儲存與讀取 =================

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = {
        currentArchitecture: this.currentArchitecture,
        bandgapMilliEV: this.bandgapMilliEV,
        superfluidVelocityNmPs: this.superfluidVelocityNmPs,
        quantumConductanceQuanta: this.quantumConductanceQuanta,
        qubitOperationsCount: this.qubitOperationsCount,
        chipTemperatureMilliKelvin: this.chipTemperatureMilliKelvin,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // 忽略
    }
  }

  public loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.currentArchitecture && QAH_ARCHITECTURES[parsed.currentArchitecture as QAHArchitecture]) {
        this.currentArchitecture = parsed.currentArchitecture as QAHArchitecture;
      }
      if (typeof parsed.bandgapMilliEV === 'number') this.bandgapMilliEV = parsed.bandgapMilliEV;
      if (typeof parsed.superfluidVelocityNmPs === 'number') this.superfluidVelocityNmPs = parsed.superfluidVelocityNmPs;
      if (typeof parsed.quantumConductanceQuanta === 'number') this.quantumConductanceQuanta = parsed.quantumConductanceQuanta;
      if (typeof parsed.qubitOperationsCount === 'number') this.qubitOperationsCount = parsed.qubitOperationsCount;
      if (typeof parsed.chipTemperatureMilliKelvin === 'number') this.chipTemperatureMilliKelvin = parsed.chipTemperatureMilliKelvin;
    } catch {
      // 忽略
    }
  }
}

export const quantumAnomalousHall = QuantumAnomalousHallEngine.getInstance();
