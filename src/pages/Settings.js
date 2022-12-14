import { useState, useMemo, useEffect } from "react";
import SwitchBtn from "../components/SwitchBtn";
import i18Languages from "../config/i18SupportedLanguages";
import useLanguage from "../hooks/useLanguage";
import StorageManager from "../helpers/StorageManager";
import { useTranslation } from "react-i18next";

function Settings() {
  const [lang, dispatchLanguage] = useLanguage();
  const [micPermission, setMicPermission] = useState(false);
  const [theme, setTheme] = useState(
    StorageManager.getLocal("theme") !== false
      ? StorageManager.getLocal("theme")
      : "dark"
  );
  const { t } = useTranslation();
  const languages = useMemo(() => {
    let getIsoCodes = [];
    for (const key in i18Languages) {
      getIsoCodes.push(key);
    }
    return getIsoCodes;
  }, []);

  const askForMicPermission = () => {
    navigator.getUserMedia(
      // constraints
      {
        video: false,
        audio: true,
      },

      // successCallback
      function () {
        setMicPermission(true);
      },

      // errorCallback
      function (err) {
        if (err === "PERMISSION_DENIED") {
          // Explain why you need permission and how to update the permission setting
          setMicPermission(false);
        }
      }
    );
  };

  useEffect(() => {
    navigator.permissions.query({ name: "microphone" }).then((result) => {
      if (result.state === "granted") {
        setMicPermission(true);
      }
      // Don't do anything if the permission was denied.
    });
  }, []);

  return (
    <>
      <h1 className="pad-x-20">{t("Settings")}</h1>
      <p className="mtop20 pad-x-20">
        {t(
          "Application management, set language, microphone permission and theme mode."
        )}
      </p>
      <ul className="shopping-list setting-list pad-x-20">
        <li>
          <div
            className="flex"
            onClick={(e) => {
              e.stopPropagation();
              e.target.closest("li").classList.toggle("active");
            }}
          >
            <span className="pad-x-10">{t("Language")}</span>
            <div className="flex-item auto txt-right">
              <svg className="icn" title="Open">
                <use href="#arrow-down-icon"></use>
              </svg>
            </div>
          </div>
          {lang && (
            <div className="item-details flex-row">
              {languages.map((item, i) => (
                <div className="flex-item auto" key={i}>
                  <label className="custom-check" htmlFor={`${item}-btn`}>
                    <input
                      type="radio"
                      defaultChecked={lang.indexOf(item) !== -1 ? true : false}
                      value={`${item}-${item.toUpperCase()}`}
                      id={`${item}-btn`}
                      name="language"
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          dispatchLanguage(e.target.value);
                        }
                      }}
                    />
                    <span className="txt">{t(i18Languages[item])}</span>
                    <span className="checkmark"></span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </li>
        <li>
          <div className="flex">
            <span className="pad-x-10 flex-item auto">
              {t("Microphone permission")}
            </span>
            <div className="switch-container">
              <SwitchBtn
                translator={t}
                id="mic-permission"
                permission={micPermission}
                handlePermission={askForMicPermission}
              />
            </div>
          </div>
        </li>
        <li>
          <div className="flex">
            <span className="flex-item auto pad-x-10"> {t("Theme")}</span>
            <div className="pad-x-10">
              <svg
                className="icn"
                title="Open"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme("dark");
                  StorageManager.removeLocalItem("theme");
                  document.querySelector("body").classList.remove("light");
                }}
              >
                <use
                  href={theme === "dark" ? `#moon-active-icon` : `#moon-icon`}
                ></use>
              </svg>
            </div>
            <div className="pad-x-10">
              <svg
                className="icn"
                title="Open"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme("light");
                  StorageManager.setLocal("theme", "light");
                  document.querySelector("body").classList.add("light");
                }}
              >
                <use
                  href={theme !== "dark" ? `#sun-active-icon` : `#sun-icon`}
                ></use>
              </svg>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}

export default Settings;
