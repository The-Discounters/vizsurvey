import clui from "clui";
import clc from "cli-color";

export const drawStatus = (
  gaugeFactor,
  surveysTotal,
  surveysComplete,
  surveysInProgress,
  countryUSA,
  countryOther,
  consentComplete,
  demographicsComplete,
  introductionComplete,
  instructionsComplete,
  surveyComplete,
  experienceComplete,
  financialComplete,
  purposeComplete,
  debriefComplete,
  feedback
) => {
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
        surveysComplete,
        surveysTotal,
        20,
        surveysTotal,
        surveysComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Surveys In Progress", 20, [clc.green])
    .column(
      clui.Gauge(
        surveysInProgress,
        surveysTotal,
        20,
        surveysTotal,
        surveysInProgress
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
      clui.Gauge(countryUSA, surveysTotal, 20, surveysTotal, countryUSA),
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
        consentComplete,
        surveysTotal,
        20,
        surveysTotal,
        consentComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Demographic", 20, [clc.green])
    .column(
      clui.Gauge(
        demographicsComplete,
        surveysTotal,
        20,
        surveysTotal,
        demographicsComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Introduction", 20, [clc.green])
    .column(
      clui.Gauge(
        introductionComplete,
        surveysTotal,
        20,
        surveysTotal,
        introductionComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Instruction", 20, [clc.green])
    .column(
      clui.Gauge(
        instructionsComplete,
        surveysTotal,
        20,
        surveysTotal,
        instructionsComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        surveyComplete,
        surveysTotal,
        20,
        surveysTotal,
        surveyComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Experience Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        experienceComplete,
        surveysTotal,
        20,
        surveysTotal,
        experienceComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Financial Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        financialComplete,
        surveysTotal,
        20,
        surveysTotal,
        financialComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Purpose Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        purposeComplete,
        surveysTotal,
        20,
        surveysTotal,
        purposeComplete
      ),
      30
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer)
    .column("Debrief Survey", 20, [clc.green])
    .column(
      clui.Gauge(
        debriefComplete,
        surveysTotal,
        20,
        surveysTotal,
        debriefComplete
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
  feedback.forEach((e) =>
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

export const calcStats = (laterThanDate, workingDir) => {
  const stats = new Map();
  downloadFiles(appendSepToPath(workingDir), laterThanDate);
};
