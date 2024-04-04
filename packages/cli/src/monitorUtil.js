import clui from "clui";
import clc from "cli-color";
import { StatusType } from "@the-discounters/types";

export const drawStatus = (stats) => {
  var outputBuffer = new clui.LineBuffer({
    x: 0,
    y: 0,
    width: "console",
    height: "console",
  });
  const firstColumnLabelWidth = 22;
  // note gauge width parameter doesn't include the suffix text which would be 9 characters if format is ### / ### (assumes we don't run more than 1,000 people)
  const countOutOfWidth = 10;

  let centerTitleTextWidth = Math.floor((outputBuffer.width() - 49) / 2); // centers the text
  title = new clui.Line(outputBuffer)
    .column("", centerTitleTextWidth, [clc.yellow])
    .column(
      "Breakdown By Country (count / total participants)",
      outputBuffer.width() - centerTitleTextWidth,
      [clc.yellow]
    )
    .fill()
    .store();

  var line = new clui.Line(outputBuffer)
    .column("USA", firstColumnLabelWidth, [clc.green])
    .column(
      clui.Gauge(
        stats.countryUSACount,
        stats.totalParticipants,
        outputBuffer.width() - firstColumnLabelWidth - countOutOfWidth,
        stats.totalParticipants,
        `${stats.countryUSACount} / ${stats.totalParticipants}`
      ),
      outputBuffer.width() - firstColumnLabelWidth
    )
    .fill()
    .store();

  line = new clui.Line(outputBuffer)
    .column("Non USA", firstColumnLabelWidth, [clc.green])
    .column(
      clui.Gauge(
        stats.countryOtherCount,
        stats.totalParticipants,
        outputBuffer.width() - firstColumnLabelWidth - countOutOfWidth,
        1,
        `${stats.countryOtherCount} / ${stats.totalParticipants}`
      ),
      outputBuffer.width() - firstColumnLabelWidth
    )
    .fill()
    .store();

  centerTitleTextWidth = Math.floor((outputBuffer.width() - 46) / 2);
  title = new clui.Line(outputBuffer)
    .column("", centerTitleTextWidth, [clc.yellow])
    .column(
      "Breakdown By Step (count / total participants)",
      outputBuffer.width() - centerTitleTextWidth,
      [clc.yellow]
    )
    .fill()
    .store();

  Object.values(StatusType).forEach((status) => {
    if (
      status === StatusType.Survey ||
      status === StatusType.Debrief ||
      status === StatusType.Finished
    ) {
      const treatmentColWidth = Math.floor(
        (outputBuffer.width() - firstColumnLabelWidth) / stats.treatments.size
      );
      line = new clui.Line(outputBuffer).column(
        "",
        firstColumnLabelWidth + Math.floor(treatmentColWidth / 2) - 1,
        [clc.yellow]
      );
      stats.treatments.forEach((noQuestions, treatmentId) => {
        line.column(`${treatmentId}`, treatmentColWidth - 1, [clc.yellow]);
      });
      line.fill().store();
      line = new clui.Line(outputBuffer).column(
        `${status}`,
        firstColumnLabelWidth,
        [clc.green]
      );
      stats.countsForStatus(status).forEach((count, treatmentId) => {
        line
          .column(
            clui.Gauge(
              count,
              stats.totalParticipants,
              treatmentColWidth - countOutOfWidth,
              stats.totalParticipants,
              `${count} / ${
                stats.totalParticipants * stats.treatments.get(treatmentId)
              }`
            ),
            treatmentColWidth
          )
          .column("", 1);
      });
      line.fill().store();
    } else {
      line = new clui.Line(outputBuffer).column(
        `${status}`,
        firstColumnLabelWidth,
        [clc.green]
      );
      line
        .column(
          clui.Gauge(
            stats.countsForStatus(status),
            stats.totalParticipants,
            outputBuffer.width() - firstColumnLabelWidth - countOutOfWidth,
            1,
            `${stats.countsForStatus(status)} / ${stats.totalParticipants}`
          ),
          outputBuffer.width() - firstColumnLabelWidth
        )
        .fill()
        .store();
    }
  });

  centerTitleTextWidth = Math.floor((outputBuffer.width() - 8) / 2);
  var title = new clui.Line(outputBuffer)
    .column("", centerTitleTextWidth, [clc.yellow])
    .column("Feedback", outputBuffer.width() - centerTitleTextWidth, [
      clc.yellow,
    ])
    .fill()
    .store();
  stats.feedback
    .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
    .slice(0, outputBuffer.height() - 20)
    .forEach((e) =>
      new clui.Line(outputBuffer)
        .column(
          `${e.date}: ${e.feedback.slice(0, outputBuffer.width())}`,
          "console",
          [clc.white]
        )
        .fill()
        .store()
    );

  centerTitleTextWidth = Math.floor((outputBuffer.width() - 29) / 2);
  new clui.Line(outputBuffer)
    .column(`Ctrl + C to exit the monitor.`, centerTitleTextWidth, [clc.yellow])
    .fill()
    .store();

  return outputBuffer;
};
