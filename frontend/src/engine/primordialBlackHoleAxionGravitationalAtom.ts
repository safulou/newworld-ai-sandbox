/**
 * 原初黑洞超輻射軸子玻色雲與引力原子躍遷干涉儀引擎
 * (Primordial Black Hole Superradiant Axion Cloud & Gravitational Atom Transition Engine)
 *
 * 物理原理：
 * 1. 根據 Brito-Cardoso-Pani 黑洞超輻射不穩定性理論 (Black Hole Superradiance)，當旋轉克爾原初黑洞
 *    (Kerr Primordial Black Hole, 質量 M_{PBH}、無量綱自旋 a_*) 的康普頓波長與超輕軸子/類軸子暗物質粒子
 *    (質量 \mu_a) 滿足引力精細結構常數共振條件 \alpha_g = G M_{PBH} \mu_a / (\hbar c) \sim 0.05 - 0.45，
 *    且實部頻率滿足超輻射條件 \omega_R < m \Omega_H 時，軸子波包從能層 (Ergosphere) 指數級放大並抽取黑洞轉動能。
 * 2. 宏觀占據之軸子凝聚態在黑洞周圍形成酷似氫原子電子軌域之「引力原子」(Gravitational Atom) 束縛態 |nlm\rangle
 *    (主導模態為 |211\rangle 與 |322\rangle)，使黑洞沿雷吉軌跡 (Regge Trajectory) 自旋減速。
 * 3. 引力原子透過軸子對湮滅 (2\mu_a \to \text{graviton}) 與能階躍遷 (|322\rangle \to |211\rangle) 發射單色連續引力波；
 *    當軸子四次自交互作用吸引力 (\propto f_a^{-2}) 超越臨界質量時，觸發劇烈的「玻色新星」(Bosenova) 內爆與週期性噴發。
 */

export type PbhGravitationalAtomRegime =
  | 'superradiant-211-dipole-cloud-growth'
  | 'level-transition-322-to-211-monochromatic-gw'
  | 'regge-trajectory-spin-down-saturation'
  | 'attractive-axion-self-interaction-bosenova';

export interface GravitationalAtomOrbitalNode {
  id: number;
  x: number;
  y: number;
  quantumStateLabel: '2p-m1-211-lobe' | '3d-m2-322-quadrupole' | 'bosenova-shock-shell';
  cloudDensityFraction: number;
  localStrainAmplitudeH0: number;
  superradiantGrowthRatePerSec: number;
}

export interface PbhAxionGravitationalAtomState {
  gravitationalFineStructureAlpha: number; // 引力精細結構常數 \alpha_g = G M \mu_a / (\hbar c) (0.04 ~ 0.48)
  initialKerrSpinParameter: number;        // 原初黑洞無量綱克爾自旋 a_* = J / (G M^2 / c) (0.15 ~ 0.99)
  axionCloudMassFractionPct: number;       // 軸子玻色雲占黑洞總質量百分比 M_{cloud} / M_{PBH} (%)
  monochromaticGwStrainLog10: number;      // 連續單色引力波特徵應變對數 log10(h_0)
  reggeSpinDownEquilibriumA: number;       // 超輻射飽和雷吉軌跡平衡自旋 a_{Regge} = 4 m \alpha_g / (m^2 + 4 \alpha_g^2)
  bosenovaCriticalityRatio: number;        // 軸子自吸引玻色新星內爆臨界比 N / N_{crit} (0.000 ~ 1.500)
  activeRegime: PbhGravitationalAtomRegime;
  pulsePhase: number;
  orbitalNodes: GravitationalAtomOrbitalNode[];
}

const STORAGE_KEY = 'newworld_pbh_axion_gravitational_atom_state_v1';

export class PrimordialBlackHoleAxionGravitationalAtomEngine {
  private state: PbhAxionGravitationalAtomState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): PbhAxionGravitationalAtomState {
    const defaults: PbhAxionGravitationalAtomState = {
      gravitationalFineStructureAlpha: 0.22,
      initialKerrSpinParameter: 0.92,
      axionCloudMassFractionPct: 7.45,
      monochromaticGwStrainLog10: -23.4,
      reggeSpinDownEquilibriumA: 0.737,
      bosenovaCriticalityRatio: 0.684,
      activeRegime: 'superradiant-211-dipole-cloud-growth',
      pulsePhase: 0,
      orbitalNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load PBH Axion Gravitational Atom state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save PBH Axion Gravitational Atom state:', e);
      }
    }
  }

  public getState(): Readonly<PbhAxionGravitationalAtomState> {
    return this.state;
  }

  public setGravitationalFineStructureAlpha(alpha: number): void {
    this.state.gravitationalFineStructureAlpha = Math.max(0.04, Math.min(0.48, parseFloat(alpha.toFixed(3))));
    this.recomputePhysics();
    this.saveState();
  }

  public setInitialKerrSpinParameter(spinA: number): void {
    this.state.initialKerrSpinParameter = Math.max(0.15, Math.min(0.99, parseFloat(spinA.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: PbhGravitationalAtomRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'superradiant-211-dipole-cloud-growth':
        this.state.gravitationalFineStructureAlpha = 0.22;
        this.state.initialKerrSpinParameter = 0.92;
        break;
      case 'level-transition-322-to-211-monochromatic-gw':
        this.state.gravitationalFineStructureAlpha = 0.36;
        this.state.initialKerrSpinParameter = 0.96;
        break;
      case 'regge-trajectory-spin-down-saturation':
        this.state.gravitationalFineStructureAlpha = 0.18;
        this.state.initialKerrSpinParameter = 0.68;
        break;
      case 'attractive-axion-self-interaction-bosenova':
        this.state.gravitationalFineStructureAlpha = 0.42;
        this.state.initialKerrSpinParameter = 0.98;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const alpha = this.state.gravitationalFineStructureAlpha;
    const aInit = this.state.initialKerrSpinParameter;

    // 主導方位角量子數 m = 1 (|211> 態) 或 m = 2 (|322> 態)
    const mMode = (this.state.activeRegime === 'level-transition-322-to-211-monochromatic-gw' || alpha > 0.30) ? 2 : 1;

    // 雷吉超輻射飽和自旋 a_{Regge} = 4 m \alpha_g / (m^2 + 4 \alpha_g^2)
    const aRegge = Math.min(0.99, (4.0 * mMode * alpha) / (mMode * mMode + 4.0 * alpha * alpha));
    this.state.reggeSpinDownEquilibriumA = parseFloat(aRegge.toFixed(3));

    // 從黑洞提取之軸子雲質量百分比 M_{cloud}/M_{PBH} \propto \max(0, a_* - a_{Regge})
    const deltaA = Math.max(0.005, aInit - aRegge * 0.72);
    const cloudPct = Math.min(10.8, 12.5 * deltaA * Math.sin(Math.min(Math.PI * 0.85, alpha * 3.6)));
    this.state.axionCloudMassFractionPct = parseFloat(cloudPct.toFixed(2));

    // 單色引力波特徵應變對數 log10(h_0) \propto \alpha_g^7 (軸子對湮滅) 或 \alpha_g^5 (能階躍遷)
    const hLog = -26.8 + 14.5 * alpha + 0.18 * cloudPct;
    this.state.monochromaticGwStrainLog10 = parseFloat(hLog.toFixed(2));

    // 玻色新星自吸引內爆臨界比 N / N_{crit}
    const bosenovaBoost = this.state.activeRegime === 'attractive-axion-self-interaction-bosenova' ? 0.38 : 0.0;
    const critRatio = Math.min(1.48, 0.14 * cloudPct * (1.0 + 2.8 * alpha) + bosenovaBoost);
    this.state.bosenovaCriticalityRatio = parseFloat(critRatio.toFixed(3));

    // 生成 16 個引力原子氫軌域波瓣 (|211>, |322> 與玻色新星衝擊殼層) 節點
    const nodes: GravitationalAtomOrbitalNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let qState: '2p-m1-211-lobe' | '3d-m2-322-quadrupole' | 'bosenova-shock-shell' = '2p-m1-211-lobe';
      if (this.state.bosenovaCriticalityRatio > 1.0 && i % 3 === 0) {
        qState = 'bosenova-shock-shell';
      } else if (mMode === 2 || i % 2 === 1) {
        qState = '3d-m2-322-quadrupole';
      }

      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * (qState === '2p-m1-211-lobe' ? 0.42 : 0.28);
      // 玻爾軌道半徑 r_n = n^2 / \alpha_g M
      const lobeMod = qState === '2p-m1-211-lobe'
        ? 26 * Math.abs(Math.cos(angle))
        : qState === '3d-m2-322-quadrupole'
          ? 34 * Math.abs(Math.sin(2.0 * angle))
          : 42;
      const r = 52 + lobeMod;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        quantumStateLabel: qState,
        cloudDensityFraction: parseFloat((0.3 + 0.7 * (cloudPct / 11.0) * Math.abs(Math.cos(angle * mMode))).toFixed(3)),
        localStrainAmplitudeH0: this.state.monochromaticGwStrainLog10,
        superradiantGrowthRatePerSec: parseFloat((Math.pow(alpha, 4 * mMode + 5) * 1e6).toFixed(2))
      });
    }
    this.state.orbitalNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.78 + this.state.gravitationalFineStructureAlpha * 1.65;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerPbhGravitationalAtomSound(): void {
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
      const osc211 = this.audioCtx.createOscillator();
      const osc322 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc211.type = 'sine';
      osc322.type = 'triangle';

      // 氫原子巴耳末系引力對應：E_n \propto -\alpha_g^2 / (2n^2)，|322> \to |211> 躍遷拍頻與 2\mu_a 湮滅倍頻
      const fBase = 240 + this.state.gravitationalFineStructureAlpha * 480;
      const fBalmer = fBase * (1.0 - 5.0 / 36.0 * this.state.gravitationalFineStructureAlpha);

      osc211.frequency.setValueAtTime(fBase, t);
      osc322.frequency.setValueAtTime(fBalmer * 1.5, t);
      if (this.state.bosenovaCriticalityRatio >= 1.0) {
        osc322.frequency.exponentialRampToValueAtTime(fBase * 0.45, t + 0.46);
      }

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      osc211.connect(gain);
      osc322.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc211.start(t);
      osc322.start(t);
      osc211.stop(t + 0.58);
      osc322.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in PrimordialBlackHoleAxionGravitationalAtomEngine:', e);
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

export const primordialBlackHoleAxionGravitationalAtomEngine = new PrimordialBlackHoleAxionGravitationalAtomEngine();
