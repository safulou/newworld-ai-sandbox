/**
 * 宇宙弦重力子彩虹度規探測網 (Rainbow Metric Graviton Mesh)
 * 
 * 理論基礎：
 * 1. 雙重特殊相對論 (Doubly Special Relativity, DSR) 與彩虹引力理論 (Rainbow Gravity, Magueijo & Smolin 2004)
 * 2. 時空度規在普朗克尺度隨探測粒子能量 E/Ep 而變：ds² = -dt²/f(E)² + dx²/g(E)²
 * 3. 宇宙弦 (Cosmic String) 尖端劇烈震盪噴發超高能重力子暴 (Graviton Burst)，呈現能量色散波包延遲
 * 4. 4 大色散體制：普朗克修正色散、弦論硬散射彩虹度規、宇宙弦重力微透鏡折射、圈量子引力最小長度彩虹
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化彩虹音階與重力子波包干涉音
 * - HTML5 Canvas 2D 視覺化彩虹光譜網格與時空曲率波
 * - 完全支援本地持久化 (BYOK 隱私保護)
 */

export type RainbowModelType = 
  | 'planck_dispersion' 
  | 'string_scattering' 
  | 'cosmic_microlens' 
  | 'lqg_minimal_length';

export interface GravitonPacket {
  id: string;
  energyRatio: number; // E / Ep (0.01 ~ 1.00)
  wavelengthNm: number;
  phaseVelocity: number; // c * g(E) / f(E)
  groupDelayPs: number;
  polarizationAngle: number;
  snr: number;
  detectedAt: number;
}

export interface RainbowMeshState {
  model: RainbowModelType;
  probeEnergyRatio: number; // E / Ep (0.01 ~ 1.00)
  metricFactorF: number; // f(E)
  metricFactorG: number; // g(E)
  phaseVelocityC: number; // 相速度 / c
  effectiveCurvature: number; // 時空微觀曲率
  dispersionDelayPs: number; // 色散延遲 (皮秒)
  rainbowFlux: number; // 彩虹通量儲備
  detectedPackets: GravitonPacket[];
  meshCalibrationLevel: number; // 0 ~ 100%
  autoCalibrate: boolean;
  totalBurstsDetected: number;
}

const STORAGE_KEY = 'newworld_rainbow_graviton_mesh';

class RainbowGravitonEngine {
  private state: RainbowMeshState = {
    model: 'planck_dispersion',
    probeEnergyRatio: 0.35,
    metricFactorF: 1.0,
    metricFactorG: 0.82,
    phaseVelocityC: 0.82,
    effectiveCurvature: 1.45,
    dispersionDelayPs: 14.8,
    rainbowFlux: 420.0,
    detectedPackets: [],
    meshCalibrationLevel: 68.5,
    autoCalibrate: true,
    totalBurstsDetected: 12
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeMetrics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): RainbowMeshState {
    return { ...this.state, detectedPackets: [...this.state.detectedPackets] };
  }

  public setModel(model: RainbowModelType): void {
    this.state.model = model;
    this.recomputeMetrics();
    this.playRainbowArpeggio();
    this.saveState();
  }

  public setProbeEnergy(energyRatio: number): void {
    this.state.probeEnergyRatio = Math.max(0.01, Math.min(1.0, energyRatio));
    this.recomputeMetrics();
    this.saveState();
  }

  public setAutoCalibrate(enabled: boolean): void {
    this.state.autoCalibrate = enabled;
    this.saveState();
  }

  /**
   * 計算彩虹度規函數 f(E) 與 g(E)
   */
  public recomputeMetrics(): void {
    const x = this.state.probeEnergyRatio; // E / Ep
    let f = 1.0;
    let g = 1.0;

    switch (this.state.model) {
      case 'planck_dispersion': {
        const eta = 0.85;
        f = 1.0;
        g = Math.sqrt(Math.max(0.01, 1 - eta * x));
        break;
      }
      case 'string_scattering': {
        const beta = 1.2;
        f = (Math.exp(beta * x) - 1) / (beta * x + 1e-5);
        g = 1.0 / (1 + 0.3 * x);
        break;
      }
      case 'cosmic_microlens': {
        const gamma = 1.5;
        f = 1.0 / (1 + gamma * x * x);
        g = 1.0 / (1 + gamma * x);
        break;
      }
      case 'lqg_minimal_length': {
        const alpha = 0.75;
        f = Math.sqrt(Math.max(0.02, 1 - alpha * x * x));
        g = Math.max(0.02, 1 - alpha * x);
        break;
      }
    }

    this.state.metricFactorF = parseFloat(f.toFixed(4));
    this.state.metricFactorG = parseFloat(g.toFixed(4));
    
    // 相速度 v_p = c * g(E) / f(E)
    this.state.phaseVelocityC = parseFloat((g / (f + 1e-5)).toFixed(4));

    // 微觀曲率與延遲
    this.state.effectiveCurvature = parseFloat((Math.abs(1.0 - g / f) * 12.5).toFixed(3));
    this.state.dispersionDelayPs = parseFloat(((1.0 / (g + 1e-4) - 1.0) * 45.0 + x * 10.0).toFixed(2));
  }

  /**
   * 觸發宇宙弦尖端重力子暴探測 (Graviton Burst Capture)
   */
  public triggerGravitonCapture(): GravitonPacket {
    this.recomputeMetrics();
    const energy = parseFloat((this.state.probeEnergyRatio * (0.8 + Math.random() * 0.4)).toFixed(3));
    const clampedEnergy = Math.max(0.01, Math.min(1.0, energy));
    const wavelength = parseFloat((0.05 / clampedEnergy + Math.random() * 0.02).toFixed(4));
    const delay = parseFloat((this.state.dispersionDelayPs * (0.9 + Math.random() * 0.2)).toFixed(2));
    const phaseV = parseFloat((this.state.phaseVelocityC * (0.95 + Math.random() * 0.1)).toFixed(3));
    const snr = parseFloat((15.0 + (1.0 - clampedEnergy) * 35.0 + Math.random() * 8.0).toFixed(1));

    const packet: GravitonPacket = {
      id: `graviton-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      energyRatio: clampedEnergy,
      wavelengthNm: wavelength,
      phaseVelocity: phaseV,
      groupDelayPs: delay,
      polarizationAngle: Math.floor(Math.random() * 360),
      snr,
      detectedAt: Date.now()
    };

    this.state.detectedPackets.unshift(packet);
    if (this.state.detectedPackets.length > 20) {
      this.state.detectedPackets.pop();
    }

    this.state.totalBurstsDetected++;
    this.state.rainbowFlux += 45.0 + clampedEnergy * 80.0;
    this.state.meshCalibrationLevel = Math.min(100, this.state.meshCalibrationLevel + 2.5);

    this.playGravitonBurst(clampedEnergy);
    this.saveState();
    return packet;
  }

  /**
   * 校準彩虹度規探測網
   */
  public calibrateMesh(): void {
    this.state.meshCalibrationLevel = Math.min(100, this.state.meshCalibrationLevel + 12.0);
    this.state.rainbowFlux += 25.0;
    this.playMetricMeshPing();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoCalibrate && this.state.meshCalibrationLevel < 100) {
      this.state.meshCalibrationLevel = Math.min(100, this.state.meshCalibrationLevel + delta * 0.4);
    }
    // 緩慢積累彩虹能量通量
    this.state.rainbowFlux += delta * (0.8 + this.state.meshCalibrationLevel * 0.03);
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playRainbowArpeggio(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // 依彩虹七彩頻率生成 7 階分解和弦
      const freqs = [392.0, 440.0, 493.88, 523.25, 587.33, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.36);
      });
    } catch {
      // 容錯靜音
    }
  }

  public playGravitonBurst(energyRatio: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      // 高能時頻率更高
      const baseFreq = 220.0 + energyRatio * 680.0;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.45);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch {
      // 容錯靜音
    }
  }

  public playMetricMeshPing(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880.0, now);
      osc.frequency.exponentialRampToValueAtTime(1320.0, now + 0.15);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
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

export const rainbowGravitonEngine = new RainbowGravitonEngine();
