/**
 * 時間準晶與多頻無理數弗洛凱高階拓撲泵浦引擎
 * (Time Quasicrystal & Incommensurate Multi-Frequency Floquet Topological Pump Engine)
 *
 * 物理原理：
 * 1. 當強關聯量子多體系統（如金剛石氮-空位中心 NV 自旋簇或里德堡原子陣列）受到兩個互為無理數比之頻率
 *    (\omega_1, \omega_2，例如黃金比例 \omega_2 / \omega_1 = \varphi = (1+\sqrt{5})/2 \approx 1.618034) 共同驅動時，
 *    根據 Ho-Shirley-Martin-Refael 多頻弗洛凱理論，一維非週期時間演化可精確映射至高維合成頻率晶格
 *    (Synthetic Frequency Lattice, n = (n_1, n_2) \in Z^2)。
 * 2. 由於無理數頻率滿足丟番圖條件 (Diophantine Condition) |p \omega_1 + q \omega_2| \ge \gamma / (|p|+|q|)^\tau，
 *    多體預熱化壽命呈指數級延長 \tau_{prethermal} \propto \exp(c (\omega_1 / J_{int})^{1/3})，使系統自發破缺準週期時間平移對稱，
 *    湧現出具有雙重分數次諧波響應 (\omega = (p/2)\omega_1 + (q/2)\omega_2) 之「離散時間準晶」(Discrete Time Quasicrystal, DTQC)。
 * 3. 在合成頻率維度中，當合成貝里曲率積分對應非零拓撲陳數 C_{syn} \in Z 時，兩個驅動光場之間發生拓撲量子化能量泵浦：
 *    P_{1\to 2} = (C_{syn} / 2\pi) \hbar \omega_1 \omega_2。
 */

export type TimeQuasicrystalRegime =
  | 'single-frequency-subharmonic-dtc'
  | 'golden-ratio-fibonacci-time-quasicrystal'
  | 'quantized-synthetic-frequency-chern-pump'
  | 'ergodic-floquet-thermalization-breakdown';

export interface SyntheticFrequencyLatticeNode {
  id: number;
  x: number;
  y: number;
  harmonicIndexN1: number;
  harmonicIndexN2: number;
  quasienergySplittingKhz: number;
  subharmonicFourierPeak: number;
}

export interface TimeQuasicrystalFloquetState {
  frequencyRatioGoldenDetuning: number;   // 雙驅動頻率比 \omega_2 / \omega_1 (接近黃金比例 \varphi = 1.618, 1.100 ~ 2.200)
  manyBodyInteractionStrengthJ: number;   // 多體自旋伊辛相互作用強度 J_{int} / \omega_1 (0.05 ~ 1.20)
  syntheticFrequencyChernNumber: number;  // 合成頻率晶格拓撲陳數 C_{syn} (0, 1, 2)
  quantizedEnergyPumpRateHw2: number;     // 雙驅動場間拓撲能量泵浦功率 P_{1\to 2} / (\hbar \omega_1^2 / 2\pi)
  subharmonicQuasiOrderParam: number;     // 時間準晶分數次諧波序參量 Z_{DTQC} (0.000 ~ 1.000)
  prethermalLifetimeLogCycles: number;    // 丟番圖保護預熱化壽命對數週期數 log10(N_{cycles})
  activeRegime: TimeQuasicrystalRegime;
  pulsePhase: number;
  frequencyNodes: SyntheticFrequencyLatticeNode[];
}

const STORAGE_KEY = 'newworld_time_quasicrystal_floquet_state_v1';
const GOLDEN_RATIO = 1.61803398875;

export class TimeQuasicrystalFloquetPumpEngine {
  private state: TimeQuasicrystalFloquetState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): TimeQuasicrystalFloquetState {
    const defaults: TimeQuasicrystalFloquetState = {
      frequencyRatioGoldenDetuning: 1.618,
      manyBodyInteractionStrengthJ: 0.36,
      syntheticFrequencyChernNumber: 1,
      quantizedEnergyPumpRateHw2: 1.618,
      subharmonicQuasiOrderParam: 0.928,
      prethermalLifetimeLogCycles: 7.42,
      activeRegime: 'golden-ratio-fibonacci-time-quasicrystal',
      pulsePhase: 0,
      frequencyNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Time Quasicrystal Floquet state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Time Quasicrystal Floquet state:', e);
      }
    }
  }

  public getState(): Readonly<TimeQuasicrystalFloquetState> {
    return this.state;
  }

  public setFrequencyRatio(ratio: number): void {
    this.state.frequencyRatioGoldenDetuning = Math.max(1.100, Math.min(2.200, parseFloat(ratio.toFixed(3))));
    this.recomputePhysics();
    this.saveState();
  }

  public setManyBodyInteraction(jRatio: number): void {
    this.state.manyBodyInteractionStrengthJ = Math.max(0.05, Math.min(1.20, parseFloat(jRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: TimeQuasicrystalRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'single-frequency-subharmonic-dtc':
        this.state.frequencyRatioGoldenDetuning = 1.000;
        this.state.manyBodyInteractionStrengthJ = 0.28;
        this.state.syntheticFrequencyChernNumber = 0;
        break;
      case 'golden-ratio-fibonacci-time-quasicrystal':
        this.state.frequencyRatioGoldenDetuning = 1.618;
        this.state.manyBodyInteractionStrengthJ = 0.36;
        this.state.syntheticFrequencyChernNumber = 1;
        break;
      case 'quantized-synthetic-frequency-chern-pump':
        this.state.frequencyRatioGoldenDetuning = 1.618;
        this.state.manyBodyInteractionStrengthJ = 0.45;
        this.state.syntheticFrequencyChernNumber = 2;
        break;
      case 'ergodic-floquet-thermalization-breakdown':
        this.state.frequencyRatioGoldenDetuning = 1.500; // 有理數共振 3:2 加速熱化
        this.state.manyBodyInteractionStrengthJ = 1.05;
        this.state.syntheticFrequencyChernNumber = 0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const ratio = this.state.frequencyRatioGoldenDetuning;
    const jInt = this.state.manyBodyInteractionStrengthJ;

    // 接近黃金比例 \varphi = 1.618 時具有最強丟番圖無理數保護；若接近有理數 1.500 或 J_{int} 過大則發生弗洛凱熱化崩潰
    const goldenProximity = Math.exp(-Math.pow(ratio - GOLDEN_RATIO, 2) / 0.12);
    const rationalDip = 1.0 - 0.55 * Math.exp(-Math.pow(ratio - 1.5, 2) / 0.008);
    const prethermalWindow = Math.exp(-Math.pow(jInt - 0.38, 2) / 0.28);

    // 合成頻率拓撲陳數 C_{syn}
    if (this.state.activeRegime === 'quantized-synthetic-frequency-chern-pump') {
      this.state.syntheticFrequencyChernNumber = 2;
    } else if (jInt < 0.78 && rationalDip > 0.65) {
      this.state.syntheticFrequencyChernNumber = 1;
    } else {
      this.state.syntheticFrequencyChernNumber = 0;
    }

    // 時間準晶次諧波序參量 Z_{DTQC}
    const orderParam = Math.min(0.988, (0.35 + 0.63 * goldenProximity) * rationalDip * prethermalWindow);
    this.state.subharmonicQuasiOrderParam = parseFloat(Math.max(0.04, orderParam).toFixed(3));

    // 拓撲能量泵浦功率 P_{1\to 2} = C_{syn} * (\omega_2 / \omega_1) * Z_{DTQC}
    const pumpRate = this.state.syntheticFrequencyChernNumber * ratio * (0.65 + 0.35 * this.state.subharmonicQuasiOrderParam);
    this.state.quantizedEnergyPumpRateHw2 = parseFloat(pumpRate.toFixed(3));

    // 丟番圖保護預熱化壽命 log10(N_{cycles})
    const logCycles = 2.1 + 5.8 * Math.pow(1.0 / Math.max(0.12, jInt), 0.38) * rationalDip;
    this.state.prethermalLifetimeLogCycles = parseFloat(Math.min(9.5, logCycles).toFixed(2));

    // 生成 16 個 2D 合成頻率布洛赫晶格 (n_1, n_2) \in [-2, 1]^2 準能量節點
    const nodes: SyntheticFrequencyLatticeNode[] = [];
    let id = 0;
    for (let n1 = -2; n1 <= 1; n1++) {
      for (let n2 = -2; n2 <= 1; n2++) {
        // 拓撲手性邊界流相移
        const syntheticPhase = this.state.pulsePhase * 0.35 + (n1 + ratio * n2) * 0.6;
        const dx = 8.5 * Math.cos(syntheticPhase);
        const dy = 8.5 * Math.sin(syntheticPhase * ratio);

        const x = 165 + (n1 + 0.5) * 56 + dx;
        const y = 160 + (n2 + 0.5) * 54 + dy;
        const quasiFreq = Math.abs((n1 + 0.5) * 100.0 + (n2 + 0.5) * 100.0 * ratio);

        nodes.push({
          id: id++,
          x: parseFloat(x.toFixed(1)),
          y: parseFloat(y.toFixed(1)),
          harmonicIndexN1: n1,
          harmonicIndexN2: n2,
          quasienergySplittingKhz: parseFloat(quasiFreq.toFixed(1)),
          subharmonicFourierPeak: parseFloat((this.state.subharmonicQuasiOrderParam * Math.exp(-0.12 * (Math.abs(n1) + Math.abs(n2)))).toFixed(3))
        });
      }
    }
    this.state.frequencyNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.75 + this.state.subharmonicQuasiOrderParam * 0.85;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerTimeQuasicrystalSound(): void {
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
      const oscOmega1 = this.audioCtx.createOscillator();
      const oscOmega2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscOmega1.type = 'sine';
      oscOmega2.type = 'triangle';

      // 雙頻次諧波 (\omega_1 / 2) 與 (\omega_2 / 2) 黃金比例準週期和弦
      const f1Half = 280;
      const f2Half = f1Half * this.state.frequencyRatioGoldenDetuning;

      oscOmega1.frequency.setValueAtTime(f1Half, t);
      oscOmega2.frequency.setValueAtTime(f2Half, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscOmega1.connect(gain);
      oscOmega2.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscOmega1.start(t);
      oscOmega2.start(t);
      oscOmega1.stop(t + 0.58);
      oscOmega2.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in TimeQuasicrystalFloquetPumpEngine:', e);
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

export const timeQuasicrystalFloquetPumpEngine = new TimeQuasicrystalFloquetPumpEngine();
