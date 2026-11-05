/**
 * 非阿貝爾任意子量子霍爾干涉熱電二極體與手性馬約拉納熱流閥引擎
 * (Non-Abelian Anyon Quantum-Hall Fabry-Pérot Interferometer & Chiral Majorana Thermal Diode Engine)
 *
 * 物理原理：
 * 1. 在填充因子 \nu = 5/2 之非阿貝爾分數量子霍爾態（Moore-Read Pfaffian / anti-Pfaffian / PH-Pfaffian 態）中，
 *    手性邊界同時承載分數電荷 e^* = e/4 的伊辛非阿貝爾任意子 (Ising Anyon \sigma，滿足融合規則 \sigma \times \sigma = I + \psi)
 *    與半整數中心荷 c_- = 5/2 之手性馬約拉納中性邊界模。
 * 2. 在雙量子點接觸 (QPC_1, QPC_2) 構成之法布里-珀羅干涉儀中，當內部島嶼釘扎 N_\sigma 個局域 e/4 任意子時，
 *    展現非阿貝爾「奇偶效應」(Non-Abelian Even-Odd Effect)：
 *    - 當 N_\sigma 為奇數時，繞行任意子因與內部馬約拉納融合通道糾纏，e/4 週期阿哈羅諾夫-玻姆干涉完全熄滅 (Vis_{e/4} \to 0)；
 *    - 當 N_\sigma 為偶數時，e/4 干涉恢復並伴隨 \Delta\theta = N_\sigma (\pi/4) 的非阿貝爾編織相移。
 * 3. 手性熱霍爾電導嚴格量子化於半整數平台 \kappa_{xy} = (5/2) \kappa_0 = (5/2) (\pi^2 k_B^2 T / 3h)，
 *    且透過非對稱 QPC 窄縮的馬約拉納-玻色模式耦合，實現高整流效率之「手性馬約拉納熱流二極體」(Chiral Thermal Diode)。
 */

export type NonAbelianThermalDiodeRegime =
  | 'pfaffian-even-anyon-ab-interference'
  | 'non-abelian-odd-anyon-braiding-extinction'
  | 'half-integer-thermal-hall-kappa-five-halves'
  | 'chiral-majorana-thermal-rectifier-valve';

export interface AnyonQpcBraidingNode {
  id: number;
  x: number;
  y: number;
  fusionChannel: 'vacuum-I' | 'majorana-psi' | 'ising-sigma';
  fractionalChargeE4Phase: number;
  chiralHeatFluxPw: number;
}

export interface NonAbelianAnyonThermalDiodeState {
  localizedAnyonCountNsigma: number;      // 干涉腔內釘扎 e/4 伊辛非阿貝爾任意子數 N_\sigma (0 ~ 8)
  thermalGradientRatioDeltaT: number;     // 跨 QPC 溫差偏壓比 \Delta T / T_0 (0.10 ~ 2.50)
  halfIntegerThermalHallK0: number;       // 半整數手性熱霍爾電導 \kappa_{xy} / \kappa_0 (Pfaffian = 2.50)
  e4InterferenceVisibility: number;       // 非阿貝爾奇偶調制 e/4 干涉可見度 Vis_{e/4} (0.000 ~ 1.000)
  nonAbelianBraidingPhasePi: number;      // 非阿貝爾編織統計相移 \Delta\theta / \pi
  thermalDiodeRectificationPct: number;   // 手性馬約拉納熱二極體整流效率 \eta_{thermal} (%)
  activeRegime: NonAbelianThermalDiodeRegime;
  pulsePhase: number;
  braidingNodes: AnyonQpcBraidingNode[];
}

const STORAGE_KEY = 'newworld_non_abelian_anyon_thermal_diode_state_v1';

export class NonAbelianAnyonThermalDiodeEngine {
  private state: NonAbelianAnyonThermalDiodeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): NonAbelianAnyonThermalDiodeState {
    const defaults: NonAbelianAnyonThermalDiodeState = {
      localizedAnyonCountNsigma: 2,
      thermalGradientRatioDeltaT: 1.15,
      halfIntegerThermalHallK0: 2.50,
      e4InterferenceVisibility: 0.864,
      nonAbelianBraidingPhasePi: 0.50,
      thermalDiodeRectificationPct: 79.4,
      activeRegime: 'pfaffian-even-anyon-ab-interference',
      pulsePhase: 0,
      braidingNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Non-Abelian Anyon Thermal Diode state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Non-Abelian Anyon Thermal Diode state:', e);
      }
    }
  }

  public getState(): Readonly<NonAbelianAnyonThermalDiodeState> {
    return this.state;
  }

  public setLocalizedAnyonCount(nSigma: number): void {
    this.state.localizedAnyonCountNsigma = Math.max(0, Math.min(8, Math.round(nSigma)));
    this.recomputePhysics();
    this.saveState();
  }

  public setThermalGradientRatio(dtRatio: number): void {
    this.state.thermalGradientRatioDeltaT = Math.max(0.10, Math.min(2.50, parseFloat(dtRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: NonAbelianThermalDiodeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'pfaffian-even-anyon-ab-interference':
        this.state.localizedAnyonCountNsigma = 2;
        this.state.thermalGradientRatioDeltaT = 0.75;
        break;
      case 'non-abelian-odd-anyon-braiding-extinction':
        this.state.localizedAnyonCountNsigma = 3;
        this.state.thermalGradientRatioDeltaT = 0.85;
        break;
      case 'half-integer-thermal-hall-kappa-five-halves':
        this.state.localizedAnyonCountNsigma = 4;
        this.state.thermalGradientRatioDeltaT = 1.25;
        break;
      case 'chiral-majorana-thermal-rectifier-valve':
        this.state.localizedAnyonCountNsigma = 6;
        this.state.thermalGradientRatioDeltaT = 2.15;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const nSigma = this.state.localizedAnyonCountNsigma;
    const dtRatio = this.state.thermalGradientRatioDeltaT;
    const isEven = nSigma % 2 === 0;

    // \nu = 5/2 PH-Pfaffian / Moore-Read 半整數熱霍爾電導 \kappa_{xy} / \kappa_0 = 2.50
    const thermalPlateau = 2.50 - 0.02 * Math.max(0, dtRatio - 1.8);
    this.state.halfIntegerThermalHallK0 = parseFloat(thermalPlateau.toFixed(2));

    // 非阿貝爾奇偶效應：偶數 N_\sigma 時 e/4 干涉清晰，奇數 N_\sigma 時因融合通道正交性熄滅 (僅殘留高階 e/2 微弱背景)
    const thermalDamping = Math.exp(-0.18 * dtRatio);
    const vis = isEven ? 0.96 * thermalDamping : 0.045 * thermalDamping;
    this.state.e4InterferenceVisibility = parseFloat(vis.toFixed(3));

    // 非阿貝爾編織統計相移 \Delta\theta / \pi = N_\sigma * 0.25
    this.state.nonAbelianBraidingPhasePi = parseFloat((nSigma * 0.25).toFixed(2));

    // 手性馬約拉納熱流二極體整流效率 \eta_{thermal} (%)
    const rectBase = 48.0 + 36.0 * Math.tanh(dtRatio * 0.95) + (isEven ? 6.5 : 11.2);
    this.state.thermalDiodeRectificationPct = parseFloat(Math.min(96.8, rectBase).toFixed(1));

    // 生成 16 個法布里-珀羅雙 QPC 邊界與內部伊辛任意子編織節點
    const nodes: AnyonQpcBraidingNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const channel: 'vacuum-I' | 'majorana-psi' | 'ising-sigma' =
        i < nSigma ? 'ising-sigma' : i % 2 === 0 ? 'vacuum-I' : 'majorana-psi';

      let x = 165;
      let y = 160;
      if (i < nSigma) {
        // 干涉腔內部被釘扎的局域 e/4 伊辛任意子 \sigma
        const angle = (i / Math.max(1, nSigma)) * 2.0 * Math.PI + this.state.pulsePhase * 0.15;
        const r = nSigma === 1 ? 0 : 32;
        x = 165 + r * Math.cos(angle);
        y = 160 + r * Math.sin(angle);
      } else {
        // 沿法布里-珀羅干涉環繞行的手性邊界準粒子與中性馬約拉納模
        const edgeIdx = i - nSigma;
        const totalEdge = count - nSigma;
        const angle = (edgeIdx / totalEdge) * 2.0 * Math.PI + this.state.pulsePhase * 0.42;
        x = 165 + 88 * Math.cos(angle);
        y = 160 + 68 * Math.sin(angle);
      }

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        fusionChannel: channel,
        fractionalChargeE4Phase: parseFloat(((i * 0.25 + this.state.nonAbelianBraidingPhasePi) % 2.0).toFixed(2)),
        chiralHeatFluxPw: parseFloat((this.state.halfIntegerThermalHallK0 * dtRatio * 1.45).toFixed(2))
      });
    }
    this.state.braidingNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.78 + (this.state.thermalDiodeRectificationPct / 100.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAnyonBraidingSound(): void {
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
      const oscCharge = this.audioCtx.createOscillator();
      const oscMajorana = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscCharge.type = 'sine';
      oscMajorana.type = 'triangle';

      // 偶數 N_\sigma 時呈現和諧四分之一音程干涉，奇數 N_\sigma 時呈現正交融合通道消光音
      const isEven = this.state.localizedAnyonCountNsigma % 2 === 0;
      const fBase = 320 + this.state.localizedAnyonCountNsigma * 28;
      const ratio = isEven ? 1.25 : 1.414; // \sqrt{2} 伊辛任意子量子維度 d_\sigma = \sqrt{2}

      oscCharge.frequency.setValueAtTime(fBase, t);
      oscMajorana.frequency.setValueAtTime(fBase * ratio, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      oscCharge.connect(gain);
      oscMajorana.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscCharge.start(t);
      oscMajorana.start(t);
      oscCharge.stop(t + 0.56);
      oscMajorana.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in NonAbelianAnyonThermalDiodeEngine:', e);
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

export const nonAbelianAnyonThermalDiodeEngine = new NonAbelianAnyonThermalDiodeEngine();
