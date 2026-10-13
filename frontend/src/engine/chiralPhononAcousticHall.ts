/**
 * 拓撲手性聲子與量子反常聲霍爾效應反應堆
 * (Chiral Phonon Quantum Anomalous Acoustic Hall Reactor)
 *
 * 核心物理理論：
 * 1. 晶格離子原子圓周旋轉振動與手性聲子 (Chiral Phonons in 2D Monolayers)：
 *    在石墨烯、六角二硫化鉬或 Kagome 晶格中，打破時間反演或鏡面對稱性時，
 *    原子在其平衡點周圍作圓形左旋或右旋軌道運動，攜帶非零固有手性聲子角動量 l_{\text{ph}} = \pm \hbar。
 * 2. 聲子貝里曲率 (Phonon Berry Curvature \boldsymbol{\Omega}_{\text{ph}}(\mathbf{k}))：
 *    手性原子振動在動量空間賦予聲子能帶非平庸拓撲幾何相位，產生聲子貝里曲率。
 * 3. 量子反常聲霍爾偏轉效應 (Acoustic Anomalous Hall Deflection)：
 *    當在晶格中傳播縱向聲波波包或熱流時，聲子感受非零貝里曲率產生的反常橫向速度：
 *    \mathbf{v}_{\perp} = -\frac{1}{\hbar} \nabla \mathbf{k} \times \boldsymbol{\Omega}_{\text{ph}}。
 *    在完全無須外加磁場的情況下，聲波與熱流自發產生橫向偏轉角 \theta_H。
 * 4. 零磁場反常聲熱霍爾電導率 (Thermal Acoustic Hall Conductivity \kappa_{xy}^{\text{ph}})：
 *    由聲子拓撲陳數 C_{\text{ph}} 嚴格量子化與拓撲保護：
 *    \kappa_{xy}^{\text{ph}} = -\frac{k_B^2 T}{6\hbar} C_{\text{ph}}。
 * 5. 磁子-聲子拓撲雜化極化激元 (Magnon-Phonon Resonant Hybridization)：
 *    非共線反鐵磁自旋波（磁子）與手性聲子強相干耦合，打破聲學互易性，構造單向拓撲聲學二極體與熱整流器。
 */

export type ChiralPhononRegime =
  | 'chiral-phonon-circular-vibration'  // 手性原子圓周旋轉聲子態
  | 'acoustic-anomalous-hall-deflection'// 聲子貝里曲率反常聲霍爾偏轉相
  | 'topological-chiral-heat-rectifier' // 拓撲手性熱整流聲二極體相
  | 'magnon-phonon-hybrid-polariton';   // 磁子-聲子拓撲強雜化態

export interface ChiralPhononState {
  phononChiralityIndex: number;         // 聲子手性指標 l_ph / \hbar (-1.0 ~ +1.0)
  phononBerryCurvatureOmega: number;    // 聲子貝里曲率 \Omega_ph (10^-20 m^2, 0.1 ~ 8.0)
  acousticFrequencyTHz: number;         // 聲頻共振 f (THz, 0.5 ~ 15.0)
  latticeTemperatureKelvin: number;     // 晶格溫度 T (K, 1.5 ~ 350.0)
  magnonCouplingStrength: number;       // 磁子-聲子雜化強度 g_mp (0.0 ~ 5.0)
  regime: ChiralPhononRegime;

  // 動態演算物理指標
  thermalAcousticHallKappaXy: number;   // 聲熱霍爾電導率 \kappa_xy^ph (10^-3 W/(K*m))
  transverseAcousticDeflectionDeg: number;// 橫向反常聲偏轉角 \theta_H (度, -45.0 ~ +45.0)
  acousticDiodeRectificationRatio: number;// 聲二極體單向整流比 (1.0 ~ 85.0)
  phononAngularMomentumHbar: number;    // 聲子角動量平均值 \langle l_z \rangle (\hbar)
  topologicalPhononChernNumber: number; // 聲子拓撲陳數 C_ph (-2, -1, 0, 1, 2)
  telemetryHistory: Array<{
    timestamp: number;
    hallDeflection: number;
    kappaXy: number;
    rectificationRatio: number;
  }>;
}

const STORAGE_KEY = 'newworld_chiral_phonon_acoustic_hall_state_v1';

class ChiralPhononEngine {
  private state: ChiralPhononState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): ChiralPhononState {
    return {
      phononChiralityIndex: 1.0, // 初始純右旋手性
      phononBerryCurvatureOmega: 3.4,
      acousticFrequencyTHz: 6.2,
      latticeTemperatureKelvin: 45.0,
      magnonCouplingStrength: 1.8,
      regime: 'acoustic-anomalous-hall-deflection',
      thermalAcousticHallKappaXy: 8.65,
      transverseAcousticDeflectionDeg: 18.4,
      acousticDiodeRectificationRatio: 12.8,
      phononAngularMomentumHbar: 0.95,
      topologicalPhononChernNumber: 1,
      telemetryHistory: []
    };
  }

  private loadState(): ChiralPhononState {
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

  public getState(): ChiralPhononState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // 手性角動量
    s.phononAngularMomentumHbar = Number((s.phononChiralityIndex * 0.95).toFixed(2));

    // 拓撲陳數
    if (Math.abs(s.phononChiralityIndex) > 0.6) {
      s.topologicalPhononChernNumber = s.phononChiralityIndex > 0 ? 1 : -1;
    } else {
      s.topologicalPhononChernNumber = 0;
    }

    // 反常聲偏轉角 \theta_H \propto l_ph * \Omega_ph
    const deflection = s.phononChiralityIndex * (s.phononBerryCurvatureOmega * 4.8);
    s.transverseAcousticDeflectionDeg = Number(Math.max(-45.0, Math.min(45.0, deflection)).toFixed(2));

    // 聲熱霍爾電導率 \kappa_xy \propto C_ph * T * (l_ph)
    const baseKappa = (s.topologicalPhononChernNumber * (s.latticeTemperatureKelvin / 10.0) * (s.phononBerryCurvatureOmega / 3.0));
    s.thermalAcousticHallKappaXy = Number(baseKappa.toFixed(2));

    // 聲學單向整流比 (取決於磁子-聲子耦合 break reciprocity)
    if (s.magnonCouplingStrength > 0.5) {
      s.acousticDiodeRectificationRatio = Number((1.0 + (s.magnonCouplingStrength * 12.0 * Math.abs(s.phononChiralityIndex))).toFixed(1));
    } else {
      s.acousticDiodeRectificationRatio = 1.0;
    }

    // 狀態判定
    if (s.magnonCouplingStrength > 2.8) {
      s.regime = 'magnon-phonon-hybrid-polariton';
    } else if (s.acousticDiodeRectificationRatio > 25.0) {
      s.regime = 'topological-chiral-heat-rectifier';
    } else if (Math.abs(s.transverseAcousticDeflectionDeg) > 10.0) {
      s.regime = 'acoustic-anomalous-hall-deflection';
    } else {
      s.regime = 'chiral-phonon-circular-vibration';
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
        hallDeflection: this.state.transverseAcousticDeflectionDeg,
        kappaXy: this.state.thermalAcousticHallKappaXy,
        rectificationRatio: this.state.acousticDiodeRectificationRatio
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public switchPhononHandedness(targetHandedness?: number): void {
    if (typeof targetHandedness === 'number') {
      this.state.phononChiralityIndex = Math.max(-1.0, Math.min(1.0, targetHandedness));
    } else {
      this.state.phononChiralityIndex = this.state.phononChiralityIndex >= 0 ? -1.0 : 1.0;
    }
    this.recalculatePhysics();
    this.playTone(this.state.phononChiralityIndex > 0 ? 520 : 380, this.state.phononChiralityIndex > 0 ? 780 : 260, 0.18, 'sine');
  }

  public injectAcousticHeatFlux(berryBoost: number = 0.8): void {
    this.state.phononBerryCurvatureOmega = Number(Math.min(8.0, this.state.phononBerryCurvatureOmega + berryBoost).toFixed(2));
    this.recalculatePhysics();
    this.playTone(600, 900, 0.16, 'triangle');
  }

  public tuneAcousticResonance(freqTHz: number): void {
    this.state.acousticFrequencyTHz = Number(Math.max(0.5, Math.min(15.0, freqTHz)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(440, 660, 0.14, 'sine');
  }

  public coupleMagnonDrive(): void {
    this.state.magnonCouplingStrength = Number(Math.min(5.0, this.state.magnonCouplingStrength + 0.9).toFixed(2));
    this.recalculatePhysics();
    this.playTone(300, 800, 0.22, 'sawtooth');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(320, 220, 0.2, 'sine');
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

export const chiralPhononEngine = new ChiralPhononEngine();
