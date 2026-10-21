/**
 * 弗洛凱螺旋調制光子波導陣列與非阿貝爾任意子編織器引擎
 * (Floquet Helically-Modulated Photonic Waveguide Array & Non-Abelian Anyon Braider Engine)
 *
 * 物理原理：
 * 1. 在飛秒雷射直寫之三維螺旋調制光子波導陣列中，縱向傳播座標 z 扮演等效時間 t，螺旋軌跡 R(z) = (R_h cos(Ω_z z), R_h sin(Ω_z z))
 *    誘導人工合成弗洛凱規範矢勢 A_syn(z) = k_0 R_h Ω_z (-sin(Ω_z z), cos(Ω_z z))。
 * 2. 當波導陣列包含 N 個拓撲保護零能對稱光子模 (Photonic Zero Modes) 時，沿傳播軸 z 的絕熱空間編織演化由非阿貝爾
 *    Wilczek-Zee 幾何規範聯絡 A_mn^WZ = i⟨ψ_m(z)| ∂_z |ψ_n(z)⟩ 支配，產生非對易么正編織矩陣 U_WZ = P exp(i ∮ A^WZ dz) ∈ U(N)。
 * 3. 在反常弗洛凱拓撲絕緣相 (Anomalous Floquet Topological Insulator) 中，即使體陳數 C_bulk = 0，纏繞不變量 W_π = 1
 *    仍在準能量 ε = π/T_z 處保護無背向散射手性邊界模與雙光子 Hong-Ou-Mandel 非阿貝爾干涉可見度 V_HOM。
 */

export type FloquetPhotonicWaveguideRegime =
  | 'straight-abelian-waveguide-array'
  | 'anomalous-floquet-chiral-edge'
  | 'wilczek-zee-non-abelian-holonomy'
  | 'pi-mode-photonic-anyon-braider';

export interface BraidedWaveguideCoreNode {
  id: number;
  x: number;
  y: number;
  zeroModeSubspaceIdx: number;
  syntheticGaugeFluxRad: number;
  holonomyMatrixWeight: number;
  isPiModeEdgeChannel: boolean;
}

export interface FloquetNonAbelianWaveguideState {
  helixModulationFreqCm: number;       // 螺旋調制空間頻率 Ω_z (cm⁻¹, 1.0 ~ 24.0)
  helixRadiusUm: number;               // 波導螺旋半徑 R_h (μm, 2.0 ~ 35.0)
  evanescentCouplingCm: number;        // 倏逝波耦合強度 J_0 (cm⁻¹, 0.5 ~ 15.0)
  wilczekZeeHolonomyNorm: number;      // 非阿貝爾 Wilczek-Zee 和樂矩陣保真度 |Tr(U_WZ)|/N (0 ~ 1)
  floquetPiGapInverseCm: number;       // 準能量 π-模拓撲能隙 Δε_π (cm⁻¹)
  homBraidingVisibilityPct: number;    // 雙光子 HOM 非阿貝爾編織干涉可見度 V_HOM (%)
  activeRegime: FloquetPhotonicWaveguideRegime;
  pulsePhase: number;
  waveguideNodes: BraidedWaveguideCoreNode[];
}

const STORAGE_KEY = 'newworld_floquet_non_abelian_waveguide_state_v1';

export class FloquetNonAbelianPhotonicWaveguideEngine {
  private state: FloquetNonAbelianWaveguideState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): FloquetNonAbelianWaveguideState {
    const defaults: FloquetNonAbelianWaveguideState = {
      helixModulationFreqCm: 10.5,
      helixRadiusUm: 14.0,
      evanescentCouplingCm: 5.8,
      wilczekZeeHolonomyNorm: 0.86,
      floquetPiGapInverseCm: 3.42,
      homBraidingVisibilityPct: 91.5,
      activeRegime: 'wilczek-zee-non-abelian-holonomy',
      pulsePhase: 0,
      waveguideNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Floquet Photonic Waveguide state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Floquet Photonic Waveguide state:', e);
      }
    }
  }

  public getState(): Readonly<FloquetNonAbelianWaveguideState> {
    return this.state;
  }

  public setHelixModulationFreq(freqCm: number): void {
    this.state.helixModulationFreqCm = Math.max(1.0, Math.min(24.0, parseFloat(freqCm.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setHelixRadius(radiusUm: number): void {
    this.state.helixRadiusUm = Math.max(2.0, Math.min(35.0, parseFloat(radiusUm.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setEvanescentCoupling(couplingCm: number): void {
    this.state.evanescentCouplingCm = Math.max(0.5, Math.min(15.0, parseFloat(couplingCm.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FloquetPhotonicWaveguideRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'straight-abelian-waveguide-array':
        this.state.helixModulationFreqCm = 1.5;
        this.state.helixRadiusUm = 2.5;
        this.state.evanescentCouplingCm = 2.0;
        break;
      case 'anomalous-floquet-chiral-edge':
        this.state.helixModulationFreqCm = 9.0;
        this.state.helixRadiusUm = 12.0;
        this.state.evanescentCouplingCm = 5.0;
        break;
      case 'wilczek-zee-non-abelian-holonomy':
        this.state.helixModulationFreqCm = 14.5;
        this.state.helixRadiusUm = 19.0;
        this.state.evanescentCouplingCm = 8.2;
        break;
      case 'pi-mode-photonic-anyon-braider':
        this.state.helixModulationFreqCm = 21.0;
        this.state.helixRadiusUm = 30.0;
        this.state.evanescentCouplingCm = 12.8;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const omegaZ = this.state.helixModulationFreqCm;
    const rh = this.state.helixRadiusUm;
    const j0 = this.state.evanescentCouplingCm;

    // 合成規範勢無因次強度 A_eff ∝ R_h * Ω_z
    const gaugeStrength = (rh * omegaZ) / 120.0;

    // 非阿貝爾 Wilczek-Zee 和樂矩陣保真度 |Tr(U_WZ)|/N
    const wzNorm = Math.min(0.99, 0.18 + 0.62 * Math.tanh(gaugeStrength * 0.85) + 0.19 * Math.tanh(j0 / 8.0));
    this.state.wilczekZeeHolonomyNorm = parseFloat(wzNorm.toFixed(2));

    // 準能量 π-模拓撲能隙 Δε_π (cm⁻¹)
    const piGap = 0.25 * j0 * Math.sqrt(Math.max(0.1, gaugeStrength)) * (1 + 0.04 * omegaZ);
    this.state.floquetPiGapInverseCm = parseFloat(piGap.toFixed(2));

    // 雙光子 Hong-Ou-Mandel 非阿貝爾編織干涉可見度 V_HOM (%)
    const homVis = Math.min(99.6, 42.0 + 56.5 * wzNorm);
    this.state.homBraidingVisibilityPct = parseFloat(homVis.toFixed(1));

    // 生成 16 個三維螺旋調制光子波導與非阿貝爾零模編織節點
    const nodes: BraidedWaveguideCoreNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const isOuterEdge = i >= 8;
      const baseR = isOuterEdge ? 100 : 52;
      const direction = isOuterEdge ? 1 : -1;
      const angle = (i / 8) * 2 * Math.PI + direction * this.state.pulsePhase * 0.45;
      const helixShift = Math.min(18, rh * 0.45);

      const x = 165 + baseR * Math.cos(angle) + helixShift * Math.cos(this.state.pulsePhase * 2 + i);
      const y = 160 + baseR * Math.sin(angle) + helixShift * Math.sin(this.state.pulsePhase * 2 + i);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        zeroModeSubspaceIdx: (i % 4) + 1,
        syntheticGaugeFluxRad: parseFloat(((gaugeStrength + i * 0.4) % (2 * Math.PI)).toFixed(2)),
        holonomyMatrixWeight: parseFloat((0.35 + 0.6 * wzNorm).toFixed(2)),
        isPiModeEdgeChannel: isOuterEdge
      });
    }
    this.state.waveguideNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.9 + this.state.helixModulationFreqCm * 0.09;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerFloquetWaveguideSound(): void {
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

      const fBase = 360 + this.state.helixModulationFreqCm * 14;
      const fPeak = fBase + this.state.helixRadiusUm * 9 + this.state.evanescentCouplingCm * 18;

      osc1.frequency.setValueAtTime(fBase, t);
      osc1.frequency.exponentialRampToValueAtTime(fPeak, t + 0.34);

      osc2.frequency.setValueAtTime(fBase * 1.25, t);
      osc2.frequency.exponentialRampToValueAtTime(fPeak * 1.5, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.57);
      osc2.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in FloquetNonAbelianPhotonicWaveguideEngine:', e);
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

export const floquetNonAbelianPhotonicWaveguideEngine = new FloquetNonAbelianPhotonicWaveguideEngine();
