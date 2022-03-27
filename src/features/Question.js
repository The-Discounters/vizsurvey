import { ViewType } from "./ViewType";
import { TitrationType } from "./TitrationType";

export class Question {
  constructor({
    treatmentId,
    position,
    viewType,
    titration,
    amountEarlier,
    timeEarlier,
    dateEarlier,
    amountLater,
    timeLater,
    dateLater,
    maxAmount,
    maxTime,
    horizontalPixels,
    verticalPixels,
    leftMarginWidthIn,
    bottomMarginHeightIn,
    graphWidthIn,
    graphHeightIn,
    width,
    height,
    comment,
  }) {
    this.treatmentId = treatmentId;
    this.position = position;
    this.viewType = viewType;
    this.titration = titration;
    this.amountEarlier = amountEarlier;
    this.timeEarlier = timeEarlier;
    this.dateEarlier = dateEarlier;
    this.amountLater = amountLater;
    this.timeLater = timeLater;
    this.dateLater = dateLater;
    this.maxAmount = maxAmount;
    this.maxTime = maxTime;
    this.horizontalPixels = horizontalPixels;
    this.verticalPixels = verticalPixels;
    this.leftMarginWidthIn = leftMarginWidthIn;
    this.bottomMarginHeightIn = bottomMarginHeightIn;
    this.graphWidthIn = graphWidthIn;
    this.graphHeightIn = graphHeightIn;
    this.width = width;
    this.height = height;
    this.comment = comment;
  }

  static fromCSVRow(row) {
    console.log("in fromCSVRow");
    return new Question({
      treatmentId: +row.treatment_id,
      position: +row.position,
      viewType: ViewType.enumValueOf(row.view_type),
      titration: TitrationType.enumValueOf(row.titration),
      amountEarlier: +row.amount_earlier,
      timeEarlier: row.time_earlier ? +row.time_earlier : undefined,
      dateEarlier: row.date_earlier ? new Date(row.date_earlier) : undefined,
      amountLater: +row.amount_later,
      timeLater: row.time_later ? +row.time_later : undefined,
      dateLater: row.date_later ? new Date(row.date_later) : undefined,
      maxAmount: +row.max_amount,
      maxTime: +row.max_time,
      horizontalPixels: +row.horizontal_pixels,
      verticalPixels: +row.vertical_pixels,
      leftMarginWidthIn: +row.left_margin_width,
      bottomMarginHeightIn: +row.bottom_margin_height,
      graphWidthIn: +row.graph_width_in,
      graphHeightIn: +row.graph_height_in,
      width: +row.width,
      height: +row.height,
      comment: row.comment,
    });
  }
}
