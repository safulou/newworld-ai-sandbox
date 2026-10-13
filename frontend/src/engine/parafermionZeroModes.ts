/**
 * 非阿貝爾分數量子霍爾帕拉費米子與拓撲四重量子位元處理器
 * (Parafermion Zero Modes & Topological Tetracubit Processor)
 *
 * 核心物理理論：
 * 1. \mathbb{Z}_m 帕拉費米子零能模 (Parafermion Zero Modes, PZMs)：
 *    在分數量子霍爾效應邊緣態 (\nu = 2/m, 如 \nu = 2/3) 與 s-波超導體微觀近鄰耦合區，
 *    疇壁處湧現超越馬約拉納費米子 (\mathbb{Z}_2) 的 \mathbb{Z}_m (m=4) 帕拉費米子算子：
 *    \alpha_j^m = 1, \quad \alpha_j \alpha_k = \alpha_k \alpha_j e^{i \frac{2\pi}{m} \text{sgn}(k - j)}。
 * 2. 四重拓撲基態簡併與四能級拓撲量元 (Tetracubit / Ququart)：
 *    一對 \mathbb{Z}_4 帕拉費米子局域化形成精確 4 重非局域拓撲簡併基態空間，天然構建高維拓撲量元。
 * 3. 固有非克利福德拓撲量子門 (Topological Non-Clifford Phase Gate)：
 *    帕拉費米子編織酉矩陣 B_j 包含非二次相移，直接編譯非克利福德門 (\pi/12 相移門)，
 *    突破東尼-基塔耶夫定理 (Eastin-Knill Theorem)，無須輔助魔態蒸餾即能實現通用拓撲量子計算。
 * 4. 8\pi-週期分數約瑟夫森效應 (Fractional Josephson Effect)：
 *    由於跨越超導弱連接的準粒子攜帶分數電荷 e^* = e/2，約瑟夫森能量 E(\phi) \propto \cos(\phi / 4)，
 *    展現超乎尋常的 8\pi 週期性無耗散微波超電流。
 */

export type ParafermionRegime =
  | 'z4-parafermion-topological-qudit'      // Z_4 帕拉費米子四態拓撲量元相
  | 'fractional-josephson-8pi-period'      // 8π 週期分數約瑟夫森超流態
  | 'non-clifford-braiding-gate'           // 非克利福德拓撲編織邏輯門相
  | 'quasi-particle-poisoning-quench';     // 準粒子拓撲中毒退相干態

export interface ParafermionState {
  parafermionClockM: number;               // 帕拉費米子代數階數 m (通常為 4)
  fractionalFillingFactor: string;         // 分數填充因子 \nu ("2/3", "1/3", "2/5")
  superconductingGapDeltaMev: number;      // 超導近鄰能隙 \Delta (meV, 0.5 ~ 6.0)
  josephsonPhasePhiRad: number;            // 約瑟夫森相位 \phi (rad, 0.0 ~ 25.13 ≈ 8\pi)
  regime: ParafermionRegime;

  // 動態演算物理指標
  topologicalDegeneracyRank: number;       // 拓撲基態簡併度 (m = 4)
  fractionalSupercurrentMicroAmp: number;  // 分數超電流 I(\phi) (\mu A)
  nonCliffordGateFidelity: number;         // 非克利福德編織門保真度 (0.9000 ~ 0.9999)
  quasiparticlePoisoningRateKhz: number;   // 準粒子中毒速率 \Gamma_p (kHz)
  braidingPhaseShiftDeg: number;           // 編織幾何相移角 (度, 30.0 ~ 90.0°)
  telemetryHistory: Array<{
    timestamp: number;
    supercurrent: number;
    fidelity: number;
    phaseRad: number;
  }>;
}

const STORAGE_KEY = 'newworld_parafermion_zero_modes_state_v1';

class ParafermionZeroModesEngine {
  private state: ParafermionState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): ParafermionState {
    return {
      parafermionClockM: 4, // \mathbb{Z}_4 帕拉費米子
      fractionalFillingFactor: '2/3',
      superconductingGapDeltaMev: 3.2,
      josephsonPhasePhiRad: 3.14, // \pi
      regime: 'z4-parafermion-topological-qudit',
      topologicalDegeneracyRank: 4,
      fractionalSupercurrentMicroAmp: 18.6,
      nonCliffordGateFidelity: 0.9992,
      quasiparticlePoisoningRateKhz: 0.05,
      braidingPhaseShiftDeg: 45.0, // 180 / m = 45度
      telemetryHistory: []
    };
  }

  private loadState(): ParafermionState {
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
      // 略過儲存例外
    }
  }

  public getState(): ParafermionState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // 拓撲簡併度由代數階數 m 決定
    s.topologicalDegeneracyRank = s.parafermionClockM;

    // 8\pi 分數約瑟夫森超電流：I(\phi) = I_0 \sin(\phi / m)
    const baseI0 = s.superconductingGapDeltaMev * 6.5;
    const current = baseI0 * Math.sin(s.josephsonPhasePhiRad / s.parafermionClockM);
    s.fractionalSupercurrentMicroAmp = Number(current.toFixed(2));

    // 編織相移角：\theta = 360 / (2 * m) 階數
    s.braidingPhaseShiftDeg = Number((180 / s.parafermionClockM).toFixed(1));

    // 保真度計算：能隙越寬，保護越強；中毒率越低，保真度越高
    const gapProtection = Math.min(0.9999, 0.9996 + (s.superconductingGapDeltaMev / 6.0) * 0.0005 - (s.quasiparticlePoisoningRateKhz * 0.025));
    s.nonCliffordGateFidelity = Number(Math.max(0.92, gapProtection).toFixed(4));

    // 狀態判定
    if (s.quasiparticlePoisoningRateKhz > 1.5) {
      s.regime = 'quasi-particle-poisoning-quench';
    } else if (s.josephsonPhasePhiRad > 12.0) {
      s.regime = 'fractional-josephson-8pi-period';
    } else if (s.nonCliffordGateFidelity > 0.998) {
      s.regime = 'non-clifford-braiding-gate';
    } else {
      s.regime = 'z4-parafermion-topological-qudit';
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
        supercurrent: this.state.fractionalSupercurrentMicroAmp,
        fidelity: this.state.nonCliffordGateFidelity,
        phaseRad: this.state.josephsonPhasePhiRad
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public advanceJosephsonPhase(phaseStepRad: number = 1.57): void {
    // 週期為 8\pi ≈ 25.1327
    const maxPhase = 8 * Math.PI;
    this.state.josephsonPhasePhiRad = Number(((this.state.josephsonPhasePhiRad + phaseStepRad) % maxPhase).toFixed(2));
    this.recalculatePhysics();
    this.playTone(440, 660, 0.16, 'sine');
  }

  public executeParafermionBraid(): void {
    // 執行一次非阿貝爾編織
    this.state.quasiparticlePoisoningRateKhz = 0.02;
    this.recalculatePhysics();
    this.playTone(660, 990, 0.22, 'triangle');
  }

  public tuneSuperconductingProximity(gapDeltaMev: number): void {
    this.state.superconductingGapDeltaMev = Number(Math.max(0.5, Math.min(6.0, this.state.superconductingGapDeltaMev + gapDeltaMev)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(380, 520, 0.14, 'sine');
  }

  public purifyQuasiparticlePoisoning(): void {
    this.state.quasiparticlePoisoningRateKhz = 0.01;
    this.state.nonCliffordGateFidelity = 0.9998;
    this.recalculatePhysics();
    this.playTone(550, 1100, 0.25, 'sine');
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
      // 忽視靜音
    }
  }
}

export const parafermionEngine = new ParafermionZeroModesEngine();
