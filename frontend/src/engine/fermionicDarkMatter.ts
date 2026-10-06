/**
 * fermionicDarkMatter.ts
 * 費米子暗物質費米面量子壓縮透鏡引擎 (Fermionic Dark Matter Quantum Squeezer Engine)
 * 
 * 物理與天體探測模擬：
 * 1. 泡利不相容原理 (Pauli Exclusion Principle) 與微觀費米子暗物質（keV 無菌中微子）量子簡併壓力。
 * 2. 暗暈中心之有限相空間密度極限與暗矮星 (Dark Dwarf) 費米面球形幾何。
 * 3. 量子壓縮引力透鏡 (Quantum Squeezed Gravitational Lens)，以低噪聲壓縮態光子穿透重子氣體阻隔。
 * 4. 4 大能態模式（無菌中微子暗暈、泡利簡併暗矮星核、量子壓縮真空透鏡、暗里德伯態相干）。
 * 5. 純代碼 Web Audio 合成量子壓縮噪聲抑制定音、暗星體捕獲晶瑩提示音與泡利排斥力高頻脈衝。
 */

export type DarkFermiMode = 'sterile_neutrino_halo' | 'pauli_degeneracy_core' | 'squeezed_graviton_lens' | 'dark_rydberg_condensate';

export interface DarkFermiConfig {
  id: DarkFermiMode;
  name: string;
  desc: string;
  fermiRadiusScale: number;
  squeezingSensitivity: number;
  baseAudioFreq: number;
  coreDensityRange: string;
}

export const DARK_FERMI_MODES: Record<DarkFermiMode, DarkFermiConfig> = {
  sterile_neutrino_halo: {
    id: 'sterile_neutrino_halo',
    name: 'keV 無菌中微子費米球 (Sterile Neutrino Fermi Ball)',
    desc: '標準模型外右手中性費米子，在矮星系中心由泡利簡併壓形成無發散光滑核心',
    fermiRadiusScale: 1.0,
    squeezingSensitivity: 1.0,
    baseAudioFreq: 261.63, // C4
    coreDensityRange: '10^7 ~ 10^9 M☉/kpc³',
  },
  pauli_degeneracy_core: {
    id: 'pauli_degeneracy_core',
    name: '泡利簡併暗矮星核 (Dark Dwarf Degenerate Core)',
    desc: '超越錢德拉塞卡極限之純暗物質緻密天體，由費米動量 p_F 抵抗引力完全塌縮',
    fermiRadiusScale: 1.4,
    squeezingSensitivity: 1.35,
    baseAudioFreq: 329.63, // E4
    coreDensityRange: '10^12 ~ 10^15 kg/m³',
  },
  squeezed_graviton_lens: {
    id: 'squeezed_graviton_lens',
    name: '量子壓縮真空度規透鏡 (Squeezed Graviton Metric)',
    desc: '利用非線性四波混頻壓制正交引力微擾噪聲，將觀測焦平面推向費米球邊界',
    fermiRadiusScale: 1.8,
    squeezingSensitivity: 1.8,
    baseAudioFreq: 392.0, // G4
    coreDensityRange: 'Quantum Squeezed Field',
  },
  dark_rydberg_condensate: {
    id: 'dark_rydberg_condensate',
    name: '暗里德伯態多體微觀相干 (Dark Rydberg Fermi Condensate)',
    desc: '長程費米子束縛對在極低溫暗暈中發生 BCS-BEC 交叉，形成巨型量子相干宏觀波',
    fermiRadiusScale: 2.3,
    squeezingSensitivity: 2.2,
    baseAudioFreq: 523.25, // C5
    coreDensityRange: 'Bose-Fermi Macro Coherence',
  },
};

const STORAGE_KEY = 'newworld_fermionic_dark_matter_state_v1';

export class FermionicDarkMatterEngine {
  private static instance: FermionicDarkMatterEngine | null = null;

  public currentMode: DarkFermiMode = 'sterile_neutrino_halo';
  public fermiMomentumKeV: number = 19.4; // p_F in keV/c
  public quantumSqueezingDb: number = 12.5; // 0 ~ 25.0 dB
  public pauliPressureMegaPascal: number = 340.0; // MPa
  public discoveredDarkBodiesCount: number = 16; // 累積觀測暗天體
  public lensResolutionPercent: number = 88.5; // 0 ~ 100%
  public isProbing: boolean = false;

  // Web Audio Context
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): FermionicDarkMatterEngine {
    if (!FermionicDarkMatterEngine.instance) {
      FermionicDarkMatterEngine.instance = new FermionicDarkMatterEngine();
    }
    return FermionicDarkMatterEngine.instance;
  }

  /**
   * 當前費米波長 (Fermi Wavelength in Angstroms)
   * \lambda_F = h / p_F
   */
  public get fermiWavelengthAngstrom(): number {
    return parseFloat((12.398 / Math.max(1.0, this.fermiMomentumKeV)).toFixed(3));
  }

  /**
   * 觸發一次費米球波前探測掃描
   */
  public probeFermiSurface(): boolean {
    this.isProbing = true;
    const modeCfg = DARK_FERMI_MODES[this.currentMode];
    this.playDarkBodyFoundTone();

    this.discoveredDarkBodiesCount += 1;
    this.pauliPressureMegaPascal += Math.round(15.0 * modeCfg.fermiRadiusScale);
    this.lensResolutionPercent = Math.min(100.0, this.lensResolutionPercent + 1.5);

    this.saveState();
    this.isProbing = false;
    return true;
  }

  /**
   * 調諧量子壓縮度 (dB)
   */
  public setQuantumSqueezing(db: number): void {
    this.quantumSqueezingDb = Math.max(0, Math.min(25.0, db));
    this.playSqueezingTone();
    this.saveState();
  }

  /**
   * 調諧費米動量能階 (keV/c)
   */
  public setFermiMomentum(pKeV: number): void {
    this.fermiMomentumKeV = Math.max(5.0, Math.min(60.0, pKeV));
    this.saveState();
  }

  /**
   * 切換費米暗物質能態模式
   */
  public setMode(mode: DarkFermiMode): void {
    this.currentMode = mode;
    this.playModeSwitchTone();
    this.saveState();
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    // 依據壓縮度自然微幅提升鏡片分辨率
    if (this.quantumSqueezingDb > 10) {
      this.lensResolutionPercent = Math.min(100.0, this.lensResolutionPercent + 0.05 * dt);
    }
  }

  // ================= 音效合成 (純 Web Audio API) =================

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * 播放量子壓縮噪聲抑制定音 (Noise Squeezing Tone)
   */
  public playSqueezingTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440.0, t);
      osc.frequency.exponentialRampToValueAtTime(880.0, t + 0.2);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.27);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 播放暗天體捕獲晶瑩提示音 (Dark Body Found Tone)
   */
  public playDarkBodyFoundTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const baseF = DARK_FERMI_MODES[this.currentMode].baseAudioFreq;

      [baseF, baseF * 1.25, baseF * 1.5, baseF * 2.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);
        gain.gain.setValueAtTime(0.15, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.38);
      });
    } catch {
      // 靜默處理
    }
  }

  /**
   * 模式切換音
   */
  public playModeSwitchTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const f = DARK_FERMI_MODES[this.currentMode].baseAudioFreq;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
    } catch {
      // 靜默處理
    }
  }

  // ================= 儲存與讀取 =================

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = {
        currentMode: this.currentMode,
        fermiMomentumKeV: this.fermiMomentumKeV,
        quantumSqueezingDb: this.quantumSqueezingDb,
        pauliPressureMegaPascal: this.pauliPressureMegaPascal,
        discoveredDarkBodiesCount: this.discoveredDarkBodiesCount,
        lensResolutionPercent: this.lensResolutionPercent,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // 忽略
    }
  }

  public loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.currentMode && DARK_FERMI_MODES[parsed.currentMode as DarkFermiMode]) {
        this.currentMode = parsed.currentMode as DarkFermiMode;
      }
      if (typeof parsed.fermiMomentumKeV === 'number') this.fermiMomentumKeV = parsed.fermiMomentumKeV;
      if (typeof parsed.quantumSqueezingDb === 'number') this.quantumSqueezingDb = parsed.quantumSqueezingDb;
      if (typeof parsed.pauliPressureMegaPascal === 'number') this.pauliPressureMegaPascal = parsed.pauliPressureMegaPascal;
      if (typeof parsed.discoveredDarkBodiesCount === 'number') this.discoveredDarkBodiesCount = parsed.discoveredDarkBodiesCount;
      if (typeof parsed.lensResolutionPercent === 'number') this.lensResolutionPercent = parsed.lensResolutionPercent;
    } catch {
      // 忽略
    }
  }
}

export const fermionicDarkMatter = FermionicDarkMatterEngine.getInstance();
