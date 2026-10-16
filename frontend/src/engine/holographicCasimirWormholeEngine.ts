/**
 * 全息卡西米爾暗能量蟲洞引擎 (Holographic Casimir Dark Energy Wormhole Engine)
 * 
 * 物理原理：
 * 1. 根據量子場論與動態卡西米爾效應 (Dynamic Casimir Effect)，導體板間或共形膜邊界受限真空態
 *    產生顯著負能量密度 (Negative Energy Density) ⟨T_00⟩ < 0，打破廣義相對論經典零能量條件 (Null Energy Condition, NEC):
 *    T_{μν} k^μ k^ν < 0
 * 2. 在莫里斯-索恩 (Morris-Thorne) 可穿越蟲洞度規中：
 *    ds² = -e^{2Φ(r)} dt² + [1 - b(r)/r]^{-1} dr² + r² dΩ²
 *    穩態蟲洞喉管半徑 r₀ 需要外來奇異物質 (Exotic Matter) 或幻影暗能量 (Phantom Dark Energy, 狀態方程 w = p/ρ < -1)
 *    提供斥力張力，抵抗引力自發擠壓與喉管夾斷 (Pinch-off Collapse)。
 * 3. 透過 AdS/CFT 全息對偶邊界雙跡耦合 (Double-Trace Deformation)，邊界量子糾纏形成負能量衝擊波，
 *    將幾何蟲洞穩定開啟為全息可穿越量子通道，實現高傳輸通量 Φ_traversable。
 */

export type CasimirWormholeRegime = 
  | 'sub-critical-casimir-vacuum'
  | 'nec-violating-phantom-field'
  | 'stable-traversable-throat'
  | 'superluminal-horizon-expansion';

export interface WormholeProfileNode {
  id: number;
  radiusR: number;      // 距中心徑向半徑
  heightZ: number;      // 喉管三維嵌入高度 z(r)
  energyDensityRho: number; // 局部負能量密度
  traversabilityDensity: number;
}

export interface CasimirWormholeState {
  casimirPlateSeparationNm: number; // 卡西米爾板間距 d (nm, 10.0 ~ 100.0)
  phantomDarkEnergyW: number;       // 幻影暗能量狀態方程參數 w ( -2.5 ~ -0.8 )
  throatRadiusMeters: number;       // 蟲洞喉管半徑 r₀ (m, 0.5 ~ 25.0)
  necViolationFactor: number;       // NEC 破缺係數 τ_NEC (0.0 ~ 2.0)
  traversableQuantumFlux: number;   // 全息可穿越量子通量 Φ_trav (0.0 ~ 1.0)
  casimirAttractiveForceN: number;  // 宏觀卡西米爾壓力 (10⁻⁶ N/m²)
  activeRegime: CasimirWormholeRegime;
  pulsePhase: number;
  profileNodes: WormholeProfileNode[];
}

const STORAGE_KEY = 'newworld_casimir_wormhole_engine_state_v1';

export class HolographicCasimirWormholeEngine {
  private state: CasimirWormholeState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): CasimirWormholeState {
    const defaults: CasimirWormholeState = {
      casimirPlateSeparationNm: 25.0,
      phantomDarkEnergyW: -1.35,
      throatRadiusMeters: 4.8,
      necViolationFactor: 1.15,
      traversableQuantumFlux: 0.88,
      casimirAttractiveForceN: 54.2,
      activeRegime: 'stable-traversable-throat',
      pulsePhase: 0,
      profileNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Casimir Wormhole state from localStorage:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Casimir Wormhole state to localStorage:', e);
      }
    }
  }

  public getState(): Readonly<CasimirWormholeState> {
    return this.state;
  }

  public setPlateSeparation(d: number): void {
    this.state.casimirPlateSeparationNm = Math.max(10.0, Math.min(100.0, d));
    this.recomputePhysics();
    this.saveState();
  }

  public setPhantomDarkEnergyW(w: number): void {
    this.state.phantomDarkEnergyW = Math.max(-2.5, Math.min(-0.8, w));
    this.recomputePhysics();
    this.saveState();
  }

  public setThroatRadius(r0: number): void {
    this.state.throatRadiusMeters = Math.max(0.5, Math.min(25.0, r0));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: CasimirWormholeRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'sub-critical-casimir-vacuum':
        this.state.casimirPlateSeparationNm = 75.0;
        this.state.phantomDarkEnergyW = -0.95;
        this.state.throatRadiusMeters = 1.2;
        break;
      case 'nec-violating-phantom-field':
        this.state.casimirPlateSeparationNm = 40.0;
        this.state.phantomDarkEnergyW = -1.25;
        this.state.throatRadiusMeters = 3.5;
        break;
      case 'stable-traversable-throat':
        this.state.casimirPlateSeparationNm = 22.0;
        this.state.phantomDarkEnergyW = -1.55;
        this.state.throatRadiusMeters = 6.8;
        break;
      case 'superluminal-horizon-expansion':
        this.state.casimirPlateSeparationNm = 12.0;
        this.state.phantomDarkEnergyW = -2.20;
        this.state.throatRadiusMeters = 18.5;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const d = this.state.casimirPlateSeparationNm;
    const w = this.state.phantomDarkEnergyW;
    const r0 = this.state.throatRadiusMeters;

    // 卡西米爾力 F_Casimir = (π² ℏ c) / (240 d⁴) ∝ 1 / d⁴
    const force = 80000.0 / Math.pow(d / 10.0, 4);
    this.state.casimirAttractiveForceN = parseFloat(Math.min(999.0, Math.max(0.5, force)).toFixed(1));

    // NEC 破缺係數 τ_NEC = |1 + w| * (30.0 / d)
    const nec = Math.abs(1.0 + w) * (25.0 / d);
    this.state.necViolationFactor = parseFloat(Math.min(2.5, Math.max(0.05, nec)).toFixed(2));

    // 可穿越量子通量 Φ_trav = tanh(1.2 * τ_NEC) * (1 - exp(-r0 / 3))
    const flux = Math.tanh(1.5 * this.state.necViolationFactor) * (1 - Math.exp(-r0 / 4.0));
    this.state.traversableQuantumFlux = parseFloat(Math.min(0.99, Math.max(0.02, flux)).toFixed(3));

    // 莫里斯-索恩喉管雙曲嵌入截面分佈 z(r) = ± r₀ arcosh(r / r₀) (14 個採樣節點)
    const nodes: WormholeProfileNode[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      // 模擬上漏斗 (z > 0) 與下漏斗 (z < 0)
      const ratio = 1.0 + Math.pow(i / (count - 1), 1.8) * 3.5;
      const radR = r0 * ratio;
      // z = r0 * ln(ratio + sqrt(ratio^2 - 1))
      const zEmb = r0 * Math.log(ratio + Math.sqrt(Math.max(0, Math.pow(ratio, 2) - 1)));
      
      const dynSign = (i % 2 === 0) ? 1 : -1;
      const dynZ = zEmb * dynSign + Math.sin(this.state.pulsePhase * 2.0 + i) * 0.4;
      const rhoNeg = - (1.0 / Math.pow(ratio, 2)) * this.state.necViolationFactor;

      nodes.push({
        id: i,
        radiusR: parseFloat(radR.toFixed(2)),
        heightZ: parseFloat(dynZ.toFixed(2)),
        energyDensityRho: parseFloat(rhoNeg.toFixed(3)),
        traversabilityDensity: parseFloat((this.state.traversableQuantumFlux / ratio).toFixed(3))
      });
    }
    this.state.profileNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const rate = 1.0 + (this.state.throatRadiusMeters / 10.0);
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * rate) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerWormholeSound(): void {
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
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      const baseFreq = 65 + (this.state.throatRadiusMeters * 3.5);
      const targetFreq = baseFreq + Math.abs(this.state.phantomDarkEnergyW) * 45;

      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, t + 0.3);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + 0.6);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.62);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.65);
    } catch (e) {
      console.warn('Web Audio playback failed in HolographicCasimirWormholeEngine:', e);
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

export const holographicCasimirWormholeEngine = new HolographicCasimirWormholeEngine();
