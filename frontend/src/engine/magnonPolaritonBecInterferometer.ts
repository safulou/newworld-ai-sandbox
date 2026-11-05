/**
 * 磁振子-極化激元玻色凝聚與非互易手性自旋波塞格奈克干涉儀引擎
 * (Magnon-Polariton Bose-Einstein Condensate & Non-Reciprocal Chiral Spin-Wave Sagnac Interferometer Engine)
 *
 * 物理原理：
 * 1. 在低阻尼釔鐵石榴石 (YIG, Y₃Fe₅O₁₂) 薄膜與高 Q 值三維微波諧振腔強耦合系統中，
 *    Kittel 磁振子模與微波光子發生真空拉比劈裂 (Vacuum Rabi Splitting, 2 g_{mp})，形成雜化「磁振子-極化激元」
 *    (Magnon-Polariton)。
 * 2. 由於長程磁偶極相互作用與無空間反演對稱界面誘導之 Dzyaloshinskii-Moriya 相互作用 (DMI, D_{DMI})，
 *    自旋波色散關係 \omega(k) = \omega_0 + A k^2 - D_{DMI} k + H_{dip}(k) 在非零波矢 \pm k_0 處呈現非對稱雙極小值
 *    (Double-Minimum Dispersion)。
 * 3. 當平行微波參量泵浦功率 P / P_{th} > 1 時，過量非平衡磁振子弛豫至最低能量點 \pm k_0 並發生室溫玻色-愛因斯坦凝聚
 *    (Magnon-Polariton BEC)，形成具有空間駐波密度條紋的雙分量凝聚體，且順/逆傳播自旋波展現非互易手性阿哈羅諾夫-卡什爾/DMI
 *    塞格奈克干涉相移 \Delta\phi_{NR} \propto D_{DMI} L。
 */

export type MagnonPolaritonBecRegime =
  | 'subthreshold-thermal-magnon-gas'
  | 'parametric-double-minimum-magnon-bec'
  | 'strong-coupling-magnon-polariton-rabi-split'
  | 'dmi-chiral-nonreciprocal-sagnac-interferometer';

export interface MagnonCondensateStripeNode {
  id: number;
  x: number;
  y: number;
  valleyMinimumSign: 1 | -1;
  condensateWavevectorK0RadUm: number;
  stripeDensityModulation: number;
  nonreciprocalPhaseRad: number;
}

export interface MagnonPolaritonBecState {
  parametricPumpRatioPth: number;         // 平行微波參量泵浦功率與閾值比 P / P_{th} (0.20 ~ 4.50)
  interfacialDmiConstantMjM2: number;     // 界面 Dzyaloshinskii-Moriya 耦合常數 D_{DMI} (mJ/m², 0.00 ~ 2.50)
  vacuumRabiCouplingMhz: number;          // 磁振子-微波光子真空拉比耦合強度 g_{mp} / 2\pi (MHz, 15.0 ~ 180.0)
  becCondensateFractionPct: number;       // 雙極小值 \pm k_0 玻色凝聚佔居率 n_{BEC} / n_{tot} (%)
  nonreciprocalSagnacPhaseRad: number;    // 非互易手性自旋波塞格奈克干涉相移 \Delta\phi_{NR} (rad)
  spatialStripeContrastVis: number;       // \pm k_0 雙凝聚體空間干涉條紋可見度 V_{stripe} (0.000 ~ 1.000)
  activeRegime: MagnonPolaritonBecRegime;
  pulsePhase: number;
  condensateNodes: MagnonCondensateStripeNode[];
}

const STORAGE_KEY = 'newworld_magnon_polariton_bec_state_v1';

export class MagnonPolaritonBecInterferometerEngine {
  private state: MagnonPolaritonBecState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): MagnonPolaritonBecState {
    const defaults: MagnonPolaritonBecState = {
      parametricPumpRatioPth: 2.35,
      interfacialDmiConstantMjM2: 1.15,
      vacuumRabiCouplingMhz: 92.0,
      becCondensateFractionPct: 78.4,
      nonreciprocalSagnacPhaseRad: 2.68,
      spatialStripeContrastVis: 0.892,
      activeRegime: 'dmi-chiral-nonreciprocal-sagnac-interferometer',
      pulsePhase: 0,
      condensateNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Magnon-Polariton BEC state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Magnon-Polariton BEC state:', e);
      }
    }
  }

  public getState(): Readonly<MagnonPolaritonBecState> {
    return this.state;
  }

  public setParametricPumpRatio(pRatio: number): void {
    this.state.parametricPumpRatioPth = Math.max(0.20, Math.min(4.50, parseFloat(pRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setInterfacialDmiConstant(dmiVal: number): void {
    this.state.interfacialDmiConstantMjM2 = Math.max(0.00, Math.min(2.50, parseFloat(dmiVal.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setVacuumRabiCoupling(gMhz: number): void {
    this.state.vacuumRabiCouplingMhz = Math.max(15.0, Math.min(180.0, parseFloat(gMhz.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: MagnonPolaritonBecRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'subthreshold-thermal-magnon-gas':
        this.state.parametricPumpRatioPth = 0.55;
        this.state.interfacialDmiConstantMjM2 = 0.25;
        this.state.vacuumRabiCouplingMhz = 35.0;
        break;
      case 'parametric-double-minimum-magnon-bec':
        this.state.parametricPumpRatioPth = 2.10;
        this.state.interfacialDmiConstantMjM2 = 0.15;
        this.state.vacuumRabiCouplingMhz = 68.0;
        break;
      case 'strong-coupling-magnon-polariton-rabi-split':
        this.state.parametricPumpRatioPth = 2.65;
        this.state.interfacialDmiConstantMjM2 = 0.75;
        this.state.vacuumRabiCouplingMhz = 158.0;
        break;
      case 'dmi-chiral-nonreciprocal-sagnac-interferometer':
        this.state.parametricPumpRatioPth = 2.85;
        this.state.interfacialDmiConstantMjM2 = 1.65;
        this.state.vacuumRabiCouplingMhz = 112.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const pRatio = this.state.parametricPumpRatioPth;
    const dmi = this.state.interfacialDmiConstantMjM2;
    const gRabi = this.state.vacuumRabiCouplingMhz;

    // 參量泵浦跨越閾值 P / P_{th} = 1.0 時觸發磁振子 BEC
    const becActivation = 1.0 / (1.0 + Math.exp(-(pRatio - 1.02) / 0.22));
    const polaritonBoost = 0.82 + 0.18 * Math.tanh(gRabi / 90.0);
    const condensatePct = Math.min(96.5, 92.0 * becActivation * polaritonBoost * (0.45 + 0.55 * Math.tanh((pRatio - 0.8) * 0.8)));
    this.state.becCondensateFractionPct = parseFloat(Math.max(1.2, condensatePct).toFixed(1));

    // 非互易手性自旋波塞格奈克相移 \Delta\phi_{NR} = \Delta k_{DMI} * L + \phi_{Rabi}
    const phaseShift = dmi * 2.15 * (0.55 + 0.45 * (gRabi / 120.0)) + 0.12 * pRatio;
    this.state.nonreciprocalSagnacPhaseRad = parseFloat(phaseShift.toFixed(2));

    // \pm k_0 空間條紋干涉可見度 V = 2 \sqrt{n_+ n_-} / (n_+ + n_-)：過強 DMI 會打破 \pm k_0 布居對稱而改變對比度
    const valleyImbalance = Math.exp(-Math.pow(dmi / 2.6, 2));
    const contrast = becActivation * (0.35 + 0.63 * valleyImbalance);
    this.state.spatialStripeContrastVis = parseFloat(Math.min(0.992, Math.max(0.04, contrast)).toFixed(3));

    // 生成 16 個 \pm k_0 雙極小值磁振子凝聚體空間干涉節點
    const nodes: MagnonCondensateStripeNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const sign: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * 0.34 * sign;
      const rBase = sign === 1 ? 56 : 86;
      const dmiShift = sign * dmi * 6.5;

      const x = 165 + (rBase + dmiShift) * Math.cos(angle);
      const y = 160 + (rBase + dmiShift) * Math.sin(angle);
      const k0 = 5.4 + sign * dmi * 1.35;

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        valleyMinimumSign: sign,
        condensateWavevectorK0RadUm: parseFloat(k0.toFixed(2)),
        stripeDensityModulation: parseFloat((0.5 + 0.5 * this.state.spatialStripeContrastVis * Math.cos(2 * angle + phaseShift)).toFixed(3)),
        nonreciprocalPhaseRad: parseFloat(((angle + sign * phaseShift) % (2 * Math.PI)).toFixed(2))
      });
    }
    this.state.condensateNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.75 + (this.state.becCondensateFractionPct / 100.0) * 0.85;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerMagnonPolaritonSound(): void {
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
      const oscPlusK = this.audioCtx.createOscillator();
      const oscMinusK = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscPlusK.type = 'sine';
      oscMinusK.type = 'triangle';

      // +k_0 與 -k_0 雙極小值磁振子凝聚體非互易拍頻與拉比劈裂雙音
      const fCenter = 360 + this.state.vacuumRabiCouplingMhz * 1.4;
      const dmiSplit = 18 + this.state.interfacialDmiConstantMjM2 * 45;

      oscPlusK.frequency.setValueAtTime(fCenter + dmiSplit, t);
      oscPlusK.frequency.exponentialRampToValueAtTime(fCenter + dmiSplit * 1.2, t + 0.36);

      oscMinusK.frequency.setValueAtTime(Math.max(120, fCenter - dmiSplit), t);
      oscMinusK.frequency.exponentialRampToValueAtTime(Math.max(120, fCenter - dmiSplit * 0.8), t + 0.36);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.54);

      oscPlusK.connect(gain);
      oscMinusK.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscPlusK.start(t);
      oscMinusK.start(t);
      oscPlusK.stop(t + 0.56);
      oscMinusK.stop(t + 0.56);
    } catch (e) {
      console.warn('Web Audio playback failed in MagnonPolaritonBecInterferometerEngine:', e);
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

export const magnonPolaritonBecInterferometerEngine = new MagnonPolaritonBecInterferometerEngine();
