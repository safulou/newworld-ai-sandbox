/**
 * stringNetCondensate.ts
 * 全息共形場宇宙弦網冷凝引擎 (CFT String-Net Condensate Engine)
 * 
 * 物理與凝聚態模擬：
 * 1. 文小剛 (Xiao-Gang Wen) 拓撲物態理論：光子與電子自真空弦網凝聚態中湧現。
 * 2. 閉合量子自旋弦迴路的波動湧現為 U(1) 規範玻色子（Maxwell 電磁場與光子）。
 * 3. 開放弦的末端斷裂點湧現為帶電與自旋之費米子準粒子（電子 / 夸克）。
 * 4. 4 大弦網凝聚態拓撲相（斐波那契非阿貝爾任意子、Z2 Toric Code、雙重半子 Doubled Semion、SU(2)_k 量子相）。
 * 5. 分支融合規則 (String Branching & Fusion: i x j -> \sum N_{ij}^k k) 與拓撲基態簡併度演算。
 * 6. 純代碼 Web Audio 合成分支融合微晶音、湧現電磁波諧振與拓撲基態低頻震鳴。
 */

export type StringNetPhase = 'fibonacci_anyon_net' | 'toric_code_z2' | 'semion_doubled' | 'su2_level_k';

export interface StringNetConfig {
  id: StringNetPhase;
  name: string;
  desc: string;
  degeneracy: number; // 拓撲基態簡併度 D
  anyonType: string;
  emergentSpeed: number;
  baseFreq: number;
}

export const STRING_NET_PHASES: Record<StringNetPhase, StringNetConfig> = {
  fibonacci_anyon_net: {
    id: 'fibonacci_anyon_net',
    name: '斐波那契非阿貝爾任意子弦網 (Fibonacci Anyons)',
    desc: '黃金分割比拓撲維度 (d = (1+√5)/2)，具通用拓撲量子計算編織能力之頂級基態',
    degeneracy: 5,
    anyonType: 'Non-Abelian τ',
    emergentSpeed: 1.5,
    baseFreq: 523.25, // C5
  },
  toric_code_z2: {
    id: 'toric_code_z2',
    name: 'Z₂ 拓撲規範理論弦網 (Kitaev Toric Code)',
    desc: '環面四重拓撲簡併度，星算符與環算符對易保護之經典自旋液體',
    degeneracy: 4,
    anyonType: 'Abelian e/m/ε',
    emergentSpeed: 1.0,
    baseFreq: 392.0, // G4
  },
  semion_doubled: {
    id: 'semion_doubled',
    name: '雙重半子手性凝聚態 (Doubled Semion Phase)',
    desc: '時間反演對稱半子網絡，統計角 θ = π/2，呈現超導玻色流體邊緣對偶',
    degeneracy: 4,
    anyonType: 'Semion s & anti-s',
    emergentSpeed: 1.25,
    baseFreq: 440.0, // A4
  },
  su2_level_k: {
    id: 'su2_level_k',
    name: 'SU(2)ₖ 量子仿射代數相 (Quantum Group SU(2)₂)',
    desc: '三維微觀 Chern-Simons 體空間邊界共形場論 (CFT) 對偶，生成極限高能規範波',
    degeneracy: 3,
    anyonType: 'Ising Anyons (1, σ, ψ)',
    emergentSpeed: 1.8,
    baseFreq: 659.25, // E5
  },
};

const STORAGE_KEY = 'newworld_string_net_condensate_state_v1';

export class StringNetCondensateEngine {
  private static instance: StringNetCondensateEngine | null = null;

  public currentPhase: StringNetPhase = 'fibonacci_anyon_net';
  public condensatePurity: number = 92.4; // 0 ~ 100%
  public stringBranchDensity: number = 1.15; // 0.2 ~ 2.5
  public emergentPhotonsFlux: number = 1250.0; // 湧現光子通量
  public emergentFermionsCount: number = 88; // 湧現費米子準粒子端點數
  public totalFusions: number = 0;

  // Web Audio
  private audioCtx: AudioContext | null = null;

  private constructor() {
    this.loadState();
  }

  public static getInstance(): StringNetCondensateEngine {
    if (!StringNetCondensateEngine.instance) {
      StringNetCondensateEngine.instance = new StringNetCondensateEngine();
    }
    return StringNetCondensateEngine.instance;
  }

  /**
   * 拓撲基態簡併度
   */
  public get groundStateDegeneracy(): number {
    return STRING_NET_PHASES[this.currentPhase].degeneracy;
  }

  /**
   * 執行弦分支融合 (Branching & Fusion)
   * 閉合更多微觀弦迴路，提升湧現電磁波通量與凝聚純度
   */
  public triggerBranchFusion(): void {
    const phaseCfg = STRING_NET_PHASES[this.currentPhase];
    this.condensatePurity = Math.min(100, this.condensatePurity + 1.8);
    this.emergentPhotonsFlux += 85.0 * phaseCfg.emergentSpeed * (this.condensatePurity / 100);
    this.totalFusions++;

    this.playStringFusionChime();
    this.saveState();
  }

  /**
   * 激發開弦端點，湧現一對費米子準粒子
   */
  public exciteFermionPair(): void {
    if (this.condensatePurity < 15) return;
    this.condensatePurity = Math.max(10, this.condensatePurity - 2.5);
    this.emergentFermionsCount += 2;
    this.emergentPhotonsFlux += 40.0;

    this.playEmergentWaveformTone();
    this.saveState();
  }

  /**
   * 淨化真空基態，修復熱漲落引發的弦斷裂
   */
  public purifyGroundState(): void {
    this.condensatePurity = Math.min(100, this.condensatePurity + 14.5);
    this.playDegeneracyHum();
    this.saveState();
  }

  /**
   * 調控弦分支密度
   */
  public setBranchDensity(density: number): void {
    this.stringBranchDensity = Math.max(0.2, Math.min(2.5, density));
    this.saveState();
  }

  /**
   * 切換弦網凝聚態拓撲相
   */
  public setPhase(phase: StringNetPhase): void {
    this.currentPhase = phase;
    this.playPhaseSwitchHarmonic();
    this.saveState();
  }

  /**
   * 主迴圈更新
   */
  public update(dt: number): void {
    // 依據弦密度與純度自然湧現電磁通量
    const phaseCfg = STRING_NET_PHASES[this.currentPhase];
    const generationRate = 4.5 * this.stringBranchDensity * (this.condensatePurity / 100) * phaseCfg.emergentSpeed;
    this.emergentPhotonsFlux += generationRate * dt;

    // 極微量熱退火純度波動
    if (this.condensatePurity > 50) {
      this.condensatePurity = Math.max(50, this.condensatePurity - 0.05 * dt);
    }
  }

  // ================= 音效合成 (純 Web Audio API) =================

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  /**
   * 弦網分支融合晶瑩雙音 (Fusion Chime)
   */
  public playStringFusionChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const baseFreq = STRING_NET_PHASES[this.currentPhase].baseFreq;

      [baseFreq, baseFreq * 1.5, baseFreq * 2.0].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + idx * 0.04);
        gain.gain.setValueAtTime(0.18, t + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.04);
        osc.stop(t + idx * 0.04 + 0.32);
      });
    } catch {
      // 靜默處理
    }
  }

  /**
   * 湧現費米子與光子震盪音 (Emergent Waveform Tone)
   */
  public playEmergentWaveformTone(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const baseFreq = STRING_NET_PHASES[this.currentPhase].baseFreq;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.75, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, t + 0.35);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.42);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 拓撲基態低頻震鳴 (Degeneracy Hum)
   */
  public playDegeneracyHum(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110.0, t); // A2
      osc.frequency.setValueAtTime(164.81, t + 0.2); // E3
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    } catch {
      // 靜默處理
    }
  }

  /**
   * 拓撲相變切換和弦
   */
  public playPhaseSwitchHarmonic(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const t = ctx.currentTime;
      const f = STRING_NET_PHASES[this.currentPhase].baseFreq;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } catch {
      // 靜默處理
    }
  }

  // ================= 儲存與讀取 =================

  public saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = {
        currentPhase: this.currentPhase,
        condensatePurity: this.condensatePurity,
        stringBranchDensity: this.stringBranchDensity,
        emergentPhotonsFlux: this.emergentPhotonsFlux,
        emergentFermionsCount: this.emergentFermionsCount,
        totalFusions: this.totalFusions,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // 忽略
    }
  }

  public loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.currentPhase && STRING_NET_PHASES[parsed.currentPhase as StringNetPhase]) {
        this.currentPhase = parsed.currentPhase as StringNetPhase;
      }
      if (typeof parsed.condensatePurity === 'number') this.condensatePurity = parsed.condensatePurity;
      if (typeof parsed.stringBranchDensity === 'number') this.stringBranchDensity = parsed.stringBranchDensity;
      if (typeof parsed.emergentPhotonsFlux === 'number') this.emergentPhotonsFlux = parsed.emergentPhotonsFlux;
      if (typeof parsed.emergentFermionsCount === 'number') this.emergentFermionsCount = parsed.emergentFermionsCount;
      if (typeof parsed.totalFusions === 'number') this.totalFusions = parsed.totalFusions;
    } catch {
      // 忽略
    }
  }
}

export const stringNetCondensate = StringNetCondensateEngine.getInstance();
