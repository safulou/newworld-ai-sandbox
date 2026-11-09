/**
 * 超冷里德堡分子宏觀三葉蟲雙極子與玻色極化子束縛晶格引擎
 * (Ultra-Long-Range Rydberg Trilobite Macrodimer & Bose Polaron Shell Lattice Engine)
 *
 * 物理原理：
 * 1. 根據 Greene-Dickinson-Sadeghpour 費米贗勢理論 (Fermi Pseudopotential)，當主量子數極高 (n \sim 35 - 100)
 *    之里德堡電子的慢速波函數與處於基態之背景超冷原子發生低能 s-波與 p-波散射時：
 *    V_{Fermi}(\mathbf{r} - \mathbf{R}) = (2\pi \hbar^2 / m_e) a_s(k) \delta^{(3)}(\mathbf{r} - \mathbf{R})
 *    + (6\pi \hbar^2 / m_e) a_p^3(k) \overleftarrow{\nabla} \delta^{(3)}(\mathbf{r} - \mathbf{R}) \overrightarrow{\nabla}。
 * 2. 高角動量簡併里德堡流形 (l \ge 3) 的相干疊加形成電子機率密度酷似遠古三葉蟲化石之「超長程三葉蟲里德堡分子」
 *    (Trilobite Rydberg Molecule)，鍵長高達數千玻爾半徑 (R_{eq} \sim 1000 - 3000 a_0)，並突破對稱限制擁有高達數千德拜
 *    (Kilodebye, d_{dip} \sim 1000 - 3200 Debye) 之巨型永久電偶極矩；而 p-波形狀共振則誘導「蝴蝶態分子」(Butterfly State)。
 * 3. 當將里德堡雜質激發於玻色-愛因斯坦凝聚體 (BEC) 中時，單一里德堡電子軌道內可同時束縛 N_{bound} \sim 5 - 50 個背景玻色子，
 *    形成「里德堡玻色極化子」(Rydberg Bose Polaron) 與離散多體分子殼層譜。
 */

export type RydbergTrilobiteRegime =
  | 'high-l-trilobite-kilodebye-macrodimer'
  | 'p-wave-shape-resonance-butterfly-state'
  | 'many-body-rydberg-bose-polaron-shell'
  | 'dipole-aligned-trilobite-chain-crystal';

export interface TrilobiteWavefunctionLobeNode {
  id: number;
  x: number;
  y: number;
  orbitalCharacter: 'trilobite-nodal-lobe' | 'butterfly-pwave-wing' | 'trapped-bec-boson';
  electronDensityProbability: number;
  localDipoleDebye: number;
  fermiPotentialDepthMHz: number;
}

export interface RydbergTrilobitePolaronState {
  principalQuantumNumberN: number;        // 里德堡主量子數 n (35 ~ 95)
  becBackgroundDensityLogCm3: number;     // 超冷 BEC 背景原子數密度對數 log10(n_{BEC} / cm^{-3}) (12.0 ~ 15.2)
  permanentDipoleMomentDebye: number;     // 三葉蟲分子巨型永久電偶極矩 d_{trilobite} (Debye)
  equilibriumBondLengthA0: number;        // 超長程里德堡分子平衡核間距 R_{eq} (玻爾半徑 a_0)
  polaronBoundBosonCount: number;         // 里德堡軌道內多體玻色極化子束縛原子數 N_{bound}
  ramseyPolaronRedshiftMHz: number;       // 拉姆齊干涉極化子多體平均場紅移 \Delta \nu_{polaron} (MHz)
  activeRegime: RydbergTrilobiteRegime;
  pulsePhase: number;
  lobeNodes: TrilobiteWavefunctionLobeNode[];
}

const STORAGE_KEY = 'newworld_rydberg_trilobite_polaron_state_v1';

export class UltralongRangeRydbergTrilobitePolaronEngine {
  private state: RydbergTrilobitePolaronState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): RydbergTrilobitePolaronState {
    const defaults: RydbergTrilobitePolaronState = {
      principalQuantumNumberN: 62,
      becBackgroundDensityLogCm3: 13.8,
      permanentDipoleMomentDebye: 1845.0,
      equilibriumBondLengthA0: 2180.0,
      polaronBoundBosonCount: 14,
      ramseyPolaronRedshiftMHz: 48.6,
      activeRegime: 'high-l-trilobite-kilodebye-macrodimer',
      pulsePhase: 0,
      lobeNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Rydberg Trilobite Polaron state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Rydberg Trilobite Polaron state:', e);
      }
    }
  }

  public getState(): Readonly<RydbergTrilobitePolaronState> {
    return this.state;
  }

  public setPrincipalQuantumNumber(nVal: number): void {
    this.state.principalQuantumNumberN = Math.max(35, Math.min(95, Math.round(nVal)));
    this.recomputePhysics();
    this.saveState();
  }

  public setBecBackgroundDensityLog(logDens: number): void {
    this.state.becBackgroundDensityLogCm3 = Math.max(12.0, Math.min(15.2, parseFloat(logDens.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: RydbergTrilobiteRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'high-l-trilobite-kilodebye-macrodimer':
        this.state.principalQuantumNumberN = 64;
        this.state.becBackgroundDensityLogCm3 = 13.4;
        break;
      case 'p-wave-shape-resonance-butterfly-state':
        this.state.principalQuantumNumberN = 45;
        this.state.becBackgroundDensityLogCm3 = 13.2;
        break;
      case 'many-body-rydberg-bose-polaron-shell':
        this.state.principalQuantumNumberN = 78;
        this.state.becBackgroundDensityLogCm3 = 14.8;
        break;
      case 'dipole-aligned-trilobite-chain-crystal':
        this.state.principalQuantumNumberN = 88;
        this.state.becBackgroundDensityLogCm3 = 14.1;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const n = this.state.principalQuantumNumberN;
    const logRho = this.state.becBackgroundDensityLogCm3;

    // 平衡核間距 R_{eq} \propto n^2 a_0 (蝴蝶態位於較內層 ~ 0.35 n^2 a_0，三葉蟲態位於外轉折點 ~ 1.25 n^2 a_0)
    const butterflyFactor = this.state.activeRegime === 'p-wave-shape-resonance-butterfly-state' ? 0.42 : 1.0;
    const bondA0 = 0.56 * n * n * butterflyFactor;
    this.state.equilibriumBondLengthA0 = parseFloat(bondA0.toFixed(1));

    // 三葉蟲分子永久電偶極矩 d_{trilobite} \propto e (R_{eq} - n^2 a_0 / 2) ~ n^2 (Debye)
    const dipole = 0.48 * Math.pow(n, 2.02) * (butterflyFactor < 1.0 ? 0.55 : 1.0);
    this.state.permanentDipoleMomentDebye = parseFloat(dipole.toFixed(1));

    // 里德堡軌道體積 V_{orb} \propto n^6 內包含的背景 BEC 玻色子數 N_{bound}
    const densityFactor = Math.pow(10, (logRho - 13.5) * 0.65);
    const boundBosons = Math.max(1, Math.min(85, Math.round(2.4 * Math.pow(n / 40.0, 3.2) * densityFactor)));
    this.state.polaronBoundBosonCount = boundBosons;

    // 里德堡玻色極化子平均場能量紅移 \Delta \nu_{polaron} (MHz)
    const redshift = 18.5 * densityFactor * (1.0 + 0.03 * n);
    this.state.ramseyPolaronRedshiftMHz = parseFloat(redshift.toFixed(1));

    // 生成 16 個三葉蟲干涉波瓣、蝴蝶態 p-波雙翼與束縛 BEC 玻色子殼層節點
    const nodes: TrilobiteWavefunctionLobeNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let charType: 'trilobite-nodal-lobe' | 'butterfly-pwave-wing' | 'trapped-bec-boson' = 'trilobite-nodal-lobe';
      if (this.state.activeRegime === 'p-wave-shape-resonance-butterfly-state' && i % 2 === 0) {
        charType = 'butterfly-pwave-wing';
      } else if (i % 3 === 2) {
        charType = 'trapped-bec-boson';
      }

      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * 0.25;
      // 三葉蟲波函數呈現多葉橢圓花瓣結構 r(\theta) = r_0 (1 + 0.35 \cos(5\theta))
      const lobeMod = charType === 'butterfly-pwave-wing'
        ? Math.abs(Math.sin(angle * 2)) * 38
        : 24 * Math.cos(angle * 5 + this.state.pulsePhase);
      const r = 68 + lobeMod;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        orbitalCharacter: charType,
        electronDensityProbability: parseFloat((0.35 + 0.62 * Math.abs(Math.cos(angle * 3))).toFixed(3)),
        localDipoleDebye: this.state.permanentDipoleMomentDebye,
        fermiPotentialDepthMHz: parseFloat((35.0 + 0.8 * n).toFixed(1))
      });
    }
    this.state.lobeNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.72 + (this.state.principalQuantumNumberN / 100.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerRydbergTrilobiteSound(): void {
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
      const oscKepler = this.audioCtx.createOscillator();
      const oscPolaron = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscKepler.type = 'sine';
      oscPolaron.type = 'triangle';

      // 里德堡克卜勒軌道頻率 (\propto n^{-3}) 與極化子束縛振盪模雙音
      const fKepler = 240 + (95 - this.state.principalQuantumNumberN) * 3.8;
      const fVibrational = fKepler * (1.28 + 0.008 * this.state.polaronBoundBosonCount);

      oscKepler.frequency.setValueAtTime(fKepler, t);
      oscPolaron.frequency.setValueAtTime(fVibrational, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscKepler.connect(gain);
      oscPolaron.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscKepler.start(t);
      oscPolaron.start(t);
      oscKepler.stop(t + 0.58);
      oscPolaron.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in UltralongRangeRydbergTrilobitePolaronEngine:', e);
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

export const ultralongRangeRydbergTrilobitePolaronEngine = new UltralongRangeRydbergTrilobitePolaronEngine();
