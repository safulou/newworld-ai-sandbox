/**
 * 旋量玻色-愛因斯坦凝聚斯格明子拓撲天體反應堆 (Spinor Skyrmion Condensate Reactor)
 * 
 * 理論基礎：
 * 1. 旋量玻色-愛因斯坦凝聚 (Spinor BEC, Ho 1998, Ohmi & Machida 1998, Kawaguchi & Ueda 2012)
 *    自旋 F=1 多分量向量序參量 Ψ = (ψ_{+1}, ψ_0, ψ_{-1})^T
 * 2. 斯格明子拓撲荷 (Skyrmion Topological Charge / Pontryagin Index):
 *    Q = (1 / 4π) ∬ n · (∂n/∂x × ∂n/∂y) dx dy ∈ ℤ
 * 3. 2D 梅森子 (Meron) 對偶性與 3D 合成規範場狄拉克單極子 (Dirac Monopole, Ray et al. 2014)
 * 4. 自旋-軌道耦合 (SOC) 誘發動態自旋紋理流動與自旋向列液晶態相變
 * 5. 4 大旋量拓撲動力學體制：
 *    - ferromagnetic_skyrmion_lattice: 鐵磁相二維斯格明子自組織晶格
 *    - polar_coreless_vortex_pair: 極性相無核渦旋對與梅森子對偶態
 *    - synthetic_gauge_monopole: 合成規範場貝里曲率三維狄拉克單極子
 *    - spin_nematic_director_liquid: 自旋向列相液晶態雙重旋轉流動
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成自旋歲差多諧振純音、斯格明子拓撲核旋轉次低音、單極子奇點調和波
 * - HTML5 Canvas 2D 呈現 2D 斯格明子向量箭頭紋理場 (刺猬狀/螺旋狀)、拓撲磁單極場線與自旋分量色圖
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type SpinorRegime = 
  | 'ferromagnetic_skyrmion_lattice' 
  | 'polar_coreless_vortex_pair' 
  | 'synthetic_gauge_monopole' 
  | 'spin_nematic_director_liquid';

export interface SkyrmionClusterTelemetry {
  id: string;
  topologicalCharge: number; // Q = ±1, ±2
  coreRadiusNm: number;
  spinPolarization: number;
  helicityRad: number;
  timestamp: number;
}

export interface SpinorSkyrmionState {
  regime: SpinorRegime;
  spinF: number; // 自旋量子數 F=1
  quadraticZeemanKhz: number; // 二次塞曼位移 q (kHz) (-5.0 ~ 15.0)
  topologicalChargeQ: number; // 斯格明子總拓撲荷 Q
  skyrmionDensity1e8: number; // 斯格明子密度 (10^8 cm^-2)
  spinNematicOrderParameter: number; // 向列序參量 <S_z^2 - 2/3> (0 ~ 1)
  monopoleSyntheticFlux: number; // 合成單極子磁通 (h/e)
  condensateCoherencePercent: number; // 相干度 (0 ~ 100%)
  autoTexturePrecession: boolean;
  totalSkyrmionsGenerated: number;
  skyrmionHistory: SkyrmionClusterTelemetry[];
}

const STORAGE_KEY = 'newworld_spinor_skyrmion_condensate';

class SpinorSkyrmionEngine {
  private state: SpinorSkyrmionState = {
    regime: 'ferromagnetic_skyrmion_lattice',
    spinF: 1,
    quadraticZeemanKhz: 2.8,
    topologicalChargeQ: 1,
    skyrmionDensity1e8: 6.4,
    spinNematicOrderParameter: 0.88,
    monopoleSyntheticFlux: 1.0,
    condensateCoherencePercent: 96.5,
    autoTexturePrecession: true,
    totalSkyrmionsGenerated: 36,
    skyrmionHistory: []
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeSpinorPhysics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): SpinorSkyrmionState {
    return { ...this.state, skyrmionHistory: [...this.state.skyrmionHistory] };
  }

  public setRegime(regime: SpinorRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'ferromagnetic_skyrmion_lattice':
        this.state.topologicalChargeQ = 1;
        this.state.quadraticZeemanKhz = 2.0;
        break;
      case 'polar_coreless_vortex_pair':
        this.state.topologicalChargeQ = 0; // 渦旋對拓撲荷相互抵消
        this.state.quadraticZeemanKhz = 8.5;
        break;
      case 'synthetic_gauge_monopole':
        this.state.topologicalChargeQ = 2; // 二維投影單極子荷
        this.state.quadraticZeemanKhz = 0.5;
        break;
      case 'spin_nematic_director_liquid':
        this.state.topologicalChargeQ = 1;
        this.state.quadraticZeemanKhz = -2.5;
        break;
    }
    this.recomputeSpinorPhysics();
    this.playSkyrmionHarmonicChime();
    this.saveState();
  }

  public setQuadraticZeeman(qKhz: number): void {
    this.state.quadraticZeemanKhz = Math.max(-5.0, Math.min(15.0, parseFloat(qKhz.toFixed(2))));
    this.recomputeSpinorPhysics();
    this.saveState();
  }

  public setSkyrmionDensity(density: number): void {
    this.state.skyrmionDensity1e8 = Math.max(1.0, Math.min(20.0, parseFloat(density.toFixed(1))));
    this.recomputeSpinorPhysics();
    this.saveState();
  }

  public toggleAutoPrecession(): void {
    this.state.autoTexturePrecession = !this.state.autoTexturePrecession;
    this.saveState();
  }

  public nucleateSkyrmion(): void {
    const qSign = Math.random() > 0.15 ? 1 : -1;
    const item: SkyrmionClusterTelemetry = {
      id: 'skyrmion-' + Date.now().toString(36),
      topologicalCharge: qSign * (Math.random() > 0.8 ? 2 : 1),
      coreRadiusNm: parseFloat((180 + Math.random() * 120).toFixed(1)),
      spinPolarization: parseFloat((0.85 + Math.random() * 0.14).toFixed(3)),
      helicityRad: parseFloat((Math.PI * (0.5 + Math.random() * 0.5)).toFixed(2)),
      timestamp: Date.now()
    };
    this.state.skyrmionHistory.unshift(item);
    if (this.state.skyrmionHistory.length > 20) {
      this.state.skyrmionHistory.pop();
    }
    this.state.totalSkyrmionsGenerated += 1;
    this.playSkyrmionChirp();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoTexturePrecession) {
      const wobble = Math.sin(Date.now() / 2800) * 0.05;
      this.state.spinNematicOrderParameter = parseFloat((0.88 + wobble).toFixed(3));
    }

    if (Math.random() < 0.2 * deltaSeconds) {
      this.nucleateSkyrmion();
    }
  }

  private recomputeSpinorPhysics(): void {
    // 塞曼效應與向列序參量依賴
    // q > 0 傾向極性相 (Polar Phase, ψ_0 占主導)
    // q < 0 傾向鐵磁相 (Ferromagnetic Phase, ψ_±1 占主導)
    const q = this.state.quadraticZeemanKhz;
    const polarFraction = 1.0 / (1.0 + Math.exp(-q / 3.0));
    this.state.spinNematicOrderParameter = parseFloat((0.5 + polarFraction * 0.45).toFixed(3));

    // 合成磁通
    this.state.monopoleSyntheticFlux = parseFloat((this.state.topologicalChargeQ * 1.0).toFixed(2));

    // 凝聚體相干性
    const coherence = 92.0 + (this.state.skyrmionDensity1e8 / 20.0) * 6.5;
    this.state.condensateCoherencePercent = parseFloat(Math.min(99.9, coherence).toFixed(1));
  }

  // --- Web Audio 程序化合成 ---

  public playSkyrmionChirp(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch { /* ignore */ }
  }

  public playSkyrmionHarmonicChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 旋量多重本徵態和弦 (三振盪器對應 F_z = -1, 0, +1)
      [360, 540, 720].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + idx * 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch { /* ignore */ }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* ignore */ }
  }
}

export const spinorSkyrmionEngine = new SpinorSkyrmionEngine();
