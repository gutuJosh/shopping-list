import { useState, useEffect } from "react";
import i18n from "../config/i18n";
import i18SupportedLanguages from "../config/i18SupportedLanguages";
const useLanguage = () => {
  const [language, setLanguage] = useState(i18n.language);

  function dispatchLanguage(data, lang = false) {
    let getLanguage = lang !== false ? lang : data;
    setLanguage(
      i18SupportedLanguages.indexOf(getLanguage.split("-")[0]) !== -1
        ? getLanguage
        : "en-US"
    );
    i18n.changeLanguage(getLanguage);
  }

  useEffect(() => {
    dispatchLanguage(language);
  }, []);

  return [language];
};

export default useLanguage;
