import chalk from "chalk";
import { participantUniqueKey } from "./QuestionSliceUtil.js";
import { convertAnswersAryToObj } from "./ObjectUtil.js";
import { secondsBetween } from "./ConversionUtil.js";
import { stateToDate } from "./ConversionUtil.js";
import BLANK_STATE_JSON from "./excelObjectTemplate.json" assert { type: "json" };

export class MergedData {
  #data = new Map();

  constructor() {}

  callForEntry(callback) {
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

  patchupValue(entryData, propertyName, newValue) {
    console.log(
      `...patching up property ${propertyName} current value ${entryData[propertyName]} with value${newValue}`
    );
    entryData[propertyName] = newValue;
  }

  updateTimeSpent(entryData, timeField, shownTimestamp, completedTimestamp) {
    if (entryData[timeField]) return;
    entryData[timeField] = secondsBetween(
      stateToDate(shownTimestamp),
      stateToDate(completedTimestamp)
    );
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
        this.updateTimeSpent(
          newEntry,
          "consentTimeSec",
          newEntry.consentShownTimestamp,
          newEntry.consentCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "demographicTimeSec",
          newEntry.demographicShownTimestamp,
          newEntry.demographicCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "introductionTimeSec",
          newEntry.introductionShownTimestamp,
          newEntry.introductionCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "instructionsTimeSec",
          newEntry.instructionsShownTimestamp,
          newEntry.instructionsCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "attentionCheckTimeSec",
          newEntry.attentionCheckShownTimestamp,
          newEntry.attentionCheckCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "experienceSurveyTimeSec",
          newEntry.experienceSurveyQuestionsShownTimestamp,
          newEntry.experienceSurveyQuestionsCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "financialLitSurveyTimeSec",
          newEntry.financialLitSurveyQuestionsShownTimestamp,
          newEntry.financialLitSurveyQuestionsCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "purposeSurveyAwareTimeSec",
          newEntry.purposeSurveyAwareQuestionsShownTimestamp,
          newEntry.purposeSurveyAwareQuestionsCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "purposeWorthAwareTimeSec",
          newEntry.purposeSurveyWorthQuestionsShownTimestamp,
          newEntry.purposeSurveyWorthQuestionsCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "debriefTimeSec",
          newEntry.debriefShownTimestamp,
          newEntry.debriefCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "theEndTimeSec",
          newEntry.theEndShownTimestamp,
          newEntry.theEndCompletedTimestamp
        );
        this.updateTimeSpent(
          newEntry,
          "discountLitSurveyTimeSec",
          newEntry.discountLitSurveyQuestionsShownTimestamp,
          newEntry.discountLitSurveyQuestionsCompletedTimestamp
        );
        this.#data.set(key, newEntry);
      } else {
        console.log(
          "...detected answer data (multiple rows) so converting to single row"
        );
        // patchup the time spent on each question column values
        let lastChoiceTimestamp = null;
        entry.forEach((e) => {
          if (lastChoiceTimestamp && !e.shownTimestamp) {
            e.shownTimestamp = lastChoiceTimestamp;
          }
          this.updateTimeSpent(
            e,
            "choiceTimeSec",
            e.shownTimestamp,
            e.choiceTimestamp
          );
          if (
            e.participantId === "5d7e8ddd4a8468000138c24e2" ||
            e.participantId === "63853f2e1e9627b509ddeda0" ||
            e.participantId === "63853f2e1e9627b509ddeda0" ||
            e.participantId === "63bf6a1798241e6c697023f2"
          ) {
            console.log(chalk.red(`found bad partcipant id ${e.partcipantId}`));
            process.exit(-1);
          }
          lastChoiceTimestamp = e.choiceTimestamp;
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
