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
            "You selected to receive {{amount}} in {{delay}} months from today.",
          tryPressEnterToAdvanceInstruction:
            "Press the enter key to accept your selection and start the survey or the {{arrowKey}} to change it.",
          tryPressEnterToAdvanceSurvey:
            "Press the enter key to accept your selection and go to the next question or the {{arrowKey}} key to change it.",
          MELChoicePromptWord:
            "Choose the option that represents the timing from today and amount that you would prefer receiving.",
          MELChoicePromptBar:
            "Choose the bar that represents the timing from today and amount that you would prefer receiving.",
        },
      },
    },
  });

export default i18n;
