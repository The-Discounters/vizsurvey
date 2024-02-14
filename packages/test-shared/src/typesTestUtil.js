import {
  SurveyQuestion,
  ViewType,
  InteractionType,
  AmountType,
  ScreenAttributes,
  WindowAttributes,
} from "@the-discounters/types";

export const mockWindowAttributes = () => {
  return WindowAttributes({
    devicePixelRatio: 1,
    innerHeight: null,
    innerWidth: null,
    outerHeight: null,
    outerWidth: null,
    screenLeft: null,
    screenTop: null,
  });
};

export const mockScreenAttributes = () => {
  return ScreenAttributes({
    availHeight: null,
    availWidth: null,
    availLeft: 0,
    availTop: 0,
    colorDepth: 1,
    width: 1,
    height: 1,
    orientationAngle: "100",
    orientationType: "type",
    pixelDepth: 1,
    isExtended: false,
  });
};

export const mockGlobalWindow = {
  ...mockWindowAttributes(),
  screen: mockScreenAttributes(),
};

export const createQuestionNoTitrate = (treatmentId, sequenceId) => {
  return SurveyQuestion({
    treatmentId: treatmentId,
    sequenceId: sequenceId,
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
    windowAttributes: mockWindowAttributes(),
    screenAttributes: mockScreenAttributes(),
  });
};

export const create2ndQuestionNoTitrate = (treatmentId, sequenceId) => {
  return SurveyQuestion({
    treatmentId: treatmentId,
    sequenceId: sequenceId,
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
