/**
 * 宇宙軸子弦-疇壁網路湮滅與納赫茲隨機引力波背景譜儀引擎
 * (Cosmic Axion String-Domain Wall Network Annihilation & Nano-Hertz Gravitational-Wave Background Engine)
 *
 * 物理原理：
 * 1. 當早期宇宙佩切伊-奎因對稱性 U(1)_{PQ} 在暴脹結束後自發破缺 (破缺能標 f_a \sim 10^{10} - 10^{15} GeV)，
 *    根據 Kibble 機制形成整體宇宙「軸子弦」(Global Cosmic Axion Strings) 網路，並在輻射主導時期進入標度演化區間
 *    (Scaling Regime, 每個哈伯視界內維持 \xi \sim \ln(f_a / H) 條軸子弦)，持續輻射無標度引力波與相對論性軸子。
 * 2. 當宇宙冷卻至 QCD 瞬子相變溫度 T \sim \Lambda_{QCD} 時，軸子獲得週期位勢 V(a) \propto 1 - \cos(N_{DW} a / f_a)，
 *    每條軸子弦邊界拉出 N_{DW} 張「軸子疇壁」(Axion Domain Walls，表面張力 \sigma_{wall} \approx 8 m_a f_a^2)。
 * 3. 若疇壁數 N_{DW} = 1 (或存在微弱顯式破缺偏置 \Delta V_{bias})，弦-疇壁混合網路在表面張力牽引下發生劇烈坍縮與集體湮滅，
 *    釋放出峰值落在納赫茲 (nHz, 脈衝星計時陣列 PTA 頻段，展現 Hellings-Downs 四極角相關曲線) 至毫赫茲 (mHz, LISA 頻段)
 *    之高強度「隨機引力波背景」(Stochastic Gravitational-Wave Background, \Omega_{GW}(f) h^2)。
 */

export type AxionStringWallRegime =
  | 'post-inflation-scaling-axion-string-loops'
  | 'ndw-one-string-wall-ribbon-collapse'
  | 'biased-ndw-greater-one-nanohertz-pta-peak'
  | 'hellings-downs-pulsar-quadrupole-lock';

export interface AxionStringWallLoopNode {
  id: number;
  x: number;
  y: number;
  defectStructure: 'global-axion-string-loop' | 'domain-wall-ribbon' | 'hellings-downs-pulsar';
  surfaceTensionEnergyLog: number;
  gwStrainCharacteristicLog: number;
  hellingsDownsCorrelation: number;
}

export interface AxionStringDomainWallGwState {
  pecceiQuinnScaleLogGeV: number;         // 佩切伊-奎因對稱破缺能標對數 log10(f_a / GeV) (10.0 ~ 15.5)
  domainWallNumberNdw: number;            // 軸子色反常疇壁拓撲數 N_{DW} (1, 2, 3, 6)
  stringScalingParameterXi: number;       // 每個哈伯體積內軸子弦對數標度參數 \xi = \ln(f_a / H)
  peakGwDensityLogOmegaH2: number;        // 隨機引力波背景峰值能量密度對數 log10(\Omega_{GW} h^2)
  peakFrequencyLogHz: number;             // 弦-疇壁湮滅引力波峰值頻率對數 log10(f_{peak} / Hz) (-9.5 ~ -2.0)
  hellingsDownsQuadrupoleSnr: number;     // 脈衝星計時陣列 Hellings-Downs 四極空間相關訊噪比 SNR_{HD}
  activeRegime: AxionStringWallRegime;
  pulsePhase: number;
  networkNodes: AxionStringWallLoopNode[];
}

const STORAGE_KEY = 'newworld_axion_string_domain_wall_gw_state_v1';

export class AxionStringDomainWallGwBackgroundEngine {
  private state: AxionStringDomainWallGwState;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.state = this.loadState();
    this.recomputePhysics();
  }

  private loadState(): AxionStringDomainWallGwState {
    const defaults: AxionStringDomainWallGwState = {
      pecceiQuinnScaleLogGeV: 14.2,
      domainWallNumberNdw: 1,
      stringScalingParameterXi: 64.5,
      peakGwDensityLogOmegaH2: -8.12,
      peakFrequencyLogHz: -7.85,
      hellingsDownsQuadrupoleSnr: 14.8,
      activeRegime: 'biased-ndw-greater-one-nanohertz-pta-peak',
      pulsePhase: 0,
      networkNodes: []
    };

    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return { ...defaults, ...parsed };
        }
      } catch (e) {
        console.warn('Failed to load Axion String-Domain Wall GW state:', e);
      }
    }
    return defaults;
  }

  private saveState(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save Axion String-Domain Wall GW state:', e);
      }
    }
  }

  public getState(): Readonly<AxionStringDomainWallGwState> {
    return this.state;
  }

  public setPecceiQuinnScaleLog(logFa: number): void {
    this.state.pecceiQuinnScaleLogGeV = Math.max(10.0, Math.min(15.5, parseFloat(logFa.toFixed(2))));
    this.recomputePhysics();
    this.saveState();
  }

  public setDomainWallNumber(ndw: number): void {
    const allowed = [1, 2, 3, 6];
    const closest = allowed.reduce((prev, curr) => Math.abs(curr - ndw) < Math.abs(prev - ndw) ? curr : prev);
    this.state.domainWallNumberNdw = closest;
    this.recomputePhysics();
    this.saveState();
  }

  public setRegime(regime: AxionStringWallRegime): void {
    this.state.activeRegime = regime;
    switch (regime) {
      case 'post-inflation-scaling-axion-string-loops':
        this.state.pecceiQuinnScaleLogGeV = 12.0;
        this.state.domainWallNumberNdw = 1;
        break;
      case 'ndw-one-string-wall-ribbon-collapse':
        this.state.pecceiQuinnScaleLogGeV = 13.5;
        this.state.domainWallNumberNdw = 1;
        break;
      case 'biased-ndw-greater-one-nanohertz-pta-peak':
        this.state.pecceiQuinnScaleLogGeV = 14.4;
        this.state.domainWallNumberNdw = 3;
        break;
      case 'hellings-downs-pulsar-quadrupole-lock':
        this.state.pecceiQuinnScaleLogGeV = 14.8;
        this.state.domainWallNumberNdw = 6;
        break;
    }
    this.recomputePhysics();
    this.saveState();
  }

  public recomputePhysics(): void {
    const logFa = this.state.pecceiQuinnScaleLogGeV;
    const ndw = this.state.domainWallNumberNdw;

    // 軸子弦對數標度參數 \xi \approx \ln(f_a / H) \propto 4.5 * log10(f_a)
    const xi = 4.55 * logFa;
    this.state.stringScalingParameterXi = parseFloat(xi.toFixed(1));

    // 隨機引力波背景峰值能量密度對數 log10(\Omega_{GW} h^2)：隨 (f_a / M_{Pl})^4 與 N_{DW} 延遲湮滅增強
    const ndwBoost = Math.log10(ndw) * 1.15;
    const logOmega = -14.8 + 4.0 * (logFa - 12.5) * 0.72 + ndwBoost;
    this.state.peakGwDensityLogOmegaH2 = parseFloat(Math.max(-15.5, Math.min(-6.2, logOmega)).toFixed(2));

    // 引力波峰值頻率對數 log10(f_{peak} / Hz)：較高 f_a 與較大 N_{DW} 延遲湮滅溫度至 MeV ~ GeV 區間，對應 nHz (-8.0) 頻段
    const logFreq = -4.2 - 0.82 * (logFa - 10.5) - 0.35 * Math.log10(ndw);
    this.state.peakFrequencyLogHz = parseFloat(Math.max(-9.4, Math.min(-2.2, logFreq)).toFixed(2));

    // 脈衝星計時陣列 Hellings-Downs 四極空間相關訊噪比 SNR_{HD}
    const ptaBandResonance = Math.exp(-Math.pow(this.state.peakFrequencyLogHz - (-8.0), 2) / 3.5);
    const snr = Math.max(1.2, (16.5 + this.state.peakGwDensityLogOmegaH2) * 2.1 * (0.55 + 0.45 * ptaBandResonance));
    this.state.hellingsDownsQuadrupoleSnr = parseFloat(snr.toFixed(1));

    // 生成 16 個宇宙軸子弦迴圈、疇壁張力帶與 Hellings-Downs 毫秒脈衝星陣列節點
    const nodes: AxionStringWallLoopNode[] = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const defectType: 'global-axion-string-loop' | 'domain-wall-ribbon' | 'hellings-downs-pulsar' =
        i % 3 === 0 ? 'hellings-downs-pulsar' : i % 3 === 1 ? 'domain-wall-ribbon' : 'global-axion-string-loop';

      const angle = (i / count) * 2.0 * Math.PI + this.state.pulsePhase * (defectType === 'domain-wall-ribbon' ? -0.35 : 0.28);
      const r = defectType === 'global-axion-string-loop' ? 46 : defectType === 'domain-wall-ribbon' ? 74 : 98;

      const x = 165 + r * Math.cos(angle);
      const y = 160 + r * Math.sin(angle);

      // Hellings-Downs 四極相關函數 \zeta(\theta) = 1/2 - x/4 + (3/2) x \ln x, x = (1 - \cos\theta)/2
      const xHalf = Math.max(0.02, 0.5 * (1.0 - Math.cos(angle)));
      const hdVal = 0.5 - 0.25 * xHalf + 1.5 * xHalf * Math.log(xHalf);

      nodes.push({
        id: i,
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(1)),
        defectStructure: defectType,
        surfaceTensionEnergyLog: parseFloat((2.0 * logFa - 3.5).toFixed(1)),
        gwStrainCharacteristicLog: parseFloat((-14.6 + 0.5 * (this.state.peakGwDensityLogOmegaH2 + 8.0)).toFixed(2)),
        hellingsDownsCorrelation: parseFloat(hdVal.toFixed(3))
      });
    }
    this.state.networkNodes = nodes;
  }

  public update(dtSeconds: number): void {
    const speed = 0.72 + (this.state.hellingsDownsQuadrupoleSnr / 20.0) * 0.75;
    this.state.pulsePhase = (this.state.pulsePhase + dtSeconds * speed) % (Math.PI * 200);
    this.recomputePhysics();
  }

  public triggerAxionStringGwSound(): void {
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
      const oscString = this.audioCtx.createOscillator();
      const oscWall = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscString.type = 'sine';
      oscWall.type = 'triangle';

      // 軸子弦環振盪基頻與 N_{DW} 倍頻疇壁張力坍縮引力波爆發和弦
      const fBase = 210 + (this.state.pecceiQuinnScaleLogGeV - 10.0) * 42;
      const fWall = fBase * (1.0 + 0.25 * this.state.domainWallNumberNdw);

      oscString.frequency.setValueAtTime(fBase, t);
      oscString.frequency.exponentialRampToValueAtTime(fBase * 1.35, t + 0.42);

      oscWall.frequency.setValueAtTime(fWall, t);
      oscWall.frequency.exponentialRampToValueAtTime(fBase, t + 0.42);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.56);

      oscString.connect(gain);
      oscWall.connect(gain);
      gain.connect(this.audioCtx.destination);

      oscString.start(t);
      oscWall.start(t);
      oscString.stop(t + 0.58);
      oscWall.stop(t + 0.58);
    } catch (e) {
      console.warn('Web Audio playback failed in AxionStringDomainWallGwBackgroundEngine:', e);
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

export const axionStringDomainWallGwBackgroundEngine = new AxionStringDomainWallGwBackgroundEngine();
