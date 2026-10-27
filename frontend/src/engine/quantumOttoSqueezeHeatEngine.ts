/**
 * 非馬可夫壓縮熱庫量子奧托熱機與麥克斯韋量子妖反饋引擎
 * (Non-Markovian Squeezed-Bath Quantum Otto Heat Engine & Maxwell Quantum Demon Feedback Engine)
 *
 * 物理原理：
 * 1. 量子奧托循環 (Quantum Otto Cycle) 由兩個絕熱頻率壓縮/膨脹衝程 (ω_1 ↔ ω_2) 與兩個等容非平衡熱庫耦合衝程組成。
 *    當高溫熱庫處於雙光子相干壓縮熱態 (Squeezed Thermal Reservoir，壓縮參數 r_s) 時，熱庫注入相干可提取功 (Ergotropy)。
 * 2. 廣義卡諾效率上限提升為 η_gen = 1 - T_c / [T_h cosh(2 r_s)]，可超越經典熱平衡卡諾極限 η_Carnot = 1 - T_c / T_h，
 *    且在計入壓縮熱庫的非熱自由能後嚴格遵守廣義熱力學第二定律。
 * 3. 結合非馬可夫記憶回流 (Breuer-Laine-Piilo 非馬可夫度 N_BLP) 與絕熱捷徑 (Shortcuts to Adiabaticity, STA) 反絕熱驅動，
 *    消除有限時間量子摩擦並最大化單循環可提取功 W_ergo。
 */

export type QuantumOttoEngineRegime =
  | 'classical-markovian-otto-cycle'
  | 'adiabatic-shortcut-sta-stroke'
  | 'squeezed-bath-super-carnot-regime'
  | 'quantum-demon-ergotropy-harvester';

export interface OttoWignerStrokeNode {
  id: number;
  x: number;
  y: number;
  strokeIndex: number; // 1: Isentropic Compression, 2: Hot Isochore, 3: Expansion, 4: Cold Isochore
  squeezeEllipseRatio: number;
  ergotropyDensity: number;
  wignerNegativity: number;
}

export interface QuantumOttoSqueezeEngineState {
  bathSqueezingParamRs: number;         // 熱庫雙光子壓縮參數 r_s (0.00 ~ 1.80)
  compressionRatioOmega: number;        // 絕熱諧振頻率壓縮比 ω_2 / ω_1 (1.2 ~ 5.0)
  bathTemperatureRatioThTc: number;     // 冷熱庫溫度比 T_h / T_c (1.5 ~ 10.0)
  quantumOttoEfficiencyPct: number;     // 量子奧托熱機效率 η_Otto (%)
  classicalCarnotLimitPct: number;      // 經典卡諾效率極限 η_Carnot (%)
  ergotropyWorkOutputHbarW: number;     // 單循環可提取相干功 W_ergo (ℏω_1)
  activeRegime: QuantumOttoEngineRegime;
  pulsePhase: number;
  strokeNodes: OttoWignerStrokeNode[];
}

const STORAGE_KEY = 'newworld_quantum_otto_squeeze_heat_engine_state_v1';

export class QuantumOttoSqueezeHeatEngine {
  private state: QuantumOttoSqueezeEngineState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): QuantumOttoSqueezeEngineState {
    const defaults: QuantumOttoSqueezeEngineState = {
      bathSqueezingParamRs: 0.95,
      compressionRatioOmega: 2.8,
      bathTemperatureRatioThTc: 3.2,
      quantumOttoEfficiencyPct: 79.4,
      classicalCarnotLimitPct: 68.8,
      ergotropyWorkOutputHbarW: 6.45,
      activeRegime: 'squeezed-bath-super-carnot-regime',
      pulsePhase: 0,
      strokeNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Quantum Otto Squeeze Heat Engine state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Quantum Otto Squeeze Heat Engine state:', e);
      }
    }
  }

  public getState(): Readonly<QuantumOttoSqueezeEngineState> {
    return this.state;
  }

  public setBathSqueezingParam(rs: number): void {
    this.state.bathSqueezingParamRs = Math.max(0.00, Math.min(1.80, parseFloat(rs.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setCompressionRatioOmega(ratio: number): void {
    this.state.compressionRatioOmega = Math.max(1.2, Math.min(5.0, parseFloat(ratio.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setBathTemperatureRatio(thTc: number): void {
    this.state.bathTemperatureRatioThTc = Math.max(1.5, Math.min(10.0, parseFloat(thTc.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: QuantumOttoEngineRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'classical-markovian-otto-cycle':
        this.state.bathSqueezingParamRs = 0.0;
        this.state.compressionRatioOmega = 1.8;
        this.state.bathTemperatureRatioThTc = 2.5;
        break;
      case 'adiabatic-shortcut-sta-stroke':
        this.state.bathSqueezingParamRs = 0.45;
        this.state.compressionRatioOmega = 2.5;
        this.state.bathTemperatureRatioThTc = 3.0;
        break;
      case 'squeezed-bath-super-carnot-regime':
        this.state.bathSqueezingParamRs = 1.15;
        this.state.compressionRatioOmega = 3.2;
        this.state.bathTemperatureRatioThTc = 3.5;
        break;
      case 'quantum-demon-ergotropy-harvester':
        this.state.bathSqueezingParamRs = 1.65;
        this.state.compressionRatioOmega = 4.4;
        this.state.bathTemperatureRatioThTc = 6.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rs = this.state.bathSqueezingParamRs;
    const comp = this.state.compressionRatioOmega;
    const tempRatio = this.state.bathTemperatureRatioThTc;

    // 經典卡諾效率極限 η_Carnot = 1 - T_c / T_h
    const carnotPct = (1.0 - 1.0 / tempRatio) * 100.0;
    this.state.classicalCarnotLimitPct = parseFloat(carnotPct.toFixed(1));

    // 廣義壓縮熱庫效率 η_Otto (當 r_s > 0 時透過 cosh(2 r_s) 有效提升高溫庫等效溫度)
    const squeezeBoost = Math.cosh(2.0 * rs);
    const baseOtto = 1.0 - 1.0 / Math.min(tempRatio * squeezeBoost, comp * squeezeBoost + 0.5);
    const ottoPct = Math.min(98.5, Math.max(15.0, baseOtto * 100.0));
    this.state.quantumOttoEfficiencyPct = parseFloat(ottoPct.toFixed(1));

    // 單循環可提取相干功 W_ergo (ℏω_1)
    const ergoWork = (comp - 1.0) * (0.45 * tempRatio + 1.8 * Math.sinh(rs) * Math.sinh(rs));
    this.state.ergotropyWorkOutputHbarW = parseFloat(ergoWork.toFixed(2));

    // 生成 16 個相空間壓縮維格納橢圓與四衝程奧托循環軌跡節點
    const nodes: OttoWignerStrokeNode[] = [];
    const count = 16;
    const squeezeAspect = Math.min(2.4, Math.exp(rs * 0.55));
    for (let i = 0; i < count; i++) {
      const stroke = (i % 4) + 1;
      const angle = (i / count) * 2 * Math.PI + this.state.pulsePhase * 0.35;
      const rx = 86 * squeezeAspect * 0.65;
      const ry = (86 / squeezeAspect) * 0.95;

      const x = 165 + rx * Math.cos(angle) + 6 * Math.sin(this.state.pulsePhase + i);
      const y = 160 + ry * Math.sin(angle) + 6 * Math.cos(this.state.pulsePhase + i);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        strokeIndex: stroke,
        squeezeEllipseRatio: parseFloat(Math.exp(2 * rs).toFixed(2)),
        ergotropyDensity: parseFloat((0.3 + 0.5 * rs + 0.08 * comp).toFixed(2)),
        wignerNegativity: parseFloat((0.15 * rs * Math.abs(Math.cos(angle))).toFixed(2))
      });
    }
    this.state.strokeNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.9 + this.state.compressionRatioOmega * 0.35;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerQuantumOttoSound(): void {
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

      osc1.type = 'triangle';
      osc2.type = 'sine';

      const fOmega1 = 240 + this.state.bathSqueezingParamRs * 90;
      const fOmega2 = fOmega1 * Math.min(3.2, this.state.compressionRatioOmega * 0.75);

      osc1.frequency.setValueAtTime(fOmega1, t);
      osc1.frequency.exponentialRampToValueAtTime(fOmega2, t + 0.32);

      osc2.frequency.setValueAtTime(fOmega1 * 1.5, t);
      osc2.frequency.exponentialRampToValueAtTime(fOmega2 * 1.25, t + 0.32);

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
      console.warn('Web Audio playback failed in QuantumOttoSqueezeHeatEngine:', e);
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

export const quantumOttoSqueezeHeatEngine = new QuantumOttoSqueezeHeatEngine();
