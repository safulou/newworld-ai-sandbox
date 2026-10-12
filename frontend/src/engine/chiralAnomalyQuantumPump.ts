/**
 * 拓撲手性反常弗蘭肯斯坦量子泵浦反應堆 (Chiral Anomaly Quantum Pump Reactor)
 *
 * 核心物理理論：
 * 1. 外爾半金屬與 ABJ 手性反常 (Adler-Bell-Jackiw Chiral Anomaly in 3D Weyl Semimetals)：
 *    在動量空間中具有相反手性拓撲荷 (\chi = \pm 1) 的外爾節點；當外加平行電場與磁場 (\mathbf{E} \cdot \mathbf{B} \neq 0) 時，
 *    破缺手性電荷守恆，產生軸向電荷泵浦率：
 *    \frac{dn_5}{dt} = \frac{e^2}{4\pi^2\hbar^2 c} (\mathbf{E}\cdot\mathbf{B}) - \frac{n_5}{\tau_v}。
 * 2. 手性磁效應 (Chiral Magnetic Effect, CME)：
 *    軸向化學勢 \mu_5 = (\mu_L - \mu_R)/2 沿磁場方向激發完全無耗散的電磁超流：
 *    \mathbf{J}_{CME} = \frac{e^2}{2\pi^2 \hbar^2 c} \mu_5 \mathbf{B}。
 * 3. 巨負縱向磁阻與手性磁波 (NLMR & Chiral Magnetic Wave, CMW)：
 *    磁導率隨磁場平方遞增 \sigma(B) = \sigma_0 + C_W B^2 \tau_v；
 *    電磁微擾誘發手性荷與向量荷耦合傳播之手性磁波 (CMW)。
 */

export type ChiralPumpRegime =
  | 'floquet-axial-pump'       // 動態弗洛凱外爾反常軸向泵浦相
  | 'chiral-magnetic-wave'     // 手性磁波集體振盪傳輸相
  | 'fermi-arc-transport'      // 反轉費米弧表面無散射通道相
  | 'axionic-spin-transistor'; // 軸子自旋手性拓撲電晶體相

export interface ChiralPumpState {
  electricFieldKvCm: number;   // 平行電場 E_z (0.1 ~ 10.0 kV/cm)
  magneticFieldTesla: number;  // 外加磁場 B_z (0.5 ~ 12.0 T)
  alignmentAngleDeg: number;   // E 與 B 夾角 \theta_EB (0 ~ 90 度，0度為完美平行)
  interValleyRelaxationPs: number; // 谷間手性弛豫時間 \tau_v (1.0 ~ 50.0 ps)
  regime: ChiralPumpRegime;
  // 動態演算物理指標
  axialPumpingRate: number;    // 軸向電荷泵浦率 dn5/dt (10^28 m^-3 s^-1)
  axialChemicalPotentialMev: number; // 軸向化學勢 \mu_5 (meV)
  chiralMagneticCurrent: number;     // 手性磁電流密度 J_CME (A/mm^2)
  magnetoConductanceGainPct: number; // 巨負縱向磁阻電導增益 \Delta\sigma / \sigma_0 (%)
  chiralWaveVelocityKmS: number;     // 手性磁波傳播速度 v_chi (km/s)
  weylNodeSeparation: number;        // 外爾節點動量距離 2k_0 (Å^-1)
  telemetryHistory: Array<{
    timestamp: number;
    mu5: number;
    currentCme: number;
    conductanceGain: number;
  }>;
}

const STORAGE_KEY = 'newworld_chiral_pump_state_v1';

class ChiralAnomalyQuantumPumpEngine {
  private state: ChiralPumpState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
  }

  private getDefaultState(): ChiralPumpState {
    return {
      electricFieldKvCm: 2.5,
      magneticFieldTesla: 6.0,
      alignmentAngleDeg: 12.0,
      interValleyRelaxationPs: 18.0,
      regime: 'floquet-axial-pump',
      axialPumpingRate: 4.85,
      axialChemicalPotentialMev: 16.4,
      chiralMagneticCurrent: 82.5,
      magnetoConductanceGainPct: 340.0,
      chiralWaveVelocityKmS: 45.2,
      weylNodeSeparation: 0.32,
      telemetryHistory: []
    };
  }

  private loadState(): ChiralPumpState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...this.getDefaultState(),
          ...parsed,
          telemetryHistory: parsed.telemetryHistory || []
        };
      }
    } catch {
      // fallback
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  public getState(): ChiralPumpState {
    return this.state;
  }

  public setElectricField(eKv: number): void {
    this.state.electricFieldKvCm = Math.max(0.1, Math.min(10.0, eKv));
    this.recalculatePhysics();
  }

  public setMagneticField(bTesla: number): void {
    this.state.magneticFieldTesla = Math.max(0.5, Math.min(12.0, bTesla));
    this.recalculatePhysics();
  }

  public setAlignmentAngle(deg: number): void {
    this.state.alignmentAngleDeg = Math.max(0.0, Math.min(90.0, deg));
    this.recalculatePhysics();
  }

  public setRelaxationTime(tauPs: number): void {
    this.state.interValleyRelaxationPs = Math.max(1.0, Math.min(50.0, tauPs));
    this.recalculatePhysics();
  }

  public setRegime(regime: ChiralPumpRegime): void {
    this.state.regime = regime;
    this.recalculatePhysics();
    this.playRegimeChord(regime);
  }

  public setParameters(params: Partial<Pick<ChiralPumpState,
    'electricFieldKvCm' | 'magneticFieldTesla' | 'alignmentAngleDeg' | 'interValleyRelaxationPs' | 'regime'
  >>): void {
    if (params.electricFieldKvCm !== undefined) {
      this.state.electricFieldKvCm = Math.max(0.1, Math.min(10.0, params.electricFieldKvCm));
    }
    if (params.magneticFieldTesla !== undefined) {
      this.state.magneticFieldTesla = Math.max(0.5, Math.min(12.0, params.magneticFieldTesla));
    }
    if (params.alignmentAngleDeg !== undefined) {
      this.state.alignmentAngleDeg = Math.max(0.0, Math.min(90.0, params.alignmentAngleDeg));
    }
    if (params.interValleyRelaxationPs !== undefined) {
      this.state.interValleyRelaxationPs = Math.max(1.0, Math.min(50.0, params.interValleyRelaxationPs));
    }
    if (params.regime !== undefined) {
      this.state.regime = params.regime;
    }
    this.recalculatePhysics();
    this.saveState();
  }

  public pumpAxialPulse(): void {
    this.triggerChiralPulse();
    this.state.axialChemicalPotentialMev += 5.0;
  }

  public toggleChiralInversion(): void {
    this.state.chiralMagneticCurrent = -this.state.chiralMagneticCurrent;
    this.saveState();
  }

  public triggerChiralPulse(): void {
    // 注入超快軸向手性脈衝
    this.state.chiralMagneticCurrent = Math.min(250.0, this.state.chiralMagneticCurrent * 1.35);
    this.playChiralPulseAudio();
  }

  public update(_delta: number): void {
    this.recalculatePhysics();

    if (Math.random() < 0.1) {
      this.state.telemetryHistory.push({
        timestamp: Date.now(),
        mu5: this.state.axialChemicalPotentialMev,
        currentCme: this.state.chiralMagneticCurrent,
        conductanceGain: this.state.magnetoConductanceGainPct
      });
      if (this.state.telemetryHistory.length > 50) {
        this.state.telemetryHistory.shift();
      }
    }
  }

  private recalculatePhysics(): void {
    const E = this.state.electricFieldKvCm;
    const B = this.state.magneticFieldTesla;
    const thetaRad = (this.state.alignmentAngleDeg * Math.PI) / 180;
    const tau = this.state.interValleyRelaxationPs;

    // 1. E · B 點積
    const edotb = E * B * Math.cos(thetaRad);

    // 2. 軸向電荷泵浦率 dn5/dt \propto E · B
    this.state.axialPumpingRate = Math.max(0.01, 0.35 * Math.abs(edotb));

    // 3. 穩定態軸向化學勢 \mu_5 \approx (e^2 / 4\pi^2 v_F^3) (E · B) \tau_v
    const baseMu5 = 0.085 * edotb * tau;
    this.state.axialChemicalPotentialMev = Math.max(0.1, baseMu5);

    // 4. CME 無耗散手性磁電流密度 J_CME \propto \mu_5 B
    this.state.chiralMagneticCurrent = Math.max(0.5, 0.45 * this.state.axialChemicalPotentialMev * B);

    // 5. 巨負縱向磁阻增益 \Delta\sigma / \sigma_0 \propto B^2 \tau_v \cos^2\theta
    this.state.magnetoConductanceGainPct = Math.max(0.0, 1.8 * B * B * tau * Math.pow(Math.cos(thetaRad), 2));

    // 6. 手性磁波速度 v_chi \propto B
    this.state.chiralWaveVelocityKmS = Math.max(5.0, 7.5 * B);

    // 7. 費米弧節點間距
    this.state.weylNodeSeparation = 0.32;

    // 體制修正
    switch (this.state.regime) {
      case 'floquet-axial-pump':
        this.state.axialPumpingRate *= 1.3;
        break;
      case 'chiral-magnetic-wave':
        this.state.chiralWaveVelocityKmS *= 1.4;
        break;
      case 'fermi-arc-transport':
        this.state.chiralMagneticCurrent *= 1.25;
        break;
      case 'axionic-spin-transistor':
        this.state.magnetoConductanceGainPct *= 1.45;
        break;
    }
  }

  // === Procedural Web Audio API ===
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  private playChiralPulseAudio(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 雙外爾手性對偶滑頻音 (Dual Weyl slide)
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1050, now + 0.35);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // ignore
    }
  }

  private playRegimeChord(regime: ChiralPumpRegime): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      let freqs = [440.0, 554.37, 659.25]; // A4, C#5, E5
      if (regime === 'chiral-magnetic-wave') freqs = [392.0, 493.88, 587.33]; // G4, B4, D5
      if (regime === 'fermi-arc-transport') freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      if (regime === 'axionic-spin-transistor') freqs = [329.63, 440.0, 523.25]; // E4, A4, C5

      freqs.forEach((f, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05 / (idx + 1), this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);
      });
    } catch {
      // ignore
    }
  }
}

export const chiralAnomalyEngine = new ChiralAnomalyQuantumPumpEngine();
export const chiralPumpEngine = chiralAnomalyEngine;
