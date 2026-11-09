/**
 * 拓撲非阿貝爾馬約拉納超流渦旋晶格與通用拓撲量子編織計算機引擎
 * (Topological Non-Abelian Majorana Superfluid Vortex Lattice & Universal Braiding Quantum Computer Engine)
 *
 * 物理原理：
 * 1. 在二維手性 p_x + i p_y 拓撲超流體/超導體中，每個半量子阿布里科索夫-約瑟夫森磁通渦旋 (\Phi_0 / 2 = h / 4e)
 *    在其渦旋核心束縛一個零能馬約拉納-里德-格林零模 (Majorana Zero Mode, \gamma_i = \gamma_i^\dagger)，
 *    受到 Caroli-de Gennes-Matricon 迷你能隙 \Delta_{CdGM} \approx \Delta_0^2 / E_F 的拓撲保護。
 * 2. 絕熱交換第 i 與第 j 個渦旋將對 2^{N_v/2 - 1} 維簡併基態流形施加非阿貝爾伊凡諾夫編織算符
 *    (Ivanov Braid Operator): U_{ij} = \exp(\frac{\pi}{4}\gamma_i \gamma_j) = \frac{1}{\sqrt{2}}(1 + \gamma_i \gamma_j)，
 *    精確實現容錯 Clifford 量子邏輯閘 (Hadamard, Phase S, CNOT)。
 * 3. 為了突破伊辛任意子僅能生成 Clifford 群之限制，結合動態磁通干涉相位門與「魔術態蒸餾」
 *    (15-to-1 Bravyi-Kitaev Magic State Distillation for \pi/8 T-Gate)，可抑制指數級低溫準粒子毒化率
 *    \Gamma_{QP} \propto \exp(-\Delta_{CdGM} / k_B T)，達成通用容錯拓撲量子計算 (Universal Topological Quantum Computation)。
 */

export type MajoranaVortexBraidingRegime =
  | 'ivanov-half-quantum-vortex-clifford-braid'
  | 'fermion-parity-interferometric-readout'
  | 'bravyi-kitaev-magic-state-t-gate-distillation'
  | 'fault-tolerant-universal-braid-circuit';

export interface MajoranaVortexCoreNode {
  id: number;
  x: number;
  y: number;
  vortexRole: 'majorana-zero-mode-core' | 'magic-state-ancilla-vortex' | 'parity-readout-fusion-pair';
  fermionParityEigenvalue: 1 | -1;
  cdgmMinigapMeV: number;
  braidWordAccumulatedPhasePi4: number;
}

export interface MajoranaVortexBraidingState {
  cdgmCoreMinigapRatio: number;           // 渦旋核心 CdGM 迷你能隙與溫度比 \Delta_{CdGM} / (k_B T) (2.0 ~ 24.0)
  activeHalfQuantumVortexCount: number;   // 參與編織之半量子渦旋總數 2N (偶數 4 ~ 16)
  logicalCliffordGateErrorLog10: number;  // 拓撲保護邏輯 Clifford 編織閘錯誤率對數 log10(p_{braid})
  magicStateDistillationFidelity: number; // 15-to-1 魔術態蒸餾 \pi/8 T-閘保真度 F_T (0.9000 ~ 0.9999)
  quasiparticlePoisoningTimeMs: number;   // 準粒子毒化奇偶性翻轉相干時間 \tau_{QP} (ms)
  groundStateManifoldDimension: number;   // 拓撲簡併基態希爾伯特空間維度 2^{N-1}
  activeRegime: MajoranaVortexBraidingRegime;
  pulsePhase: number;
  vortexNodes: MajoranaVortexCoreNode[];
}

const STORAGE_KEY = 'newworld_majorana_vortex_braiding_computer_state_v1';

export class MajoranaSuperfluidVortexBraidingComputerEngine {
  private state: MajoranaVortexBraidingState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): MajoranaVortexBraidingState {
    const defaults: MajoranaVortexBraidingState = {
      cdgmCoreMinigapRatio: 14.5,
      activeHalfQuantumVortexCount: 8,
      logicalCliffordGateErrorLog10: -9.85,
      magicStateDistillationFidelity: 0.9992,
      quasiparticlePoisoningTimeMs: 420.0,
      groundStateManifoldDimension: 8,
      activeRegime: 'fault-tolerant-universal-braid-circuit',
      pulsePhase: 0,
      vortexNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Majorana Vortex Braiding state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Majorana Vortex Braiding state:', e);
      }
    }
  }

  public getState(): Readonly<MajoranaVortexBraidingState> {
    return this.state;
  }

  public setCdgmCoreMinigapRatio(ratio: number): void {
    this.state.cdgmCoreMinigapRatio = Math.max(2.0, Math.min(24.0, parseFloat(ratio.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setActiveHalfQuantumVortexCount(count2N: number): void {
    const clamped = Math.max(4, Math.min(16, Math.round(count2N)));
    this.state.activeHalfQuantumVortexCount = clamped % 2 === 0 ? clamped : clamped + 1;
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: MajoranaVortexBraidingRegime): void {
    this.state.activeHalfQuantumVortexCount = 8;
    this.state.activeRegime = regime;
    switch (regime) {
      case 'ivanov-half-quantum-vortex-clifford-braid':
        this.state.cdgmCoreMinigapRatio = 11.0;
        this.state.activeHalfQuantumVortexCount = 6;
        break;
      case 'fermion-parity-interferometric-readout':
        this.state.cdgmCoreMinigapRatio = 14.0;
        this.state.activeHalfQuantumVortexCount = 8;
        break;
      case 'bravyi-kitaev-magic-state-t-gate-distillation':
        this.state.cdgmCoreMinigapRatio = 17.5;
        this.state.activeHalfQuantumVortexCount = 12;
        break;
      case 'fault-tolerant-universal-braid-circuit':
        this.state.cdgmCoreMinigapRatio = 21.0;
        this.state.activeHalfQuantumVortexCount = 14;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const gapRatio = this.state.cdgmCoreMinigapRatio;
    const nVortices = this.state.activeHalfQuantumVortexCount;
    const pairsN = Math.floor(nVortices / 2);

    // 拓撲簡併基態維度 2^{N - 1} (固定總費米子奇偶性下)
    this.state.groundStateManifoldDimension = Math.pow(2, Math.max(1, pairsN - 1));

    // 拓撲保護邏輯編織閘錯誤率 log10(p_{braid}) \propto -0.434 \Delta_{CdGM} / (k_B T)
    const errLog = -2.4 - 0.52 * gapRatio;
    this.state.logicalCliffordGateErrorLog10 = parseFloat(errLog.toFixed(2));

    // 準粒子毒化保護時間 \tau_{QP} (ms)
    const qpTime = Math.min(2500.0, 4.5 * Math.exp(0.32 * gapRatio));
    this.state.quasiparticlePoisoningTimeMs = parseFloat(qpTime.toFixed(1));

    // 15-to-1 Bravyi-Kitaev 魔術態蒸餾後之 \pi/8 T-閘保真度 (錯誤率壓縮為 35 p^3)
    const rawError = Math.max(0.001, 0.12 * Math.exp(-0.18 * gapRatio));
    const distilledError = Math.min(0.08, 35.0 * Math.pow(rawError, 3));
    this.state.magicStateDistillationFidelity = parseFloat((1.0 - distilledError).toFixed(4));

    // 生成 16 個超流渦旋晶格與世界線編織節點
    const nodes: MajoranaVortexCoreNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let role: 'majorana-zero-mode-core' | 'magic-state-ancilla-vortex' | 'parity-readout-fusion-pair' = 'majorana-zero-mode-core';
      if (i % 4 === 3) role = 'magic-state-ancilla-vortex';
      else if (i % 4 === 1) role = 'parity-readout-fusion-pair';

      // 成對渦旋在平面上跳 8 字形伊凡諾夫世界線編織舞步 (Figure-8 Braid Dance)
      const pairIdx = Math.floor(i / 2);
      const isRight = i % 2 === 1;
      const baseAngle = (pairIdx / 8) * 2.0 * Math.PI;
      const centerR = 76;
      const cx = 165 + centerR * Math.cos(baseAngle);
      const cy = 160 + centerR * Math.sin(baseAngle);

      const braidAngle = this.state.pulsePhase * 1.15 + pairIdx * 0.75 + (isRight ? Math.PI : 0);
      const x = cx + 18 * Math.cos(braidAngle);
      const y = cy + 11 * Math.sin(2.0 * braidAngle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        vortexRole: role,
        fermionParityEigenvalue: (i + Math.floor(this.state.pulsePhase)) % 2 === 0 ? 1 : -1,
        cdgmMinigapMeV: parseFloat((0.08 * gapRatio).toFixed(2)),
        braidWordAccumulatedPhasePi4: (i % 8) + 1
      });
    }
    this.state.vortexNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.76 + (this.state.cdgmCoreMinigapRatio / 24.0) * 0.72;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerMajoranaBraidingSound(): void {
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
      const oscBraid1 = this.audioCtx.createOscillator();
      const oscBraid2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscBraid1.type = 'sine';
      oscBraid2.type = 'triangle';

      // 伊凡諾夫 \pi/4 編織非阿貝爾統計相位與 \pi/8 魔術態 T-閘四度/五度互鎖音
      const fBase = 270 + this.state.cdgmCoreMinigapRatio * 10.5;
      const fMagicT = fBase * Math.pow(2, 5 / 12);

      oscBraid1.frequency.setValueAtTime(fBase, t);
      oscBraid1.frequency.exponentialRampToValueAtTime(fMagicT, t + 0.26);
      oscBraid1.frequency.exponentialRampToValueAtTime(fBase, t + 0.52);

      oscBraid2.frequency.setValueAtTime(fMagicT, t);
      oscBraid2.frequency.exponentialRampToValueAtTime(fBase, t + 0.26);
      oscBraid2.frequency.exponentialRampToValueAtTime(fMagicT * 1.25, t + 0.52);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscBraid1.connect(gain);
      oscBraid2.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscBraid1.start(t);
      oscBraid2.start(t);
      oscBraid1.stop(t + 0.58);
      oscBraid2.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in MajoranaSuperfluidVortexBraidingComputerEngine:', e);
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

export const majoranaSuperfluidVortexBraidingComputerEngine = new MajoranaSuperfluidVortexBraidingComputerEngine();
