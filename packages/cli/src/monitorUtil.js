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

  let firstColWidth = Math.floor((outputBuffer.width() - 49) / 2); // centers the text
  title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column(
      "Breakdown By Country (count / total participants)",
      outputBuffer.width() - firstColWidth,
      [clc.yellow]
    )
    .fill()
    .store();

  // note gauge width parameter doesn't include the suffix text which would be 9 characters if format is ### / ### (assumes we don't run more than 1,000 people)
  var line = new clui.Line(outputBuffer)
    .column("USA", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.countryUSACount,
        stats.totalParticipants,
        outputBuffer.width() - 20 - 9,
        stats.totalParticipants,
        `${stats.countryUSACount} / ${stats.totalParticipants}`
      ),
      //outputBuffer.width() - 20
      outputBuffer.width() - 20
    )
    .fill()
    .store();

  line = new clui.Line(outputBuffer)
    .column("Non USA", 20, [clc.green])
    .column(
      clui.Gauge(
        stats.countryOtherCount,
        stats.totalParticipants,
        outputBuffer.width() - 20 - 9,
        1,
        `${stats.countryOtherCount} / ${stats.totalParticipants}`
      ),
      outputBuffer.width() - 20
    )
    .fill()
    .store();

  firstColWidth = Math.floor((outputBuffer.width() - 46) / 2);
  title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column(
      "Breakdown By Step (count / total participants)",
      outputBuffer.width() - firstColWidth,
      [clc.yellow]
    )
    .fill()
    .store();

  firstColWidth = 22; // width of longest StatusType
  Object.keys(StatusType).forEach((status) => {
    line = new clui.Line(outputBuffer).column(`${status}`, firstColWidth, [
      clc.green,
    ]);
    if (
      status === StatusType.Survey ||
      status === StatusType.Debrief ||
      status === StatusType.Finished
    ) {
      const columnWidth =
        (outputBuffer.width() - firstColWidth - 9) / stats.treatments.size;
      // TODO show column with treatment id in header
      stats.countsForStatus(status).forEach((count, treatmentId) => {
        line.column(
          clui.Gauge(
            count,
            stats.totalParticipants,
            columnWidth,
            stats.totalParticipants,
            `${value} / ${stats.totalParticipants}`
          ),
          columnWidth
        );
      });
      line.fill().store();
    } else {
      const columnWidth = outputBuffer.width() - firstColWidth - 9;
      line
        .column(
          clui.Gauge(
            stats.countsForStatus(status),
            stats.totalParticipants,
            columnWidth,
            1,
            `${stats.countsForStatus(status)} / ${stats.totalParticipants}`
          ),
          columnWidth
        )
        .fill()
        .store();
    }
  });

  firstColWidth = Math.floor((outputBuffer.width() - 8) / 2);
  var title = new clui.Line(outputBuffer)
    .column("", firstColWidth, [clc.yellow])
    .column("Feedback", outputBuffer.width() - firstColWidth, [clc.yellow])
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

  firstColWidth = Math.floor((outputBuffer.width() - 29) / 2);
  new clui.Line(outputBuffer)
    .column(`Ctrl + C to exit the monitor.`, firstColWidth, [clc.yellow])
    .fill()
    .store();

  return outputBuffer;
};
