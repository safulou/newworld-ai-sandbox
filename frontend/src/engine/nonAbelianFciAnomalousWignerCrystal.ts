/**
 * 非阿貝爾分數陳絕緣體與時間反演奇宇稱任意子維格納晶體引擎
 * (Non-Abelian Fractional Chern Insulator & Anomalous Hall Anyon Wigner Crystal Engine)
 *
 * 物理原理：
 * 1. 在高階莫爾平帶異質結 (如扭轉雙層 MoTe2 第二莫爾微能帶或菱方多層石墨烯，其量子幾何張量與貝里曲率完美模擬第一激發朗道能階
 *    n = 1 Landau Level) 中，零外加磁場下半整數填充 \nu = 1/2 (或 \nu = 3/2) 的強庫侖相互作用自發凝聚為
 *    「非阿貝爾分數陳絕緣體」(Non-Abelian Fractional Chern Insulator, Moore-Read Pfaffian State)，
 *    在環面幾何上具有 6 重拓撲基態簡併 (GSD = 6) 與半整數手性熱霍爾電導 \kappa_{xy} = (3/2) \kappa_0。
 * 2. 當莫爾超晶格勢能調變或長程庫侖排斥比 r_s = E_{Coulomb} / E_{kin} 進一步升高時，系統發生向「反常霍爾維格納晶體」
 *    (Anomalous Hall Wigner Crystal, AHWC，同時破缺平移對稱並保有非零整數陳數 C = 1) 或「任意子維格納超固體」
 *    (Anyon Wigner Supersolid，e/4 非阿貝爾任意子鑲嵌於三角電荷晶格中) 的重入量子相變。
 */

export type NonAbelianFciWignerRegime =
  | 'second-miniband-moore-read-pfaffian-fci'
  | 'anyon-wigner-supersolid-coexistence'
  | 'reentrant-anomalous-hall-wigner-crystal'
  | 'composite-fermion-metallic-fermi-sea';

export interface MoireAnyonCrystalNode {
  id: number;
  x: number;
  y: number;
  siteExcitationType: 'pfaffian-e4-anyon' | 'anomalous-hall-wigner-site' | 'neutral-majorana-fermion';
  localBerryCurvatureDeviation: number;
  wignerBraggPeakIntensity: number;
  pfaffianPairingGapMeV: number;
}

export interface NonAbelianFciWignerState {
  coulombToBandwidthRatioRs: number;      // 長程庫侖與平帶寬度比 r_s = U_{Coulomb} / W_{band} (1.5 ~ 14.0)
  quantumMetricTraceExcess: number;       // 量子度規跡偏離理想 n=1 朗道能階指標 \delta \text{Tr}(g) (0.02 ~ 1.20)
  torusGroundStateDegeneracy: number;     // 環面拓撲基態簡併度 GSD (Pfaffian 為 6, AHWC 為 1, CF 為 2)
  halfIntegerThermalHallK0: number;       // 半整數手性熱霍爾電導比 \kappa_{xy} / \kappa_0 (1.50, 1.00, 0.50)
  wignerCrystalBraggOrder: number;        // 反常霍爾維格納晶體布拉格平移序參量 S(G_{Bragg}) (0.000 ~ 1.000)
  pfaffianNonAbelianGapMeV: number;       // 非阿貝爾 Moore-Read 配對拓撲能隙 \Delta_{Pf} (meV)
  activeRegime: NonAbelianFciWignerRegime;
  pulsePhase: number;
  crystalNodes: MoireAnyonCrystalNode[];
}

const STORAGE_KEY = 'newworld_non_abelian_fci_wigner_state_v1';

export class NonAbelianFciAnomalousWignerCrystalEngine {
  private state: NonAbelianFciWignerState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): NonAbelianFciWignerState {
    const defaults: NonAbelianFciWignerState = {
      coulombToBandwidthRatioRs: 5.8,
      quantumMetricTraceExcess: 0.16,
      torusGroundStateDegeneracy: 6,
      halfIntegerThermalHallK0: 1.50,
      wignerCrystalBraggOrder: 0.284,
      pfaffianNonAbelianGapMeV: 2.18,
      activeRegime: 'second-miniband-moore-read-pfaffian-fci',
      pulsePhase: 0,
      crystalNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Non-Abelian FCI Wigner Crystal state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Non-Abelian FCI Wigner Crystal state:', e);
      }
    }
  }

  public getState(): Readonly<NonAbelianFciWignerState> {
    return this.state;
  }

  public setCoulombToBandwidthRatio(rs: number): void {
    this.state.coulombToBandwidthRatioRs = Math.max(1.5, Math.min(14.0, parseFloat(rs.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setQuantumMetricTraceExcess(traceExcess: number): void {
    this.state.quantumMetricTraceExcess = Math.max(0.02, Math.min(1.20, parseFloat(traceExcess.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: NonAbelianFciWignerRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'second-miniband-moore-read-pfaffian-fci':
        this.state.coulombToBandwidthRatioRs = 5.8;
        this.state.quantumMetricTraceExcess = 0.14;
        break;
      case 'anyon-wigner-supersolid-coexistence':
        this.state.coulombToBandwidthRatioRs = 8.4;
        this.state.quantumMetricTraceExcess = 0.28;
        break;
      case 'reentrant-anomalous-hall-wigner-crystal':
        this.state.coulombToBandwidthRatioRs = 12.2;
        this.state.quantumMetricTraceExcess = 0.65;
        break;
      case 'composite-fermion-metallic-fermi-sea':
        this.state.coulombToBandwidthRatioRs = 2.4;
        this.state.quantumMetricTraceExcess = 0.85;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const rs = this.state.coulombToBandwidthRatioRs;
    const trDev = this.state.quantumMetricTraceExcess;

    // 理想 n=1 朗道能階全純幾何窗口 (trDev 小且 rs 在 4.0 ~ 9.0 之間) 最有利於 Moore-Read Pfaffian 非阿貝爾態
    const n1GeometryMatch = Math.exp(-trDev / 0.42);
    const pfaffianWindow = Math.exp(-Math.pow((rs - 6.2) / 3.2, 2));

    // 非阿貝爾 Pfaffian 能隙 \Delta_{Pf} (meV)
    const pfGap = 2.65 * n1GeometryMatch * pfaffianWindow;
    this.state.pfaffianNonAbelianGapMeV = parseFloat(Math.max(0.05, pfGap).toFixed(2));

    // 維格納晶體布拉格序參量 S(G_{Bragg})：隨長程庫侖比 r_s 跨越臨界點急劇上升
    const bragg = 1.0 / (1.0 + Math.exp(-(rs - 7.8) / 1.8));
    this.state.wignerCrystalBraggOrder = parseFloat(bragg.toFixed(3));

    // 環面拓撲基態簡併度 GSD 與半整數手性熱霍爾電導 \kappa_{xy} / \kappa_0
    if (this.state.pfaffianNonAbelianGapMeV > 0.85) {
      this.state.torusGroundStateDegeneracy = 6;
      this.state.halfIntegerThermalHallK0 = 1.50;
    } else if (bragg > 0.65) {
      this.state.torusGroundStateDegeneracy = 1;
      this.state.halfIntegerThermalHallK0 = 1.00;
    } else {
      this.state.torusGroundStateDegeneracy = 2;
      this.state.halfIntegerThermalHallK0 = 0.50;
    }

    // 生成 16 個三角莫爾超晶格上的 e/4 非阿貝爾任意子與反常霍爾維格納晶格節點
    const nodes: MoireAnyonCrystalNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let siteType: 'pfaffian-e4-anyon' | 'anomalous-hall-wigner-site' | 'neutral-majorana-fermion' = 'pfaffian-e4-anyon';
      if (bragg > 0.65 && i % 2 === 0) {
        siteType = 'anomalous-hall-wigner-site';
      } else if (i % 3 === 2) {
        siteType = 'neutral-majorana-fermion';
      }

      const row = Math.floor(i / 4);
      const col = i % 4;
      const hexOffset = (row % 2) * 26;
      const baseX = 72 + col * 54 + hexOffset;
      const baseY = 74 + row * 56;

      // 維格納晶體釘扎時熱運動振幅縮小，液態任意子態時軌道迴旋振幅較大
      const orbitR = 9.5 * (1.0 - 0.65 * bragg);
      const angle = this.state.pulsePhase * (siteType === 'neutral-majorana-fermion' ? -1.2 : 1.0) + i * 0.9;

      const x = baseX + orbitR * Math.cos(angle);
      const y = baseY + orbitR * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        siteExcitationType: siteType,
        localBerryCurvatureDeviation: trDev,
        wignerBraggPeakIntensity: this.state.wignerCrystalBraggOrder,
        pfaffianPairingGapMeV: this.state.pfaffianNonAbelianGapMeV
      });
    }
    this.state.crystalNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.74 + (this.state.pfaffianNonAbelianGapMeV / 3.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerNonAbelianFciWignerSound(): void {
    try {
      if (typeof window === 'undefined') return;
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const oscPfaffian = this.audioCtx.createOscillator();
      const oscWigner = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscPfaffian.type = 'sine';
      oscWigner.type = 'triangle';

      // 半整數熱霍爾 (3/2) 純五度諧音與維格納晶體聲子模共鳴
      const fBase = 280 + this.state.pfaffianNonAbelianGapMeV * 75;
      const fHalfInt = fBase * this.state.halfIntegerThermalHallK0;

      oscPfaffian.frequency.setValueAtTime(fBase, t);
      oscWigner.frequency.setValueAtTime(fHalfInt, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscPfaffian.connect(gain);
      oscWigner.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscPfaffian.start(t);
      oscWigner.start(t);
      oscPfaffian.stop(t + 0.58);
      oscWigner.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in NonAbelianFciAnomalousWignerCrystalEngine:', e);
    }
  }

  public reset(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    this.state = this.loadState();
    this.recomputePhysics();
  }
}

export const nonAbelianFciAnomalousWignerCrystalEngine = new NonAbelianFciAnomalousWignerCrystalEngine();
