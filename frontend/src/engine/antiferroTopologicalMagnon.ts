/**
 * 反鐵磁拓撲磁振子狄拉克半金屬波導 (Antiferromagnetic Topological Magnon Waveguide)
 *
 * 核心物理理論：
 * 1. 反鐵磁體高頻太赫茲動力學 (THz Antiferromagnetic Dynamics)：
 *    反鐵磁雙子晶格 (A/B) 自旋反平行排列，淨磁矩抵消 \mathbf{M} \approx 0，奈爾向量 \mathbf{L} = \mathbf{M}_A - \mathbf{M}_B；
 *    反鐵磁共振頻率由交換場與各向異性場幾何平均主導：
 *    \omega_{AFM} = \gamma \sqrt{2 H_E H_A} \sim 0.5 \text{--} 5.0\text{ THz}，傳輸速度高於鐵磁體千倍。
 * 2. 磁振子狄拉克點與拓撲能隙 (Topological Magnon Dirac Semimetal)：
 *    蜂窩晶格中自旋波具有狄拉克錐色散；導入賈洛辛斯基-守谷相互作用 (DMI) \mathbf{D}_{ij} 破缺空間反演對稱性，
 *    在狄拉克節點打開拓撲能隙，賦予磁振子帶非零陳數 (Chern C = \pm 1)。
 * 3. 磁振子熱霍爾效應 (Magnon Thermal Hall Effect \kappa_{xy})：
 *    玻色子幾何貝里曲率 \Omega_n(\mathbf{k}) 偏折熱中性磁振子自旋流，產生橫向溫度梯度熱流：
 *    \kappa_{xy} = - \frac{k_B^2 T}{(2\pi)^2 \hbar} \sum_n \int_{BZ} c_2(\rho_n) \Omega_n(\mathbf{k}) d^2k，
 *    實現零焦耳熱純自旋量子資訊超流傳輸。
 */

export type AntiferroMagnonRegime =
  | 'terahertz-waveguide'     // 太赫茲狄拉克磁振子超快波導相
  | 'neel-spin-flop'          // 奈爾向量自旋翻轉拓撲相變相
  | 'chiral-thermal-hall'     // 反鐵磁非共面手性磁振子熱霍爾相
  | 'topological-edge-soliton';// 拓撲邊界態磁振子自旋孤子相

export interface AntiferroMagnonState {
  neelAngleDeg: number;         // 奈爾向量取向角 \theta_L (0 ~ 180 度)
  appliedFieldTesla: number;    // 外加偏置磁場 B_z (0 ~ 10.0 T)
  dmiCouplingRatio: number;     // DMI 耦合強度比 D / J (0.0 ~ 0.5)
  temperatureKelvin: number;    // 晶格溫度 T (1.0 ~ 300.0 K)
  regime: AntiferroMagnonRegime;
  // 動態演算物理指標
  resonanceFreqThz: number;     // 反鐵磁共振頻率 f_AFM (THz)
  topologicalGapMev: number;    // 磁振子拓撲能隙 \Delta_M (meV)
  chernNumber: number;          // 磁振子能帶陳數 C
  thermalHallConductivity: number; // 磁振子熱霍爾導率 \kappa_xy (\mu W / K·m)
  spinWaveVelocityKmS: number;  // 磁振子自旋波群速度 v_g (km/s)
  berryCurvaturePeak: number;   // 貝里曲率峰值 \Omega_max (Å^2)
  telemetryHistory: Array<{
    timestamp: number;
    freqThz: number;
    gapMev: number;
    thermalHall: number;
  }>;
}

const STORAGE_KEY = 'newworld_antiferro_magnon_state_v1';
const SPIN_FLOP_FIELD_TESLA = 4.8; // 自旋翻轉臨界場

class AntiferroTopologicalMagnonEngine {
  private state: AntiferroMagnonState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): AntiferroMagnonState {
    return {
      neelAngleDeg: 12.0,
      appliedFieldTesla: 1.5,
      dmiCouplingRatio: 0.18,
      temperatureKelvin: 45.0,
      regime: 'terahertz-waveguide',
      resonanceFreqThz: 1.85,
      topologicalGapMev: 2.34,
      chernNumber: 1,
      thermalHallConductivity: 14.2,
      spinWaveVelocityKmS: 18.5,
      berryCurvaturePeak: 48.6,
      telemetryHistory: []
    };
  }

  private loadState(): AntiferroMagnonState {
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

  public getState(): AntiferroMagnonState {
    return this.state;
  }

  public setNeelAngle(deg: number): void {
    this.state.neelAngleDeg = Math.max(0, Math.min(180, deg));
    this.recalculatePhysics();
  }

  public setAppliedField(tesla: number): void {
    this.state.appliedFieldTesla = Math.max(0, Math.min(10.0, tesla));
    this.recalculatePhysics();
    if (Math.abs(tesla - SPIN_FLOP_FIELD_TESLA) < 0.25) {
      this.playSpinFlopClick();
    }
  }

  public setDmiRatio(ratio: number): void {
    this.state.dmiCouplingRatio = Math.max(0, Math.min(0.5, ratio));
    this.recalculatePhysics();
  }

  public setTemperature(kelvin: number): void {
    this.state.temperatureKelvin = Math.max(1.0, Math.min(300.0, kelvin));
    this.recalculatePhysics();
  }

  public setRegime(regime: AntiferroMagnonRegime): void {
    this.state.regime = regime;
    this.recalculatePhysics();
    this.playRegimeChord(regime);
  }

  public injectTHzMagnonPulse(): void {
    // 注入超快太赫茲激發脈衝
    this.state.spinWaveVelocityKmS = Math.min(35.0, this.state.spinWaveVelocityKmS * 1.25);
    this.playTHzPulseSound();
  }

  public update(delta: number): void {
    // 奈爾向量微小歲差抖動
    this.state.neelAngleDeg = (this.state.neelAngleDeg + delta * 2.0) % 180;
    this.recalculatePhysics();

    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        freqThz: this.state.resonanceFreqThz,
        gapMev: this.state.topologicalGapMev,
        thermalHall: this.state.thermalHallConductivity
      });
      if (this.state.telemetryHistory.length > 50) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recalculatePhysics(): void {
    const B = this.state.appliedFieldTesla;
    const D = this.state.dmiCouplingRatio;
    const T = this.state.temperatureKelvin;

    // 1. 反鐵磁共振頻率 f_AFM (THz)
    // 基礎交換頻率約 1.5 THz，外加磁場造成塞曼劈裂分支
    const isFlop = B >= SPIN_FLOP_FIELD_TESLA;
    const baseFreq = isFlop ? 0.85 + 0.15 * B : 1.45 + 0.2 * Math.sqrt(Math.max(0.1, 15 - B * B));
    this.state.resonanceFreqThz = Math.max(0.4, baseFreq);

    // 2. 磁振子拓撲能隙 \Delta_M \propto 3\sqrt{3} D
    this.state.topologicalGapMev = Math.max(0.05, 12.0 * D * (1 - Math.sin((this.state.neelAngleDeg * Math.PI) / 180) * 0.25));

    // 3. 陳數判定 (D > 0 且未完全自旋翻轉時拓撲非平凡)
    this.state.chernNumber = (D > 0.05 && !isFlop) ? 1 : (D > 0.05 && isFlop ? 2 : 0);

    // 4. 貝里曲率峰值 \Omega_max
    this.state.berryCurvaturePeak = this.state.chernNumber !== 0 ? (35.0 + 120.0 * D) : 2.5;

    // 5. 磁振子熱霍爾導率 \kappa_xy (\mu W / K·m)
    // 隨溫度波色分佈增強，高溫下飽和
    const boseFactor = Math.pow(T / 50.0, 1.4) / (1 + Math.pow(T / 120.0, 1.4));
    this.state.thermalHallConductivity = Math.max(0, 18.0 * this.state.chernNumber * (D / 0.2) * boseFactor);

    // 6. 群速度 v_g (km/s)
    this.state.spinWaveVelocityKmS = Math.max(5.0, 16.0 + 5.0 * this.state.resonanceFreqThz);

    // 體制修正
    switch (this.state.regime) {
      case 'terahertz-waveguide':
        this.state.spinWaveVelocityKmS *= 1.35;
        break;
      case 'neel-spin-flop':
        this.state.topologicalGapMev *= 0.6;
        break;
      case 'chiral-thermal-hall':
        this.state.thermalHallConductivity *= 1.4;
        break;
      case 'topological-edge-soliton':
        this.state.spinWaveVelocityKmS *= 1.15;
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

  private playSpinFlopClick(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch {
      // ignore
    }
  }

  private playTHzPulseSound(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      // 用可聽音域 (1800Hz) 模擬太赫茲載波諧波
      osc.frequency.setValueAtTime(1800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2400, this.audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  private playRegimeChord(regime: AntiferroMagnonRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      let freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      if (regime === 'neel-spin-flop') freqs = [440.0, 523.25, 622.25]; // A4, C5, Eb5
      if (regime === 'chiral-thermal-hall') freqs = [587.33, 739.99, 880.0]; // D5, F#5, A5
      if (regime === 'topological-edge-soliton') freqs = [659.25, 830.61, 987.77]; // E5, G#5, B5

      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04 / (idx + 1), this.audioCtx.currentTime);
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

export const antiferroMagnonEngine = new AntiferroTopologicalMagnonEngine();
