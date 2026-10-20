/**
 * 交錯磁性體手性自旋分光器與非互易自旋波二極體引擎
 * (Altermagnetic Chiral Spin-Splitter & Non-Reciprocal Magnonic Diode Engine)
 *
 * 物理原理：
 * 1. 交錯磁性 (Altermagnetism，如 RuO₂, MnTe, CrSb) 是超越鐵磁性與共線反鐵磁性的第三類基本磁有序相。
 *    其相反自旋子晶格透過晶體旋轉或鏡像對稱操作 [C_2 ∥ C_4z] 相連而非平移或反演，因此在淨磁化強度 M_net = 0
 *    的同時，於動量空間展現奇異的非相對論性動量依賴自旋劈裂 ΔE(k) = Δ_alt cos(N_l φ_k) (d-wave N_l=2, g-wave N_l=4, i-wave N_l=6)。
 * 2. 在縱向電荷流 J_c 驅動下，各向異性自旋極化費米面誘導巨幅「自旋分光效應」(Spin-Splitter Effect, SSE)，
 *    無需重元素自旋-軌道耦合即可產生橫向純自旋流 J_s，自旋分光角 θ_SS = arctan(σ_xy^s / σ_xx) 可達 25° ~ 35°。
 * 3. 其集體磁振子激發 (Chiral Altermagnetic Magnons) 具手性劈裂 Δω_q = ω_+(q) - ω_-(q)，並隨奈爾向量 (Néel Vector L)
 *    結晶取向調控反常霍爾電導率 σ_xy^AHE 與非互易自旋波二極體整流效率 η_diode。
 */

export type AltermagneticSymmetryRegime =
  | 'collinear-afm-degenerate'
  | 'd-wave-rutile-spin-splitter'
  | 'g-wave-hexagonal-altermagnet'
  | 'i-wave-chiral-magnon-diode';

export interface AltermagneticFermiLobeNode {
  id: number;
  x: number;
  y: number;
  lobeAngleRad: number;
  spinPolarization: number; // +1 (spin-up) or -1 (spin-down)
  splittingEnergyMev: number;
  magnonChiralityFlux: number;
}

export interface AltermagneticChiralSpinSplitterState {
  harmonicMultipoleOrderN: number;     // 交錯磁多極對稱階數 N_l (2=d-wave, 4=g-wave, 6=i-wave)
  exchangeSplittingEv: number;         // 非相對論性交換自旋劈裂能 Δ_alt (eV, 0.05 ~ 1.60)
  neelVectorAngleDeg: number;          // 奈爾向量晶軸取向角 θ_L (deg, 0 ~ 180)
  spinSplitterAngleDeg: number;        // 自旋分光角 θ_SS (deg)
  chiralMagnonSplittingThz: number;    // 手性磁振子色散劈裂 Δω_mag (THz)
  magnonDiodeRectificationRatio: number; // 自旋波二極體非互易整流比 η_rect (0 ~ 1)
  activeRegime: AltermagneticSymmetryRegime;
  pulsePhase: number;
  fermiLobeNodes: AltermagneticFermiLobeNode[];
}

const STORAGE_KEY = 'newworld_altermagnetic_chiral_spin_splitter_state_v1';

export class AltermagneticChiralSpinSplitterEngine {
  private state: AltermagneticChiralSpinSplitterState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): AltermagneticChiralSpinSplitterState {
    const defaults: AltermagneticChiralSpinSplitterState = {
      harmonicMultipoleOrderN: 2,
      exchangeSplittingEv: 0.85,
      neelVectorAngleDeg: 45.0,
      spinSplitterAngleDeg: 24.6,
      chiralMagnonSplittingThz: 6.8,
      magnonDiodeRectificationRatio: 0.78,
      activeRegime: 'd-wave-rutile-spin-splitter',
      pulsePhase: 0,
      fermiLobeNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Altermagnetic Spin-Splitter state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Altermagnetic Spin-Splitter state:', e);
      }
    }
  }

  public getState(): Readonly<AltermagneticChiralSpinSplitterState> {
    return this.state;
  }

  public setMultipoleOrder(orderN: number): void {
    const clamped = orderN <= 2 ? 2 : orderN <= 4 ? 4 : 6;
    this.state.harmonicMultipoleOrderN = clamped;
    this.recomputePhysics();
    this.saveState();
  }

  public setExchangeSplitting(deltaEv: number): void {
    this.state.exchangeSplittingEv = Math.max(0.05, Math.min(1.60, parseFloat(deltaEv.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setNeelVectorAngle(angleDeg: number): void {
    this.state.neelVectorAngleDeg = Math.max(0.0, Math.min(180.0, parseFloat(angleDeg.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: AltermagneticSymmetryRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'collinear-afm-degenerate':
        this.state.harmonicMultipoleOrderN = 2;
        this.state.exchangeSplittingEv = 0.08;
        this.state.neelVectorAngleDeg = 0.0;
        break;
      case 'd-wave-rutile-spin-splitter':
        this.state.harmonicMultipoleOrderN = 2;
        this.state.exchangeSplittingEv = 0.95;
        this.state.neelVectorAngleDeg = 45.0;
        break;
      case 'g-wave-hexagonal-altermagnet':
        this.state.harmonicMultipoleOrderN = 4;
        this.state.exchangeSplittingEv = 1.15;
        this.state.neelVectorAngleDeg = 67.5;
        break;
      case 'i-wave-chiral-magnon-diode':
        this.state.harmonicMultipoleOrderN = 6;
        this.state.exchangeSplittingEv = 1.48;
        this.state.neelVectorAngleDeg = 90.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const nOrder = this.state.harmonicMultipoleOrderN;
    const deltaEv = this.state.exchangeSplittingEv;
    const neelRad = (this.state.neelVectorAngleDeg * Math.PI) / 180;

    // 奈爾向量晶向調制因子 (最大自旋流橫向投影)
    const orientationFactor = 0.45 + 0.55 * Math.abs(Math.sin(2 * neelRad));

    // 自旋分光角 θ_SS (deg)
    const thetaSs = 32.5 * Math.tanh(deltaEv * 1.15) * orientationFactor * (1 + 0.06 * (nOrder - 2));
    this.state.spinSplitterAngleDeg = parseFloat(thetaSs.toFixed(2));

    // 手性磁振子能帶劈裂 Δω_mag (THz)
    const magnonSplit = (1.8 + 4.8 * deltaEv) * (0.7 + 0.1 * nOrder) * (0.6 + 0.4 * Math.abs(Math.sin(neelRad)));
    this.state.chiralMagnonSplittingThz = parseFloat(magnonSplit.toFixed(2));

    // 自旋波二極體非互易整流比 η_rect
    const rectRatio = Math.min(0.98, 0.12 + 0.58 * Math.tanh(deltaEv * 1.3) + 0.04 * nOrder);
    this.state.magnonDiodeRectificationRatio = parseFloat(rectRatio.toFixed(2));

    // 生成 16 個動量空間交錯磁自旋劈裂費米瓣與手性磁振子節點
    const nodes: AltermagneticFermiLobeNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const phi = (i / count) * 2 * Math.PI + this.state.pulsePhase * 0.25;
      const harmonicVal = Math.cos(nOrder * (phi - neelRad * 0.5));
      const spinSign = harmonicVal >= 0 ? 1 : -1;
      const lobeAnisotropy = 56 + 44 * Math.abs(harmonicVal) * (0.5 + 0.45 * deltaEv);

      const x = 165 + lobeAnisotropy * Math.cos(phi);
      const y = 160 + lobeAnisotropy * Math.sin(phi);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        lobeAngleRad: parseFloat(phi.toFixed(2)),
        spinPolarization: spinSign,
        splittingEnergyMev: parseFloat((deltaEv * 1000 * Math.abs(harmonicVal)).toFixed(1)),
        magnonChiralityFlux: parseFloat((0.35 + 0.45 * deltaEv * Math.abs(harmonicVal)).toFixed(2))
      });
    }
    this.state.fermiLobeNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.9 + this.state.exchangeSplittingEv * 1.1;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAltermagneticSound(): void {
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
      const oscUp = this.audioCtx.createOscillator();
      const oscDown = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscUp.type = 'sawtooth';
      oscDown.type = 'triangle';

      const fCenter = 280 + this.state.harmonicMultipoleOrderN * 55;
      const fSplit = this.state.exchangeSplittingEv * 110;

      oscUp.frequency.setValueAtTime(fCenter - fSplit * 0.5, t);
      oscUp.frequency.exponentialRampToValueAtTime(fCenter + fSplit, t + 0.34);

      oscDown.frequency.setValueAtTime(fCenter + fSplit * 0.5, t);
      oscDown.frequency.exponentialRampToValueAtTime(Math.max(90, fCenter - fSplit * 0.6), t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      oscUp.connect(gain);
      oscDown.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscUp.start(t);
      oscDown.start(t);
      oscUp.stop(t + 0.54);
      oscDown.stop(t + 0.54);
    } catch (e) {
      console.warn('Web Audio playback failed in AltermagneticChiralSpinSplitterEngine:', e);
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

export const altermagneticChiralSpinSplitterEngine = new AltermagneticChiralSpinSplitterEngine();
