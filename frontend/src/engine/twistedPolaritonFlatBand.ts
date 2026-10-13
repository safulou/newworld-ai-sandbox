/**
 * 扭轉多層光子晶體拓撲平帶極化激元反應堆
 * (Twisted Multi-layer Polariton Flat Band Photonics & Condensation Reactor)
 *
 * 核心物理理論：
 * 1. 扭轉二維光子晶體超晶格 (Twisted Moiré Photonic Crystal Superlattice)：
 *    兩層二維微腔布拉格光柵以魔角扭轉 \theta，形成微米尺度莫爾光子晶格。
 * 2. 激子-光子強耦合與拉比分裂 (Strong Exciton-Polariton Coupling & Rabi Splitting \hbar\Omega_R)：
 *    過渡金屬二硫化物單層激子與微腔光子強烈混合，生成下極化激元 (LP) 與上極化激元 (UP)：
 *    E_{\text{LP,UP}}(k) = \frac{E_{\text{ph}}(k) + E_{\text{exc}}}{2} \mp \frac{1}{2}\sqrt{\delta^2 + \hbar^2\Omega_R^2}。
 * 3. 拓撲平帶與慢光效應 (Optical Flat Band & Slow Light)：
 *    在特定莫爾微腔幾何干涉下，色散平坦化，光子群速度 v_g = \frac{1}{\hbar}\frac{\partial E}{\partial k} \to 0。
 *    光子有效質量急劇發散，光與物質非線性相互作用增強數個數量級。
 * 4. 非平衡玻色-愛因斯坦凝聚 (Nonequilibrium Polariton BEC)：
 *    極化激元為複合玻色子，在臨界泵浦功率 P \ge P_{\text{th}} 下於平帶底 k=0 自發相干凝聚，二階相干度 g^{(2)}(0) \to 1。
 * 5. TE-TM 分裂與假自旋拓撲半孤子 (TE-TM Splitting & Pseudospin Half-Solitons)：
 *    光學自旋軌道耦合誘發反常拓撲光學流，激發具手性拓撲電荷之半孤子。
 */

export type TwistedPolaritonRegime =
  | 'linear-dispersive-polariton'      // 線性色散極化激元弱泵浦相
  | 'flat-band-slow-light-condensation'// 莫爾平帶慢光玻色-愛因斯坦凝聚相
  | 'pseudospin-vortex-soliton'        // 假自旋自旋-軌道耦合拓撲半孤子漩渦相
  | 'strong-coupling-rabi-splitting';  // 超強耦合拉比分裂飽和相

export interface TwistedPolaritonState {
  twistAngleDeg: number;               // 扭轉角 \theta (度, 0.5 ~ 5.0, 魔角約 1.80°)
  rabiSplittingOmegaRMev: number;       // 拉比分裂 \hbar\Omega_R (meV, 5.0 ~ 50.0)
  cavityDetuningDeltaMev: number;       // 微腔失諧量 \delta (meV, -15.0 ~ +15.0)
  pumpLaserPowerMilliWatt: number;      // 激發泵浦雷射功率 P (mW, 0.1 ~ 100.0)
  teTmSplittingStrength: number;        // TE-TM 分裂自旋軌道耦合強度 (0.1 ~ 5.0)
  regime: TwistedPolaritonRegime;

  // 動態演算物理指標
  groupVelocityNormalized: number;      // 歸一化光子群速度 v_g / c (10^-5 ~ 0.5)
  becCondensateFractionPercent: number; // 玻色-愛因斯坦凝聚態佔比 (%)
  thresholdPumpPowerMilliWatt: number;  // BEC 臨界泵浦閾值 P_th (mW)
  secondOrderCoherenceG2: number;       // 二階光學相干度 g^(2)(0) (1.0 ~ 2.0)
  solitonTopologicalCharge: number;     // 拓撲孤子捲繞電荷 Q_top (0, 1, 2)
  telemetryHistory: Array<{
    timestamp: number;
    condensateFraction: number;
    groupVelocity: number;
    g2Coherence: number;
  }>;
}

const STORAGE_KEY = 'newworld_twisted_polariton_flat_band_state_v1';

class TwistedPolaritonEngine {
  private state: TwistedPolaritonState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): TwistedPolaritonState {
    return {
      twistAngleDeg: 1.80, // 光子晶體莫爾平帶魔角
      rabiSplittingOmegaRMev: 24.5,
      cavityDetuningDeltaMev: -2.0,
      pumpLaserPowerMilliWatt: 32.0,
      teTmSplittingStrength: 1.6,
      regime: 'flat-band-slow-light-condensation',
      groupVelocityNormalized: 0.0042, // 極低慢光效應
      becCondensateFractionPercent: 78.4,
      thresholdPumpPowerMilliWatt: 22.5,
      secondOrderCoherenceG2: 1.05,
      solitonTopologicalCharge: 1,
      telemetryHistory: []
    };
  }

  private loadState(): TwistedPolaritonState {
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

  public getState(): TwistedPolaritonState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    // 距離光學魔角 (1.80°) 之偏差
    const magicAngleDiff = Math.abs(s.twistAngleDeg - 1.80);
    // 扁帶群速度：魔角越精確，色散越平坦，群速度越接近 0
    const flatBandSuppression = Math.max(0.001, Math.min(1.0, magicAngleDiff / 1.5));
    s.groupVelocityNormalized = Number((0.002 + 0.12 * flatBandSuppression).toFixed(5));

    // 凝聚閾值 P_th 隨平帶有效質量增加而降低
    s.thresholdPumpPowerMilliWatt = Number((15.0 + 20.0 * flatBandSuppression + Math.abs(s.cavityDetuningDeltaMev) * 0.5).toFixed(2));

    // 凝聚態佔比
    if (s.pumpLaserPowerMilliWatt > s.thresholdPumpPowerMilliWatt) {
      const excessPump = s.pumpLaserPowerMilliWatt - s.thresholdPumpPowerMilliWatt;
      s.becCondensateFractionPercent = Number(Math.min(99.4, 45.0 + excessPump * 1.5).toFixed(1));
      s.secondOrderCoherenceG2 = Number(Math.max(1.01, 1.85 - (s.becCondensateFractionPercent / 100) * 0.8).toFixed(2));
    } else {
      s.becCondensateFractionPercent = Number(Math.max(0.0, (s.pumpLaserPowerMilliWatt / s.thresholdPumpPowerMilliWatt) * 25.0).toFixed(1));
      s.secondOrderCoherenceG2 = Number((1.95 - (s.becCondensateFractionPercent / 100) * 0.2).toFixed(2));
    }

    // 判定體系相態
    if (s.teTmSplittingStrength > 2.5 && s.becCondensateFractionPercent > 60.0) {
      s.regime = 'pseudospin-vortex-soliton';
      s.solitonTopologicalCharge = s.teTmSplittingStrength > 3.8 ? 2 : 1;
    } else if (s.becCondensateFractionPercent > 50.0 && s.groupVelocityNormalized < 0.05) {
      s.regime = 'flat-band-slow-light-condensation';
      s.solitonTopologicalCharge = 1;
    } else if (s.rabiSplittingOmegaRMev > 35.0) {
      s.regime = 'strong-coupling-rabi-splitting';
      s.solitonTopologicalCharge = 0;
    } else {
      s.regime = 'linear-dispersive-polariton';
      s.solitonTopologicalCharge = 0;
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
        condensateFraction: this.state.becCondensateFractionPercent,
        groupVelocity: this.state.groupVelocityNormalized,
        g2Coherence: this.state.secondOrderCoherenceG2
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public pulseOpticalPump(powerBoostMilliWatt: number = 15.0): void {
    this.state.pumpLaserPowerMilliWatt = Number(Math.min(100.0, this.state.pumpLaserPowerMilliWatt + powerBoostMilliWatt).toFixed(1));
    this.recalculatePhysics();
    this.playTone(660, 880, 0.18, 'sine');
  }

  public tuneCavityResonance(detuningDeltaMev: number): void {
    this.state.cavityDetuningDeltaMev = Number(Math.max(-15.0, Math.min(15.0, this.state.cavityDetuningDeltaMev + detuningDeltaMev)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(440, 554, 0.12, 'triangle');
  }

  public setTwistAngle(angleDeg: number): void {
    this.state.twistAngleDeg = Number(Math.max(0.5, Math.min(5.0, angleDeg)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(330, 495, 0.15, 'sine');
  }

  public triggerSolitonVortex(): void {
    this.state.teTmSplittingStrength = Number(Math.min(5.0, this.state.teTmSplittingStrength + 0.8).toFixed(2));
    if (this.state.pumpLaserPowerMilliWatt < this.state.thresholdPumpPowerMilliWatt) {
      this.state.pumpLaserPowerMilliWatt = this.state.thresholdPumpPowerMilliWatt + 10;
    }
    this.recalculatePhysics();
    this.playTone(523, 1046, 0.25, 'sawtooth');
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
    this.playTone(300, 200, 0.2, 'sine');
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

export const twistedPolaritonEngine = new TwistedPolaritonEngine();
