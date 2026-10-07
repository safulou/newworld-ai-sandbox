/**
 * 阿哈羅諾夫-卡舍爾中性費米子自旋拓撲相位干涉儀 (Aharonov-Casher Neutral Spin Topological Interferometer)
 * 
 * 理論基礎：
 * 1. 阿哈羅諾夫-卡舍爾幾何效應 (Aharonov & Casher 1984, Cimmino et al. 1989)
 *    中性磁偶極子 μ 在連續帶電線電荷 (電場 E = λ/(2πε₀r)) 周圍運動，獲得拓撲幾何相位：
 *    Φ_AC = (1 / ħ c²) ∮ (μ × E) · dr = (μ λ) / (ħ ε₀ c²)
 * 2. 電磁拓撲對偶性 (Electromagnetic Duality):
 *    AB 效應 (電荷繞磁通線) ↔ AC 效應 (磁偶極繞電荷線)。
 * 3. 半導體奈米環 Rashba 自旋軌道耦合調製 (Nitta et al. 1999, König et al. 2006):
 *    自旋歲差角度 θ_prec = 2π (Φ_AC / Φ_AC0)，在半整數幾何相位點發生完全相消干涉 (G = 0)。
 * 4. 4 大自旋幾何拓撲體制：
 *    - neutral_neutron_geometric_phase: 中子中性磁偶極繞線電荷拓撲干涉
 *    - rashba_spin_orbit_nanoring: 半導體奈米環 Rashba 自旋電晶體調製
 *    - magnon_spin_wave_interference: 磁子中性自旋波幾何相位無耗散傳輸
 *    - duality_flux_spin_topological_gate: AB-AC 電磁對偶自旋拓撲量子邏輯閘
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成高壓線電荷靜電蜂鳴音、自旋幾何進動立體聲掃頻音、相消干涉靜默陷波
 * - HTML5 Canvas 2D 呈現中心帶電線電荷輻射電場、中性自旋干涉雙臂奈米環、自旋幾何進動向量場與導納調製曲線
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type ACRegime = 
  | 'neutral_neutron_geometric_phase' 
  | 'rashba_spin_orbit_nanoring' 
  | 'magnon_spin_wave_interference' 
  | 'duality_flux_spin_topological_gate';

export interface SpinInterferenceTelemetry {
  id: string;
  phaseRad: number;
  conductanceQuantum: number; // G / G_0 (0 ~ 1)
  precessionAngleDeg: number;
  polarizationPurity: number;
  timestamp: number;
}

export interface AharonovCasherState {
  regime: ACRegime;
  lineChargeDensityNCPerM: number; // 線電荷密度 λ (nC/m) (-20 ~ 20)
  acGeometricPhaseRad: number; // 幾何相位 Φ_AC (rad)
  spinConductanceG0: number; // 自旋導納 G / G_0 (0 ~ 1)
  rashbaCouplingPicoEVm: number; // Rashba 耦合強度 α_R (p eV·m)
  spinPrecessionAngleDeg: number; // 自旋進動角度 (0 ~ 360°)
  spinPolarizationPercent: number; // 自旋極化率 (0 ~ 100%)
  interferenceContrastRatio: number; // 干涉對比度 (0 ~ 1)
  autoGateSweep: boolean;
  totalInterferenceEvents: number;
  telemetryHistory: SpinInterferenceTelemetry[];
}

const STORAGE_KEY = 'newworld_aharonov_casher_interferometer';

class AharonovCasherEngine {
  private state: AharonovCasherState = {
    regime: 'rashba_spin_orbit_nanoring',
    lineChargeDensityNCPerM: 8.5,
    acGeometricPhaseRad: Math.PI,
    spinConductanceG0: 0.05, // 接近相消干涉關閉態
    rashbaCouplingPicoEVm: 25.4,
    spinPrecessionAngleDeg: 180.0,
    spinPolarizationPercent: 96.2,
    interferenceContrastRatio: 0.94,
    autoGateSweep: true,
    totalInterferenceEvents: 42,
    telemetryHistory: []
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeSpinInterference();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): AharonovCasherState {
    return { ...this.state, telemetryHistory: [...this.state.telemetryHistory] };
  }

  public setRegime(regime: ACRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'neutral_neutron_geometric_phase':
        this.state.rashbaCouplingPicoEVm = 0.0;
        this.state.lineChargeDensityNCPerM = 12.0;
        break;
      case 'rashba_spin_orbit_nanoring':
        this.state.rashbaCouplingPicoEVm = 25.4;
        this.state.lineChargeDensityNCPerM = 8.5;
        break;
      case 'magnon_spin_wave_interference':
        this.state.rashbaCouplingPicoEVm = 15.0;
        this.state.lineChargeDensityNCPerM = 4.2;
        break;
      case 'duality_flux_spin_topological_gate':
        this.state.rashbaCouplingPicoEVm = 32.0;
        this.state.lineChargeDensityNCPerM = 16.0;
        break;
    }
    this.recomputeSpinInterference();
    this.playElectrostaticTone();
    this.saveState();
  }

  public setLineCharge(ncPerM: number): void {
    this.state.lineChargeDensityNCPerM = Math.max(-20.0, Math.min(20.0, parseFloat(ncPerM.toFixed(2))));
    this.recomputeSpinInterference();
    this.saveState();
  }

  public setRashbaCoupling(coupling: number): void {
    this.state.rashbaCouplingPicoEVm = Math.max(0.0, Math.min(50.0, parseFloat(coupling.toFixed(1))));
    this.recomputeSpinInterference();
    this.saveState();
  }

  public toggleAutoSweep(): void {
    this.state.autoGateSweep = !this.state.autoGateSweep;
    this.saveState();
  }

  public recordInterferenceShot(): void {
    const item: SpinInterferenceTelemetry = {
      id: 'ac-' + Date.now().toString(36),
      phaseRad: this.state.acGeometricPhaseRad,
      conductanceQuantum: this.state.spinConductanceG0,
      precessionAngleDeg: this.state.spinPrecessionAngleDeg,
      polarizationPurity: parseFloat((this.state.spinPolarizationPercent / 100).toFixed(3)),
      timestamp: Date.now()
    };
    this.state.telemetryHistory.unshift(item);
    if (this.state.telemetryHistory.length > 20) {
      this.state.telemetryHistory.pop();
    }
    this.state.totalInterferenceEvents += 1;
    this.playSpinPrecessionBeep();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoGateSweep) {
      const sweep = Math.sin(Date.now() / 2400) * 8.0;
      this.state.lineChargeDensityNCPerM = parseFloat(sweep.toFixed(2));
      this.recomputeSpinInterference();
    }

    if (Math.random() < 0.2 * deltaSeconds) {
      this.recordInterferenceShot();
    }
  }

  private recomputeSpinInterference(): void {
    // 幾何相位 Φ_AC = (λ / λ_0) * π
    const normalizedFlux = this.state.lineChargeDensityNCPerM / 8.5;
    const phase = normalizedFlux * Math.PI;
    this.state.acGeometricPhaseRad = parseFloat(phase.toFixed(3));

    // 自旋進動角度 (0 ~ 360°)
    const angle = (Math.abs(phase) * (180.0 / Math.PI)) % 360;
    this.state.spinPrecessionAngleDeg = parseFloat(angle.toFixed(1));

    // 自旋導納 G = G_0 * cos²(Φ_AC / 2)
    const conductance = Math.pow(Math.cos(phase / 2.0), 2);
    this.state.spinConductanceG0 = parseFloat(Math.max(0.01, conductance).toFixed(3));

    // 自旋極化率
    const basePolarization = 90.0 + (this.state.rashbaCouplingPicoEVm / 50.0) * 8.0;
    this.state.spinPolarizationPercent = parseFloat(Math.min(99.9, basePolarization).toFixed(1));

    // 干涉對比度
    this.state.interferenceContrastRatio = parseFloat((0.85 + (this.state.spinPolarizationPercent / 100) * 0.14).toFixed(3));
  }

  // --- Web Audio 程序化合成 ---

  public playElectrostaticTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 靜電場蜂鳴音 (高頻)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const freq = 600 + Math.abs(this.state.lineChargeDensityNCPerM) * 35;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch { /* ignore */ }
  }

  public playSpinPrecessionBeep(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 自旋進動平移立體聲音效
      const osc = ctx.createOscillator();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const gain = ctx.createGain();

      osc.type = 'sine';
      // 導納越高頻率越高，相消干涉時頻率極低
      const freq = 200 + this.state.spinConductanceG0 * 600;
      osc.frequency.setValueAtTime(freq, now);

      // 立體聲隨相位環繞
      if (panner) {
        const panVal = Math.sin(this.state.acGeometricPhaseRad);
        panner.pan.setValueAtTime(panVal, now);
      }

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      if (panner) {
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch { /* ignore */ }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* ignore */ }
  }
}

export const aharonovCasherEngine = new AharonovCasherEngine();
