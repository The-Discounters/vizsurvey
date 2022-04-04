export class Answer {
  constructor({
    treatmentId: treatmentId,
    position: position,
    viewType: viewType,
    interaction: interaction,
    amountEarlier: amountEarlier,
    timeEarlier: timeEarlier,
    dateEarlier: dateEarlier,
    amountLater: amountLater,
    timeLater: timeLater,
    dateLater: dateLater,
    maxAmount: maxAmount,
    maxTime: maxTime,
    verticalPixels: verticalPixels,
    horizontalPixels: horizontalPixels,
    leftMarginWidthIn: leftMarginWidthIn,
    bottomMarginHeightIn: bottomMarginHeightIn,
    graphWidthIn: graphWidthIn,
    graphHeightIn: graphHeightIn,
    choice: choice,
    shownTimestamp: shownTimestamp,
    choiceTimestamp: choiceTimestamp,
    highup: highup,
    lowdown: lowdown,
    participantCode: participantCode,
  }) {
    this.treatmentId = treatmentId;
    this.position = position;
    this.viewType = viewType;
    this.interaction = interaction;
    this.amountEarlier = amountEarlier;
    this.timeEarlier = timeEarlier;
    this.dateEarlier = dateEarlier;
    this.amountLater = amountLater;
    this.timeLater = timeLater;
    this.dateLater = dateLater;
    this.maxAmount = maxAmount;
    this.maxTime = maxTime;
    this.verticalPixels = verticalPixels;
    this.horizontalPixels = horizontalPixels;
    this.leftMarginWidthIn = leftMarginWidthIn;
    this.bottomMarginHeightIn = bottomMarginHeightIn;
    this.graphWidthIn = graphWidthIn;
    this.graphHeightIn = graphHeightIn;
    this.choice = choice;
    this.shownTimestamp = shownTimestamp;
    this.choiceTimestamp = choiceTimestamp;
    this.highup = highup;
    this.lowdown = lowdown;
    this.participantCode = participantCode;
  }
}
