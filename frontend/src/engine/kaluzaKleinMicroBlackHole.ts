/**
 * 卡魯扎-克萊因高維引力微型黑洞探針 (Kaluza-Klein Microscopic Black Hole Probe)
 * 
 * 理論基礎：
 * 1. 卡魯扎-克萊因大額外維度與膜世界 (Kaluza-Klein & ADD/RS Braneworld, Arkani-Hamed et al. 1998, Randall & Sundrum 1999)
 *    時空維度 D = 4 + d，引力在微觀額外維度緊緻化半徑 R_KK 自由傳播，
 *    真實基本普朗克標度 M_* 大幅降至 TeV 規模 (M_* ~ 1 - 10 TeV)。
 * 2. 高維微型黑洞成核截面 (Micro Black Hole Production, Giddings & Thomas 2002, Dimopoulos & Landsberg 2001):
 *    當對撞質心能量 √s > M_*，引力坍縮成核生成微觀黑洞，視界半徑 r_H ∝ (M_BH / M_*)^(1/(d+1))。
 * 3. 四階段霍金爆炸蒸發動力學 (Four-Stage Hawking Evaporation):
 *    Balding 階段 → Spin-down 旋轉輻射 → Hawking 熱蒸發 → 普朗克殘餘 (Planck Remnant) 終極爆炸。
 * 4. 4 大高維重力探測體制：
 *    - tev_scale_gravity_blackhole: TeV 標度大額外維度微型黑洞成核
 *    - kk_graviton_tower_emission: 緊緻化維度卡魯扎-克萊因重力子塔發射
 *    - four_stage_hawking_evaporation: 四階段高維黑洞爆炸蒸發遙測
 *    - planck_remnant_string_ball: 普朗克微殘餘與弦球態超對稱轉化
 * 
 * 特色：
 * - 純代碼 Web Audio 程序化合成高能質子對撞重力坍縮衝擊音、微黑洞霍金爆裂白噪聲、KK 塔量子階梯泛音
 * - HTML5 Canvas 2D 呈現高維卡拉比-丘 / 緊緻化環面圓柱投影、微型黑洞事件視界、多重等方性強子噴流簇射
 * - 客戶端本地持久化 (BYOK 隱私保護)
 */

export type KKRegime = 
  | 'tev_scale_gravity_blackhole' 
  | 'kk_graviton_tower_emission' 
  | 'four_stage_hawking_evaporation' 
  | 'planck_remnant_string_ball';

export interface BlackHoleEvaporationRecord {
  id: string;
  massTev: number;
  horizonRadiusAttometer: number; // 視界半徑 (10^-18 m)
  temperatureGev: number;
  multiplicityJets: number; // 噴流多重度
  timestamp: number;
}

export interface KaluzaKleinBlackHoleState {
  regime: KKRegime;
  extraDimensionsCount: number; // 額外維度數 d (2 ~ 6)
  fundamentalPlanckScaleTev: number; // 基本普朗克能標 M_* (1.0 ~ 10.0 TeV)
  collisionEnergyTev: number; // 對撞質心能 √s (6.0 ~ 28.0 TeV)
  horizonRadiusAttometer: number; // 視界半徑 r_H (am)
  hawkingTemperatureGev: number; // 高維霍金溫度 T_H (GeV)
  kkGravitonEmissionRateMegaHz: number; // 重力子塔輻射率 (MHz)
  totalMicroBlackHolesFormed: number;
  autoColliderLuminosity: boolean;
  evaporationHistory: BlackHoleEvaporationRecord[];
}

const STORAGE_KEY = 'newworld_kaluza_klein_micro_blackhole';

class KaluzaKleinBlackHoleEngine {
  private state: KaluzaKleinBlackHoleState = {
    regime: 'tev_scale_gravity_blackhole',
    extraDimensionsCount: 3,
    fundamentalPlanckScaleTev: 2.4,
    collisionEnergyTev: 14.0,
    horizonRadiusAttometer: 1.85,
    hawkingTemperatureGev: 180.4,
    kkGravitonEmissionRateMegaHz: 8.42,
    totalMicroBlackHolesFormed: 28,
    autoColliderLuminosity: true,
    evaporationHistory: []
  };

  private audioCtx: AudioContext | null = null;

  constructor() {
    this.loadState();
    this.recomputeKKPhysics();
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public getState(): KaluzaKleinBlackHoleState {
    return { ...this.state, evaporationHistory: [...this.state.evaporationHistory] };
  }

  public setRegime(regime: KKRegime): void {
    this.state.regime = regime;
    switch (regime) {
      case 'tev_scale_gravity_blackhole':
        this.state.extraDimensionsCount = 3;
        this.state.fundamentalPlanckScaleTev = 2.4;
        break;
      case 'kk_graviton_tower_emission':
        this.state.extraDimensionsCount = 2;
        this.state.fundamentalPlanckScaleTev = 1.8;
        break;
      case 'four_stage_hawking_evaporation':
        this.state.extraDimensionsCount = 4;
        this.state.fundamentalPlanckScaleTev = 3.2;
        break;
      case 'planck_remnant_string_ball':
        this.state.extraDimensionsCount = 6;
        this.state.fundamentalPlanckScaleTev = 5.0;
        break;
    }
    this.recomputeKKPhysics();
    this.playGravitonChime();
    this.saveState();
  }

  public setDimensions(d: number): void {
    this.state.extraDimensionsCount = Math.max(2, Math.min(6, Math.round(d)));
    this.recomputeKKPhysics();
    this.saveState();
  }

  public setPlanckScale(tev: number): void {
    this.state.fundamentalPlanckScaleTev = Math.max(1.0, Math.min(10.0, parseFloat(tev.toFixed(1))));
    this.recomputeKKPhysics();
    this.saveState();
  }

  public setCollisionEnergy(tev: number): void {
    this.state.collisionEnergyTev = Math.max(6.0, Math.min(28.0, parseFloat(tev.toFixed(1))));
    this.recomputeKKPhysics();
    this.saveState();
  }

  public toggleColliderLuminosity(): void {
    this.state.autoColliderLuminosity = !this.state.autoColliderLuminosity;
    this.saveState();
  }

  public triggerBlackHoleCollapse(): void {
    const jets = Math.floor(12 + Math.random() * 16);
    const item: BlackHoleEvaporationRecord = {
      id: 'bh-' + Date.now().toString(36),
      massTev: parseFloat((this.state.collisionEnergyTev * (0.85 + Math.random() * 0.14)).toFixed(2)),
      horizonRadiusAttometer: parseFloat((this.state.horizonRadiusAttometer * (0.9 + Math.random() * 0.2)).toFixed(3)),
      temperatureGev: parseFloat((this.state.hawkingTemperatureGev * (0.95 + Math.random() * 0.1)).toFixed(1)),
      multiplicityJets: jets,
      timestamp: Date.now()
    };
    this.state.evaporationHistory.unshift(item);
    if (this.state.evaporationHistory.length > 20) {
      this.state.evaporationHistory.pop();
    }
    this.state.totalMicroBlackHolesFormed += 1;
    this.playCollapseBurst();
    this.saveState();
  }

  public update(deltaSeconds: number): void {
    if (this.state.autoColliderLuminosity) {
      const wobble = Math.sin(Date.now() / 2200) * 0.2;
      this.state.kkGravitonEmissionRateMegaHz = parseFloat((8.5 + wobble).toFixed(2));
    }

    if (Math.random() < 0.2 * deltaSeconds) {
      this.triggerBlackHoleCollapse();
    }
  }

  private recomputeKKPhysics(): void {
    const d = this.state.extraDimensionsCount;
    const mStar = this.state.fundamentalPlanckScaleTev;
    const s = this.state.collisionEnergyTev;

    // 高維視界半徑 r_H ∝ (s / mStar)^(1 / (d + 1))
    const rH = Math.pow(s / mStar, 1.0 / (d + 1.0)) * 1.1;
    this.state.horizonRadiusAttometer = parseFloat(rH.toFixed(3));

    // 高維霍金溫度 T_H ∝ (d + 1) / (4π r_H)
    const tH = ((d + 1.0) / (4.0 * Math.PI * rH)) * 800.0;
    this.state.hawkingTemperatureGev = parseFloat(tH.toFixed(1));

    // KK 塔發射率
    const rate = 4.0 + (s / mStar) * 0.8 + d * 0.5;
    this.state.kkGravitonEmissionRateMegaHz = parseFloat(rate.toFixed(2));
  }

  // --- Web Audio 程序化合成 ---

  public playCollapseBurst(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 質子碰撞坍縮衝擊低音 (頻率快速下掃)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch { /* ignore */ }
  }

  public playGravitonChime(): void {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // 卡魯扎-克萊因高維引力子階梯泛音
      [220, 440, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25 + idx * 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch { /* ignore */ }
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch { /* ignore */ }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* ignore */ }
  }
}

export const kaluzaKleinBlackHoleEngine = new KaluzaKleinBlackHoleEngine();
