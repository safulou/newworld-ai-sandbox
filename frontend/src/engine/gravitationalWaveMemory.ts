/**
 * 時空引力波記憶效應天線矩陣 (Gravitational Wave Memory Antenna Array)
 *
 * 核心物理理論：
 * 1. 非線性克里斯托杜盧記憶效應 (Christodoulou Gravitational Wave Memory Effect)：
 *    在強引力波源（如雙黑洞併合）發射引力波時，引力波子本身的等效能量-動量張量回饋至背景度規，
 *    導致在波包完全穿過後，自由測試質量間留下永久不歸零的直流度規應變殘餘：
 *    \Delta h_{ij}^{mem} = \frac{4G}{r c^4} \int \frac{dE_{gw}}{d\Omega} \frac{n_i n_j}{1 - \mathbf{n}\cdot\mathbf{v}}。
 * 2. BMS 超平移對稱性 (Bondi-Metzner-Sachs Supertranslations at Null Infinity \mathscr{I}^+)：
 *    時空記憶效應精確對偶於漸近平坦邊界上的無窮維 BMS 超平移對稱性真空跳躍 u \to u + \alpha(\theta, \phi)。
 * 3. 軟引力子定理 (Soft Graviton Theorem) 與黑洞軟毛 (Soft Hair)：
 *    Weinberg 軟引力子定理與引力波記憶為同一個物理現象在紅外低能極限的 S 矩陣與經典度規表述；
 *    視界上的軟引力子激發儲存了全息量子資訊。
 */

export type GWMemoryRegime =
  | 'christodoulou-nonlinear' // 克里斯托杜盧非線性引力子重力記憶相
  | 'linear-supernova'        // 線性天體非對稱噴流應變相
  | 'bms-supertranslation'    // BMS 漸近超平移對稱幾何映射相
  | 'soft-graviton-vacuum';   // 軟引力子真空量子態跳躍相

export interface GWMemoryState {
  sourceDistanceMpc: number;     // 輻射源距離 r (Mpc, 10 ~ 1000)
  totalMassSolar: number;        // 雙星總質量 M (M_sun, 10 ~ 250)
  massRatioQ: number;            // 質量比 q = m1/m2 (1.0 ~ 10.0)
  radiatedEnergyPct: number;     // 引力輻射損失質量百分比 E_rad / (M c^2) % (1.0 ~ 10.0)
  regime: GWMemoryRegime;
  // 動態演算物理指標
  memoryStrainH: number;         // 永久記憶應變 \Delta h^{mem} (10^-22 標度)
  oscillatoryPeakH: number;      // 振盪峰值應變 h_peak (10^-21 標度)
  testMassDisplacementPm: number;// 4公里干涉臂測試質量永久位移 \Delta L (皮米 pm)
  bmsSupertranslationCharge: number; // BMS 超平移荷 Q_\alpha (a.u.)
  softGravitonDensity: number;   // 軟引力子紅外量子凝聚密度 (a.u.)
  mergerPhase: number;           // 當前演化相位 (0 ~ 1)
  waveformHistory: Array<{
    timeMs: number;
    oscillatoryStrain: number;
    dcMemoryStrain: number;
  }>;
}

const STORAGE_KEY = 'newworld_gw_memory_state_v1';

class GravitationalWaveMemoryEngine {
  private state: GWMemoryState;
  private audioCtx: AudioContext | null = null;
  private isBursting = false;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): GWMemoryState {
    return {
      sourceDistanceMpc: 410.0, // 類似 GW150914 距離
      totalMassSolar: 65.0,
      massRatioQ: 1.25,
      radiatedEnergyPct: 4.8, // 輻射約 3 個太陽質量
      regime: 'christodoulou-nonlinear',
      memoryStrainH: 1.85e-22,
      oscillatoryPeakH: 1.2e-21,
      testMassDisplacementPm: 0.74,
      bmsSupertranslationCharge: 1.42,
      softGravitonDensity: 3.15,
      mergerPhase: 0.0,
      waveformHistory: []
    };
  }

  private loadState(): GWMemoryState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          waveformHistory: parsed.waveformHistory || []
        };
      }
    } catch {
      // fallback
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  public getState(): GWMemoryState {
    return this.state;
  }

  public setDistance(mpc: number): void {
    this.state.sourceDistanceMpc = Math.max(10, Math.min(1000, mpc));
    this.recalculatePhysics();
  }

  public setTotalMass(solar: number): void {
    this.state.totalMassSolar = Math.max(10, Math.min(250, solar));
    this.recalculatePhysics();
  }

  public setMassRatio(q: number): void {
    this.state.massRatioQ = Math.max(1.0, Math.min(10.0, q));
    this.recalculatePhysics();
  }

  public setRadiatedEnergy(pct: number): void {
    this.state.radiatedEnergyPct = Math.max(1.0, Math.min(10.0, pct));
    this.recalculatePhysics();
  }

  public setRegime(regime: GWMemoryRegime): void {
    this.state.regime = regime;
    this.recalculatePhysics();
    this.playRegimeTone(regime);
  }

  public triggerMergerBurst(): void {
    this.isBursting = true;
    this.state.mergerPhase = 0.0;
    this.state.waveformHistory = [];
    this.playGWChirpSound();
  }

  public update(delta: number): void {
    if (this.isBursting) {
      this.state.mergerPhase += delta * 0.8;
      if (this.state.mergerPhase >= 1.0) {
        this.state.mergerPhase = 1.0;
        this.isBursting = false;
      }
      this.recordWaveformPoint();
    }
  }

  private recalculatePhysics(): void {
    // 物理標度：
    // \Delta h^{mem} \propto \frac{G E_{rad}}{r c^4}
    const distScale = 400.0 / this.state.sourceDistanceMpc;
    const massFactor = (this.state.totalMassSolar / 60.0) * (this.state.radiatedEnergyPct / 5.0);
    const symFactor = 4 * this.state.massRatioQ / Math.pow(1 + this.state.massRatioQ, 2);

    const baseMemory = 1.8e-22 * distScale * massFactor * symFactor;
    const basePeak = 1.1e-21 * distScale * Math.sqrt(massFactor) * symFactor;

    this.state.memoryStrainH = baseMemory;
    this.state.oscillatoryPeakH = basePeak;

    // 4公里干涉臂 (L = 4000 m) 之永久位移 \Delta L = L \cdot \Delta h (pm)
    this.state.testMassDisplacementPm = (4000 * this.state.memoryStrainH * 1e12);

    // BMS 超平移荷與軟引力子密度
    this.state.bmsSupertranslationCharge = 1.2 * massFactor * symFactor;
    this.state.softGravitonDensity = 2.5 * (this.state.memoryStrainH / 1e-22);

    switch (this.state.regime) {
      case 'christodoulou-nonlinear':
        this.state.memoryStrainH *= 1.25;
        break;
      case 'linear-supernova':
        this.state.memoryStrainH *= 0.45;
        this.state.oscillatoryPeakH *= 0.6;
        break;
      case 'bms-supertranslation':
        this.state.bmsSupertranslationCharge *= 1.8;
        break;
      case 'soft-graviton-vacuum':
        this.state.softGravitonDensity *= 2.2;
        break;
    }
  }

  private recordWaveformPoint(): void {
    const t = this.state.mergerPhase; // 0 ~ 1
    // 雙黑洞旋進啁啾 (Chirp) + 鈴宕 (Ringdown)
    let osc = 0;
    if (t < 0.6) {
      // 旋進階段，頻率與振幅急遽攀升
      const f = 20 + 180 * Math.pow(t / 0.6, 2.5);
      const amp = Math.pow(t / 0.6, 2) * this.state.oscillatoryPeakH;
      osc = amp * Math.sin(f * t * 2 * Math.PI);
    } else if (t < 0.8) {
      // 併合與鈴宕 (Ringdown)
      const ringdownT = (t - 0.6) / 0.2;
      const amp = this.state.oscillatoryPeakH * Math.exp(-ringdownT * 5);
      osc = amp * Math.sin(250 * (t - 0.6) * 2 * Math.PI);
    } else {
      osc = 0;
    }

    // 永久直流記憶階躍 (S 形上升後永久維持不歸零)
    const memStep = 1 / (1 + Math.exp(- (t - 0.62) * 25));
    const dcMem = this.state.memoryStrainH * memStep;

    this.state.waveformHistory.push({
      timeMs: Date.now(),
      oscillatoryStrain: osc,
      dcMemoryStrain: dcMem
    });

    if (this.state.waveformHistory.length > 80) {
      this.state.waveformHistory.shift();
    }
  }

  // === Procedural Web Audio API ===
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playGWChirpSound(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 1. 引力波旋進啁啾 (Chirp: 35Hz -> 260Hz exponential ramp)
      const oscChirp = this.audioCtx.createOscillator();
      const gainChirp = this.audioCtx.createGain();
      oscChirp.type = 'sine';
      oscChirp.frequency.setValueAtTime(40, now);
      oscChirp.frequency.exponentialRampToValueAtTime(280, now + 0.6);

      gainChirp.gain.setValueAtTime(0.01, now);
      gainChirp.gain.exponentialRampToValueAtTime(0.2, now + 0.58);
      gainChirp.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      oscChirp.connect(gainChirp);
      gainChirp.connect(this.audioCtx.destination);
      oscChirp.start(now);
      oscChirp.stop(now + 0.75);

      // 2. 併合撞擊低音 (Sub-bass merger thump)
      const oscThump = this.audioCtx.createOscillator();
      const gainThump = this.audioCtx.createGain();
      oscThump.type = 'triangle';
      oscThump.frequency.setValueAtTime(65, now + 0.58);
      oscThump.frequency.exponentialRampToValueAtTime(30, now + 0.9);

      gainThump.gain.setValueAtTime(0.25, now + 0.58);
      gainThump.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      oscThump.connect(gainThump);
      gainThump.connect(this.audioCtx.destination);
      oscThump.start(now + 0.58);
      oscThump.stop(now + 1.2);

      // 3. 永久記憶直流微鳴 (DC Memory residual sub-drone)
      const oscMem = this.audioCtx.createOscillator();
      const gainMem = this.audioCtx.createGain();
      oscMem.type = 'sine';
      oscMem.frequency.setValueAtTime(45, now + 0.65);
      gainMem.gain.setValueAtTime(0.001, now + 0.65);
      gainMem.gain.linearRampToValueAtTime(0.06, now + 0.85);
      gainMem.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      oscMem.connect(gainMem);
      gainMem.connect(this.audioCtx.destination);
      oscMem.start(now + 0.65);
      oscMem.stop(now + 1.8);
    } catch {
      // ignore
    }
  }

  private playRegimeTone(regime: GWMemoryRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      let freq = 130.81; // C3
      if (regime === 'christodoulou-nonlinear') freq = 164.81; // E3
      if (regime === 'bms-supertranslation') freq = 196.0; // G3
      if (regime === 'soft-graviton-vacuum') freq = 246.94; // B3

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.35);
    } catch {
      // ignore
    }
  }
}

export const gwMemoryEngine = new GravitationalWaveMemoryEngine();
