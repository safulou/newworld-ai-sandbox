/**
 * 高階非阿貝爾分形時間晶體引擎 (Higher-Order Non-Abelian Fractal Time Crystal Engine)
 * 
 * 物理原理：
 * 1. 在豪斯多夫分形晶格（謝爾賓斯基三角形 Sierpinski Gasket，分形維數 d_f = ln 3 / ln 2 ≈ 1.585）中，
 *    各階分形角隅節點具備高階拓撲 (HOTI) 幾何邊界保護，形成局部化角隅零能模。
 * 2. 引入週期性 Floquet 脈衝序列驅動 U_F = exp(-i H₂ T₂) exp(-i H₁ T₁)，驅動非阿貝爾自旋哈密頓量；
 *    多體自旋相互作用自發破缺離散時間平移對稱性 (DTSB)，在角隅處湧現分數亞諧波 3T 或 4T 週期倍增結晶序。
 * 3. 分形自相似性 (Self-Similarity) 在多層階梯尺度上提供層級化多體局域化 (Hierarchical MBL)，
 *    阻絕高頻 Floquet 吸熱熱化融化，賦予時間晶體對無序擾動與非理想脈衝角度的高抗干擾剛性 (Rigidity)。
 * 4. 自旋關聯函數 C(t) = ⟨σ₀^z(t) σ₀^z(0)⟩ 展現清晰穩固的 3T 次諧波振盪，並在傅立葉頻譜 S(ω) 顯現尖銳的 ω/3 峰值。
 */

export type FractalTimeCrystalRegime = 
  | 'sierpinski-ground-state'
  | 'hoti-corner-locked'
  | 'subharmonic-period-3t'
  | 'self-similar-rigid-crystal';

export interface FractalTimeCrystalState {
  fractalDimension: number;          // 豪斯多夫分形維數 d_f (≈ 1.585)
  recursionGeneration: number;       // 分形遞迴階數 (1 ~ 4)
  drivePeriodMs: number;             // 驅動基底週期 T (ms, 50 ~ 500)
  subharmonicOrder: number;          // 亞諧波週期倍增階數 (3 或 4)
  hotiCornerModesCount: number;      // 活躍角隅拓撲模數量
  timeCrystalRigidity: number;       // 時間晶體剛性參數 (0.0 ~ 1.0)
  mblDisorderPotential: number;      // 多體局域化分形無序勢能 (meV, 0.5 ~ 10)
  activeRegime: FractalTimeCrystalRegime;
  pulsePhase: number;
  timeCorrelationHistory: number[]; // 自旋關聯函數 C(t) 採樣
  fourierPeaks: Array<{ freq: number; power: number }>; // 傅立葉光譜
}

const STORAGE_KEY = 'newworld_higher_order_fractal_time_crystal_state_v1';

export class HigherOrderFractalTimeCrystalEngine {
  private state: FractalTimeCrystalState;
  private audioCtx: AudioContext | null = null;
  private internalTick: number = 0;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): FractalTimeCrystalState {
    const defaults: FractalTimeCrystalState = {
      fractalDimension: 1.585,
      recursionGeneration: 3,
      drivePeriodMs: 200,
      subharmonicOrder: 3,
      hotiCornerModesCount: 3,
      timeCrystalRigidity: 0.94,
      mblDisorderPotential: 4.5,
      activeRegime: 'subharmonic-period-3t',
      pulsePhase: 0,
      timeCorrelationHistory: [],
      fourierPeaks: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Fractal Time Crystal state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Fractal Time Crystal state to localStorage:', e);
      }
    }
  }

  public getState(): FractalTimeCrystalState {
    return { ...this.state };
  }

  public setRecursionGeneration(gen: number): void {
    this.state.recursionGeneration = Math.max(1, Math.min(4, Math.round(gen)));
    this.recomputePhysics();
    this.saveState();
  }

  public setMblDisorder(disorder: number): void {
    this.state.mblDisorderPotential = Math.max(0.5, Math.min(10.0, disorder));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FractalTimeCrystalRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'sierpinski-ground-state':
        this.state.recursionGeneration = 2;
        this.state.mblDisorderPotential = 1.0;
        this.state.subharmonicOrder = 1;
        break;
      case 'hoti-corner-locked':
        this.state.recursionGeneration = 3;
        this.state.mblDisorderPotential = 3.0;
        this.state.subharmonicOrder = 2;
        break;
      case 'subharmonic-period-3t':
        this.state.recursionGeneration = 3;
        this.state.mblDisorderPotential = 5.5;
        this.state.subharmonicOrder = 3;
        break;
      case 'self-similar-rigid-crystal':
        this.state.recursionGeneration = 4;
        this.state.mblDisorderPotential = 8.0;
        this.state.subharmonicOrder = 3;
        break;
    }
    this.recomputePhysics();
    this.playRegimeTransitionTone(regime);
    this.saveState();
  }

  public triggerFractalPulse(): void {
    this.state.pulsePhase = 1.0;
    this.playCrystallinePingTone();
  }

  private recomputePhysics(): void {
    const { recursionGeneration: gen, mblDisorderPotential: W, activeRegime } = this.state;

    // 謝爾賓斯基三角形角隅節點數隨階數：3^gen
    this.state.fractalDimension = Math.log(3) / Math.log(2); // ≈ 1.58496
    this.state.hotiCornerModesCount = Math.pow(3, gen - 1);

    // 時間晶體剛性 (Rigidity)：強無序 MBL 與高階拓撲共同保護系統抵禦熱化
    const baseRigidity = 1.0 / (1.0 + Math.exp(-1.5 * (W - 2.0)));
    if (activeRegime === 'sierpinski-ground-state') {
      this.state.timeCrystalRigidity = 0.25;
      this.state.subharmonicOrder = 1;
    } else if (activeRegime === 'hoti-corner-locked') {
      this.state.timeCrystalRigidity = 0.65;
      this.state.subharmonicOrder = 2;
    } else if (activeRegime === 'subharmonic-period-3t') {
      this.state.timeCrystalRigidity = Math.max(0.91, Math.min(0.96, baseRigidity * 0.96));
      this.state.subharmonicOrder = 3;
    } else { // self-similar-rigid-crystal
      this.state.timeCrystalRigidity = 0.985;
      this.state.subharmonicOrder = 3;
    }

    // 傅立葉光譜峰值計算
    const order = this.state.subharmonicOrder;
    this.state.fourierPeaks = [
      { freq: 1.0 / order, power: this.state.timeCrystalRigidity * 0.92 },
      { freq: 1.0, power: (1.0 - this.state.timeCrystalRigidity) * 0.4 },
      { freq: 2.0 / order, power: this.state.timeCrystalRigidity * 0.3 }
    ];
  }

  public update(dt: number): void {
    this.internalTick += dt * 5.0;

    // 自旋關聯採樣：以 3T 為週期進行方波/餘弦調諧振盪
    const order = this.state.subharmonicOrder;
    const value = Math.cos(this.internalTick / order) * this.state.timeCrystalRigidity;
    if (!this.state.timeCorrelationHistory) this.state.timeCorrelationHistory = [];
    this.state.timeCorrelationHistory.push(value);
    if (this.state.timeCorrelationHistory.length > 50) {
      this.state.timeCorrelationHistory.shift();
    }

    if (this.state.pulsePhase > 0) {
      this.state.pulsePhase = Math.max(0, this.state.pulsePhase - dt * 1.5);
    }
  }

  // 純代碼 Web Audio 程序化合成音效
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private playRegimeTransitionTone(regime: FractalTimeCrystalRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      // 分形階層式音階 (110 -> 220 -> 330 -> 440 Hz)
      const tones: Record<FractalTimeCrystalRegime, number[]> = {
        'sierpinski-ground-state': [110, 220],
        'hoti-corner-locked': [165, 330, 495],
        'subharmonic-period-3t': [110, 220, 330], // 3T 複節奏
        'self-similar-rigid-crystal': [220, 330, 440, 660]
      };

      const selected = tones[regime] || [220];
      selected.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn('Fractal audio error:', e);
    }
  }

  private playCrystallinePingTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      // 角隅拓撲鎖定結晶清脆敲擊音 (880 -> 1760 Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('Ping tone error:', e);
    }
  }
}

export const higherOrderFractalTimeCrystalEngine = new HigherOrderFractalTimeCrystalEngine();
