/**
 * 扭轉雙層銅氧化物高溫超導 d+id 拓撲約瑟夫森節與半整數磁通渦旋引擎
 * (Twisted Bilayer Cuprate High-Tc d+id Topological Josephson Junction & Half-Quantum Fluxon Engine)
 *
 * 物理原理：
 * 1. 將兩層高溫超導鉍系銅氧化物 Bi₂Sr₂CaCu₂O₈+δ (BSCCO) 以接近 45° 魔角 (θ ≈ 45°) 扭轉堆疊時，
 *    由於 d_{x²-y²} 配對波函數的四重反演對稱性，一階單庫柏對約瑟夫森穿隧電流 J₁(θ) = J_{c1} cos(2θ) 趨近於零。
 * 2. 此時二階雙庫柏對協同穿隧項 J₂ cos(2φ) 主導層間約瑟夫森自由能 F(φ) = -J₁ cos(φ) + J₂ cos(2φ)，
 *    當 J₂ > |J₁|/2 時，基態相位鎖定於 φ₀ = ±arccos(J₁ / 2J₂) ≈ ±π/2，自發破缺時間反演對稱性 (TRS)，
 *    湧現高臨界溫度手性拓撲 d_{x²-y²} + i d_{xy} (d+id) 超導態（陳數 C = ±4，拓撲能隙 Δ_{topo}）。
 * 3. 該相支持攜帶半磁通量子 Φ₀/2 = h/(4e) 之自發分數化約瑟夫森渦旋 (Semifluxons)、微波輻照下的分數夏皮羅階梯
 *    (Fractional Shapiro Steps, V_n = n ℏω / 4e) 以及高溫超導約瑟夫森二極體非互易整流效應 η_{JDE}。
 */

export type TwistedCuprateRegime =
  | 'untwisted-nodal-d-wave-junction'
  | 'near-45-degree-second-harmonic-crossover'
  | 'chiral-d-plus-id-topological-phase'
  | 'semifluxon-fractional-shapiro-diode';

export interface CuprateFermiLobeNode {
  id: number;
  x: number;
  y: number;
  layerIndex: 1 | 2;
  dWaveSign: 1 | -1;
  topologicalGapMev: number;
  semifluxonCirculation: number;
}

export interface TwistedCuprateJosephsonState {
  twistAngleDeg: number;                // 層間扭轉角 θ (deg, 30.0 ~ 45.0)
  coTunnelingHarmonicRatioJ2J1: number; // 二階/一階庫柏對穿隧比 J₂ / |J₁|
  spontaneousTrsPhaseDeg: number;       // 自發時間反演破缺相位 φ₀ (deg, 0 ~ 90°)
  chiralTopologicalGapMev: number;      // d+id 拓撲手性能隙 Δ_{topo} (meV)
  fractionalShapiroVisibility: number;  // 分數夏皮羅階梯 h/4e 權重 V_{4e} (0 ~ 1)
  josephsonDiodeRectificationPct: number;// 高溫超導二極體整流效率 η_{JDE} (%)
  interlayerCouplingJ2Mev: number;      // 二階電荷-4e 協同穿隧強度 J₂ (meV, 0.2 ~ 6.0)
  activeRegime: TwistedCuprateRegime;
  pulsePhase: number;
  lobeNodes: CuprateFermiLobeNode[];
}

const STORAGE_KEY = 'newworld_twisted_cuprate_high_tc_josephson_state_v1';

export class TwistedCuprateHighTcJosephsonEngine {
  private state: TwistedCuprateJosephsonState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): TwistedCuprateJosephsonState {
    const defaults: TwistedCuprateJosephsonState = {
      twistAngleDeg: 44.6,
      coTunnelingHarmonicRatioJ2J1: 4.85,
      spontaneousTrsPhaseDeg: 84.1,
      chiralTopologicalGapMev: 14.8,
      fractionalShapiroVisibility: 0.91,
      josephsonDiodeRectificationPct: 46.5,
      interlayerCouplingJ2Mev: 3.2,
      activeRegime: 'chiral-d-plus-id-topological-phase',
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
        console.warn('Failed to load Twisted Cuprate Josephson state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Twisted Cuprate Josephson state:', e);
      }
    }
  }

  public getState(): Readonly<TwistedCuprateJosephsonState> {
    return this.state;
  }

  public setTwistAngleDeg(angleDeg: number): void {
    this.state.twistAngleDeg = Math.max(30.0, Math.min(45.0, parseFloat(angleDeg.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setInterlayerCouplingJ2(j2Mev: number): void {
    this.state.interlayerCouplingJ2Mev = Math.max(0.2, Math.min(6.0, parseFloat(j2Mev.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: TwistedCuprateRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'untwisted-nodal-d-wave-junction':
        this.state.twistAngleDeg = 32.0;
        this.state.interlayerCouplingJ2Mev = 0.6;
        break;
      case 'near-45-degree-second-harmonic-crossover':
        this.state.twistAngleDeg = 42.5;
        this.state.interlayerCouplingJ2Mev = 2.1;
        break;
      case 'chiral-d-plus-id-topological-phase':
        this.state.twistAngleDeg = 44.6;
        this.state.interlayerCouplingJ2Mev = 3.6;
        break;
      case 'semifluxon-fractional-shapiro-diode':
        this.state.twistAngleDeg = 44.95;
        this.state.interlayerCouplingJ2Mev = 5.4;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const thetaRad = (this.state.twistAngleDeg * Math.PI) / 180.0;
    const j2 = this.state.interlayerCouplingJ2Mev;

    // 一階穿隧振幅 J₁(θ) = J_{1,0} |cos(2θ)| + 殘留高階動量修正
    const cos2Theta = Math.max(0.012, Math.abs(Math.cos(2.0 * thetaRad)));
    const j1Eff = 28.0 * cos2Theta;

    // 二階/一階穿隧比 J₂ / |J₁|
    const ratioJ2J1 = Math.min(25.0, j2 / Math.max(0.08, j1Eff));
    this.state.coTunnelingHarmonicRatioJ2J1 = parseFloat(ratioJ2J1.toFixed(2));

    // 自發時間反演破缺基態相位 φ₀ = arccos(min(1, J₁ / (2 J₂)))
    const cosPhi0 = Math.min(1.0, 1.0 / Math.max(1.0, 2.0 * ratioJ2J1));
    const phi0Deg = (Math.acos(cosPhi0) * 180.0) / Math.PI;
    this.state.spontaneousTrsPhaseDeg = parseFloat(phi0Deg.toFixed(1));

    // d+id 拓撲手性能隙 Δ_{topo} (meV) ∝ J₂ sin(φ₀)
    const sinPhi0 = Math.sin((phi0Deg * Math.PI) / 180.0);
    const topoGap = 4.2 * j2 * sinPhi0 * (1.0 + 0.15 * Math.tanh(ratioJ2J1));
    this.state.chiralTopologicalGapMev = parseFloat(topoGap.toFixed(2));

    // 分數夏皮羅階梯 h/4e 可見度 V_{4e}
    const shapiroVis = Math.min(0.99, Math.tanh(ratioJ2J1 * 0.42) * (0.35 + 0.65 * sinPhi0));
    this.state.fractionalShapiroVisibility = parseFloat(shapiroVis.toFixed(2));

    // 約瑟夫森二極體非互易整流效率 η_{JDE} (%)
    const diodePct = Math.min(68.0, 58.0 * sinPhi0 * Math.tanh(j2 * 0.38));
    this.state.josephsonDiodeRectificationPct = parseFloat(diodePct.toFixed(1));

    // 生成 16 個雙層 d_{x²-y²} + i d_{xy} 超導配對瓣與半磁通渦旋節點
    const nodes: CuprateFermiLobeNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const layerIndex: 1 | 2 = i < 8 ? 1 : 2;
      const idx = i % 8;
      const baseAngle = (idx / 8) * 2.0 * Math.PI;
      const layerTwist = layerIndex === 2 ? thetaRad : 0.0;
      const angle = baseAngle + layerTwist + this.state.pulsePhase * 0.25;

      // d-wave 四葉草包絡 r(θ)
      const dEnvelope = 0.55 + 0.45 * Math.abs(Math.cos(2.0 * baseAngle));
      const radius = (layerIndex === 1 ? 88 : 104) * dEnvelope;

      const x = 165 + radius * Math.cos(angle);
      const y = 160 + radius * Math.sin(angle);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        layerIndex,
        dWaveSign: idx % 2 === 0 ? 1 : -1,
        topologicalGapMev: parseFloat(topoGap.toFixed(1)),
        semifluxonCirculation: parseFloat((0.5 * sinPhi0).toFixed(2))
      });
    }
    this.state.lobeNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.8 + this.state.interlayerCouplingJ2Mev * 0.25;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerTwistedCuprateSound(): void {
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
      const osc2e = this.audioCtx.createOscillator();
      const osc4e = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc2e.type = 'sine';
      osc4e.type = 'triangle';

      // 一階 2e 與二階 4e 倍頻約瑟夫森電漿共振雙音
      const fBase = 260 + this.state.chiralTopologicalGapMev * 12;
      osc2e.frequency.setValueAtTime(fBase, t);
      osc2e.frequency.exponentialRampToValueAtTime(fBase * 1.25, t + 0.34);

      osc4e.frequency.setValueAtTime(fBase * 2.0, t);
      osc4e.frequency.exponentialRampToValueAtTime(fBase * 2.5, t + 0.34);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.16, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc2e.connect(gain);
      osc4e.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc2e.start(t);
      osc4e.start(t);
      osc2e.stop(t + 0.57);
      osc4e.stop(t + 0.57);
    } catch (e) {
      console.warn('Web Audio playback failed in TwistedCuprateHighTcJosephsonEngine:', e);
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

export const twistedCuprateHighTcJosephsonEngine = new TwistedCuprateHighTcJosephsonEngine();
