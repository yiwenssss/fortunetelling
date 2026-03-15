/**
 * Calendar and daily luck utilities using lunar-javascript
 */

import { DailyLuck } from '../types';
import { Solar } from 'lunar-javascript';

/**
 * Get daily luck information for a specific date
 * Includes lunar info, auspicious/inauspicious activities, fortune level
 */
export async function getDailyLuck(dateString: string): Promise<DailyLuck> {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Convert solar to lunar date
    const solar = (Solar as any).fromYmd(year, month, day);
    const lunarDate = solar.getLunar();
    if (!lunarDate) {
      throw new Error('Invalid date');
    }
    
    // Get lunar representation with 天干地支
    const lunarMonthInChinese = lunarDate.getMonthInChinese();
    const lunarDayInChinese = lunarDate.getDayInChinese();
    const lunarDateStr = `农历${lunarMonthInChinese}${lunarDayInChinese}`;
    
    // Get heavenly stem and earthly branch for the day
    const heavenlyStem = lunarDate.getDayGan();
    const earthlyBranch = lunarDate.getDayZhi();
    
    // Get zodiac
    const zodiac = lunarDate.getShengxiao();
    
    // Simple auspicious/inauspicious activities based on 天干地支
    // This is simplified - a full implementation would use 黄历 rules
    const activities = getActivitiesForDay(heavenlyStem, earthlyBranch);
    
    // Simplified fortune level based on stem-branch combination
    const fortuneLevel = getFortuneLevelForDay(heavenlyStem, earthlyBranch);
    
    return {
      date: dateString,
      lunarDate: lunarDateStr,
      heavenlyStem,
      earthlyBranch,
      zodiacSign: zodiac,
      auspiciousActivities: activities.auspicious,
      inauspiciousActivities: activities.inauspicious,
      fortuneLevel,
    };
  } catch (error) {
    console.error('Error getting daily luck:', error);
    throw new Error(`Failed to get daily luck: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get auspicious and inauspicious activities for a day
 * Based on simplified 黄历 rules using 天干地支
 */
function getActivitiesForDay(
  heavenlyStem: string,
  earthlyBranch: string
): { auspicious: string[]; inauspicious: string[] } {
  // Simplified mapping - in production would use proper 黄历 database
  // This is a very basic approximation
  
  const stemEnergyMap: Record<string, string[]> = {
    '甲': ['木性', '东方', '生长'],
    '乙': ['木性', '东方', '柔软'],
    '丙': ['火性', '南方', '热情'],
    '丁': ['火性', '南方', '温和'],
    '戊': ['土性', '中央', '包容'],
    '己': ['土性', '中央', '务实'],
    '庚': ['金性', '西方', '肃杀'],
    '辛': ['金性', '西方', '精细'],
    '壬': ['水性', '北方', '流动'],
    '癸': ['水性', '北方', '静深'],
  };
  
  const branchEnergyMap: Record<string, string[]> = {
    '子': ['冬季', '夜间', '静寂'],
    '卯': ['春季', '清晨', '生长'],
    '午': ['夏季', '正午', '旺盛'],
    '酉': ['秋季', '黄昏', '收获'],
  };
  
  // Get energy associations
  const stemEnergy = stemEnergyMap[heavenlyStem] || [];
  const branchEnergy = branchEnergyMap[earthlyBranch] || [];
  
  // Based on energy associations, recommend activities
  // This is a simplified heuristic
  let auspicious: string[] = [];
  let inauspicious: string[] = [];
  
  if (stemEnergy.includes('生长') || branchEnergy.includes('生长')) {
    auspicious.push('祈福', '种植', '搬迁', '开业');
  } else if (stemEnergy.includes('收获') || branchEnergy.includes('收获')) {
    auspicious.push('收获', '交易', '签约', '开业');
  }
  
  if (stemEnergy.includes('肃杀') || stemEnergy.includes('静深')) {
    inauspicious.push('婚嫁', '进宅', '动土');
  }
  
  // Default if not set
  if (auspicious.length === 0) {
    auspicious = ['祈福', '出行', '学习'];
  }
  if (inauspicious.length === 0) {
    inauspicious = ['破土', '手术'];
  }
  
  return { auspicious, inauspicious };
}

/**
 * Determine fortune level for a day
 * Based on 天干地支 compatibility
 */
function getFortuneLevelForDay(heavenlyStem: string, earthlyBranch: string): 'excellent' | 'good' | 'neutral' | 'poor' {
  // Simplified rules:
  // 干支相生为吉，相克为凶，比和为中
  
  const generatingPairs = new Set([
    '甲卯', '乙辰', '丙午', '丁未', '戊午', '己未', '庚申', '辛酉', '壬亥', '癸子',
  ]);
  
  const clashingPairs = new Set([
    '甲庚', '乙辛', '丙壬', '丁癸', '戊甲', '己乙', '庚丙', '辛丁', '壬戊', '癸己',
  ]);
  
  const pair = heavenlyStem + earthlyBranch;
  
  if (generatingPairs.has(pair)) {
    return 'excellent'; // 相生大吉
  } else if (clashingPairs.has(pair)) {
    return 'poor'; // 相克不利
  } else {
    return 'neutral'; // 其他为平常
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get lunar date string for display
 */
export function formatLunarDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const solar = (Solar as any).fromYmd(year, month, day);
    const lunarDate = solar.getLunar();
    if (!lunarDate) return dateString;
    
    const lunarMonth = lunarDate.getLunarMonth();
    const lunarDay = lunarDate.getLunarDay();
    
    return `农历${lunarMonth}月${lunarDay}日`;
  } catch (error) {
    console.error('Error formatting lunar date:', error);
    return dateString;
  }
}
