/**
 * 全息蟲洞複雜度等於體積生長與後佩奇量子洛倫茲橋引擎
 * (Holographic Wormhole Complexity-Equals-Volume Growth & Post-Page Lorentzian Bridge Engine)
 *
 * 物理原理：
 * 1. 根據 Susskind-Stanford-Brown「複雜度等於體積」(Complexity = Volume, C_V = \max_{\Sigma}[V(\Sigma)/(G_N \ell_{AdS})])
 *    與「廣義體積複雜度」(CV 2.0) 全息猜想，雙邊永恆反德西特黑洞 (Two-Sided Eternal AdS Black Hole，對偶於熱場雙態 |TFD(t)\rangle)
 *    即使在邊界糾纏熵於熱化時間 t \sim \beta 達到飽和後，其內部愛因斯坦-羅森橋 (Einstein-Rosen Bridge) 的最大類空超曲面體積
 *    仍在極長的時間尺度內以線性速率持續暴脹。
 * 2. 內部蟲洞複雜度生長速率漸近收斂至勞埃德量子計算極限 (Lloyd's Bound)：
 *    d\mathcal{C}_V / dt \to 2 M / (\pi \hbar) = (8\pi / (d-1)) T_H S_{BH}。
 * 3. 當向邊界注入能量微擾時，蝴蝶效應衝擊波 (Shockwave) 引發「折返效應」(Switchback Effect)，使體積增長延遲一個混洗時間
 *    t_* = (\beta / 2\pi) \ln S_{BH}；而在指數級時間尺度 t \sim \exp(S_{BH}) 下，非微擾歐幾里得蟲洞 / 嬰兒宇宙發射
 *    (Baby-Universe Emission) 觸發複雜度高原飽和 (Complexity Plateau)。
 */

export type WormholeComplexityRegime =
  | 'lloyd-bound-linear-volume-ramp'
  | 'shockwave-switchback-scrambling-delay'
  | 'exponential-time-baby-universe-plateau'
  | 'white-hole-bounce-complexity-decreasing';

export interface MaximalSliceBridgeNode {
  id: number;
  x: number;
  y: number;
  sliceRegion: 'left-cft-boundary' | 'interior-er-throat' | 'shockwave-caustic' | 'right-cft-boundary';
  extrinsicCurvatureTraceK: number;
  localVolumeElement: number;
  circuitDepthGatesLog: number;
}

export interface HolographicWormholeComplexityState {
  boundaryTimeExpEntropyRatio: number;    // 邊界演化時間與指數黑洞熵时间比 t / t_{plateau} (0.05 ~ 1.60)
  shockwavePerturbationEnergy: number;    // 邊界衝擊波微擾能量比 \delta E / T_H (0.00 ~ 5.00)
  maximalSliceVolumeNormalized: number;   // 最大類空切面全息複雜度體積比 V(\Sigma_{max}) / V_{sat} (0.000 ~ 1.000)
  lloydGrowthRateRatio: number;           // 瞬時複雜度生長率與勞埃德上界比 (d\mathcal{C}/dt) / (2M/\pi\hbar) (-1.000 ~ 1.000)
  switchbackDelayScramblingUnits: number; // 折返效應延遲時間與混洗時間比 \Delta t_{sw} / t_*
  babyUniverseTunnelingProb: number;      // 嬰兒宇宙非微擾量子穿隧抵消機率 P_{baby} (0.000 ~ 1.000)
  activeRegime: WormholeComplexityRegime;
  pulsePhase: number;
  bridgeNodes: MaximalSliceBridgeNode[];
}

const STORAGE_KEY = 'newworld_holographic_wormhole_complexity_state_v1';

export class HolographicWormholeComplexityVolumeEngine {
  private state: HolographicWormholeComplexityState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HolographicWormholeComplexityState {
    const defaults: HolographicWormholeComplexityState = {
      boundaryTimeExpEntropyRatio: 0.48,
      shockwavePerturbationEnergy: 1.25,
      maximalSliceVolumeNormalized: 0.472,
      lloydGrowthRateRatio: 0.964,
      switchbackDelayScramblingUnits: 1.68,
      babyUniverseTunnelingProb: 0.042,
      activeRegime: 'lloyd-bound-linear-volume-ramp',
      pulsePhase: 0,
      bridgeNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Holographic Wormhole Complexity state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Holographic Wormhole Complexity state:', e);
      }
    }
  }

  public getState(): Readonly<HolographicWormholeComplexityState> {
    return this.state;
  }

  public setBoundaryTimeRatio(tRatio: number): void {
    this.state.boundaryTimeExpEntropyRatio = Math.max(0.05, Math.min(1.60, parseFloat(tRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setShockwavePerturbation(energyRatio: number): void {
    this.state.shockwavePerturbationEnergy = Math.max(0.00, Math.min(5.00, parseFloat(energyRatio.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: WormholeComplexityRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'lloyd-bound-linear-volume-ramp':
        this.state.boundaryTimeExpEntropyRatio = 0.48;
        this.state.shockwavePerturbationEnergy = 0.40;
        break;
      case 'shockwave-switchback-scrambling-delay':
        this.state.boundaryTimeExpEntropyRatio = 0.62;
        this.state.shockwavePerturbationEnergy = 3.85;
        break;
      case 'exponential-time-baby-universe-plateau':
        this.state.boundaryTimeExpEntropyRatio = 1.35;
        this.state.shockwavePerturbationEnergy = 0.80;
        break;
      case 'white-hole-bounce-complexity-decreasing':
        this.state.boundaryTimeExpEntropyRatio = 1.52;
        this.state.shockwavePerturbationEnergy = 0.25;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const tRatio = this.state.boundaryTimeExpEntropyRatio;
    const eShock = this.state.shockwavePerturbationEnergy;

    // 折返效應混洗延遲時間 \Delta t_{sw} / t_* = 2 * \ln(1 + \delta E / T_H)
    const switchback = 2.0 * Math.log(1.0 + eShock * 1.05);
    this.state.switchbackDelayScramblingUnits = parseFloat(switchback.toFixed(2));

    // 嬰兒宇宙非微擾量子穿隧機率 P_{baby}：在 t / t_{plateau} \ge 1 時急劇躍升至 1
    const babyProb = 1.0 / (1.0 + Math.exp(-(tRatio - 1.02) / 0.14));
    this.state.babyUniverseTunnelingProb = parseFloat(babyProb.toFixed(3));

    // 瞬時複雜度生長率與勞埃德上界比：在線性斜坡區接近 1.0，高原區趨近 0，白洞反彈區為負值 (-0.85)
    let growthRate = (1.0 - babyProb) * Math.tanh(tRatio * 6.5) * Math.exp(-0.04 * eShock);
    if (this.state.activeRegime === 'white-hole-bounce-complexity-decreasing') {
      growthRate = -0.82;
    }
    this.state.lloydGrowthRateRatio = parseFloat(growthRate.toFixed(3));

    // 最大類空超曲面體積比 V(\Sigma_{max}) / V_{sat}
    const rawVol = tRatio < 1.0 ? tRatio * (1.0 - 0.06 * switchback) : 1.0 - 0.04 * Math.exp(-(tRatio - 1.0) * 3.0);
    const vol = this.state.activeRegime === 'white-hole-bounce-complexity-decreasing'
      ? Math.max(0.22, 1.0 - (tRatio - 1.0) * 0.75)
      : Math.max(0.04, Math.min(0.996, rawVol));
    this.state.maximalSliceVolumeNormalized = parseFloat(vol.toFixed(3));

    // 生成 16 個貫穿左邊界 CFT_L、愛因斯坦-羅森橋最大類空切面 \Sigma_{max} 與右邊界 CFT_R 的全息張量節點
    const nodes: MaximalSliceBridgeNode[] = [];
    const count = 16;
    const throatHalfWidth = 35 + vol * 92;

    for (let i = 0; i < count; i++) {
      const u = (i / (count - 1)) * 2.0 - 1.0; // -1 (Left CFT) to +1 (Right CFT)
      let region: 'left-cft-boundary' | 'interior-er-throat' | 'shockwave-caustic' | 'right-cft-boundary' = 'interior-er-throat';
      if (i <= 1) region = 'left-cft-boundary';
      else if (i >= count - 2) region = 'right-cft-boundary';
      else if (eShock > 1.8 && Math.abs(i - 7.5) < 2.2) region = 'shockwave-caustic';

      const x = 165 + u * throatHalfWidth;
      // 類空超曲面在 Penrose 圖內部 Nice Slice 處呈現雙曲駐波彎曲
      const shockFold = region === 'shockwave-caustic' ? 14.0 * Math.sin(u * 6.0 + this.state.pulsePhase) : 0;
      const y = 160 - 26 * (1.0 - u * u) * vol + 6.5 * Math.sin(i * 0.8 + this.state.pulsePhase) + shockFold;

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        sliceRegion: region,
        extrinsicCurvatureTraceK: parseFloat((region === 'shockwave-caustic' ? 0.18 : 0.002).toFixed(3)),
        localVolumeElement: parseFloat((vol * (1.1 - 0.4 * u * u)).toFixed(3)),
        circuitDepthGatesLog: parseFloat((12.0 + vol * 28.0 - Math.abs(u) * 6.0).toFixed(1))
      });
    }
    this.state.bridgeNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.74 + Math.abs(this.state.lloydGrowthRateRatio) * 0.72;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerWormholeComplexitySound(): void {
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
      const oscLeft = this.audioCtx.createOscillator();
      const oscRight = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscLeft.type = 'sine';
      oscRight.type = 'triangle';

      // 勞埃德線性複雜度斜坡與嬰兒宇宙高原共鳴音
      const fStart = 230 + this.state.maximalSliceVolumeNormalized * 190;
      const fEnd = fStart * (1.0 + 0.35 * this.state.lloydGrowthRateRatio);

      oscLeft.frequency.setValueAtTime(fStart, t);
      oscLeft.frequency.linearRampToValueAtTime(Math.max(120, fEnd), t + 0.42);

      oscRight.frequency.setValueAtTime(fStart * 1.5, t);
      oscRight.frequency.linearRampToValueAtTime(Math.max(180, fEnd * 1.5), t + 0.42);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscLeft.connect(gain);
      oscRight.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscLeft.start(t);
      oscRight.start(t);
      oscLeft.stop(t + 0.58);
      oscRight.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicWormholeComplexityVolumeEngine:', e);
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

export const holographicWormholeComplexityVolumeEngine = new HolographicWormholeComplexityVolumeEngine();
