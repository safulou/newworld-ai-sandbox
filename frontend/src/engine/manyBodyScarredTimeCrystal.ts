/**
 * 量子多體疤痕時間晶體調諧器 (Many-Body Scarred Time Crystal)
 * 
 * 理論基礎：
 * 1. 量子多體疤痕 (Quantum Many-Body Scars, QMBS, Turner et al. 2018)
 * 2. 突破本徵態熱化假說 (ETH)，在希爾伯特空間特異低糾纏疤痕子空間實現無衰減非熱化振盪
 * 3. 離散時間晶體 (Discrete Time Crystals, DTC, Wilczek / Khemani 2016)：自發破缺離散時間平移對稱性
 * 4. 週期性 Floquet 驅動下呈現 2T 亞諧波倍週期響應 (Subharmonic Period-Doubling)
 * 5. 4 大多體疤痕驅動拓撲：
 *    - pxp_rydberg_chain: PXP 巨自旋里德伯原子鏈
 *    - floquet_subharmonic_dtc: 離散時間晶體 Floquet 亞諧波對稱破缺
 *    - flat_band_scar: 拓撲平帶非阿貝爾疤痕態
 *    - athermal_rubidium: 反常非熱化共振超冷銣原子陣列
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成 2T 亞諧波指針節拍音、PXP 禁阻躍遷鐘聲與非熱化相干諧波
 * - HTML5 Canvas 2D 呈現 Rydberg 原子自旋晶格、希爾伯特李薩如疤痕軌跡與次諧波 FFT 功率譜
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type ScarTopologyType = 
  | 'pxp_rydberg_chain' 
  | 'floquet_subharmonic_dtc' 
  | 'flat_band_scar' 
  | 'athermal_rubidium';

export interface ScarHarmonicRecord {
  id: string;
  harmonicRatio: string; // "2T", "3T", "4T"
  entanglementEntropy: number; // S_vN (低糾纏特徵)
  revivalFidelity: number; // 復甦保真度 0 ~ 100%
  subharmonicPeakDb: number;
  phaseOffsetRad: number;
  recordedAt: number;
}

export interface ScarredCrystalState {
  topology: ScarTopologyType;
  drivingFrequencyHz: number; // 驅動頻率 Ω (10 ~ 120 Hz)
  flipAngleRad: number; // 自旋翻轉角度 θ (0.5π ~ 1.2π)
  subharmonicMultiplier: number; // 響應週期倍數 (2, 3, 4)
  entanglementEntropy: number; // 馮諾依曼糾纏熵 S_vN
  revivalFidelityPercent: number; // 量子相干復甦保真度
  timeCrystalFlux: number; // 時間晶體相干通量
  scarHarmonics: ScarHarmonicRecord[];
  autoDrive: boolean;
  totalCyclesTuned: number;
}

const STORAGE_KEY = 'newworld_scarred_time_crystal';

class ManyBodyScarredTimeCrystalEngine {
  private state: ScarredCrystalState = {
    topology: 'pxp_rydberg_chain',
    drivingFrequencyHz: 44.0,
    flipAngleRad: 3.14159, // π 翻轉角
    subharmonicMultiplier: 2, // 2T 亞諧波
    entanglementEntropy: 0.28,
    revivalFidelityPercent: 94.6,
    timeCrystalFlux: 310.0,
    scarHarmonics: [],
    autoDrive: true,
    totalCyclesTuned: 16
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeScarDynamics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): ScarredCrystalState {
    return { ...this.state, scarHarmonics: [...this.state.scarHarmonics] };
  }

  public setTopology(topology: ScarTopologyType): void {
    this.state.topology = topology;
    // 根據拓撲調整亞諧波倍數
    if (topology === 'flat_band_scar') {
      this.state.subharmonicMultiplier = 3;
    } else if (topology === 'athermal_rubidium') {
      this.state.subharmonicMultiplier = 4;
    } else {
      this.state.subharmonicMultiplier = 2;
    }
    this.recomputeScarDynamics();
    this.playFloquetHarmonic();
    this.saveState();
  }

  public setDrivingFrequency(freq: number): void {
    this.state.drivingFrequencyHz = Math.max(10.0, Math.min(120.0, parseFloat(freq.toFixed(1))));
    this.recomputeScarDynamics();
    this.saveState();
  }

  public setFlipAngle(theta: number): void {
    this.state.flipAngleRad = Math.max(1.5, Math.min(4.0, parseFloat(theta.toFixed(3))));
    this.recomputeScarDynamics();
    this.saveState();
  }

  public setAutoDrive(enabled: boolean): void {
    this.state.autoDrive = enabled;
    this.saveState();
  }

  /**
   * 計算疤痕態非熱化動力學與保真度
   */
  public recomputeScarDynamics(): void {
    const thetaDev = Math.abs(this.state.flipAngleRad - Math.PI); // 距理想 π 翻轉的偏差
    const robustness = Math.max(0.1, 1.0 - thetaDev * 0.45);

    // 馮諾依曼糾纏熵 (疤痕態具備顯著對數級甚至常數級低糾纏)
    let baseEntropy = 0.25;
    if (this.state.topology === 'pxp_rydberg_chain') baseEntropy = 0.22;
    if (this.state.topology === 'floquet_subharmonic_dtc') baseEntropy = 0.28;
    if (this.state.topology === 'flat_band_scar') baseEntropy = 0.35;
    if (this.state.topology === 'athermal_rubidium') baseEntropy = 0.18;

    this.state.entanglementEntropy = parseFloat((baseEntropy + thetaDev * 0.25).toFixed(3));

    // 復甦保真度 (離散時間晶體具備對微擾之剛性保護)
    const fidelity = 88.0 + robustness * 11.5 - this.state.entanglementEntropy * 8.0;
    this.state.revivalFidelityPercent = parseFloat(Math.min(99.9, Math.max(30.0, fidelity)).toFixed(1));
  }

  /**
   * 觸發多體疤痕復甦振盪脈衝 (Trigger Scar Revival Pulse)
   */
  public triggerScarPulse(): ScarHarmonicRecord {
    this.recomputeScarDynamics();
    const multiplier = this.state.subharmonicMultiplier;
    const peakDb = parseFloat((18.5 + this.state.revivalFidelityPercent * 0.15 + Math.random() * 3.0).toFixed(1));
    const entropy = parseFloat((this.state.entanglementEntropy * (0.95 + Math.random() * 0.1)).toFixed(3));
    const fidelity = parseFloat((this.state.revivalFidelityPercent * (0.98 + Math.random() * 0.03)).toFixed(1));

    const record: ScarHarmonicRecord = {
      id: `scar-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      harmonicRatio: `${multiplier}T`,
      entanglementEntropy: entropy,
      revivalFidelity: Math.min(100, fidelity),
      subharmonicPeakDb: peakDb,
      phaseOffsetRad: parseFloat((Math.random() * Math.PI).toFixed(3)),
      recordedAt: Date.now()
    };

    this.state.scarHarmonics.unshift(record);
    if (this.state.scarHarmonics.length > 20) {
      this.state.scarHarmonics.pop();
    }

    this.state.totalCyclesTuned++;
    this.state.timeCrystalFlux += 35.0 + this.state.revivalFidelityPercent * 0.4;

    this.playSubharmonicTick(multiplier);
    this.saveState();
    return record;
  }

  /**
   * 收集時間晶體相干通量 (PXP 躍遷阻斷)
   */
  public triggerPxpRevival(): void {
    this.state.timeCrystalFlux += 65.0;
    this.state.revivalFidelityPercent = Math.min(99.9, this.state.revivalFidelityPercent + 1.2);
    this.playPxpForbiddenChime();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoDrive) {
      this.state.timeCrystalFlux += delta * (0.6 + this.state.revivalFidelityPercent * 0.02);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playSubharmonicTick(multiplier: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      // 依倍週期調整頻率基底
      const baseFreq = 520.0 / multiplier;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.12);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // 容錯靜音
    }
  }

  public playPxpForbiddenChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const freqs = [659.25, 880.0, 1174.66]; // E5, A5, D6 鐘聲
      freqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.07, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.52);
      });
    } catch {
      // 容錯靜音
    }
  }

  public playFloquetHarmonic(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.linearRampToValueAtTime(440.0, now + 0.2);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
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

export const manyBodyScarredEngine = new ManyBodyScarredTimeCrystalEngine();
