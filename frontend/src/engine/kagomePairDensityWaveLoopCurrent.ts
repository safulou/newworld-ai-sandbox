/**
 * 籠目金屬配對密度波與手性軌道環電流超導引擎
 * (Kagome Metal Pair-Density-Wave & Chiral Orbital Loop-Current Superconductor Engine)
 *
 * 物理原理：
 * 1. 籠目晶格超導體 AV₃Sb₅ (A = Cs, Rb, K) 在范霍夫奇異點 (van Hove Singularity, vHS) 填充附近展現交織電子序：
 *    時間反演對稱性破缺之「手性軌道環電流相」(Chiral Flux / Loop-Current CDW Phase)，在大衛之星 (Star-of-David)
 *    2×2 超晶格六邊形與三角形晶胞內產生交替手性磁通 ±Φ_loop。
 * 2. 在超導轉變溫度以下，庫柏對具有非零質心動量 Q_i，形成 3Q 空間調制之「配對密度波」(Pair-Density Wave, PDW)：
 *    Δ_PDW(r) = Σ_{i=1}^3 Δ_{Q_i} exp(i Q_i · r)，激發無需外加磁場的內稟超導二極體效應 (Josephson Diode Effect, η_JDE)。
 * 3. 當規範相位渦旋與 PDW 位錯熱漲落熔化時，殘留高階配對湧現分數化磁通量子 h/4e 與 h/6e 之「電荷-6e 玻色凝聚態」(Charge-6e Condensate)。
 */

export type KagomePdwLoopRegime =
  | 'normal-van-hove-kagome-metal'
  | 'chiral-loop-current-flux-cdw'
  | 'roton-pair-density-wave-3q'
  | 'vestigial-charge-6e-condensate';

export interface KagomeStarOfDavidNode {
  id: number;
  x: number;
  y: number;
  plaquetteChirality: number; // +1 (CCW loop current) or -1 (CW loop current)
  pdwGapAmplitudeMev: number;
  orbitalFluxRatio: number;
  vortexWindingChargeE: number; // 2, 4, or 6
}

export interface KagomePairDensityWaveState {
  orbitalLoopFluxMilliPhi0: number;     // 手性軌道環電流磁通 Φ_loop (mΦ_0, 0.5 ~ 45.0)
  pdwModulationAmpMev: number;          // 3Q 配對密度波振幅 Δ_PDW (meV, 0.10 ~ 3.50)
  vanHoveDetuningMev: number;           // 范霍夫奇異點能級失諧 |δμ_vHS| (meV, 0.0 ~ 25.0)
  charge6eCondensateFraction: number;   // 殘留電荷-6e (h/6e) 凝聚分數 f_6e (0 ~ 1)
  josephsonDiodeEfficiencyPct: number;  // 無場內稟超導二極體整流效率 η_JDE (%)
  polarKerrRotationMicroRad: number;    // 極化克爾旋轉角 θ_K (μrad)
  activeRegime: KagomePdwLoopRegime;
  pulsePhase: number;
  kagomeNodes: KagomeStarOfDavidNode[];
}

const STORAGE_KEY = 'newworld_kagome_pair_density_wave_state_v1';

export class KagomePairDensityWaveLoopCurrentEngine {
  private state: KagomePairDensityWaveState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): KagomePairDensityWaveState {
    const defaults: KagomePairDensityWaveState = {
      orbitalLoopFluxMilliPhi0: 18.5,
      pdwModulationAmpMev: 1.65,
      vanHoveDetuningMev: 3.5,
      charge6eCondensateFraction: 0.72,
      josephsonDiodeEfficiencyPct: 34.8,
      polarKerrRotationMicroRad: 68.4,
      activeRegime: 'roton-pair-density-wave-3q',
      pulsePhase: 0,
      kagomeNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Kagome PDW Loop-Current state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Kagome PDW Loop-Current state:', e);
      }
    }
  }

  public getState(): Readonly<KagomePairDensityWaveState> {
    return this.state;
  }

  public setOrbitalLoopFlux(fluxMilliPhi0: number): void {
    this.state.orbitalLoopFluxMilliPhi0 = Math.max(0.5, Math.min(45.0, parseFloat(fluxMilliPhi0.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setPdwModulationAmp(ampMev: number): void {
    this.state.pdwModulationAmpMev = Math.max(0.10, Math.min(3.50, parseFloat(ampMev.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setVanHoveDetuning(detMev: number): void {
    this.state.vanHoveDetuningMev = Math.max(0.0, Math.min(25.0, parseFloat(detMev.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: KagomePdwLoopRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'normal-van-hove-kagome-metal':
        this.state.orbitalLoopFluxMilliPhi0 = 1.2;
        this.state.pdwModulationAmpMev = 0.15;
        this.state.vanHoveDetuningMev = 18.0;
        break;
      case 'chiral-loop-current-flux-cdw':
        this.state.orbitalLoopFluxMilliPhi0 = 26.0;
        this.state.pdwModulationAmpMev = 0.65;
        this.state.vanHoveDetuningMev = 4.0;
        break;
      case 'roton-pair-density-wave-3q':
        this.state.orbitalLoopFluxMilliPhi0 = 22.0;
        this.state.pdwModulationAmpMev = 2.15;
        this.state.vanHoveDetuningMev = 2.0;
        break;
      case 'vestigial-charge-6e-condensate':
        this.state.orbitalLoopFluxMilliPhi0 = 38.0;
        this.state.pdwModulationAmpMev = 3.20;
        this.state.vanHoveDetuningMev = 0.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const flux = this.state.orbitalLoopFluxMilliPhi0;
    const pdw = this.state.pdwModulationAmpMev;
    const vhsDet = this.state.vanHoveDetuningMev;

    // 范霍夫奇異點態密度共振增益因子
    const vhsResonance = Math.exp(-vhsDet / 12.0);

    // 殘留電荷-6e 凝聚分數 f_6e
    const f6e = Math.min(0.98, 0.08 + 0.55 * Math.tanh(pdw / 1.8) * (0.4 + 0.6 * vhsResonance) + 0.008 * flux);
    this.state.charge6eCondensateFraction = parseFloat(f6e.toFixed(2));

    // 無場內稟超導二極體整流效率 η_JDE (%)
    const diodePct = Math.min(68.0, 1.5 * Math.sqrt(flux * pdw) * (1.1 + 0.8 * vhsResonance));
    this.state.josephsonDiodeEfficiencyPct = parseFloat(diodePct.toFixed(1));

    // 極化克爾旋轉角 θ_K (μrad)
    const kerrAngle = 3.2 * flux * (0.65 + 0.35 * vhsResonance) + 4.5 * pdw;
    this.state.polarKerrRotationMicroRad = parseFloat(kerrAngle.toFixed(1));

    // 生成 18 個大衛之星籠目晶格環電流與 PDW 超導節點
    const nodes: KagomeStarOfDavidNode[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const layer = i < 6 ? 44 : i < 12 ? 78 : 110;
      const idx = i % 6;
      const baseAngle = (idx / 6) * 2 * Math.PI + (i >= 6 && i < 12 ? Math.PI / 6 : 0);
      const angle = baseAngle + this.state.pulsePhase * 0.25;

      const x = 165 + layer * Math.cos(angle) + 5 * Math.sin(this.state.pulsePhase + i);
      const y = 160 + layer * Math.sin(angle) + 5 * Math.cos(this.state.pulsePhase + i);

      const chargeMode = f6e > 0.75 ? 6 : f6e > 0.45 ? 4 : 2;

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        plaquetteChirality: i % 2 === 0 ? 1 : -1,
        pdwGapAmplitudeMev: parseFloat((pdw * (0.65 + 0.35 * Math.cos(3 * baseAngle + this.state.pulsePhase))).toFixed(2)),
        orbitalFluxRatio: parseFloat((flux / 45.0).toFixed(2)),
        vortexWindingChargeE: chargeMode
      });
    }
    this.state.kagomeNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.85 + this.state.pdwModulationAmpMev * 0.45;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerKagomePdwSound(): void {
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

      // 3Q 與 6e 和弦頻率比
      const fBase = 290 + this.state.orbitalLoopFluxMilliPhi0 * 6.5;
      const fHarmonic = fBase + this.state.pdwModulationAmpMev * 95;

      osc1.frequency.setValueAtTime(fBase, t);
      osc1.frequency.exponentialRampToValueAtTime(fHarmonic, t + 0.34);

      osc2.frequency.setValueAtTime(fBase * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(fHarmonic * 1.5, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.56);
      osc2.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in KagomePairDensityWaveLoopCurrentEngine:', e);
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

export const kagomePairDensityWaveLoopCurrentEngine = new KagomePairDensityWaveLoopCurrentEngine();
