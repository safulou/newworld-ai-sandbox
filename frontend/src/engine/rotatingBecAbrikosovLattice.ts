/**
 * 🌀 旋轉玻色-愛因斯坦凝聚量子渦旋晶格與阿布里科索夫幾何相變引擎
 * Rotating Bose-Einstein Condensate Abrikosov Vortex Lattice Engine
 *
 * 理論物理基礎：
 * 1. 旋轉坐標系 Gross-Pitaevskii (GPE) 與有效規範場：
 *    在以角速度 $\mathbf{\Omega} = \Omega \hat{\mathbf{z}}$ 旋轉的參考系中，
 *    科氏力引入等效規範場勢 $\mathbf{A}_{\text{eff}} = \mathbf{\Omega} \times \mathbf{r}$，
 *    等價於荷電粒子在均勻有效垂直磁場 $B_{\text{eff}} = 2m\Omega$ 下的運動。
 * 2. 費曼渦旋密度定理 (Feynman's Relation)：
 *    當角速度超過第一臨界頻率 $\Omega > \Omega_{c1} = \frac{5\hbar}{2m R_\perp^2}\ln(R_\perp/\xi)$ 時，
 *    單量子化環量渦旋線（環量 $\kappa = h/m$）自發湧入凝聚體，渦旋面密度為：
 *    n_v = \frac{m \Omega}{\pi \hbar}
 * 3. 阿布里科索夫三角六角晶格 (Triangular Abrikosov Vortex Lattice)：
 *    渦旋線之間具有對數排斥相互作用 $U(r) \propto -\ln(r/\xi)$，在快速旋轉極限自組織形成能量最低之六角晶格；
 *    六角晶胞面積 $A_{\text{cell}} = \frac{\sqrt{3}}{2} b^2 = \frac{1}{n_v}$，晶格常數 $b = \sqrt{\frac{2}{\sqrt{3} n_v}}$。
 * 4. 剪切彈性 Tkachenko 模式 (Tkachenko Shear Waves)：
 *    渦旋六角晶格具有非零剪切彈性模量 $C_4 \approx \frac{1}{8}\rho_s \kappa \Omega$；
 *    橫向 Tkachenko 彈性波色散為 $\omega_T = v_T k$，其中長波聲速為：
 *    v_T = \frac{1}{2}\sqrt{\frac{\hbar \Omega}{m}}
 */

export type RotatingBecRegime =
  | 'subcritical-irrotational-superfluid'   // 亞臨界無旋超流體相 (Ω < Ω_c1, 凝聚體表面橢圓變形, 零渦旋)
  | 'sparse-few-vortex-precession'         // 稀疏量子渦旋進動相 (Ω_c1 ≤ Ω < Ω_c2, 2~6 個渦旋對稱進動)
  | 'triangular-abrikosov-lattice-crystalline' // 阿布里科索夫六角三角渦旋晶格相 (密集六角晶陣, 穩態 Tkachenko 波)
  | 'lowest-landau-level-quantum-hall-smectic'; // 最低朗道能級近晶液晶熔化相 (Ω ≈ ω_perp, 遠心離心破缺與量子霍爾微滴)

export interface VortexCoordinate {
  x: number; // 歸一化半徑 (-1.0 ~ 1.0)
  y: number; // 歸一化半徑 (-1.0 ~ 1.0)
  phase: number; // 旋轉動態相位
}

export interface RotatingBecState {
  rotationFrequencyOmegaRadS: number;      // 旋轉角速度 Ω (rad/s, 0.0 ~ 250.0)
  trapFrequencyOmegaPerpRadS: number;      // 橫向磁光阱頻率 \omega_\perp (rad/s, 100.0 ~ 300.0)
  atomNumber10_5: number;                  // 玻色凝聚原子數 N (10^5 顆, 0.5 ~ 10.0)
  scatteringLengthBohrA0: number;          // s-波散射長度 a_s (Bohr a_0, 10.0 ~ 200.0)
  regime: RotatingBecRegime;

  // 動態演算物理指標
  vortexCount: number;                     // 凝聚體內部量子化渦旋總數 N_v
  feynmanVortexDensityPerMm2: number;      // 費曼渦旋密度 n_v (mm^-2)
  tkachenkoWaveSpeedMmS: number;           // Tkachenko 橫向剪切波速 v_T (mm/s)
  healingLengthMicron: number;             // 渦旋核芯癒合長度 \xi (\mu m)
  abrikosovLatticeConstantMicron: number;  // 六角晶格常數 b (\mu m)
  condensateRadiusMicron: number;          // 托馬斯-費米橫向半徑 R_\perp (\mu m)
  accumulatedRotationRevolutions: number;  // 累計旋轉圈數
  vortexPositions: VortexCoordinate[];     // 晶格渦旋坐標列表
}

const STORAGE_KEY = 'newworld_rotating_bec_abrikosov_state_v1';
const PLANCK_HBAR = 1.054571817e-34;
const ATOM_MASS_RB87 = 1.443160648e-25; // 銣-87 質量 (kg)

class RotatingBecAbrikosovEngine {
  private state: RotatingBecState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recalculatePhysics();
  }

  private getDefaultState(): RotatingBecState {
    return {
      rotationFrequencyOmegaRadS: 145.0,
      trapFrequencyOmegaPerpRadS: 180.0,
      atomNumber10_5: 3.5,
      scatteringLengthBohrA0: 100.0,
      regime: 'triangular-abrikosov-lattice-crystalline',
      vortexCount: 37,
      feynmanVortexDensityPerMm2: 125.0,
      tkachenkoWaveSpeedMmS: 2.85,
      healingLengthMicron: 0.28,
      abrikosovLatticeConstantMicron: 3.05,
      condensateRadiusMicron: 22.5,
      accumulatedRotationRevolutions: 0,
      vortexPositions: []
    };
  }

  private loadState(): RotatingBecState {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.getDefaultState(),
            ...parsed,
            vortexPositions: Array.isArray(parsed.vortexPositions) ? parsed.vortexPositions : []
          };
        }
      }
    } catch (e) {
      console.warn('[RotatingBecEngine] 載入存檔失敗，使用初始狀態', e);
    }
    return this.getDefaultState();
  }

  public saveState(): void {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
    } catch (e) {
      console.warn('[RotatingBecEngine] 儲存失敗', e);
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
   * 播放量子渦旋成核脈衝 (Vortex Nucleation Pulse)
   */
  public playVortexNucleationPulse(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1280, ctx.currentTime + 0.16);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      console.warn('[RotatingBecEngine] 音效播放異常', e);
    }
  }

  /**
   * 播放 Tkachenko 橫向剪切波彈性共鳴 (Tkachenko Shear Mode Drone)
   */
  public playTkachenkoDrone(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('[RotatingBecEngine] 音效播放異常', e);
    }
  }

  /**
   * 核心物理演算：計算費曼渦旋密度、阿布里科索夫六角晶格與 Tkachenko 橫波
   */
  public recalculatePhysics(): void {
    const Omega = Math.max(0.0, this.state.rotationFrequencyOmegaRadS);
    const OmegaPerp = Math.max(50.0, this.state.trapFrequencyOmegaPerpRadS);
    const N = Math.max(0.2, this.state.atomNumber10_5) * 1e5;
    const aS = Math.max(5.0, this.state.scatteringLengthBohrA0) * 5.29177e-11;

    // 1. 托馬斯-費米橫向半徑 R_\perp = sqrt(2 \mu / m \omega_\perp^2)
    const effectiveOmegaSq = Math.max(10.0, OmegaPerp * OmegaPerp - Omega * Omega);
    const effOmega = Math.sqrt(effectiveOmegaSq);
    const aHo = Math.sqrt(PLANCK_HBAR / (ATOM_MASS_RB87 * OmegaPerp));
    const rTf = aHo * Math.pow(15.0 * N * aS / aHo, 0.2) * (OmegaPerp / effOmega);
    const rTfMicron = Math.min(60.0, Math.max(5.0, rTf * 1e6));
    this.state.condensateRadiusMicron = Number(rTfMicron.toFixed(1));

    // 2. 癒合長度 \xi = \hbar / \sqrt{2 m n_0 g}
    const xi = aHo * Math.pow(15.0 * N * aS / aHo, -0.2);
    const xiMicron = Math.min(2.0, Math.max(0.05, xi * 1e6));
    this.state.healingLengthMicron = Number(xiMicron.toFixed(2));

    // 3. 第一臨界頻率 \Omega_{c1}
    const omegaC1 = (5.0 * PLANCK_HBAR / (2.0 * ATOM_MASS_RB87 * rTf * rTf)) * Math.log(rTf / xi);
    const ratio = Omega / OmegaPerp;

    // 4. 費曼渦旋密度 n_v = m \Omega / (\pi \hbar) (m^-2) -> mm^-2
    let nvMm2 = 0.0;
    if (Omega > omegaC1) {
      const nv = (ATOM_MASS_RB87 * Omega) / (Math.PI * PLANCK_HBAR);
      nvMm2 = nv * 1e-6;
    }
    this.state.feynmanVortexDensityPerMm2 = Number(nvMm2.toFixed(1));

    // 5. 渦旋總數 N_v = \pi R_\perp^2 n_v
    const areaMm2 = Math.PI * (rTfMicron * 1e-3) * (rTfMicron * 1e-3);
    const count = Math.max(0, Math.round(areaMm2 * nvMm2));
    this.state.vortexCount = count;

    // 6. Tkachenko 剪切波速 v_T = 0.5 * \sqrt{\hbar \Omega / m} (m/s) -> mm/s
    const vT = 0.5 * Math.sqrt((PLANCK_HBAR * Omega) / ATOM_MASS_RB87);
    this.state.tkachenkoWaveSpeedMmS = Number((vT * 1e3).toFixed(2));

    // 7. 阿布里科索夫晶格常數 b = sqrt(2 / (sqrt(3) * n_v))
    let bMicron = 0.0;
    if (nvMm2 > 0.1) {
      const bM = Math.sqrt(2.0 / (Math.sqrt(3.0) * (nvMm2 * 1e6)));
      bMicron = bM * 1e6;
    }
    this.state.abrikosovLatticeConstantMicron = Number(bMicron.toFixed(2));

    // 8. 生成六角三角渦旋坐標點陣 (阿布里科索夫幾何排列)
    const positions: VortexCoordinate[] = [];
    if (count > 0) {
      positions.push({ x: 0, y: 0, phase: 0 }); // 中心渦旋
      let shell = 1;
      let placed = 1;
      const scale = Math.min(0.85, (bMicron / rTfMicron) * 0.9);

      while (placed < Math.min(61, count)) {
        const shellCount = 6 * shell;
        for (let s = 0; s < shellCount && placed < Math.min(61, count); s++) {
          const angle = (2.0 * Math.PI * s) / shellCount;
          const rNorm = shell * scale;
          if (rNorm <= 0.92) {
            positions.push({
              x: Number((rNorm * Math.cos(angle)).toFixed(3)),
              y: Number((rNorm * Math.sin(angle)).toFixed(3)),
              phase: Number(angle.toFixed(2))
            });
            placed++;
          }
        }
        shell++;
        if (shell > 6) break;
      }
    }
    this.state.vortexPositions = positions;

    // 9. 相態判定
    if (Omega < omegaC1) {
      this.state.regime = 'subcritical-irrotational-superfluid';
    } else if (count <= 7) {
      this.state.regime = 'sparse-few-vortex-precession';
    } else if (ratio > 0.95) {
      this.state.regime = 'lowest-landau-level-quantum-hall-smectic';
    } else {
      this.state.regime = 'triangular-abrikosov-lattice-crystalline';
    }
  }

  public update(deltaSeconds: number): void {
    if (this.state.rotationFrequencyOmegaRadS > 10.0) {
      const revsPerSec = this.state.rotationFrequencyOmegaRadS / (2.0 * Math.PI);
      this.state.accumulatedRotationRevolutions += Math.floor(revsPerSec * deltaSeconds * 5);
    }
  }

  // --- 操作控制 API ---

  public setRotationFrequency(omega: number): void {
    this.state.rotationFrequencyOmegaRadS = Math.max(0.0, Math.min(250.0, omega));
    this.recalculatePhysics();
    this.saveState();
  }

  public setTrapFrequency(omegaPerp: number): void {
    this.state.trapFrequencyOmegaPerpRadS = Math.max(100.0, Math.min(300.0, omegaPerp));
    this.recalculatePhysics();
    this.saveState();
  }

  public setAtomNumber(n10_5: number): void {
    this.state.atomNumber10_5 = Math.max(0.5, Math.min(10.0, n10_5));
    this.recalculatePhysics();
    this.saveState();
  }

  public setScatteringLength(a0: number): void {
    this.state.scatteringLengthBohrA0 = Math.max(10.0, Math.min(200.0, a0));
    this.recalculatePhysics();
    this.saveState();
  }

  /**
   * 觸發阿布里科索夫六角渦旋晶格結晶 (Trigger Lattice Crystallization)
   */
  public triggerLatticeCrystallization(): void {
    this.state.rotationFrequencyOmegaRadS = 155.0;
    this.state.trapFrequencyOmegaPerpRadS = 180.0;
    this.state.atomNumber10_5 = 4.0;
    this.state.regime = 'triangular-abrikosov-lattice-crystalline';
    this.recalculatePhysics();
    this.playVortexNucleationPulse();
    this.playTkachenkoDrone();
    this.saveState();
  }

  public cycleRegime(): void {
    const regimes: RotatingBecRegime[] = [
      'subcritical-irrotational-superfluid',
      'sparse-few-vortex-precession',
      'triangular-abrikosov-lattice-crystalline',
      'lowest-landau-level-quantum-hall-smectic'
    ];
    const currentIndex = regimes.indexOf(this.state.regime);
    const nextRegime = regimes[(currentIndex + 1) % regimes.length];

    if (nextRegime === 'subcritical-irrotational-superfluid') {
      this.state.rotationFrequencyOmegaRadS = 15.0;
      this.playTkachenkoDrone();
    } else if (nextRegime === 'sparse-few-vortex-precession') {
      this.state.rotationFrequencyOmegaRadS = 55.0;
      this.playVortexNucleationPulse();
    } else if (nextRegime === 'triangular-abrikosov-lattice-crystalline') {
      this.triggerLatticeCrystallization();
      return;
    } else {
      this.state.rotationFrequencyOmegaRadS = 175.0;
      this.state.trapFrequencyOmegaPerpRadS = 180.0; // Ω ≈ \omega_\perp
      this.playVortexNucleationPulse();
      this.playTkachenkoDrone();
    }

    this.recalculatePhysics();
    this.saveState();
  }

  public reset(): void {
    this.state = this.getDefaultState();
    this.recalculatePhysics();
    this.saveState();
  }

  public getState(): Readonly<RotatingBecState> {
    return this.state;
  }
}

export const rotatingBecEngine = new RotatingBecAbrikosovEngine();
