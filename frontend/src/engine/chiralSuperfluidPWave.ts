/**
 * 拓撲手性超流體 p_x + i p_y 庫珀對手性渦旋晶格反應堆
 * (Chiral p_x + i p_y Superfluid & Majorana Vortex Lattice Reactor)
 *
 * 核心物理理論：
 * 1. 二維手性 p_x + i p_y 超流體與自旋三重態配對：
 *    超流體序參量具有軌道角動量 L_z = \pm \hbar，具有內稟時間反演對稱破缺。
 *    在弱配對拓撲 BCS 體制 (化學勢 \mu > 0)，系統具備非平凡第一陳數 C = 1，
 *    邊界湧現無耗散手性邊緣超流 (Chiral Edge Currents) 與量子化熱霍爾傳導。
 * 2. 半量子化渦旋 (Half-Quantum Vortices, HQV) 與馬約拉納零能模：
 *    自旋三態自由度允許超流相位與自旋旋轉聯合繞卷，形成磁通為 \Phi_0 / 2 之半量子化渦旋。
 *    每個 HQV 核心嚴格束縛一個自共軛非阿貝爾馬約拉納零能模 (\gamma = \gamma^\dagger)，
 *    構成拓撲容錯量子運算之天然載體。
 * 3. 拓撲 BCS-BEC 跨接與自發角動量：
 *    隨相互作用強度調節，超流體經歷從弱配對拓撲相 (\mu > 0, C = 1)
 *    到強配對平庸玻色-愛因斯坦凝聚態 (\mu < 0, C = 0) 之拓撲量子相變。
 */

export type ChiralSuperfluidRegime =
  | 'weak-pairing-topological'    // 弱配對拓撲超流態 (BCS 相, C = 1, 手性無耗散邊界超流)
  | 'half-quantum-vortex-lattice'  // 半量子化渦旋阿布里科索夫晶格態 (束縛馬約拉納零能模)
  | 'strong-pairing-bec-crossover' // 強配對 BEC 跨接平庸相 (分子玻色凝聚, C = 0)
  | 'spontaneous-edge-current';    // 自發手性角動量巨流態 (表面時間反演破缺無阻傳輸)

export interface ChiralSuperfluidState {
  pairingGapDeltaMev: number;       // 超流配對能隙 \Delta_0 (meV, 0.1 ~ 12.0)
  chemicalPotentialMuMev: number;   // 化學勢 \mu (meV, -5.0 ~ 15.0, >0 為拓撲相, <0 為平庸相)
  vortexDensityCount: number;       // 晶格渦旋數量 (1 ~ 64)
  temperatureKelvin: number;        // 系統溫度 T (K, 0.001 ~ 5.0)
  rotationalVelocityRads: number;   // 容器旋轉角速度 \Omega (rad/s, 0.0 ~ 25.0)
  regime: ChiralSuperfluidRegime;

  // 動態演算物理指標
  chernNumber: number;              // 拓撲陳數 C (0 或 1)
  condensateDensity: number;        // 超流凝聚體分數密度 (0.0 ~ 1.0)
  majoranaZeroModesCount: number;   // 束縛馬約拉納零能模總數
  spontaneousAngularMomentumHbar: number; // 自發手性總角動量 (ħ 單位)
  edgeSupercurrentMicroAmp: number; // 邊界無耗散超電流 (μA)
  topologicalEntropyKatsura: number;// 拓撲非阿貝爾糾纏熵
  telemetryHistory: Array<{
    timestamp: number;
    gapMev: number;
    edgeCurrent: number;
    condensate: number;
  }>;
}

const STORAGE_KEY = 'newworld_chiral_superfluid_state_v1';

class ChiralSuperfluidEngine {
  private state: ChiralSuperfluidState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): ChiralSuperfluidState {
    return {
      pairingGapDeltaMev: 3.4,
      chemicalPotentialMuMev: 4.8,
      vortexDensityCount: 16,
      temperatureKelvin: 0.08,
      rotationalVelocityRads: 6.5,
      regime: 'weak-pairing-topological',
      chernNumber: 1,
      condensateDensity: 0.92,
      majoranaZeroModesCount: 16,
      spontaneousAngularMomentumHbar: 48.0,
      edgeSupercurrentMicroAmp: 320.5,
      topologicalEntropyKatsura: 0.693, // ln(2)
      telemetryHistory: []
    };
  }

  private loadState(): ChiralSuperfluidState {
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
      // 降級取預設
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

  public getState(): ChiralSuperfluidState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<ChiralSuperfluidState, 'pairingGapDeltaMev' | 'chemicalPotentialMuMev' | 'vortexDensityCount' | 'temperatureKelvin' | 'rotationalVelocityRads' | 'regime'>>): void {
    if (params.pairingGapDeltaMev !== undefined) {
      this.state.pairingGapDeltaMev = Math.max(0.1, Math.min(12.0, Number(params.pairingGapDeltaMev)));
    }
    if (params.chemicalPotentialMuMev !== undefined) {
      this.state.chemicalPotentialMuMev = Math.max(-5.0, Math.min(15.0, Number(params.chemicalPotentialMuMev)));
    }
    if (params.vortexDensityCount !== undefined) {
      this.state.vortexDensityCount = Math.max(1, Math.min(64, Math.round(Number(params.vortexDensityCount))));
    }
    if (params.temperatureKelvin !== undefined) {
      this.state.temperatureKelvin = Math.max(0.001, Math.min(5.0, Number(params.temperatureKelvin)));
    }
    if (params.rotationalVelocityRads !== undefined) {
      this.state.rotationalVelocityRads = Math.max(0.0, Math.min(25.0, Number(params.rotationalVelocityRads)));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }

    this.recalculatePhysics();
    this.playTone();
    this.saveState();
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public injectMajoranaBraidingStep(): void {
    // 激發一次非阿貝爾馬約拉納任意子編織步進
    this.state.spontaneousAngularMomentumHbar += 1.5;
    this.state.edgeSupercurrentMicroAmp = Math.min(1200, this.state.edgeSupercurrentMicroAmp + 25.0);
    this.playTone(659.25, 'triangle'); // E5
    this.saveState();
  }

  public togglePairingPhase(): void {
    // 快速切換拓撲弱配對與強配對 BEC 跨接
    if (this.state.chemicalPotentialMuMev > 0) {
      this.state.chemicalPotentialMuMev = -2.5;
      this.state.regime = 'strong-pairing-bec-crossover';
    } else {
      this.state.chemicalPotentialMuMev = 5.2;
      this.state.regime = 'weak-pairing-topological';
    }
    this.recalculatePhysics();
    this.playTone(440.0, 'sine');
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { pairingGapDeltaMev, chemicalPotentialMuMev, vortexDensityCount, temperatureKelvin, rotationalVelocityRads, regime } = this.state;

    // 1. 陳數判準：化學勢 \mu > 0 為拓撲相 C=1；\mu < 0 為平庸相 C=0
    const isTopological = chemicalPotentialMuMev > 0;
    this.state.chernNumber = isTopological ? 1 : 0;

    // 2. 超流凝聚體分數 (隨溫度指數衰減，在極低溫飽和)
    const thermalDepletion = Math.min(1.0, temperatureKelvin / 4.2);
    this.state.condensateDensity = Math.max(0.05, Number(((1 - thermalDepletion ** 1.8) * (pairingGapDeltaMev / 12.0) * 0.95).toFixed(3)));

    // 3. 馬約拉納零能模數量 (拓撲相且具半量子化渦旋時嚴格鎖定於渦旋數量)
    if (isTopological && (regime === 'half-quantum-vortex-lattice' || regime === 'weak-pairing-topological')) {
      this.state.majoranaZeroModesCount = vortexDensityCount;
    } else if (regime === 'spontaneous-edge-current') {
      this.state.majoranaZeroModesCount = Math.floor(vortexDensityCount / 2);
    } else {
      this.state.majoranaZeroModesCount = 0;
    }

    // 4. 自發手性角動量
    const chiralMultiplier = isTopological ? 1.0 : 0.15;
    this.state.spontaneousAngularMomentumHbar = Number((
      chiralMultiplier * (this.state.condensateDensity * 50.0 + rotationalVelocityRads * 2.4)
    ).toFixed(1));

    // 5. 無耗散邊界超電流
    if (isTopological) {
      const edgeBoost = regime === 'spontaneous-edge-current' ? 1.8 : 1.0;
      this.state.edgeSupercurrentMicroAmp = Number((
        pairingGapDeltaMev * 68.0 * this.state.condensateDensity * edgeBoost
      ).toFixed(1));
      this.state.topologicalEntropyKatsura = 0.693; // ln(2)
    } else {
      this.state.edgeSupercurrentMicroAmp = Number((
        pairingGapDeltaMev * 8.5 * this.state.condensateDensity
      ).toFixed(1));
      this.state.topologicalEntropyKatsura = 0.0;
    }
  }

  public update(delta: number): void {
    // 隨時間微擾波動與遙測記錄
    const now = Date.now();
    const drift = Math.sin(now * 0.002) * 0.02;
    this.state.condensateDensity = Math.max(0.01, Math.min(1.0, Number((this.state.condensateDensity + drift * delta).toFixed(3))));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        gapMev: this.state.pairingGapDeltaMev,
        edgeCurrent: this.state.edgeSupercurrentMicroAmp,
        condensate: this.state.condensateDensity
      });
      if (this.state.telemetryHistory.length > 25) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private initAudio(): void {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq = 329.63, type: OscillatorType = 'sine'): void { // E4
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.36);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const chiralSuperfluidEngine = new ChiralSuperfluidEngine();
