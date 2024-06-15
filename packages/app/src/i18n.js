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
          leftArrow: "left arrow",
          rightArrow: "right arrow",
          leftArrowTooltip:
            "Press the left arrow key to choose the left option.",
          rightArrowTooltip:
            "Press the right arrow key to choose the right option.",
          chooseSelection:
            "Press the left or right arrow key to make a selection.",
          tooltipEnterSelectionInstructions:
            "Press the enter key to accept your selection of {{choice}} and start the survey.",
          tooltipEnterSelectionMELQuestions:
            "Press the enter key to accept your selection of {{choice}} and advance to the next question.",
          selectedChoice:
            "You have made your selection to receive {{choiceText}}.",
          tryPressEnterToAdvanceInstruction:
            "You can press the {{arrowKey}} key to change your selection or press the enter key to accept it and advance to the survey questions.",
          tryPressEnterToAdvanceSurvey:
            "You can press the {{arrowKey}} key to change your selection or press the enter key to accept it and advance to the next survey question.",
          choiceText: "{{amount}} in {{delay}} months",
        },
      },
    },
  });

export default i18n;
