/**
 * 拓撲外爾超導體手性安德烈夫束縛態與貝里偶極微波雷射引擎
 * (Topological Weyl Superconductor Chiral Andreev Bound-State & Berry-Dipole Microwave Laser Engine)
 *
 * 物理原理：
 * 1. 在時間反演對稱破缺之外爾半金屬超導體 (如磁性摻雜 MoTe2, PtBi2 或超導-外爾異質結) 中，
 *    費米面上不同手性 (\chi = \pm 1) 之外爾錐發生有限動量配對或手性 p_x + i p_y 內稟配對，
 *    使 Bogoliubov 準粒子譜分裂為攜帶莫比烏斯拓撲荷 C_{BdG} = \pm 1 之「Bogoliubov-Weyl 節點對」。
 * 2. 根據體-邊對應原理，在動量空間兩個外爾超導節點投影點之間 (間距 \Delta k_W)，晶體表面承載連接兩節點之
 *    「手性馬約拉納-安德烈夫表面弧」(Chiral Majorana-Andreev Fermi Arcs)，僅沿單一方向無背散射傳播。
 * 3. 非中心對稱外爾超導能帶具備顯著之「貝里曲率偶極矩」(Berry Curvature Dipole, D_{BCD})，
 *    在外加微波交變場與偏壓注入下觸發手性安德烈夫束縛態 (Chiral ABS) 粒子數反轉與受激太赫茲/微波相干輻射放大。
 */

export type WeylSuperconductorLaserRegime =
  | 'bogoliubov-weyl-node-dipole-splitting'
  | 'surface-majorana-andreev-arc-transport'
  | 'berry-curvature-dipole-second-harmonic'
  | 'stimulated-chiral-andreev-microwave-laser';

export interface ChiralAndreevArcNode {
  id: number;
  x: number;
  y: number;
  nodeChirality: 1 | -1 | 0; // +1 source Weyl node, -1 sink Weyl node, 0 surface Andreev arc state
  andreevEnergyMeV: number;
  berryDipoleContribution: number;
  stimulatedEmissionGainDb: number;
}

export interface WeylSuperconductorAndreevState {
  weylNodeSeparationInvNm: number;        // 動量空間外爾節點分離距離 \Delta k_W (nm^{-1}, 0.15 ~ 1.80)
  berryCurvatureDipoleNm: number;         // 貝里曲率偶極矩強度 D_{BCD} (nm, 0.10 ~ 2.40)
  quasiparticlePumpBiasRatio: number;     // 準粒子非平衡偏壓泵浦比 e V_{bias} / \Delta_0 (0.20 ~ 2.50)
  chiralAndreevArcConductanceG0: number;  // 手性馬約拉納-安德烈夫表面弧量子電導 G_{arc} / (e^2/h)
  stimulatedMicrowaveGainDb: number;      // 受激安德烈夫束縛態微波雷射增益 G_{laser} (dB)
  nonlinearHallRectificationPct: number;  // 貝里偶極非線性約瑟夫森二倍頻整流效率 \eta_{2\omega} (%)
  activeRegime: WeylSuperconductorLaserRegime;
  pulsePhase: number;
  andreevNodes: ChiralAndreevArcNode[];
}

const STORAGE_KEY = 'newworld_weyl_superconductor_andreev_laser_state_v1';

export class WeylSuperconductorChiralAndreevLaserEngine {
  private state: WeylSuperconductorAndreevState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): WeylSuperconductorAndreevState {
    const defaults: WeylSuperconductorAndreevState = {
      weylNodeSeparationInvNm: 0.92,
      berryCurvatureDipoleNm: 1.38,
      quasiparticlePumpBiasRatio: 1.45,
      chiralAndreevArcConductanceG0: 1.84,
      stimulatedMicrowaveGainDb: 21.6,
      nonlinearHallRectificationPct: 68.4,
      activeRegime: 'stimulated-chiral-andreev-microwave-laser',
      pulsePhase: 0,
      andreevNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Weyl Superconductor Andreev Laser state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Weyl Superconductor Andreev Laser state:', e);
      }
    }
  }

  public getState(): Readonly<WeylSuperconductorAndreevState> {
    return this.state;
  }

  public setWeylNodeSeparation(dkInvNm: number): void {
    this.state.weylNodeSeparationInvNm = Math.max(0.15, Math.min(1.80, parseFloat(dkInvNm.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setBerryCurvatureDipole(dipoleNm: number): void {
    this.state.berryCurvatureDipoleNm = Math.max(0.10, Math.min(2.40, parseFloat(dipoleNm.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setQuasiparticlePumpBias(biasRatio: number): void {
    this.state.quasiparticlePumpBiasRatio = Math.max(0.20, Math.min(2.50, parseFloat(biasRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: WeylSuperconductorLaserRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'bogoliubov-weyl-node-dipole-splitting':
        this.state.weylNodeSeparationInvNm = 1.45;
        this.state.berryCurvatureDipoleNm = 0.75;
        this.state.quasiparticlePumpBiasRatio = 0.60;
        break;
      case 'surface-majorana-andreev-arc-transport':
        this.state.weylNodeSeparationInvNm = 1.15;
        this.state.berryCurvatureDipoleNm = 1.10;
        this.state.quasiparticlePumpBiasRatio = 1.00;
        break;
      case 'berry-curvature-dipole-second-harmonic':
        this.state.weylNodeSeparationInvNm = 0.85;
        this.state.berryCurvatureDipoleNm = 2.15;
        this.state.quasiparticlePumpBiasRatio = 1.20;
        break;
      case 'stimulated-chiral-andreev-microwave-laser':
        this.state.weylNodeSeparationInvNm = 0.92;
        this.state.berryCurvatureDipoleNm = 1.38;
        this.state.quasiparticlePumpBiasRatio = 1.65;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const dk = this.state.weylNodeSeparationInvNm;
    const dBcd = this.state.berryCurvatureDipoleNm;
    const bias = this.state.quasiparticlePumpBiasRatio;

    // 手性馬約拉納-安德烈夫表面弧電導正比於動量空間外爾節點間距 \Delta k_W / \pi
    const arcCond = 2.0 * Math.min(1.0, dk / 1.05) * (0.8 + 0.2 * Math.tanh(dBcd));
    this.state.chiralAndreevArcConductanceG0 = parseFloat(arcCond.toFixed(2));

    // 受激手性安德烈夫微波雷射增益 G_{laser} (dB)：當偏壓跨越粒子數反轉閾值 e V_{bias} / \Delta_0 > 1.0 時顯著放大
    const inversionFactor = Math.max(0.05, bias - 0.45);
    const gainDb = 8.5 * inversionFactor * (0.7 + 0.55 * dBcd) * (0.6 + 0.4 * dk);
    this.state.stimulatedMicrowaveGainDb = parseFloat(Math.min(34.0, gainDb).toFixed(1));

    // 貝里曲率偶極矩非線性二倍頻整流效率 \eta_{2\omega} (%)
    const rectPct = 92.0 * Math.tanh(0.68 * dBcd * Math.sqrt(bias));
    this.state.nonlinearHallRectificationPct = parseFloat(rectPct.toFixed(1));

    // 生成 16 個連接 +1 與 -1 Bogoliubov-Weyl 節點的手性馬約拉納-安德烈夫表面費米弧節點
    const nodes: ChiralAndreevArcNode[] = [];
    const count = 16;
    const nodeHalfSpan = 38 + dk * 42;

    for (let i = 0; i < count; i++) {
      let chirality: 1 | -1 | 0 = 0;
      let x = 165;
      let y = 160;

      if (i === 0) {
        chirality = 1;
        x = 165 - nodeHalfSpan;
        y = 160;
      } else if (i === count - 1) {
        chirality = -1;
        x = 165 + nodeHalfSpan;
        y = 160;
      } else {
        const isUpperArc = i % 2 === 1;
        const frac = i / (count - 1);
        const u = frac * 2.0 - 1.0; // -1 to +1
        x = 165 + u * nodeHalfSpan;
        const arcBow = (isUpperArc ? -1 : 1) * (46 + 18 * dBcd) * (1.0 - u * u);
        const wave = 5.5 * Math.sin(frac * 8.0 + this.state.pulsePhase * (isUpperArc ? 1 : -1));
        y = 160 + arcBow + wave;
      }

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        nodeChirality: chirality,
        andreevEnergyMeV: parseFloat((0.45 * Math.sin((i / count) * Math.PI)).toFixed(2)),
        berryDipoleContribution: parseFloat((dBcd * (0.6 + 0.4 * Math.abs(Math.cos(i)))).toFixed(2)),
        stimulatedEmissionGainDb: parseFloat((this.state.stimulatedMicrowaveGainDb * 0.85).toFixed(1))
      });
    }
    this.state.andreevNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.78 + (this.state.stimulatedMicrowaveGainDb / 30.0) * 0.85;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerWeylAndreevLaserSound(): void {
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
      const oscSecondHarmonic = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscFundamental.type = 'sine';
      oscSecondHarmonic.type = 'triangle';

      // 手性安德烈夫束縛態基頻 \omega 與貝里曲率偶極非線性二倍頻 2\omega 雷射共鳴
      const fBase = 290 + this.state.weylNodeSeparationInvNm * 110;
      const f2w = fBase * 2.0;

      oscFundamental.frequency.setValueAtTime(fBase, t);
      oscSecondHarmonic.frequency.setValueAtTime(f2w, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscFundamental.connect(gain);
      oscSecondHarmonic.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscFundamental.start(t);
      oscSecondHarmonic.start(t);
      oscFundamental.stop(t + 0.57);
      oscSecondHarmonic.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in WeylSuperconductorChiralAndreevLaserEngine:', e);
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

export const weylSuperconductorChiralAndreevLaserEngine = new WeylSuperconductorChiralAndreevLaserEngine();
