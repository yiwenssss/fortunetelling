/**
 * Prompt templates for Claude API
 * These templates inject chart data for LLM interpretation
 */

import { BaZiChart, ZiweiChart, BirthProfile } from '../types';

/**
 * System prompt for the fortunetelling assistant
 */
export const SYSTEM_PROMPT = (language: 'en' | 'zh-CN' = 'en') => {
  if (language === 'zh-CN') {
    return `你是一位经验丰富的传统文化咨询师，精通八字和紫微斗数。你的任务是：

1. 根据用户的生辰信息，使用提供的八字和紫微盘数据进行分析
2. 以对话的方式解释用户的运势、性格、事业、感情等方面
3. 基于用户的具体问题提供建议
4. 使用易懂但专业的语言，不要冗长复杂

重要规则：
- 永远基于已提供的八字和紫微数据，不要凭空编造
- 解释星曜和宫位的含义，不要只说吉凶
- 给出建议时要有逻辑基础
- 保持友好和尊重的态度

提供的数据中的星曜和宫位都是准确计算得出，无需验证。`;
  } else {
    return `You are an experienced consultant in traditional Chinese metaphysics, specializing in BaZi (Four Pillars) and Ziwei (Purple Wealth) astrology.

Your tasks are:
1. Analyze the user's birth data using the provided BaZi and Ziwei chart information
2. Explain their fortune, personality, career, relationships in a conversational way
3. Provide specific advice based on their questions
4. Use clear, professional language without unnecessary complexity

Important rules:
- Always base your analysis on the provided BaZi and Ziwei data
- Explain the meanings of stars and palaces, not just fortune predictions
- Ground your advice in logical interpretation
- Be respectful and friendly

The star and palace data provided are accurately calculated and verified.`;
  }
};

/**
 * Build context for daily luck reading
 */
export function buildDailyLuckPrompt(
  heavenlyStem: string,
  earthlyBranch: string,
  auspiciousActivities: string[],
  inauspiciousActivities: string[],
  fortuneLevel: string,
  language: 'en' | 'zh-CN' = 'en'
): string {
  if (language === 'zh-CN') {
    return `今天的日期信息：
- 天干地支：${heavenlyStem}${earthlyBranch}
- 运势等级：${fortuneLevel}
- 宜：${auspiciousActivities.join('、')}
- 忌：${inauspiciousActivities.join('、')}

请基于这些信息给出今日运势的简短解读。`;
  } else {
    return `Today's astrological information:
- Heavenly Stem and Earthly Branch: ${heavenlyStem}${earthlyBranch}
- Fortune level: ${fortuneLevel}
- Auspicious: ${auspiciousActivities.join(', ')}
- Inauspicious: ${inauspiciousActivities.join(', ')}

Please provide a brief interpretation of today's fortune based on this information.`;
  }
}

/**
 * Build context for BaZi chart analysis
 */
export function buildBaZiPrompt(
  profile: BirthProfile,
  chart: BaZiChart,
  language: 'en' | 'zh-CN' = 'en'
): string {
  if (language === 'zh-CN') {
    return `用户信息：
- 姓名：${profile.name}
- 出生日期：${profile.birthDate} ${profile.birthTime}
- 性别：${profile.gender === 'M' || profile.gender === '男' ? '男' : '女'}

八字信息：
- 年柱：${chart.year}
- 月柱：${chart.month}
- 日柱：${chart.day}
- 时柱：${chart.hour}
- 日主：${chart.dayMaster}（${chart.dayMasterElement}）

请基于上述八字数据分析用户的性格特点和人生运势。`;
  } else {
    return `User Information:
- Name: ${profile.name}
- Birth: ${profile.birthDate} ${profile.birthTime}
- Gender: ${profile.gender === 'M' || profile.gender === '男' ? 'Male' : 'Female'}

BaZi (Four Pillars) Information:
- Year Pillar: ${chart.year}
- Month Pillar: ${chart.month}
- Day Pillar: ${chart.day}
- Hour Pillar: ${chart.hour}
- Day Master: ${chart.dayMaster} (${chart.dayMasterElement} element)

Please analyze the user's personality traits and life fortune based on this BaZi data.`;
  }
}

/**
 * Build context for Ziwei chart analysis
 */
export function buildZiweiPrompt(
  profile: BirthProfile,
  chart: ZiweiChart,
  language: 'en' | 'zh-CN' = 'en'
): string {
  // Format palace information
  const palaceDescriptions = chart.palaces
    .map(p => {
      const allStars = [...p.majorStars, ...p.minorStars].join('、');
      return `${p.name}宫：${allStars || '空宫'}`;
    })
    .join('\n');

  if (language === 'zh-CN') {
    return `用户信息：
- 姓名：${profile.name}
- 出生日期：${profile.birthDate} ${profile.birthTime}
- 性别：${profile.gender === 'M' || profile.gender === '男' ? '男' : '女'}

紫微斗数盘：
${palaceDescriptions}

五行局：${chart.fiveElementsClass}
生肖：${chart.zodiac}
总体主人公格：${chart.horoscope}

请基于上述紫微盘数据深入分析用户的：
1. 性格和命途（命宫）
2. 财运（财帛宫）
3. 感情和婚姻（感情宫）
4. 事业前景（事业宫）
5. 人际关系（迁移宫）`;
  } else {
    return `User Information:
- Name: ${profile.name}
- Birth: ${profile.birthDate} ${profile.birthTime}
- Gender: ${profile.gender === 'M' || profile.gender === '男' ? 'Male' : 'Female'}

Ziwei Astrolabe:
${palaceDescriptions.split('\n').map(line => line.replace('宫：', ' Palace: ').replace('空宫', 'Empty Palace')).join('\n')}

Five Elements Class: ${chart.fiveElementsClass}
Zodiac: ${chart.zodiac}
Overall Character: ${chart.horoscope}

Based on this Ziwei chart, please deeply analyze the user's:
1. Personality and life path (Life Palace)
2. Wealth and finances (Wealth Palace)
3. Romance and marriage (Romance Palace)
4. Career prospects (Career Palace)
5. Relationships (Travel Palace)`;
  }
}

/**
 * Build context for a specific life question
 */
export function buildQuestionPrompt(
  question: string,
  baziContext: string,
  ziweiContext: string,
  language: 'en' | 'zh-CN' = 'en'
): string {
  if (language === 'zh-CN') {
    return `用户的问题：${question}

请基于以下信息给出有针对性的建议：

${baziContext}

${ziweiContext}

针对"${question}"这个问题，请：
1. 分析当前情况
2. 指出相关的有利和不利因素
3. 给出具体可行的建议`;
  } else {
    return `User's Question: ${question}

Please provide targeted advice based on the following information:

${baziContext}

${ziweiContext}

Regarding the question "${question}", please:
1. Analyze the current situation
2. Point out relevant favorable and unfavorable factors
3. Provide specific and actionable advice`;
  }
}

/**
 * Build a chat message for streaming
 */
export function buildChatMessage(
  systemPrompt: string,
  userMessage: string,
  context?: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  let fullUserMessage = userMessage;
  if (context) {
    fullUserMessage = `${context}\n\nUser question: ${userMessage}`;
  }

  return [
    {
      role: 'user',
      content: fullUserMessage,
    },
  ];
}
