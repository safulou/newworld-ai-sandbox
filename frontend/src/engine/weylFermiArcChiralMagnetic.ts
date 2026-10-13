/**
 * 外爾半金屬費米弧表面態與手性磁效應量子傳輸處理器
 * (Weyl Semimetal Fermi Arc Surface States & Chiral Magnetic Effect Processor)
 *
 * 核心物理理論：
 * 1. 外爾半金屬與拓撲外爾節點 (Weyl Nodes & Topological Monopoles)：
 *    在破缺空間反演或時間反演對稱之三維晶體中，導帶與價帶在動量空間孤立點線性相交 H(\mathbf{k}) = \pm \hbar v_F \boldsymbol{\sigma}\cdot\mathbf{k}。
 *    外爾節點充當動量空間之貝里曲率單極子 (Monopoles)，攜帶量子化手性拓撲荷 C = \pm 1。
 * 2. 開放費米弧表面態 (Fermi Arc Surface States)：
 *    體態非平庸陳數投射到二維表面布里淵區時，在正負手性外爾點投影之間湧現開放的非閉合「費米弧」。
 *    電子能在頂表面沿費米弧運動，透過體外爾點穿透整個晶體，再沿底表面費米弧返回，形成奇異非局域外爾軌道量子振盪。
 * 3. 量子手性反常 (Quantum Chiral Anomaly)：
 *    在外加平行電磁場 \mathbf{E}\cdot\mathbf{B} \neq 0 驅動下，量子反常打破單一手性費米子數守恆：
 *    \frac{d(n_R - n_L)}{dt} = \frac{e^2}{4\pi^2 \hbar^2 c} \mathbf{E}\cdot\mathbf{B} - \frac{n_R - n_L}{\tau_v}，
 *    在左右手性節點間建立非平衡軸向化學勢差 \mu_5 = \frac{1}{2}(\mu_R - \mu_L)。
 * 4. 手性磁效應 (Chiral Magnetic Effect, CME) 與負縱向磁阻：
 *    軸向化學勢觸發沿外加磁場方向流動的無耗散拓撲淨電流：
 *    \mathbf{J}_{\text{CME}} = \frac{e^2}{4\pi^2 \hbar^2} \mu_5 \mathbf{B}。
 *    此效應直接導致極具標誌性的負縱向磁阻 (Negative Longitudinal Magnetoresistance, LMR)，
 *    磁導率隨磁場平方拋物線暴漲 \Delta\sigma_{zz} \propto B^2。
 */

export type WeylRegime =
  | 'chiral-magnetic-effect-current'      // 手性磁效應無耗散拓撲淨電流相
  | 'fermi-arc-topological-transport'    // 表面費米弧非局域奇異軌道相
  | 'quantum-anomaly-charge-pumping'      // 平行電磁場量子手性反常激增態
  | 'trivial-dirac-gap-closure';          // 對稱性恢復外爾點湮滅平庸態

export interface WeylFermiArcState {
  weylNodeSeparationK0InvNm: number;      // 外爾節點動量間距 2k_0 (0.1 ~ 2.5 nm⁻¹)
  appliedParallelElectricEVPerM: number;  // 外加平行電場 E (0.1 ~ 50.0 ×10³ V/m)
  appliedParallelMagneticBTesla: number;  // 外加平行磁場 B (0.1 ~ 14.0 T)
  chiralRelaxationTimeTauPs: number;      // 谷間手性弛豫時間 \tau_v (1.0 ~ 50.0 ps)
  regime: WeylRegime;

  // 動態演算物理指標
  chiralChemicalPotentialMu5Mev: number;  // 軸向手性化學勢 \mu_5 (meV)
  chiralMagneticCurrentDensityMAcm2: number; // CME 電流密度 J_CME (mA/cm²)
  fermiArcArcLengthInvNm: number;         // 表面費米弧長度 L_arc (nm⁻¹)
  negativeMagnetoresistanceDeltaSigma: number; // 負縱向磁阻電導增益率 (%)
  quantumOscillationFrequencyTesla: number; // 費米弧外爾軌道量子振盪頻率 F_arc (T)
  telemetryHistory: Array<{
    timestamp: number;
    mu5: number;
    jCME: number;
    nmrRatio: number;
  }>;
}

const STORAGE_KEY = 'newworld_weyl_fermi_arc_chiral_magnetic_state_v1';

class WeylFermiArcChiralMagneticEngine {
  private state: WeylFermiArcState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): WeylFermiArcState {
    return {
      weylNodeSeparationK0InvNm: 1.45,
      appliedParallelElectricEVPerM: 12.0,
      appliedParallelMagneticBTesla: 6.5,
      chiralRelaxationTimeTauPs: 18.0,
      regime: 'chiral-magnetic-effect-current',
      chiralChemicalPotentialMu5Mev: 24.8,
      chiralMagneticCurrentDensityMAcm2: 385.2,
      fermiArcArcLengthInvNm: 1.45,
      negativeMagnetoresistanceDeltaSigma: 68.5,
      quantumOscillationFrequencyTesla: 142.0,
      telemetryHistory: []
    };
  }

  private loadState(): WeylFermiArcState {
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

  public getState(): WeylFermiArcState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;

    // 1. 軸向手性化學勢 \mu_5 \propto E * B * \tau_v
    const rawMu5 = (s.appliedParallelElectricEVPerM / 10.0) * (s.appliedParallelMagneticBTesla / 5.0) * (s.chiralRelaxationTimeTauPs / 10.0) * 15.8;
    s.chiralChemicalPotentialMu5Mev = Number(rawMu5.toFixed(2));

    // 2. CME 電流密度 J_CME \propto \mu_5 * B (mA/cm²)
    const rawJCME = s.chiralChemicalPotentialMu5Mev * s.appliedParallelMagneticBTesla * 2.38;
    s.chiralMagneticCurrentDensityMAcm2 = Number(rawJCME.toFixed(1));

    // 3. 表面費米弧長度 L_arc = 2 * k_0
    s.fermiArcArcLengthInvNm = Number(s.weylNodeSeparationK0InvNm.toFixed(2));

    // 4. 負縱向磁阻增益率 \Delta\sigma / \sigma_0 \propto B^2
    const lmr = (s.appliedParallelMagneticBTesla * s.appliedParallelMagneticBTesla * 1.62) * (s.appliedParallelElectricEVPerM > 1.0 ? 1.0 : 0.2);
    s.negativeMagnetoresistanceDeltaSigma = Number(Math.min(999.0, lmr).toFixed(1));

    // 5. 費米弧外爾軌道量子振盪頻率 F_arc \propto k_0 * k_F
    s.quantumOscillationFrequencyTesla = Number((s.weylNodeSeparationK0InvNm * 98.0).toFixed(1));

    // 狀態判定
    if (s.chiralMagneticCurrentDensityMAcm2 > 250.0 && s.chiralChemicalPotentialMu5Mev > 15.0) {
      s.regime = 'chiral-magnetic-effect-current';
    } else if (s.appliedParallelElectricEVPerM > 25.0) {
      s.regime = 'quantum-anomaly-charge-pumping';
    } else if (s.weylNodeSeparationK0InvNm > 0.8) {
      s.regime = 'fermi-arc-topological-transport';
    } else {
      s.regime = 'trivial-dirac-gap-closure';
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
        mu5: this.state.chiralChemicalPotentialMu5Mev,
        jCME: this.state.chiralMagneticCurrentDensityMAcm2,
        nmrRatio: this.state.negativeMagnetoresistanceDeltaSigma
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public rampParallelElectricField(deltaE: number): void {
    this.state.appliedParallelElectricEVPerM = Number(Math.max(0.1, Math.min(50.0, this.state.appliedParallelElectricEVPerM + deltaE)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(480, 820, 0.18, 'sawtooth');
  }

  public sweepParallelMagneticField(deltaB: number): void {
    this.state.appliedParallelMagneticBTesla = Number(Math.max(0.1, Math.min(14.0, this.state.appliedParallelMagneticBTesla + deltaB)).toFixed(1));
    this.recalculatePhysics();
    this.playTone(400, 680, 0.16, 'sine');
  }

  public adjustWeylNodeSeparation(deltaK0: number): void {
    this.state.weylNodeSeparationK0InvNm = Number(Math.max(0.1, Math.min(2.5, this.state.weylNodeSeparationK0InvNm + deltaK0)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(520, 780, 0.18, 'triangle');
  }

  public triggerChiralAnomalyBurst(): void {
    // 激發強手性反常脈衝
    this.state.appliedParallelElectricEVPerM = 35.0;
    this.state.appliedParallelMagneticBTesla = 11.5;
    this.state.chiralRelaxationTimeTauPs = 30.0;
    this.recalculatePhysics();
    this.playTone(600, 1300, 0.32, 'square');
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

export const weylFermiArcEngine = new WeylFermiArcChiralMagneticEngine();
export const weylChiralEngine = weylFermiArcEngine;
