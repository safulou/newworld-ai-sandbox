/**
 * 手性外爾半金屬拓撲超導二極體網絡引擎 (Chiral Weyl Superconducting Diode Network Engine)
 * 
 * 物理原理：
 * 1. 手性外爾半金屬 (Chiral Weyl Semimetal) 具備動量空間分離的外爾節點對 (k_W = ±k_0 ẑ) 與表面拓撲非平庸的費米弧 (Fermi Arcs)。
 * 2. 與多端點超導電極近鄰耦合構建 4-端點超導結網絡 (Multi-Terminal Josephson Diode Network)；
 *    外爾手性反常與手性磁效應 (CME: J_CME = (e²/4π²ℏ²) μ_5 B) 誘導多端點間的反常相位差矩陣 φ₀,ij。
 * 3. 各超導端點間的臨界電流呈現顯著非對稱性 (I_c,ij⁺ ≠ |I_c,ij⁻|)，構成可編程無耗散超導二極體整流張量：
 *    R_ij = (I_c,ij⁺ - |I_c,ij⁻|) / (I_c,ij⁺ + |I_c,ij⁻|)
 * 4. 透過調控 4 端點相位差向量 (φ₁, φ₂, φ₃, φ₄)，系統可動態重組為超導無耗散邏輯閘（AND / OR / XOR），
 *    展現拓撲保護的非互易量子布林運算與非阿貝爾環流干涉。
 */

export type WeylDiodeRegime = 
  | 'quiescent-multi-terminal'
  | 'fermi-arc-supercurrent'
  | 'programmable-diode-rectification'
  | 'non-abelian-circulation-interference';

export interface WeylDiodeState {
  chiralChemicalPotentialMu5: number;// 手性化學勢 μ_5 (meV, 0 ~ 25)
  weylNodeSeparationK0: number;      // 外爾節點動量間距 k_0 (nm⁻¹, 0.1 ~ 1.0)
  multiTerminalCount: number;        // 端點數量 (固定為 4)
  networkDiodeEfficiencyPercent: number; // 全網絡平均整流效率 η_net (%)
  fermiArcTransparency: number;      // 費米弧界面穿透率 (0.0 ~ 1.0)
  logicGateMode: 'AND' | 'OR' | 'XOR';// 當前可編程邏輯狀態
  terminalPhasesRad: number[];       // 4 端點超導相位 (rad)
  rectificationMatrix: number[][];   // 4x4 整流效率矩陣 R_ij
  activeRegime: WeylDiodeRegime;
  pulsePhase: number;
}

const STORAGE_KEY = 'newworld_weyl_superconducting_diode_network_state_v1';

export class WeylSuperconductingDiodeNetworkEngine {
  private state: WeylDiodeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): WeylDiodeState {
    const defaults: WeylDiodeState = {
      chiralChemicalPotentialMu5: 12.5,
      weylNodeSeparationK0: 0.45,
      multiTerminalCount: 4,
      networkDiodeEfficiencyPercent: 28.6,
      fermiArcTransparency: 0.88,
      logicGateMode: 'XOR',
      terminalPhasesRad: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2],
      rectificationMatrix: [
        [0, 0.32, -0.28, 0.15],
        [-0.32, 0, 0.35, -0.22],
        [0.28, -0.35, 0, 0.31],
        [-0.15, 0.22, -0.31, 0]
      ],
      activeRegime: 'programmable-diode-rectification',
      pulsePhase: 0
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Weyl Diode Network state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Weyl Diode Network state to localStorage:', e);
      }
    }
  }

  public getState(): WeylDiodeState {
    return { ...this.state };
  }

  public setChiralChemicalPotential(mu5: number): void {
    this.state.chiralChemicalPotentialMu5 = Math.max(0, Math.min(25, mu5));
    this.recomputePhysics();
    this.saveState();
  }

  public setWeylNodeSeparation(k0: number): void {
    this.state.weylNodeSeparationK0 = Math.max(0.1, Math.min(1.0, k0));
    this.recomputePhysics();
    this.saveState();
  }

  public setLogicGateMode(mode: 'AND' | 'OR' | 'XOR'): void {
    this.state.logicGateMode = mode;
    if (mode === 'AND') {
      this.state.terminalPhasesRad = [0, 0.3, 0.3, 1.2];
    } else if (mode === 'OR') {
      this.state.terminalPhasesRad = [0, 0.8, 0.8, 0.4];
    } else { // XOR
      this.state.terminalPhasesRad = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    }
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: WeylDiodeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'quiescent-multi-terminal':
        this.state.chiralChemicalPotentialMu5 = 0.0;
        this.state.fermiArcTransparency = 0.2;
        break;
      case 'fermi-arc-supercurrent':
        this.state.chiralChemicalPotentialMu5 = 6.0;
        this.state.fermiArcTransparency = 0.75;
        break;
      case 'programmable-diode-rectification':
        this.state.chiralChemicalPotentialMu5 = 15.0;
        this.state.fermiArcTransparency = 0.92;
        break;
      case 'non-abelian-circulation-interference':
        this.state.chiralChemicalPotentialMu5 = 22.0;
        this.state.fermiArcTransparency = 0.98;
        break;
    }
    this.recomputePhysics();
    this.playRegimeTransitionTone(regime);
    this.saveState();
  }

  public triggerNetworkLogicPulse(): void {
    this.state.pulsePhase = 1.0;
    this.playLogicSwitchTone();
  }

  public triggerChirpAudio(): void {
    this.triggerNetworkLogicPulse();
  }

  public resetDefaults(): void {
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

  private recomputePhysics(): void {
    const { chiralChemicalPotentialMu5: mu5, fermiArcTransparency: trans, activeRegime } = this.state;

    // 計算整流張量 R_ij
    let baseEta = 0;
    if (activeRegime === 'quiescent-multi-terminal') {
      baseEta = 0.0;
    } else if (activeRegime === 'fermi-arc-supercurrent') {
      baseEta = 14.5 + this.state.weylNodeSeparationK0 * 5.0;
    } else if (activeRegime === 'programmable-diode-rectification') {
      baseEta = 10.0 + (mu5 / 25.0) * 20.0 * trans + this.state.weylNodeSeparationK0 * 10.0;
    } else { // non-abelian-circulation-interference
      baseEta = 38.5 + this.state.weylNodeSeparationK0 * 8.0;
    }
    this.state.networkDiodeEfficiencyPercent = Math.min(65.0, baseEta);

    // 4x4 非對稱整流矩陣生成
    const matrix: number[][] = [];
    const factor = this.state.networkDiodeEfficiencyPercent / 100.0;
    for (let i = 0; i < 4; i++) {
      const row: number[] = [];
      for (let j = 0; j < 4; j++) {
        if (i === j) {
          row.push(0);
        } else {
          const val = factor * Math.sin((i - j) * 1.2 + 0.4);
          row.push(parseFloat(val.toFixed(2)));
        }
      }
      matrix.push(row);
    }
    this.state.rectificationMatrix = matrix;
  }

  public update(dt: number): void {
    // 緩慢進動端點相位
    this.state.terminalPhasesRad = this.state.terminalPhasesRad.map(p => (p + dt * 0.5) % (2 * Math.PI));
    this.state.pulsePhase = (this.state.pulsePhase + dt * 2.0) % (2 * Math.PI);
  }

  // 純代碼 Web Audio 程序化合成音效
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private playRegimeTransitionTone(regime: WeylDiodeRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      const chords: Record<WeylDiodeRegime, number[]> = {
        'quiescent-multi-terminal': [261.63, 329.63],
        'fermi-arc-supercurrent': [329.63, 392.00, 523.25],
        'programmable-diode-rectification': [261.63, 329.63, 392.00, 523.25], // C大調四和弦
        'non-abelian-circulation-interference': [349.23, 440.00, 523.25, 698.46]
      };

      const selected = chords[regime] || [330];
      selected.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
      });
    } catch (e) {
      console.warn('Weyl diode audio error:', e);
    }
  }

  private playLogicSwitchTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      // 手性磁效應進動音 (300 -> 750 Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Logic audio error:', e);
    }
  }
}

export const weylSuperconductingDiodeNetworkEngine = new WeylSuperconductingDiodeNetworkEngine();
