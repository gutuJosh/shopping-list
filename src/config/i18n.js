import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "../locales/en.json";
import translationIT from "../locales/it.json";
import translationFR from "../locales/fr.json";
import translationES from "../locales/es.json";
import translationDE from "../locales/de.json";
import translationRO from "../locales/ro.json";
// the translations
const resources = {
  en: {
    common: translationEN,
  },
  it: {
    common: translationIT,
  },
  fr: {
    common: translationFR,
  },
  es: {
    common: translationES,
  },
  de: {
    common: translationDE,
  },
  ro: {
    common: translationRO,
  },
};

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: i18n.language,
    keySeparator: false,
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // react already safes from xss
      unescapePrefix: "-",
    },
    fallbackLng: false,
    debug: false,
    // have a common namespace used around the full app
    saveMissing: false,
    // path to post missing resources
    /*addPath: "/locales/add/en/{{ns}}",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    },*/
    // react-i18next options
    react: {
      bindI18n: "languageChanged loaded",
      bindStore: "added removed",
      nsMode: "default",
      useSuspense: true,
    },
    detection: {
      order: ["cookie", "navigator", "querystring"],
      caches: ["cookie"],
    },
  });

export default i18n;
