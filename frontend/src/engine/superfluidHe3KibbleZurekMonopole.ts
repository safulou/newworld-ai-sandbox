/**
 * 超流氦-3 宇宙學基布爾-祖瑞克相變單極子與愛因斯坦-嘉當扭率渦旋模擬器引擎
 * (Superfluid He-3 Cosmological Kibble-Zurek Monopole & Einstein-Cartan Torsion Vortex Simulator Engine)
 *
 * 物理原理：
 * 1. 根據 Volovik「氦液滴中的宇宙」(The Universe in a Helium Droplet) 理論，超流 ^3He 的序參量矩陣 A_{\alpha i}
 *    同時破缺軌道旋轉群 SO(3)_L、自旋旋轉群 SO(3)_S 與規範對稱群 U(1)_N。
 * 2. 當透過慢中子捕獲反應 (n + ^3He \to p + ^3H + 764 keV) 局部快速加熱並以淬火時間尺度 \tau_Q 跨越超流轉變溫度 T_c \approx 1 \sim 2.5 mK 時，
 *    基布爾-祖瑞克機制 (Kibble-Zurek Mechanism, KZM) 主導早期宇宙弦網路與拓撲缺陷的生成密度：
 *    n_{vortex} \propto (\tau_0 / \tau_Q)^{2\nu / (1 + z\nu)} = (\tau_0 / \tau_Q)^{1/2}。
 * 3. 在手性 ^3He-A 相與各向同性 ^3He-B 相界面處，承載終結渦旋弦之「狄拉克磁單極子 / Boojum 表面單極」(\pi_2 同倫荷 N_{monopole})，
 *    且軌道角動量單軸織構 \hat{l}(r) 的旋度在 Bogoliubov 外爾準粒子有效時空中誘導出非零「愛因斯坦-嘉當扭率張量」
 *    (Einstein-Cartan Spacetime Torsion, T^\lambda_{\mu\nu} = \partial_\mu e^\lambda_\nu - \partial_\nu e^\lambda_\mu) 與手性反常譜流。
 */

export type He3KibbleZurekRegime =
  | 'neutron-quench-kibble-zurek-vortex-tangle'
  | 'chiral-he3a-weyl-einstein-cartan-torsion'
  | 'ab-interface-dirac-monopole-boojum-array'
  | 'half-quantum-alice-string-vortex-ring';

export interface He3TopologicalDefectNode {
  id: number;
  x: number;
  y: number;
  defectHomotopyType: 'pi1-vortex-string' | 'pi2-dirac-monopole' | 'boojum-surface-defect';
  torsionFieldStrength: number;
  kibbleZurekDomainRadiusUm: number;
  spectralFlowChiralRate: number;
}

export interface SuperfluidHe3KibbleZurekState {
  quenchRateInverseTauQ: number;          // 快速相變淬火速率比 \tau_0 / \tau_Q (×10^{-3}, 0.20 ~ 8.50)
  abPhaseBoundaryPressureBar: number;     // 超流 ^3He A-B 相變壓力 P (bar, 1.0 ~ 34.0)
  kibbleZurekVortexDensityMm2: number;    // 基布爾-祖瑞克拓撲渦旋弦生成密度 n_{KZ} (mm^{-2})
  einsteinCartanTorsionScalar: number;    // 湧現愛因斯坦-嘉當有效時空扭率標量 |T_{\mu\nu}^\lambda| (相對單位)
  diracMonopoleHomotopyCount: number;     // A-B 相界面 \pi_2 狄拉克單極子與 Boojum 拓撲荷總數 N_{mono}
  chiralSpectralFlowAnomalyKhz: number;   // 貝ヴिला夸-沃洛維克 (Bevilaqua-Volovik) 手性反常動量譜流率 (kHz)
  activeRegime: He3KibbleZurekRegime;
  pulsePhase: number;
  defectNodes: He3TopologicalDefectNode[];
}

const STORAGE_KEY = 'newworld_superfluid_he3_kibble_zurek_state_v1';

export class SuperfluidHe3KibbleZurekMonopoleEngine {
  private state: SuperfluidHe3KibbleZurekState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): SuperfluidHe3KibbleZurekState {
    const defaults: SuperfluidHe3KibbleZurekState = {
      quenchRateInverseTauQ: 3.40,
      abPhaseBoundaryPressureBar: 24.5,
      kibbleZurekVortexDensityMm2: 142.6,
      einsteinCartanTorsionScalar: 2.84,
      diracMonopoleHomotopyCount: 8,
      chiralSpectralFlowAnomalyKhz: 64.2,
      activeRegime: 'ab-interface-dirac-monopole-boojum-array',
      pulsePhase: 0,
      defectNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Superfluid He-3 Kibble-Zurek state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Superfluid He-3 Kibble-Zurek state:', e);
      }
    }
  }

  public getState(): Readonly<SuperfluidHe3KibbleZurekState> {
    return this.state;
  }

  public setQuenchRateInverseTauQ(qRate: number): void {
    this.state.quenchRateInverseTauQ = Math.max(0.20, Math.min(8.50, parseFloat(qRate.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setAbPhasePressureBar(pressureBar: number): void {
    this.state.abPhaseBoundaryPressureBar = Math.max(1.0, Math.min(34.0, parseFloat(pressureBar.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: He3KibbleZurekRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'neutron-quench-kibble-zurek-vortex-tangle':
        this.state.quenchRateInverseTauQ = 6.80;
        this.state.abPhaseBoundaryPressureBar = 14.0;
        break;
      case 'chiral-he3a-weyl-einstein-cartan-torsion':
        this.state.quenchRateInverseTauQ = 2.60;
        this.state.abPhaseBoundaryPressureBar = 31.5;
        break;
      case 'ab-interface-dirac-monopole-boojum-array':
        this.state.quenchRateInverseTauQ = 3.40;
        this.state.abPhaseBoundaryPressureBar = 24.5;
        break;
      case 'half-quantum-alice-string-vortex-ring':
        this.state.quenchRateInverseTauQ = 4.90;
        this.state.abPhaseBoundaryPressureBar = 28.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const qRate = this.state.quenchRateInverseTauQ;
    const pBar = this.state.abPhaseBoundaryPressureBar;

    // 基布爾-祖瑞克標度律：n_{KZ} \propto (\tau_0 / \tau_Q)^{1/2} * (1 + 0.015 P)
    const kzDensity = 62.5 * Math.sqrt(qRate) * (1.0 + 0.014 * pBar);
    this.state.kibbleZurekVortexDensityMm2 = parseFloat(kzDensity.toFixed(1));

    // 愛因斯坦-嘉當有效時空扭率標量 |T^\lambda_{\mu\nu}|：在高壓手性 ^3He-A 穩態區 (P > 21 bar) 顯著增強
    const aPhaseWeight = 1.0 / (1.0 + Math.exp(-(pBar - 20.5) / 3.2));
    const torsion = (0.65 + 2.45 * aPhaseWeight) * Math.pow(qRate, 0.35);
    this.state.einsteinCartanTorsionScalar = parseFloat(torsion.toFixed(2));

    // A-B 相界面 \pi_2 狄拉克磁單極子與 Boojum 總荷數 N_{mono}
    const monoCount = Math.max(2, Math.round(2 + 4.5 * aPhaseWeight * Math.sqrt(qRate)));
    this.state.diracMonopoleHomotopyCount = monoCount;

    // 沃洛維克手性反常動量譜流率 (Adler-Bell-Jackiw Chiral Anomaly in ^3He-A)
    const spectralFlow = 14.5 * torsion * Math.sqrt(qRate);
    this.state.chiralSpectralFlowAnomalyKhz = parseFloat(spectralFlow.toFixed(1));

    // 生成 16 個宇宙弦渦旋、A-B 界面狄拉克單極子與 Boojum 拓撲缺陷節點
    const nodes: He3TopologicalDefectNode[] = [];
    const count = 16;
    const kzDomainUm = parseFloat((120.0 / Math.sqrt(kzDensity)).toFixed(1));

    for (let i = 0; i < count; i++) {
      const defectType: 'pi1-vortex-string' | 'pi2-dirac-monopole' | 'boojum-surface-defect' =
        i % 3 === 0 ? 'pi2-dirac-monopole' : i % 3 === 1 ? 'pi1-vortex-string' : 'boojum-surface-defect';

      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * (defectType === 'pi2-dirac-monopole' ? 0.28 : -0.36);
      const r = defectType === 'pi2-dirac-monopole' ? 52 : defectType === 'pi1-vortex-string' ? 76 : 96;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        defectHomotopyType: defectType,
        torsionFieldStrength: this.state.einsteinCartanTorsionScalar,
        kibbleZurekDomainRadiusUm: kzDomainUm,
        spectralFlowChiralRate: parseFloat((this.state.chiralSpectralFlowAnomalyKhz * (0.75 + 0.25 * Math.sin(angle))).toFixed(1))
      });
    }
    this.state.defectNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.72 + (this.state.einsteinCartanTorsionScalar / 4.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerHe3KibbleZurekSound(): void {
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
      const oscA = this.audioCtx.createOscillator();
      const oscB = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscA.type = 'sine';
      oscB.type = 'triangle';

      // ^3He-A 手性外爾扭率模與 ^3He-B 各向同性準粒子模之相變諧音
      const fBase = 260 + this.state.kibbleZurekVortexDensityMm2 * 1.1;
      const fTorsion = fBase * (1.0 + 0.12 * this.state.einsteinCartanTorsionScalar);

      oscA.frequency.setValueAtTime(fBase, t);
      oscA.frequency.exponentialRampToValueAtTime(fTorsion, t + 0.38);

      oscB.frequency.setValueAtTime(fTorsion, t);
      oscB.frequency.exponentialRampToValueAtTime(fBase, t + 0.38);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscA.connect(gain);
      oscB.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscA.start(t);
      oscB.start(t);
      oscA.stop(t + 0.58);
      oscB.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in SuperfluidHe3KibbleZurekMonopoleEngine:', e);
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

export const superfluidHe3KibbleZurekMonopoleEngine = new SuperfluidHe3KibbleZurekMonopoleEngine();
