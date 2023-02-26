import clui from "clui";
import clc from "cli-color";
import { parseCSV } from "./parserUtil.js";

export const drawStatus = (gaugeFactor, surveysTotal, stats) => {
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
    .column(clui.Gauge(countryOther, surveysTotal, 20, 1, countryOther), 30)
    .fill()
    .store();
  title = new clui.Line(outputBuffer)
    .column("", 15, [clc.yellow])
    .column("Breakdown By Step", 20, [clc.yellow])
    .fill()
    .store();
  var header = new clui.Line(outputBuffer)
    .column("Step", 20, [clc.green])
    .column("Progress", 22, [clc.green])
    .column("Count", 5, [clc.green])
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
  stats.feedback.forEach((e) =>
    new clui.Line(outputBuffer).column(e, 80, [clc.white]).fill().store()
  );
  new clui.Line(outputBuffer)
    .column(
      `Ctrl + C to exit the monitor.  Guage factor is ${gaugeFactor}`,
      40,
      [clc.red]
    )
    .fill()
    .store();
  // write a for loop with the top 20 feedback comments
  return outputBuffer;
};

export const updateStats = (stats, CSVfile) => {
  const CSVData = parseCSV(CSVfile);
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
    stats.surveysComplete++;
  } else {
    stats.surveysInProgress++;
  }
  if (CSVData.debrief_completed_timestamp) {
    stats.debriefComplete++;
  }
  if (CSVData.feedback) {
    stats.feedback.push(CSVData.feedback);
  }
  return stats;
};

export const calcStats = (files) => {
  const stats = files.reduce(
    (acc, file) => {
      updateStats(acc, file);
    },
    {
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
    }
  );
  return stats;
};
