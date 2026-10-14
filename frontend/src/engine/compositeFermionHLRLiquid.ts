/**
 * ⚛️ 幾何複合費米子與 Halperin-Lee-Read (HLR) 偶分母非費米流體引擎
 * Composite Fermion Chern-Simons Theory & Halperin-Lee-Read Even-Denominator Liquid Engine
 *
 * 理論物理基礎：
 * 1. 陳-西蒙斯統計通量附著 (Chern-Simons Statistical Flux Attachment)：
 *    在極強垂直磁場下，二維電子氣 (2DEG) 填充分數 $\nu = 1/2$ 處；
 *    每個電子吸附 $2p = 2$ 個統計通量量子 ($\tilde{\Phi} = 2 \Phi_0 = 2 h/e$)，
 *    變換為無電荷分數統計的「複合費米子」(Composite Fermions, CF)。
 * 2. 平均場有效磁場精確抵消 (Effective Magnetic Field Cancellation)：
 *    陳-西蒙斯統計規範場產生的平均統計磁通與外部強磁場反向完全抵消：
 *    B_{\text{eff}} = B - 2 \Phi_0 \rho_0 = B (1 - 2\nu)
 *    當 $\nu = 1/2$ 時，B_{\text{eff}} \equiv 0$！複合費米子在平均零磁場下自由漂移。
 * 3. Halperin-Lee-Read (HLR) 費米面 (Composite Fermi Surface)：
 *    複合費米子填滿費米球，形成具有明確幾何邊界的複合費米面 (CF-FS)，
 *    其費米波矢為 $k_F^* = \sqrt{4\pi \rho_0}$，有別於無自旋電子費米面。
 * 4. 幾何共振 (Commensurability Geometric Resonance)：
 *    當外加磁場偏離半填充時 ($\Delta B_{\text{eff}} \neq 0$)，複合費米子展現等效迴旋半徑：
 *    R_c^* = \frac{\hbar k_F^*}{e |\Delta B_{\text{eff}}|}
 *    當 $2 R_c^*$ 與樣品表面納米微結構週期 $a$ 滿足整數條件時，在縱向磁阻 $\rho_{xx}$ 引發幾何共振振盪峰！
 */

export type CompositeFermionRegime =
  | 'halperin-lee-read-half-filled-liquid'  // HLR 複合費米液體相 (ν = 1/2, B_eff = 0, 明確複合費米面)
  | 'effective-cyclotron-geometric-resonance'// 等效迴旋幾何共振振盪相 (ΔB_eff ≠ 0, 軌道直徑 2Rc* 共振)
  | 'composite-fermion-fractional-qhe'      // 複合費米子整數朗道能級填充分數霍爾相 (Jain 序列 ν = 2/5, 3/7)
  | 'paired-pfaffian-moore-read-gap';       // 複合費米子 p-波拓撲配對能隙超流相 (Moore-Read Pfaffian 態)

export interface CompositeFermionState {
  fillingFactorNu: number;                  // 朗道能階填充分數 \nu (0.40 ~ 0.60, 典型 0.500)
  totalMagneticFieldTesla: number;          // 外加強垂直磁場 B (Tesla, 6.0 ~ 18.0 T)
  electronDensity10_11Cm2: number;          // 2D 電子面密度 \rho_0 (10^11 cm^-2, 1.0 ~ 4.0)
  surfaceModulationPeriodNm: number;        // 人工微結構幾何條紋週期 a (nm, 100 ~ 400 nm)
  regime: CompositeFermionRegime;

  // 動態演算物理指標
  effectiveMagneticFieldTesla: number;      // 複合費米子感受之淨等效磁場 B_eff (Tesla)
  compositeFermiWavevectorInvNm: number;    // 複合費米波矢 k_F^* (nm^-1)
  cyclotronOrbitDiameterNm: number;         // 複合費米子迴旋軌道直徑 2R_c^* (nm)
  geometricResonanceIndex: number;          // 幾何共振整數比 2R_c^* / a
  longitudinalMagnetoResistivityOhm: number;// 縱向磁阻率 \rho_{xx} (\Omega)
  accumulatedResonanceCyclesCount: number;  // 累計幾何共振循環週期
  telemetryHistory: Array<{
    timestamp: number;
    fillingNu: number;
    effectiveB: number;
    orbitDiameter: number;
  }>;
}

const STORAGE_KEY = 'newworld_composite_fermion_hlr_state_v1';
const PLANCK_HBAR_J_S = 1.054571817e-34;
const ELEM_CHARGE_C = 1.602176634e-19;

class CompositeFermionHLREngine {
  private state: CompositeFermionState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): CompositeFermionState {
    return {
      fillingFactorNu: 0.500,               // 精確 ν = 1/2
      totalMagneticFieldTesla: 12.0,        // 12.0 T
      electronDensity10_11Cm2: 2.2,         // 2.2 * 10^11 cm^-2
      surfaceModulationPeriodNm: 200.0,     // 200 nm
      regime: 'halperin-lee-read-half-filled-liquid',
      effectiveMagneticFieldTesla: 0.0,     // B_eff = 0
      compositeFermiWavevectorInvNm: 0.166, // k_F^* ≈ 0.166 nm^-1
      cyclotronOrbitDiameterNm: 999.0,      // B_eff = 0 時發散 (直線運動)
      geometricResonanceIndex: 0.0,
      longitudinalMagnetoResistivityOhm: 145.0,
      accumulatedResonanceCyclesCount: 0,
      telemetryHistory: []
    };
  }

  private loadState(): CompositeFermionState {
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
      console.warn('[CompositeFermionEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[CompositeFermionEngine] 儲存失敗', e);
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
   * 播放統計磁通附著脈衝 (Chern-Simons Flux Attachment Chirp)
   */
  public playFluxAttachmentChirp(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(960, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('[CompositeFermionEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放複合費米子迴旋共振嗡鳴 (Composite Cyclotron Resonance Drone)
   */
  public playCyclotronResonanceDrone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('[CompositeFermionEngine] 音效播放異常', e);
    }
  }

  /**
   * 重新計算有效磁場、複合費米面波矢與迴旋軌道共振
   */
  public recalculatePhysics(): void {
    const nu = this.state.fillingFactorNu;
    const B = Math.max(1.0, this.state.totalMagneticFieldTesla);
    const n2d = Math.max(0.5, this.state.electronDensity10_11Cm2) * 1e15; // m^-2
    const aPeriodNm = Math.max(50.0, this.state.surfaceModulationPeriodNm);

    // 1. 等效磁場 B_eff = B * (1 - 2\nu)
    const bEff = B * (1.0 - 2.0 * nu);
    this.state.effectiveMagneticFieldTesla = Number(bEff.toFixed(3));

    // 2. 複合費米波矢 k_F^* = \sqrt{4\pi \rho_0} (m^-1) -> nm^-1
    const kF = Math.sqrt(4.0 * Math.PI * n2d);
    const kFNm = kF * 1e-9;
    this.state.compositeFermiWavevectorInvNm = Number(kFNm.toFixed(3));

    // 3. 複合迴旋軌道直徑 2 R_c^* = 2 \hbar k_F^* / (e |B_eff|)
    let diameterNm = 999.0;
    const absBeff = Math.abs(bEff);
    if (absBeff > 0.05) {
      const rc = (PLANCK_HBAR_J_S * kF) / (ELEM_CHARGE_C * absBeff);
      diameterNm = 2.0 * rc * 1e9;
      this.state.cyclotronOrbitDiameterNm = Number(diameterNm.toFixed(1));
    } else {
      this.state.cyclotronOrbitDiameterNm = 999.0;
    }

    // 4. 幾何共振指標 2R_c^* / a
    const resIndex = diameterNm / aPeriodNm;
    this.state.geometricResonanceIndex = Number(resIndex.toFixed(2));

    // 5. 縱向磁阻率 \rho_xx 振盪
    const deltaNu = Math.abs(nu - 0.5);
    const oscillation = Math.cos(2.0 * Math.PI * resIndex);
    const rhoXx = 145.0 + 35.0 * Math.exp(-deltaNu / 0.04) * (1.0 + 0.35 * oscillation);
    this.state.longitudinalMagnetoResistivityOhm = Number(rhoXx.toFixed(1));

    // 6. 相態邏輯判定
    if (deltaNu < 0.015) {
      this.state.regime = 'halperin-lee-read-half-filled-liquid';
    } else if (Math.abs(nu - 0.40) < 0.01 || Math.abs(nu - 0.60) < 0.01) {
      this.state.regime = 'composite-fermion-fractional-qhe';
    } else if (Math.abs(resIndex - Math.round(resIndex)) < 0.25 && diameterNm < 600.0) {
      this.state.regime = 'effective-cyclotron-geometric-resonance';
    } else {
      this.state.regime = 'paired-pfaffian-moore-read-gap';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.regime === 'halperin-lee-read-half-filled-liquid' || this.state.regime === 'effective-cyclotron-geometric-resonance') {
      this.state.accumulatedResonanceCyclesCount += Math.floor(deltaSeconds * 3);
    }

    if (Math.random() < deltaSeconds * 0.4) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        fillingNu: this.state.fillingFactorNu,
        effectiveB: this.state.effectiveMagneticFieldTesla,
        orbitDiameter: this.state.cyclotronOrbitDiameterNm
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  // --- 控制操作 API ---

  public setFillingFactor(nu: number): void {
    this.state.fillingFactorNu = Math.max(0.40, Math.min(0.60, nu));
    this.recalculatePhysics();
    this.saveState();
  }

  public setTotalMagneticField(tesla: number): void {
    this.state.totalMagneticFieldTesla = Math.max(6.0, Math.min(18.0, tesla));
    this.recalculatePhysics();
    this.saveState();
  }

  public setElectronDensity(density10_11: number): void {
    this.state.electronDensity10_11Cm2 = Math.max(1.0, Math.min(4.0, density10_11));
    this.recalculatePhysics();
    this.saveState();
  }

  public setModulationPeriod(nm: number): void {
    this.state.surfaceModulationPeriodNm = Math.max(100.0, Math.min(400.0, nm));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 手動觸發 HLR 複合費米面幾何共振 (Trigger HLR Geometric Resonance)
   */
  public triggerGeometricResonance(): void {
    this.state.fillingFactorNu = 0.525;
    this.state.totalMagneticFieldTesla = 12.0;
    this.state.surfaceModulationPeriodNm = 200.0;
    this.state.accumulatedResonanceCyclesCount += 50;
    this.state.regime = 'effective-cyclotron-geometric-resonance';
    this.recalculatePhysics();
    this.playFluxAttachmentChirp();
    this.playCyclotronResonanceDrone();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: CompositeFermionRegime[] = [
      'halperin-lee-read-half-filled-liquid',
      'effective-cyclotron-geometric-resonance',
      'composite-fermion-fractional-qhe',
      'paired-pfaffian-moore-read-gap'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    this.state.regime = regimes[(currentIndex + 1) % regimes.length];

    if (this.state.regime === 'halperin-lee-read-half-filled-liquid') {
      this.state.fillingFactorNu = 0.500;
      this.playFluxAttachmentChirp();
    } else if (this.state.regime === 'effective-cyclotron-geometric-resonance') {
      this.triggerGeometricResonance();
      return;
    } else if (this.state.regime === 'composite-fermion-fractional-qhe') {
      this.state.fillingFactorNu = 0.400; // Jain ν = 2/5
      this.playCyclotronResonanceDrone();
    } else {
      this.state.fillingFactorNu = 0.550;
      this.playFluxAttachmentChirp();
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<CompositeFermionState> {
    return this.state;
  }
}

export const compositeFermionEngine = new CompositeFermionHLREngine();
