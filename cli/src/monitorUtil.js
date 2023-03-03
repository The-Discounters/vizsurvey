import clui from "clui";
import clc from "cli-color";
import { stateToDate } from "./ConversionUtil.js";

export const drawStatus = (
  surveysTotal,
  stats,
  monitorRunning,
  inProgressMax
) => {
  var outputBuffer = new clui.LineBuffer({
    x: 0,
    y: 0,
    width: "console",
    height: "console",
  });
  var title = new clui.Line(outputBuffer)
    .column("", 15, [clc.yellow])
    .column("Totals (count / total participants)", 40, [clc.yellow])
    .fill()
    .store();
  var line = new clui.Line(outputBuffer)
    .column("Surveys Completed", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.surveysComplete,
        surveysTotal,
        20,
        surveysTotal,
        `${stats.surveysComplete} / ${surveysTotal}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Surveys In Progress", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.surveysInProgress,
        surveysTotal,
        20,
        surveysTotal,
        stats.surveysInProgress
      ),
      30
    )
    .fill()
    .store();
  title = new clui.Line(outputBuffer)
    .column("", 15, [clc.yellow])
    .column("Breakdown By Country (count / total participants)", 40, [
      clc.yellow,
    ])
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("USA", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.countryUSA,
        surveysTotal,
        20,
        surveysTotal,
        `${stats.countryUSA} / ${surveysTotal}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Non USA", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.countryOther,
        surveysTotal,
        20,
        1,
        `${stats.countryOther} / ${surveysTotal}`
      ),
      30
    )
    .fill()
    .store();
  title = new clui.Line(outputBuffer)
    .column("", 15, [clc.yellow])
    .column("Breakdown By Step (count / in progress scale)", 40, [clc.yellow])
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Consent", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.consentShown,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.consentShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Demographic", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.demographicsShown,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.demographicsShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Introduction", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.introductionShown,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.introductionShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Instruction", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.instructionsShown,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.instructionsShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.surveySho,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.firstSurveyQuestionShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Experience Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.experienceComplete,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.experienceShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Financial Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.financialComplete,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.financialShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Purpose Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.purposeShown,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.purposeShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Debrief Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.debriefShown,
        inProgressMax,
        20,
        inProgressMax,
        `${stats.debriefShown} / ${inProgressMax}`
      ),
      30
    )
    .fill()
    .store();
  var title = new clui.Line(outputBuffer)
    .column("", 15, [clc.yellow])
    .column("Feedback", 20, [clc.yellow])
    .fill()
    .store();
  stats.feedback
    .sort((a, b) => {
      const aDate = stateToDate(a.date);
      const bDate = stateToDate(b.date);
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    })
    .slice(0, 4)
    .forEach((e) =>
      new clui.Line(outputBuffer)
        .column(`${e.date}: ${e.feedback}`, "console", [clc.white])
        .fill()
        .store()
    );
  new clui.Line(outputBuffer)
    .column(`Ctrl + C to exit the monitor.  Enter to pause and resume.`, 80, [
      clc.yellow,
    ])
    .fill()
    .store();
  new clui.Line(outputBuffer)
    .column(`Monitor ${monitorRunning ? "Running" : "Paused"}`, 80, [
      clc.black.bgWhite,
    ])
    .fill()
    .store();

  return outputBuffer;
};
export const createStat = () => {
  return {
    surveysComplete: 0,
    surveysInProgress: 0,
    countryUSA: 0,
    countryOther: 0,
    consentShown: 0,
    consentComplete: 0,
    demographicsShown: 0,
    demographicsComplete: 0,
    introductionShown: 0,
    introductionComplete: 0,
    instructionsShown: 0,
    instructionsComplete: 0,
    firstSurveyQuestionShown: 0,
    surveyComplete: 0,
    experienceShown: 0,
    attentionCheckCompleted: 0,
    attentionCheckStarted: 0,
    experienceComplete: 0,
    financialShown: 0,
    financialComplete: 0,
    purposeShown: 0,
    purposeComplete: 0,
    debriefShown: 0,
    debriefComplete: 0,
    feedback: [],
  };
};

export const updateStats = (stats, CSVData) => {
  if (CSVData.country_of_residence === "usa") {
    stats.countryUSA++;
  } else if (CSVData.country_of_residence) {
    stats.countryOther++;
  }
  if (CSVData.consent_completed_timestamp) {
    stats.consentComplete++;
  } else if (CSVData.consent_shown_timestamp) {
    stats.consentShown++;
    if (!CSVData.purpose_survey_questions_completed_timestamp) {
      surveysInProgress++;
    }
  }
  if (CSVData.demographic_completed_timestamp) {
    stats.demographicsComplete++;
  } else if (CSVData.demographic_shown_timestamp) {
    stats.demographicsShown++;
  }
  if (CSVData.introduction_completed_timestamp) {
    stats.introductionComplete++;
  } else if (CSVData.introduction_shown_timestamp) {
    stats.introductionShown++;
  }
  if (CSVData.instructions_completed_timestamp) {
    stats.instructionsComplete++;
  } else if (CSVData.instructions_shown_timestamp) {
    stats.instructionsShown++;
  }
  if (CSVData.attention_check_completed_timestamp) {
    stats.attentionCheckCompleted++;
  } else if (CSVData.attention_check_shown_timestamp) {
    stats.attentionCheckStarted++;
  }
  if (CSVData.choice_timestamp_8) {
    stats.surveyComplete++;
  } else if (CSVData.shown_timestamp_1) {
    stats.firstSurveyQuestionShown++;
  }
  if (CSVData.experience_survey_questions_completed_timestamp) {
    stats.experienceComplete++;
  } else if (CSVData.experience_survey_questions_shown_timestamp) {
    stats.experienceShown++;
  }
  if (CSVData.financial_lit_survey_questions_completed_timestamp) {
    stats.financialComplete++;
  } else if (CSVData.financial_lit_survey_questions_shown_timestamp) {
    stats.financialShown++;
  }
  if (CSVData.purpose_survey_questions_completed_timestamp) {
    stats.purposeComplete++;
    stats.surveysComplete++;
  } else if (CSVData.purpose_survey_questions_shown_timestamp) {
    stats.purposeShown++;
  }
  if (CSVData.debrief_completed_timestamp) {
    stats.debriefComplete++;
  } else if (CSVData.debrief_shown_timestamp) {
    stats.debriefShown++;
  }
  if (CSVData.feedback) {
    stats.feedback.push({
      date: CSVData.debrief_completed_timestamp,
      feedback: CSVData.feedback,
    });
  }
  return stats;
};
