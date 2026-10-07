/**
 * 阿哈羅諾夫-玻姆幾何相位超導環陣列 (Aharonov-Bohm Geometric Phase Superconducting Ring Array)
 * 
 * 理論基礎：
 * 1. 阿哈羅諾夫-玻姆效應 (Aharonov-Bohm Effect, Aharonov & Bohm 1959)
 *    電子波函數在無磁場空間區域獲得拓撲幾何相位 Δγ = (e/ħ) ∮ A · dr = 2π (Φ / Φ_0)
 * 2. 超導磁通量子化標度 Φ_0 = h / (2e) ≈ 2.0678 × 10^-15 Wb
 * 3. 介觀孤立超導奈米環中之持續無耗散電流 (Persistent Currents) I = -∂E/∂Φ
 * 4. 阿哈羅諾夫-卡舍爾 (Aharonov-Casher) 效應與拓撲磁通量子位元相干性
 * 5. 4 大幾何相位干涉體制：
 *    - fractional_flux_persistent_current: 分數磁通量子持續無耗散超導超流
 *    - aharonov_casher_spin_topological: 阿哈羅諾夫-卡舍爾電場自旋相位干涉
 *    - mesoscopic_quantum_ring_multipath: 介觀多臂環路拓撲路徑干涉態
 *    - topological_flux_qubit_coherence: 拓撲磁通量子位元相干自旋鎖定
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成持續超流正弦微振、磁通量子鎖定滴答音與相消干涉陷波掃頻
 * - HTML5 Canvas 2D 呈現同心雙超導環、封閉磁通線管、電子機率波干涉條紋與環路電流向量
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type ABRegime = 
  | 'fractional_flux_persistent_current' 
  | 'aharonov_casher_spin_topological' 
  | 'mesoscopic_quantum_ring_multipath' 
  | 'topological_flux_qubit_coherence';

export interface PersistentCurrentLog {
  id: string;
  fluxRatio: number; // Φ / Φ_0
  currentMicroAmp: number;
  geometricPhaseRad: number;
  interferenceVisibility: number; // (0 ~ 1)
  timestamp: number;
}

export interface AharonovBohmState {
  regime: ABRegime;
  magneticFluxRatio: number; // Φ / Φ_0 (0.0 ~ 3.0)
  ringRadiusNm: number; // 環半徑 (50 ~ 500 nm)
  persistentCurrentMicroAmp: number; // 持續超導電流 (μA)
  geometricPhaseRad: number; // 幾何相位 γ (rad)
  interferenceVisibilityPercent: number; // 干涉對比度 (0 ~ 100%)
  phaseCoherenceLengthUm: number; // 相干長度 L_phi (μm)
  persistentEnergyFlux: number;
  currentHistory: PersistentCurrentLog[];
  autoFluxModulation: boolean;
  totalFluxQuantaCount: number;
}

const STORAGE_KEY = 'newworld_aharonov_bohm_ring';

class AharonovBohmRingEngine {
  private state: AharonovBohmState = {
    regime: 'fractional_flux_persistent_current',
    magneticFluxRatio: 0.5, // 典型半整數磁通 (破壞性干涉臨界點)
    ringRadiusNm: 180.0,
    persistentCurrentMicroAmp: 3.42,
    geometricPhaseRad: Math.PI,
    interferenceVisibilityPercent: 92.5,
    phaseCoherenceLengthUm: 14.2,
    persistentEnergyFlux: 710.0,
    currentHistory: [],
    autoFluxModulation: true,
    totalFluxQuantaCount: 16
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeABInterference();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): AharonovBohmState {
    return { ...this.state, currentHistory: [...this.state.currentHistory] };
  }

  public setRegime(regime: ABRegime): void {
    this.state.regime = regime;
    this.recomputeABInterference();
    this.playFluxQuantumClick();
    this.saveState();
  }

  public setFluxRatio(ratio: number): void {
    this.state.magneticFluxRatio = Math.max(0.0, Math.min(3.0, parseFloat(ratio.toFixed(2))));
    this.recomputeABInterference();
    this.saveState();
  }

  public setRingRadiusNm(r: number): void {
    this.state.ringRadiusNm = Math.max(50.0, Math.min(500.0, parseFloat(r.toFixed(1))));
    this.recomputeABInterference();
    this.saveState();
  }

  public setAutoModulation(enabled: boolean): void {
    this.state.autoFluxModulation = enabled;
    this.saveState();
  }

  /**
   * 計算幾何相位、持續電流振幅與量子干涉對比度
   */
  public recomputeABInterference(): void {
    const phi = this.state.magneticFluxRatio;
    const r = this.state.ringRadiusNm;

    // 幾何相位 γ = 2π (Φ / Φ_0)
    const phase = (2 * Math.PI * phi) % (2 * Math.PI);
    this.state.geometricPhaseRad = parseFloat(phase.toFixed(3));

    // 體制增益因數
    let regimeBoost = 1.0;
    if (this.state.regime === 'fractional_flux_persistent_current') regimeBoost = 1.2;
    if (this.state.regime === 'aharonov_casher_spin_topological') regimeBoost = 1.5;
    if (this.state.regime === 'mesoscopic_quantum_ring_multipath') regimeBoost = 1.8;
    if (this.state.regime === 'topological_flux_qubit_coherence') regimeBoost = 2.2;

    // 持續電流 I ∝ sin(2π Φ/Φ_0) / (2π r)
    const baseCurrent = Math.sin(2 * Math.PI * phi) * (450.0 / r) * regimeBoost;
    this.state.persistentCurrentMicroAmp = parseFloat(baseCurrent.toFixed(2));

    // 干涉對比度 (半整數磁通時消光)
    const visibility = (0.5 + 0.5 * Math.abs(Math.cos(Math.PI * phi))) * 98.0;
    this.state.interferenceVisibilityPercent = parseFloat(visibility.toFixed(1));

    // 相干長度 L_phi (低溫奈米環中保持數十微米)
    this.state.phaseCoherenceLengthUm = parseFloat((10.0 + (regimeBoost * 3.5) + (r / 500.0) * 4.0).toFixed(1));
  }

  /**
   * 觸發量子干涉採樣 (Sample Quantum Interference)
   */
  public sampleInterference(): PersistentCurrentLog {
    this.recomputeABInterference();
    const vis = this.state.interferenceVisibilityPercent / 100.0;

    const log: PersistentCurrentLog = {
      id: `ab-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fluxRatio: this.state.magneticFluxRatio,
      currentMicroAmp: this.state.persistentCurrentMicroAmp,
      geometricPhaseRad: this.state.geometricPhaseRad,
      interferenceVisibility: vis,
      timestamp: Date.now()
    };

    this.state.currentHistory.unshift(log);
    if (this.state.currentHistory.length > 20) {
      this.state.currentHistory.pop();
    }

    this.state.totalFluxQuantaCount++;
    this.state.persistentEnergyFlux += 58.0 * (1.0 + Math.abs(this.state.persistentCurrentMicroAmp) * 0.1);

    this.playCurrentVibrato(this.state.magneticFluxRatio);
    this.saveState();
    return log;
  }

  /**
   * 鎖定分數磁通極大超流點 (Φ = 0.25 Φ_0)
   */
  public lockOptimumPersistentFlux(): void {
    this.state.magneticFluxRatio = 0.25; // 最大持續電流點
    this.state.persistentEnergyFlux += 150.0;
    this.recomputeABInterference();
    this.playFluxQuantumClick();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoFluxModulation) {
      this.state.persistentEnergyFlux += delta * (0.8 + Math.abs(this.state.persistentCurrentMicroAmp) * 0.05);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  private playFluxQuantumClick(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // 磁通量子跳躍滴答音
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200.0, now);
      osc.frequency.exponentialRampToValueAtTime(300.0, now + 0.08);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // 容錯靜音
    }
  }

  private playCurrentVibrato(flux: number): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // 頻率隨磁通量正弦調變
      const freq = 440.0 + Math.sin(2 * Math.PI * flux) * 110.0;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.33);
    } catch {
      // 容錯靜音
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // 忽略儲存例外
    }
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch {
      // 忽略載入例外
    }
  }
}

export const aharonovBohmEngine = new AharonovBohmRingEngine();
