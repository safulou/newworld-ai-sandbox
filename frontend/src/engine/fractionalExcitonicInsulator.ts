/**
 * 分數激子絕緣體與時間反演對稱雙層分數陳態引擎
 * (Fractional Excitonic Insulator & Time-Reversal-Symmetric Bilayer Fractional Chern State Engine)
 *
 * 物理原理：
 * 1. 在零外加磁場之庫侖耦合莫爾雙層拓撲異質結（如轉角雙層 MoTe₂/WSe₂ 或雙閘極石墨烯-TMD 異質結）中，
 *    當上下兩層具有相反手性之拓撲平帶（陳數 C_top = +1, C_bot = -1）且處於分數填充
 *    (ν_e = 1/m, ν_h = 1/m，例如 m = 3 即 ν = 1/3 Laughlin 分數態) 時，
 *    層間庫侖吸引使分數化準粒子 (e* = e/3) 與準電洞 (h* = -e/3) 配對形成「分數激子絕緣體」(Fractional Excitonic Insulator, FEI)。
 * 2. 系統在保持整體時間反演對稱 (C_tot = 0) 的同時，湧現出電荷中性之複合費米子 (Composite Fermion, CF) 激子玻色凝聚，
 *    在反向對流輸運 (Counterflow Transport) 中呈現完美分數量子化霍爾拖曳電阻 R_{xy}^{drag} = m (h/e^2) = 3 h/e^2，
 *    並伴隨高階分數磁旋子 (Fractional Magnetoroton) 集體激發極小值。
 */

export type FractionalExcitonicRegime =
  | 'decoupled-bilayer-fractional-chern-liquid'
  | 'fractional-excitonic-insulator-nu-one-third'
  | 'composite-fermion-counterflow-superfluid'
  | 'fractional-magnetoroton-crystallization';

export interface FractionalExcitonDipoleNode {
  id: number;
  x: number;
  y: number;
  fractionalChargeDenominatorM: 3 | 5;
  topLayerLaughlinPhaseRad: number;
  interlayerBindingAmplitude: number;
  counterflowCurrentDensity: number;
}

export interface FractionalExcitonicInsulatorState {
  interlayerCoulombRatioUd: number;       // 層間庫侖耦合與平帶寬度比 U_inter / W_band (0.20 ~ 4.50)
  displacementFieldMvNm: number;          // 垂直位移電場失諧 D_z (mV/nm, 0.0 ~ 120.0)
  fractionalDenominatorM: 3 | 5;          // 分數填充母數 m (ν = 1/m, m = 3 或 5)
  excitonicInsulatorGapMeV: number;       // 分數激子絕緣體配對能隙 Δ_FEI (meV)
  counterflowHallDragHPerE2: number;      // 反向對流霍爾拖曳量子化比 R_{xy}^{drag} / (h/e^2)
  cfSuperfluidStiffnessKelvin: number;    // 複合費米子激子超流剛度 ρ_{s,CF} (K)
  magnetorotonMinEnergyMeV: number;       // 分數磁旋子集體模極小能隙 Δ_{roton} (meV)
  activeRegime: FractionalExcitonicRegime;
  pulsePhase: number;
  excitonNodes: FractionalExcitonDipoleNode[];
}

const STORAGE_KEY = 'newworld_fractional_excitonic_insulator_state_v1';

export class FractionalExcitonicInsulatorEngine {
  private state: FractionalExcitonicInsulatorState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): FractionalExcitonicInsulatorState {
    const defaults: FractionalExcitonicInsulatorState = {
      interlayerCoulombRatioUd: 2.40,
      displacementFieldMvNm: 18.0,
      fractionalDenominatorM: 3,
      excitonicInsulatorGapMeV: 6.84,
      counterflowHallDragHPerE2: 3.00,
      cfSuperfluidStiffnessKelvin: 14.6,
      magnetorotonMinEnergyMeV: 2.15,
      activeRegime: 'fractional-excitonic-insulator-nu-one-third',
      pulsePhase: 0,
      excitonNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Fractional Excitonic Insulator state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Fractional Excitonic Insulator state:', e);
      }
    }
  }

  public getState(): Readonly<FractionalExcitonicInsulatorState> {
    return this.state;
  }

  public setInterlayerCoulombRatio(uRatio: number): void {
    this.state.interlayerCoulombRatioUd = Math.max(0.20, Math.min(4.50, parseFloat(uRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setDisplacementField(dField: number): void {
    this.state.displacementFieldMvNm = Math.max(0.0, Math.min(120.0, parseFloat(dField.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setFractionalDenominator(m: 3 | 5): void {
    this.state.fractionalDenominatorM = m === 5 ? 5 : 3;
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FractionalExcitonicRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'decoupled-bilayer-fractional-chern-liquid':
        this.state.interlayerCoulombRatioUd = 0.45;
        this.state.displacementFieldMvNm = 85.0;
        this.state.fractionalDenominatorM = 3;
        break;
      case 'fractional-excitonic-insulator-nu-one-third':
        this.state.interlayerCoulombRatioUd = 2.40;
        this.state.displacementFieldMvNm = 18.0;
        this.state.fractionalDenominatorM = 3;
        break;
      case 'composite-fermion-counterflow-superfluid':
        this.state.interlayerCoulombRatioUd = 3.15;
        this.state.displacementFieldMvNm = 6.0;
        this.state.fractionalDenominatorM = 3;
        break;
      case 'fractional-magnetoroton-crystallization':
        this.state.interlayerCoulombRatioUd = 4.10;
        this.state.displacementFieldMvNm = 12.0;
        this.state.fractionalDenominatorM = 5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const u = this.state.interlayerCoulombRatioUd;
    const dz = this.state.displacementFieldMvNm;
    const m = this.state.fractionalDenominatorM;

    // 電場失諧抑制因子：過大垂直電場會破壞層間共振配對
    const fieldSuppression = Math.exp(-Math.pow(dz / 68.0, 2));
    // 層間庫侖配對鐘形曲線與分數電荷壓縮因子 1/m
    const uActivation = 1.0 / (1.0 + Math.exp(-(u - 1.05) / 0.35));
    const gap = (24.5 / m) * uActivation * fieldSuppression * (0.65 + 0.25 * u);
    this.state.excitonicInsulatorGapMeV = parseFloat(Math.max(0.08, gap).toFixed(2));

    // 反向對流霍爾拖曳電阻 R_{xy}^{drag} / (h/e^2) 趨近量子化值 m
    const dragQuantization = m * uActivation * (0.25 + 0.75 * fieldSuppression);
    this.state.counterflowHallDragHPerE2 = parseFloat(dragQuantization.toFixed(2));

    // 複合費米子激子超流剛度 ρ_{s,CF} (K)
    const stiffness = (42.0 / m) * uActivation * fieldSuppression * Math.exp(-Math.pow(u - 2.85, 2) / 3.8);
    this.state.cfSuperfluidStiffnessKelvin = parseFloat(Math.max(0.15, stiffness).toFixed(2));

    // 分數磁旋子 (Magnetoroton) 極小值能隙 Δ_{roton} (meV)：在強耦合結晶區軟化
    const rotonSoftening = Math.max(0.12, 1.0 - 0.78 * Math.exp(-Math.pow(u - 4.1, 2) / 0.65));
    const rotonGap = Math.max(0.10, this.state.excitonicInsulatorGapMeV * 0.42 * rotonSoftening);
    this.state.magnetorotonMinEnergyMeV = parseFloat(rotonGap.toFixed(2));

    // 生成 16 個雙層分數準粒子-準電洞激子偶極渦旋節點
    const nodes: FractionalExcitonDipoleNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const ring = i < 6 ? 0 : 1;
      const idxInRing = ring === 0 ? i : i - 6;
      const totalInRing = ring === 0 ? 6 : 10;
      const angle = (idxInRing / totalInRing) * 2.0 * Math.PI + this.state.pulsePhase * (ring === 0 ? 0.35 : -0.24);
      const radius = ring === 0 ? 44 : 88;

      const x = 165 + radius * Math.cos(angle);
      const y = 160 + radius * Math.sin(angle);
      const binding = Math.min(1.0, uActivation * fieldSuppression * (0.78 + 0.22 * Math.cos(angle * m)));

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        fractionalChargeDenominatorM: m,
        topLayerLaughlinPhaseRad: parseFloat(((angle * m) % (2 * Math.PI)).toFixed(2)),
        interlayerBindingAmplitude: parseFloat(binding.toFixed(2)),
        counterflowCurrentDensity: parseFloat((this.state.cfSuperfluidStiffnessKelvin * 0.18 * binding).toFixed(2))
      });
    }
    this.state.excitonNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.75 + (this.state.cfSuperfluidStiffnessKelvin / 20.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerFractionalExcitonSound(): void {
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
      const oscTop = this.audioCtx.createOscillator();
      const oscBot = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscTop.type = 'sine';
      oscBot.type = 'triangle';

      // 分數電荷 e* = e/m 對應之分數諧波比 (m=3 或 m=5)
      const baseFreq = 300 + this.state.excitonicInsulatorGapMeV * 28;
      const mRatio = 1.0 + 1.0 / this.state.fractionalDenominatorM;

      oscTop.frequency.setValueAtTime(baseFreq, t);
      oscTop.frequency.exponentialRampToValueAtTime(baseFreq * mRatio, t + 0.36);

      oscBot.frequency.setValueAtTime(baseFreq * mRatio, t);
      oscBot.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.36);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      oscTop.connect(gain);
      oscBot.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscTop.start(t);
      oscBot.start(t);
      oscTop.stop(t + 0.54);
      oscBot.stop(t + 0.54);
    } catch (e) {
      console.warn('Web Audio playback failed in FractionalExcitonicInsulatorEngine:', e);
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

export const fractionalExcitonicInsulatorEngine = new FractionalExcitonicInsulatorEngine();
