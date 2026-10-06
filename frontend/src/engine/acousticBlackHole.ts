/**
 * 超流真空聲學事件視界發電機 (Acoustic Black Hole BEC Dynamo)
 * 
 * 理論基礎：
 * 1. 烏魯赫效應與聲學黑洞 (Acoustic Black Holes / Dumb Holes, William Unruh 1981)
 * 2. 玻色-愛因斯坦凝聚態 (BEC) 中超流體流速 v(r) 超越局部聲速 cs = √(gn/m) 時形成聲學事件視界
 * 3. 聲學霍金輻射 (Acoustic Hawking Radiation)：在視界邊界自發產生量子糾纏熱聲子對 (Phonon Pairs)
 * 4. 旋轉渦旋聲學克爾黑洞具有聲學能層 (Acoustic Ergosphere)，可藉由彭羅斯超輻射 (Superradiance) 提取旋轉能
 * 5. 4 大運作架構：
 *    - laval_nozzle: 拉瓦爾噴嘴超音速視界
 *    - vortex_kerr: 旋轉渦旋克爾聲學黑洞
 *    - hawking_converter: 聲學霍金輻射熱電超導轉換
 *    - white_hole_dynamo: 超流真空聲學白洞反向爆震
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成超音速聲爆過渡音、霍金聲子微晶微爆音與超輻射發電諧振
 * - HTML5 Canvas 2D 視覺化超流向量場、聲學事件視界邊界與逃逸聲子軌跡
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type AcousticHorizonMode = 
  | 'laval_nozzle' 
  | 'vortex_kerr' 
  | 'hawking_converter' 
  | 'white_hole_dynamo';

export interface PhononPair {
  id: string;
  energyEv: number;
  frequencyKhz: number;
  entanglementFidelity: number;
  escaped: boolean;
  angleRad: number;
  emittedAt: number;
}

export interface AcousticDynamoState {
  mode: AcousticHorizonMode;
  machNumber: number; // M = v / cs (0.5 ~ 3.5 Mach)
  soundSpeedMs: number; // 局部聲速 cs (m/s)
  fluidVelocityMs: number; // 超流流速 v (m/s)
  vortexCirculation: number; // 渦旋環量 0 ~ 10 h/m
  hawkingTemperatureNkT: number; // 聲學霍金溫度 (nK)
  superradianceGainDb: number; // 彭羅斯超輻射增益
  harvestedPhononEnergy: number; // 收集之聲子微能量 (pJ)
  acousticDynamoPowerKw: number; // 發電機即時輸出 (kW)
  phononPairs: PhononPair[];
  autoHarvest: boolean;
  totalPhononsHarvested: number;
}

const STORAGE_KEY = 'newworld_acoustic_black_hole_dynamo';

class AcousticBlackHoleEngine {
  private state: AcousticDynamoState = {
    mode: 'laval_nozzle',
    machNumber: 1.65,
    soundSpeedMs: 4.8,
    fluidVelocityMs: 7.92,
    vortexCirculation: 3.0,
    hawkingTemperatureNkT: 24.5,
    superradianceGainDb: 6.8,
    harvestedPhononEnergy: 850.0,
    acousticDynamoPowerKw: 142.5,
    phononPairs: [],
    autoHarvest: true,
    totalPhononsHarvested: 38
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeAcoustics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): AcousticDynamoState {
    return { ...this.state, phononPairs: [...this.state.phononPairs] };
  }

  public setMode(mode: AcousticHorizonMode): void {
    this.state.mode = mode;
    this.recomputeAcoustics();
    this.playSuperradiantPulse();
    this.saveState();
  }

  public setMachNumber(mach: number): void {
    this.state.machNumber = Math.max(0.5, Math.min(3.5, parseFloat(mach.toFixed(2))));
    this.recomputeAcoustics();
    this.saveState();
  }

  public setVortexCirculation(circulation: number): void {
    this.state.vortexCirculation = Math.max(0, Math.min(10.0, parseFloat(circulation.toFixed(1))));
    this.recomputeAcoustics();
    this.saveState();
  }

  public setAutoHarvest(enabled: boolean): void {
    this.state.autoHarvest = enabled;
    this.saveState();
  }

  /**
   * 計算聲學視界流體力學與熱力學參數
   */
  public recomputeAcoustics(): void {
    const M = this.state.machNumber;
    const cs = 4.8; // 典型超流 BEC 聲速 4.8 mm/s ~ m/s (沙盒標定值)
    this.state.soundSpeedMs = cs;
    this.state.fluidVelocityMs = parseFloat((cs * M).toFixed(2));

    // 視界梯度計算霍金溫度 (當 M > 1 存在視界)
    const horizonDelta = Math.max(0, M - 1.0);
    this.state.hawkingTemperatureNkT = parseFloat((12.0 * horizonDelta + 4.5 * Math.sqrt(horizonDelta + 0.01)).toFixed(2));

    // 旋轉克爾模式超輻射增益
    if (this.state.mode === 'vortex_kerr' || this.state.mode === 'white_hole_dynamo') {
      const circulationBoost = this.state.vortexCirculation * 1.4;
      this.state.superradianceGainDb = parseFloat((3.2 + circulationBoost * (M > 1.0 ? 1.2 : 0.4)).toFixed(2));
    } else {
      this.state.superradianceGainDb = parseFloat((1.5 + horizonDelta * 2.8).toFixed(2));
    }

    // 發電機功率 (kW)
    const basePower = M > 1.0 ? (M * M * 45.0 + this.state.hawkingTemperatureNkT * 2.2) : (M * 20.0);
    this.state.acousticDynamoPowerKw = parseFloat((basePower * (1.0 + this.state.superradianceGainDb * 0.08)).toFixed(1));
  }

  /**
   * 採集霍金聲子能量 (Harvest Hawking Phonons)
   */
  public harvestHawkingPhonons(): PhononPair {
    this.recomputeAcoustics();
    const M = this.state.machNumber;
    const isSuperSonic = M >= 1.0;
    const energy = parseFloat(((isSuperSonic ? 2.5 : 0.8) + Math.random() * 3.2).toFixed(2));
    const freq = parseFloat((18.5 + M * 22.0 + Math.random() * 5.0).toFixed(1));
    const fidelity = parseFloat((0.85 + (isSuperSonic ? 0.12 : -0.2) + Math.random() * 0.03).toFixed(3));

    const pair: PhononPair = {
      id: `phonon-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      energyEv: energy,
      frequencyKhz: freq,
      entanglementFidelity: Math.min(0.999, Math.max(0.1, fidelity)),
      escaped: isSuperSonic,
      angleRad: Math.random() * Math.PI * 2,
      emittedAt: Date.now()
    };

    this.state.phononPairs.unshift(pair);
    if (this.state.phononPairs.length > 20) {
      this.state.phononPairs.pop();
    }

    this.state.totalPhononsHarvested++;
    this.state.harvestedPhononEnergy += energy * 25.0;

    this.playHawkingPhononChirp(energy);
    this.saveState();
    return pair;
  }

  /**
   * 觸發超音速聲爆過渡 (Trigger Sonic Boom Transition)
   */
  public triggerSonicBoomTransition(): void {
    this.state.machNumber = this.state.machNumber >= 1.0 ? 2.4 : 1.25;
    this.recomputeAcoustics();
    this.state.harvestedPhononEnergy += 120.0;
    this.playSonicBoomRumble();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoHarvest && this.state.machNumber >= 1.0) {
      this.state.harvestedPhononEnergy += delta * (this.state.acousticDynamoPowerKw * 0.05);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playSonicBoomRumble(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // 低頻衝擊波震鳴
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140.0, now);
      osc.frequency.exponentialRampToValueAtTime(32.0, now + 0.6);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.72);
    } catch {
      // 容錯靜音
    }
  }

  public playHawkingPhononChirp(energy: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const baseFreq = 950.0 + energy * 220.0;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.12);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // 容錯靜音
    }
  }

  public playSuperradiantPulse(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const freqs = [220.0, 330.0, 440.0];
      freqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.3);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.32);
      });
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

export const acousticBlackHoleEngine = new AcousticBlackHoleEngine();
