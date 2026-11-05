/**
 * 非阿貝爾量子自旋冰與湧現規範磁單極子電漿引擎
 * (Quantum Spin Ice Emergent U(1) Photons & Magnetic Monopole Plasma Engine)
 *
 * 物理原理：
 * 1. 在稀土焦綠石晶格 (Pyrochlore Lattice, 如 Yb2Ti2O7, Pr2Zr2O7, Ce2Zr2O7) 共角四面體網路上，
 *    伊辛自旋受阻挫滿足「二進二出」(2-in-2-out) 冰規則，等效於零散度規範場約束 \nabla \cdot \mathbf{E}_{em} = 0。
 * 2. 量子橫向自旋翻轉項 J_{\pm} (四面體六角環六自旋環交換 H_{ring} = -K \sum (S^+_1 S^-_2 S^+_3 S^-_4 S^+_5 S^-_6 + h.c.))
 *    將宏觀簡併自旋冰基態融化為三維緊緻 U(1) 量子自旋液體 (Quantum Spin Ice, QSI)。
 * 3. 其低能有效理論為「湧現量子電動力學」(Emergent QED)，同時具備三類奇異元激發：
 *    - 無能隙線性色散之「湧現光子」(Emergent Gapless Photons, 光速 c_{em} \propto K a / \hbar)；
 *    - 違反冰規則 (3-in-1-out / 1-in-3-out) 之帶電「湧現磁單極子 / 自旋子」(Emergent Magnetic Monopoles / Spinons)，
 *      在高濃度下形成庫侖德拜屏蔽磁單極子電漿，使中子散射針尖點 (Pinch Points) 展寬；
 *    - 攜帶湧現磁通 \pi 之有能隙「視覺子」(Visons)。
 */

export type QuantumSpinIceRegime =
  | 'classical-paulings-two-in-two-out-ice'
  | 'coherent-u1-quantum-spin-liquid-photon'
  | 'debye-screened-monopole-plasma-pinch'
  | 'pi-flux-fractionalized-vison-crystal';

export interface PyrochloreTetrahedronNode {
  id: number;
  x: number;
  y: number;
  spinIceRuleConfig: '2-in-2-out' | '3-in-1-out-monopole' | '1-in-3-out-antimonopole' | 'pi-flux-vison';
  emergentElectricFlux: number;
  ringExchangeCoherence: number;
  pinchPointIntensity: number;
}

export interface QuantumSpinIceState {
  transverseExchangeRatioJpm: number;     // 量子橫向交換耦合比 J_{\pm} / J_{zz} (0.01 ~ 0.35)
  effectiveFineStructureAlpha: number;    // 湧現量子電動力學精細結構常數 \alpha_{em} = e_{em}^2 / (4\pi\varepsilon_{em}\hbar c_{em})
  emergentLightSpeedMps: number;          // 湧現光子傳播群速度 c_{em} (m/s)
  monopolePlasmaDensityPct: number;       // 違反冰規則之湧現磁單極子電漿濃度 n_{mono} (%)
  pinchPointSharpnessRatio: number;       // 中子散射結構因子針尖點銳利度 S_{pinch}(Q) (0.000 ~ 1.000)
  visonGapEnergyMeV: number;              // 湧現 \pi-磁通視覺子拓撲激發能隙 \Delta_{vison} (meV)
  activeRegime: QuantumSpinIceRegime;
  pulsePhase: number;
  tetrahedronNodes: PyrochloreTetrahedronNode[];
}

const STORAGE_KEY = 'newworld_quantum_spin_ice_monopole_state_v1';

export class QuantumSpinIceMonopolePlasmaEngine {
  private state: QuantumSpinIceState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): QuantumSpinIceState {
    const defaults: QuantumSpinIceState = {
      transverseExchangeRatioJpm: 0.14,
      effectiveFineStructureAlpha: 0.082,
      emergentLightSpeedMps: 18.4,
      monopolePlasmaDensityPct: 6.8,
      pinchPointSharpnessRatio: 0.892,
      visonGapEnergyMeV: 0.42,
      activeRegime: 'coherent-u1-quantum-spin-liquid-photon',
      pulsePhase: 0,
      tetrahedronNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Quantum Spin Ice state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Quantum Spin Ice state:', e);
      }
    }
  }

  public getState(): Readonly<QuantumSpinIceState> {
    return this.state;
  }

  public setTransverseExchangeRatio(jpm: number): void {
    this.state.transverseExchangeRatioJpm = Math.max(0.01, Math.min(0.35, parseFloat(jpm.toFixed(3))));
    this.recomputePhysics();
    this.saveState();
  }

  public setMonopolePlasmaDensity(densityPct: number): void {
    this.state.monopolePlasmaDensityPct = Math.max(0.5, Math.min(65.0, parseFloat(densityPct.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: QuantumSpinIceRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'classical-paulings-two-in-two-out-ice':
        this.state.transverseExchangeRatioJpm = 0.02;
        this.state.monopolePlasmaDensityPct = 2.0;
        break;
      case 'coherent-u1-quantum-spin-liquid-photon':
        this.state.transverseExchangeRatioJpm = 0.14;
        this.state.monopolePlasmaDensityPct = 6.8;
        break;
      case 'debye-screened-monopole-plasma-pinch':
        this.state.transverseExchangeRatioJpm = 0.18;
        this.state.monopolePlasmaDensityPct = 42.5;
        break;
      case 'pi-flux-fractionalized-vison-crystal':
        this.state.transverseExchangeRatioJpm = 0.28;
        this.state.monopolePlasmaDensityPct = 11.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const jpm = this.state.transverseExchangeRatioJpm;
    const nMono = this.state.monopolePlasmaDensityPct;

    // 六角環交換振幅 K \propto J_{\pm}^3 / J_{zz}^2 決定湧現光速 c_{em} 與視覺子能隙
    const ringExchangeK = 120.0 * Math.pow(jpm, 2.2);
    this.state.emergentLightSpeedMps = parseFloat(Math.max(0.8, 3.2 + ringExchangeK * 8.5).toFixed(1));

    // 湧現精細結構常數 \alpha_{em}（隨環交換增強而受到真空極化重整化，通常約為 ~ 1/10，遠大於真實宇宙 1/137）
    const alphaEm = 0.045 + 0.26 * jpm * (1.0 + 0.006 * nMono);
    this.state.effectiveFineStructureAlpha = parseFloat(alphaEm.toFixed(3));

    // 視覺子能隙 \Delta_{vison} (meV)
    const visonBoost = this.state.activeRegime === 'pi-flux-fractionalized-vison-crystal' ? 1.45 : 1.0;
    const visonGap = (0.06 + 2.4 * Math.pow(jpm, 1.5)) * visonBoost;
    this.state.visonGapEnergyMeV = parseFloat(visonGap.toFixed(3));

    // 中子散射結構因子針尖點銳利度 S_{pinch}(Q)：受磁單極子電漿德拜長度 \lambda_D^{-1} \propto \sqrt{n_{mono}} 展寬衰減
    const debyeBroadening = Math.exp(-nMono / 32.0);
    const quantumSuppression = 1.0 - 0.22 * jpm;
    this.state.pinchPointSharpnessRatio = parseFloat(Math.max(0.08, debyeBroadening * quantumSuppression).toFixed(3));

    // 生成 16 個焦綠石共角四面體與六角環交換節點
    const nodes: PyrochloreTetrahedronNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let config: '2-in-2-out' | '3-in-1-out-monopole' | '1-in-3-out-antimonopole' | 'pi-flux-vison' = '2-in-2-out';
      if (this.state.activeRegime === 'pi-flux-fractionalized-vison-crystal' && i % 3 === 0) {
        config = 'pi-flux-vison';
      } else if (nMono > 20.0 && i % 2 === 0) {
        config = i % 4 === 0 ? '3-in-1-out-monopole' : '1-in-3-out-antimonopole';
      } else if (i % 5 === 0) {
        config = '3-in-1-out-monopole';
      } else if (i % 5 === 2) {
        config = '1-in-3-out-antimonopole';
      }

      const ring = i < 6 ? 0 : 1;
      const idx = ring === 0 ? i : i - 6;
      const total = ring === 0 ? 6 : 10;
      const angle = (idx / total) * 2.0 * Math.PI + this.state.pulsePhase * (ring === 0 ? 0.36 : -0.28);
      const r = ring === 0 ? 48 : 88;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        spinIceRuleConfig: config,
        emergentElectricFlux: parseFloat((config === '2-in-2-out' ? 0.0 : config === '3-in-1-out-monopole' ? 1.0 : config === '1-in-3-out-antimonopole' ? -1.0 : 0.5).toFixed(1)),
        ringExchangeCoherence: parseFloat(Math.min(0.99, jpm * 3.1).toFixed(2)),
        pinchPointIntensity: parseFloat((this.state.pinchPointSharpnessRatio * (0.75 + 0.25 * Math.cos(angle * 2))).toFixed(3))
      });
    }
    this.state.tetrahedronNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.72 + (this.state.emergentLightSpeedMps / 25.0) * 0.65;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerQuantumSpinIceSound(): void {
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
      const oscPhoton = this.audioCtx.createOscillator();
      const oscMonopole = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscPhoton.type = 'sine';
      oscMonopole.type = 'triangle';

      // 湧現光子線性色散模與有能隙磁單極子電漿振盪模之雙重共鳴
      const fPhoton = 270 + this.state.emergentLightSpeedMps * 8.5;
      const fMonopole = fPhoton * (1.25 + this.state.effectiveFineStructureAlpha * 2.5);

      oscPhoton.frequency.setValueAtTime(fPhoton, t);
      oscMonopole.frequency.setValueAtTime(fMonopole, t);
      oscMonopole.frequency.exponentialRampToValueAtTime(fPhoton * 1.5, t + 0.42);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscPhoton.connect(gain);
      oscMonopole.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscPhoton.start(t);
      oscMonopole.start(t);
      oscPhoton.stop(t + 0.58);
      oscMonopole.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in QuantumSpinIceMonopolePlasmaEngine:', e);
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

export const quantumSpinIceMonopolePlasmaEngine = new QuantumSpinIceMonopolePlasmaEngine();
