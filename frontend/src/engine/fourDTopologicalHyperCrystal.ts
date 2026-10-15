/**
 * 四維拓撲絕緣體二階陳數超幾何晶體引擎 (4D Topological Insulator Second Chern Hyper-Crystal Engine)
 * 
 * 物理原理：
 * 1. 四維量子霍爾效應 (4D QHE) 是所有拓撲物態（含 2D/3D 拓撲絕緣體與外爾半金屬）的理論母相。
 *    其特徵拓撲不變量為非阿貝爾二階陳數 (Second Chern Number):
 *    C₂ = (1 / 8π²) ∫_{T⁴} Tr(ℱ ∧ ℱ) ∈ ℤ
 * 2. 哈密頓量構建於四維超立方晶格 (Tesseract / 8-Cell) 上，五個 4×4 狄拉克伽瑪矩陣 Γᵃ 定義能帶拓撲。
 *    狄拉克質量參數 M₄ 調控相變，在拓撲非平庸相 (|M₄| < 2) 湧現量化二階陳數 C₂ = 1 或 2。
 * 3. 系統產生特徵非線性拓撲電磁響應作用量 S₄_D，在四維空間驅動非線性量子化霍爾電流：
 *    j^μ = (e² C₂ / 4π² ℏ) ε^{μνρσ} E_ν B_ρ
 * 4. 三維邊界表面湧現受拓撲保護的無質量 3D 狄拉克錐態 (3D Dirac Cone Surface States)。
 *    透過四維 SO(4) 超空間立體投影，將超立方體的 16 頂點與 32 邊映射至玩家可視化幾何。
 */

export type FourDHyperCrystalRegime = 
  | 'trivial-hyper-insulator'
  | 'second-chern-topological'
  | 'double-chern-exotic'
  | 'hyper-surface-critical';

export interface HyperVertex {
  id: number;
  x: number;
  y: number;
  z: number;
  w: number;
  projX: number;
  projY: number;
}

export interface HyperEdge {
  from: number;
  to: number;
}

export interface FourDHyperCrystalState {
  diracMassM4: number;               // 狄拉克質量 M₄ (eV, -2.5 ~ 2.5)
  hyperRotationAngleDeg: number;     // 四維旋轉角 θ_4D (度, 0° ~ 360°)
  secondChernNumberC2: number;       // 二階陳數 C₂ (0, 1, 2)
  nonLinearHallConductance: number;  // 非線性霍爾電導 (量化單位 e² / 4π²ℏ)
  surfaceDiracVelocity1e5: number;   // 表面狄拉克速度 v_F (10⁵ m/s)
  berryCurvatureFlux: number;        // 貝里曲率通量 Tr(ℱ ∧ ℱ)
  activeRegime: FourDHyperCrystalRegime;
  pulsePhase: number;
  vertices: HyperVertex[];
  edges: HyperEdge[];
}

const STORAGE_KEY = 'newworld_four_d_hyper_crystal_state_v1';

export class FourDTopologicalHyperCrystalEngine {
  private state: FourDHyperCrystalState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.generateTesseractTopology();
    this.recomputePhysics();
  }

  private loadState(): FourDHyperCrystalState {
    const defaults: FourDHyperCrystalState = {
      diracMassM4: 1.15,
      hyperRotationAngleDeg: 45.0,
      secondChernNumberC2: 1,
      nonLinearHallConductance: 1.0,
      surfaceDiracVelocity1e5: 4.6,
      berryCurvatureFlux: 78.96, // 8π² ≈ 78.96
      activeRegime: 'second-chern-topological',
      pulsePhase: 0,
      vertices: [],
      edges: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load 4D Hyper Crystal state from localStorage:', e);
      }
    }
    return defaults;
  }

  private generateTesseractTopology(): void {
    // 生成 16 個 4D 頂點 (±1, ±1, ±1, ±1)
    const verts: HyperVertex[] = [];
    for (let i = 0; i < 16; i++) {
      const x = (i & 1) ? 1 : -1;
      const y = (i & 2) ? 1 : -1;
      const z = (i & 4) ? 1 : -1;
      const w = (i & 8) ? 1 : -1;
      verts.push({ id: i, x, y, z, w, projX: 150, projY: 150 });
    }
    this.state.vertices = verts;

    // 生成 32 條邊（漢明距離為 1 的節點相連）
    const edges: HyperEdge[] = [];
    for (let i = 0; i < 16; i++) {
      for (let bit = 0; bit < 4; bit++) {
        const neighbor = i ^ (1 << bit);
        if (neighbor > i) {
          edges.push({ from: i, to: neighbor });
        }
      }
    }
    this.state.edges = edges;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save 4D Hyper Crystal state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<FourDHyperCrystalState> {
    return this.state;
  }

  public setDiracMass(m: number): void {
    this.state.diracMassM4 = Math.max(-2.5, Math.min(2.5, m));
    this.recomputePhysics();
    this.saveState();
  }

  public setHyperRotation(deg: number): void {
    this.state.hyperRotationAngleDeg = (deg % 360 + 360) % 360;
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: FourDHyperCrystalRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'trivial-hyper-insulator':
        this.state.diracMassM4 = 2.35; // |M| > 2 => C2 = 0
        this.state.hyperRotationAngleDeg = 15.0;
        break;
      case 'second-chern-topological':
        this.state.diracMassM4 = 1.0;  // 0 < M < 2 => C2 = 1
        this.state.hyperRotationAngleDeg = 45.0;
        break;
      case 'double-chern-exotic':
        this.state.diracMassM4 = -1.2; // C2 = 2
        this.state.hyperRotationAngleDeg = 75.0;
        break;
      case 'hyper-surface-critical':
        this.state.diracMassM4 = 0.05; // M ≈ 0 => Critical Dirac Cone
        this.state.hyperRotationAngleDeg = 90.0;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const m = this.state.diracMassM4;
    const rotDeg = this.state.hyperRotationAngleDeg + (this.state.pulsePhase * 180 / Math.PI);
    const theta = (rotDeg * Math.PI) / 180;

    // 計算二階陳數 C₂
    let c2 = 0;
    if (Math.abs(m) >= 2.0) {
      c2 = 0; // 平庸相
    } else if (m > 0) {
      c2 = 1; // 單二階陳數相
    } else {
      c2 = 2; // 雙二階陳數超幾何相
    }
    this.state.secondChernNumberC2 = c2;
    this.state.nonLinearHallConductance = c2;

    // 貝里曲率通量 Tr(ℱ ∧ ℱ) = 8π² * C₂
    const flux = c2 * 8 * Math.pow(Math.PI, 2);
    this.state.berryCurvatureFlux = parseFloat(flux.toFixed(2));

    // 表面狄拉克錐費米速度 v_F = 5.2 * sqrt(max(0.1, 4 - m²))
    const gapFactor = Math.max(0.1, 4 - Math.pow(m, 2));
    const vf = 2.6 * Math.sqrt(gapFactor);
    this.state.surfaceDiracVelocity1e5 = parseFloat(vf.toFixed(2));

    // 四維超立方體立體投影到 2D 畫布
    // 進行 (X-W) 平面與 (Y-Z) 平面雙重旋轉
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const cosP = Math.cos(theta * 0.7);
    const sinP = Math.sin(theta * 0.7);

    const projected = this.state.vertices.map((v) => {
      // X-W 旋轉
      const xRot = v.x * cosT - v.w * sinT;
      const wRot = v.x * sinT + v.w * cosT;

      // Y-Z 旋轉
      const yRot = v.y * cosP - v.z * sinP;
      const zRot = v.y * sinP + v.z * cosP;

      // 4D -> 3D 透視投影 (投影距離 d = 3.2)
      const distW = 3.2 - wRot * 0.45;
      const scaleW = 1.0 / distW;

      const px3 = xRot * scaleW;
      const py3 = yRot * scaleW;
      const pz3 = zRot * scaleW;

      // 3D -> 2D 透視投影
      const distZ = 3.5 - pz3 * 0.4;
      const scaleZ = 1.0 / distZ;

      const screenX = 150 + px3 * scaleZ * 170;
      const screenY = 150 + py3 * scaleZ * 170;

      return {
        ...v,
        projX: parseFloat(screenX.toFixed(1)),
        projY: parseFloat(screenY.toFixed(1))
      };
    });

    this.state.vertices = projected;
  }

  public update(dtSeconds: number): void {
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * 0.8) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerHyperSound(): void {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      // 4 重四度等比超立體和弦：240, 360, 480, 600 Hz
      const chordFreqs = [240, 360, 480, 600];
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, t);
      masterGain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      masterGain.connect(this.audioCtx.destination);

      chordFreqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const g = this.audioCtx.createGain();
        osc.type = 'sine';
        const detune = (this.state.secondChernNumberC2 * 12) * (idx + 1);
        osc.frequency.setValueAtTime(freq + detune, t);
        g.gain.setValueAtTime(0.25, t);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.68);
      });
    } catch (e) {
      console.warn('Web Audio playback failed in FourDHyperCrystalEngine:', e);
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
    this.generateTesseractTopology();
    this.recomputePhysics();
  }
}

export const fourDTopologicalHyperCrystalEngine = new FourDTopologicalHyperCrystalEngine();
