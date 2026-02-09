import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import de from './locales/de.json';

const savedLanguage = localStorage.getItem('language') as 'en' | 'de' | null;
const lng = savedLanguage === 'en' || savedLanguage === 'de' ? savedLanguage : 'de';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng,
  fallbackLng: 'de',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
