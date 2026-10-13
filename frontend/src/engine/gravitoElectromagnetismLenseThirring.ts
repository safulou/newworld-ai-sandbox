/**
 * 引力波引力電磁性與蘭斯-蒂靈時空拖曳引擎
 * (Gravito-Electromagnetism & Lense-Thirring Frame-Dragging Engine)
 *
 * 核心物理理論：
 * 1. 弱場廣義相對論引力電磁學 (Gravitoelectromagnetism, GEM)：
 *    在 1PN 後牛頓弱場近似下，愛因斯坦重力場方程可精確映射為類麥克斯韋形式：
 *    \nabla \cdot \mathbf{E}_g = -4\pi G \rho, \quad \nabla \times \mathbf{B}_g = -\frac{4\pi G}{c^2}\mathbf{j}_m + \frac{1}{c^2}\frac{\partial \mathbf{E}_g}{\partial t}，
 *    其中大質量自旋旋轉角動量 \mathbf{J} 激發引力磁場：
 *    \mathbf{B}_g = \frac{G}{c^2 r^3} \left[ 3(\mathbf{J}\cdot\hat{\mathbf{r}})\hat{\mathbf{r}} - \mathbf{J} \right]。
 * 2. 蘭斯-蒂靈時空拖曳 (Lense-Thirring Precession & Frame Dragging)：
 *    旋轉天體周圍的時空度規發生非對角扭曲 g_{0i} \neq 0，局域慣性系 (Local Inertial Frames)
 *    被旋轉時空強制拖曳，以蘭斯-蒂靈角速度發生剛性進動：
 *    \boldsymbol{\Omega}_{\text{LT}} = \frac{1}{2}\mathbf{B}_g = \frac{G}{2 c^2 r^3} \left[ 3(\mathbf{J}\cdot\hat{\mathbf{r}})\hat{\mathbf{r}} - \mathbf{J} \right]。
 * 3. 席夫陀螺儀進動 (Schiff Gyroscope Precession)：
 *    軌道上之自旋陀螺儀經歷雙重相對論進動疊加：
 *    \boldsymbol{\Omega}_{\text{Schiff}} = \boldsymbol{\Omega}_{\text{geodetic}} + \boldsymbol{\Omega}_{\text{LT}}，
 *    其中 \boldsymbol{\Omega}_{\text{geodetic}} = \frac{3GM}{2c^2 r^3} (\mathbf{r}\times\mathbf{v}) 為時空曲率測地歲差。
 * 4. 引力羅倫茲力與相對論性磁剪切噴流 (Gravitational Lorentz Force & Astrophysical Jets)：
 *    測試粒子感受引力羅倫茲力 \mathbf{F}_g = m (\mathbf{E}_g + \mathbf{v}\times\mathbf{B}_g)。
 *    在極端旋轉克爾緻密天體極區，極強的引力磁剪切張力能夠直接準直加速雙極超相對論性噴流，
 *    勞倫茲因子突破 \gamma \ge 10。
 */

export type GEMRegime =
  | 'lense-thirring-frame-dragging'       // 蘭斯-蒂靈時空拖曳主導進動相
  | 'gravitomagnetic-relativistic-jet'   // 極區引力磁場超相對論剪切噴流相
  | 'schiff-gyroscopic-geodetic-precession' // 席夫陀螺儀測地軌道複合歲差相
  | 'newtonian-weak-field-limit';         // 靜態牛頓弱場平庸極限相 (J ≈ 0)

export interface GravitoElectromagnetismState {
  angularMomentumJScale: number;          // 中心自旋角動量比例 J / J_max (0.0 ~ 0.99)
  orbitalRadiusRkm: number;               // 軌道半徑 r (10 ~ 1000 km)
  orbitalVelocityVFractionC: number;      // 軌道粒子速度 v / c (0.01 ~ 0.85)
  inclinationAngleThetaRad: number;       // 軌道傾角 \theta (0.0 ~ 3.14 rad)
  regime: GEMRegime;

  // 動態演算物理指標
  lenseThirringFreqMilliArcsecYr: number; // 蘭斯-蒂靈進動角速度 \Omega_LT (毫角秒/年)
  gravitomagneticFieldBgTeslaEq: number;  // 等效引力磁場強度 B_g (nT eq)
  geodeticPrecessionArcsecYr: number;     // 測地線歲差率 \Omega_geod (角秒/年)
  frameDraggingVelocityKmS: number;       // 時空拖曳切向速度 v_drag (km/s)
  relativisticJetLorentzGamma: number;    // 極區噴流勞倫茲因子 \gamma_jet
  telemetryHistory: Array<{
    timestamp: number;
    omegaLT: number;
    bgField: number;
    lorentzGamma: number;
  }>;
}

const STORAGE_KEY = 'newworld_gravito_electromagnetism_lense_thirring_state_v1';

class GravitoElectromagnetismEngine {
  private state: GravitoElectromagnetismState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): GravitoElectromagnetismState {
    return {
      angularMomentumJScale: 0.88,
      orbitalRadiusRkm: 45.0,
      orbitalVelocityVFractionC: 0.42,
      inclinationAngleThetaRad: 0.785, // 45 度
      regime: 'lense-thirring-frame-dragging',
      lenseThirringFreqMilliArcsecYr: 8420.5,
      gravitomagneticFieldBgTeslaEq: 16.4,
      geodeticPrecessionArcsecYr: 45.2,
      frameDraggingVelocityKmS: 125.8,
      relativisticJetLorentzGamma: 5.4,
      telemetryHistory: []
    };
  }

  private loadState(): GravitoElectromagnetismState {
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
      // 忽略儲存例外
    }
  }

  public getState(): GravitoElectromagnetismState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;
    const rRatio = Math.max(10.0, s.orbitalRadiusRkm) / 50.0;
    const invR3 = 1.0 / Math.pow(rRatio, 3);

    // 1. 蘭斯-蒂靈進動角速度 \Omega_LT \propto J / r^3
    const baseLT = 6500.0 * s.angularMomentumJScale * invR3 * (1 + 0.5 * Math.abs(Math.cos(s.inclinationAngleThetaRad)));
    s.lenseThirringFreqMilliArcsecYr = Number(baseLT.toFixed(1));

    // 2. 引力磁場強度 B_g \propto J / r^3 (單位 nT 等效)
    s.gravitomagneticFieldBgTeslaEq = Number((12.0 * s.angularMomentumJScale * invR3).toFixed(2));

    // 3. 測地歲差率 \Omega_geod \propto v^2 / r
    s.geodeticPrecessionArcsecYr = Number((35.0 * Math.pow(s.orbitalVelocityVFractionC / 0.4, 2) / rRatio).toFixed(1));

    // 4. 時空拖曳切向速度 v_drag = r * \Omega_LT
    s.frameDraggingVelocityKmS = Number((95.0 * s.angularMomentumJScale / Math.pow(rRatio, 2)).toFixed(1));

    // 5. 極區噴流勞倫茲因子 \gamma_jet \approx 1 / \sqrt{1 - (v_eff/c)^2}
    const betaJet = Math.min(0.99, Math.sqrt(Math.pow(s.orbitalVelocityVFractionC, 2) + Math.pow(s.angularMomentumJScale * 0.6, 2)));
    s.relativisticJetLorentzGamma = Number((1.0 / Math.sqrt(Math.max(0.01, 1.0 - betaJet * betaJet))).toFixed(2));

    // 狀態判定
    if (s.angularMomentumJScale > 0.85 && s.relativisticJetLorentzGamma > 4.5) {
      s.regime = 'gravitomagnetic-relativistic-jet';
    } else if (s.angularMomentumJScale > 0.50 && s.lenseThirringFreqMilliArcsecYr > 4000.0) {
      s.regime = 'lense-thirring-frame-dragging';
    } else if (s.geodeticPrecessionArcsecYr > 20.0) {
      s.regime = 'schiff-gyroscopic-geodetic-precession';
    } else {
      s.regime = 'newtonian-weak-field-limit';
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
        omegaLT: this.state.lenseThirringFreqMilliArcsecYr,
        bgField: this.state.gravitomagneticFieldBgTeslaEq,
        lorentzGamma: this.state.relativisticJetLorentzGamma
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public spinUpAngularMomentum(deltaJ: number): void {
    this.state.angularMomentumJScale = Number(Math.max(0.0, Math.min(0.99, this.state.angularMomentumJScale + deltaJ)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(450, 780, 0.2, 'sawtooth');
  }

  public shiftOrbitalRadius(deltaR: number): void {
    this.state.orbitalRadiusRkm = Number(Math.max(10.0, Math.min(1000.0, this.state.orbitalRadiusRkm + deltaR)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(320, 520, 0.16, 'sine');
  }

  public accelerateOrbitalVelocity(deltaV: number): void {
    this.state.orbitalVelocityVFractionC = Number(Math.max(0.01, Math.min(0.85, this.state.orbitalVelocityVFractionC + deltaV)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(550, 920, 0.22, 'triangle');
  }

  public triggerRelativisticJetSurge(): void {
    // 激發極區超相對論噴流爆發
    this.state.angularMomentumJScale = 0.98;
    this.state.orbitalRadiusRkm = 20.0;
    this.state.orbitalVelocityVFractionC = 0.82;
    this.recalculatePhysics();
    this.playTone(600, 1250, 0.32, 'square');
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
      // 忽略音效異常
    }
  }
}

export const gravitoElectromagnetismEngine = new GravitoElectromagnetismEngine();
export const gemEngine = gravitoElectromagnetismEngine;
