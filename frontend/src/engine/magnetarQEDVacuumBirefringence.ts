/**
 * 旋轉中子星磁星 (Magnetar) 超強磁場 QED 真空雙折射與星震阿爾芬剪切波引擎
 * (Magnetar QED Vacuum Birefringence & Starquake Relativistic Alfvén Wave Engine)
 *
 * 核心物理理論：
 * 1. 尤拉-海森堡 (Euler-Heisenberg) QED 真空雙折射：
 *    當磁星表面超強偶極磁場超過施溫格極限 QED 臨界磁場 $B_{\text{QED}} = \frac{m_e^2 c^3}{e \hbar} \approx 4.414 \times 10^{13}\text{ G}$ 時，
 *    量子電動力學真空極化 (虛電子-正電子對迴圈) 賦予真空非線性折射率：
 *    n_{\perp} = 1 + \frac{\alpha}{4\pi}\frac{14}{45} b^2 \sin^2\theta
 *    n_{\parallel} = 1 + \frac{\alpha}{4\pi}\frac{8}{45} b^2 \sin^2\theta
 *    折射率差 \Delta n = n_{\perp} - n_{\parallel} = \frac{\alpha}{30\pi} b^2 \sin^2\theta，式中 b = B / B_{\text{QED}}。
 *    穿過磁層的 X 射線光子產生相位延遲，其線性偏振度高達 \Pi_L > 80% (如 IXPE 觀測確認之真空雙折射證據)！
 * 2. 磁星固態地殼應力與災變性星震 (Solid Crust Magnetic Stress & Starquake)：
 *    磁星內部纏繞的超強超導通量管產生極限麥克斯韋磁張力 $T_{\text{mag}} = \frac{B^2}{8\pi}$。
 *    當磁應變 $\sigma_{\text{crust}} = \frac{B^2}{8\pi \mu_{\text{crust}}}$ 超過彈性破裂極限 $\sigma_{\text{crit}} \approx 0.1$ 時，
 *    數公里厚的中子簡併固態地殼發生災變性脆性破裂 (Starquake)，瞬時釋放 $10^{44} - 10^{46}\text{ erg}$ 的伽瑪射線巨型耀斑 (Giant Flare)。
 * 3. 相對論性阿爾芬剪切波與準週期振盪 (Relativistic Alfvén Waves & QPOs)：
 *    星震破裂將能量注入封閉磁力線環，激發傳播速度極度逼近光速的相對論性阿爾芬剪切波：
 *    v_A = c \sqrt{\frac{\sigma_m}{1 + \sigma_m}} \approx c。
 *    阿爾芬波在南北磁極間往返反射形成諧振腔，產生強烈的準週期振盪 (Quasi-Periodic Oscillations, QPOs)，
 *    特徵頻率群為 $f_n \approx (18, 30, 92, 150, 620)\text{ Hz}$。
 */

export type MagnetarRegime =
  | 'quiescent-vacuum-birefringence'      // 寧靜期 QED 偏振真空雙折射態 (\Delta n > 0, \Pi_L 穩定)
  | 'critical-crust-strain'               // 臨界地殼磁應變積累相 (\sigma \to \sigma_crit)
  | 'catastrophic-starquake-flare'        // 災變性地殼星震與巨型伽瑪射線耀斑 (E_flare > 10^44 erg)
  | 'alfven-qpo-resonance';               // 相對論阿爾芬剪切波準週期諧振態 (QPO 駐波)

export interface MagnetarQEDState {
  magneticFieldGauss: number;             // 磁星表面偶極磁場 B (10^13 ~ 2 * 10^15 G)
  crustStressRatio: number;               // 地殼磁剪切應變與破裂極限之比 (0.01 ~ 1.25, >= 1 觸發星震)
  photonEnergyKev: number;                // 探測 X 射線光子能量 (0.5 ~ 100 keV)
  flareEnergyErg: number;                 // 星震耀斑釋放能量 (10^41 ~ 10^46 erg)
  regime: MagnetarRegime;

  // 動態演算物理指標
  bOverBqedRatio: number;                 // 磁場與 QED 臨界場之比 b = B / B_QED
  deltaRefractiveIndex: number;           // 真空雙折射折射率差 \Delta n
  linearPolarizationDegreePiL: number;    // 線性偏振度 \Pi_L (0.0 ~ 1.0)
  alfvenWaveSpeedRatioC: number;          // 相對論阿爾芬波速與光速比 v_A / c (0.95 ~ 0.9999)
  dominantQpoFrequencyHz: number;         // 主導 QPO 準週期振盪頻率 (Hz)
  burstGammaLuminosityErgS: number;       // 瞬態伽瑪射線光度 (erg/s)
  starquakeTriggerCount: number;          // 累計星震觸發次數
  telemetryHistory: Array<{
    timestamp: number;
    bField: number;
    polarization: number;
    qpoFreq: number;
  }>;
}

const STORAGE_KEY = 'newworld_magnetar_qed_vacuum_birefringence_state_v1';
const B_QED_GAUSS = 4.414e13; // 施溫格 QED 臨界磁場 (4.414 * 10^13 Gauss)
const FINE_STRUCTURE_ALPHA = 1.0 / 137.036;

class MagnetarQEDEngine {
  private state: MagnetarQEDState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): MagnetarQEDState {
    return {
      magneticFieldGauss: 2.5e14, // 2.5 * 10^14 G (典型超強磁星 SGR 1806-20)
      crustStressRatio: 0.65,
      photonEnergyKev: 6.5,       // 6.5 keV (IXPE 觀測帶)
      flareEnergyErg: 1.2e43,
      regime: 'quiescent-vacuum-birefringence',
      bOverBqedRatio: 5.66,
      deltaRefractiveIndex: 2.4e-4,
      linearPolarizationDegreePiL: 0.84,
      alfvenWaveSpeedRatioC: 0.998,
      dominantQpoFrequencyHz: 92.0,
      burstGammaLuminosityErgS: 4.5e42,
      starquakeTriggerCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): MagnetarQEDState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.getDefaultState(),
            ...parsed,
            telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
          };
        }
      }
    } catch (e) {
      console.warn('[MagnetarQEDEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[MagnetarQEDEngine] 儲存失敗', e);
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * 播放星震爆炸與地殼斷裂深層衝擊音 (Starquake Rupture Blast & Deep Seismic Shock)
   */
  public playStarquakeExplosionSound(intensity: number = 1.0): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // 1. 低頻震裂正弦掃頻
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      const amp = Math.min(0.28, 0.12 * intensity);
      gain.gain.setValueAtTime(amp, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.0);

      // 2. 噪聲爆炸衝擊破
      const bufferSize = ctx.sampleRate * 0.4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(350, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18 * intensity, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn('[MagnetarQEDEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放相對論阿爾芬波 QPO 準週期諧振雙頻音 (Relativistic Alfvén QPO Dual Tone)
   */
  public playAlfvenQPOResonance(freq: number = 92.0): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);
      osc2.frequency.setValueAtTime(freq * 1.63, ctx.currentTime); // 非整數阿爾芬高次諧波

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('[MagnetarQEDEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算 QED 真空雙折射率、偏振度、磁應變與星震物理量
   */
  public recalculatePhysics(): void {
    const B = Math.max(1e13, this.state.magneticFieldGauss);
    const b = B / B_QED_GAUSS;
    this.state.bOverBqedRatio = Number(b.toFixed(2));

    // 1. 尤拉-海森堡真空雙折射 \Delta n
    // \Delta n = \frac{\alpha}{30\pi} b^2 \sin^2\theta
    // 取中緯度傳播角 \theta \approx \pi/3 (\sin^2\theta \approx 0.75)
    // 當 b >> 1 時採用強場非微擾對數過渡模型
    const sinTheta2 = 0.75;
    let deltaN: number;
    if (b < 3.0) {
      deltaN = (FINE_STRUCTURE_ALPHA / (30.0 * Math.PI)) * (b * b) * sinTheta2;
    } else {
      // 強場 QED 漸近飽和項
      deltaN = (FINE_STRUCTURE_ALPHA / (30.0 * Math.PI)) * (9.0 + 4.5 * Math.log(b / 3.0 + 1.0)) * sinTheta2;
    }
    this.state.deltaRefractiveIndex = Number(deltaN.toExponential(4));

    // 2. 穿過磁層之累積相位延遲與線性偏振度 \Pi_L
    // 相位延遲 \Delta \Phi \propto \frac{\omega}{c} \Delta n R_mag
    const photonKev = Math.max(0.1, this.state.photonEnergyKev);
    const phaseRetardation = deltaN * photonKev * 850.0;
    // 線性偏振度 \Pi_L = \tanh(\Delta \Phi / 2)
    const polDegree = Math.min(0.99, Math.max(0.05, Math.tanh(phaseRetardation)));
    this.state.linearPolarizationDegreePiL = Number(polDegree.toFixed(3));

    // 3. 相對論性阿爾芬波速 v_A / c
    // 磁化參數 \sigma_m = B^2 / (4\pi \rho c^2) >> 10^4
    // v_A / c = \sqrt{\sigma_m / (1 + \sigma_m)} \approx 1 - 1/(2\sigma_m)
    const sigmaMag = Math.max(10.0, b * 800.0);
    const vaRatio = Math.sqrt(sigmaMag / (1.0 + sigmaMag));
    this.state.alfvenWaveSpeedRatioC = Number(vaRatio.toFixed(5));

    // 4. 特徵 QPO 頻率群選擇 (18, 30, 92, 150, 620 Hz)
    const stress = this.state.crustStressRatio;
    let qpo = 92.0;
    if (stress < 0.3) qpo = 18.0;
    else if (stress < 0.6) qpo = 30.0;
    else if (stress < 0.85) qpo = 92.0;
    else if (stress < 1.0) qpo = 150.0;
    else qpo = 620.0;
    this.state.dominantQpoFrequencyHz = qpo;

    // 5. 瞬態耀斑光度 (erg/s)
    const flare = this.state.flareEnergyErg;
    const lum = (flare / 0.15); // ~ 0.15s 脈衝峰值光度
    this.state.burstGammaLuminosityErgS = Number(lum.toExponential(2));

    // 6. 相態邏輯判定
    if (stress >= 1.0) {
      this.state.regime = 'catastrophic-starquake-flare';
    } else if (stress >= 0.8) {
      this.state.regime = 'critical-crust-strain';
    } else if (this.state.regime !== 'alfven-qpo-resonance') {
      this.state.regime = 'quiescent-vacuum-birefringence';
    }
  }

  public update(deltaSeconds: number): void {
    // 地殼星震餘震與阿爾芬波阻尼
    if (this.state.regime === 'catastrophic-starquake-flare') {
      this.state.crustStressRatio = Math.max(0.4, this.state.crustStressRatio - deltaSeconds * 0.15);
      if (this.state.crustStressRatio < 0.8) {
        this.state.regime = 'alfven-qpo-resonance';
      }
      this.recalculatePhysics();
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        bField: this.state.magneticFieldGauss,
        polarization: this.state.linearPolarizationDegreePiL,
        qpoFreq: this.state.dominantQpoFrequencyHz
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setMagneticField(bGauss: number): void {
    this.state.magneticFieldGauss = Math.max(1e13, Math.min(2e15, bGauss));
    this.recalculatePhysics();
    this.saveState();
  }

  public setCrustStress(stress: number): void {
    this.state.crustStressRatio = Math.max(0.01, Math.min(1.25, stress));
    this.recalculatePhysics();
    this.saveState();
  }

  public setPhotonEnergy(kev: number): void {
    this.state.photonEnergyKev = Math.max(0.5, Math.min(100.0, kev));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發地殼斷裂星震 (Trigger Catastrophic Starquake Flare)
   */
  public triggerStarquake(): void {
    this.state.crustStressRatio = 1.15;
    this.state.flareEnergyErg = 4.6e44; // 4.6 * 10^44 erg 巨型伽瑪射線耀斑
    this.state.starquakeTriggerCount += 1;
    this.state.regime = 'catastrophic-starquake-flare';
    this.recalculatePhysics();
    this.playStarquakeExplosionSound(1.6);
    this.playAlfvenQPOResonance(this.state.dominantQpoFrequencyHz);
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: MagnetarRegime[] = [
      'quiescent-vacuum-birefringence',
      'critical-crust-strain',
      'catastrophic-starquake-flare',
      'alfven-qpo-resonance'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'quiescent-vacuum-birefringence') {
      this.state.crustStressRatio = 0.45;
    } else if (this.state.regime === 'critical-crust-strain') {
      this.state.crustStressRatio = 0.92;
    } else if (this.state.regime === 'catastrophic-starquake-flare') {
      this.triggerStarquake();
      return;
    } else {
      this.state.crustStressRatio = 0.65;
      this.playAlfvenQPOResonance(150.0);
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<MagnetarQEDState> {
    return this.state;
  }
}

export const magnetarQEDEngine = new MagnetarQEDEngine();
