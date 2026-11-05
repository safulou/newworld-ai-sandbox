/**
 * 全息德西特靜止塊體視界熱化與宇宙學糾纏島嶼引擎
 * (Holographic De Sitter Static-Patch Horizon Thermalization & Cosmological Entanglement Island Engine)
 *
 * 物理原理：
 * 1. 在德西特時空靜止塊體全息對偶 (Static-Patch dS_4/CFT_3 & Stretched-Horizon Holography, Susskind-Shaghoulian) 中，
 *    位於南極點 (Pode, r = 0) 的觀測者被半徑 r = \ell_{dS} = \sqrt{3/\Lambda} 的宇宙學事件視界包圍，
 *    具有吉本斯-霍金溫度 T_{GH} = \hbar c / (2\pi k_B \ell_{dS}) 與最大有限貝肯斯坦-吉本斯-霍金熵
 *    S_{dS} = \pi \ell_{dS}^2 / G_N（對應馮·諾伊曼 II₁ 型因子代數 Type II₁ von Neumann Algebra 之最大熵跡態）。
 * 2. 當觀測者收集視界吉本斯-霍金輻射超過宇宙學佩奇時間 t / t_{Page} > 1 時，量子極值曲面 (Quantum Extremal Surface, QES)
 *    在對蹠靜止塊體 (Antipodal Static Patch) 成核出「宇宙學糾纏島嶼」(Cosmological Entanglement Island, I_{cosmo})，
 *    使廣義糾纏熵遵循島嶼公式：
 *    S_{gen}(R) = min_{\partial I} [ Area(\partial I) / (4 G_N) + S_{bulk}(R \cup I_{cosmo}) ] \le S_{dS}，
 *    同時視界表現出超快量子資訊混洗 (Hyperfast Scrambling)。
 */

export type DeSitterStaticPatchRegime =
  | 'pre-page-gibbons-hawking-thermal-bath'
  | 'type-ii1-von-neumann-maximal-entropy-state'
  | 'antipodal-cosmological-island-nucleation'
  | 'stretched-horizon-hyperfast-scrambling';

export interface DeSitterPenroseIslandNode {
  id: number;
  x: number;
  y: number;
  patchRegion: 'pode-observer' | 'horizon-qes' | 'antipode-island';
  gibbonsHawkingFlux: number;
  generalizedEntropyContribution: number;
}

export interface HolographicDeSitterPatchState {
  deSitterRadiusPlanckRatio: number;      // 德西特視界半徑與普朗克長度有效比 \ell_{dS} / \ell_{Pl} (5.0 ~ 60.0)
  observerPageTimeRatio: number;          // 觀測者演化時間與宇宙學佩奇時間比 t / t_{Page} (0.10 ~ 2.50)
  gibbonsHawkingTempMeV: number;          // 吉本斯-霍金宇宙學視界溫度 T_{GH} = 1 / (2\pi \ell_{dS}) (相對標度)
  generalizedPageEntropyRatio: number;    // 廣義佩奇糾纏熵與德西特最大熵比 S_{gen}(R) / S_{dS} (0.000 ~ 1.000)
  antipodalIslandCoveragePct: number;     // 對蹠靜止塊體糾纏島嶼覆蓋率 (%)
  typeII1TracePurityIndex: number;        // 馮·諾伊曼 II₁ 型代數正規化跡態指標 Tr_{II₁}(\rho)
  activeRegime: DeSitterStaticPatchRegime;
  pulsePhase: number;
  penroseNodes: DeSitterPenroseIslandNode[];
}

const STORAGE_KEY = 'newworld_holographic_desitter_patch_state_v1';

export class HolographicDeSitterStaticPatchIslandEngine {
  private state: HolographicDeSitterPatchState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HolographicDeSitterPatchState {
    const defaults: HolographicDeSitterPatchState = {
      deSitterRadiusPlanckRatio: 24.0,
      observerPageTimeRatio: 1.42,
      gibbonsHawkingTempMeV: 6.63,
      generalizedPageEntropyRatio: 0.704,
      antipodalIslandCoveragePct: 84.6,
      typeII1TracePurityIndex: 0.962,
      activeRegime: 'antipodal-cosmological-island-nucleation',
      pulsePhase: 0,
      penroseNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Holographic De Sitter Static Patch state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Holographic De Sitter Static Patch state:', e);
      }
    }
  }

  public getState(): Readonly<HolographicDeSitterPatchState> {
    return this.state;
  }

  public setDeSitterRadiusRatio(rRatio: number): void {
    this.state.deSitterRadiusPlanckRatio = Math.max(5.0, Math.min(60.0, parseFloat(rRatio.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setObserverPageTimeRatio(tRatio: number): void {
    this.state.observerPageTimeRatio = Math.max(0.10, Math.min(2.50, parseFloat(tRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: DeSitterStaticPatchRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'pre-page-gibbons-hawking-thermal-bath':
        this.state.deSitterRadiusPlanckRatio = 30.0;
        this.state.observerPageTimeRatio = 0.45;
        break;
      case 'type-ii1-von-neumann-maximal-entropy-state':
        this.state.deSitterRadiusPlanckRatio = 25.0;
        this.state.observerPageTimeRatio = 1.00;
        break;
      case 'antipodal-cosmological-island-nucleation':
        this.state.deSitterRadiusPlanckRatio = 24.0;
        this.state.observerPageTimeRatio = 1.45;
        break;
      case 'stretched-horizon-hyperfast-scrambling':
        this.state.deSitterRadiusPlanckRatio = 12.5;
        this.state.observerPageTimeRatio = 1.95;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const lDs = this.state.deSitterRadiusPlanckRatio;
    const tPage = this.state.observerPageTimeRatio;

    // 吉本斯-霍金溫度 T_{GH} ∝ 1 / (2\pi \ell_{dS})
    const tGh = 1000.0 / (2.0 * Math.PI * lDs);
    this.state.gibbonsHawkingTempMeV = parseFloat(tGh.toFixed(2));

    // 廣義佩奇曲線 S_{gen} / S_{dS}：在 t / t_{Page} < 1 線性上升，在 t / t_{Page} > 1 因對蹠島嶼成核而折返下降
    const rawPage = tPage <= 1.0 ? tPage : Math.max(0.18, 2.0 - 0.92 * tPage);
    this.state.generalizedPageEntropyRatio = parseFloat(Math.min(1.0, rawPage).toFixed(3));

    // 對蹠靜止塊體糾纏島嶼覆蓋率 (%)：在跨越 t / t_{Page} ≈ 1.0 時急劇成核
    const islandSigmoid = 100.0 / (1.0 + Math.exp(-(tPage - 0.98) / 0.14));
    this.state.antipodalIslandCoveragePct = parseFloat(islandSigmoid.toFixed(1));

    // 馮·諾伊曼 II₁ 型代數跡態正規化指標
    const ii1Index = 0.78 + 0.21 * Math.tanh(lDs / 18.0) * (0.65 + 0.35 * (islandSigmoid / 100.0));
    this.state.typeII1TracePurityIndex = parseFloat(Math.min(0.998, ii1Index).toFixed(3));

    // 生成 18 個德西特彭羅斯正方形 (Penrose Square) 靜止塊體、宇宙學視界 QES 與對蹠糾纏島嶼節點
    const nodes: DeSitterPenroseIslandNode[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      let region: 'pode-observer' | 'horizon-qes' | 'antipode-island';
      let x = 165;
      let y = 160;

      if (i < 6) {
        // 左側南極靜止塊體 (Pode Observer Worldline Wedge)
        region = 'pode-observer';
        const frac = (i + 0.5) / 6;
        x = 58 + 38 * Math.sin(frac * Math.PI + this.state.pulsePhase * 0.25);
        y = 48 + frac * 224;
      } else if (i < 12) {
        // 中央雙曲交叉宇宙學事件視界與 QES 分岔點 (Bifurcate Cosmological Horizon)
        region = 'horizon-qes';
        const idx = i - 6;
        const frac = (idx + 0.5) / 6;
        x = 128 + frac * 74;
        y = idx % 2 === 0 ? 60 + frac * 200 : 260 - frac * 200;
      } else {
        // 右側對蹠北極靜止塊體糾纏島嶼 (Antipodal Cosmological Entanglement Island)
        region = 'antipode-island';
        const idx = i - 12;
        const frac = (idx + 0.5) / 6;
        x = 272 - 38 * Math.sin(frac * Math.PI - this.state.pulsePhase * 0.25);
        y = 48 + frac * 224;
      }

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        patchRegion: region,
        gibbonsHawkingFlux: parseFloat((this.state.gibbonsHawkingTempMeV * (0.75 + 0.25 * Math.cos(i + this.state.pulsePhase))).toFixed(2)),
        generalizedEntropyContribution: parseFloat((this.state.generalizedPageEntropyRatio * (region === 'antipode-island' ? 1.15 : 0.85)).toFixed(3))
      });
    }
    this.state.penroseNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.70 + (this.state.gibbonsHawkingTempMeV / 15.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerDeSitterHorizonSound(): void {
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
      const oscPode = this.audioCtx.createOscillator();
      const oscAntipode = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscPode.type = 'sine';
      oscAntipode.type = 'triangle';

      // 南極觀測者與對蹠糾纏島嶼透過 QES 視界蟲洞之共軛雙音
      const fBase = 260 + this.state.gibbonsHawkingTempMeV * 24;
      const islandRatio = 1.0 + (this.state.antipodalIslandCoveragePct / 200.0);

      oscPode.frequency.setValueAtTime(fBase, t);
      oscPode.frequency.exponentialRampToValueAtTime(fBase * islandRatio, t + 0.38);

      oscAntipode.frequency.setValueAtTime(fBase * islandRatio, t);
      oscAntipode.frequency.exponentialRampToValueAtTime(fBase, t + 0.38);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscPode.connect(gain);
      oscAntipode.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscPode.start(t);
      oscAntipode.start(t);
      oscPode.stop(t + 0.58);
      oscAntipode.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicDeSitterStaticPatchIslandEngine:', e);
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

export const holographicDeSitterStaticPatchIslandEngine = new HolographicDeSitterStaticPatchIslandEngine();
