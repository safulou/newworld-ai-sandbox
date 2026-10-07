/**
 * 拓撲激子極化激元量子流體結晶反應堆 (Topological Exciton-Polariton Condensate & Superfluid Reactor)
 * 
 * 理論基礎：
 * 1. 半導體微腔激子-光子強耦合 (Strong Coupling Regime, Weisbuch et al. 1992)
 *    形成半光半物質之波色準粒子：激子極化激元 (Exciton-Polariton)。
 *    有效質量 m* ~ 10^-4 m_e，使非平衡玻色-愛因斯坦凝聚 (BEC) 臨界溫度大幅躍升。
 * 2. 泵浦-損耗非厄米 Gross-Pitaevskii 方程 (Driven-Dissipative Non-Hermitian GPE):
 *    iħ ∂ψ/∂t = [ -ħ²∇²/(2m*) + V(r) + g|ψ|² + iħ/2 (P(r) - γ) ] ψ
 * 3. 微腔蜂窩光學晶格中打破時間反演之手性拓撲邊界態 (Chiral Edge Solitons, Chern C = ±1)。
 * 4. 超流體暗孤子 (Dark Solitons)、亮孤子 (Bright Solitons) 與量子化自旋渦旋流。
 * 5. 4 大運行動力學體制：
 *    - bose_einstein_condensate_phase: 非平衡玻色-愛因斯坦極化激元凝聚相
 *    - topological_chiral_edge_soliton: 蜂窩微腔拓撲邊界手性暗孤子傳播態
 *    - half_quantum_vortex_superfluid: 自旋半整數量子化渦旋超流流動
 *    - room_temperature_polariton_laser: 高溫極化激元微腔低閾值極化激光發射
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成微腔拉比共振純音、激子凝聚相變低頻泛音、孤子碰撞消散音
 * - HTML5 Canvas 2D 呈現微腔六角晶格、激子密度熱圖等高線、手性邊緣流光束與暗孤子相位凹陷
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type PolaritonRegime = 
  | 'bose_einstein_condensate_phase' 
  | 'topological_chiral_edge_soliton' 
  | 'half_quantum_vortex_superfluid' 
  | 'room_temperature_polariton_laser';

export interface SolitonTelemetry {
  id: string;
  positionX: number;
  depthRatio: number; // 孤子凹陷深度 (0 ~ 1)
  velocityKmPerS: number;
  phaseJumpRad: number;
  timestamp: number;
}

export interface ExcitonPolaritonState {
  regime: PolaritonRegime;
  rabiSplittingMev: number; // 拉比分裂能 ħΩ_R (8 ~ 30 meV)
  cavityDetuningMev: number; // 微腔-激子失諧 δ = E_cav - E_exc (-10 ~ 10 meV)
  condensateFraction: number; // 凝聚比例 (0 ~ 1)
  soundVelocityKmPerS: number; // 博戈柳博夫聲速 c_s
  reservoirDensity1e10: number; // 激子庫密度 (10^10 cm^-2)
  topologicalChernNumber: number; // 陳數 (0 或 ±1)
  superfluidPurityPercent: number; // 超流純度 (0 ~ 100%)
  solitonCount: number;
  totalHarvestedPhotonCount: number;
  autoPumpingModulation: boolean;
  solitonHistory: SolitonTelemetry[];
}

const STORAGE_KEY = 'newworld_exciton_polariton_condensate';

class ExcitonPolaritonEngine {
  private state: ExcitonPolaritonState = {
    regime: 'topological_chiral_edge_soliton',
    rabiSplittingMev: 16.4,
    cavityDetuningMev: -2.0,
    condensateFraction: 0.82,
    soundVelocityKmPerS: 1.48,
    reservoirDensity1e10: 5.2,
    topologicalChernNumber: 1,
    superfluidPurityPercent: 94.6,
    solitonCount: 4,
    totalHarvestedPhotonCount: 1420,
    autoPumpingModulation: true,
    solitonHistory: []
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeCondensate();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): ExcitonPolaritonState {
    return { ...this.state, solitonHistory: [...this.state.solitonHistory] };
  }

  public setRegime(regime: PolaritonRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'bose_einstein_condensate_phase':
        this.state.topologicalChernNumber = 0;
        this.state.cavityDetuningMev = 0.0;
        break;
      case 'topological_chiral_edge_soliton':
        this.state.topologicalChernNumber = 1;
        this.state.cavityDetuningMev = -2.0;
        break;
      case 'half_quantum_vortex_superfluid':
        this.state.topologicalChernNumber = 1;
        this.state.cavityDetuningMev = 1.5;
        break;
      case 'room_temperature_polariton_laser':
        this.state.topologicalChernNumber = 0;
        this.state.cavityDetuningMev = -5.0;
        break;
    }
    this.recomputeCondensate();
    this.playCondensateSwitchTone();
    this.saveState();
  }

  public setRabiSplitting(mev: number): void {
    this.state.rabiSplittingMev = Math.max(8.0, Math.min(30.0, parseFloat(mev.toFixed(1))));
    this.recomputeCondensate();
    this.saveState();
  }

  public setDetuning(mev: number): void {
    this.state.cavityDetuningMev = Math.max(-10.0, Math.min(10.0, parseFloat(mev.toFixed(1))));
    this.recomputeCondensate();
    this.saveState();
  }

  public toggleAutoPumping(): void {
    this.state.autoPumpingModulation = !this.state.autoPumpingModulation;
    this.saveState();
  }

  public injectSolitonPulse(): void {
    const depth = 0.7 + Math.random() * 0.28;
    const velocity = this.state.soundVelocityKmPerS * (0.4 + Math.random() * 0.5);
    const item: SolitonTelemetry = {
      id: 'soliton-' + Date.now().toString(36),
      positionX: parseFloat((Math.random() * 100).toFixed(1)),
      depthRatio: parseFloat(depth.toFixed(2)),
      velocityKmPerS: parseFloat(velocity.toFixed(2)),
      phaseJumpRad: parseFloat((Math.PI * (0.8 + Math.random() * 0.3)).toFixed(2)),
      timestamp: Date.now()
    };
    this.state.solitonHistory.unshift(item);
    if (this.state.solitonHistory.length > 20) {
      this.state.solitonHistory.pop();
    }
    this.state.solitonCount = Math.min(12, this.state.solitonCount + 1);
    this.state.totalHarvestedPhotonCount += Math.floor(40 + Math.random() * 30);
    this.playSolitonChirp();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoPumpingModulation) {
      const wobble = Math.sin(Date.now() / 2500) * 0.4;
      this.state.reservoirDensity1e10 = Math.max(1.0, Math.min(12.0, parseFloat((5.0 + wobble).toFixed(2))));
    }

    // 隨機衰減孤子與更新聲速
    if (Math.random() < 0.05 * deltaSeconds) {
      if (this.state.solitonCount > 2) {
        this.state.solitonCount -= 1;
      }
    }

    this.recomputeCondensate();
  }

  private recomputeCondensate(): void {
    // 凝聚體比例取決於拉比劈裂、失諧與儲存庫密度
    // 失諧越大且偏負，光子成分越高，質量越輕；失諧偏正，激子成分高，非線性相互作用越強
    const hopkinsonFactor = 1.0 / (1.0 + Math.exp(-this.state.cavityDetuningMev / 4.0));
    const effectiveMassRatio = 0.5 - 0.4 * (1.0 - hopkinsonFactor); // ~0.1 ~ 0.5
    
    // Bogoliubov 聲速 c_s = sqrt(g*n / m*)
    const interactionConstant = 0.8 + (this.state.rabiSplittingMev / 20.0);
    const n = this.state.reservoirDensity1e10 * 0.2;
    this.state.soundVelocityKmPerS = parseFloat((Math.sqrt((interactionConstant * n) / effectiveMassRatio)).toFixed(2));

    // 凝聚比例
    const baseFraction = 0.5 + (this.state.rabiSplittingMev / 60.0) + (this.state.reservoirDensity1e10 * 0.03);
    this.state.condensateFraction = Math.max(0.1, Math.min(0.99, parseFloat(baseFraction.toFixed(2))));

    // 超流純度
    let purity = (this.state.condensateFraction * 0.7 + (this.state.soundVelocityKmPerS / 3.0) * 0.3) * 100;
    if (this.state.regime === 'topological_chiral_edge_soliton') purity += 4.5;
    this.state.superfluidPurityPercent = Math.max(10, Math.min(99.9, parseFloat(purity.toFixed(1))));
  }

  // --- Web Audio 程序化合成 ---

  public playCondensateSwitchTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 主振盪器：代表微腔極化激元頻率
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = 440 + this.state.rabiSplittingMev * 15;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.25);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch { /* ignore */ }
  }

  public playSolitonChirp(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.2); // 暗孤子向下頻率凹陷

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
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

export const excitonPolaritonEngine = new ExcitonPolaritonEngine();
