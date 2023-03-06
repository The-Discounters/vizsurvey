import clui from "clui";
import clc from "cli-color";
import { stateToDate } from "./ConversionUtil.js";

export const drawStatus = (
  surveysTotal,
  stats,
  monitorRunning,
  inProgressMax,
  numTreatments
) => {
  var outputBuffer = new clui.LineBuffer({
    x: 0,
    y: 0,
    width: "console",
    height: "console",
  });

  let firstColWidth = Math.floor((outputBuffer.width() - 35) / 2);
  var title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column(
      "Totals (count / total participants)",
      outputBuffer.width() - firstColWidth,
      [clc.yellow]
    )
    .fill()
    .store();
  var line;
  line = new clui.Line(outputBuffer).column(`Surveys Completed`, 20, [
    clc.green,
  ]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.surveysComplete[i - 1],
        surveysTotal,
        15,
        surveysTotal,
        `${stats.surveysComplete[i - 1]} / ${surveysTotal}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Surveys In Progress`, 20, [
    clc.green,
  ]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.surveysInProgress[i - 1],
        surveysTotal,
        15,
        surveysTotal,
        stats.surveysInProgress[i - 1]
      ),
      30
    );
  }
  line.fill().store();

  firstColWidth = Math.floor((outputBuffer.width() - 49) / 2);
  title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column(
      "Breakdown By Country (count / total participants)",
      outputBuffer.width() - firstColWidth,
      [clc.yellow]
    )
    .fill()
    .store();

  line = new clui.Line(outputBuffer)
    .column("USA", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.countryUSA,
        surveysTotal,
        15,
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
        15,
        1,
        `${stats.countryOther} / ${surveysTotal}`
      ),
      30
    )
    .fill()
    .store();

  firstColWidth = Math.floor((outputBuffer.width() - 54) / 2);
  title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column(
      "Breakdown By Later Choice (count / total participants)",
      outputBuffer.width() - firstColWidth,
      [clc.yellow]
    )
    .fill()
    .store();
  line = new clui.Line(outputBuffer).column(`Later Choice`, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.laterChoice[[i - 1]],
        surveysTotal,
        15,
        surveysTotal,
        `${stats.laterChoice[i - 1]} / ${surveysTotal}`
      ),
      30
    );
  }
  line.fill().store();

  firstColWidth = Math.floor((outputBuffer.width() - 45) / 2);
  title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column(
      "Breakdown By Step (count / bar max)",
      outputBuffer.width() - firstColWidth,
      [clc.yellow]
    )
    .fill()
    .store();

  line = new clui.Line(outputBuffer).column(`Consent`, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.consentInProgress[[i - 1]],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.consentInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Demographic`, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.demographicsInProgress[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.demographicsInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Introduction`, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.introductionInProgress[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.introductionInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Instruction `, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.instructionsInProgress[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.instructionsInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Survey`, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.choicesInProgress[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.choicesInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Experience Survey`, 20, [
    clc.green,
  ]);

  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.experienceComplete[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.experienceInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Financial Survey`, 20, [
    clc.green,
  ]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.financialComplete[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.financialInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Purpose Survey`, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.purposeInProgress[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.purposeInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  line = new clui.Line(outputBuffer).column(`Debrief Survey`, 20, [clc.green]);
  for (let i = 1; i <= numTreatments; i++) {
    line.column(
      clui.Gauge(
        stats.debriefInProgress[i - 1],
        inProgressMax,
        15,
        inProgressMax,
        `${stats.debriefInProgress[i - 1]} / ${inProgressMax}`
      ),
      30
    );
  }
  line.fill().store();

  firstColWidth = Math.floor((outputBuffer.width() - 8) / 2);

  var title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column("Feedback", outputBuffer.width() - firstColWidth, [clc.yellow])
    .fill()
    .store();

  stats.feedback
    .sort((a, b) => {
      const aDate = stateToDate(a.date);
      const bDate = stateToDate(b.date);
      return aDate < bDate ? 1 : aDate > bDate ? -1 : 0;
    })
    .slice(0, outputBuffer.height() - 20)
    .forEach((e) =>
      new clui.Line(outputBuffer)
        .column(`${e.treatmentId} ${e.date}: ${e.feedback}`, "console", [
          clc.white,
        ])
        .fill()
        .store()
    );

  const threeColumnWidth = Math.floor(outputBuffer.width() / 3);
  new clui.Line(outputBuffer)
    .column(
      `Monitor ${monitorRunning ? "Running" : "Paused"}`,
      threeColumnWidth,
      [clc.black.bgWhite]
    )
    .column(`Enter to pause and resume.`, threeColumnWidth, [clc.yellow])
    .column(`Ctrl + C to exit the monitor.`, threeColumnWidth, [clc.yellow])
    .fill()
    .store();

  return outputBuffer;
};
