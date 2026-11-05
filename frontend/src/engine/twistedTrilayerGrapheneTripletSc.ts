/**
 * 扭轉三層石墨烯平帶自旋三重態莫爾超導與手性包立極限突破引擎
 * (Magic-Angle Twisted Trilayer Graphene Flat-Band Spin-Triplet Superconductor & Pauli-Limit Violation Engine)
 *
 * 物理原理：
 * 1. 鏡像對稱交替扭轉三層石墨烯 (Mirror-Symmetric Magic-Angle Twisted Trilayer Graphene, MATTG，扭角
 *    \theta_{MATTG} = \sqrt{2} \theta_{MATBG} \approx 1.56^\circ，具有 A-tw-A 鏡像反射對稱 M_z)
 *    在本徵基底下分解為偶鏡像宇稱 (M_z = +1) 的「超重莫爾平帶」與奇鏡像宇稱 (M_z = -1) 的「高費米速度單層狄拉克錐」。
 * 2. 外加垂直位移電場 D_z 可原位調諧鏡像宇稱破缺與平帶-狄拉克錐雜化強度，使超導轉變溫度 T_c 與量子幾何超流剛度達到極大值。
 * 3. 在強面內磁場 B_\parallel (高達 10 T) 下，塞曼效應不會像自旋單態那樣在包立順磁極限 B_P = 1.86 T_c 處摧毀超導，
 *    而是觀測到超過 3 ~ 4 倍包立極限之極端強場超導 (B_{c\parallel} / B_{Pauli} > 3.5) 以及高場重入非么正自旋三重態
 *    (Non-Unitary Spin-Triplet / Valley-Singlet Pairing) 相變。
 */

export type TwistedTrilayerGrapheneRegime =
  | 'zero-displacement-decoupled-flatband-dirac'
  | 'optimal-dz-hybridized-ultra-strong-coupling'
  | 'pauli-limit-violating-spin-triplet-phase'
  | 'high-inplane-field-reentrant-nonunitary-sc';

export interface TrilayerMoirePairingNode {
  id: number;
  x: number;
  y: number;
  mirrorParityMz: 1 | -1;
  tripletSpinProjectionSz: 1 | 0 | -1;
  localSuperfluidWeight: number;
  diracFlatbandHybridization: number;
}

export interface TwistedTrilayerGrapheneState {
  alternatingTwistAngleDeg: number;       // 交替扭轉角 \theta_{MATTG} (deg, 1.30 ~ 1.80, 魔角 \approx 1.56^\circ)
  inPlaneMagneticFieldTesla: number;      // 面內平行磁場 B_\parallel (T, 0.0 ~ 12.0)
  displacementFieldDzVnm: number;         // 垂直位移電場 D_z (V/nm, 0.00 ~ 0.90)
  pauliLimitViolationRatio: number;       // 包立順磁極限突破倍數 B_{c\parallel} / B_{Pauli}
  tripletSuperconductingGapMeV: number;   // 自旋三重態莫爾超導配對能隙 \Delta_{MATTG} (meV)
  quantumGeometricStiffnessK: number;     // 量子度規幾何超流剛度 D_s / k_B (K)
  activeRegime: TwistedTrilayerGrapheneRegime;
  pulsePhase: number;
  moireNodes: TrilayerMoirePairingNode[];
}

const STORAGE_KEY = 'newworld_twisted_trilayer_graphene_sc_state_v1';
const MAGIC_ANGLE_TRILAYER = 1.56;

export class TwistedTrilayerGrapheneTripletScEngine {
  private state: TwistedTrilayerGrapheneState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): TwistedTrilayerGrapheneState {
    const defaults: TwistedTrilayerGrapheneState = {
      alternatingTwistAngleDeg: 1.56,
      inPlaneMagneticFieldTesla: 6.8,
      displacementFieldDzVnm: 0.42,
      pauliLimitViolationRatio: 3.68,
      tripletSuperconductingGapMeV: 0.86,
      quantumGeometricStiffnessK: 3.45,
      activeRegime: 'pauli-limit-violating-spin-triplet-phase',
      pulsePhase: 0,
      moireNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Twisted Trilayer Graphene SC state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Twisted Trilayer Graphene SC state:', e);
      }
    }
  }

  public getState(): Readonly<TwistedTrilayerGrapheneState> {
    return this.state;
  }

  public setAlternatingTwistAngle(angleDeg: number): void {
    this.state.alternatingTwistAngleDeg = Math.max(1.30, Math.min(1.80, parseFloat(angleDeg.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setInPlaneMagneticField(bPara: number): void {
    this.state.inPlaneMagneticFieldTesla = Math.max(0.0, Math.min(12.0, parseFloat(bPara.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setDisplacementFieldDz(dz: number): void {
    this.state.displacementFieldDzVnm = Math.max(0.00, Math.min(0.90, parseFloat(dz.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: TwistedTrilayerGrapheneRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'zero-displacement-decoupled-flatband-dirac':
        this.state.alternatingTwistAngleDeg = 1.56;
        this.state.displacementFieldDzVnm = 0.00;
        this.state.inPlaneMagneticFieldTesla = 0.5;
        break;
      case 'optimal-dz-hybridized-ultra-strong-coupling':
        this.state.alternatingTwistAngleDeg = 1.56;
        this.state.displacementFieldDzVnm = 0.44;
        this.state.inPlaneMagneticFieldTesla = 2.0;
        break;
      case 'pauli-limit-violating-spin-triplet-phase':
        this.state.alternatingTwistAngleDeg = 1.56;
        this.state.displacementFieldDzVnm = 0.42;
        this.state.inPlaneMagneticFieldTesla = 6.8;
        break;
      case 'high-inplane-field-reentrant-nonunitary-sc':
        this.state.alternatingTwistAngleDeg = 1.55;
        this.state.displacementFieldDzVnm = 0.52;
        this.state.inPlaneMagneticFieldTesla = 9.6;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const theta = this.state.alternatingTwistAngleDeg;
    const bPara = this.state.inPlaneMagneticFieldTesla;
    const dz = this.state.displacementFieldDzVnm;

    // 魔角 \theta_{MATTG} \approx 1.56^\circ 洛倫茲平帶共振與最佳垂直電場 D_z \approx 0.44 V/nm 雜化穹頂
    const magicResonance = Math.exp(-Math.pow((theta - MAGIC_ANGLE_TRILAYER) / 0.11, 2));
    const dzHybridization = 0.55 + 0.52 * Math.exp(-Math.pow((dz - 0.44) / 0.24, 2));

    // 低場區與高場重入非么正自旋三重態雙穹頂包絡
    const lowFieldDome = Math.exp(-Math.pow(bPara / 7.2, 2));
    const highFieldReentrant = 0.68 * Math.exp(-Math.pow((bPara - 9.2) / 2.1, 2));
    const fieldEnvelope = Math.max(0.15, Math.min(1.05, lowFieldDome + highFieldReentrant));

    // 自旋三重態超導能隙 \Delta_{MATTG} (meV)
    const gap = 0.96 * magicResonance * dzHybridization * fieldEnvelope;
    this.state.tripletSuperconductingGapMeV = parseFloat(Math.max(0.06, gap).toFixed(2));

    // 包立順磁極限突破倍數 B_{c\parallel} / B_{Pauli}
    const violation = (2.15 + 1.85 * magicResonance * dzHybridization) * (0.65 + 0.35 * Math.tanh(bPara / 4.5));
    this.state.pauliLimitViolationRatio = parseFloat(violation.toFixed(2));

    // 量子度規 (Fubini-Study Metric) 幾何超流剛度 D_s / k_B (K)
    const stiffness = 3.85 * magicResonance * dzHybridization * (0.45 + 0.55 * fieldEnvelope);
    this.state.quantumGeometricStiffnessK = parseFloat(Math.max(0.25, stiffness).toFixed(2));

    // 生成 16 個 A-tw-A 三層莫爾超晶格 AA 堆疊中心與狄拉克-平帶雜化節點
    const nodes: TrilayerMoirePairingNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const parity: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const sz: 1 | 0 | -1 = bPara > 7.5 ? 1 : (i % 3 === 0 ? 1 : i % 3 === 1 ? 0 : -1);
      const ring = i < 6 ? 0 : 1;
      const idx = ring === 0 ? i : i - 6;
      const total = ring === 0 ? 6 : 10;
      const angle = (idx / total) * 2.0 * Math.PI + this.state.pulsePhase * (parity === 1 ? 0.32 : -0.45);
      const r = ring === 0 ? 48 : 88;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        mirrorParityMz: parity,
        tripletSpinProjectionSz: sz,
        localSuperfluidWeight: parseFloat((this.state.quantumGeometricStiffnessK * (0.8 + 0.2 * Math.cos(angle * 3))).toFixed(2)),
        diracFlatbandHybridization: parseFloat(Math.min(1.0, dz * 1.45).toFixed(2))
      });
    }
    this.state.moireNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.76 + (this.state.quantumGeometricStiffnessK / 4.0) * 0.78;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerTrilayerGrapheneSound(): void {
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
      const oscFlat = this.audioCtx.createOscillator();
      const oscDirac = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscFlat.type = 'sine';
      oscDirac.type = 'triangle';

      // \sqrt{2} 交替三層魔角比 (\approx 1.414) 對應平帶模與狄拉克錐模之增四度諧音
      const fFlat = 310 + this.state.tripletSuperconductingGapMeV * 180;
      const fDirac = fFlat * Math.SQRT2;

      oscFlat.frequency.setValueAtTime(fFlat, t);
      oscDirac.frequency.setValueAtTime(fDirac, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscFlat.connect(gain);
      oscDirac.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscFlat.start(t);
      oscDirac.start(t);
      oscFlat.stop(t + 0.57);
      oscDirac.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in TwistedTrilayerGrapheneTripletScEngine:', e);
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

export const twistedTrilayerGrapheneTripletScEngine = new TwistedTrilayerGrapheneTripletScEngine();
