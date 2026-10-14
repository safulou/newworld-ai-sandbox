/**
 * 🪐 黑洞量子視界反射膜與引力波量子迴聲引擎
 * Black Hole Quantum Horizon Echoes & Planckian Membrane Cavity Engine
 *
 * 理論物理基礎：
 * 1. 經典事件視界與量子反射膜 (Classical Horizon vs. Quantum Horizon Membrane)：
 *    愛因斯坦廣義相對論中，事件視界 $r_H = 2M$ 具備單向因果性，反射率嚴格為零 ($\mathcal{R}_{\text{hor}} = 0$)；
 *    但在量子引力、弦論模糊球 (Fuzzball)、火牆 (Firewall) 或普朗克膜假說中，
 *    經典視界被距 $r_H$ 僅普朗克尺度 $\Delta r \sim \ell_P$ 的部分反射微觀表面取代 ($\mathcal{R}_{\text{hor}} \in (0, 1)$)。
 * 2. 烏龜坐標與引力波諧振空腔 (Tortoise Coordinate & Effective Cavity)：
 *    引力微擾受 Regge-Wheeler / Zerilli 勢壘 $V_{\text{eff}}(r)$ 統御；
 *    光子球勢壘峰值位於 $r \approx 3M$ ($r^* \approx 0$)，而量子反射膜位於負無窮遠處的普朗克截斷點：
 *    r^*_{\text{hor}} \approx -2M \ln(M / \ell_P)
 * 3. 週期性衰減引力波量子迴聲序列 (Gravitational Wave Echo Train)：
 *    在主並合鈴鳴 (Ringdown) 脈衝後，波包在光子球與量子膜之間來回反彈，
 *    以特徵週期時間延遲發射衰減引力波迴聲串：
 *    \Delta t_{\text{echo}} \approx 2 |r^*_{\text{hor}}| \approx 8 M \ln(M / \ell_P) \quad (\text{毫秒級})
 * 4. 探測霍金輻射信息悖論與黑洞量子毛髮：
 *    迴聲相位與阻尼率攜帶黑洞量子表面微觀態結構，是地面 (LIGO-Virgo-KAGRA) 與太空 (LISA) 探測量子引力的黃金指標。
 */

export type BlackHoleEchoRegime =
  | 'classical-black-hole-no-echo'          // 經典廣義相對論無毛黑洞純吸收態 (R_hor = 0, 無任何迴聲)
  | 'planckian-quantum-membrane-resonance'  // 普朗克微觀量子反射膜空腔諧振態 (Δr ~ ℓ_P, R_hor ~ 0.85)
  | 'periodic-gravitational-wave-echo-train'// 週期性衰減引力波量子迴聲脈衝串發射相 (Δt_echo 穩定長鳴)
  | 'fuzzball-microstate-dispersion-echoes'; // 模糊球微觀態非均勻色散迴聲相 (多重干涉微波包)

export interface BlackHoleEchoState {
  blackHoleMassSolar: number;               // 黑洞質量 M (太陽質量 M_☉, 5.0 ~ 120.0)
  quantumMembraneDistancePlanck: number;    // 視界膜外微觀距離 Δr / ℓ_P (0.5 ~ 15.0)
  horizonReflectivityRatio: number;         // 量子視界膜反射率 \mathcal{R}_hor (0.0 ~ 0.99)
  photonSphereTransmissionRatio: number;    // 光子球勢壘穿透率 \mathcal{T}_barrier (0.1 ~ 0.8)
  regime: BlackHoleEchoRegime;

  // 動態演算物理指標
  echoDelayTimeMs: number;                  // 量子引力波迴聲間隔時間 \Delta t_echo (ms)
  echoDampingFactorRatio: number;           // 相鄰迴聲振幅衰減係數 (A_{n+1} / A_n)
  cavityQualityFactorQ: number;             // 引力波諧振空腔品質因數 Q
  fundamentalQuasinormalFreqHz: number;     // 基礎準正規模式頻率 f_QNM (Hz)
  detectedEchoesTrainCount: number;         // 累計偵測量子引力波迴聲次數
  telemetryHistory: Array<{
    timestamp: number;
    mass: number;
    reflectivity: number;
    delayMs: number;
  }>;
}

const STORAGE_KEY = 'newworld_black_hole_quantum_echoes_state_v1';

class BlackHoleQuantumEchoesEngine {
  private state: BlackHoleEchoState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): BlackHoleEchoState {
    return {
      blackHoleMassSolar: 35.0,              // 35 M_☉ (典型 GW150914 殘餘黑洞質量)
      quantumMembraneDistancePlanck: 1.0,    // 1 普朗克長度 ℓ_P
      horizonReflectivityRatio: 0.82,       // 82% 量子膜反射率
      photonSphereTransmissionRatio: 0.35,
      regime: 'periodic-gravitational-wave-echo-train',
      echoDelayTimeMs: 28.5,                 // ~ 28.5 ms
      echoDampingFactorRatio: 0.53,          // ~ 53% 逐次衰減
      cavityQualityFactorQ: 14.8,
      fundamentalQuasinormalFreqHz: 345.0,   // ~ 345 Hz
      detectedEchoesTrainCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): BlackHoleEchoState {
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
      console.warn('[BlackHoleEchoesEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[BlackHoleEchoesEngine] 儲存失敗', e);
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
   * 播放黑洞並合鈴鳴轟鳴 (Primary Ringdown Burst)
   */
  public playPrimaryRingdownBurst(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('[BlackHoleEchoesEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放週期性衰減量子引力波迴聲脈衝序列 (Gravitational Wave Echoes Pulse Train)
   */
  public playEchoTrainPulses(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      // 依序播放 3 個衰減脈衝
      [0, 0.12, 0.24].forEach((timeOffset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260 + idx * 40, ctx.currentTime + timeOffset);

        const initialGain = 0.12 * Math.pow(0.55, idx);
        gain.gain.setValueAtTime(initialGain, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.1);
      });
    } catch (e) {
      console.warn('[BlackHoleEchoesEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算量子視界迴聲延遲、阻尼因子與準正規模頻率
   */
  public recalculatePhysics(): void {
    const M = Math.max(2.0, this.state.blackHoleMassSolar);
    const dPlanck = Math.max(0.1, this.state.quantumMembraneDistancePlanck);
    const Rhor = Math.max(0.0, Math.min(0.99, this.state.horizonReflectivityRatio));
    const Tbarrier = Math.max(0.05, Math.min(0.85, this.state.photonSphereTransmissionRatio));

    // 1. 基礎準正規模式頻率 f_QNM \approx 12.07 kHz / (M / M_☉)
    const fQnm = (12070.0 / M);
    this.state.fundamentalQuasinormalFreqHz = Number(fQnm.toFixed(1));

    // 2. 視界迴聲時間延遲 \Delta t_echo \approx 8 M (G/c³) \ln(M / \ell_P)
    // 尺度化公式: 典型 35 M_☉ 為 28.5 ms，隨 M 呈線性 * 對數依賴
    const delayMs = (0.75 * M) * (1.0 + 0.08 * Math.log(10.0 / dPlanck));
    this.state.echoDelayTimeMs = Number(delayMs.toFixed(1));

    // 3. 迴聲阻尼率 (Damping Factor) = R_hor * (1 - T_barrier)
    const damping = Rhor * (1.0 - 0.5 * Tbarrier);
    this.state.echoDampingFactorRatio = Number(damping.toFixed(2));

    // 4. 空腔品質因數 Q = 2\pi / (1 - damping^2)
    const qFactor = (2.0 * Math.PI) / Math.max(0.1, 1.0 - Math.pow(damping, 2));
    this.state.cavityQualityFactorQ = Number(qFactor.toFixed(1));

    // 5. 相態判定
    if (Rhor < 0.05) {
      this.state.regime = 'classical-black-hole-no-echo';
    } else if (dPlanck > 5.0 || damping < 0.35) {
      this.state.regime = 'fuzzball-microstate-dispersion-echoes';
    } else if (Rhor > 0.85 && dPlanck <= 1.5) {
      this.state.regime = 'planckian-quantum-membrane-resonance';
    } else {
      this.state.regime = 'periodic-gravitational-wave-echo-train';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime !== 'classical-black-hole-no-echo') {
      this.state.detectedEchoesTrainCount += Math.floor(deltaSeconds * 3);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        mass: this.state.blackHoleMassSolar,
        reflectivity: this.state.horizonReflectivityRatio,
        delayMs: this.state.echoDelayTimeMs
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setBlackHoleMass(massSolar: number): void {
    this.state.blackHoleMassSolar = Math.max(5.0, Math.min(120.0, massSolar));
    this.recalculatePhysics();
    this.saveState();
  }

  public setQuantumMembraneDistance(planckDist: number): void {
    this.state.quantumMembraneDistancePlanck = Math.max(0.5, Math.min(15.0, planckDist));
    this.recalculatePhysics();
    this.saveState();
  }

  public setHorizonReflectivity(ratio: number): void {
    this.state.horizonReflectivityRatio = Math.max(0.0, Math.min(0.99, ratio));
    this.recalculatePhysics();
    this.saveState();
  }

  public setPhotonSphereTransmission(tRatio: number): void {
    this.state.photonSphereTransmissionRatio = Math.max(0.1, Math.min(0.8, tRatio));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發並合與量子引力波迴聲爆發 (Trigger Merger & Quantum Echoes Burst)
   */
  public triggerQuantumEchoesBurst(): void {
    this.state.horizonReflectivityRatio = 0.82;
    this.state.quantumMembraneDistancePlanck = 2.0;
    this.state.detectedEchoesTrainCount += 25;
    this.state.regime = 'periodic-gravitational-wave-echo-train';
    this.recalculatePhysics();
    this.playPrimaryRingdownBurst();
    this.playEchoTrainPulses();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: BlackHoleEchoRegime[] = [
      'classical-black-hole-no-echo',
      'planckian-quantum-membrane-resonance',
      'periodic-gravitational-wave-echo-train',
      'fuzzball-microstate-dispersion-echoes'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];

    if (this.state.regime === 'classical-black-hole-no-echo') {
      this.state.horizonReflectivityRatio = 0.0;
      this.playPrimaryRingdownBurst();
    } else if (this.state.regime === 'planckian-quantum-membrane-resonance') {
      this.state.horizonReflectivityRatio = 0.92;
      this.state.quantumMembraneDistancePlanck = 0.8;
      this.playEchoTrainPulses();
    } else if (this.state.regime === 'periodic-gravitational-wave-echo-train') {
      this.triggerQuantumEchoesBurst();
      return;
    } else {
      this.state.horizonReflectivityRatio = 0.65;
      this.state.quantumMembraneDistancePlanck = 6.5;
      this.playEchoTrainPulses();
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<BlackHoleEchoState> {
    return this.state;
  }
}

export const blackHoleQuantumEchoesEngine = new BlackHoleQuantumEchoesEngine();
