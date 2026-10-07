/**
 * 超對稱外爾費米子手性反常能源核 (Supersymmetric Weyl Semimetal Chiral Anomaly Energy Core)
 * 
 * 理論基礎：
 * 1. 外爾半金屬 (Weyl Semimetals) 與阿德勒-貝爾-傑基夫手性反常 (ABJ Chiral Anomaly, 1969/1983)
 * 2. 平行電場與磁場 (E · B ≠ 0) 破缺手性荷守恆，於相反手性外爾錐節點 (χ = ±1) 間產生軸向電荷泵浦：
 *    dρ_5 / dt = (e² / 4π² ħ² c) (E · B)
 * 3. 手性磁效應 (Chiral Magnetic Effect, CME) 誘發沿磁場方向無阻耗電流與巨負縱向磁阻 (NLMR)
 * 4. 動量空間中外爾節點作為貝里曲率 (Berry Curvature) 拓撲磁單極子 (拓撲荷 C = ±1)
 * 5. 4 大手性反常能源體制：
 *    - weyl_node_chiral_charge_pumping: 外爾節點手性電荷軸向同調泵浦
 *    - chiral_magnetic_axial_current: 手性磁效應沿場無阻電流導通
 *    - non_abelian_berry_monopole: 貝里曲率單極子手性拓撲荷發散
 *    - supersymmetric_partner_fermion: 超對稱伴侶費米子超對偶相變
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成手性對立雙向滑音、磁反常躍遷單音與貝里單極子調和脈衝
 * - HTML5 Canvas 2D 呈現雙手性外爾雙錐體 (χ=±1)、費米弧表面態連線與軸向電荷流動通量向量
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type WeylAnomalyRegime = 
  | 'weyl_node_chiral_charge_pumping' 
  | 'chiral_magnetic_axial_current' 
  | 'non_abelian_berry_monopole' 
  | 'supersymmetric_partner_fermion';

export interface ChiralPumpingEvent {
  id: string;
  electricFieldVPerM: number;
  magneticFieldTesla: number;
  edotBProduct: number;
  chiralChemicalPotentialMev: number;
  axialCurrentDensityAmp: number;
  timestamp: number;
}

export interface WeylChiralState {
  regime: WeylAnomalyRegime;
  electricFieldVPerM: number; // 電場 E (10 ~ 500 V/m)
  magneticFieldTesla: number; // 磁場 B (0.5 ~ 14.0 T)
  chiralSeparationKAngstrom: number; // 外爾節點動量空間間隔 2k_0 (0.1 ~ 1.5 Å^-1)
  chiralChemicalPotentialMev: number; // 手性化學勢 μ_5 (meV)
  axialConductivityMs: number; // 軸向無耗散電導率 (MS/m)
  fermiArcLengthNm: number; // 費米弧長度 (nm)
  chiralEnergyFlux: number; // 手性反常萃取通量 (pJ)
  pumpingHistory: ChiralPumpingEvent[];
  autoPumping: boolean;
  totalPumpingEventsCount: number;
}

const STORAGE_KEY = 'newworld_weyl_chiral_anomaly';

class WeylChiralAnomalyEngine {
  private state: WeylChiralState = {
    regime: 'weyl_node_chiral_charge_pumping',
    electricFieldVPerM: 120.0,
    magneticFieldTesla: 6.5,
    chiralSeparationKAngstrom: 0.65,
    chiralChemicalPotentialMev: 48.2,
    axialConductivityMs: 82.5,
    fermiArcLengthNm: 3.4,
    chiralEnergyFlux: 890.0,
    pumpingHistory: [],
    autoPumping: true,
    totalPumpingEventsCount: 22
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeAnomalyDynamics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): WeylChiralState {
    return { ...this.state, pumpingHistory: [...this.state.pumpingHistory] };
  }

  public setRegime(regime: WeylAnomalyRegime): void {
    this.state.regime = regime;
    this.recomputeAnomalyDynamics();
    this.playBerryMonopoleTone();
    this.saveState();
  }

  public setElectricField(e: number): void {
    this.state.electricFieldVPerM = Math.max(10.0, Math.min(500.0, parseFloat(e.toFixed(1))));
    this.recomputeAnomalyDynamics();
    this.saveState();
  }

  public setMagneticField(b: number): void {
    this.state.magneticFieldTesla = Math.max(0.5, Math.min(14.0, parseFloat(b.toFixed(1))));
    this.recomputeAnomalyDynamics();
    this.saveState();
  }

  public setAutoPumping(enabled: boolean): void {
    this.state.autoPumping = enabled;
    this.saveState();
  }

  /**
   * 計算 E · B 手性電荷泵浦率與手性化學勢 μ_5
   */
  public recomputeAnomalyDynamics(): void {
    const e = this.state.electricFieldVPerM;
    const b = this.state.magneticFieldTesla;
    const k = this.state.chiralSeparationKAngstrom;

    // 體制增益因數
    let regimeBoost = 1.0;
    if (this.state.regime === 'weyl_node_chiral_charge_pumping') regimeBoost = 1.25;
    if (this.state.regime === 'chiral_magnetic_axial_current') regimeBoost = 1.6;
    if (this.state.regime === 'non_abelian_berry_monopole') regimeBoost = 1.95;
    if (this.state.regime === 'supersymmetric_partner_fermion') regimeBoost = 2.4;

    // 手性化學勢 μ_5 ∝ (E · B) · τ_v / e
    const edotB = e * b;
    const mu5 = (edotB * 0.055 * regimeBoost) / (k + 0.2);
    this.state.chiralChemicalPotentialMev = parseFloat(mu5.toFixed(1));

    // 軸向無耗散電導率 σ_axial ∝ e² μ_5 / (4π² ħ v_F)
    const sigma = Math.min(250.0, Math.max(5.0, mu5 * 1.6 + b * 4.2));
    this.state.axialConductivityMs = parseFloat(sigma.toFixed(1));

    // 費米弧長度 (nm) ∝ 2π / 2k_0
    this.state.fermiArcLengthNm = parseFloat((2.5 + k * 1.8).toFixed(2));
  }

  /**
   * 觸發手性電荷反常泵浦脈衝 (Trigger Chiral Pumping)
   */
  public triggerChiralPump(): ChiralPumpingEvent {
    this.recomputeAnomalyDynamics();
    const edotB = this.state.electricFieldVPerM * this.state.magneticFieldTesla;
    const currentAmp = parseFloat(((this.state.axialConductivityMs * 0.12) * (0.95 + Math.random() * 0.1)).toFixed(2));

    const event: ChiralPumpingEvent = {
      id: `chiral-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      electricFieldVPerM: this.state.electricFieldVPerM,
      magneticFieldTesla: this.state.magneticFieldTesla,
      edotBProduct: edotB,
      chiralChemicalPotentialMev: this.state.chiralChemicalPotentialMev,
      axialCurrentDensityAmp: currentAmp,
      timestamp: Date.now()
    };

    this.state.pumpingHistory.unshift(event);
    if (this.state.pumpingHistory.length > 20) {
      this.state.pumpingHistory.pop();
    }

    this.state.totalPumpingEventsCount++;
    this.state.chiralEnergyFlux += 64.0 * (1.0 + currentAmp * 0.05);

    this.playChiralDualSlide();
    this.saveState();
    return event;
  }

  /**
   * 觸發超對稱超對偶相變增益
   */
  public triggerSupersymmetricBoost(): void {
    this.state.chiralEnergyFlux += 180.0;
    this.state.magneticFieldTesla = 12.0; // 強磁場共振
    this.recomputeAnomalyDynamics();
    this.playBerryMonopoleTone();
    this.saveState();
  }

  public update(delta: number): void {
    if (this.state.autoPumping) {
      this.state.chiralEnergyFlux += delta * (0.95 + this.state.axialConductivityMs * 0.012);
    }
  }

  // --- 純代碼 Web Audio 程序化合成 ---

  private playChiralDualSlide(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      // 雙手性外爾錐相反滑音 (左升頻、右降頻)
      const oscLeft = this.audioCtx.createOscillator();
      const oscRight = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscLeft.type = 'sawtooth';
      oscRight.type = 'sine';

      oscLeft.frequency.setValueAtTime(260.0, now);
      oscLeft.frequency.exponentialRampToValueAtTime(780.0, now + 0.22); // 左手性上升

      oscRight.frequency.setValueAtTime(780.0, now);
      oscRight.frequency.exponentialRampToValueAtTime(260.0, now + 0.22); // 右手性下降

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      oscLeft.connect(gain);
      oscRight.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscLeft.start(now);
      oscRight.start(now);
      oscLeft.stop(now + 0.28);
      oscRight.stop(now + 0.28);
    } catch {
      // 容錯靜音
    }
  }

  private playBerryMonopoleTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // 貝里曲率單極子諧振純音
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.linearRampToValueAtTime(880.0, now + 0.15); // A5

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
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

export const weylChiralEngine = new WeylChiralAnomalyEngine();
