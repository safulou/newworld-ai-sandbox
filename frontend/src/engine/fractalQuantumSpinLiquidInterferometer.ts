/**
 * 分數維度碎形量子自旋液體與任意子對偶全息干涉儀引擎
 * (Fractal-Dimensional Quantum Spin Liquid & Anyon Dual Holographic Interferometer Engine)
 *
 * 物理原理：
 * 1. 將 Kitaev 蜂巢自旋模型嵌入具有非整數豪斯多夫維度 (Hausdorff Dimension d_H ∈ [1.585, 2.0]) 的謝爾賓斯基-阿波羅尼奧斯
 *    雙曲碎形晶格 (Sierpiński-Apollonian Fractal Gasket) 中，自旋 S=1/2 算符分數化為巡遊馬約拉納費米子 c_i 與局域 Z_2 規範通量子 (Vison, W_p = ±1)。
 * 2. 在碎形內孔 (Fractal Lacunarity Holes) 上捕獲的 비阿貝爾伊辛任意子 (Ising Anyons σ, 量子維度 d_σ = √2)
 *    透過馬赫-曾德爾全息干涉儀 (Mach-Zehnder Anyon Interferometer) 進行世界線編織，產生拓撲統計相位 θ_anyon 與非平庸干涉條紋可見度 V_int。
 * 3. 系統的拓撲糾纏熵 (Topological Entanglement Entropy) 滿足 γ_TEE = ln D · (d_H / 2)，直接反映碎形幾何對長程量子糾纏的修正。
 */

export type FractalSpinLiquidRegime =
  | 'abelian-toric-code-phase'
  | 'sierpinski-kitaev-spin-liquid'
  | 'non-abelian-ising-anyon-braiding'
  | 'holographic-fractal-duality-resonance';

export interface FractalSpinSite {
  id: number;
  x: number;
  y: number;
  generation: number;
  visonFluxWp: number;
  majoranaDensity: number;
  anyonPhaseRad: number;
}

export interface FractalQuantumSpinLiquidState {
  hausdorffDimensionDh: number;       // 碎形豪斯多夫維度 d_H (1.58 ~ 2.00)
  kitaevExchangeJMeV: number;         // Kitaev 各向異性交換耦合 J_K (meV, 2.0 ~ 50.0)
  visonVortexCount: number;           // 碎形內孔捕獲之 Z_2 磁通子/任意子數 N_v (1 ~ 12)
  topologicalEntanglementGamma: number;// 拓撲糾纏熵 γ_TEE (k_B)
  anyonInterferenceVisibility: number;// 任意子馬赫-曾德爾干涉條紋可見度 V_int (0 ~ 1)
  spectralDimensionDs: number;        // 碎形譜維度 d_s
  activeRegime: FractalSpinLiquidRegime;
  pulsePhase: number;
  sites: FractalSpinSite[];
}

const STORAGE_KEY = 'newworld_fractal_qsl_interferometer_state_v1';

export class FractalQuantumSpinLiquidInterferometerEngine {
  private state: FractalQuantumSpinLiquidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): FractalQuantumSpinLiquidState {
    const defaults: FractalQuantumSpinLiquidState = {
      hausdorffDimensionDh: 1.585,
      kitaevExchangeJMeV: 22.0,
      visonVortexCount: 4,
      topologicalEntanglementGamma: 0.549,
      anyonInterferenceVisibility: 0.78,
      spectralDimensionDs: 1.365,
      activeRegime: 'sierpinski-kitaev-spin-liquid',
      pulsePhase: 0,
      sites: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Fractal QSL Interferometer state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Fractal QSL Interferometer state:', e);
      }
    }
  }

  public getState(): Readonly<FractalQuantumSpinLiquidState> {
    return this.state;
  }

  public setHausdorffDimension(dh: number): void {
    this.state.hausdorffDimensionDh = Math.max(1.26, Math.min(2.0, parseFloat(dh.toFixed(3))));
    this.recomputePhysics();
    this.saveState();
  }

  public setKitaevExchange(jk: number): void {
    this.state.kitaevExchangeJMeV = Math.max(2.0, Math.min(50.0, parseFloat(jk.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setVisonVortexCount(nv: number): void {
    this.state.visonVortexCount = Math.max(1, Math.min(12, Math.round(nv)));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FractalSpinLiquidRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'abelian-toric-code-phase':
        this.state.hausdorffDimensionDh = 1.95;
        this.state.kitaevExchangeJMeV = 10.0;
        this.state.visonVortexCount = 2;
        break;
      case 'sierpinski-kitaev-spin-liquid':
        this.state.hausdorffDimensionDh = 1.585;
        this.state.kitaevExchangeJMeV = 24.0;
        this.state.visonVortexCount = 4;
        break;
      case 'non-abelian-ising-anyon-braiding':
        this.state.hausdorffDimensionDh = 1.72;
        this.state.kitaevExchangeJMeV = 36.0;
        this.state.visonVortexCount = 7;
        break;
      case 'holographic-fractal-duality-resonance':
        this.state.hausdorffDimensionDh = 1.89;
        this.state.kitaevExchangeJMeV = 46.0;
        this.state.visonVortexCount = 10;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const dh = this.state.hausdorffDimensionDh;
    const jk = this.state.kitaevExchangeJMeV;
    const nv = this.state.visonVortexCount;

    // 碎形譜維度 d_s = 2 * d_H / (d_H + 0.74)
    const ds = (2.0 * dh) / (dh + 0.74);
    this.state.spectralDimensionDs = parseFloat(ds.toFixed(3));

    // 拓撲糾纏熵 γ_TEE = ln(D) * (d_H / 2) * (1 + 0.06 * N_v)
    const totalQuantumDimD = 2.0 + 0.414 * nv;
    const gammaTee = Math.log(totalQuantumDimD) * (dh / 2.0) * (0.6 + 0.4 * (jk / 50.0));
    this.state.topologicalEntanglementGamma = parseFloat(gammaTee.toFixed(3));

    // 馬赫-曾德爾任意子干涉可見度 V_int (非阿貝爾編織奇偶調制)
    const nonAbelianMod = Math.abs(Math.cos((nv * Math.PI) / 4.0)) * 0.65 + 0.32 * (jk / 50.0);
    this.state.anyonInterferenceVisibility = parseFloat(Math.min(0.99, Math.max(0.12, nonAbelianMod)).toFixed(2));

    // 生成謝爾賓斯基三階層 15 個碎形自旋格點 (3 大頂點 + 3 中點 + 9 次階層點)
    const topVertices = [
      { x: 160, y: 35 },
      { x: 55, y: 245 },
      { x: 265, y: 245 }
    ];

    const sites: FractalSpinSite[] = [];
    let id = 0;

    // 第一階層 (3 主頂點)
    for (let i = 0; i < 3; i++) {
      sites.push({
        id: id++,
        x: topVertices[i].x,
        y: topVertices[i].y,
        generation: 1,
        visonFluxWp: i < nv ? -1 : 1,
        majoranaDensity: parseFloat((0.75 + 0.2 * Math.sin(this.state.pulsePhase + i)).toFixed(2)),
        anyonPhaseRad: parseFloat(((this.state.pulsePhase + i * 1.2) % (2 * Math.PI)).toFixed(2))
      });
    }

    // 第二階層 (3 邊中點)
    const midVertices = [
      { x: (topVertices[0].x + topVertices[1].x) / 2, y: (topVertices[0].y + topVertices[1].y) / 2 },
      { x: (topVertices[1].x + topVertices[2].x) / 2, y: (topVertices[1].y + topVertices[2].y) / 2 },
      { x: (topVertices[2].x + topVertices[0].x) / 2, y: (topVertices[2].y + topVertices[0].y) / 2 }
    ];

    for (let i = 0; i < 3; i++) {
      sites.push({
        id: id++,
        x: parseFloat(midVertices[i].x.toFixed(1)),
        y: parseFloat(midVertices[i].y.toFixed(1)),
        generation: 2,
        visonFluxWp: (i + 3) < nv ? -1 : 1,
        majoranaDensity: parseFloat((0.65 + 0.25 * Math.cos(this.state.pulsePhase * 1.3 + i)).toFixed(2)),
        anyonPhaseRad: parseFloat(((this.state.pulsePhase * 1.3 + i * 2.1) % (2 * Math.PI)).toFixed(2))
      });
    }

    // 第三階層 (9 個子三角形內核格點)
    for (let tIdx = 0; tIdx < 3; tIdx++) {
      const anchor = topVertices[tIdx];
      for (let sub = 0; sub < 3; sub++) {
        const target = midVertices[(tIdx + sub) % 3];
        const ratio = 0.45 + 0.1 * (dh - 1.5);
        const sx = anchor.x * ratio + target.x * (1 - ratio);
        const sy = anchor.y * ratio + target.y * (1 - ratio);
        sites.push({
          id: id++,
          x: parseFloat(sx.toFixed(1)),
          y: parseFloat(sy.toFixed(1)),
          generation: 3,
          visonFluxWp: id <= nv ? -1 : 1,
          majoranaDensity: parseFloat((0.5 + 0.35 * Math.sin(this.state.pulsePhase * 1.7 + id)).toFixed(2)),
          anyonPhaseRad: parseFloat(((this.state.pulsePhase * 1.7 + id * 0.6) % (2 * Math.PI)).toFixed(2))
        });
      }
    }

    this.state.sites = sites;
  }

  public update(dtSeconds: number): void {
    const rate = 1.0 + (this.state.kitaevExchangeJMeV / 25.0);
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerFractalQslSound(): void {
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
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      const f1 = 360 * (this.state.hausdorffDimensionDh / 1.585);
      const f2 = f1 * 1.618; // 黃金比例碎形諧音

      osc1.frequency.setValueAtTime(f1, t);
      osc1.frequency.exponentialRampToValueAtTime(f1 * 1.25, t + 0.35);

      osc2.frequency.setValueAtTime(f2, t);
      osc2.frequency.exponentialRampToValueAtTime(f2 * 1.35, t + 0.35);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.17, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.57);
      osc2.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in FractalQuantumSpinLiquidInterferometerEngine:', e);
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

export const fractalQuantumSpinLiquidInterferometerEngine = new FractalQuantumSpinLiquidInterferometerEngine();
