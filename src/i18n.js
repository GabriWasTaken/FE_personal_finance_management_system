import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "logout": "logout",
          "accounts": "Accounts",
          "financials": "Financials",
          "dashboard": "Dashboard",
          Table: {
            "page": "Page",
            "go_to_page": "Go to page",
            "rows": "Rows"
          },
          Common: {
            "of": "of",
            "add": "Add",
          }
        }
      },
      it: {
        translation: {
          "logout": "Esci",
          "accounts": "Conti",
          "financials": "Movimenti",
          "dashboard": "Dashboard",
          Table: {
            "page": "Pagina",
            "go_to_page": "Vai alla pagina",
            "rows": "Righe"
          },
          Common: {
            "of": "di",
            "add": "Aggiungi",
          }
        }
      }
    }
  });

export default i18n;