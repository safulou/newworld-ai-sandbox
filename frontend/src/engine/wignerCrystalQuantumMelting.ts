/**
 * 高階維格納晶體量子熔化與向列量子液晶引擎
 * (Wigner Crystal Quantum Melting & Quantum Nematic Phase Engine)
 *
 * 核心物理理論：
 * 1. 二維電子氣 (2DEG) 與維格納庫侖參數 r_s：
 *    r_s = \frac{E_{\text{Coulomb}}}{E_{\text{Fermi}}} = \frac{1}{\sqrt{\pi n_e} a_B^*}。
 *    在低載流子密度下，庫侖排斥能遠超量子動能 (r_s \gtrsim 37)，電子自發空間局域化形成六角維格納晶體。
 * 2. 剪切模量與固態彈性 (Lattice Shear Modulus \mu_s)：
 *    維格納晶體具有有限的剪切剛性 \mu_s \approx 0.245 \frac{e^2}{\epsilon} n_e^{3/2}，展現真正晶態固體特徵。
 * 3. KTHNY 量子熔化相變 (KTHNY Topological Defect Melting Mechanism)：
 *    增加電子密度使 r_s 跨越臨界值，或施加量子漲落，晶體自發解離成位錯對 (Dislocations) 與雙位錯 (Disclinations)。
 * 4. 電子向列量子液晶相 (Electronic Quantum Nematic Liquid)：
 *    在進入等向性費米液體前，系統經歷中間向列相：空間平移對稱性恢復（電子無障礙流動），
 *    但旋轉對稱性破缺為雙重指向性。向列序參量張量 Q_{ij} 導致巨電阻率各向異性比 \rho_{xx}/\rho_{yy} \gg 1。
 * 5. 強磁場維格納結晶與分數量子霍爾條紋共存 (Magnetic Field Correlated Pinning)：
 *    施加垂直強磁場淬滅費米動能，將電子限制於最低朗道能級 (LL)，促成高磁場微觀維格納晶格與微波共振。
 */

export type WignerRegime =
  | 'hexagonal-wigner-crystal'            // 六角維格納量子固態相 (強局域化、有限剪切模量)
  | 'kthny-quantum-melting-intermediate'  // KTHNY 拓撲缺陷增殖量子熔化過渡態
  | 'quantum-nematic-liquid-crystal'      // 電子向列量子液晶相 (旋轉破缺、巨各向異性)
  | 'correlated-fermi-liquid';            // 等向性強關聯費米液體相

export interface WignerCrystalState {
  electronDensityN10Cm2: number;          // 電子面密度 n_e (10^10 cm^-2, 0.2 ~ 8.0)
  wignerParameterRs: number;              // 維格納參數 r_s (5.0 ~ 70.0, 結晶臨界值約 37.0)
  magneticFieldTesla: number;             // 垂直磁場 B (T, 0.0 ~ 14.0)
  directorAngleRad: number;               // 向列指向矢方向角 \theta_nem (rad, 0.0 ~ \pi)
  regime: WignerRegime;

  // 動態演算物理指標
  latticeShearModulusMu: number;          // 晶格剪切模量 \mu_s (10^-6 dyn/cm)
  nematicOrderParameterS: number;         // 向列序參量 S (0.0 ~ 1.0)
  resistivityAnisotropyRatio: number;     // 電阻率各向異性比 \rho_xx / \rho_yy (1.0 ~ 45.0)
  depinningThresholdFieldVcm: number;     // 雜質解釘臨界電場 E_th (V/cm)
  depinningMicrowaveFactor: number;       // 微波解釘衰減因子 (0.2 ~ 1.0)
  microwaveResonanceFreqGhz: number;      // 維格納位移共振頻率 f_pin (GHz)
  telemetryHistory: Array<{
    timestamp: number;
    rsParameter: number;
    nematicOrder: number;
    shearModulus: number;
  }>;
}

const STORAGE_KEY = 'newworld_wigner_crystal_quantum_melting_state_v1';

class WignerCrystalEngine {
  private state: WignerCrystalState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): WignerCrystalState {
    return {
      electronDensityN10Cm2: 0.85,
      wignerParameterRs: 42.5, // 初始處於維格納晶態
      magneticFieldTesla: 3.2,
      directorAngleRad: 0.52, // 30度
      regime: 'hexagonal-wigner-crystal',
      latticeShearModulusMu: 12.8,
      nematicOrderParameterS: 0.15,
      resistivityAnisotropyRatio: 1.8,
      depinningThresholdFieldVcm: 0.45,
      depinningMicrowaveFactor: 1.0,
      microwaveResonanceFreqGhz: 4.8,
      telemetryHistory: []
    };
  }

  private loadState(): WignerCrystalState {
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

  public getState(): WignerCrystalState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // 計算 r_s：r_s \propto 1 / \sqrt{n_e}
    // 磁場有效壓縮朗道軌道半徑，等效提升 r_s
    const magneticBoost = 1.0 + (s.magneticFieldTesla / 6.0) * 0.45;
    const baseRs = 38.0 / Math.sqrt(Math.max(0.1, s.electronDensityN10Cm2));
    s.wignerParameterRs = Number((baseRs * magneticBoost).toFixed(2));

    // 依據 r_s 判別相態與物理量
    if (s.wignerParameterRs >= 37.0) {
      // 維格納固體
      s.regime = 'hexagonal-wigner-crystal';
      s.latticeShearModulusMu = Number(((s.wignerParameterRs - 35.0) * 1.8 * Math.pow(s.electronDensityN10Cm2, 1.2)).toFixed(2));
      s.nematicOrderParameterS = Number(Math.max(0.05, 0.25 - (s.wignerParameterRs - 37.0) * 0.01).toFixed(2));
      s.resistivityAnisotropyRatio = Number((1.2 + (s.magneticFieldTesla * 0.2)).toFixed(2));
      s.depinningThresholdFieldVcm = Number(((0.35 + (s.wignerParameterRs - 37.0) * 0.04) * s.depinningMicrowaveFactor).toFixed(3));
      s.microwaveResonanceFreqGhz = Number((2.5 + s.magneticFieldTesla * 0.8).toFixed(2));
    } else if (s.wignerParameterRs >= 28.0) {
      // KTHNY 量子熔化中間過渡態
      s.regime = 'kthny-quantum-melting-intermediate';
      s.latticeShearModulusMu = Number(Math.max(0.0, (s.wignerParameterRs - 28.0) * 0.5).toFixed(2));
      s.nematicOrderParameterS = Number((0.35 + (37.0 - s.wignerParameterRs) * 0.04).toFixed(2));
      s.resistivityAnisotropyRatio = Number((3.5 + (37.0 - s.wignerParameterRs) * 1.5).toFixed(2));
      s.depinningThresholdFieldVcm = Number(Math.max(0.02, 0.15 - (37.0 - s.wignerParameterRs) * 0.01).toFixed(3));
      s.microwaveResonanceFreqGhz = Number((1.2 + s.magneticFieldTesla * 0.4).toFixed(2));
    } else if (s.wignerParameterRs >= 18.0) {
      // 電子向列量子液晶相
      s.regime = 'quantum-nematic-liquid-crystal';
      s.latticeShearModulusMu = 0.0; // 剪切模量完全歸零（電子可流動）
      s.nematicOrderParameterS = Number(Math.min(0.95, 0.55 + (28.0 - s.wignerParameterRs) * 0.035).toFixed(2));
      s.resistivityAnisotropyRatio = Number((12.0 + s.nematicOrderParameterS * 28.0).toFixed(1));
      s.depinningThresholdFieldVcm = 0.005;
      s.microwaveResonanceFreqGhz = Number((0.4 + s.magneticFieldTesla * 0.15).toFixed(2));
    } else {
      // 等向性強關聯費米液體
      s.regime = 'correlated-fermi-liquid';
      s.latticeShearModulusMu = 0.0;
      s.nematicOrderParameterS = Number(Math.max(0.01, 0.15 - (18.0 - s.wignerParameterRs) * 0.01).toFixed(2));
      s.resistivityAnisotropyRatio = 1.05;
      s.depinningThresholdFieldVcm = 0.0;
      s.microwaveResonanceFreqGhz = 0.1;
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
        rsParameter: this.state.wignerParameterRs,
        nematicOrder: this.state.nematicOrderParameterS,
        shearModulus: this.state.latticeShearModulusMu
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public compressElectronDensity(deltaN: number): void {
    this.state.electronDensityN10Cm2 = Number(Math.max(0.2, Math.min(8.0, this.state.electronDensityN10Cm2 + deltaN)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(480, 360, 0.15, 'sawtooth');
  }

  public sweepMagneticField(newB: number): void {
    this.state.magneticFieldTesla = Number(Math.max(0.0, Math.min(14.0, newB)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(320, 640, 0.2, 'sine');
  }

  public applyInPlaneStrain(deltaAngleRad: number = 0.25): void {
    this.state.directorAngleRad = Number(((this.state.directorAngleRad + deltaAngleRad) % Math.PI).toFixed(2));
    this.recalculatePhysics();
    this.playTone(550, 720, 0.16, 'triangle');
  }

  public pulseDefectDepinning(): void {
    // 注入解釘微波偏壓
    this.state.depinningMicrowaveFactor = Number(Math.max(0.15, this.state.depinningMicrowaveFactor * 0.75).toFixed(3));
    this.recalculatePhysics();
    this.playTone(750, 220, 0.22, 'square');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(280, 180, 0.2, 'sine');
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

export const wignerCrystalEngine = new WignerCrystalEngine();
