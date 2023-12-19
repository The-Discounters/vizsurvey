import {
  SurveyQuestion,
  ViewType,
  InteractionType,
  AmountType,
} from "@the-discounters/types";

export const createQuestionNoTitrate = (treatmentId, positionId) => {
  return SurveyQuestion({
    treatmentId: treatmentId,
    position: positionId,
    viewType: ViewType.barchart,
    interaction: InteractionType.none,
    variableAmount: AmountType.laterAmount,
    amountEarlier: 400,
    timeEarlier: 1,
    dateEarlier: undefined,
    amountLater: 500,
    timeLater: 3,
    dateLater: undefined,
    maxAmount: 500,
    maxTime: 8,
    horizontalPixels: 480,
    verticalPixels: 480,
    leftMarginWidthIn: 0.5,
    bottomMarginHeightIn: 0.5,
    graphWidthIn: 6,
    graphHeightIn: 6,
    widthIn: 6.5,
    heightIn: 6.5,
    comment: "No titration test case.",
  });
};

export const create2ndQuestionNoTitrate = (treatmentId, positionId) => {
  return SurveyQuestion({
    treatmentId: treatmentId,
    position: positionId,
    viewType: ViewType.barchart,
    interaction: InteractionType.none,
    variableAmount: AmountType.laterAmount,
    amountEarlier: 200,
    timeEarlier: 2,
    dateEarlier: undefined,
    amountLater: 1000,
    timeLater: 4,
    dateLater: undefined,
    maxAmount: 500,
    maxTime: 8,
    horizontalPixels: 480,
    verticalPixels: 480,
    leftMarginWidthIn: 0.5,
    bottomMarginHeightIn: 0.5,
    graphWidthIn: 6,
    graphHeightIn: 6,
    widthIn: 6.5,
    heightIn: 6.5,
    comment: "No titration test case second treatment.",
  });
};
