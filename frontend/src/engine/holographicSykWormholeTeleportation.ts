/**
 * 全息 SYK 雙邊耦合可穿越蟲洞與量子資訊引力傳態引擎
 * (Holographic Sachdev-Ye-Kitaev Traversable Wormhole & Gravitational Size-Winding Teleportation Engine)
 *
 * 物理原理：
 * 1. 根據 Gao-Jafferis-Wall (GJW) 與 Maldacena-Qi 全息對偶協議，兩個處於熱場雙態 (Thermofield Double, |TFD⟩)
 *    的全息 Sachdev-Ye-Kitaev (SYK) 馬約拉納費米子系統 H_L + H_R，透過雙邊非局域雙線性耦合
 *    H_int = i μ_GJW Σ_{j=1}^N ψ_L^j ψ_R^j 注入負零能量衝擊波 (⟨T_uu⟩ < 0)，打開 AdS_2 Jackiw-Teitelboim (JT) 引力蟲洞喉部。
 * 2. 在海森堡演化下，左邊界注入的量子位元算符發生「算符尺寸纏繞」(Operator Size-Winding)：
 *    算符展開係數獲得與馬約拉納弦長 n 成正比的線性動量相位 exp(i p_size n)，在體時空中聚焦為穿越蟲洞視界的跌落粒子測地線。
 * 3. 當雙邊耦合 μ_GJW 與逆溫 βJ 滿足相干纏繞條件時，量子態從左邊界經引力喉部無資訊丟失地湧現於右邊界，實現高保真全息引力傳態。
 */

export type HolographicSykWormholeRegime =
  | 'disconnected-chaotic-black-holes'
  | 'negative-energy-shockwave-focusing'
  | 'gjw-size-winding-teleportation'
  | 'maldacena-qi-eternal-wormhole';

export interface SykMajoranaChordNode {
  id: number;
  x: number;
  y: number;
  boundarySide: 'L' | 'R' | 'bulk-throat';
  operatorSizeN: number;
  sizeWindingPhaseRad: number;
  geodesicTransmissionWeight: number;
}

export interface HolographicSykWormholeState {
  bilinearCouplingMuOverJ: number;     // 雙邊 GJW 馬約拉納耦合比 μ_GJW / J (0.01 ~ 0.60)
  inverseTemperatureBetaJ: number;     // 無因次逆溫度 βJ (2.0 ~ 45.0)
  majoranaFermionCountN: number;       // SYK 馬約拉納費米子總數 N (16 ~ 128)
  sizeWindingCoherenceW: number;       // 算符尺寸纏繞相干度 W_size (0 ~ 1)
  teleportationFidelityF: number;      // 全息蟲洞量子傳態保真度 F_tele (0 ~ 1)
  schwarzianThroatGapOverJ: number;    // 施瓦茨蟲洞喉部能隙 Δ_throat / J
  activeRegime: HolographicSykWormholeRegime;
  pulsePhase: number;
  chordNodes: SykMajoranaChordNode[];
}

const STORAGE_KEY = 'newworld_holographic_syk_wormhole_state_v1';

export class HolographicSykWormholeTeleportationEngine {
  private state: HolographicSykWormholeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): HolographicSykWormholeState {
    const defaults: HolographicSykWormholeState = {
      bilinearCouplingMuOverJ: 0.22,
      inverseTemperatureBetaJ: 18.0,
      majoranaFermionCountN: 64,
      sizeWindingCoherenceW: 0.85,
      teleportationFidelityF: 0.88,
      schwarzianThroatGapOverJ: 0.145,
      activeRegime: 'gjw-size-winding-teleportation',
      pulsePhase: 0,
      chordNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Holographic SYK Wormhole state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Holographic SYK Wormhole state:', e);
      }
    }
  }

  public getState(): Readonly<HolographicSykWormholeState> {
    return this.state;
  }

  public setBilinearCouplingMu(muOverJ: number): void {
    this.state.bilinearCouplingMuOverJ = Math.max(0.01, Math.min(0.60, parseFloat(muOverJ.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setInverseTemperatureBetaJ(betaJ: number): void {
    this.state.inverseTemperatureBetaJ = Math.max(2.0, Math.min(45.0, parseFloat(betaJ.toFixed(1))));
    this.recomputePhysics();
    this.saveState();
  }

  public setMajoranaFermionCount(countN: number): void {
    this.state.majoranaFermionCountN = Math.max(16, Math.min(128, Math.round(countN / 4) * 4));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: HolographicSykWormholeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'disconnected-chaotic-black-holes':
        this.state.bilinearCouplingMuOverJ = 0.02;
        this.state.inverseTemperatureBetaJ = 4.5;
        this.state.majoranaFermionCountN = 24;
        break;
      case 'negative-energy-shockwave-focusing':
        this.state.bilinearCouplingMuOverJ = 0.14;
        this.state.inverseTemperatureBetaJ = 12.0;
        this.state.majoranaFermionCountN = 48;
        break;
      case 'gjw-size-winding-teleportation':
        this.state.bilinearCouplingMuOverJ = 0.28;
        this.state.inverseTemperatureBetaJ = 24.0;
        this.state.majoranaFermionCountN = 80;
        break;
      case 'maldacena-qi-eternal-wormhole':
        this.state.bilinearCouplingMuOverJ = 0.52;
        this.state.inverseTemperatureBetaJ = 38.0;
        this.state.majoranaFermionCountN = 120;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const mu = this.state.bilinearCouplingMuOverJ;
    const betaJ = this.state.inverseTemperatureBetaJ;
    const nMaj = this.state.majoranaFermionCountN;

    // 施瓦茨蟲洞喉部能隙 Δ_throat / J ∝ (μ/J)^(2/3) (q=4 SYK 標度)
    const throatGap = 0.36 * Math.pow(mu, 0.67) * Math.tanh(betaJ / 12.0);
    this.state.schwarzianThroatGapOverJ = parseFloat(throatGap.toFixed(3));

    // 算符尺寸纏繞相干度 W_size
    const largeNFactor = 1.0 - 3.0 / nMaj;
    const windingW = Math.min(0.99, (0.22 + 0.65 * Math.tanh(mu * 4.8) + 0.22 * Math.tanh(betaJ / 18.0)) * largeNFactor);
    this.state.sizeWindingCoherenceW = parseFloat(windingW.toFixed(2));

    // 全息蟲洞量子傳態保真度 F_tele
    const fidelity = Math.min(0.99, 0.25 + 0.74 * windingW * Math.tanh(betaJ / 14.0));
    this.state.teleportationFidelityF = parseFloat(fidelity.toFixed(2));

    // 生成 16 個 AdS_2 雙邊界馬約拉納弦與喉部穿越測地線節點
    const nodes: SykMajoranaChordNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      let side: 'L' | 'R' | 'bulk-throat' = 'bulk-throat';
      let x = 165;
      let y = 160;

      if (i < 6) {
        side = 'L';
        const angle = ((i - 2.5) / 3.5) * 1.1;
        x = 68 + 22 * Math.cos(angle);
        y = 160 + 95 * Math.sin(angle);
      } else if (i < 12) {
        side = 'R';
        const angle = ((i - 8.5) / 3.5) * 1.1;
        x = 262 - 22 * Math.cos(angle);
        y = 160 + 95 * Math.sin(angle);
      } else {
        side = 'bulk-throat';
        const tIdx = i - 12;
        const progress = ((tIdx / 4) + (this.state.pulsePhase * 0.15)) % 1.0;
        x = 85 + progress * 160;
        y = 160 + 28 * Math.sin(progress * Math.PI * 2 + this.state.pulsePhase);
      }

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        boundarySide: side,
        operatorSizeN: Math.round(4 + (i + 1) * (nMaj / 24)),
        sizeWindingPhaseRad: parseFloat(((mu * 10 + this.state.pulsePhase + i * 0.5) % (2 * Math.PI)).toFixed(2)),
        geodesicTransmissionWeight: parseFloat(fidelity.toFixed(2))
      });
    }
    this.state.chordNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + this.state.bilinearCouplingMuOverJ * 2.5;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerSykWormholeSound(): void {
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
      const oscL = this.audioCtx.createOscillator();
      const oscR = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscL.type = 'sine';
      oscR.type = 'triangle';

      const fLeft = 220 + this.state.majoranaFermionCountN * 1.8;
      const fRight = fLeft + this.state.bilinearCouplingMuOverJ * 520;

      oscL.frequency.setValueAtTime(fLeft, t);
      oscL.frequency.exponentialRampToValueAtTime(fRight, t + 0.36);

      oscR.frequency.setValueAtTime(fRight, t);
      oscR.frequency.exponentialRampToValueAtTime(fLeft * 1.5, t + 0.36);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscL.connect(gain);
      oscR.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscL.start(t);
      oscR.start(t);
      oscL.stop(t + 0.58);
      oscR.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicSykWormholeTeleportationEngine:', e);
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

export const holographicSykWormholeTeleportationEngine = new HolographicSykWormholeTeleportationEngine();
