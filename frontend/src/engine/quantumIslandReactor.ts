/**
 * AdS/BCFT 邊界量子島黑洞資訊恢復反應堆 (AdS/BCFT Quantum Island Black Hole Information Recovery Reactor)
 *
 * 核心物理理論：
 * 1. 霍金輻射悖論與佩吉曲線 (Hawking Radiation Paradox & Unitary Page Curve)：
 *    在半古典霍金輻射中，輻射細粒度馮諾伊曼熵隨時間單調遞增，破壞量子力學么正性；
 *    么正量子引力要求輻射熵在佩吉時間 t_Page 處發生轉折，並隨黑洞完全蒸發衰減至零。
 * 2. 量子極值面與島公式 (Quantum Extremal Surface & Island Formula)：
 *    在 AdS/BCFT 全息對偶與 2D JT 引力耦合非引力浴 (Bath CFT) 系統中，
 *    輻射浴 R 的廣義糾纏熵由黑洞內部的量子島 (Island I) 極值化給出：
 *    S_gen(R) = \min \text{ext}_I [ \frac{\text{Area}(\partial I)}{4 G_N} + S_{\text{matter}}(R \cup I) ]。
 * 3. 糾纏楔重建與 Petz 逆映射 (Entanglement Wedge Reconstruction & Petz Map)：
 *    在佩吉時間後，黑洞內部量子島納入輻射之糾纏楔 \mathcal{E}_W(R)；
 *    透過 Petz 逆映射全息算子，內部資訊完全由邊界輻射以高保真度 F \to 1 恢復。
 */

export type QuantumIslandRegime =
  | 'pre-page-hawking'            // 佩吉前霍金熱輻射單調增長相
  | 'qes-island-turnaround'       // 量子極值面湧現與佩吉轉折相
  | 'entanglement-wedge-recovery' // 糾纏楔重建黑洞內部資訊相
  | 'hayden-preskill-decoding';   // 希登-普雷斯基爾量子資訊全解碼相

export interface QuantumIslandState {
  evaporationTimeNormalized: number; // 蒸發時間進度 t / t_evap (0.0 ~ 1.0)
  adSCurvatureRadiusL: number;       // AdS 曲率半徑 L_AdS (1.0 ~ 20.0)
  bathCouplingConstantG: number;     // 浴耦合常數 g_bath (0.05 ~ 1.0)
  newtonConstantGN: number;          // 有效引力常數 G_N (0.01 ~ 0.50)
  regime: QuantumIslandRegime;
  // 動態演算物理指標
  hawkingEntropy: number;            // 霍金單調發散熵 S_Hawking (nat)
  islandGeneralizedEntropy: number;  // 量子島廣義糾纏熵 S_island (nat)
  pageEntropy: number;               // 實際糾纏熵 min(S_Hawking, S_island) (nat)
  isIslandFormed: boolean;           // 量子島是否已生成
  islandRadiusRatio: number;         // 量子島半徑佔視界比例 r_I / r_H (0.0 ~ 0.95)
  decodingFidelityPct: number;       // 內部資訊恢復保真度 F (%)
  qesAreaTerm: number;               // 幾何面積項 Area(dI)/(4G_N)
  matterEntanglementTerm: number;    // 物質糾纏項 S_matter(R U I)
  pageTimeNormalized: number;        // 佩吉時間轉折點 t_Page
  telemetryHistory: Array<{
    timestamp: number;
    evaporationTime: number;
    pageEntropy: number;
    fidelityPct: number;
  }>;
}

const STORAGE_KEY = 'newworld_quantum_island_state_v1';

class QuantumIslandReactorEngine {
  private state: QuantumIslandState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): QuantumIslandState {
    return {
      evaporationTimeNormalized: 0.55,
      adSCurvatureRadiusL: 10.0,
      bathCouplingConstantG: 0.45,
      newtonConstantGN: 0.08,
      regime: 'qes-island-turnaround',
      hawkingEntropy: 82.5,
      islandGeneralizedEntropy: 54.2,
      pageEntropy: 54.2,
      isIslandFormed: true,
      islandRadiusRatio: 0.72,
      decodingFidelityPct: 96.8,
      qesAreaTerm: 46.5,
      matterEntanglementTerm: 7.7,
      pageTimeNormalized: 0.48,
      telemetryHistory: []
    };
  }

  private loadState(): QuantumIslandState {
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

  public getState(): Readonly<QuantumIslandState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<QuantumIslandState,
    'evaporationTimeNormalized' | 'adSCurvatureRadiusL' | 'bathCouplingConstantG' | 'newtonConstantGN' | 'regime'
  >>): void {
    if (params.evaporationTimeNormalized !== undefined) {
      this.state.evaporationTimeNormalized = Math.max(0.0, Math.min(1.0, params.evaporationTimeNormalized));
    }
    if (params.adSCurvatureRadiusL !== undefined) {
      this.state.adSCurvatureRadiusL = Math.max(1.0, Math.min(20.0, params.adSCurvatureRadiusL));
    }
    if (params.bathCouplingConstantG !== undefined) {
      this.state.bathCouplingConstantG = Math.max(0.05, Math.min(1.0, params.bathCouplingConstantG));
    }
    if (params.newtonConstantGN !== undefined) {
      this.state.newtonConstantGN = Math.max(0.01, Math.min(0.50, params.newtonConstantGN));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public triggerPetzMapDecoding(): void {
    this.playIslandSound(432, 0.45, 'sine');
    this.state.decodingFidelityPct = Math.min(99.9, this.state.decodingFidelityPct + 2.5);
    this.recomputePhysics();
    this.saveState();
  }

  public advancePageEvaporation(step: number = 0.05): void {
    let nextTime = this.state.evaporationTimeNormalized + step;
    if (nextTime > 1.0) nextTime = 0.05;
    this.state.evaporationTimeNormalized = Number(nextTime.toFixed(3));
    this.playIslandSound(280, 0.25, 'triangle');
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 緩慢推進蒸發微小漣漪
    const slowRate = 0.003 * delta;
    if (this.state.regime === 'hayden-preskill-decoding') {
      this.state.evaporationTimeNormalized = (this.state.evaporationTimeNormalized + slowRate) % 1.0;
    }
    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        evaporationTime: Number(this.state.evaporationTimeNormalized.toFixed(3)),
        pageEntropy: Number(this.state.pageEntropy.toFixed(2)),
        fidelityPct: Number(this.state.decodingFidelityPct.toFixed(1))
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const t = this.state.evaporationTimeNormalized;
    const l = this.state.adSCurvatureRadiusL;
    const g = this.state.bathCouplingConstantG;
    const gn = this.state.newtonConstantGN;

    // 佩吉時間轉折點估算 t_Page \approx 0.48 / (1 + 0.2*g)
    const tPage = 0.50 / (1 + 0.15 * g);
    this.state.pageTimeNormalized = Number(tPage.toFixed(3));

    // 初始黑洞 Bekenstein-Hawking 熵 S_BH0
    const sBh0 = (12.0 * l * l) / (4 * gn * 10.0);

    // 霍金單調發散熵 S_Hawking(t) = 2.0 * S_BH0 * (t / tPage) * 0.5
    const sHawking = sBh0 * (t / tPage) * (0.85 + 0.15 * g);
    this.state.hawkingEntropy = Number(sHawking.toFixed(1));

    // 當 t > tPage，量子島生成
    const isIsland = t >= tPage || this.state.regime === 'entanglement-wedge-recovery' || this.state.regime === 'hayden-preskill-decoding';
    this.state.isIslandFormed = isIsland;

    if (isIsland) {
      // 量子極值面面積項 Area(\partial I)/(4G_N)
      const remainingHorizon = Math.max(0.02, 1.0 - t);
      const qesArea = sBh0 * remainingHorizon * 0.92;
      // 物質糾纏項 S_matter(R U I)
      const matterTerm = (cftMatterEntropy(t, g) * l) / 10.0;

      const sIsland = qesArea + matterTerm;
      this.state.qesAreaTerm = Number(qesArea.toFixed(1));
      this.state.matterEntanglementTerm = Number(matterTerm.toFixed(1));
      this.state.islandGeneralizedEntropy = Number(sIsland.toFixed(1));
      this.state.pageEntropy = Number(Math.min(sHawking, sIsland).toFixed(1));
      this.state.islandRadiusRatio = Number(Math.min(0.95, 0.65 + 0.25 * (t - tPage)).toFixed(2));

      // 解碼保真度：佩吉時間後由糾纏楔保證指數飽和
      const rawFidelity = 100 * (1 - 0.4 * Math.exp(-(t - tPage) * 6.5 * (1 + g)));
      this.state.decodingFidelityPct = Number(Math.max(70.0, Math.min(99.9, rawFidelity)).toFixed(1));
    } else {
      this.state.qesAreaTerm = 0;
      this.state.matterEntanglementTerm = Number(sHawking.toFixed(1));
      this.state.islandGeneralizedEntropy = Number((sBh0 * (1 - t) + 10).toFixed(1));
      this.state.pageEntropy = Number(sHawking.toFixed(1));
      this.state.islandRadiusRatio = 0;
      this.state.decodingFidelityPct = Number(Math.max(5.0, 15.0 * (t / tPage)).toFixed(1));
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

  private playIslandSound(freq: number, duration: number, type: OscillatorType): void {
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

function cftMatterEntropy(t: number, g: number): number {
  return 8.5 * Math.log(1 + 15 * t) * (0.8 + 0.4 * g);
}

export const quantumIslandEngine = new QuantumIslandReactorEngine();
