/**
 * 拓撲手性自旋三重態鈾基超導體與高磁場拉撒路重入超導引擎
 * (Topological Spin-Triplet Uranium Superconductor UTe₂ & High-Field Lazarus Re-Entrant Superconductivity Engine)
 *
 * 物理原理：
 * 1. 重費米子正交晶系超導體二碲化鈾 (UTe₂) 具有強伊辛型鐵磁自旋漲落，形成等自旋配對 (Equal-Spin Pairing, |↑↑⟩ 與 |↓↓⟩)
 *    之奇宇稱自旋三重態手性拓撲超導態 (d(k) 向量序參量，候選對稱性 B_{3u} + i B_{2u} 或 A_u + i B_{3u})。
 * 2. 由於等自旋三重態庫柏對的奈特位移 (Knight Shift) 不隨超導相變而消失，其上臨界磁場 H_{c2} 遠超包立順磁極限
 *    (Pauli Paramagnetic Limit B_P ≈ 1.84 T_c ≈ 3 T)，可延伸至 35 T ~ 65 T 極端強磁場。
 * 3. 當外加磁場沿結晶 b 軸 (或傾斜於 b-c 平面) 跨越 B_m ≈ 34.5 T 一階變磁相變 (Metamagnetic Transition) 時，
 *    鐵磁縱向自旋漲落與朗道能階平帶效應誘導「拉撒路超導重入相」(Lazarus Re-entrant Superconducting Dome, 40 T ~ 65 T)，
 *    並在晶體台階邊緣保護手性馬約拉納表面態與自旋三重態配對密度波 (Triplet PDW)。
 */

export type UraniumTripletScRegime =
  | 'zero-field-chiral-triplet-sc1'
  | 'pauli-exceeding-field-reinforced-sc2'
  | 'metamagnetic-critical-jump-35t'
  | 'lazarus-ultra-high-field-reentrant-dome';

export interface UraniumTripletFermiNode {
  id: number;
  x: number;
  y: number;
  spinTripletProjection: 'up-up' | 'down-down';
  dVectorMagnitudeMev: number;
  majoranaArcWeight: number;
  isFieldReinforced: boolean;
}

export interface UraniumSpinTripletScState {
  appliedFieldTeslaB: number;           // 外部強磁場強度 B (T, 0.0 ~ 65.0 T, 變磁躍變 B_m ≈ 34.5 T)
  fieldTiltAngleBcDeg: number;          // 磁場在 b-c 晶面傾角 θ_{bc} (deg, 0.0 ~ 45.0°, 最佳拉撒路角 ≈ 28°)
  tripletOrderParameterDMeV: number;    // 自旋三重態 |d(k)| 超導能隙振幅 (meV)
  pauliLimitExceedanceRatio: number;    // 超越包立順磁極限倍數 B / B_{Pauli}
  metamagneticPolarizationMuB: number;  // 5f 變磁躍變磁化強度 M_{5f} (μ_B / U-atom)
  chiralMajoranaConductanceE2H: number; // 表面手性馬約拉納零模穿隧電導 G_{Maj} (e²/h)
  activeRegime: UraniumTripletScRegime;
  pulsePhase: number;
  tripletNodes: UraniumTripletFermiNode[];
}

const STORAGE_KEY = 'newworld_uranium_spin_triplet_superconductor_state_v1';

export class UraniumTopologicalSpinTripletSuperconductorEngine {
  private state: UraniumSpinTripletScState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): UraniumSpinTripletScState {
    const defaults: UraniumSpinTripletScState = {
      appliedFieldTeslaB: 46.5,
      fieldTiltAngleBcDeg: 28.0,
      tripletOrderParameterDMeV: 0.42,
      pauliLimitExceedanceRatio: 15.5,
      metamagneticPolarizationMuB: 1.68,
      chiralMajoranaConductanceE2H: 0.94,
      activeRegime: 'lazarus-ultra-high-field-reentrant-dome',
      pulsePhase: 0,
      tripletNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Uranium Spin Triplet SC state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Uranium Spin Triplet SC state:', e);
      }
    }
  }

  public getState(): Readonly<UraniumSpinTripletScState> {
    return this.state;
  }

  public setAppliedFieldTesla(bTesla: number): void {
    this.state.appliedFieldTeslaB = Math.max(0.0, Math.min(65.0, parseFloat(bTesla.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setFieldTiltAngleDeg(angleDeg: number): void {
    this.state.fieldTiltAngleBcDeg = Math.max(0.0, Math.min(45.0, parseFloat(angleDeg.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: UraniumTripletScRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'zero-field-chiral-triplet-sc1':
        this.state.appliedFieldTeslaB = 1.5;
        this.state.fieldTiltAngleBcDeg = 0.0;
        break;
      case 'pauli-exceeding-field-reinforced-sc2':
        this.state.appliedFieldTeslaB = 22.0;
        this.state.fieldTiltAngleBcDeg = 5.0;
        break;
      case 'metamagnetic-critical-jump-35t':
        this.state.appliedFieldTeslaB = 34.5;
        this.state.fieldTiltAngleBcDeg = 15.0;
        break;
      case 'lazarus-ultra-high-field-reentrant-dome':
        this.state.appliedFieldTeslaB = 48.0;
        this.state.fieldTiltAngleBcDeg = 28.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const bField = this.state.appliedFieldTeslaB;
    const tilt = this.state.fieldTiltAngleBcDeg;
    const bPauli = 3.0; // UTe₂ T_c ≈ 1.6 ~ 2.0 K => B_Pauli ≈ 3.0 T

    // 超越包立順磁極限比 B / B_Pauli
    this.state.pauliLimitExceedanceRatio = parseFloat((bField / bPauli).toFixed(1));

    // 雙穹頂 (低場 SC1 + 20T 磁場增強 SC2 + 45T 拉撒路重入穹頂 SC_FP) 自旋三重態能隙 |d(k)| (meV)
    const domeLow = 0.36 * Math.exp(-Math.pow(bField / 16.0, 2));
    const domeReinforced = 0.38 * Math.exp(-Math.pow((bField - 21.0) / 8.5, 2));
    const tiltResonance = Math.exp(-Math.pow((tilt - 28.0) / 14.0, 2));
    const domeLazarus = (0.12 + 0.36 * tiltResonance) * Math.exp(-Math.pow((bField - 47.0) / 11.5, 2));

    const dGap = Math.max(0.04, domeLow + domeReinforced + domeLazarus);
    this.state.tripletOrderParameterDMeV = parseFloat(dGap.toFixed(2));

    // B_m = 34.5 T 一階變磁相變磁化強度躍變 M_{5f} (μ_B / U)
    const metaStep = 0.5 * (1.0 + Math.tanh((bField - 34.5) * 0.45));
    const m5f = 0.022 * bField + 0.72 * metaStep;
    this.state.metamagneticPolarizationMuB = parseFloat(m5f.toFixed(2));

    // 手性馬約拉納邊界態穿隧電導 G_{Maj} (e²/h)
    const majCond = Math.min(1.00, 0.25 + 1.65 * dGap);
    this.state.chiralMajoranaConductanceE2H = parseFloat(majCond.toFixed(2));

    // 生成 16 個柱狀重費米面與等自旋三重態 d(k) 向量節點
    const nodes: UraniumTripletFermiNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * 0.3;
      const rx = 68 + 24 * Math.abs(Math.cos(2.0 * angle));
      const ry = 92;

      const x = 165 + rx * Math.cos(angle);
      const y = 160 + ry * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        spinTripletProjection: bField > 34.5 || i % 2 === 0 ? 'up-up' : 'down-down',
        dVectorMagnitudeMev: parseFloat(dGap.toFixed(2)),
        majoranaArcWeight: parseFloat(majCond.toFixed(2)),
        isFieldReinforced: bField > 15.0
      });
    }
    this.state.tripletNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + (this.state.appliedFieldTeslaB / 50.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerUraniumTripletSound(): void {
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
      const oscUpUp = this.audioCtx.createOscillator();
      const oscLazarus = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscUpUp.type = 'sine';
      oscLazarus.type = 'triangle';

      // 等自旋三重態 |↑↑⟩ 與拉撒路重入超導高場諧音
      const fBase = 240 + this.state.appliedFieldTeslaB * 4.5;
      const fTarget = fBase + this.state.tripletOrderParameterDMeV * 420;

      oscUpUp.frequency.setValueAtTime(fBase, t);
      oscUpUp.frequency.exponentialRampToValueAtTime(fTarget, t + 0.35);

      oscLazarus.frequency.setValueAtTime(fBase * 1.5, t);
      oscLazarus.frequency.exponentialRampToValueAtTime(fTarget * 1.5, t + 0.35);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscUpUp.connect(gain);
      oscLazarus.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscUpUp.start(t);
      oscLazarus.start(t);
      oscUpUp.stop(t + 0.57);
      oscLazarus.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in UraniumTopologicalSpinTripletSuperconductorEngine:', e);
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

export const uraniumTopologicalSpinTripletSuperconductorEngine = new UraniumTopologicalSpinTripletSuperconductorEngine();
