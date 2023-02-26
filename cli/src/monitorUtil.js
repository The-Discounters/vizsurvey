import clui from "clui";
import clc from "cli-color";
import { stateToDate } from "./ConversionUtil.js";

export const drawStatus = (surveysTotal, stats) => {
  var outputBuffer = new clui.LineBuffer({
    x: 0,
    y: 0,
    width: "console",
    height: "console",
  });
  var title = new clui.Line(outputBuffer)
    .column("", 15, [clc.yellow])
    .column("Totals", 20, [clc.yellow])
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
        stats.surveysComplete
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
    .column("Breakdown By Country", 20, [clc.yellow])
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
        stats.countryUSA
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Non USA", 20, [clc.green])
    .column(
      clui.Gauge(stats.countryOther, surveysTotal, 20, 1, stats.countryOther),
      30
    )
    .fill()
    .store();
  title = new clui.Line(outputBuffer)
    .column("", 15, [clc.yellow])
    .column("Breakdown By Step", 20, [clc.yellow])
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Consent", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.consentComplete,
        surveysTotal,
        20,
        surveysTotal,
        stats.consentComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Demographic", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.demographicsComplete,
        surveysTotal,
        20,
        surveysTotal,
        stats.demographicsComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Introduction", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.introductionComplete,
        surveysTotal,
        20,
        surveysTotal,
        stats.introductionComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Instruction", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.instructionsComplete,
        surveysTotal,
        20,
        surveysTotal,
        stats.instructionsComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.surveyComplete,
        surveysTotal,
        20,
        surveysTotal,
        stats.surveyComplete
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
        surveysTotal,
        20,
        surveysTotal,
        stats.experienceComplete
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
        surveysTotal,
        20,
        surveysTotal,
        stats.financialComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Purpose Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.purposeComplete,
        surveysTotal,
        20,
        surveysTotal,
        stats.purposeComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Debrief Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.debriefComplete,
        surveysTotal,
        20,
        surveysTotal,
        stats.debriefComplete
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
  return outputBuffer;
};
export const createStat = () => {
  return {
    surveysComplete: 0,
    surveysInProgress: 0,
    countryUSA: 0,
    countryOther: 0,
    consentComplete: 0,
    demographicsComplete: 0,
    introductionComplete: 0,
    instructionsComplete: 0,
    surveyComplete: 0,
    experienceComplete: 0,
    financialComplete: 0,
    purposeComplete: 0,
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
  }
  if (CSVData.choice_timestamp_8) {
    stats.surveysComplete++;
  }
  if (CSVData.demographic_completed_timestamp) {
    stats.demographicsComplete++;
  }
  if (CSVData.introductionComplete) {
    stats.introductionComplete++;
  }
  if (CSVData.instructionsComplete) {
    stats.instructionsComplete++;
  }
  if (CSVData.choice_timestamp_8) {
    stats.surveyComplete++;
  }
  if (CSVData.experience_survey_questions_completed_timestamp) {
    stats.experienceComplete++;
  }
  if (CSVData.financial_lit_survey_questions_completed_timestamp) {
    stats.financialComplete++;
  }
  if (CSVData.purpose_survey_questions_completed_timestamp) {
    stats.purposeComplete++;
  } else {
    stats.surveysInProgress++;
  }
  if (CSVData.debrief_completed_timestamp) {
    stats.debriefComplete++;
  }
  if (CSVData.feedback) {
    stats.feedback.push({
      date: CSVData.debrief_completed_timestamp,
      feedback: CSVData.feedback,
    });
  }
  return stats;
};
