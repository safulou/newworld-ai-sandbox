/**
 * 拓撲近藤絕緣體 (Topological Kondo Insulator, TKI) 與強關聯重費米子表面狄拉克錐
 * (Topological Kondo Insulator & Heavy-Fermion Surface Dirac Cones Engine)
 *
 * 核心物理理論：
 * 1. 近藤雜化能隙 (Kondo Hybridization Gap)：
 *    在強關聯 $f$-電子材料 (如 SmB6, PuB6) 中，局域奇宇稱 $4f$ 軌域與巡遊偶宇稱 $5d$ 傳導帶在低溫下
 *    透過近藤交換相互作用 $J_{fd}$ 與雜化矩陣元 $V_{fd}$ 發生重費米子共振：
 *    E_{\pm}(k) = \frac{\epsilon_d(k) + \epsilon_f(k)}{2} \pm \sqrt{\left(\frac{\epsilon_d(k) - \epsilon_f(k)}{2}\right)^2 + |V_{fd}|^2}
 *    當溫度低於相干近藤溫度 $T_K$ 時，在費米能級打開窄雜化能隙 $\Delta_K \sim 15 - 20\text{ meV}$。
 * 2. 宇稱反轉與 $\mathbb{Z}_2$ 強拓撲不變量：
 *    在布里淵區的高對稱點（SmB6 中為三個 $X$ 點 $(\pi,0,0), (0,\pi,0), (0,0,\pi)$），$4f$ 帶與 $5d$ 帶發生宇稱反轉，
 *    奇宇稱態個數為 3（奇數），導致拓撲指標 $\nu_0 = 1$ ($\mathbb{Z}_2$ 拓撲非平凡)，使得原本強相關聯絕緣體演化為拓撲近藤絕緣體！
 * 3. 表面狄拉克錐與自旋-動量鎖定 (Surface Dirac Cones & Spin-Momentum Locking)：
 *    體態在低溫下形成完全絕緣體，但在 $(001)$ 晶體表面受時間反演對稱性保護，生成奇數個狄拉克錐（$\bar{\Gamma}$ 與兩重 $\bar{X}$ 點）。
 *    表面態費米速度 $v_F$ 因強關聯效應重整化，有效電子質量高達 $m^* \sim 10^2 - 10^3 m_0$。
 * 4. 體態-表面電阻平台飽和相變 (Bulk-Surface Resistance Saturation Plateau)：
 *    隨溫度降低，體態載流子依熱活化指數凍結：$\sigma_{\text{bulk}}(T) \propto \exp(-\Delta_K / 2 k_B T)$；
 *    但在 $T < 4\text{ K}$ 時，電阻不再發散，而是進入著名的「飽和平台」$\rho \sim 1-3\ \Omega\cdot\text{cm}$，
 *    此平台由無耗散表面狄拉克金屬態主導！
 */

export type TKIRegime =
  | 'high-temp-heavy-fermi-liquid'         // 高溫重費米液體相 (T > T_K, 局域自旋未屏蔽)
  | 'bulk-insulating-kondo-gap'            // 體態近藤能隙開啟絕緣相 (T_sat < T < T_K)
  | 'topological-surface-dirac-saturation' // 表面狄拉克錐主導電阻飽和相 (T < T_sat, 拓撲表面金屬)
  | 'parity-inverted-kondo-quench';        // 宇稱反轉拓撲淬火態 (強雜化激發)

export interface TopologicalKondoState {
  temperatureKelvin: number;               // 系統溫度 T (0.1 ~ 300.0 K)
  kondoCouplingConstantJEv: number;         // 近藤交換耦合常數 J (0.05 ~ 0.8 eV)
  fOrbitEnergyLevelEfEv: number;           // f 軌域局域能階 E_f (-0.5 ~ 0.5 eV)
  hybridizationStrengthVfdEv: number;      // f-d 軌域雜化強度 V_fd (0.01 ~ 0.35 eV)
  regime: TKIRegime;

  // 動態演算物理指標
  kondoGapDeltaMev: number;                // 近藤雜化能隙 \Delta_K (meV)
  kondoTemperatureTkKelvin: number;        // 近藤相干溫度 T_K (K)
  bulkResistivityOhmCm: number;            // 體態電阻率 \rho_bulk (\Omega\cdot cm)
  surfaceConductanceMicroSiemens: number;  // 表面拓撲電導 G_surf (\mu S)
  effectiveMassRatioMStar: number;         // 重費米子有效質量比 m*/m_0 (1 ~ 500)
  diracConeFermiVelocityVf: number;        // 表面狄拉克錐費米速度 v_F (10^4 m/s)
  z2TopologicalInvariant: number;          // \mathbb{Z}_2 拓撲指標 (1 為非平凡)
  saturationPlateauActive: boolean;        // 是否處於表面電阻飽和平台
  telemetryHistory: Array<{
    timestamp: number;
    temperature: number;
    resistivity: number;
    gap: number;
  }>;
}

const STORAGE_KEY = 'newworld_topological_kondo_insulator_state_v1';

class TopologicalKondoEngine {
  private state: TopologicalKondoState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): TopologicalKondoState {
    return {
      temperatureKelvin: 2.2,             // 預設 2.2 K (位於表面飽和平台區)
      kondoCouplingConstantJEv: 0.35,     // 0.35 eV
      fOrbitEnergyLevelEfEv: -0.15,       // -0.15 eV
      hybridizationStrengthVfdEv: 0.12,   // 0.12 eV (對應 ~18 meV 能隙)
      regime: 'topological-surface-dirac-saturation',
      kondoGapDeltaMev: 18.5,
      kondoTemperatureTkKelvin: 48.0,
      bulkResistivityOhmCm: 2.45,
      surfaceConductanceMicroSiemens: 420.0,
      effectiveMassRatioMStar: 185.0,
      diracConeFermiVelocityVf: 3.2,      // 3.2 * 10^4 m/s
      z2TopologicalInvariant: 1,
      saturationPlateauActive: true,
      telemetryHistory: []
    };
  }

  private loadState(): TopologicalKondoState {
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
      console.warn('[TopologicalKondoEngine] 載入存檔失敗，使用初始物理狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[TopologicalKondoEngine] 儲存失敗', e);
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
   * 播放近藤共振低頻嗡鳴音 (Kondo Screening Resonance Sub-bass Hum)
   */
  public playKondoResonanceHum(freq: number = 65, gainLevel: number = 0.12): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, ctx.currentTime + 0.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainLevel, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch (e) {
      console.warn('[TopologicalKondoEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放表面狄拉克錐高頻無耗散金屬金屬顫音 (Surface Metallic Dirac Cones Shimmer)
   */
  public playDiracSurfaceConductionChirp(freq: number = 880): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.35);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.2, ctx.currentTime);
      filter.Q.setValueAtTime(6.0, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.warn('[TopologicalKondoEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算強關聯近藤雜化、能隙與傳導物理量
   */
  public recalculatePhysics(): void {
    const T = Math.max(0.05, this.state.temperatureKelvin);
    const J = Math.max(0.01, this.state.kondoCouplingConstantJEv);
    const V = Math.max(0.005, this.state.hybridizationStrengthVfdEv);
    const Ef = this.state.fOrbitEnergyLevelEfEv;

    // 1. 近藤相干溫度 T_K: T_K \approx D * \exp(-1 / (2 * J * \rho_0))
    // 這裡標準化近藤能量尺度 (D \approx 1000 K)
    const exponent = 1.0 / (2.0 * J + 0.05);
    const Tk = Math.min(300, Math.max(1.0, 650.0 * Math.exp(-exponent * 1.6)));
    this.state.kondoTemperatureTkKelvin = Number(Tk.toFixed(1));

    // 2. 雜化近藤能隙 \Delta_K: \Delta_K \propto \frac{V_{fd}^2}{|E_f| + 0.1}
    const rawGapMev = (V * V / (Math.abs(Ef) + 0.08)) * 300.0;
    // 低溫下充分打開，當 T > T_K 時能隙熱波動抹平
    const thermalSuppression = 1.0 / (1.0 + Math.exp((T - Tk) / 8.0));
    const gap = rawGapMev * thermalSuppression;
    this.state.kondoGapDeltaMev = Number(gap.toFixed(2));

    // 3. 重費米子有效質量 m* / m_0
    // 依據重費米子能帶重整化 Z^{-1} = 1 + V_{fd}^2 / (E_F - E_f)^2
    const zRenorm = 1.0 + (V * V / (Ef * Ef + 0.01)) * 360.0;
    const thermalBoost = Math.max(1.0, Tk / (T + 8.0));
    const mStar = Math.min(600, Math.max(1.0, zRenorm * 0.75 * thermalBoost));
    this.state.effectiveMassRatioMStar = Number(mStar.toFixed(1));

    // 4. 表面狄拉克費米速度 v_F (10^4 m/s)
    const vf = Math.max(0.8, 12.0 / Math.sqrt(mStar / 10.0));
    this.state.diracConeFermiVelocityVf = Number(vf.toFixed(2));

    // 5. 體態電阻率與表面傳導平台
    // 體態電導率隨熱活化崩塌：\sigma_bulk = \sigma_0 \exp(-\Delta_K / 2 k_B T)
    const kbMeVK = 0.08617; // meV/K
    const activationFactor = Math.exp(-gap / (2.0 * kbMeVK * T));
    const sigmaBulk = 150.0 * activationFactor + 0.0001; // S/cm
    const rhoBulkTheoretical = 1.0 / sigmaBulk; // \Omega\cdot cm

    // 表面拓撲狄拉克電導 G_surf (受保護金屬表面)
    // 由拓撲表面態提供純金屬導電：G_surf ~ e^2/h * (k_F l)
    const sigmaSurf = 380.0 + 120.0 / (1.0 + (T / 15.0)); // \mu S
    this.state.surfaceConductanceMicroSiemens = Number(sigmaSurf.toFixed(1));

    // 總電阻率：體態高阻與表面傳導並聯
    // 當 T < 4 K 時，表面電導主導，呈現 1 ~ 3 \Omega\cdot cm 飽和平台
    const rhoSurfaceEff = 2.2 + 0.4 * Math.sin(T);
    const rhoTotal = (rhoBulkTheoretical * rhoSurfaceEff) / (rhoBulkTheoretical + rhoSurfaceEff);
    this.state.bulkResistivityOhmCm = Number(Math.min(500, rhoTotal).toFixed(2));

    // 飽和平台判定
    const isSaturated = T < 4.5 && gap > 5.0;
    this.state.saturationPlateauActive = isSaturated;

    // 6. 拓撲指標 \mathbb{Z}_2
    // 在 SmB6 模型中，宇稱反轉發生在 3 個 X 點 (奇數)，為強拓撲絕緣體 \mathbb{Z}_2 = 1
    this.state.z2TopologicalInvariant = (gap > 3.0 && V > 0.03) ? 1 : 0;

    // 7. 相態判定
    if (this.state.regime !== 'parity-inverted-kondo-quench') {
      if (T > Tk) {
        this.state.regime = 'high-temp-heavy-fermi-liquid';
      } else if (isSaturated) {
        this.state.regime = 'topological-surface-dirac-saturation';
      } else {
        this.state.regime = 'bulk-insulating-kondo-gap';
      }
    }
  }

  public update(deltaSeconds: number): void {
    // 緩慢記錄遙測歷史
    if (Math.random() < deltaSeconds * 0.5) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        temperature: this.state.temperatureKelvin,
        resistivity: this.state.bulkResistivityOhmCm,
        gap: this.state.kondoGapDeltaMev
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setTemperature(tKelvin: number): void {
    this.state.temperatureKelvin = Math.max(0.1, Math.min(300.0, tKelvin));
    this.recalculatePhysics();
    this.saveState();
  }

  public setKondoCoupling(jEv: number): void {
    this.state.kondoCouplingConstantJEv = Math.max(0.05, Math.min(0.8, jEv));
    this.recalculatePhysics();
    this.saveState();
  }

  public setHybridizationStrength(vEv: number): void {
    this.state.hybridizationStrengthVfdEv = Math.max(0.01, Math.min(0.35, vEv));
    this.recalculatePhysics();
    this.saveState();
  }

  public setFOrbitEnergy(efEv: number): void {
    this.state.fOrbitEnergyLevelEfEv = Math.max(-0.5, Math.min(0.5, efEv));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 激發低溫拓撲淬火 (Thermal Quench into Dirac Saturation)
   */
  public triggerThermalQuench(): void {
    this.state.temperatureKelvin = 0.5;
    this.state.regime = 'parity-inverted-kondo-quench';
    this.recalculatePhysics();
    this.playDiracSurfaceConductionChirp(1150);
    this.playKondoResonanceHum(58, 0.16);
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: TKIRegime[] = [
      'high-temp-heavy-fermi-liquid',
      'bulk-insulating-kondo-gap',
      'topological-surface-dirac-saturation',
      'parity-inverted-kondo-quench'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];
    if (this.state.regime === 'high-temp-heavy-fermi-liquid') {
      this.state.temperatureKelvin = 85.0;
    } else if (this.state.regime === 'bulk-insulating-kondo-gap') {
      this.state.temperatureKelvin = 18.0;
    } else if (this.state.regime === 'topological-surface-dirac-saturation') {
      this.state.temperatureKelvin = 1.8;
    } else {
      this.state.temperatureKelvin = 0.4;
    }
    this.recalculatePhysics();
    this.playKondoResonanceHum(72, 0.14);
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<TopologicalKondoState> {
    return this.state;
  }
}

export const topologicalKondoEngine = new TopologicalKondoEngine();
