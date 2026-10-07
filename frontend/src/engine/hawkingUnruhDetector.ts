/**
 * 霍金-安魯效應全息引力對偶量子微波探測器 (Hawking-Unruh Holographic Quantum Microwave Detector)
 * 
 * 理論基礎：
 * 1. 彎曲時空量子場論與黑洞熱力學 (Hawking 1974, Unruh 1976)
 *    霍金輻射溫度 T_H = ħ c³ / (8π G M k_B)
 *    均勻加速觀測者安魯溫度 T_U = ħ a / (2π c k_B)
 * 2. 超導量子電路類比引力系統 (Circuit QED Analog Gravity, Nation et al. 2012, Johansson et al. 2009)
 *    透過超快調諧 SQUID 陣列提供等效加速度 a ~ 10^18 m/s² 之動態邊界條件，
 *    自真空態激發出雙模壓縮微波光子對 (Two-Mode Squeezed Vacuum, TMSV)。
 * 3. AdS/CFT 全息對偶糾纏熵公式 (Ryu-Takayanagi Formula 2006):
 *    S_EE = Area(γ_A) / (4 G_N)，視界糾纏度與邊界量子場論對偶。
 * 4. 4 大全息微波探測體制：
 *    - analog_blackhole_event_horizon: 超導傳輸線超音速模擬事件視界
 *    - unruh_accelerated_frame_squeezing: 相對論高加速度動態真空壓縮輻射
 *    - two_mode_squeezed_microwave: 雙模糾纏量子微波對發射與符合計數
 *    - holographic_ryu_takayanagi_boundary: AdS/CFT 全息對偶視界糾纏熵映射
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成視界微波光子爆裂嘀噠、真空噪聲壓縮濾波呼嘯、全息共形泛音和弦
 * - HTML5 Canvas 2D 呈現雙模壓縮態相空間 Wigner 分佈橢圓、事件視界光錐逃逸軌跡與全息龐加萊雙曲測地線
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type HawkingUnruhRegime = 
  | 'analog_blackhole_event_horizon' 
  | 'unruh_accelerated_frame_squeezing' 
  | 'two_mode_squeezed_microwave' 
  | 'holographic_ryu_takayanagi_boundary';

export interface MicrowavePhotonBurst {
  id: string;
  frequencyGhz: number;
  squeezingDecibel: number;
  conformalEntropy: number;
  coincidenceRateKhz: number;
  timestamp: number;
}

export interface HawkingUnruhState {
  regime: HawkingUnruhRegime;
  effectiveAcceleration1e18: number; // 等效加速度 (10^18 m/s²) (1.0 ~ 10.0)
  hawkingUnruhTempMilliKelvin: number; // 霍金-安魯溫度 (mK)
  squeezingFactorDb: number; // 壓縮度 (dB) (3.0 ~ 20.0 dB)
  microwavePhotonRateMegaHz: number; // 微波光子率 (MHz)
  twoModeEntanglementEntropy: number; // 雙模糾纏熵 (ebits)
  conformalRadiusNm: number; // 全息對偶邊界半徑 (nm)
  quantumFidelityPercent: number; // 量子態保真度 (0 ~ 100%)
  totalBurstsDetected: number;
  autoHorizonFluctuation: boolean;
  burstHistory: MicrowavePhotonBurst[];
}

const STORAGE_KEY = 'newworld_hawking_unruh_detector';

class HawkingUnruhDetectorEngine {
  private state: HawkingUnruhState = {
    regime: 'two_mode_squeezed_microwave',
    effectiveAcceleration1e18: 4.8,
    hawkingUnruhTempMilliKelvin: 19.4,
    squeezingFactorDb: 13.6,
    microwavePhotonRateMegaHz: 3.12,
    twoModeEntanglementEntropy: 1.58,
    conformalRadiusNm: 360,
    quantumFidelityPercent: 97.4,
    totalBurstsDetected: 84,
    autoHorizonFluctuation: true,
    burstHistory: []
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeRadiationPhysics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): HawkingUnruhState {
    return { ...this.state, burstHistory: [...this.state.burstHistory] };
  }

  public setRegime(regime: HawkingUnruhRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'analog_blackhole_event_horizon':
        this.state.effectiveAcceleration1e18 = 6.5;
        this.state.squeezingFactorDb = 10.5;
        break;
      case 'unruh_accelerated_frame_squeezing':
        this.state.effectiveAcceleration1e18 = 8.2;
        this.state.squeezingFactorDb = 15.8;
        break;
      case 'two_mode_squeezed_microwave':
        this.state.effectiveAcceleration1e18 = 4.8;
        this.state.squeezingFactorDb = 13.6;
        break;
      case 'holographic_ryu_takayanagi_boundary':
        this.state.effectiveAcceleration1e18 = 3.2;
        this.state.squeezingFactorDb = 18.2;
        break;
    }
    this.recomputeRadiationPhysics();
    this.playHorizonResonanceChime();
    this.saveState();
  }

  public setAcceleration(acc1e18: number): void {
    this.state.effectiveAcceleration1e18 = Math.max(1.0, Math.min(10.0, parseFloat(acc1e18.toFixed(2))));
    this.recomputeRadiationPhysics();
    this.saveState();
  }

  public setSqueezingDb(squeezing: number): void {
    this.state.squeezingFactorDb = Math.max(3.0, Math.min(20.0, parseFloat(squeezing.toFixed(1))));
    this.recomputeRadiationPhysics();
    this.saveState();
  }

  public toggleAutoFluctuation(): void {
    this.state.autoHorizonFluctuation = !this.state.autoHorizonFluctuation;
    this.saveState();
  }

  public triggerPhotonBurst(): void {
    const burst: MicrowavePhotonBurst = {
      id: 'burst-' + Date.now().toString(36),
      frequencyGhz: parseFloat((5.0 + Math.random() * 6.0).toFixed(2)),
      squeezingDecibel: this.state.squeezingFactorDb,
      conformalEntropy: parseFloat((this.state.twoModeEntanglementEntropy * (0.95 + Math.random() * 0.1)).toFixed(3)),
      coincidenceRateKhz: parseFloat((400 + Math.random() * 350).toFixed(1)),
      timestamp: Date.now()
    };
    this.state.burstHistory.unshift(burst);
    if (this.state.burstHistory.length > 20) {
      this.state.burstHistory.pop();
    }
    this.state.totalBurstsDetected += 1;
    this.playPhotonClick();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoHorizonFluctuation) {
      const drift = Math.sin(Date.now() / 3200) * 0.15;
      this.state.twoModeEntanglementEntropy = parseFloat((1.5 + drift).toFixed(3));
    }

    if (Math.random() < 0.25 * deltaSeconds) {
      this.triggerPhotonBurst();
    }
  }

  private recomputeRadiationPhysics(): void {
    // 安魯溫度 T_U = ħ a / (2π c k_B) ~ 4.05 × a(10^18) mK
    const temp = this.state.effectiveAcceleration1e18 * 4.05;
    this.state.hawkingUnruhTempMilliKelvin = parseFloat(temp.toFixed(2));

    // 微波光子產生率 (玻色-愛因斯坦分佈)
    const rate = 0.5 + (temp / 10.0) * 0.8 + (this.state.squeezingFactorDb / 20.0) * 1.5;
    this.state.microwavePhotonRateMegaHz = parseFloat(rate.toFixed(2));

    // 雙模壓縮糾纏熵
    const r = this.state.squeezingFactorDb / 8.686; // 壓縮參數 r
    const entropy = Math.cosh(r) * Math.log2(Math.cosh(r) + 0.001);
    this.state.twoModeEntanglementEntropy = parseFloat(Math.min(3.5, Math.max(0.5, entropy)).toFixed(2));

    // 量子保真度
    let fidelity = 95.0 + (this.state.squeezingFactorDb / 20.0) * 3.8;
    this.state.quantumFidelityPercent = parseFloat(Math.min(99.9, fidelity).toFixed(1));
  }

  // --- Web Audio 程序化合成 ---

  public playPhotonClick(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 快速脈衝點擊音
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch { /* ignore */ }
  }

  public playHorizonResonanceChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 全息共形和弦 (雙振盪器)
      [528, 792].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + idx * 0.1);

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

export const hawkingUnruhDetectorEngine = new HawkingUnruhDetectorEngine();
