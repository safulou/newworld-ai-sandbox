/**
 * 重費米子近藤崩潰量子臨界點與動量空間費米面突變譜儀引擎
 * (Heavy-Fermion Kondo-Breakdown Quantum Critical Point & Fermi-Surface Reconstruction Spectrometer Engine)
 *
 * 物理原理：
 * 1. 在重費米子近藤晶格材料 (如 YbRh₂Si₂, CeCoIn₅, CeRhIn₅) 的 Doniach 相圖中，局域 4f 電子自旋間的
 *    RKKY 反鐵磁交換作用 J_{RKKY} ∝ J_K² ρ_0 與近藤單態雜化標度 T_K ∝ exp(-1 / J_K ρ_0) 激烈競爭。
 * 2. 當調諧控制參數 g = J_K / J_c 跨越局域量子臨界點 (Kondo-Breakdown QCP, g = 1.0) 時，
 *    近藤糾纏單態突然瓦解：4f 電子由「巡遊態」退局域化轉變為「局域磁矩」，導致費米面體積發生不連續跳躍重構
 *    （由包含 4f 電子的「大費米面」V_{FS}^{large} ∝ 1 + n_c 突變為「小費米面」V_{FS}^{small} ∝ n_c），
 *    在等溫霍爾係數 R_H 上產生陡峭量子臨界躍變。
 * 3. 在量子臨界扇區內，準粒子有效質量發散 m* / m_e → 10³，自能遵循奇異金屬 ω/T 動力學標度與線性溫度電阻率 ρ(T) ∝ T。
 */

export type HeavyFermionKondoRegime =
  | 'antiferromagnetic-small-fermi-surface'
  | 'kondo-breakdown-local-qcp-fan'
  | 'heavy-fermi-liquid-large-fermi-surface'
  | 'strange-metal-planckian-entanglement';

export interface KondoLatticeSiteNode {
  id: number;
  x: number;
  y: number;
  isKondoSingletScreened: boolean;
  hybridizationAmplitudeV: number;
  effectiveMassRatio: number;
  localSpinCorrelation: number;
}

export interface HeavyFermionKondoQcpState {
  doniachTuningRatioG: number;          // Doniach 近藤耦合調諧比 g = J_K / J_c (0.40 ~ 1.80, QCP at 1.00)
  magneticFieldTesla: number;           // 外部量子臨界調諧磁場 B (T, 0.01 ~ 12.0)
  effectiveQuasiparticleMassRatio: number; // 重費米子有效質量比 m* / m_e (10 ~ 1200)
  fermiSurfaceVolumeFraction: number;   // Luttinger 費米面體積佔比 V_{FS} / V_{large} (0.45 → 1.00)
  hallCoefficientJumpRatio: number;     // 霍爾係數重構比 R_H^{small} / R_H^{large}
  omegaOverTScalingExponent: number;    // 奇異金屬動力學標度指數 α_{ω/T}
  activeRegime: HeavyFermionKondoRegime;
  pulsePhase: number;
  latticeNodes: KondoLatticeSiteNode[];
}

const STORAGE_KEY = 'newworld_heavy_fermion_kondo_qcp_state_v1';

export class HeavyFermionKondoBreakdownQcpEngine {
  private state: HeavyFermionKondoQcpState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HeavyFermionKondoQcpState {
    const defaults: HeavyFermionKondoQcpState = {
      doniachTuningRatioG: 1.00,
      magneticFieldTesla: 0.65,
      effectiveQuasiparticleMassRatio: 845.0,
      fermiSurfaceVolumeFraction: 0.72,
      hallCoefficientJumpRatio: 2.38,
      omegaOverTScalingExponent: 0.78,
      activeRegime: 'kondo-breakdown-local-qcp-fan',
      pulsePhase: 0,
      latticeNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Heavy Fermion Kondo QCP state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Heavy Fermion Kondo QCP state:', e);
      }
    }
  }

  public getState(): Readonly<HeavyFermionKondoQcpState> {
    return this.state;
  }

  public setDoniachTuningRatio(gRatio: number): void {
    this.state.doniachTuningRatioG = Math.max(0.40, Math.min(1.80, parseFloat(gRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setMagneticFieldTesla(bTesla: number): void {
    this.state.magneticFieldTesla = Math.max(0.01, Math.min(12.0, parseFloat(bTesla.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HeavyFermionKondoRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'antiferromagnetic-small-fermi-surface':
        this.state.doniachTuningRatioG = 0.62;
        this.state.magneticFieldTesla = 0.15;
        break;
      case 'kondo-breakdown-local-qcp-fan':
        this.state.doniachTuningRatioG = 1.00;
        this.state.magneticFieldTesla = 0.65;
        break;
      case 'heavy-fermi-liquid-large-fermi-surface':
        this.state.doniachTuningRatioG = 1.48;
        this.state.magneticFieldTesla = 2.40;
        break;
      case 'strange-metal-planckian-entanglement':
        this.state.doniachTuningRatioG = 1.02;
        this.state.magneticFieldTesla = 0.08;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const g = this.state.doniachTuningRatioG;
    const bField = this.state.magneticFieldTesla;
    const distFromQcp = Math.abs(g - 1.0);

    // 量子臨界準粒子有效質量比 m* / m_e (在 g = 1.0 且低磁場時呈冪律發散峰值)
    const thermalCutoff = 0.045 + 0.012 * bField;
    const mStar = Math.min(1200.0, 42.0 + 38.0 / Math.sqrt(distFromQcp * distFromQcp + thermalCutoff * thermalCutoff));
    this.state.effectiveQuasiparticleMassRatio = parseFloat(mStar.toFixed(1));

    // Luttinger 費米面體積佔比 V_{FS} / V_{large}：跨越 g=1.0 由小費米面 (0.50) 躍升至大費米面 (1.00)
    const stepSharpness = 12.0 / (1.0 + 0.25 * bField);
    const fsFrac = 0.50 + 0.25 * (1.0 + Math.tanh((g - 1.0) * stepSharpness));
    this.state.fermiSurfaceVolumeFraction = parseFloat(fsFrac.toFixed(2));

    // 霍爾係數重構比 R_H^{eff} / R_H^{large} = 1 / V_{FS} + 臨界奇異修正
    const hallJump = 1.0 / fsFrac + 0.95 * Math.exp(-Math.pow(distFromQcp / 0.12, 2));
    this.state.hallCoefficientJumpRatio = parseFloat(hallJump.toFixed(2));

    // ω/T 動力學標度指數 α_{ω/T}
    const alphaScaling = 0.78 * Math.exp(-Math.pow(distFromQcp / 0.28, 2)) + 0.15;
    this.state.omegaOverTScalingExponent = parseFloat(alphaScaling.toFixed(2));

    // 生成 16 個 4f 近藤晶格雜化雲與動量空間大/小費米面重構節點
    const nodes: KondoLatticeSiteNode[] = [];
    const count = 16;
    const fsRadius = 56 + 48 * (fsFrac - 0.5) * 2.0; // 小費米面 ~56px，大費米面 ~104px
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * 0.28;
      const anisotropy = 1.0 + 0.12 * Math.cos(4.0 * angle);
      const r = fsRadius * anisotropy;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      const screened = g >= 1.0 || (g > 0.88 && i % 2 === 0);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        isKondoSingletScreened: screened,
        hybridizationAmplitudeV: parseFloat(Math.max(0.05, Math.tanh(Math.max(0, g - 0.75) * 2.4)).toFixed(2)),
        effectiveMassRatio: parseFloat(mStar.toFixed(0)),
        localSpinCorrelation: parseFloat(Math.max(0.05, 1.0 - fsFrac + 0.25).toFixed(2))
      });
    }
    this.state.latticeNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + (this.state.effectiveQuasiparticleMassRatio / 600.0) * 0.6;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerKondoQcpSound(): void {
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
      const oscSmallFs = this.audioCtx.createOscillator();
      const oscLargeFs = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscSmallFs.type = 'sawtooth';
      oscLargeFs.type = 'sine';

      // 小費米面與大費米面 Luttinger 躍遷雙頻諧音
      const fSmall = 220 + this.state.doniachTuningRatioG * 110;
      const fLarge = fSmall * (this.state.fermiSurfaceVolumeFraction * 1.85);

      oscSmallFs.frequency.setValueAtTime(fSmall, t);
      oscSmallFs.frequency.exponentialRampToValueAtTime(fLarge, t + 0.34);

      oscLargeFs.frequency.setValueAtTime(fLarge * 1.25, t);
      oscLargeFs.frequency.exponentialRampToValueAtTime(fSmall * 1.5, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscSmallFs.connect(gain);
      oscLargeFs.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscSmallFs.start(t);
      oscLargeFs.start(t);
      oscSmallFs.stop(t + 0.57);
      oscLargeFs.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in HeavyFermionKondoBreakdownQcpEngine:', e);
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

export const heavyFermionKondoBreakdownQcpEngine = new HeavyFermionKondoBreakdownQcpEngine();
