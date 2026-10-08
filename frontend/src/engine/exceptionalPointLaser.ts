/**
 * 非厄米拓撲奇異點雷射放大器 (Exceptional Point Laser & PT-Symmetric Topological Sensor)
 * 
 * 理論基礎：
 * 1. 開放量子系統與非厄米物理 (Non-Hermitian Physics & PT-Symmetry, Bender & Boettcher 1998, El-Ganainy et al. 2018)
 *    哈密頓量滿足 [H, PT] = 0，在增益與損耗平衡條件下具有全實數光譜。
 * 2. 奇異點 (Exceptional Point, EP, Heiss 2012, Miri & Alù 2019):
 *    非厄米系統中本徵值與本徵態向量同時凝聚簡併之拓撲奇點 (Jordan Block 結構)。
 * 3. 拓撲分數階靈敏度增益 (Sublinear Perturbation Splitting, Hodaei et al. 2017, Chen et al. 2017):
 *    在 N 階奇異點 (EP_N) 處，能量劈裂 Δλ ∝ ε^(1/N) (相較於厄米系統線性 ε)，產生超高靈敏度。
 * 4. 4 大非厄米拓撲放大體制：
 *    - pt_symmetric_balanced_gain_loss: 宇稱-時間對稱平衡增益-損耗態
 *    - higher_order_ep3_sensor: 三階奇異點立方根拓撲超靈敏傳感
 *    - topological_chiral_mode_transfer: 圍繞奇異點絕熱環繞手性模式轉換
 *    - unidirectional_invisibility_laser: 單向隱形無反射非對稱拓撲激光
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成非厄米奇異點純單模激光共振音、PT 破缺相變嘶鳴音、立方根放大嗶嗶聲
 * - HTML5 Canvas 2D 呈現黎曼曲面分支切口 (Riemann Sheet Branch Cut)、複本徵值軌跡 (Re-Im λ) 與增益損耗微腔耦合陣列光束
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type EPRegime = 
  | 'pt_symmetric_balanced_gain_loss' 
  | 'higher_order_ep3_sensor' 
  | 'topological_chiral_mode_transfer' 
  | 'unidirectional_invisibility_laser';

export interface EPSensingTelemetry {
  id: string;
  perturbationMicro: number; // 微擾強度 ε (10^-6)
  eigenvalueSplittingGhz: number; // 分數階劈裂 Δλ (GHz)
  enhancementFactor: number; // 增強倍數 (相比厄米系統)
  phaseAngleRad: number;
  timestamp: number;
}

export interface ExceptionalPointState {
  regime: EPRegime;
  gainLossParameterGhz: number; // 增益/損耗率 γ (0.1 ~ 10.0 GHz)
  couplingStrengthGhz: number; // 微腔間耦合強度 κ (0.1 ~ 10.0 GHz)
  orderOfEP: number; // EP 階數 (2 或 3)
  eigenvalueRealGhz: number; // 本徵值實部 Re(λ)
  eigenvalueImagGhz: number; // 本徵值虛部 Im(λ)
  sensitivityEnhancementRatio: number; // 靈敏度增強倍率
  laserSlopeEfficiencyPercent: number; // 激光斜率效率 (0 ~ 100%)
  autoEPStabilization: boolean;
  totalLasingPulses: number;
  sensingHistory: EPSensingTelemetry[];
}

const STORAGE_KEY = 'newworld_exceptional_point_laser';

class ExceptionalPointEngine {
  private state: ExceptionalPointState = {
    regime: 'higher_order_ep3_sensor',
    gainLossParameterGhz: 2.5,
    couplingStrengthGhz: 2.5, // γ = κ 時恰好落在奇異點 EP
    orderOfEP: 3,
    eigenvalueRealGhz: 194.2,
    eigenvalueImagGhz: 0.0,
    sensitivityEnhancementRatio: 48.6,
    laserSlopeEfficiencyPercent: 94.2,
    autoEPStabilization: true,
    totalLasingPulses: 64,
    sensingHistory: []
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeEPPhysics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): ExceptionalPointState {
    return { ...this.state, sensingHistory: [...this.state.sensingHistory] };
  }

  public setRegime(regime: EPRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'pt_symmetric_balanced_gain_loss':
        this.state.orderOfEP = 2;
        this.state.gainLossParameterGhz = 1.8;
        this.state.couplingStrengthGhz = 2.5; // PT 未破缺相 (γ < κ)
        break;
      case 'higher_order_ep3_sensor':
        this.state.orderOfEP = 3;
        this.state.gainLossParameterGhz = 3.0;
        this.state.couplingStrengthGhz = 3.0; // 嚴格 EP3
        break;
      case 'topological_chiral_mode_transfer':
        this.state.orderOfEP = 2;
        this.state.gainLossParameterGhz = 3.5;
        this.state.couplingStrengthGhz = 2.2;
        break;
      case 'unidirectional_invisibility_laser':
        this.state.orderOfEP = 2;
        this.state.gainLossParameterGhz = 4.2;
        this.state.couplingStrengthGhz = 4.2; // 單向無反射閾值
        break;
    }
    this.recomputeEPPhysics();
    this.playEPLasingTone();
    this.saveState();
  }

  public setGainLoss(valGhz: number): void {
    this.state.gainLossParameterGhz = Math.max(0.1, Math.min(10.0, parseFloat(valGhz.toFixed(2))));
    this.recomputeEPPhysics();
    this.saveState();
  }

  public setCoupling(valGhz: number): void {
    this.state.couplingStrengthGhz = Math.max(0.1, Math.min(10.0, parseFloat(valGhz.toFixed(2))));
    this.recomputeEPPhysics();
    this.saveState();
  }

  public toggleAutoStabilization(): void {
    this.state.autoEPStabilization = !this.state.autoEPStabilization;
    this.saveState();
  }

  public injectSensingPerturbation(): void {
    const eps = parseFloat((1.0 + Math.random() * 8.0).toFixed(2)); // 1 ~ 9 μ-perturbation
    // EP 分數階劈裂 Δλ = κ * (eps / 100)^(1 / N)
    const normalizedEps = eps * 0.001;
    const splitting = this.state.couplingStrengthGhz * Math.pow(normalizedEps, 1.0 / this.state.orderOfEP);
    const enhancement = (splitting / (this.state.couplingStrengthGhz * normalizedEps));

    const item: EPSensingTelemetry = {
      id: 'ep-' + Date.now().toString(36),
      perturbationMicro: eps,
      eigenvalueSplittingGhz: parseFloat((splitting * 10).toFixed(3)),
      enhancementFactor: parseFloat(Math.min(120.0, enhancement).toFixed(1)),
      phaseAngleRad: parseFloat((Math.PI * (0.2 + Math.random() * 0.6)).toFixed(2)),
      timestamp: Date.now()
    };
    this.state.sensingHistory.unshift(item);
    if (this.state.sensingHistory.length > 20) {
      this.state.sensingHistory.pop();
    }
    this.state.totalLasingPulses += 1;
    this.playSensingBurst();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoEPStabilization) {
      // 微小擾動鎖定奇異點附近
      const drift = Math.sin(Date.now() / 2600) * 0.02;
      this.state.couplingStrengthGhz = parseFloat((this.state.gainLossParameterGhz + drift).toFixed(2));
    }

    if (Math.random() < 0.2 * deltaSeconds) {
      this.injectSensingPerturbation();
    }
  }

  private recomputeEPPhysics(): void {
    const gamma = this.state.gainLossParameterGhz;
    const kappa = this.state.couplingStrengthGhz;
    const diff = kappa * kappa - gamma * gamma;

    if (diff >= 0) {
      // PT-對稱未破缺相 (實數劈裂)
      this.state.eigenvalueImagGhz = 0.0;
      this.state.eigenvalueRealGhz = parseFloat((194.2 + Math.sqrt(diff)).toFixed(2));
    } else {
      // PT-破缺相 (產生虛部放大/衰減)
      this.state.eigenvalueRealGhz = 194.2;
      this.state.eigenvalueImagGhz = parseFloat(Math.sqrt(-diff).toFixed(2));
    }

    // 奇異點接近程度 (距離 EP 越近，分數階增益越大)
    const proximity = Math.max(0.01, Math.abs(gamma - kappa));
    const power = this.state.orderOfEP === 3 ? 0.66 : 0.5;
    const factor = Math.min(99.9, 15.0 / Math.pow(proximity, power));
    this.state.sensitivityEnhancementRatio = parseFloat(factor.toFixed(1));

    // 斜率效率
    let efficiency = 88.0 + (this.state.couplingStrengthGhz / 10.0) * 11.0;
    this.state.laserSlopeEfficiencyPercent = parseFloat(Math.min(99.5, efficiency).toFixed(1));
  }

  // --- Web Audio 程序化合成 ---

  public playEPLasingTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 超窄線寬單模激光純音 (高頻正弦波)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6 超高音

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch { /* ignore */ }
  }

  public playSensingBurst(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 分數階放大調頻掃音
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 520;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.12);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch { /* ignore */ }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* ignore */ }
  }
}

export const exceptionalPointEngine = new ExceptionalPointEngine();
