/**
 * 🧪 超流氦-3 拓撲 B 相與馬約拉納二維表面費米錐引擎
 * Superfluid Helium-3 Topological B-Phase & Surface Majorana Cones Engine
 *
 * 理論物理基礎：
 * 1. p-波自旋三重態配對 (p-wave Spin-Triplet Pairing)：
 *    氦-3 (3He) 原子為自旋 1/2 費米子，在毫開爾文極低溫 (T < Tc ≈ 2.49 mK) 下，
 *    原子間短程斥力阻止 s-波配對，形成軌道自旋三重態 (L=1, S=1, J=0) 配對。
 * 2. Balian-Werthamer (BW) 拓撲 B 相與能隙等向性：
 *    能隙張量 d_μa(k) = Δ(T) R_μa(n, θ_L) k_a，其中 R 為三維旋轉矩陣，
 *    θ_L ≈ 104° 為使偶極交互作用能量最小化之萊格特角 (Leggett Angle)；
 *    體能隙完全等向無節點：E(k) = \sqrt{\xi_k^2 + \Delta^2}。
 * 3. 三維時間反演保護拓撲不變量 (Class DIII Topological Invariant)：
 *    具備時間反演對稱性 (T² = -1) 與粒子-電洞對稱性 (C² = +1)，
 *    拓撲繞數 (Winding Number) N_w = 2，鎖定非平庸拓撲相。
 * 4. 表面馬約拉納二維費米錐 (Surface Majorana Cones & Andreev Bound States)：
 *    根據體-邊對應定理，B 相邊界處強制出現無質量二維狄拉克-馬約拉納錐：
 *    E(k_∥) = c_⊥ |k_∥|，波函數具備自共軛性 γ(k) = γ†(-k)，
 *    產生表面自旋-動量垂直鎖定流與特徵橫向聲學阻抗異常 (Transverse Acoustic Impedance)。
 */

export type SuperfluidHe3Regime =
  | 'isotropic-b-phase-topological'         // 等向拓撲 B 相 (完全能隙, 表面馬約拉納雙錐, Nw = 2)
  | 'anisotropic-a-phase-weyl-nodes'        // 軸向 A 相 (外爾超流點節點, ABM 態)
  | 'surface-andreev-majorana-bound'        // 表面安德烈夫-馬約拉納束縛態共振相
  | 'normal-fermi-liquid-depaired';         // 高溫正常費米液體相 (T > Tc, 配對熔化)

export interface SuperfluidHe3State {
  temperatureMilliKelvin: number;           // 系統溫度 T (mK, 0.1 ~ 3.5 mK, Tc ≈ 2.49 mK)
  pressureBar: number;                      // 樣品腔壓力 P (bar, 0.0 ~ 34.0 bar)
  leggettAngleDeg: number;                  // 萊格特自旋-軌道角 θ_L (度, 經典平衡角 104.0°)
  surfaceAndreevBoundCount: number;         // 表面馬約拉納束縛態激發計數
  regime: SuperfluidHe3Regime;

  // 動態演算物理指標
  superfluidOrderParamDeltaUev: number;     // 超流能隙序參量 Δ(T) (μeV, ~ 65 μeV)
  criticalTemperatureTcMk: number;          // 臨界轉變溫度 T_c(P) (mK)
  surfaceMajoranaVelocityM_S: number;       // 表面馬約拉納費米速度 c_⊥ (m/s)
  transverseAcousticImpedanceMpaS_M: number;// 橫向高頻聲阻抗 Z_⊥ (MPa·s/m)
  surfaceSpinCurrentDensityNaM: number;     // 表面拓撲自旋流密度 J_S (nA/m)
  telemetryHistory: Array<{
    timestamp: number;
    temperature: number;
    gap: number;
    impedance: number;
  }>;
}

const STORAGE_KEY = 'newworld_superfluid_helium3_b_phase_state_v1';
const BOLTZMANN_KB_J_K = 1.380649e-23;
const EV_TO_JOULE = 1.602176634e-19;

class SuperfluidHelium3Engine {
  private state: SuperfluidHe3State;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): SuperfluidHe3State {
    return {
      temperatureMilliKelvin: 1.2,          // 1.2 mK (< Tc)
      pressureBar: 21.0,                     // 21 bar
      leggettAngleDeg: 104.0,                // 萊格特角 104°
      surfaceAndreevBoundCount: 0,
      regime: 'isotropic-b-phase-topological',
      superfluidOrderParamDeltaUev: 0.22,    // ~ 0.22 μeV
      criticalTemperatureTcMk: 2.49,
      surfaceMajoranaVelocityM_S: 32.4,      // 32.4 m/s
      transverseAcousticImpedanceMpaS_M: 1.84,
      surfaceSpinCurrentDensityNaM: 14.6,
      telemetryHistory: []
    };
  }

  private loadState(): SuperfluidHe3State {
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
      console.warn('[SuperfluidHe3Engine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[SuperfluidHe3Engine] 儲存失敗', e);
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
   * 播放超流聲子低溫顫音 (Superfluid Acoustic Whispering Phonon)
   */
  public playSuperfluidPhononTone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('[SuperfluidHe3Engine] 音效播放異常', e);
    }
  }

  /**
   * 播放萊格特自旋共振雙頻鈴音 (Leggett Spin Resonance Chime)
   */
  public playLeggettResonanceChime(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(240, ctx.currentTime);
      osc2.frequency.setValueAtTime(960, ctx.currentTime);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.32);
      osc2.stop(ctx.currentTime + 0.32);
    } catch (e) {
      console.warn('[SuperfluidHe3Engine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算超流能隙、臨界轉變溫度、表面馬約拉納聲速與橫向聲阻抗
   */
  public recalculatePhysics(): void {
    const T = Math.max(0.05, this.state.temperatureMilliKelvin);
    const P = Math.max(0.0, Math.min(34.0, this.state.pressureBar));
    const thetaL = this.state.leggettAngleDeg;

    // 1. 臨界溫度隨壓力升高 (0 bar: 0.93 mK, 34 bar: 2.49 mK)
    const tc = 0.93 + 0.046 * P;
    this.state.criticalTemperatureTcMk = Number(tc.toFixed(2));

    // 2. 超流能隙序參量 Δ(T) \approx 1.764 * k_B * Tc * \sqrt{1 - (T / Tc)^2} (μeV)
    if (T >= tc) {
      this.state.superfluidOrderParamDeltaUev = 0.0;
      this.state.surfaceMajoranaVelocityM_S = 0.0;
      this.state.surfaceSpinCurrentDensityNaM = 0.0;
      this.state.regime = 'normal-fermi-liquid-depaired';
      return;
    }

    const tRatio = T / tc;
    const deltaJoule = 1.764 * BOLTZMANN_KB_J_K * (tc * 1e-3) * Math.sqrt(Math.max(0, 1.0 - Math.pow(tRatio, 2)));
    const deltaUev = (deltaJoule / EV_TO_JOULE) * 1e6;
    this.state.superfluidOrderParamDeltaUev = Number(deltaUev.toFixed(2));

    // 3. 表面馬約拉納費米速度 c_⊥ (m/s) \approx 30 + 0.5 * P
    const vMajorana = (28.0 + 0.25 * P) * Math.sqrt(Math.max(0.05, 1.0 - Math.pow(tRatio, 2)));
    this.state.surfaceMajoranaVelocityM_S = Number(vMajorana.toFixed(1));

    // 4. 橫向高頻聲阻抗 Z_⊥ (MPa·s/m)
    // 馬約拉納表面態在超流能隙內造成強聲子耗散吸收，形成阻抗異常峰
    const deltaTheta = Math.abs(thetaL - 104.0);
    const zImpedance = 1.2 + 0.8 * (deltaUev / 0.22) * Math.exp(-deltaTheta / 20.0);
    this.state.transverseAcousticImpedanceMpaS_M = Number(zImpedance.toFixed(2));

    // 5. 表面拓撲自旋流密度 J_S (nA/m)
    const jSpin = 12.0 * (deltaUev / 0.22) * (1.0 + 0.02 * P);
    this.state.surfaceSpinCurrentDensityNaM = Number(jSpin.toFixed(1));

    // 6. 相態邏輯判定
    if (T > 2.0 && P > 21.0 && deltaUev < 0.15) {
      this.state.regime = 'anisotropic-a-phase-weyl-nodes';
    } else if (deltaTheta > 35.0 || this.state.surfaceAndreevBoundCount > 40) {
      this.state.regime = 'surface-andreev-majorana-bound';
    } else {
      this.state.regime = 'isotropic-b-phase-topological';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime === 'isotropic-b-phase-topological' || this.state.regime === 'surface-andreev-majorana-bound') {
      this.state.surfaceAndreevBoundCount += Math.floor(deltaSeconds * 3);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        temperature: this.state.temperatureMilliKelvin,
        gap: this.state.superfluidOrderParamDeltaUev,
        impedance: this.state.transverseAcousticImpedanceMpaS_M
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setTemperature(tMilliK: number): void {
    this.state.temperatureMilliKelvin = Math.max(0.1, Math.min(3.5, tMilliK));
    this.recalculatePhysics();
    this.saveState();
  }

  public setPressure(bar: number): void {
    this.state.pressureBar = Math.max(0.0, Math.min(34.0, bar));
    this.recalculatePhysics();
    this.saveState();
  }

  public setLeggettAngle(deg: number): void {
    this.state.leggettAngleDeg = Math.max(45.0, Math.min(160.0, deg));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動激發表面馬約拉納束縛態共振 (Trigger Surface Andreev Majorana Resonance)
   */
  public triggerSurfaceAndreevResonance(): void {
    this.state.temperatureMilliKelvin = 0.8;
    this.state.pressureBar = 28.0;
    this.state.leggettAngleDeg = 104.0;
    this.state.surfaceAndreevBoundCount += 50;
    this.state.regime = 'surface-andreev-majorana-bound';
    this.recalculatePhysics();
    this.playSuperfluidPhononTone();
    this.playLeggettResonanceChime();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: SuperfluidHe3Regime[] = [
      'isotropic-b-phase-topological',
      'anisotropic-a-phase-weyl-nodes',
      'surface-andreev-majorana-bound',
      'normal-fermi-liquid-depaired'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];

    if (this.state.regime === 'isotropic-b-phase-topological') {
      this.state.temperatureMilliKelvin = 1.2;
      this.state.pressureBar = 15.0;
      this.state.leggettAngleDeg = 104.0;
      this.playSuperfluidPhononTone();
    } else if (this.state.regime === 'anisotropic-a-phase-weyl-nodes') {
      this.state.temperatureMilliKelvin = 2.2;
      this.state.pressureBar = 28.0;
      this.playLeggettResonanceChime();
    } else if (this.state.regime === 'surface-andreev-majorana-bound') {
      this.triggerSurfaceAndreevResonance();
      return;
    } else {
      this.state.temperatureMilliKelvin = 3.2; // 高於 Tc
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<SuperfluidHe3State> {
    return this.state;
  }
}

export const superfluidHelium3Engine = new SuperfluidHelium3Engine();
