/**
 * 拓撲非阿貝爾自旋梅比烏斯條共振腔引擎 (Topological Non-Abelian Spin-Möbius Resonator Engine)
 * 
 * 物理原理：
 * 1. 在拓撲絕緣體或強自旋軌道耦合半導體奈米帶中，若結構經奇數次半旋扭曲閉合為不可定向流形——梅比烏斯帶 (Möbius Strip, N_twist = 1, 3)。
 * 2. 由於不可定向拓撲邊界條件，沿著單一閉合邊界周長 L 環繞一週時，電子波函數與自旋態經歷反週期性邊界條件：
 *    ψ(s + L) = -ψ(s) = e^{i π} ψ(s)
 *    自然湧現內稟幾何貝里相位 γ_Berry = π。系統需要環繞兩整圈 (4π 旋轉) 才能復原為原態，展現自旋-1/2 費米子本質。
 * 3. 軌道角動量量子化呈現奇異半整數譜 L_z = (n + 1/2)ℏ，並激發亞諧波破壞性拓撲干涉。
 * 4. 結合非阿貝爾 Rashba 自旋軌道耦合 (α_SOC)，電子的自旋向量在曲面上發生幾何自旋進動與非阿貝爾完整群 (Holonomy) 旋轉，
 *    在無外部磁場下形成自整流自旋流與拓撲保護的雙面連通單一連續邊界態。
 */

export type SpinMobiusRegime = 
  | 'cylindrical-trivial-ribbon'
  | 'mobius-single-twist'
  | 'chiral-spin-precession-strip'
  | 'non-abelian-holonomy-knot';

export interface MobiusNode {
  id: number;
  uParam: number;      // 帶長方向參數 (0 ~ 2π)
  xProj: number;       // 投影至 2D 畫布坐標 X
  yProj: number;       // 投影至 2D 畫布坐標 Y
  zDepth: number;      // 深度坐標 Z (用於渲染明暗)
  spinTiltRad: number; // 自旋傾角
  edgeCurrentDensity: number;
}

export interface SpinMobiusState {
  twistNumberN: number;            // 扭轉半圈數 N_twist (0 ~ 3, 奇數為梅比烏斯)
  socStrengthAlpha: number;        // Rashba 自旋軌道耦合 α_SOC (meV·nm, 5.0 ~ 50.0)
  fermiEnergyEfMev: number;        // 費米能級 E_F (meV, 10.0 ~ 100.0)
  berryPhaseRad: number;           // 幾何貝里相位 γ_Berry (rad)
  subharmonicInterference: number; // 亞諧波干涉對比度 (0.0 ~ 1.0)
  spinPrecessionAngleRad: number;  // 累積極化自旋進動角
  persistentSpinCurrentUa: number; // 持久拓撲自旋流 I_s (μA)
  activeRegime: SpinMobiusRegime;
  pulsePhase: number;
  nodes: MobiusNode[];
}

const STORAGE_KEY = 'newworld_spin_mobius_resonator_state_v1';

export class TopologicalSpinMobiusResonatorEngine {
  private state: SpinMobiusState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): SpinMobiusState {
    const defaults: SpinMobiusState = {
      twistNumberN: 1,
      socStrengthAlpha: 28.5,
      fermiEnergyEfMev: 45.0,
      berryPhaseRad: Math.PI,
      subharmonicInterference: 0.94,
      spinPrecessionAngleRad: 1.57,
      persistentSpinCurrentUa: 12.8,
      activeRegime: 'mobius-single-twist',
      pulsePhase: 0,
      nodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Spin-Mobius state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Spin-Mobius state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<SpinMobiusState> {
    return this.state;
  }

  public setTwistNumber(n: number): void {
    this.state.twistNumberN = Math.max(0, Math.min(3, Math.round(n)));
    this.recomputePhysics();
    this.saveState();
  }

  public setSocStrength(alpha: number): void {
    this.state.socStrengthAlpha = Math.max(5.0, Math.min(50.0, alpha));
    this.recomputePhysics();
    this.saveState();
  }

  public setFermiEnergy(ef: number): void {
    this.state.fermiEnergyEfMev = Math.max(10.0, Math.min(100.0, ef));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: SpinMobiusRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'cylindrical-trivial-ribbon':
        this.state.twistNumberN = 0;
        this.state.socStrengthAlpha = 8.0;
        this.state.fermiEnergyEfMev = 20.0;
        break;
      case 'mobius-single-twist':
        this.state.twistNumberN = 1;
        this.state.socStrengthAlpha = 25.0;
        this.state.fermiEnergyEfMev = 40.0;
        break;
      case 'chiral-spin-precession-strip':
        this.state.twistNumberN = 1;
        this.state.socStrengthAlpha = 42.0;
        this.state.fermiEnergyEfMev = 65.0;
        break;
      case 'non-abelian-holonomy-knot':
        this.state.twistNumberN = 3;
        this.state.socStrengthAlpha = 48.0;
        this.state.fermiEnergyEfMev = 85.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const n = this.state.twistNumberN;
    const alpha = this.state.socStrengthAlpha;
    const ef = this.state.fermiEnergyEfMev;

    // 貝里相位: 奇數半扭為 π (mod 2π)，偶數為 0
    const isMobius = (n % 2 === 1);
    this.state.berryPhaseRad = isMobius ? Math.PI : 0;

    // 亞諧波干涉對比度: C = tanh(0.08 * ef) * (isMobius ? 0.98 : 0.25)
    const contrast = Math.tanh(0.04 * ef) * (isMobius ? 0.96 : 0.15);
    this.state.subharmonicInterference = parseFloat(contrast.toFixed(3));

    // 自旋進動角 θ_spin = (2 * m* * α * L) / ℏ² ∝ α * sqrt(ef)
    const thetaSpin = (alpha / 15.0) * Math.sqrt(ef / 40.0);
    this.state.spinPrecessionAngleRad = parseFloat(thetaSpin.toFixed(2));

    // 持久拓撲自旋流 I_s = (e / h) * α * (isMobius ? 1.0 : 0.2)
    const isCur = (alpha * 0.45) * (isMobius ? 1.0 : 0.18);
    this.state.persistentSpinCurrentUa = parseFloat(isCur.toFixed(1));

    // 生成梅比烏斯帶 16 個空間特徵節點三維座標與投影
    // 參數方程: x = [R + v * cos(N*u/2)] * cos(u), y = [R + v * cos(N*u/2)] * sin(u), z = v * sin(N*u/2)
    const nodes: MobiusNode[] = [];
    const count = 16;
    const majorRadius = 75;
    const stripWidth = 28;

    for (let i = 0; i < count; i++) {
      const u = (i / count) * 2 * Math.PI;
      // 取邊緣軌道 v = stripWidth * cos(u * 2 + pulsePhase)
      const v = stripWidth * Math.cos(u * (n % 2 === 0 ? 1 : 0.5) + this.state.pulsePhase * 0.5);

      const twistAngle = (n * u) / 2.0;
      const x3d = (majorRadius + v * Math.cos(twistAngle)) * Math.cos(u);
      const y3d = (majorRadius + v * Math.cos(twistAngle)) * Math.sin(u);
      const z3d = v * Math.sin(twistAngle);

      // 三維空間旋轉 (俯仰與偏航)
      const pitch = 0.55;
      const yaw = this.state.pulsePhase * 0.6;
      const rx = x3d * Math.cos(yaw) - y3d * Math.sin(yaw);
      const ry = x3d * Math.sin(yaw) + y3d * Math.cos(yaw);
      const rz = z3d * Math.cos(pitch) - ry * Math.sin(pitch);
      const finalY = z3d * Math.sin(pitch) + ry * Math.cos(pitch);

      const projX = 150 + rx;
      const projY = 150 + finalY;

      const tilt = twistAngle + this.state.spinPrecessionAngleRad + Math.sin(this.state.pulsePhase + i);
      const edgeMag = (isMobius ? 0.75 : 0.3) + 0.2 * Math.cos(u * 2 + this.state.pulsePhase);

      nodes.push({
        id: i,
        uParam: parseFloat(u.toFixed(2)),
        xProj: parseFloat(projX.toFixed(1)),
        yProj: parseFloat(projY.toFixed(1)),
        zDepth: parseFloat(rz.toFixed(1)),
        spinTiltRad: parseFloat(tilt.toFixed(2)),
        edgeCurrentDensity: parseFloat(Math.min(1.0, Math.max(0.1, edgeMag)).toFixed(2))
      });
    }
    this.state.nodes = nodes;
  }

  public update(dtSeconds: number): void {
    const rate = 1.0 + (this.state.socStrengthAlpha / 25.0);
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerMobiusSound(): void {
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
      const oscFundamental = this.audioCtx.createOscillator();
      const oscThirdHarmonic = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscFundamental.type = 'sine';
      oscThirdHarmonic.type = 'triangle';

      const baseFreq = 432; // 幾何音律頻率
      const overtoneFreq = baseFreq * (this.state.twistNumberN % 2 === 1 ? 3 : 2);

      oscFundamental.frequency.setValueAtTime(baseFreq, t);
      oscFundamental.frequency.linearRampToValueAtTime(baseFreq * 1.08, t + 0.25);
      oscFundamental.frequency.linearRampToValueAtTime(baseFreq, t + 0.5);

      oscThirdHarmonic.frequency.setValueAtTime(overtoneFreq, t);
      oscThirdHarmonic.frequency.exponentialRampToValueAtTime(overtoneFreq * 1.05, t + 0.25);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);

      oscFundamental.connect(gain);
      oscThirdHarmonic.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscFundamental.start(t);
      oscThirdHarmonic.start(t);
      oscFundamental.stop(t + 0.55);
      oscThirdHarmonic.stop(t + 0.55);
    } catch (e) {
      console.warn('Web Audio playback failed in TopologicalSpinMobiusResonatorEngine:', e);
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

export const topologicalSpinMobiusResonatorEngine = new TopologicalSpinMobiusResonatorEngine();
