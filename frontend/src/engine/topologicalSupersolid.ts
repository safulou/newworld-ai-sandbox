/**
 * 拓撲超固體量子渦旋流動反應堆 (Topological Supersolid Quantum Vortex Reactor)
 * 
 * 理論基礎：
 * 1. 超固體 (Supersolidity, Chester 1969, Leggett 1970) 同時自發破缺：
 *    - 連續空間平移對稱性 (自組織週期性液滴晶格秩序 ρ(r))
 *    - 全局 U(1) 規範對稱性 (無黏滯零摩擦超流相干性 vs = ħ/m ∇φ)
 * 2. 偶極量子玻色氣體 (Dy/Er 磁性原子, Chomaz 2019, Ferrier-Barbut 2019) 羅頓軟化 (Roton softening)
 * 3. 晶格間隙中穿透之昂薩格-費曼量子化渦旋線陣列 (Quantized Vortices)
 * 4. 非經典轉動慣量異常 (Non-Classical Rotational Inertia, NCRI) 與超流比例 fs
 * 5. 4 大超固體物理體制：
 *    - droplet_crystal_superfluid: 偶極液滴晶格超流共存態
 *    - roton_excitation_condensate: 羅頓激發臨界激波凝聚態
 *    - quantized_vortex_lattice: 量子化阿布里科索夫渦旋透射晶陣
 *    - non_classical_rotational_inertia: 非經典轉動慣量異常增益
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成雙頻晶格純音、超流相干次低音嗡鳴與渦旋穿越調頻音
 * - HTML5 Canvas 2D 呈現三角/六角偶極液滴陣列、超流相位等高線、阿布里科索夫渦旋核與非經典慣量儀表
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type SupersolidRegime = 
  | 'droplet_crystal_superfluid' 
  | 'roton_excitation_condensate' 
  | 'quantized_vortex_lattice' 
  | 'non_classical_rotational_inertia';

export interface QuantizedVortexEntry {
  id: string;
  coreRadiusNm: number;
  circulationQuantum: number; // h/m 倍數
  superfluidFraction: number; // fs (0 ~ 1)
  latticeInterferencePercent: number;
  timestamp: number;
}

export interface TopologicalSupersolidState {
  regime: SupersolidRegime;
  dipolarInteractionRatio: number; // 偶極相互作用比 ε_dd (0.5 ~ 2.5)
  rotonMinimumEnergyKhz: number; // 羅頓能級極小值 Δ_roton (0.1 ~ 15.0 kHz)
  superfluidFractionPercent: number; // 超流比例 fs (0 ~ 100%)
  dropletCount: number; // 自組織自發凝聚液滴數 (7 ~ 37)
  quantizedVorticesCount: number; // 穿透量子化渦旋數
  rotationalInertiaFraction: number; // I / I_class (0.05 ~ 0.95)
  supersolidEnergyFlux: number; // 超固態相干通量 (pJ)
  vortexHistory: QuantizedVortexEntry[];
  autoVortexInjection: boolean;
  totalVorticesNucleated: number;
}

const STORAGE_KEY = 'newworld_topological_supersolid';

class TopologicalSupersolidEngine {
  private state: TopologicalSupersolidState = {
    regime: 'droplet_crystal_superfluid',
    dipolarInteractionRatio: 1.45,
    rotonMinimumEnergyKhz: 2.15,
    superfluidFractionPercent: 74.5,
    dropletCount: 19,
    quantizedVorticesCount: 6,
    rotationalInertiaFraction: 0.255,
    supersolidEnergyFlux: 840.0,
    vortexHistory: [],
    autoVortexInjection: true,
    totalVorticesNucleated: 18
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeSupersolidDynamics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): TopologicalSupersolidState {
    return { ...this.state, vortexHistory: [...this.state.vortexHistory] };
  }

  public setRegime(regime: SupersolidRegime): void {
    this.state.regime = regime;
    this.recomputeSupersolidDynamics();
    this.playCrystalLatticePing();
    this.saveState();
  }

  public setDipolarRatio(ratio: number): void {
    this.state.dipolarInteractionRatio = Math.max(0.5, Math.min(2.5, parseFloat(ratio.toFixed(2))));
    this.recomputeSupersolidDynamics();
    this.saveState();
  }

  public setRotonMinimumKhz(roton: number): void {
    this.state.rotonMinimumEnergyKhz = Math.max(0.1, Math.min(15.0, parseFloat(roton.toFixed(2))));
    this.recomputeSupersolidDynamics();
    this.saveState();
  }

  public setAutoVortexInjection(enabled: boolean): void {
    this.state.autoVortexInjection = enabled;
    this.saveState();
  }

  /**
   * 計算雙重對稱破缺與非經典慣量異常 (NCRI)
   */
  public recomputeSupersolidDynamics(): void {
    const edd = this.state.dipolarInteractionRatio;
    const deltaRoton = this.state.rotonMinimumEnergyKhz;

    // 體制增益因數
    let regimeFactor = 1.0;
    if (this.state.regime === 'droplet_crystal_superfluid') regimeFactor = 1.15;
    if (this.state.regime === 'roton_excitation_condensate') regimeFactor = 1.35;
    if (this.state.regime === 'quantized_vortex_lattice') regimeFactor = 1.6;
    if (this.state.regime === 'non_classical_rotational_inertia') regimeFactor = 2.1;

    // 超流比例 fs: 隨羅頓軟化越深 (deltaRoton 越小) 與偶極適中時最大
    const rotonSoftening = Math.max(0.1, 15.0 - deltaRoton) / 15.0;
    const fs = Math.min(99.5, Math.max(10.0, (40.0 + edd * 22.0 * rotonSoftening) * (regimeFactor * 0.75)));
    this.state.superfluidFractionPercent = parseFloat(fs.toFixed(1));

    // 非經典轉動慣量異常 I / I_class = 1 - fs
    this.state.rotationalInertiaFraction = parseFloat((Math.max(0.005, 1.0 - (fs / 100.0))).toFixed(3));

    // 自組織晶格液滴數
    this.state.dropletCount = Math.min(37, Math.max(7, Math.floor(7 + edd * 12)));
  }

  /**
   * 激發成核量子化渦旋線 (Nucleate Quantized Vortex)
   */
  public nucleateVortex(): QuantizedVortexEntry {
    this.recomputeSupersolidDynamics();
    const coreNm = parseFloat((120.0 + Math.random() * 40.0).toFixed(1));
    const fs = this.state.superfluidFractionPercent / 100.0;
    const interference = parseFloat((75.0 + Math.random() * 24.0).toFixed(1));

    const entry: QuantizedVortexEntry = {
      id: `vortex-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      coreRadiusNm: coreNm,
      circulationQuantum: 1, // h/m 單量子
      superfluidFraction: fs,
      latticeInterferencePercent: interference,
      timestamp: Date.now()
    };

    this.state.vortexHistory.unshift(entry);
    if (this.state.vortexHistory.length > 20) {
      this.state.vortexHistory.pop();
    }

    this.state.quantizedVorticesCount++;
    this.state.totalVorticesNucleated++;
    this.state.supersolidEnergyFlux += 52.0 * (1.0 + fs);

    this.playVortexChirp();
    this.saveState();
    return entry;
  }

  /**
   * 觸發羅頓激波相干共振
   */
  public triggerRotonResonance(): void {
    this.state.supersolidEnergyFlux += 160.0;
    this.state.rotonMinimumEnergyKhz = 0.5; // 深度羅頓軟化
    this.recomputeSupersolidDynamics();
    this.playRotonShockwaveTone();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoVortexInjection) {
      this.state.supersolidEnergyFlux += delta * (0.85 + (this.state.superfluidFractionPercent / 100.0) * 1.5);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  private playCrystalLatticePing(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 雙音和弦象徵晶格對稱性
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc2.frequency.setValueAtTime(659.25, now); // E5

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.38);
      osc2.stop(now + 0.38);
    } catch {
      // 容錯靜音
    }
  }

  private playVortexChirp(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // 量子化渦旋穿越晶格頻率上滑音
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320.0, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.18);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // 容錯靜音
    }
  }

  private playRotonShockwaveTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // 羅頓軟化次低音衝擊
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(146.83, now); // D3
      osc.frequency.exponentialRampToValueAtTime(73.42, now + 0.4);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.48);
    } catch {
      // 容錯靜音
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 忽略儲存例外
    }
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch {
      // 忽略載入例外
    }
  }
}

export const topologicalSupersolidEngine = new TopologicalSupersolidEngine();
