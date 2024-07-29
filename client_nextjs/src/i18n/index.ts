import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import HttpApi from 'i18next-http-backend'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

export const codes = {
  vi: 'vi',
  en: 'en'
}

i18n
  .use(HttpApi)
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: [codes.vi, codes.en],
    fallbackLng: codes.en,
    interpolation: {
      escapeValue: false
    },
    lng: codes.en,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie']
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json'
    }
  })

export default i18n
