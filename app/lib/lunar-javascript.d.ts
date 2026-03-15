/**
 * Type declarations for lunar-javascript
 * This library doesn't provide @types, so we declare it here
 */

declare module 'lunar-javascript' {
  export class Solar {
    constructor(year: number, month: number, day: number);
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): Lunar;
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
  }

  export class Lunar {
    constructor(year: number, month: number, day: number, isLeap?: boolean);
    getLunarYear(): number;
    getLunarMonth(): number;
    getLunarDay(): number;
    getLunarMonthInChinese(): string;
    getLunarDayInChinese(): string;
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getZodiac(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getShengxiao(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getYearInGanZhi(): string;
  }
}
