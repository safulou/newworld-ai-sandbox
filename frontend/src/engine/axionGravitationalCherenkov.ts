/**
 * 軸子弦星系激波與超光速引力切倫科夫輻射天線
 * (Axion String Galactic Shock & Gravitational Cherenkov Antenna)
 *
 * 核心物理理論：
 * 1. 軸子宇宙弦網與星系激波 (Axion Cosmic String Network & Relativistic Shocks)：
 *    佩切伊-奎恩 U(1)_PQ 對稱性自發破缺形成拓撲宇宙弦，弦張力 \mu \sim 2\pi f_a^2。
 *    弦環劇烈振盪或尖點 (Cusps) 相互湮滅，釋放 PeV 級超相對論性軸子孤子激波。
 * 2. 修正引力引力子相速度微擾 (Modified Graviton Phase Velocity c_grav)：
 *    在雙度規引力 (Bimetric Gravity) 或高能洛倫茲微擾下，引力子相速度 c_{\text{grav}} = c(1 - \delta_g) 微小低於光速。
 * 3. 引力切倫科夫輻射 (Gravitational Cherenkov Radiation)：
 *    當高能粒子或軸子激波速度 v 突破局域引力相速度 (v > c_{\text{grav}})，
 *    粒子在時空中自發釋放相干引力波激波錐，切倫科夫角滿足 \cos\theta_C = \frac{c_{\text{grav}}}{v}。
 * 4. 引力切倫科夫能量耗散率 (Energy Loss Rate)：
 *    \frac{dE}{dx} = -\frac{G M^2 \omega_{\text{max}}^2}{3 c^3} \left(1 - \frac{c_{\text{grav}}^2}{v^2}\right)。
 *    此效應對超高能宇宙線產生嚴格普朗克尺度截斷，並產生獨特高頻相干引力波譜線。
 */

export type AxionCherenkovRegime =
  | 'sub-cherenkov-stable-propagation'       // 次切倫科夫亞臨界穩定傳播相 (v < c_grav)
  | 'gravitational-cherenkov-shock-cone'     // 引力切倫科夫相干激波錐相 (v > c_grav)
  | 'axion-string-cusp-burst'                // 軸子宇宙弦尖點坍縮巨暴發相
  | 'bimetric-metric-birefringence-decay';   // 雙度規度規雙折射能量衰減相

export interface AxionCherenkovState {
  particleVelocityNormalized: number;        // 激波粒子速度 v / c (0.99000 ~ 0.99999)
  gravitonSpeedFraction: number;             // 引力子相速度 c_grav / c (0.99000 ~ 0.99990)
  axionStringTensionLogFa: number;           // 軸子衰變常數 log10(f_a / GeV, 10.0 ~ 16.0)
  shockEnergyPev: number;                    // 激波能量 (PeV, 0.1 ~ 50.0)
  regime: AxionCherenkovRegime;

  // 動態演算物理指標
  cherenkovAngleDeg: number;                 // 引力切倫科夫錐開角 \theta_C (度, 0.0 ~ 15.0°)
  gravitationalRadiationPowerWatts: number;  // 輻射功率 (10^28 W, 0.0 ~ 85.0)
  energyLossRateGevPerMeter: number;         // 能量耗散率 dE/dx (10^5 GeV/m, 0.0 ~ 45.0)
  stringCuspOscillationFreqKhz: number;      // 弦尖點振盪頻率 (kHz, 0.1 ~ 20.0)
  lorentzFactorGamma: number;                // 勞倫茲因子 \gamma (7.0 ~ 225.0)
  telemetryHistory: Array<{
    timestamp: number;
    cherenkovAngle: number;
    radiationPower: number;
    lossRate: number;
  }>;
}

const STORAGE_KEY = 'newworld_axion_gravitational_cherenkov_state_v1';

class AxionGravitationalCherenkovEngine {
  private state: AxionCherenkovState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): AxionCherenkovState {
    return {
      particleVelocityNormalized: 0.99985,
      gravitonSpeedFraction: 0.99920,
      axionStringTensionLogFa: 12.5,
      shockEnergyPev: 8.5,
      regime: 'gravitational-cherenkov-shock-cone',
      cherenkovAngleDeg: 2.07,
      gravitationalRadiationPowerWatts: 24.8,
      energyLossRateGevPerMeter: 12.3,
      stringCuspOscillationFreqKhz: 4.8,
      lorentzFactorGamma: 57.7,
      telemetryHistory: []
    };
  }

  private loadState(): AxionCherenkovState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: Array.isArray(parsed.telemetryHistory) ? parsed.telemetryHistory.slice(-20) : []
        };
      }
    } catch {
      // 降級使用預設
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 略過儲存例外
    }
  }

  public getState(): AxionCherenkovState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // 勞倫茲因子 \gamma = 1 / \sqrt{1 - v^2}
    const beta = Math.min(0.99999, Math.max(0.5, s.particleVelocityNormalized));
    s.lorentzFactorGamma = Number((1.0 / Math.sqrt(Math.max(0.000001, 1 - beta * beta))).toFixed(1));

    // 切倫科夫條件：v > c_grav
    if (beta > s.gravitonSpeedFraction) {
      // \cos \theta_C = c_grav / v
      const cosTheta = s.gravitonSpeedFraction / beta;
      const rad = Math.acos(Math.min(1.0, Math.max(0.0, cosTheta)));
      s.cherenkovAngleDeg = Number(((rad * 180) / Math.PI).toFixed(2));

      // 輻射功率與能量耗散率 (歸一化 10^28 W 與 10^5 GeV/m)
      const diffSpeedRatio = Math.max(0.0, (beta - s.gravitonSpeedFraction) * 1e4);
      s.gravitationalRadiationPowerWatts = Number((diffSpeedRatio * (s.shockEnergyPev * 2.8) * (s.axionStringTensionLogFa / 12.0)).toFixed(2));
      s.energyLossRateGevPerMeter = Number((diffSpeedRatio * (s.shockEnergyPev * 1.5)).toFixed(2));
    } else {
      s.cherenkovAngleDeg = 0.0;
      s.gravitationalRadiationPowerWatts = 0.0;
      s.energyLossRateGevPerMeter = 0.0;
    }

    // 宇宙弦尖點振盪頻率
    s.stringCuspOscillationFreqKhz = Number(((s.axionStringTensionLogFa - 9.0) * 1.5 + (s.shockEnergyPev * 0.1)).toFixed(2));

    // 狀態判定
    if (s.shockEnergyPev > 30.0) {
      s.regime = 'axion-string-cusp-burst';
    } else if (s.cherenkovAngleDeg > 0.0 && s.gravitonSpeedFraction < 0.995) {
      s.regime = 'bimetric-metric-birefringence-decay';
    } else if (s.cherenkovAngleDeg > 0.0) {
      s.regime = 'gravitational-cherenkov-shock-cone';
    } else {
      s.regime = 'sub-cherenkov-stable-propagation';
    }

    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (deltaSeconds <= 0) return;
    this.recalculatePhysics();

    const now = Date.now();
    const lastTime = this.state.telemetryHistory.length > 0
      ? this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp
      : 0;

    if (now - lastTime >= 1000) {
      this.state.telemetryHistory.push({
        timestamp: now,
        cherenkovAngle: this.state.cherenkovAngleDeg,
        radiationPower: this.state.gravitationalRadiationPowerWatts,
        lossRate: this.state.energyLossRateGevPerMeter
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public injectRelativisticAxionShock(energyPevBoost: number = 5.0): void {
    this.state.shockEnergyPev = Number(Math.min(50.0, this.state.shockEnergyPev + energyPevBoost).toFixed(1));
    this.state.particleVelocityNormalized = Number(Math.min(0.99999, this.state.particleVelocityNormalized + 0.00005).toFixed(5));
    this.recalculatePhysics();
    this.playTone(480, 960, 0.22, 'sawtooth');
  }

  public modulateGravitonPhaseVelocity(speedDelta: number): void {
    this.state.gravitonSpeedFraction = Number(Math.max(0.99000, Math.min(0.99990, this.state.gravitonSpeedFraction + speedDelta)).toFixed(5));
    this.recalculatePhysics();
    this.playTone(320, 580, 0.15, 'triangle');
  }

  public triggerAxionStringCusp(): void {
    this.state.shockEnergyPev = 35.0;
    this.state.particleVelocityNormalized = 0.99995;
    this.recalculatePhysics();
    this.playTone(600, 1200, 0.35, 'square');
  }

  public dampEnergyLoss(): void {
    this.state.shockEnergyPev = Number(Math.max(0.5, this.state.shockEnergyPev * 0.7).toFixed(1));
    this.state.particleVelocityNormalized = 0.99850;
    this.recalculatePhysics();
    this.playTone(400, 200, 0.2, 'sine');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(300, 220, 0.2, 'sine');
  }

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playTone(fStart: number, fEnd: number, duration: number, type: OscillatorType = 'sine'): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(fStart, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // 忽視靜音
    }
  }
}

export const axionGravitationalCherenkovEngine = new AxionGravitationalCherenkovEngine();
export const axionCherenkovEngine = axionGravitationalCherenkovEngine;
