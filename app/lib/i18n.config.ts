/**
 * i18n configuration for next-intl
 */

export const TimeZone = 'Asia/Shanghai'; // Default timezone for date formatting

export const Messages = {
  'zh-CN': {
    // Navigation
    'nav.home': '首页',
    'nav.today_luck': '今日运势',
    'nav.reading': '个人运势',
    'nav.about': '关于',

    // Home page
    'home.title': '紫微斗数 - 传统文化智慧',
    'home.subtitle': '通过八字和紫微斗数解读你的人生',
    'home.daily_cta': '查看今日运势',
    'home.reading_cta': '生成个人运势',

    // Daily luck page
    'luck.title': '今日运势',
    'luck.date': '日期',
    'luck.lunar': '农历',
    'luck.auspicious': '宜',
    'luck.inauspicious': '忌',
    'luck.fortune_level': '运势等级',

    // Reading page
    'reading.title': '个人运势分析',
    'reading.subtitle': '输入你的出生信息，获得生辰八字和紫微盘解读',
    'reading.form.name': '姓名',
    'reading.form.date': '出生日期',
    'reading.form.time': '出生时间',
    'reading.form.gender': '性别',
    'reading.form.gender_male': '男',
    'reading.form.gender_female': '女',
    'reading.form.submit': '生成运势',

    // Result page
    'result.bazi': '八字分析',
    'result.ziwei': '紫微分析',
    'result.chat': 'AI 运势解读',
    'result.ask_question': '有什么想问的吗？',

    // Error messages
    'error.invalid_date': '请输入有效的日期',
    'error.required_field': '此字段必填',
    'error.api_error': '服务错误，请稍后重试',
    'error.unknown': '发生未知错误',

    // Buttons
    'btn.submit': '提交',
    'btn.back': '返回',
    'btn.close': '关闭',
    'btn.retry': '重试',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.today_luck': 'Daily Luck',
    'nav.reading': 'Personal Reading',
    'nav.about': 'About',

    // Home page
    'home.title': 'Ziwei Astrology - Ancient Wisdom',
    'home.subtitle': 'Understand your life through BaZi and Ziwei Shu',
    'home.daily_cta': 'Check Today\'s Fortune',
    'home.reading_cta': 'Generate Personal Reading',

    // Daily luck page
    'luck.title': 'Today\'s Fortune',
    'luck.date': 'Date',
    'luck.lunar': 'Lunar Date',
    'luck.auspicious': 'Auspicious Activities',
    'luck.inauspicious': 'Inauspicious Activities',
    'luck.fortune_level': 'Fortune Level',

    // Reading page
    'reading.title': 'Personal Fortune Analysis',
    'reading.subtitle': 'Enter your birth information for BaZi and Ziwei interpretation',
    'reading.form.name': 'Name',
    'reading.form.date': 'Birth Date',
    'reading.form.time': 'Birth Time',
    'reading.form.gender': 'Gender',
    'reading.form.gender_male': 'Male',
    'reading.form.gender_female': 'Female',
    'reading.form.submit': 'Generate Reading',

    // Result page
    'result.bazi': 'BaZi Analysis',
    'result.ziwei': 'Ziwei Analysis',
    'result.chat': 'AI Fortune Interpretation',
    'result.ask_question': 'What would you like to know?',

    // Error messages
    'error.invalid_date': 'Please enter a valid date',
    'error.required_field': 'This field is required',
    'error.api_error': 'Service error, please try again later',
    'error.unknown': 'An unknown error occurred',

    // Buttons
    'btn.submit': 'Submit',
    'btn.back': 'Back',
    'btn.close': 'Close',
    'btn.retry': 'Retry',
  },
} as const;

export const defaultLocale = 'zh-CN' as const;
export const locales = ['zh-CN', 'en'] as const;
