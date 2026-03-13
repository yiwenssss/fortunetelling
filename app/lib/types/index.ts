/**
 * Core type definitions for fortunetelling app
 */

/** User birth profile */
export interface BirthProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  gender: 'M' | 'F' | '男' | '女';
  timezone?: string; // For future: timezone offset
}

/** BaZi (Four Pillars) chart */
export interface BaZiChart {
  year: string; // 天干地支
  month: string;
  day: string;
  hour: string;
  dayMaster: string; // 日主
  dayMasterElement: string; // 金木水火土
  hiddenStems: Record<string, string[]>; // 天干藏干
}

/** Ziwei (Purple Wealth) palace */
export interface ZiweiPalace {
  name: string; // 命 财 感情 etc
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: string[];
  minorStars: string[];
  adjunctiveStars: string[];
  brightnesses: Record<string, 'bright' | 'dim' | 'mute'>;
}

/** Ziwei chart response */
export interface ZiweiChart {
  palaces: ZiweiPalace[];
  soulAndBody: {
    soul: string;
    body: string;
  };
  fiveElementsClass: string;
  zodiac: string;
  horoscope: string;
}

/** Daily luck reading (万年历) */
export interface DailyLuck {
  date: string; // YYYY-MM-DD
  lunarDate: string; // 农历说法
  heavenlyStem: string; // 天干
  earthlyBranch: string; // 地支
  zodiacSign: string;
  auspiciousActivities: string[];
  inauspiciousActivities: string[];
  fortuneLevel: 'excellent' | 'good' | 'neutral' | 'poor';
}

/** Chat message in streaming context */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Claude API streaming response */
export interface StreamingResponse {
  type: 'start' | 'delta' | 'stop' | 'error';
  content?: string;
  error?: string;
}

/** Stored user reading (localStorage) */
export interface StoredReading {
  id: string;
  profile: BirthProfile;
  baziChart: BaZiChart;
  ziweiChart: ZiweiChart;
  interpretation: string;
  createdAt: number;
  language: 'zh-CN' | 'en';
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
