/**
 * 雙折射引力透鏡與偏振旋角幾何相光子干涉儀
 * (Gravitational Vacuum Birefringence & Polarized Geometric Phase Interferometer)
 *
 * 核心物理理論：
 * 1. 引力阿哈羅諾夫-卡舍爾效應與真空雙折射：
 *    在旋轉克爾黑洞或緻密天體之極端強重力場中，引入外爾曲率與電磁張量之手性耦合
 *    \Delta\mathcal{L} = \frac{\alpha_{\text{grav}}}{2 M_*^2} C_{\mu\nu\rho\sigma} \tilde{F}^{\mu\nu} F^{\rho\sigma}。
 *    該項自發破缺局部宇稱對稱性，導致真空對左旋 (LCP) 與右旋 (RCP) 圓偏振光子呈現
 *    不同之有效折射率 n_{\pm} = 1 \pm \delta n_{\text{biref}}。
 * 2. 潘查拉特納姆-貝里幾何相位 (Pancharatnam-Berry Geometric Phase)：
 *    沿彎曲零測地線 (Null Geodesics) 傳播之光子，其偏振態在天球龐加萊球 (Poincaré Sphere)
 *    上描繪閉合幾何路徑，累積幾何相位 \Phi_{\text{geom}} 與偏振旋轉角 \Delta\theta_{\text{pol}}。
 * 3. 偏振依賴時間延遲與愛因斯坦雙偏振環：
 *    左旋與右旋偏振光在強透鏡作用下抵達探測器時產生皮秒級 (ps) 幾何微分時間延遲
 *    \Delta t_{\text{delay}}，並在超大質量黑洞天球投影中分裂為具備正交偏振特徵之
 *    孿生愛因斯坦環像 (Twin Einstein Rings)。
 */

export type BirefringentLensRegime =
  | 'gravitational-vacuum-birefringence' // 強引力真空雙折射分光相 (左右旋測地線分裂)
  | 'pancharatnam-berry-geodesic'        // 潘查拉特納姆-貝里幾何相旋轉相 (偏振角累積)
  | 'einstein-polarized-twin-rings'      // 愛因斯坦雙重偏振環形透鏡像 (高對比度次環)
  | 'weyl-curvature-parity-violation';   // 外爾曲率宇稱破缺色散相 (光子自旋-引力耦合)

export interface BirefringentLensState {
  blackHoleMassSolar: number;         // 透鏡黑洞質量 M (太陽質量 M_sun, 5.0 ~ 200.0)
  dimensionlessSpinAOverM: number;    // 無因次克爾自旋參數 a/M (0.0 ~ 0.998)
  chiralWeylCouplingAlpha: number;    // 外爾引力手性耦合強度 \alpha_grav (0.0 ~ 10.0)
  impactParameterRg: number;          // 測地線衝擊參數 b (引力半徑 R_g 單位, 2.5 ~ 30.0)
  photonFrequencyGhz: number;         // 探針光子頻率 \nu (GHz, 10.0 ~ 600.0)
  regime: BirefringentLensRegime;

  // 動態演算物理指標
  birefringentSplittingMicroArcsec: number; // 偏振雙折射角分裂角 (μas 微角秒)
  polarizationRotationAngleDeg: number;    // 累積偏振旋轉角 \Delta\theta (度)
  differentialDelayPicoSec: number;        // 左右旋幾何微分時延 \Delta t (ps)
  geometricBerryPhaseRad: number;          // 潘查拉特納姆幾何相位 \Phi_geom (rad)
  einsteinRingRadiusMicroArcsec: number;   // 主愛因斯坦環角半徑 (μas)
  polarizationContrastRatio: number;       // 雙像偏振消光對比度
  telemetryHistory: Array<{
    timestamp: number;
    splittingUas: number;
    rotAngleDeg: number;
    delayPs: number;
  }>;
}

const STORAGE_KEY = 'newworld_birefringent_lens_state_v1';

class BirefringentGravLensEngine {
  private state: BirefringentLensState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): BirefringentLensState {
    return {
      blackHoleMassSolar: 40.0,
      dimensionlessSpinAOverM: 0.92,
      chiralWeylCouplingAlpha: 3.5,
      impactParameterRg: 5.8,
      photonFrequencyGhz: 230.0, // EHT 毫米波頻段
      regime: 'gravitational-vacuum-birefringence',
      birefringentSplittingMicroArcsec: 14.8,
      polarizationRotationAngleDeg: 28.5,
      differentialDelayPicoSec: 4.25,
      geometricBerryPhaseRad: 0.995,
      einsteinRingRadiusMicroArcsec: 52.4,
      polarizationContrastRatio: 0.92,
      telemetryHistory: []
    };
  }

  private loadState(): BirefringentLensState {
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

  public getState(): BirefringentLensState {
    return { ...this.state };
  }

  public setParameters(params: Partial<Pick<BirefringentLensState, 'blackHoleMassSolar' | 'dimensionlessSpinAOverM' | 'chiralWeylCouplingAlpha' | 'impactParameterRg' | 'photonFrequencyGhz' | 'regime'>>): void {
    if (params.blackHoleMassSolar !== undefined) {
      this.state.blackHoleMassSolar = Math.max(5.0, Math.min(200.0, Number(params.blackHoleMassSolar)));
    }
    if (params.dimensionlessSpinAOverM !== undefined) {
      this.state.dimensionlessSpinAOverM = Math.max(0.0, Math.min(0.998, Number(params.dimensionlessSpinAOverM)));
    }
    if (params.chiralWeylCouplingAlpha !== undefined) {
      this.state.chiralWeylCouplingAlpha = Math.max(0.0, Math.min(10.0, Number(params.chiralWeylCouplingAlpha)));
    }
    if (params.impactParameterRg !== undefined) {
      this.state.impactParameterRg = Math.max(2.5, Math.min(30.0, Number(params.impactParameterRg)));
    }
    if (params.photonFrequencyGhz !== undefined) {
      this.state.photonFrequencyGhz = Math.max(10.0, Math.min(600.0, Number(params.photonFrequencyGhz)));
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

  public pulsePolarizationProbe(): void {
    // 發射一次左右旋偏振雙光子探針
    this.state.birefringentSplittingMicroArcsec = Number((this.state.birefringentSplittingMicroArcsec + 1.2).toFixed(1));
    this.state.polarizationRotationAngleDeg = Number((this.state.polarizationRotationAngleDeg + 4.5).toFixed(1));
    this.playTone(740.0, 'sawtooth'); // F#5
    this.saveState();
  }

  public toggleChiralCoupling(): void {
    // 快速切換宇稱破缺外爾手性耦合
    if (this.state.chiralWeylCouplingAlpha === 0) {
      this.state.chiralWeylCouplingAlpha = 4.8;
      this.state.regime = 'weyl-curvature-parity-violation';
    } else {
      this.state.chiralWeylCouplingAlpha = 0.0;
      this.state.regime = 'pancharatnam-berry-geodesic';
    }
    this.recalculatePhysics();
    this.playTone(493.88, 'sine'); // B4
    this.saveState();
  }

  private recalculatePhysics(): void {
    const { blackHoleMassSolar, dimensionlessSpinAOverM, chiralWeylCouplingAlpha, impactParameterRg, photonFrequencyGhz, regime } = this.state;

    // 1. 愛因斯坦環角半徑 \theta_E \propto \sqrt{M}
    this.state.einsteinRingRadiusMicroArcsec = Number((Math.sqrt(blackHoleMassSolar) * 8.28).toFixed(1));

    // 2. 雙折射角分裂角 (受到自旋與外爾手性耦合放大)
    const spinFactor = 1.0 + dimensionlessSpinAOverM * 1.5;
    const impactFactor = 10.0 / Math.max(2.5, impactParameterRg);
    const rawSplitting = (chiralWeylCouplingAlpha * 0.85 + 0.15) * spinFactor * impactFactor;
    this.state.birefringentSplittingMicroArcsec = Number(rawSplitting.toFixed(1));

    // 3. 累積偏振旋轉角 (度)
    const berryPhase = (dimensionlessSpinAOverM * 0.6 + chiralWeylCouplingAlpha * 0.12) * impactFactor;
    this.state.geometricBerryPhaseRad = Number(berryPhase.toFixed(3));
    this.state.polarizationRotationAngleDeg = Number(((berryPhase * 180.0 / Math.PI) % 360).toFixed(1));

    // 4. 微分時間延遲 (ps)
    this.state.differentialDelayPicoSec = Number((
      rawSplitting * 0.28 * (photonFrequencyGhz / 200.0)
    ).toFixed(2));

    // 5. 偏振消光比
    this.state.polarizationContrastRatio = regime === 'einstein-polarized-twin-rings' ? 0.98 : 0.88;
  }

  public update(delta: number): void {
    const now = Date.now();
    const drift = Math.sin(now * 0.0028) * 0.03;
    this.state.differentialDelayPicoSec = Math.max(0.1, Number((this.state.differentialDelayPicoSec + drift * delta).toFixed(2)));

    if (!this.state.telemetryHistory) {
      this.state.telemetryHistory = [];
    }

    if (this.state.telemetryHistory.length === 0 || now - this.state.telemetryHistory[this.state.telemetryHistory.length - 1].timestamp > 1200) {
      this.state.telemetryHistory.push({
        timestamp: now,
        splittingUas: this.state.birefringentSplittingMicroArcsec,
        rotAngleDeg: this.state.polarizationRotationAngleDeg,
        delayPs: this.state.differentialDelayPicoSec
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

  private playTone(freq = 622.25, type: OscillatorType = 'sine'): void { // D#5
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.33);
    } catch {
      // 略過純代碼音訊例外
    }
  }
}

export const birefringentGravLensEngine = new BirefringentGravLensEngine();
