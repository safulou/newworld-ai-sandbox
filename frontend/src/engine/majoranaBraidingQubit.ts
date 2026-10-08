/**
 * 拓撲馬約拉納零能模非阿貝爾量子編織晶片 (Majorana Zero Mode Non-Abelian Braiding Chip)
 * 
 * 理論基礎：
 * 1. 一維 Kitaev 拓撲超導奈米線 (Kitaev 2001, Lutchyn et al. 2010, Oreg et al. 2010)
 *    強 Rashba 自旋軌道耦合半導體奈米線結合 s 波超導近鄰效應與塞曼磁場 B > B_c = √(Δ² + μ²)，
 *    在超導能隙中成對湧現零能量馬約拉納費米子 γ_i = γ_i†，{γ_i, γ_j} = 2δ_ij。
 * 2. 非阿貝爾編織統計 (Non-Abelian Anyonic Statistics, Read & Green 2000, Ivanov 2001):
 *    在 T 型接面 (T-Junction) 中絕熱交換兩馬約拉納零能模：
 *    B_12 = exp(π/4 γ_1 γ_2) = (1 + γ_1 γ_2) / √2，產生全局拓撲量子門。
 * 3. 費米子宇稱量子位元與退相干免疫 (Fermion Parity Conservation & Topological Protection):
 *    拓撲保護能隙 Δ_top 抑制熱準粒子激發，邏輯量子態不受局部局部微擾破壞。
 * 4. 4 大拓撲編織體制：
 *    - topological_kitaev_wire_edge: 一維 Kitaev 奈米線兩端零能束縛態
 *    - t_junction_non_abelian_braid: T 型接面非阿貝爾編織交換操作
 *    - parity_qubit_topological_gate: 費米子宇稱量子位元容錯相位旋轉
 *    - majorana_surface_code_fault_tolerant: 表面晶格二維容錯拓撲編織網
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成馬約拉納零能純音、非阿貝爾編織相位旋轉音、宇稱讀出立體聲嗡鳴
 * - HTML5 Canvas 2D 呈現 T 型超導奈米線結、端點紅藍馬約拉納波函數峰、編織軌跡動態動畫與么正矩陣數值
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type MajoranaRegime = 
  | 'topological_kitaev_wire_edge' 
  | 't_junction_non_abelian_braid' 
  | 'parity_qubit_topological_gate' 
  | 'majorana_surface_code_fault_tolerant';

export interface BraidingOperationLog {
  id: string;
  braidPair: string; // e.g., 'γ1 ⊗ γ2'
  unitaryPhaseDeg: number; // 90° (π/2)
  fermionParity: 'Even (+1)' | 'Odd (-1)';
  topologicalFidelity: number; // 0 ~ 1
  timestamp: number;
}

export interface MajoranaBraidingState {
  regime: MajoranaRegime;
  zeemanFieldTesla: number; // 外加塞曼磁場 B_z (0.2 ~ 3.0 T)
  superconductingGapMev: number; // 近鄰超導能隙 Δ (0.1 ~ 2.0 meV)
  topologicalGapMev: number; // 拓撲防護能隙 Δ_top (meV)
  braidingAngleDeg: number; // 編織旋轉角 (0 ~ 360°)
  groundStateFidelityPercent: number; // 基態保真度 (0 ~ 100%)
  fermionParityReadout: 'Even (+1)' | 'Odd (-1)';
  qubitDecoherenceTimeUs: number; // 拓撲量子同調時間 T_2 (μs)
  autoBraidingCycle: boolean;
  totalBraidsExecuted: number;
  braidHistory: BraidingOperationLog[];
}

const STORAGE_KEY = 'newworld_majorana_braiding_qubit';

class MajoranaBraidingEngine {
  private state: MajoranaBraidingState = {
    regime: 't_junction_non_abelian_braid',
    zeemanFieldTesla: 1.25,
    superconductingGapMev: 0.85,
    topologicalGapMev: 0.42,
    braidingAngleDeg: 90.0,
    groundStateFidelityPercent: 99.4,
    fermionParityReadout: 'Even (+1)',
    qubitDecoherenceTimeUs: 820.0,
    autoBraidingCycle: true,
    totalBraidsExecuted: 52,
    braidHistory: []
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeMajoranaPhysics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): MajoranaBraidingState {
    return { ...this.state, braidHistory: [...this.state.braidHistory] };
  }

  public setRegime(regime: MajoranaRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'topological_kitaev_wire_edge':
        this.state.zeemanFieldTesla = 1.0;
        this.state.superconductingGapMev = 0.8;
        break;
      case 't_junction_non_abelian_braid':
        this.state.zeemanFieldTesla = 1.25;
        this.state.superconductingGapMev = 0.85;
        break;
      case 'parity_qubit_topological_gate':
        this.state.zeemanFieldTesla = 1.6;
        this.state.superconductingGapMev = 1.1;
        break;
      case 'majorana_surface_code_fault_tolerant':
        this.state.zeemanFieldTesla = 2.0;
        this.state.superconductingGapMev = 1.4;
        break;
    }
    this.recomputeMajoranaPhysics();
    this.playBraidingChime();
    this.saveState();
  }

  public setZeemanField(tesla: number): void {
    this.state.zeemanFieldTesla = Math.max(0.2, Math.min(3.0, parseFloat(tesla.toFixed(2))));
    this.recomputeMajoranaPhysics();
    this.saveState();
  }

  public setSuperconductingGap(gapMev: number): void {
    this.state.superconductingGapMev = Math.max(0.1, Math.min(2.0, parseFloat(gapMev.toFixed(2))));
    this.recomputeMajoranaPhysics();
    this.saveState();
  }

  public toggleAutoBraiding(): void {
    this.state.autoBraidingCycle = !this.state.autoBraidingCycle;
    this.saveState();
  }

  public executeBraidStep(): void {
    // 執行一次非阿貝爾編織交換 (π/2 相位)
    this.state.braidingAngleDeg = (this.state.braidingAngleDeg + 90) % 360;
    const parity: 'Even (+1)' | 'Odd (-1)' = (this.state.braidHistory.length % 2 === 0) ? 'Even (+1)' : 'Odd (-1)';
    this.state.fermionParityReadout = parity;

    const op: BraidingOperationLog = {
      id: 'braid-' + Date.now().toString(36),
      braidPair: `γ${(this.state.totalBraidsExecuted % 3) + 1} ⊗ γ${((this.state.totalBraidsExecuted + 1) % 3) + 1}`,
      unitaryPhaseDeg: 90.0,
      fermionParity: parity,
      topologicalFidelity: parseFloat((0.985 + Math.random() * 0.014).toFixed(4)),
      timestamp: Date.now()
    };
    this.state.braidHistory.unshift(op);
    if (this.state.braidHistory.length > 20) {
      this.state.braidHistory.pop();
    }
    this.state.totalBraidsExecuted += 1;
    this.playBraidingChime();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoBraidingCycle) {
      if (Math.random() < 0.25 * deltaSeconds) {
        this.executeBraidStep();
      }
    }
  }

  private recomputeMajoranaPhysics(): void {
    // 拓撲能隙 Δ_top = |V_z - Δ_sc|
    const deltaTop = Math.max(0.05, Math.abs(this.state.zeemanFieldTesla * 0.5 - this.state.superconductingGapMev * 0.4));
    this.state.topologicalGapMev = parseFloat(deltaTop.toFixed(3));

    // 同調時間 T_2 ∝ exp(Δ_top / k_B T)
    const t2 = 300.0 + deltaTop * 1200.0;
    this.state.qubitDecoherenceTimeUs = parseFloat(t2.toFixed(1));

    // 基態保真度
    let fidelity = 98.0 + (deltaTop / 1.5) * 1.8;
    this.state.groundStateFidelityPercent = parseFloat(Math.min(99.9, fidelity).toFixed(2));
  }

  // --- Web Audio 程序化合成 ---

  public playBraidingChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 馬約拉納零能基底純音 (雙重拓撲和弦)
      [440, 660].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22 + idx * 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      });
    } catch { /* ignore */ }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* ignore */ }
  }
}

export const majoranaBraidingEngine = new MajoranaBraidingEngine();
