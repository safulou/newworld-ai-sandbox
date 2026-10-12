/**
 * AdS/dS 雙曲多端可穿越蟲洞多體糾纏網絡 (Multi-Boundary Traversable Wormhole Multipartite Entanglement Network)
 *
 * 核心物理理論：
 * 1. 多邊界雙曲全息幾何 (Multi-Boundary Hyperbolic Holography in AdS3/CFT2)：
 *    在 AdS/CFT 對偶中，具有多個漸近邊界 (n \ge 3) 的黎曼曲面（例如三腿褲褲襠幾何 Pair of Pants）
 *    共用同一個連通的黑洞內部多端蟲洞喉徑結點 (Central Entanglement Junction)。
 * 2. 多體糾纏態結構 (GHZ vs W Multipartite Entanglement)：
 *    邊界 CFT 處於多體熱場多重態 (Multipartite Entangled State)，
 *    包含極大糾纏 GHZ 態 |\text{GHZ}\rangle = \frac{1}{\sqrt{2}}(|000\rangle + |111\rangle) 與 W 態；
 *    Ryu-Takayanagi 極小曲面在多端黑洞內部相交於全息糾纏結點。
 * 3. 多跡耦合與多方量子秘密共享傳態 (Multi-Trace Coupling & Quantum Secret Sharing)：
 *    在多個邊界間施加全域雙跡/多跡耦合算子 H_{\text{int}} = -\sum_{i < j} g_{ij} \mathcal{O}_i \mathcal{O}_j，
 *    向各個蟲洞喉部注入平均負能量，激發正向夏皮羅時間超前 (\Delta v_k > 0) 同步張開各喉口；
 *    實現拓撲量子秘密共享：自邊界 1 輸入的量子位元，必須由邊界 2 與邊界 3 聯合測量才能以超高保真度 F \to 1 恢復。
 */

export type MultiWormholeRegime =
  | 'tripartite-ghz-teleport'   // 三方 GHZ 全息量子隱形傳態相
  | 'multi-throat-shapiro-open' // 多喉管夏皮羅負能量張開相
  | 'quantum-secret-sharing'    // 拓撲量子秘密共享解碼相
  | 'entanglement-junction-flux';// 糾纏結點共形通量路由相

export interface MultiBoundaryWormholeState {
  boundaryCountN: number;       // 漸近邊界數目 (3 或 4)
  throatCouplingG: number;      // 多跡耦合強度 g_ij (0.1 ~ 2.0)
  wormholeRadiusAdS: number;    // 蟲洞 AdS 曲率半徑 (1.0 ~ 15.0)
  scramblingTimePs: number;     // 多體擾亂時間 t_scr (0.5 ~ 10.0 ps)
  regime: MultiWormholeRegime;
  // 動態演算物理指標
  shapiroAdvanceAs: number;     // 夏皮羅時間超前 \Delta v (as, 正值為可穿越)
  isThroatTraversable: boolean; // 是否達成可穿越條件 (\Delta v > 0)
  multipartiteFidelityPct: number; // 多方量子傳態解碼保真度 F (%)
  ghzEntanglementNegativity: number; // 多體糾纏負度 (0.0 ~ 1.0)
  throatAreaG: number;          // 喉管截面積幾何項 Area / 4G
  activeTransitPackets: number; // 穿越中的多體量子資料包數
  telemetryHistory: Array<{
    timestamp: number;
    shapiroAdvance: number;
    fidelityPct: number;
    packets: number;
  }>;
}

const STORAGE_KEY = 'newworld_multi_wormhole_state_v1';

class MultiBoundaryWormholeEngine {
  private state: MultiBoundaryWormholeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): MultiBoundaryWormholeState {
    return {
      boundaryCountN: 3,
      throatCouplingG: 0.95,
      wormholeRadiusAdS: 8.5,
      scramblingTimePs: 2.4,
      regime: 'tripartite-ghz-teleport',
      shapiroAdvanceAs: 142.0,
      isThroatTraversable: true,
      multipartiteFidelityPct: 96.5,
      ghzEntanglementNegativity: 0.88,
      throatAreaG: 34.2,
      activeTransitPackets: 2,
      telemetryHistory: []
    };
  }

  private loadState(): MultiBoundaryWormholeState {
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

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.saveState();
  }

  public getState(): Readonly<MultiBoundaryWormholeState> {
    return this.state;
  }

  public setParameters(params: Partial<Pick<MultiBoundaryWormholeState,
    'boundaryCountN' | 'throatCouplingG' | 'wormholeRadiusAdS' | 'scramblingTimePs' | 'regime'
  >>): void {
    if (params.boundaryCountN !== undefined) {
      this.state.boundaryCountN = params.boundaryCountN >= 4 ? 4 : 3;
    }
    if (params.throatCouplingG !== undefined) {
      this.state.throatCouplingG = Math.max(0.1, Math.min(2.0, params.throatCouplingG));
    }
    if (params.wormholeRadiusAdS !== undefined) {
      this.state.wormholeRadiusAdS = Math.max(1.0, Math.min(15.0, params.wormholeRadiusAdS));
    }
    if (params.scramblingTimePs !== undefined) {
      this.state.scramblingTimePs = Math.max(0.5, Math.min(10.0, params.scramblingTimePs));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public injectMultiQubitPacket(): void {
    this.playWormholeSound(540, 0.35, 'triangle');
    this.state.activeTransitPackets = Math.min(8, this.state.activeTransitPackets + 1);
    this.state.multipartiteFidelityPct = Math.min(99.9, this.state.multipartiteFidelityPct + 1.2);
    this.recomputePhysics();
    this.saveState();
  }

  public toggleBoundaryTopology(): void {
    this.playWormholeSound(720, 0.45, 'sine');
    this.state.boundaryCountN = this.state.boundaryCountN === 3 ? 4 : 3;
    this.recomputePhysics();
    this.saveState();
  }

  public update(delta: number): void {
    // 緩慢傳遞並遞減在途量子資訊包
    if (this.state.activeTransitPackets > 0 && Math.random() < delta * 0.4) {
      this.state.activeTransitPackets = Math.max(1, this.state.activeTransitPackets - 1);
    }

    this.recomputePhysics();

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }
    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        shapiroAdvance: Number(this.state.shapiroAdvanceAs.toFixed(1)),
        fidelityPct: Number(this.state.multipartiteFidelityPct.toFixed(1)),
        packets: this.state.activeTransitPackets
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recomputePhysics(): void {
    const n = this.state.boundaryCountN;
    const g = this.state.throatCouplingG;
    const l = this.state.wormholeRadiusAdS;
    const tScr = this.state.scramblingTimePs;

    // 夏皮羅時間超前 \Delta v \propto g * l * e^{t_scr}
    const rawAdvance = 35.0 * g * (l / 5.0) * (1.0 + 0.15 * tScr) * (n === 4 ? 1.25 : 1.0);
    this.state.shapiroAdvanceAs = Number(rawAdvance.toFixed(1));
    this.state.isThroatTraversable = this.state.shapiroAdvanceAs > 0;

    // 喉管截面積 Area / 4G
    const area = 4.0 * Math.PI * l * (n === 4 ? 1.35 : 1.0);
    this.state.throatAreaG = Number(area.toFixed(1));

    // 多方保真度 F: 喉管張開時達到極高么正傳輸
    if (this.state.isThroatTraversable) {
      const fidelity = 92.0 + 7.5 * Math.tanh(g * 1.8) * (1.0 - 0.05 * (tScr / 10.0));
      this.state.multipartiteFidelityPct = Number(Math.min(99.9, fidelity).toFixed(1));
      this.state.ghzEntanglementNegativity = Number(Math.min(0.99, 0.75 + 0.22 * Math.tanh(g)).toFixed(2));
    } else {
      this.state.multipartiteFidelityPct = 12.0;
      this.state.ghzEntanglementNegativity = 0.2;
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

  private playWormholeSound(freq: number, duration: number, type: OscillatorType): void {
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

export const multiBoundaryWormholeEngine = new MultiBoundaryWormholeEngine();
export const multiWormholeEngine = multiBoundaryWormholeEngine;
