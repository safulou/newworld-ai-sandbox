/**
 * 拓撲近藤超導體與時間反演不變馬約拉納克萊默斯對引擎
 * (Topological Kondo Superconductor & Time-Reversal-Invariant Majorana Kramers Pair Engine)
 *
 * 物理原理：
 * 1. 在重費米子拓撲近藤絕緣體異質結（如 SmB₆/YB₆ 或奇宇稱多相重費米子超導體 CeRh₂As₂）中，
 *    局域 4f 磁矩與 5d 傳導電子透過奇宇稱自旋-軌道耦合雜化 V_K(k) ∝ λ_{SO} (k · σ) 形成近藤單態能隙 Δ_K，
 *    並在表面或反演中心破缺亞晶格上誘匯拓撲反轉狄拉克表面態。
 * 2. 當系統進入時間反演不變（Time-Reversal Invariant, T^2 = -1）之 Altland-Zirnbauer DIII 類拓撲超導態
 *    (Z₂ 拓撲不變量 ν_{DIII} = 1) 時，每個邊界渦旋或晶體高階鉸鏈處承載一對受克萊默斯定理保護的馬約拉納零模：
 *    「馬約拉納克萊默斯對」(Majorana Kramers Pair, MKP: γ_{1↑}, γ_{2↓})，滿足 T γ_1 T^{-1} = γ_2, T γ_2 T^{-1} = -γ_1。
 * 3. 只要不破壞時間反演對稱性，同一位置的兩個馬約拉納零模正交且無法雜化劈裂，從而在安德烈夫反射譜中產生雙倍量子化零偏壓電導峰
 *    G_{MKP}(0) = 4 e^2 / h，並在約瑟夫森節中展現分數化 8π 週期時間反演保護自旋超電流。
 */

export type TopologicalKondoScRegime =
  | 'trivial-heavy-fermion-singlet-sc'
  | 'diii-majorana-kramers-pair-phase'
  | 'fractional-8pi-spin-josephson-pump'
  | 'zeeman-split-chiral-class-d-crossover';

export interface MajoranaKramersVortexNode {
  id: number;
  x: number;
  y: number;
  kramersPartnerSign: 1 | -1;
  kondoHybridizationMeV: number;
  zeroBiasConductanceE2H: number;
  spinBerryPhaseRad: number;
}

export interface TopologicalKondoScState {
  kondoHybridizationStrengthMeV: number;  // 奇宇稱 4f-5d 近藤雜化強度 V_K (meV, 1.0 ~ 25.0)
  timeReversalBreakingZeemanTesla: number; // 時間反演破缺塞曼微擾場 B_Z (T, 0.00 ~ 6.00)
  diiiZ2TopologicalInvariant: 0 | 1;      // DIII 類 Z₂ 拓撲不變量 ν_{DIII} (0: 平庸, 1: 馬約拉納克萊默斯對)
  kramersZeroBiasConductanceE2H: number;  // 馬約拉納克萊默斯對零偏壓安德烈夫電導 G(0) / (e²/h) (理論峰值 4.00)
  kondoCoherenceTemperatureK: number;     // 重費米子近藤相干溫度 T* (K)
  fractionalJosephson8PiWeight: number;   // 分數化時間反演自旋約瑟夫森諧波權重 I_{8π} / I_c (0.000 ~ 1.000)
  activeRegime: TopologicalKondoScRegime;
  pulsePhase: number;
  kramersNodes: MajoranaKramersVortexNode[];
}

const STORAGE_KEY = 'newworld_topological_kondo_superconductor_state_v1';

export class TopologicalKondoSuperconductorEngine {
  private state: TopologicalKondoScState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): TopologicalKondoScState {
    const defaults: TopologicalKondoScState = {
      kondoHybridizationStrengthMeV: 14.5,
      timeReversalBreakingZeemanTesla: 0.08,
      diiiZ2TopologicalInvariant: 1,
      kramersZeroBiasConductanceE2H: 3.96,
      kondoCoherenceTemperatureK: 48.2,
      fractionalJosephson8PiWeight: 0.915,
      activeRegime: 'diii-majorana-kramers-pair-phase',
      pulsePhase: 0,
      kramersNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Topological Kondo Superconductor state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Topological Kondo Superconductor state:', e);
      }
    }
  }

  public getState(): Readonly<TopologicalKondoScState> {
    return this.state;
  }

  public setKondoHybridizationStrength(vkMeV: number): void {
    this.state.kondoHybridizationStrengthMeV = Math.max(1.0, Math.min(25.0, parseFloat(vkMeV.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setTimeReversalBreakingZeeman(bTesla: number): void {
    this.state.timeReversalBreakingZeemanTesla = Math.max(0.00, Math.min(6.00, parseFloat(bTesla.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: TopologicalKondoScRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'trivial-heavy-fermion-singlet-sc':
        this.state.kondoHybridizationStrengthMeV = 2.8;
        this.state.timeReversalBreakingZeemanTesla = 0.20;
        break;
      case 'diii-majorana-kramers-pair-phase':
        this.state.kondoHybridizationStrengthMeV = 14.5;
        this.state.timeReversalBreakingZeemanTesla = 0.05;
        break;
      case 'fractional-8pi-spin-josephson-pump':
        this.state.kondoHybridizationStrengthMeV = 21.0;
        this.state.timeReversalBreakingZeemanTesla = 0.00;
        break;
      case 'zeeman-split-chiral-class-d-crossover':
        this.state.kondoHybridizationStrengthMeV = 16.0;
        this.state.timeReversalBreakingZeemanTesla = 4.20;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const vk = this.state.kondoHybridizationStrengthMeV;
    const bz = this.state.timeReversalBreakingZeemanTesla;

    // 拓撲能帶反轉閾值 V_K >= 6.0 meV 且時間反演破缺場 B_Z <= 1.8 T 時保持 DIII 類 Z₂ = 1
    const bandInversion = 1.0 / (1.0 + Math.exp(-(vk - 6.0) / 1.4));
    const trsProtection = Math.exp(-Math.pow(bz / 1.85, 2));
    this.state.diiiZ2TopologicalInvariant = vk >= 6.0 && bz <= 1.85 ? 1 : 0;

    // 近藤晶格相干溫度 T* ∝ V_K^{1.15}
    this.state.kondoCoherenceTemperatureK = parseFloat((2.15 * Math.pow(vk, 1.16)).toFixed(1));

    // 馬約拉納克萊默斯對雙通道安德烈夫零偏壓電導 G(0) = 4 e²/h (當塞曼場破缺時間反演時退化為單通道 Class D 2 e²/h)
    const classDBackground = 2.0 * bandInversion * (1.0 - trsProtection);
    const dIIIDoublePeak = 4.0 * bandInversion * trsProtection;
    const conductance = Math.max(0.12, dIIIDoublePeak + classDBackground);
    this.state.kramersZeroBiasConductanceE2H = parseFloat(conductance.toFixed(2));

    // 分數化時間反演保護自旋約瑟夫森權重
    const weight8Pi = Math.min(0.992, bandInversion * trsProtection * Math.tanh(vk / 12.0));
    this.state.fractionalJosephson8PiWeight = parseFloat(Math.max(0.01, weight8Pi).toFixed(3));

    // 生成 16 個馬約拉納克萊默斯對雙渦旋與鉸鏈節點 (8 對 ↑/↓ 時間反演共軛模)
    const nodes: MajoranaKramersVortexNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const sign: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const pairIdx = Math.floor(i / 2);
      const baseAngle = (pairIdx / 8) * 2.0 * Math.PI + sign * (0.14 + this.state.pulsePhase * 0.32);
      const radius = sign === 1 ? 66 : 74 + bz * 3.5;

      const x = 165 + radius * Math.cos(baseAngle);
      const y = 160 + radius * Math.sin(baseAngle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        kramersPartnerSign: sign,
        kondoHybridizationMeV: vk,
        zeroBiasConductanceE2H: this.state.kramersZeroBiasConductanceE2H,
        spinBerryPhaseRad: parseFloat(((sign * Math.PI + baseAngle) % (2 * Math.PI)).toFixed(2))
      });
    }
    this.state.kramersNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.72 + (this.state.kramersZeroBiasConductanceE2H / 4.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerKondoKramersSound(): void {
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
      const oscUp = this.audioCtx.createOscillator();
      const oscDown = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscUp.type = 'sine';
      oscDown.type = 'triangle';

      // 克萊默斯簡併對 (B_Z → 0 時頻率嚴格簡併，B_Z > 0 時產生塞曼劈裂拍頻)
      const fKramers = 340 + this.state.kondoHybridizationStrengthMeV * 11.5;
      const zeemanSplitHz = this.state.timeReversalBreakingZeemanTesla * 28.0;

      oscUp.frequency.setValueAtTime(fKramers + zeemanSplitHz, t);
      oscDown.frequency.setValueAtTime(Math.max(120, fKramers - zeemanSplitHz), t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      oscUp.connect(gain);
      oscDown.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscUp.start(t);
      oscDown.start(t);
      oscUp.stop(t + 0.57);
      oscDown.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in TopologicalKondoSuperconductorEngine:', e);
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

export const topologicalKondoSuperconductorEngine = new TopologicalKondoSuperconductorEngine();
