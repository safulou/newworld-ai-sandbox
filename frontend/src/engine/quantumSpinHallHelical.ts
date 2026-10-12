/**
 * 量子自旋霍爾效應螺旋邊緣態與時間反演反散射保護晶片
 * (Quantum Spin Hall Effect & Helical Edge State Protection Chip)
 *
 * 核心物理理論：
 * 1. 2D 拓撲絕緣體與 \mathbb{Z}_2 拓撲不變量：
 *    在具備強自旋-軌道耦合之 Kane-Mele 模型或 HgTe/CdTe 量子阱 (d > d_c \approx 6.3 nm) 中，
 *    能帶發生拓撲反轉 (Band Inversion)，塊體具備拓撲能隙，且拓撲不變量 \mathbb{Z}_2 = 1。
 * 2. 螺旋邊緣態與自旋-動量鎖定 (Helical Edge States & Spin-Momentum Locking)：
 *    一維邊界具備一對無能隙狄拉克態：自旋向上電子向右運動 (k_x > 0)，
 *    自旋向下電子向左運動 (k_x < 0)。自旋方向與傳播動量完全鎖定。
 * 3. 時間反演對稱性與彈性背向散射禁戒 (Zero Backscattering Protection)：
 *    時間反演運算元滿足 \mathcal{T}^2 = -1 (克拉默斯雙重態 Kramers Pairs)。
 *    在不具磁性之普通純標量雜質散射下，彈性背向散射振幅因時間反演對稱路徑之相消干涉而嚴格為零，
 *    實現室溫微米尺度量子化彈道導電率 G = 2 \frac{e^2}{h}。
 * 4. 磁性交換場對稱破缺：
 *    若施加外加磁場或沉積磁性原子 (破缺時間反演對稱性 \mathcal{T})，
 *    狄拉克錐交叉點將打開質量隙，使螺旋通道退化並引發反常安德森局域化。
 */

export type QuantumSpinHallRegime =
  | 'ballistic-helical-transport'   // 時間反演保護無散射彈道傳輸相 (G = 2 e^2/h)
  | 'spin-momentum-locked-filter'   // 自旋動量鎖定純自旋流過濾態 (100% 偏振淨自旋流)
  | 'magnetic-gap-opening'          // 磁性交換場時間反演破缺相 (狄拉克能隙打開與阻抗升高)
  | 'kramers-doublet-resonance';    // 克拉默斯雙重態非磁性共振穿隧態 (量子通道零損耗)

export interface QuantumSpinHallState {
  quantumWellThicknessNm: number;   // 量子阱厚度 d (nm, 4.0 ~ 9.0, >6.3 為拓撲反轉相)
  fermiEnergyMev: number;           // 費米能級 E_F (meV, -40.0 ~ 40.0, 位於能隙內為拓撲導電)
  magneticExchangeFieldTesla: number;// 磁性交換場 B_mag (T, 0.0 ~ 10.0, 破缺時間反演)
  impurityDensityIndex: number;     // 雜質散射中心密度係數 (0.0 ~ 1.0)
  bulkBandgapMev: number;           // 塊體拓撲能隙 (meV, 10.0 ~ 100.0)
  regime: QuantumSpinHallRegime;

  // 動態演算物理指標
  z2Invariant: number;              // \mathbb{Z}_2 拓撲指標 (0 為平庸, 1 為拓撲絕緣體)
  conductanceE2H: number;           // 螺旋邊緣態電導率 (e^2/h 單位, 理想為 2.0)
  spinPolarizationRatio: number;    // 邊界自旋動量鎖定極化率 (0.0 ~ 1.0)
  backscatteringSuppressionPercent: number; // 彈性背向散射抑制率 (% 99.9%+)
  meanFreePathMicrons: number;      // 彈道平均自由程 (μm)
  dissipationHeatNanoWatt: number;  // 邊界無耗散焦耳熱損耗 (nW, 接近 0)
  telemetryHistory: Array<{
    timestamp: number;
    conductance: number;
    suppression: number;
    meanFreePath: number;
  }>;
}

const STORAGE_KEY = 'newworld_quantum_spin_hall_state_v1';

class QuantumSpinHallEngine {
  private state: QuantumSpinHallState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): QuantumSpinHallState {
    return {
      quantumWellThicknessNm: 7.2, // > 6.3 nm 反轉厚度
      fermiEnergyMev: 2.5,         // 位於能隙中央
      magneticExchangeFieldTesla: 0.0, // 零磁場，保持 T 對稱
      impurityDensityIndex: 0.25,
      bulkBandgapMev: 35.0,
      regime: 'ballistic-helical-transport',
      z2Invariant: 1,
      conductanceE2H: 2.0,
      spinPolarizationRatio: 0.98,
      backscatteringSuppressionPercent: 99.8,
      meanFreePathMicrons: 14.5,
      dissipationHeatNanoWatt: 0.02,
      telemetryHistory: []
    };
  }

  private loadState(): QuantumSpinHallState {
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
      // 降級取預設
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

  public getState(): QuantumSpinHallState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<QuantumSpinHallState, 'quantumWellThicknessNm' | 'fermiEnergyMev' | 'magneticExchangeFieldTesla' | 'impurityDensityIndex' | 'bulkBandgapMev' | 'regime'>>): void {
    if (params.quantumWellThicknessNm !== undefined) {
      this.state.quantumWellThicknessNm = Math.max(4.0, Math.min(9.0, Number(params.quantumWellThicknessNm)));
    }
    if (params.fermiEnergyMev !== undefined) {
      this.state.fermiEnergyMev = Math.max(-40.0, Math.min(40.0, Number(params.fermiEnergyMev)));
    }
    if (params.magneticExchangeFieldTesla !== undefined) {
      this.state.magneticExchangeFieldTesla = Math.max(0.0, Math.min(10.0, Number(params.magneticExchangeFieldTesla)));
    }
    if (params.impurityDensityIndex !== undefined) {
      this.state.impurityDensityIndex = Math.max(0.0, Math.min(1.0, Number(params.impurityDensityIndex)));
    }
    if (params.bulkBandgapMev !== undefined) {
      this.state.bulkBandgapMev = Math.max(10.0, Math.min(100.0, Number(params.bulkBandgapMev)));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }

    this.recalculatePhysics();
    this.playTone();
    this.saveState();
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public toggleMagneticField(): void {
    // 快速切換磁場破缺時間反演
    if (this.state.magneticExchangeFieldTesla === 0) {
      this.state.magneticExchangeFieldTesla = 4.5;
      this.state.regime = 'magnetic-gap-opening';
    } else {
      this.state.magneticExchangeFieldTesla = 0.0;
      this.state.regime = 'ballistic-helical-transport';
    }
    this.recalculatePhysics();
    this.playTone(523.25, 'sawtooth'); // C5
    this.saveState();
  }

  public injectPureSpinPacket(): void {
    // 注入純自旋流封包並增強偏振度
    this.state.spinPolarizationRatio = 1.0;
    this.state.meanFreePathMicrons = Math.min(50.0, this.state.meanFreePathMicrons + 2.0);
    this.playTone(783.99, 'sine'); // G5
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { quantumWellThicknessNm, fermiEnergyMev, magneticExchangeFieldTesla, impurityDensityIndex, bulkBandgapMev, regime } = this.state;

    // 1. \mathbb{Z}_2 拓撲不變量判準：厚度 d > 6.3 nm 為帶反轉拓撲相 (\mathbb{Z}_2 = 1)
    const isTopological = quantumWellThicknessNm > 6.3;
    this.state.z2Invariant = isTopological ? 1 : 0;

    // 2. 費米能級是否位於能隙內
    const halfGap = bulkBandgapMev / 2.0;
    const insideGap = Math.abs(fermiEnergyMev) <= halfGap;

    // 3. 磁性交換場時間反演破缺引發之狄拉克隙與背向散射
    const timeReversalBroken = magneticExchangeFieldTesla > 0.05;

    if (isTopological && insideGap && !timeReversalBroken) {
      // 理想時間反演保護螺旋傳輸
      const filterBoost = regime === 'spin-momentum-locked-filter' ? 0.999 : 0.98;
      this.state.conductanceE2H = Number((2.0 * filterBoost).toFixed(3));
      this.state.spinPolarizationRatio = filterBoost;
      this.state.backscatteringSuppressionPercent = Number((99.9 - impurityDensityIndex * 0.2).toFixed(1));
      this.state.meanFreePathMicrons = Number((15.0 / (0.1 + impurityDensityIndex * 0.2)).toFixed(1));
      this.state.dissipationHeatNanoWatt = 0.01;
    } else if (isTopological && insideGap && timeReversalBroken) {
      // 磁性隙打開，散射加劇
      const suppression = Math.max(5.0, 99.0 - magneticExchangeFieldTesla * 12.0 - impurityDensityIndex * 35.0);
      this.state.backscatteringSuppressionPercent = Number(suppression.toFixed(1));
      this.state.conductanceE2H = Number(Math.max(0.1, 2.0 * (suppression / 100.0)).toFixed(3));
      this.state.spinPolarizationRatio = Number(Math.max(0.2, 0.98 - magneticExchangeFieldTesla * 0.08).toFixed(2));
      this.state.meanFreePathMicrons = Number(Math.max(0.2, 12.0 / (1.0 + magneticExchangeFieldTesla * 1.5)).toFixed(1));
      this.state.dissipationHeatNanoWatt = Number((magneticExchangeFieldTesla * 4.2).toFixed(2));
    } else {
      // 塊體導電或平庸絕緣體
      this.state.conductanceE2H = isTopological ? 0.5 : 0.05;
      this.state.spinPolarizationRatio = 0.1;
      this.state.backscatteringSuppressionPercent = 0.0;
      this.state.meanFreePathMicrons = 0.8;
      this.state.dissipationHeatNanoWatt = 25.0;
    }
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.cos(now * 0.003) * 0.01;
    this.state.meanFreePathMicrons = Math.max(0.1, Number((this.state.meanFreePathMicrons + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        conductance: this.state.conductanceE2H,
        suppression: this.state.backscatteringSuppressionPercent,
        meanFreePath: this.state.meanFreePathMicrons
      });
      if (this.state.telemetryHistory.length > 25) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private initAudio(): void {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq = 493.88, type: OscillatorType = 'sine'): void { // B4
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.33);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const quantumSpinHallEngine = new QuantumSpinHallEngine();
