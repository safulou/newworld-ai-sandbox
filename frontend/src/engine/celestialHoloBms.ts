/**
 * 引力波天球全息與 BMS 漸近超平移天線
 * (Gravitational Wave Celestial Holography & BMS Supertranslation Synthesizer)
 *
 * 核心物理理論：
 * 1. 平坦空間天球全息 (Celestial Holography & CCFT)：
 *    在漸近閔可夫斯基時空中，四維量子引力之 S-矩陣散色振幅透過梅林變換 (Mellin Transform)
 *    映射至二維天球 (\mathcal{CS}^2) 上，對偶於二維天球共形場論 (Celestial CFT, CCFT)
 *    之共形初級算子關聯函數 (Conformal Primary Correlators)。
 * 2. 溫伯格軟引力子定理與 BMS 超平移對偶 (Soft Graviton & BMS Supertranslations)：
 *    零能量極限下的軟引力子定理 \lim_{\omega\to 0} \mathcal{M}_{n+1} = S^{(0)}\mathcal{M}_n
 *    精確等價於天球上的邦迪-梅茲納-薩克斯 (BMS) 超平移瓦德恆等式 (Ward Identity)。
 *    引力波穿越引發漸近度規剪切 \Delta C_{zz}，形成永久天球記憶效應 (Memory Effect)。
 * 3. 次領頭階軟引力子與天球維拉宿超旋轉 (Subleading Soft Theorem & Superrotations)：
 *    次領頭階軟定理對偶於局部共形超旋轉，在天球上構建出具備能量動量張量 T(z)
 *    之維拉宿代數 (Virasoro Symmetry)，突破傳統龐加萊對稱性限制。
 */

export type CelestialHoloRegime =
  | 'celestial-cft-conformal-primary'   // 天球共形初級波函數相 (梅林振幅對偶)
  | 'bms-supertranslation-memory'      // BMS 超平移引力波度規剪切記憶態 (\Delta C_{zz})
  | 'soft-graviton-ward-identity'      // 軟引力子定理瓦德恆等式飽和相 (零能極限定理)
  | 'virasoro-superrotation-stress';   // 天球維拉宿超旋轉應力張量相 (局部微分同胚)

export interface CelestialHoloState {
  asymptoticRadiusRpc: number;          // 漸近天球半徑 r (kpc, 1.0 ~ 50.0)
  metricShearAmplitudeDeltaC: number;   // 漸近度規剪切振幅 \Delta C_{zz} (10^-21, 0.1 ~ 20.0)
  celestialConformalWeightDelta: number;// 共形維度 \Delta = 1 + i\lambda (0.5 ~ 6.0)
  softGravitonEnergyCutoffGev: number;  // 軟引力子紅外截斷能標 (GeV, 0.001 ~ 10.0)
  conformalSpinJ: number;               // 天球共形自旋 J (-2 ~ 2)
  regime: CelestialHoloRegime;

  // 動態演算物理指標
  bmsSupertranslationChargeQ: number;  // BMS 超平移守恆電荷 Q_f
  virasoroCentralChargeEff: number;     // 天球維拉宿有效中心荷 c_eff
  mellinAmplitudeIntensity: number;     // 梅林全息振幅強度 |\mathcal{A}_CCFT|
  softFactorSingularityScale: number;   // 軟極點奇異強度 (1/\omega)
  celestialMetricShearAngleDeg: number; // 天球剪切極化角 (度, 0.0 ~ 360.0)
  telemetryHistory: Array<{
    timestamp: number;
    bmsCharge: number;
    shearAmp: number;
    mellinAmp: number;
  }>;
}

const STORAGE_KEY = 'newworld_celestial_holo_bms_state_v1';

class CelestialHoloBmsEngine {
  private state: CelestialHoloState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): CelestialHoloState {
    return {
      asymptoticRadiusRpc: 12.5,
      metricShearAmplitudeDeltaC: 4.8, // 4.8 x 10^-21
      celestialConformalWeightDelta: 2.0,
      softGravitonEnergyCutoffGev: 0.05,
      conformalSpinJ: 2, // 引力子自旋 s=2
      regime: 'celestial-cft-conformal-primary',
      bmsSupertranslationChargeQ: 38.4,
      virasoroCentralChargeEff: 24.0,
      mellinAmplitudeIntensity: 0.942,
      softFactorSingularityScale: 20.0,
      celestialMetricShearAngleDeg: 45.0,
      telemetryHistory: []
    };
  }

  private loadState(): CelestialHoloState {
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
      // 降級取預設
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

  public getState(): CelestialHoloState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<CelestialHoloState, 'asymptoticRadiusRpc' | 'metricShearAmplitudeDeltaC' | 'celestialConformalWeightDelta' | 'softGravitonEnergyCutoffGev' | 'conformalSpinJ' | 'regime'>>): void {
    if (params.asymptoticRadiusRpc !== undefined) {
      this.state.asymptoticRadiusRpc = Math.max(1.0, Math.min(50.0, Number(params.asymptoticRadiusRpc)));
    }
    if (params.metricShearAmplitudeDeltaC !== undefined) {
      this.state.metricShearAmplitudeDeltaC = Math.max(0.1, Math.min(20.0, Number(params.metricShearAmplitudeDeltaC)));
    }
    if (params.celestialConformalWeightDelta !== undefined) {
      this.state.celestialConformalWeightDelta = Math.max(0.5, Math.min(6.0, Number(params.celestialConformalWeightDelta)));
    }
    if (params.softGravitonEnergyCutoffGev !== undefined) {
      this.state.softGravitonEnergyCutoffGev = Math.max(0.001, Math.min(10.0, Number(params.softGravitonEnergyCutoffGev)));
    }
    if (params.conformalSpinJ !== undefined) {
      this.state.conformalSpinJ = Math.max(-2, Math.min(2, Math.round(Number(params.conformalSpinJ))));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }

    this.recalculatePhysics();
    this.playTone();
    this.saveState();
  }

  public resetDefaults(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public pulseSoftGraviton(): void {
    // 注入一次軟引力子輻射脈衝，觸發度規剪切永久躍遷
    this.state.metricShearAmplitudeDeltaC = Number((this.state.metricShearAmplitudeDeltaC + 0.8).toFixed(1));
    this.state.bmsSupertranslationChargeQ = Number((this.state.bmsSupertranslationChargeQ + 3.2).toFixed(1));
    this.recalculatePhysics();
    this.playTone(329.63, 'sawtooth'); // E4
    this.saveState();
  }

  public rotateSuperrotationAngle(): void {
    // 步進天球超旋轉極化角
    this.state.celestialMetricShearAngleDeg = Number(((this.state.celestialMetricShearAngleDeg + 30.0) % 360).toFixed(1));
    this.recalculatePhysics();
    this.playTone(493.88, 'sine'); // B4
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { asymptoticRadiusRpc, metricShearAmplitudeDeltaC, celestialConformalWeightDelta, softGravitonEnergyCutoffGev } = this.state;

    // 1. BMS 超平移電荷 Q_f \propto \int d^2z f(z,\bar{z}) \Delta C_{zz}
    this.state.bmsSupertranslationChargeQ = Number((metricShearAmplitudeDeltaC * 8.0 * (asymptoticRadiusRpc / 10.0)).toFixed(1));

    // 2. 軟極點奇異強度 \propto 1 / \omega
    this.state.softFactorSingularityScale = Number((1.0 / Math.max(0.005, softGravitonEnergyCutoffGev)).toFixed(1));

    // 3. 梅林全息振幅強度 |\mathcal{A}_CCFT|
    const gammaFactor = 1.0 / (1.0 + Math.abs(celestialConformalWeightDelta - 2.0) * 0.4);
    this.state.mellinAmplitudeIntensity = Number((gammaFactor * 0.95).toFixed(3));

    // 4. 維拉宿有效中心荷 c_eff
    this.state.virasoroCentralChargeEff = Number((12.0 * celestialConformalWeightDelta).toFixed(1));
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.cos(now * 0.002) * 0.05;
    this.state.bmsSupertranslationChargeQ = Math.max(1.0, Number((this.state.bmsSupertranslationChargeQ + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        bmsCharge: this.state.bmsSupertranslationChargeQ,
        shearAmp: this.state.metricShearAmplitudeDeltaC,
        mellinAmp: this.state.mellinAmplitudeIntensity
      });
      if (this.state.telemetryHistory.length > 25) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private initAudio(): void {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq = 440.0, type: OscillatorType = 'sine'): void { // A4
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.36);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const celestialHoloBmsEngine = new CelestialHoloBmsEngine();
