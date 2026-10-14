/**
 * 🌊 量子霍爾黏滯度與非耗散奇性剪切應力引擎
 * Quantum Hall Viscosity (Odd Viscosity) & Read-Rezayi Geometric Hydrodynamics Engine
 *
 * 理論物理基礎：
 * 1. 奇性黏滯度與非耗散應力張量 (Odd / Non-dissipative Viscosity)：
 *    在破缺時間反演對稱性的二維手性流體中，黏性應力張量具備反對稱非耗散分量：
 *    T_{ij}^{\text{odd}} = -\eta_H (\epsilon_{ik} V_{kj} + \epsilon_{jk} V_{ki})
 *    其焦耳耗散功率嚴格為零：\dot{Q} = T_{ij}^{\text{odd}} V_{ij} \equiv 0，不產生任何熵增！
 * 2. Read-Rezayi 拓撲軌道自旋移位定理 (Wen-Zee Shift & Orbital Spin)：
 *    量子霍爾態基態波函數在曲面上呈現拓撲移位 $N_\phi = \nu^{-1} N - \mathcal{S}$，
 *    霍爾黏滯度直接與平均軌道自旋 $\bar{s} = \mathcal{S}/2$ 量子化：
 *    \eta_H = \frac{1}{4} \hbar \bar{s} \rho_0 = \frac{1}{8} \hbar \mathcal{S} \rho_0 \quad (\text{Pa}\cdot\text{s})
 * 3. 聲學雙折射效應 (Acoustic Circular Birefringence)：
 *    奇性黏度使橫波聲子發生圓偏振分裂，左右旋聲速差：
 *    \Delta v_s = \frac{2 \eta_H \omega}{\rho_{\text{mass}} v_s}
 * 4. 邊界曲率手性飄移 (Curvature-Induced Edge Drift)：
 *    流體在彎曲邊界處產生幾何邊界剪切流：$v_{\text{edge}} = v_0 + \frac{\eta_H}{\rho_m} \kappa$。
 */

export type HallViscosityRegime =
  | 'dissipative-viscous-fluid'             // 常規對稱耗散流體 (無奇性黏度, η_H = 0)
  | 'integer-qhe-hall-viscosity'            // 整數量子霍爾態 (ν=1, S=1, η_H = ħ ρ_0 / 8)
  | 'fractional-laughlin-odd-viscosity'     // 分數量子霍爾勞夫林態 (ν=1/3, S=3, η_H = 3ħ ρ_0 / 8)
  | 'non-abelian-pfaffian-chiral-shear';    // 非阿貝爾摩爾-里德 Pfaffian 態 (ν=5/2, S=3)

export interface HallViscosityState {
  electronDensity10_11Cm2: number;          // 2D 電子面密度 \rho_0 (10^11 cm^-2, 0.5 ~ 6.0)
  magneticFieldTesla: number;               // 外加垂直磁場 B (Tesla, 1.0 ~ 18.0 T)
  fillingFactorNu: number;                  // 朗道能階填充分數 \nu (1/3, 1, 5/2 等)
  wenZeeShiftS: number;                     // 拓撲移位參數 \mathcal{S} (1 ~ 4)
  regime: HallViscosityRegime;

  // 動態演算物理指標
  hallViscosityPascalS: number;             // 奇性霍爾黏滯度 \eta_H (10^-11 Pa·s)
  meanOrbitalSpinSBar: number;              // 粒子平均軌道自旋 \bar{s} = \mathcal{S}/2
  energyDissipationRateWatts: number;       // 奇性黏度能量耗散率 (嚴格為 0.0 W)
  acousticBirefringenceSplitM_S: number;    // 聲波圓雙折射聲速分裂 \Delta v_s (m/s)
  boundaryCurvatureDriftVelocityKmS: number;// 邊界曲率誘導手性漂移速度 v_drift (km/s)
  shearStressCycleCount: number;            // 累計非耗散剪切循環次數
  telemetryHistory: Array<{
    timestamp: number;
    density: number;
    viscosity: number;
    split: number;
  }>;
}

const STORAGE_KEY = 'newworld_hall_viscosity_read_rezayi_state_v1';

class HallViscosityEngine {
  private state: HallViscosityState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): HallViscosityState {
    return {
      electronDensity10_11Cm2: 2.4,          // 2.4 * 10^11 cm^-2
      magneticFieldTesla: 10.0,              // 10 Tesla
      fillingFactorNu: 1.0,                  // ν = 1 整數量子霍爾態
      wenZeeShiftS: 1.0,                     // S = 1
      regime: 'integer-qhe-hall-viscosity',
      hallViscosityPascalS: 0.76,            // 0.76 * 10^-11 Pa·s
      meanOrbitalSpinSBar: 0.5,
      energyDissipationRateWatts: 0.0,       // 嚴格非耗散
      acousticBirefringenceSplitM_S: 4.8,    // 4.8 m/s
      boundaryCurvatureDriftVelocityKmS: 12.5,
      shearStressCycleCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): HallViscosityState {
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
      console.warn('[HallViscosityEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[HallViscosityEngine] 儲存失敗', e);
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
   * 播放拓撲手性剪切無耗散共鳴音 (Chiral Shear Zero-Dissipation Ping)
   */
  public playChiralShearPing(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn('[HallViscosityEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放聲學圓雙折射聲波音 (Acoustic Birefringence Wave)
   */
  public playAcousticBirefringenceChirp(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(740, ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch (e) {
      console.warn('[HallViscosityEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算 Read-Rezayi 霍爾黏度、平均軌道自旋與聲學雙折射
   */
  public recalculatePhysics(): void {
    const S = Math.max(0.0, this.state.wenZeeShiftS);
    const B = Math.max(0.5, this.state.magneticFieldTesla);

    // 1. 平均軌道自旋 \bar{s} = \mathcal{S} / 2
    const sBar = S / 2.0;
    this.state.meanOrbitalSpinSBar = Number(sBar.toFixed(2));

    // 2. Read-Rezayi 量子霍爾黏度 \eta_H = \frac{1}{4} \hbar \bar{s} \rho_0 = \frac{1}{8} \hbar \mathcal{S} \rho_0
    // 尺度化為 10^-11 Pa·s (取典型 2DEG 有效厚度與質量標準化因子)
    const etaH = 0.633 * sBar * this.state.electronDensity10_11Cm2;
    this.state.hallViscosityPascalS = Number(etaH.toFixed(2));

    // 3. 奇性黏度嚴格無耗散
    this.state.energyDissipationRateWatts = 0.0;

    // 4. 聲學圓雙折射聲速差 \Delta v_s \approx 2 \eta_H \omega / (\rho_m v_s)
    const splitMs = 1.6 * (etaH / 0.76) * (B / 10.0);
    this.state.acousticBirefringenceSplitM_S = Number(splitMs.toFixed(1));

    // 5. 邊界曲率手性漂移速度 v_drift (km/s)
    const vDrift = 12.5 * (etaH / 0.76) * (this.state.electronDensity10_11Cm2 / 2.4);
    this.state.boundaryCurvatureDriftVelocityKmS = Number(vDrift.toFixed(1));

    // 6. 相態邏輯判定
    if (S < 0.2 || etaH < 0.05) {
      this.state.regime = 'dissipative-viscous-fluid';
    } else if (Math.abs(this.state.fillingFactorNu - 2.5) < 0.1 || S >= 3.5) {
      this.state.regime = 'non-abelian-pfaffian-chiral-shear';
    } else if (Math.abs(this.state.fillingFactorNu - 0.333) < 0.1 || S > 2.0) {
      this.state.regime = 'fractional-laughlin-odd-viscosity';
    } else {
      this.state.regime = 'integer-qhe-hall-viscosity';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime !== 'dissipative-viscous-fluid') {
      this.state.shearStressCycleCount += Math.floor(deltaSeconds * 4);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        density: this.state.electronDensity10_11Cm2,
        viscosity: this.state.hallViscosityPascalS,
        split: this.state.acousticBirefringenceSplitM_S
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setDensity(density10_11: number): void {
    this.state.electronDensity10_11Cm2 = Math.max(0.5, Math.min(8.0, density10_11));
    this.recalculatePhysics();
    this.saveState();
  }

  public setMagneticField(tesla: number): void {
    this.state.magneticFieldTesla = Math.max(1.0, Math.min(25.0, tesla));
    this.recalculatePhysics();
    this.saveState();
  }

  public setShiftS(shift: number): void {
    this.state.wenZeeShiftS = Math.max(0.0, Math.min(4.0, shift));
    this.recalculatePhysics();
    this.saveState();
  }

  public setFillingFactor(nu: number): void {
    this.state.fillingFactorNu = Math.max(0.1, Math.min(4.0, nu));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發手性剪切無耗散共鳴 (Trigger Odd Shear Wave)
   */
  public triggerChiralShearWave(): void {
    this.state.wenZeeShiftS = 3.0;
    this.state.fillingFactorNu = 0.333; // Laughlin 態
    this.state.shearStressCycleCount += 100;
    this.state.regime = 'fractional-laughlin-odd-viscosity';
    this.recalculatePhysics();
    this.playChiralShearPing();
    this.playAcousticBirefringenceChirp();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: HallViscosityRegime[] = [
      'dissipative-viscous-fluid',
      'integer-qhe-hall-viscosity',
      'fractional-laughlin-odd-viscosity',
      'non-abelian-pfaffian-chiral-shear'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'dissipative-viscous-fluid') {
      this.state.wenZeeShiftS = 0.0;
      this.state.fillingFactorNu = 2.0;
    } else if (this.state.regime === 'integer-qhe-hall-viscosity') {
      this.state.wenZeeShiftS = 1.0;
      this.state.fillingFactorNu = 1.0;
      this.playChiralShearPing();
    } else if (this.state.regime === 'fractional-laughlin-odd-viscosity') {
      this.state.wenZeeShiftS = 3.0;
      this.state.fillingFactorNu = 0.333;
      this.playChiralShearPing();
    } else {
      this.state.wenZeeShiftS = 3.0;
      this.state.fillingFactorNu = 2.5; // Moore-Read ν = 5/2
      this.playAcousticBirefringenceChirp();
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<HallViscosityState> {
    return this.state;
  }
}

export const hallViscosityEngine = new HallViscosityEngine();
