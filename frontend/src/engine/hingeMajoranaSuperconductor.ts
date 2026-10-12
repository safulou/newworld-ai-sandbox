/**
 * 三維二階拓撲超導馬約拉納手性鉸鏈態晶片 (Higher-Order Topological Superconductor Hinge Majorana Chip)
 *
 * 核心物理理論：
 * 1. 二階拓撲超導體 (Second-Order Topological Superconductor, HOTSC)：
 *    3D 塊體與 2D 表面皆為全能隙態 (Gapped bulk & Gapped surfaces)，
 *    但在相鄰表面具有相反質量的二維狄拉克質量域壁處 (Domain Wall at Hinge Edges)，
 *    於 1D 晶體鉸鏈 (Hinges) 激發受拓撲保護的一維無耗散手性馬約拉納傳播模：
 *    E(k_z) = v_F \hbar k_z。
 * 2. 表面狄拉克質量反轉機制 (Surface Dirac Mass Inversion & Jackiw-Rebbi Mechanism)：
 *    相鄰表面 (x-normal 與 y-normal) 塞曼場破缺時間反演對稱性，
 *    質量項分別為 M_x = \Delta_0 - \alpha B_z, M_y = \Delta_0 + \alpha B_z，
 *    於相交邊界處滿足 M(s) = 0，根據 Jackiw-Rebbi 定理局域化手性馬約拉納零模。
 * 3. 量子化半整數熱霍爾電導率 (Half-Quantized Thermal Hall Conductance)：
 *    單一手性馬約拉納費米子為自共軛單重態 (\gamma^\dagger = \gamma)，
 *    貢獻半整數中心荷 c = 1/2，其邊緣熱霍爾電導嚴格量子化為：
 *    K_H = \frac{1}{2} \left( \frac{\pi^2 k_B^2}{3h} T \right)。
 */

export type HingeMajoranaRegime =
  | 'chiral-hinge-majorana'      // 手性馬約拉納鉸鏈態相
  | 'corner-zero-mode'           // 二階端角零能馬約拉納束縛相
  | 'surface-mass-inversion'     // 表面狄拉克質量域壁反轉相
  | 'fractional-thermal-hall';   // 半整數量子熱霍爾傳導相

export interface HingeMajoranaState {
  bulkPairingGapDeltaMev: number;    // 塊體超導配對能隙 \Delta_0 (0.5 ~ 8.0 meV)
  zeemanExchangeFieldTesla: number;  // 塞曼交換磁場 B_z (0.2 ~ 6.0 T)
  hingeDisorderPotentialMev: number; // 鉸鏈雜質無序能勢 V_dis (0.0 ~ 3.0 meV)
  operatingTempKelvin: number;       // 操作溫度 T (0.01 ~ 1.50 K)
  regime: HingeMajoranaRegime;
  // 動態演算物理指標
  majoranaVelocityKmS: number;       // 費米速度 v_F (km/s)
  surfaceMassGapXmev: number;        // X 表面狄拉克質量隙 M_x (meV)
  surfaceMassGapYmev: number;        // Y 表面狄拉克質量隙 M_y (meV)
  thermalHallConductanceRatio: number; // 熱霍爾電導比率 K_H / K_0 (目標 0.50 為半整數基準)
  hingeLocalizationLengthNm: number; // 鉸鏈態橫向局域長度 \xi_H (nm)
  chiralCurrentNa: number;           // 手性馬約拉納準粒子流 (nA)
  topologicalWindingNumber: number;  // 鉸鏈拓撲示性數 N_hinge
  isReversedChirality: boolean;      // 鉸鏈手性傳播方向翻轉標記
  telemetryHistory: Array<{
    timestamp: number;
    velocityKmS: number;
    thermalHallRatio: number;
    currentNa: number;
  }>;
}

const STORAGE_KEY = 'newworld_hinge_majorana_state_v1';

class HingeMajoranaSuperconductorEngine {
  private state: HingeMajoranaState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): HingeMajoranaState {
    return {
      bulkPairingGapDeltaMev: 3.2,
      zeemanExchangeFieldTesla: 2.4,
      hingeDisorderPotentialMev: 0.35,
      operatingTempKelvin: 0.12,
      regime: 'chiral-hinge-majorana',
      majoranaVelocityKmS: 48.5,
      surfaceMassGapXmev: 1.84,
      surfaceMassGapYmev: -1.72,
      thermalHallConductanceRatio: 0.50,
      hingeLocalizationLengthNm: 14.2,
      chiralCurrentNa: 3.42,
      topologicalWindingNumber: 4,
      isReversedChirality: false,
      telemetryHistory: []
    };
  }

  private loadState(): HingeMajoranaState {
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
      // 降級取預設值
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 略過儲存異常
    }
  }

  public getState(): Readonly<HingeMajoranaState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<HingeMajoranaState,
    'bulkPairingGapDeltaMev' | 'zeemanExchangeFieldTesla' | 'hingeDisorderPotentialMev' | 'operatingTempKelvin' | 'regime'
  >>): void {
    if (params.bulkPairingGapDeltaMev !== undefined) {
      this.state.bulkPairingGapDeltaMev = Math.max(0.5, Math.min(8.0, params.bulkPairingGapDeltaMev));
    }
    if (params.zeemanExchangeFieldTesla !== undefined) {
      this.state.zeemanExchangeFieldTesla = Math.max(0.2, Math.min(6.0, params.zeemanExchangeFieldTesla));
    }
    if (params.hingeDisorderPotentialMev !== undefined) {
      this.state.hingeDisorderPotentialMev = Math.max(0.0, Math.min(3.0, params.hingeDisorderPotentialMev));
    }
    if (params.operatingTempKelvin !== undefined) {
      this.state.operatingTempKelvin = Math.max(0.01, Math.min(1.50, params.operatingTempKelvin));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public invertSurfaceDomainWall(): void {
    this.state.isReversedChirality = !this.state.isReversedChirality;
    this.playHingeSound(520, 0.28, 'triangle');
    this.recomputePhysics();
    this.saveState();
  }

  public pumpHingeBraidingStep(): void {
    this.playHingeSound(740, 0.35, 'sine');
    this.state.chiralCurrentNa += 1.85;
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    const decay = Math.exp(-delta * 0.4);
    const nominalCurrent = this.calculateNominalCurrent();
    this.state.chiralCurrentNa = nominalCurrent + (this.state.chiralCurrentNa - nominalCurrent) * decay;

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        velocityKmS: Number(this.state.majoranaVelocityKmS.toFixed(2)),
        thermalHallRatio: Number(this.state.thermalHallConductanceRatio.toFixed(3)),
        currentNa: Number(this.state.chiralCurrentNa.toFixed(2))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private calculateNominalCurrent(): number {
    const delta = this.state.bulkPairingGapDeltaMev;
    const b = this.state.zeemanExchangeFieldTesla;
    const disorderSuppression = Math.exp(-this.state.hingeDisorderPotentialMev * 0.6);
    const sign = this.state.isReversedChirality ? -1 : 1;
    return sign * (delta * 0.8 + b * 0.5) * disorderSuppression * (this.state.regime === 'chiral-hinge-majorana' ? 1.25 : 1.0);
  }

  private recomputePhysics(): void {
    const delta = this.state.bulkPairingGapDeltaMev;
    const b = this.state.zeemanExchangeFieldTesla;
    const vDis = this.state.hingeDisorderPotentialMev;
    const temp = this.state.operatingTempKelvin;

    // 表面狄拉克質量：Mx 與 My 在相鄰表面具有相反符號
    const mx = delta - 0.58 * b;
    const my = -delta + 0.58 * b;
    this.state.surfaceMassGapXmev = Number(mx.toFixed(2));
    this.state.surfaceMassGapYmev = Number(my.toFixed(2));

    // 鉸鏈態橫向局域長度 \xi_H \approx \hbar v_F / |M|
    const effectiveMass = Math.max(0.15, Math.abs(mx));
    const xi = (24.0 / effectiveMass) * (1 + 0.15 * vDis);
    this.state.hingeLocalizationLengthNm = Number(Math.max(4.0, Math.min(60.0, xi)).toFixed(1));

    // 馬約拉納費米速度 v_F
    const vf = (35.0 + 5.2 * delta - 1.8 * vDis) * (1 - 0.12 * (temp / 1.5));
    this.state.majoranaVelocityKmS = Number(Math.max(10.0, vf).toFixed(1));

    // 熱霍爾電導比率 K_H / K_0 (理論量子化值為 c/2 = 0.50)
    // 雜質與熱激發造成微量偏離，但在拓撲相中嚴格鎖定近 0.50
    const thermalBroadening = 0.015 * Math.tanh(temp * 2.5);
    const disorderDrift = 0.02 * (vDis / 3.0);
    const qRatio = 0.50 - thermalBroadening + disorderDrift * 0.5;
    this.state.thermalHallConductanceRatio = Number(Math.max(0.42, Math.min(0.55, qRatio)).toFixed(3));

    // 拓撲示性數 N_hinge
    switch (this.state.regime) {
      case 'chiral-hinge-majorana':
        this.state.topologicalWindingNumber = 4; // 四條手性邊界鉸鏈
        break;
      case 'corner-zero-mode':
        this.state.topologicalWindingNumber = 8; // 8個晶體頂角零模
        break;
      case 'surface-mass-inversion':
        this.state.topologicalWindingNumber = 2; // 2條主域壁鉸鏈
        break;
      case 'fractional-thermal-hall':
        this.state.topologicalWindingNumber = 1; // 1組純淨量子化熱霍爾單元
        break;
    }
  }

  private initAudioContext(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playHingeSound(freq: number, duration: number, type: OscillatorType): void {
    try {
      this.initAudioContext();
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.045, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 略過 Web Audio 異常
    }
  }
}

export const hingeMajoranaEngine = new HingeMajoranaSuperconductorEngine();
