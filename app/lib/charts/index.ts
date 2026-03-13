/**
 * Chart computation utilities using iztro for Ziwei and lunar-javascript for BaZi
 */

import { BirthProfile, BaZiChart, ZiweiChart } from '../types';
import { astro } from 'iztro';
import { Solar } from 'lunar-javascript';

/**
 * Compute Ziwei chart using iztro
 */
export async function computeZiweiChart(profile: BirthProfile): Promise<ZiweiChart> {
  try {
    // Parse date and convert to format iztro expects
    const [year, month, day] = profile.birthDate.split('-').map(Number);
    const [hour] = profile.birthTime.split(':').map(Number);
    
    // Convert hour to iztro format (1-12 in UTC+8 time system)
    // Note: iztro uses traditional Chinese hour system
    const iztroHour = ((hour - 1) % 12) + 1 || 12;
    const gender = profile.gender === 'M' || profile.gender === '男' ? '男' : '女';
    
    // Call iztro to get Ziwei chart
    const astrolabe = astro.bySolar(
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      iztroHour,
      gender,
      false, // not leap month flag
      'en' // language
    );
    
    // Transform iztro output to our format
    const palaces = astrolabe.palaces?.map((palace: any) => ({
      name: palace.name || 'unknown',
      heavenlyStem: palace.heavenlyStem || '',
      earthlyBranch: palace.earthlyBranch || '',
      majorStars: palace.stars?.map((s: any) => s.name || s) || [],
      minorStars: palace.minorStars?.map((s: any) => s.name || s) || [],
      adjunctiveStars: palace.adjunctiveStars?.map((s: any) => s.name || s) || [],
      brightnesses: {},
    })) || [];
    
    return {
      palaces,
      soulAndBody: { soul: '', body: '' },
      fiveElementsClass: '',
      zodiac: astrolabe.zodiac || '',
      horoscope: '',
    };
  } catch (error) {
    console.error('Error computing Ziwei chart:', error);
    throw new Error(`Failed to compute Ziwei chart: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Compute BaZi chart using lunar-javascript
 * Returns Four Pillars (天干地支) for year, month, day, hour
 */
export async function computeBaZiChart(profile: BirthProfile): Promise<BaZiChart> {
  try {
    const [year, month, day] = profile.birthDate.split('-').map(Number);
    const [hour, minute] = profile.birthTime.split(':').map(Number);
    
    // Create lunar date object from solar date
    const solar = (Solar as any).fromYmd(year, month, day);
    const date = solar.getLunar();
    
    if (!date) {
      throw new Error('Invalid date for lunar conversion');
    }
    
    // Get 天干地支 (heavenly stem and earthly branch)
    // Format: 天干 + 地支
    const yearPillar = date.getYearInGanZhi(); // e.g., "甲子"
    const monthPillar = date.getMonthInGanZhi(); // computed from lunar month
    const dayPillar = date.getDayInGanZhi(); // computed from lunar day
    
    // Hour pillar computation (based on day master stem and hour)
    // This requires knowing the day master and hour
    // Simplified: compute from hour
    const hourPillar = getHourPillar(hour, dayPillar);
    
    // Extract day master (日主) - first character of day pillar
    const dayMaster = dayPillar.charAt(0);
    const dayMasterElement = getStemElement(dayMaster);
    
    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      dayMaster: dayMaster,
      dayMasterElement: dayMasterElement,
      hiddenStems: getHiddenStems(monthPillar, dayPillar),
    };
  } catch (error) {
    console.error('Error computing BaZi chart:', error);
    throw new Error(`Failed to compute BaZi chart: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get heavenly stem element (金木水火土)
 */
function getStemElement(stem: string): string {
  const elements: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
  };
  return elements[stem] || 'unknown';
}

/**
 * Compute hour pillar from hour and day master
 * Simplified version - full version would use more complex calculations
 */
function getHourPillar(hour: number, dayPillar: string): string {
  // Traditional Chinese calendar hour system
  // Hours are grouped into 12 branches starting from 23:00 (子时)
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  
  // Normalize hour (0-23) to branch (0-11)
  const normalizedHour = hour < 23 ? Math.floor((hour + 1) / 2) : 0;
  const branchIndex = normalizedHour % 12;
  
  // Calculate stem based on day master
  const dayMaster = dayPillar.charAt(0);
  const dayMasterIndex = stems.indexOf(dayMaster);
  const stemIndex = (dayMasterIndex + branchIndex) % 10;
  
  return stems[stemIndex] + branches[branchIndex];
}

/**
 * Get hidden stems (天干藏干) for each branch
 */
function getHiddenStems(monthPillar: string, dayPillar: string): Record<string, string[]> {
  // Simplified version - maps branches to their hidden stems
  const hiddenStemsMap: Record<string, string[]> = {
    '子': ['癸'], '丑': ['己', '癸', '辛'], '寅': ['甲', '丙', '戊'],
    '卯': ['乙'], '辰': ['戊', '乙', '癸'], '巳': ['丙', '戊', '庚'],
    '午': ['丁', '己'], '未': ['己', '丁', '乙'], '申': ['庚', '壬', '戊'],
    '酉': ['辛'], '戌': ['戊', '辛', '丁'], '亥': ['壬', '甲'],
  };
  
  return {
    month: hiddenStemsMap[monthPillar.charAt(1)] || [],
    day: hiddenStemsMap[dayPillar.charAt(1)] || [],
  };
}

/**
 * Format BaZi chart for display
 */
export function formatBaZiChart(chart: BaZiChart): string {
  return `${chart.year} ${chart.month} ${chart.day} ${chart.hour}`;
}

/**
 * Format Ziwei chart for Claude context
 */
export function formatZiweiChartForClaude(chart: ZiweiChart): string {
  const palaceDescriptions = chart.palaces
    .map(p => `${p.name}宫: ${[...p.majorStars, ...p.minorStars].join('、')}`)
    .join('\n');
  
  return `紫微斗数盘：\n${palaceDescriptions}\n五行局：${chart.fiveElementsClass}\n生肖：${chart.zodiac}`;
}
