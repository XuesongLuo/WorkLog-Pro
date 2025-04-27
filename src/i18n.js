import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入你的zh、en、es语言包
import zh from './i18n/zh.json';
import en from './i18n/en.json';
import es from './i18n/es.json';

i18n
  .use(initReactI18next) // 绑定 react-i18next
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'en', // 找不到翻译就用中文

    interpolation: {
      escapeValue: false, // react已经帮你防止XSS了，不需要再转义
    },
  });

export default i18n;
