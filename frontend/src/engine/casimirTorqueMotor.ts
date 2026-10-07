/**
 * 拓撲缺陷卡西米爾真空扭矩馬達 (Casimir Vacuum Torque Motor)
 * 
 * 理論基礎：
 * 1. 量子電動力學各向異性卡西米爾效應 (Casimir Effect & Torque, Somers et al. 2018)
 * 2. 雙軸各向異性雙折射晶體在真空零點能中，偏振光子模式非對稱反射產生淨機械旋轉扭矩：
 *    τ(θ, d) ∝ (sin 2θ / d³) · Δϵ
 * 3. 零摩擦超真空量子磁懸浮轉子，直接抽取真空零點場角動量
 * 4. 4 大工作體制：
 *    - birefringent_calcite: 雙軸各向異性方解石量子扭矩
 *    - chiral_weyl: 手性外爾半金屬拓撲表面態
 *    - negative_casimir_levitation: 超材料負卡西米爾斥力懸浮
 *    - dynamical_vacuum_drive: 動態量子真空破缺共振驅動
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成真空旋轉升速滑音、磁懸浮共鳴與零點能微晶音
 * - HTML5 Canvas 2D 視覺化旋轉微晶片、偏振虛光子流與卡西米爾側向力向量
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type CasimirRegime = 
  | 'birefringent_calcite' 
  | 'chiral_weyl' 
  | 'negative_casimir_levitation' 
  | 'dynamical_vacuum_drive';

export interface TorqueLogEntry {
  id: string;
  angleDeg: number;
  gapNm: number;
  torqueFemtoNm: number; // 飛牛頓·米 (fN·m)
  powerAttoWatt: number; // 阿瓦特 (aW)
  rpm: number;
  timestamp: number;
}

export interface CasimirMotorState {
  regime: CasimirRegime;
  gapDistanceNm: number; // 板間距 d (10 ~ 120 nm)
  rotationAngleDeg: number; // 夾角 θ (0° ~ 180°)
  torqueFemtoNm: number; // 瞬時卡西米爾扭矩
  rotationSpeedRpm: number; // 轉速 RPM
  outputPowerAttoWatt: number; // 輸出功率 aW
  vacuumZeroEnergyFlux: number; // 累積零點通量
  levitationStabilityPercent: number; // 懸浮穩定度
  torqueLogs: TorqueLogEntry[];
  autoDrive: boolean;
  totalSpinsExecuted: number;
}

const STORAGE_KEY = 'newworld_casimir_torque_motor';

class CasimirTorqueMotorEngine {
  private state: CasimirMotorState = {
    regime: 'birefringent_calcite',
    gapDistanceNm: 25.0,
    rotationAngleDeg: 45.0, // 45° 時 sin(2θ) = 1 達到極大扭矩
    torqueFemtoNm: 84.5,
    rotationSpeedRpm: 12400.0,
    outputPowerAttoWatt: 365.0,
    vacuumZeroEnergyFlux: 720.0,
    levitationStabilityPercent: 96.8,
    torqueLogs: [],
    autoDrive: true,
    totalSpinsExecuted: 15
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeDynamics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): CasimirMotorState {
    return { ...this.state, torqueLogs: [...this.state.torqueLogs] };
  }

  public setRegime(regime: CasimirRegime): void {
    this.state.regime = regime;
    this.recomputeDynamics();
    this.playQuantumLevitationTone();
    this.saveState();
  }

  public setGapDistanceNm(gap: number): void {
    this.state.gapDistanceNm = Math.max(10.0, Math.min(120.0, parseFloat(gap.toFixed(1))));
    this.recomputeDynamics();
    this.saveState();
  }

  public setRotationAngleDeg(deg: number): void {
    this.state.rotationAngleDeg = Math.max(0, Math.min(180.0, parseFloat(deg.toFixed(1))));
    this.recomputeDynamics();
    this.saveState();
  }

  public setAutoDrive(enabled: boolean): void {
    this.state.autoDrive = enabled;
    this.saveState();
  }

  /**
   * 計算卡西米爾非對稱扭矩與轉速
   */
  public recomputeDynamics(): void {
    const d = this.state.gapDistanceNm;
    const thetaRad = (this.state.rotationAngleDeg * Math.PI) / 180;
    
    // 扭矩基底 τ ∝ sin(2θ) / d³
    let materialFactor = 1.0;
    if (this.state.regime === 'chiral_weyl') materialFactor = 1.85;
    if (this.state.regime === 'negative_casimir_levitation') materialFactor = 1.25;
    if (this.state.regime === 'dynamical_vacuum_drive') materialFactor = 2.4;

    const baseSin = Math.abs(Math.sin(2 * thetaRad));
    const distanceScale = Math.pow(30.0 / d, 3);
    const torque = Math.max(0.5, 45.0 * baseSin * distanceScale * materialFactor);
    this.state.torqueFemtoNm = parseFloat(torque.toFixed(2));

    // 轉速與功率
    this.state.rotationSpeedRpm = parseFloat((this.state.torqueFemtoNm * 148.0).toFixed(1));
    this.state.outputPowerAttoWatt = parseFloat((this.state.torqueFemtoNm * (this.state.rotationSpeedRpm / 1000) * 0.35).toFixed(1));

    // 懸浮穩定度
    this.state.levitationStabilityPercent = parseFloat(Math.min(99.9, Math.max(60.0, 99.0 - (d < 15 ? (15 - d) * 2.5 : (d - 80) * 0.2))).toFixed(1));
  }

  /**
   * 觸發量子旋轉加速衝擊 (Spin Motor Boost)
   */
  public spinMotor(): TorqueLogEntry {
    this.recomputeDynamics();
    const entry: TorqueLogEntry = {
      id: `torque-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      angleDeg: this.state.rotationAngleDeg,
      gapNm: this.state.gapDistanceNm,
      torqueFemtoNm: this.state.torqueFemtoNm,
      powerAttoWatt: this.state.outputPowerAttoWatt,
      rpm: this.state.rotationSpeedRpm,
      timestamp: Date.now()
    };

    this.state.torqueLogs.unshift(entry);
    if (this.state.torqueLogs.length > 20) {
      this.state.torqueLogs.pop();
    }

    this.state.totalSpinsExecuted++;
    this.state.vacuumZeroEnergyFlux += 55.0 + this.state.torqueFemtoNm * 0.5;

    this.playTorqueWhir(this.state.rotationSpeedRpm);
    this.saveState();
    return entry;
  }

  /**
   * 觸發零點共振增益
   */
  public triggerResonanceBoost(): void {
    this.state.vacuumZeroEnergyFlux += 120.0;
    this.state.rotationAngleDeg = 45.0; // 自動回歸極大扭矩角
    this.recomputeDynamics();
    this.playVacuumZeroPointChime();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoDrive) {
      this.state.vacuumZeroEnergyFlux += delta * (0.8 + this.state.outputPowerAttoWatt * 0.005);
      // 自動旋轉步進
      this.state.rotationAngleDeg = (this.state.rotationAngleDeg + delta * 12.0) % 180;
      this.recomputeDynamics();
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  public playTorqueWhir(rpm: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      const baseFreq = Math.min(1800, 220 + rpm * 0.08);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.35);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.48);
    } catch {
      // 容錯靜音
    }
  }

  public playQuantumLevitationTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const freqs = [440.0, 554.37, 659.25]; // A4, C#5, E5
      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.04);

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

  public playVacuumZeroPointChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.2); // G6

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
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

export const casimirTorqueEngine = new CasimirTorqueMotorEngine();
