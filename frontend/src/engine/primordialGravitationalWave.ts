/**
 * 太初原初引力波隨機背景干涉儀 (Primordial Gravitational Wave Stochastic Background Interferometer)
 * 
 * 理論基礎：
 * 1. 宇宙暴脹時期太初量子真空張量微擾 (Tensor Perturbations, Starobinsky / Guth 1980)
 * 2. 張量標量比 (Tensor-to-Scalar Ratio) r = T/S 規範原初引力波能量密度 Ω_gw(f)
 * 3. 空間三向激光干涉儀陣列 (LISA / DECIGO / BBO 概念) 與時間延遲干涉術 (TDI)
 * 4. 等方性隨機背景赫林斯-唐斯幾何交叉關聯曲線 (Hellings-Downs Curve μ(θ))
 * 5. 4 大太初隨機引力波體制：
 *    - slow_roll_inflation_tensor: 慢滾暴脹微觀張量微擾譜
 *    - first_order_electroweak_pt: 電弱一階相變真真空氣泡碰撞
 *    - primordial_black_hole_merger: 太初微黑洞群旋進併合重力波峰
 *    - cosmic_string_loop_kinks: 宇宙弦迴路扭結超高頻隨機背景
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成帶通粉紅噪聲濾波引力背景、關聯重合定音與時空應變鳴響
 * - HTML5 Canvas 2D 呈現三芒星激光星座軌道、TDI 幾何相位消除李薩如圖與能譜靈敏度曲線
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type SGWBRegime = 
  | 'slow_roll_inflation_tensor' 
  | 'first_order_electroweak_pt' 
  | 'primordial_black_hole_merger' 
  | 'cosmic_string_loop_kinks';

export interface GravitationalWavePacket {
  id: string;
  centralFrequencyHz: number;
  strainAmplitudeH: number; // 應變振幅 h (10^-21 ~ 10^-17)
  crossCorrelationSnr: number;
  tensorPolarization: 'plus' | 'cross' | 'mixed';
  timestamp: number;
}

export interface PrimordialGWState {
  regime: SGWBRegime;
  tensorToScalarRatioR: number; // 張量標量比 r (0.001 ~ 0.050)
  interferometerArmLengthGm: number; // 臂長 (1.0 ~ 5.0 百萬公里 Gm)
  omegaGWScale: number; // 隨機引力波能量密度 h²Ω_gw
  detectorSensitivitySnr: number; // 信噪比 SNR
  hellingsDownsCorrelation: number; // 赫林斯-唐斯關聯值 μ(θ)
  detectedPacketsCount: number;
  waveHistory: GravitationalWavePacket[];
  autoCorrelationTracking: boolean;
  totalEnergyHarvestedEv: number;
}

const STORAGE_KEY = 'newworld_primordial_gw_interferometer';

class PrimordialGravitationalWaveEngine {
  private state: PrimordialGWState = {
    regime: 'slow_roll_inflation_tensor',
    tensorToScalarRatioR: 0.032,
    interferometerArmLengthGm: 2.5,
    omegaGWScale: 4.8e-15,
    detectorSensitivitySnr: 28.4,
    hellingsDownsCorrelation: 0.48,
    detectedPacketsCount: 14,
    waveHistory: [],
    autoCorrelationTracking: true,
    totalEnergyHarvestedEv: 590.0
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeInterferometry();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): PrimordialGWState {
    return { ...this.state, waveHistory: [...this.state.waveHistory] };
  }

  public setRegime(regime: SGWBRegime): void {
    this.state.regime = regime;
    this.recomputeInterferometry();
    this.playCorrelationChime();
    this.saveState();
  }

  public setTensorRatioR(r: number): void {
    this.state.tensorToScalarRatioR = Math.max(0.001, Math.min(0.050, parseFloat(r.toFixed(4))));
    this.recomputeInterferometry();
    this.saveState();
  }

  public setArmLengthGm(length: number): void {
    this.state.interferometerArmLengthGm = Math.max(1.0, Math.min(5.0, parseFloat(length.toFixed(1))));
    this.recomputeInterferometry();
    this.saveState();
  }

  public setAutoTracking(enabled: boolean): void {
    this.state.autoCorrelationTracking = enabled;
    this.saveState();
  }

  /**
   * 計算隨機引力波背景能譜密度與赫林斯-唐斯曲線
   */
  public recomputeInterferometry(): void {
    const r = this.state.tensorToScalarRatioR;
    const arm = this.state.interferometerArmLengthGm;

    // 體制增益因數
    let regimeBoost = 1.0;
    if (this.state.regime === 'slow_roll_inflation_tensor') regimeBoost = 1.0;
    if (this.state.regime === 'first_order_electroweak_pt') regimeBoost = 2.4;
    if (this.state.regime === 'primordial_black_hole_merger') regimeBoost = 3.8;
    if (this.state.regime === 'cosmic_string_loop_kinks') regimeBoost = 5.2;

    // 能量密度標度 h²Ω_gw ∝ r · regimeBoost · 10^-15
    this.state.omegaGWScale = parseFloat((r * regimeBoost * 1.5e-13).toExponential(4));

    // 信噪比 SNR ∝ √(T_obs) · (Arm / 2.5) · regimeBoost
    const snr = Math.min(99.9, Math.max(5.0, 15.0 + (arm * 5.5) + (regimeBoost * 8.0) * (r / 0.03)));
    this.state.detectorSensitivitySnr = parseFloat(snr.toFixed(1));

    // 赫林斯-唐斯交叉關聯幾何 (60度激光夾角: μ(60°) ≈ 0.25)
    this.state.hellingsDownsCorrelation = parseFloat((0.25 + (regimeBoost > 2 ? 0.2 : 0.0) + Math.sin(arm) * 0.08).toFixed(3));
  }

  /**
   * 捕獲原初時空應變波包 (Capture Gravitational Strain Packet)
   */
  public captureStrainPacket(): GravitationalWavePacket {
    this.recomputeInterferometry();
    const freq = parseFloat((0.001 + Math.random() * 0.08).toFixed(4)); // mHz ~ 0.1 Hz
    const strain = parseFloat((1.2e-21 * (1.0 + this.state.tensorToScalarRatioR * 20.0)).toExponential(3));
    const snr = parseFloat((this.state.detectorSensitivitySnr * (0.95 + Math.random() * 0.1)).toFixed(1));
    const pols: ('plus' | 'cross' | 'mixed')[] = ['plus', 'cross', 'mixed'];
    const pol = pols[Math.floor(Math.random() * pols.length)];

    const packet: GravitationalWavePacket = {
      id: `gw-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      centralFrequencyHz: freq,
      strainAmplitudeH: strain,
      crossCorrelationSnr: snr,
      tensorPolarization: pol,
      timestamp: Date.now()
    };

    this.state.waveHistory.unshift(packet);
    if (this.state.waveHistory.length > 20) {
      this.state.waveHistory.pop();
    }

    this.state.detectedPacketsCount++;
    this.state.totalEnergyHarvestedEv += 46.0 * (1.0 + snr * 0.02);

    this.playStrainChirp();
    this.saveState();
    return packet;
  }

  /**
   * 觸發 TDI 幾何相位深空校準
   */
  public calibrateInterferometer(): void {
    this.state.totalEnergyHarvestedEv += 140.0;
    this.state.detectorSensitivitySnr = Math.min(99.9, this.state.detectorSensitivitySnr + 12.0);
    this.playCorrelationChime();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoCorrelationTracking) {
      this.state.totalEnergyHarvestedEv += delta * (0.9 + this.state.detectorSensitivitySnr * 0.015);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  private playCorrelationChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 三頻純音象徵三臂激光星座閉合
      const freqs = [440.0, 554.37, 659.25]; // A大調三和弦
      freqs.forEach(f => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now);
        osc.stop(now + 0.48);
      });
    } catch {
      // 容錯靜音
    }
  }

  private playStrainChirp(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // 引力波張量應變音 (次音速掃頻)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95.0, now);
      osc.frequency.exponentialRampToValueAtTime(380.0, now + 0.28);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
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

export const primordialGWEngine = new PrimordialGravitationalWaveEngine();
