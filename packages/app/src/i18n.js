import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          leftArrowTooltip:
            "Press the Left Arrow key to choose the earlier amount.",
          rightArrowTooltip:
            "Press the Right Arrow key to choose the later amount.",
          tooltipEnterNoSelectionInstructions:
            "Press the Left or Right Arrow key to make a selection, then press the Enter key to accept your selection and start the survey.",
          tooltipEnterSelectionInstructions:
            "Press the Enter key to accept your selection of {{choice}} and start the survey.",
          tooltipEnterNoSelectionMELQuestions:
            "Press the Left or Right Arrow key to make a selection, then press the Enter key to accept your selection and advance to the next question.",
          tooltipEnterSelectionMELQuestions:
            "Press the Enter key to accept your selection of {{choice}} and advance to the next question.",
        },
      },
    },
  });

export default i18n;
