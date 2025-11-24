import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zh from './locales/zh.json'

// Get language from localStorage or browser
const savedLanguage = localStorage.getItem('language')
const browserLanguage = navigator.language.split('-')[0]
const defaultLanguage = savedLanguage || (browserLanguage === 'zh' ? 'zh' : 'en')

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
