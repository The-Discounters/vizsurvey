import { participantUniqueKey } from "../../src/features/QuestionSliceUtil.js";
import { convertAnswersAryToObj } from "../../src/features/ObjectUtil.js";
import { secondsBetween } from "../../src/features/ConversionUtil.js";
import { stateToDate } from "../../src/features/ConversionUtil.js";

const BLANK_STATE_JSON = {
  participantId: "",
  sessionId: "",
  studyId: "",
  treatmentId: "",
  consentShownTimestamp: "",
  consentCompletedTimestamp: "",
  consentTimeSec: "",
  demographicShownTimestamp: "",
  demographicCompletedTimestamp: "",
  demographicTimeSec: "",
  introductionShownTimestamp: "",
  introductionCompletedTimestamp: "",
  introductionTimeSec: "",
  instructionsShownTimestamp: "",
  instructionsCompletedTimestamp: "",
  instructionsTimeSec: "",
  attentionCheckShownTimestamp: "",
  attentionCheckCompletedTimestamp: "",
  attentionCheckTimeSec: "",
  experienceSurveyQuestionsShownTimestamp: "",
  experienceSurveyQuestionsCompletedTimestamp: "",
  experienceSurveyTimeSec: "",
  discountLitSurveyQuestionsShownTimestamp: "",
  discountLitSurveyQuestionsCompletedTimestamp: "",
  discountLitSurveyTimeSec: "",
  financialLitSurveyQuestionsShownTimestamp: "",
  financialLitSurveyQuestionsCompletedTimestamp: "",
  financialLitSurveyTimeSec: "",
  purposeSurveyQuestionsShownTimestamp: "",
  purposeSurveyQuestionsCompletedTimestamp: "",
  purposeSurveyTimeSec: "",
  theEndShownTimestamp: "",
  theEndCompletedTimestamp: "",
  theEndTimeSec: "",
  debriefShownTimestamp: "",
  debriefCompletedTimestamp: "",
  debriefTimeSec: "",
  consentChecked: "",
  countryOfResidence: "",
  vizFamiliarity: "",
  age: "",
  gender: "",
  selfDescribeGender: "",
  profession: "",
  userAgent: "",
  screenAvailHeight: "",
  screenAvailWidth: "",
  screenColorDepth: "",
  screenWidth: "",
  screenHeight: "",
  screenOrientationAngle: "",
  screenOrientationType: "",
  screenPixelDepth: "",
  windowDevicePixelRatio: "",
  windowInnerHeight: "",
  windowInnerWidth: "",
  windowOuterHeight: "",
  windowOuterWidth: "",
  windowScreenLeft: "",
  windowScreenTop: "",
  position_1: "",
  viewType_1: "",
  interaction_1: "",
  variableAmount_1: "",
  amountEarlier_1: "",
  timeEarlier_1: "",
  dateEarlier_1: "",
  amountLater_1: "",
  timeLater_1: "",
  dateLater_1: "",
  maxAmount_1: "",
  maxTime_1: "",
  verticalPixels_1: "",
  horizontalPixels_1: "",
  leftMarginWidthIn_1: "",
  bottomMarginHeightIn_1: "",
  graphWidthIn_1: "",
  graphHeightIn_1: "",
  widthIn_1: "",
  heightIn_1: "",
  showMinorTicks_1: "",
  choice_1: "",
  dragAmount_1: "",
  shownTimestamp_1: "",
  choiceTimestamp_1: "",
  highup_1: "",
  lowdown_1: "",
  choiceTimeSec_1: "",
  position_2: "",
  viewType_2: "",
  interaction_2: "",
  variableAmount_2: "",
  amountEarlier_2: "",
  timeEarlier_2: "",
  dateEarlier_2: "",
  amountLater_2: "",
  timeLater_2: "",
  dateLater_2: "",
  maxAmount_2: "",
  maxTime_2: "",
  verticalPixels_2: "",
  horizontalPixels_2: "",
  leftMarginWidthIn_2: "",
  bottomMarginHeightIn_2: "",
  graphWidthIn_2: "",
  graphHeightIn_2: "",
  widthIn_2: "",
  heightIn_2: "",
  showMinorTicks_2: "",
  choice_2: "",
  dragAmount_2: "",
  shownTimestamp_2: "",
  choiceTimestamp_2: "",
  highup_2: "",
  lowdown_2: "",
  choiceTimeSec_2: "",
  position_3: "",
  viewType_3: "",
  interaction_3: "",
  variableAmount_3: "",
  amountEarlier_3: "",
  timeEarlier_3: "",
  dateEarlier_3: "",
  amountLater_3: "",
  timeLater_3: "",
  dateLater_3: "",
  maxAmount_3: "",
  maxTime_3: "",
  verticalPixels_3: "",
  horizontalPixels_3: "",
  leftMarginWidthIn_3: "",
  bottomMarginHeightIn_3: "",
  graphWidthIn_3: "",
  graphHeightIn_3: "",
  widthIn_3: "",
  heightIn_3: "",
  showMinorTicks_3: "",
  choice_3: "",
  dragAmount_3: "",
  shownTimestamp_3: "",
  choiceTimestamp_3: "",
  highup_3: "",
  lowdown_3: "",
  choiceTimeSec_3: "",
  position_4: "",
  viewType_4: "",
  interaction_4: "",
  variableAmount_4: "",
  amountEarlier_4: "",
  timeEarlier_4: "",
  dateEarlier_4: "",
  amountLater_4: "",
  timeLater_4: "",
  dateLater_4: "",
  maxAmount_4: "",
  maxTime_4: "",
  verticalPixels_4: "",
  horizontalPixels_4: "",
  leftMarginWidthIn_4: "",
  bottomMarginHeightIn_4: "",
  graphWidthIn_4: "",
  graphHeightIn_4: "",
  widthIn_4: "",
  heightIn_4: "",
  showMinorTicks_4: "",
  choice_4: "",
  dragAmount_4: "",
  shownTimestamp_4: "",
  choiceTimestamp_4: "",
  highup_4: "",
  lowdown_4: "",
  choiceTimeSec_4: "",
  position_5: "",
  viewType_5: "",
  interaction_5: "",
  variableAmount_5: "",
  amountEarlier_5: "",
  timeEarlier_5: "",
  dateEarlier_5: "",
  amountLater_5: "",
  timeLater_5: "",
  dateLater_5: "",
  maxAmount_5: "",
  maxTime_5: "",
  verticalPixels_5: "",
  horizontalPixels_5: "",
  leftMarginWidthIn_5: "",
  bottomMarginHeightIn_5: "",
  graphWidthIn_5: "",
  graphHeightIn_5: "",
  widthIn_5: "",
  heightIn_5: "",
  showMinorTicks_5: "",
  choice_5: "",
  dragAmount_5: "",
  shownTimestamp_5: "",
  choiceTimestamp_5: "",
  highup_5: "",
  lowdown_5: "",
  choiceTimeSec_5: "",
  position_6: "",
  viewType_6: "",
  interaction_6: "",
  variableAmount_6: "",
  amountEarlier_6: "",
  timeEarlier_6: "",
  dateEarlier_6: "",
  amountLater_6: "",
  timeLater_6: "",
  dateLater_6: "",
  maxAmount_6: "",
  maxTime_6: "",
  verticalPixels_6: "",
  horizontalPixels_6: "",
  leftMarginWidthIn_6: "",
  bottomMarginHeightIn_6: "",
  graphWidthIn_6: "",
  graphHeightIn_6: "",
  widthIn_6: "",
  heightIn_6: "",
  showMinorTicks_6: "",
  choice_6: "",
  dragAmount_6: "",
  shownTimestamp_6: "",
  choiceTimestamp_6: "",
  highup_6: "",
  lowdown_6: "",
  choiceTimeSec_6: "",
  position_7: "",
  viewType_7: "",
  interaction_7: "",
  variableAmount_7: "",
  amountEarlier_7: "",
  timeEarlier_7: "",
  dateEarlier_7: "",
  amountLater_7: "",
  timeLater_7: "",
  dateLater_7: "",
  maxAmount_7: "",
  maxTime_7: "",
  verticalPixels_7: "",
  horizontalPixels_7: "",
  leftMarginWidthIn_7: "",
  bottomMarginHeightIn_7: "",
  graphWidthIn_7: "",
  graphHeightIn_7: "",
  widthIn_7: "",
  heightIn_7: "",
  showMinorTicks_7: "",
  choice_7: "",
  dragAmount_7: "",
  shownTimestamp_7: "",
  choiceTimestamp_7: "",
  highup_7: "",
  lowdown_7: "",
  choiceTimeSec_7: "",
  position_8: "",
  viewType_8: "",
  interaction_8: "",
  variableAmount_8: "",
  amountEarlier_8: "",
  timeEarlier_8: "",
  dateEarlier_8: "",
  amountLater_8: "",
  timeLater_8: "",
  dateLater_8: "",
  maxAmount_8: "",
  maxTime_8: "",
  verticalPixels_8: "",
  horizontalPixels_8: "",
  leftMarginWidthIn_8: "",
  bottomMarginHeightIn_8: "",
  graphWidthIn_8: "",
  graphHeightIn_8: "",
  widthIn_8: "",
  heightIn_8: "",
  showMinorTicks_8: "",
  choice_8: "",
  dragAmount_8: "",
  shownTimestamp_8: "",
  choiceTimestamp_8: "",
  highup_8: "",
  lowdown_8: "",
  choiceTimeSec_8: "",
  attentionCheck: "",
  experience_survey_enjoy: "",
  experience_survey_clear: "",
  experience_survey_understand: "",
  experience_survey_present: "",
  experience_survey_imagine: "",
  experience_survey_easy: "",
  experience_survey_format: "",
  financial_lit_survey_numeracy: "",
  financial_lit_survey_inflation: "",
  financial_lit_survey_risk: "",
  purpose_survey_difference: "",
  purpose_survey_better: "",
  purpose_survey_serve: "",
  purpose_survey_truly: "",
  purpose_survey_describe: "",
  purpose_survey_effort: "",
  feedback: "",
};

export class MergedData {
  #data = new Map();

  constructor() {}

  callbackOnEntries(callback) {
    this.#data.forEach((value, key) => {
      callback(value, key);
    });
  }

  patchupProperty(entryData, oldProperty, newProperty) {
    if (entryData.hasOwnProperty(oldProperty)) {
      console.log(
        `...patching up ${oldProperty} for value ${entryData[oldProperty]}`
      );
      entryData[newProperty] = entryData[oldProperty];
      delete entryData[oldProperty];
    }
  }

  addEntry(entry) {
    if (entry) {
      const key = participantUniqueKey(entry[0]);
      console.log(`...merging data for key ${key}`);
      let existingData = this.#data.has(key)
        ? this.#data.get(key)
        : BLANK_STATE_JSON;
      if (entry.length === 1) {
        if (
          entry[0].participantId === "5d7e8ddd4a8468000138c24e2" ||
          entry[0].participantId === "63853f2e1e9627b509ddeda0" ||
          entry[0].participantId === "63853f2e1e9627b509ddeda0" ||
          entry[0].participantId === "63bf6a1798241e6c697023f2"
        ) {
          console.log(
            chalk.red(`found bad partcipant id ${entry[0].partcipantId}`)
          );
          process.exit(-1);
        }
        console.log("...merging single row entry");
        // patch up misspelled peroperties in the pilot group dataset
        const newEntry = { ...existingData, ...entry[0] };
        this.patchupProperty(
          newEntry,
          "introductionShowTimestamp",
          "introductionShownTimestamp"
        );
        this.patchupProperty(newEntry, "posdiff", "purpose_survey_difference");
        this.patchupProperty(newEntry, "carbetplac", "purpose_survey_better");
        this.patchupProperty(newEntry, "servsoc", "purpose_survey_serve");
        this.patchupProperty(newEntry, "thinkach", "purpose_survey_truly");
        this.patchupProperty(newEntry, "descrpurp", "purpose_survey_describe");
        this.patchupProperty(newEntry, "effort", "purpose_survey_effort");
        this.patchupProperty(newEntry, "servsoc", "purpose_survey_serve");
        this.patchupProperty(
          newEntry,
          "qNumeracy",
          "financial_lit_survey_numeracy"
        );
        this.patchupProperty(
          newEntry,
          "qInflation",
          "financial_lit_survey_inflation"
        );
        this.patchupProperty(
          newEntry,
          "qRiskDiversification",
          "financial_lit_survey_risk"
        );
        newEntry.consentTimeSec = secondsBetween(
          stateToDate(newEntry.consentShownTimestamp),
          stateToDate(newEntry.consentCompletedTimestamp)
        );
        newEntry.demographicTimeSec = secondsBetween(
          stateToDate(newEntry.demographicShownTimestamp),
          stateToDate(newEntry.demographicCompletedTimestamp)
        );
        newEntry.introductionTimeSec = secondsBetween(
          stateToDate(newEntry.introductionShownTimestamp),
          stateToDate(newEntry.introductionCompletedTimestamp)
        );
        newEntry.instructionsTimeSec = secondsBetween(
          stateToDate(newEntry.instructionsShownTimestamp),
          stateToDate(newEntry.instructionsCompletedTimestamp)
        );
        newEntry.attentionCheckTimeSec = secondsBetween(
          stateToDate(newEntry.attentionCheckShownTimestamp),
          stateToDate(newEntry.attentionCheckCompletedTimestamp)
        );
        newEntry.experienceSurveyTimeSec = secondsBetween(
          stateToDate(newEntry.experienceSurveyQuestionsShownTimestamp),
          stateToDate(newEntry.experienceSurveyQuestionsCompletedTimestamp)
        );
        newEntry.financialLitSurveyTimeSec = secondsBetween(
          stateToDate(newEntry.financialLitSurveyQuestionsShownTimestamp),
          stateToDate(newEntry.financialLitSurveyQuestionsCompletedTimestamp)
        );
        newEntry.purposeSurveyTimeSec = secondsBetween(
          stateToDate(newEntry.purposeSurveyQuestionsShownTimestamp),
          stateToDate(newEntry.purposeSurveyQuestionsCompletedTimestamp)
        );
        newEntry.debriefTimeSec = secondsBetween(
          stateToDate(newEntry.debriefShownTimestamp),
          stateToDate(newEntry.debriefCompletedTimestamp)
        );
        newEntry.theEndTimeSec = secondsBetween(
          stateToDate(newEntry.theEndShownTimestamp),
          stateToDate(newEntry.theEndCompletedTimestamp)
        );
        newEntry.discountLitSurveyTimeSec = secondsBetween(
          stateToDate(newEntry.discountLitSurveyQuestionsShownTimestamp),
          stateToDate(newEntry.discountLitSurveyQuestionsCompletedTimestamp)
        );

        this.#data.set(key, newEntry);
      } else {
        console.log(
          "...detected answer data (multiple rows) so converting to single row"
        );
        // patchup the time spent on each question column values
        entry.forEach((e) => {
          e.choiceTimeSec = secondsBetween(
            stateToDate(e.shownTimestamp),
            stateToDate(e.choiceTimestamp)
          );

          if (
            e.participantId === "5d7e8ddd4a8468000138c24e2" ||
            e.participantId === "63853f2e1e9627b509ddeda0" ||
            e.participantId === "63853f2e1e9627b509ddeda0" ||
            entry[0].participantId === "63bf6a1798241e6c697023f2"
          ) {
            console.log(chalk.red(`found bad partcipant id ${e.partcipantId}`));
            process.exit(-1);
          }
        });
        this.#data.set(key, {
          ...existingData,
          // for the legacy files from the pilot study, convert the multiple answer rows to a single row
          ...convertAnswersAryToObj(entry),
        });
      }
      console.log(`...data merged`);
    } else {
      console.log(`...no data to merge`);
    }
  }
}
