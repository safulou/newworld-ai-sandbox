/**
 * 超弦 D-膜重聯幾何與狄拉克-玻恩-英費爾德非線性真空反應堆
 * (D-Brane Reconnection & Dirac-Born-Infeld Nonlinear Vacuum Engine)
 *
 * 核心物理理論：
 * 1. 狄拉克-玻恩-英費爾德 (Dirac-Born-Infeld, DBI) 非線性電動力學作用量：
 *    開弦端點錨定在 Dp-膜上，膜上規範場運動由 DBI 作用量嚴格支配：
 *    S_{\text{DBI}} = -T_p \int d^{p+1}\sigma \sqrt{-\det(g_{\mu\nu} + 2\pi\alpha' F_{\mu\nu})}，
 *    式中存在絕對的玻恩-英費爾德臨界電磁場極限 E_{\text{crit}} = \frac{1}{2\pi\alpha'}。
 *    任何外加電場皆無法超越 E_{\text{crit}}，防止點電荷自能發散並自然消除因果律超光速異常。
 * 2. 開弦快子凝聚與 D-膜幾何重聯 (Tachyon Condensation & Brane Reconnection)：
 *    當兩張平行 D-膜間距 d 靠攏至普朗克弦長尺度 d < \ell_s = \sqrt{\alpha'} 時，
 *    連接兩膜的伸展微觀開弦最低能模之質量平方變為負值：
 *    m_{\text{tachyon}}^2 = -\frac{1}{2\alpha'} + \frac{d^2}{(2\pi\alpha')^2} < 0。
 *    快子場失穩自發滾向真真空勢阱，驅動兩張分離膜局部熔接，形成平滑的膜重聯幾何喉管 (Brane Throat Neck)。
 * 3. 膜-反膜湮滅與閉弦輻射 (Brane-Antibrane Annihilation)：
 *    D-膜與反 D-膜接觸時釋放所有潛在膜張力能量 T_p，快子凝聚使拓撲膜荷相互抵消，
 *    全部膜物質完全轉化為無質量的閉弦重力子與膨脹子輻射爆發。
 * 4. 膜世界宇宙暴脹 (Brane Inflation)：
 *    在相交膜幾何中，弱卡西米爾引力相互作用勢能 V(d) 提供平坦慢滾勢能，
 *    膜間距逐漸縮減扮演宇宙暴脹子 (Inflaton)，直至膜重聯碰撞終止暴脹並重加熱宇宙。
 */

export type DBraneRegime =
  | 'dbi-critical-field-saturation'       // DBI 非線性極限臨界場飽和相 (E -> E_crit)
  | 'tachyon-condensation-brane-reconnection' // 快子凝聚膜幾何重聯喉管相 (d < \ell_s)
  | 'intersecting-brane-flux-compactification' // 相交 D-膜通量緊緻化穩定相
  | 'free-asymptotic-brane-propagation';   // 自由漸近膜空間漂移平庸相 (d >> \ell_s)

export interface DBraneDBIState {
  interBraneDistanceStringUnits: number;  // 膜間距 d / \ell_s (0.1 ~ 8.0)
  worldvolumeElectricFieldRatio: number;  // 膜上電場比值 E / E_crit (0.0 ~ 0.99)
  stringCouplingConstantGs: number;       // 弦耦合常數 g_s (0.01 ~ 1.5)
  braneTensionTpScaleGev4: number;        // 膜張力 T_p (10^16 GeV^4, 1.0 ~ 20.0)
  regime: DBraneRegime;

  // 動態演算物理指標
  tachyonMassSquaredNegative: number;     // 快子質量平方 m^2 (\alpha'⁻¹ 單位，負值為快子)
  dbiSquareRootFactor: number;            // DBI 根號因子 \sqrt{1 - (E/E_crit)^2}
  reconnectionThroatRadiusLs: number;     // 重聯幾何喉管半徑 r_throat (\ell_s)
  casimirInteractionForceN: number;       // 膜間卡西米爾相互吸引力 (10^28 N)
  closedStringRadiationPower: number;     // 閉弦引力輻射功率 P_rad (10^32 W)
  telemetryHistory: Array<{
    timestamp: number;
    tachyonM2: number;
    dbiFactor: number;
    throatRadius: number;
  }>;
}

const STORAGE_KEY = 'newworld_d_brane_dbi_nonlinear_vacuum_state_v1';

class DBraneDBINonlinearVacuumEngine {
  private state: DBraneDBIState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): DBraneDBIState {
    return {
      interBraneDistanceStringUnits: 0.65, // 小於 1.0 觸發快子
      worldvolumeElectricFieldRatio: 0.82,
      stringCouplingConstantGs: 0.25,
      braneTensionTpScaleGev4: 8.5,
      regime: 'tachyon-condensation-brane-reconnection',
      tachyonMassSquaredNegative: -0.42,
      dbiSquareRootFactor: 0.572,
      reconnectionThroatRadiusLs: 1.28,
      casimirInteractionForceN: 42.6,
      closedStringRadiationPower: 18.4,
      telemetryHistory: []
    };
  }

  private loadState(): DBraneDBIState {
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

  public getState(): DBraneDBIState {
    return { ...this.state };
  }

  private recalculatePhysics(): void {
    const s = this.state;

    // 1. 開弦質量平方 m^2 = -0.5 + (d / 2\pi)^2
    const m2 = -0.5 + Math.pow(s.interBraneDistanceStringUnits / (2 * Math.PI), 2) * 2.0;
    s.tachyonMassSquaredNegative = Number(m2.toFixed(3));

    // 2. DBI 因子 \sqrt{1 - (E / E_crit)^2}
    const eRatio = Math.min(0.999, s.worldvolumeElectricFieldRatio);
    s.dbiSquareRootFactor = Number(Math.sqrt(Math.max(0.001, 1.0 - eRatio * eRatio)).toFixed(3));

    // 3. 重聯喉管半徑：當 m^2 < 0 時由快子真空期望值決定
    if (s.tachyonMassSquaredNegative < 0) {
      const throat = Math.sqrt(-s.tachyonMassSquaredNegative) * 2.0 / (s.stringCouplingConstantGs + 0.1);
      s.reconnectionThroatRadiusLs = Number(Math.min(5.0, throat).toFixed(2));
    } else {
      s.reconnectionThroatRadiusLs = 0.0;
    }

    // 4. 膜間引力-拉蒙德相互作用力 F \propto T_p / d^4
    const invD4 = 1.0 / Math.pow(Math.max(0.2, s.interBraneDistanceStringUnits), 3);
    s.casimirInteractionForceN = Number((s.braneTensionTpScaleGev4 * invD4 * 1.8).toFixed(1));

    // 5. 閉弦重力輻射功率
    s.closedStringRadiationPower = Number((s.reconnectionThroatRadiusLs * s.braneTensionTpScaleGev4 * 0.95 * s.stringCouplingConstantGs).toFixed(1));

    // 狀態判定
    if (s.worldvolumeElectricFieldRatio > 0.90) {
      s.regime = 'dbi-critical-field-saturation';
    } else if (s.tachyonMassSquaredNegative < -0.1) {
      s.regime = 'tachyon-condensation-brane-reconnection';
    } else if (s.interBraneDistanceStringUnits <= 2.5) {
      s.regime = 'intersecting-brane-flux-compactification';
    } else {
      s.regime = 'free-asymptotic-brane-propagation';
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
        tachyonM2: this.state.tachyonMassSquaredNegative,
        dbiFactor: this.state.dbiSquareRootFactor,
        throatRadius: this.state.reconnectionThroatRadiusLs
      });
      if (this.state.telemetryHistory.length > 20) {
        this.state.telemetryHistory.shift();
      }
      this.saveState();
    }
  }

  // --- 互動方法 ---

  public adjustInterBraneDistance(deltaD: number): void {
    this.state.interBraneDistanceStringUnits = Number(Math.max(0.1, Math.min(8.0, this.state.interBraneDistanceStringUnits + deltaD)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(380, 620, 0.18, 'sine');
  }

  public rampElectricFieldRatio(deltaE: number): void {
    this.state.worldvolumeElectricFieldRatio = Number(Math.max(0.0, Math.min(0.99, this.state.worldvolumeElectricFieldRatio + deltaE)).toFixed(2));
    this.recalculatePhysics();
    this.playTone(520, 940, 0.22, 'sawtooth');
  }

  public triggerTachyonCondensationCollapse(): void {
    // 激發快子凝聚瞬態塌陷
    this.state.interBraneDistanceStringUnits = 0.25;
    this.state.worldvolumeElectricFieldRatio = 0.94;
    this.recalculatePhysics();
    this.playTone(650, 1400, 0.35, 'square');
  }

  public decoupleBraneSeparation(): void {
    // 拉遠至自由傳播膜
    this.state.interBraneDistanceStringUnits = 4.5;
    this.state.worldvolumeElectricFieldRatio = 0.3;
    this.recalculatePhysics();
    this.playTone(420, 260, 0.2, 'triangle');
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

export const dBraneDBIEngine = new DBraneDBINonlinearVacuumEngine();
export const dBraneEngine = dBraneDBIEngine;
