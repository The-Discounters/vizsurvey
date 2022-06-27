export const calcScreenValues = (q) => {
  var totalUCWidth;
  var totalUCHeight;
  var totalSVGWidth;
  var totalSVGHeight;
  var leftOffSetUC;
  var bottomOffSetUC;
  var barAreaWidthUC;
  var barAreaHeightUC;
  var barWidth;
  if (q.horizontalPixels && q.verticalPixels) {
    totalUCWidth = q.horizontalPixels * window.devicePixelRatio;
    totalUCHeight = q.verticalPixels * window.devicePixelRatio;
    totalSVGWidth = `${totalUCWidth}px`;
    totalSVGHeight = `${totalUCHeight}px`;
    leftOffSetUC = 150;
    bottomOffSetUC = 80;
    barAreaWidthUC = totalUCWidth - leftOffSetUC;
    barAreaHeightUC = totalUCHeight - bottomOffSetUC;
    barWidth = 20;
  } else {
    // SVG thinks the resolution is 96 ppi when macbook is 132 ppi so we need to adjust by device pixel ratio
    const minScreenRes = Math.min(window.screen.height, window.screen.width);
    totalUCWidth = minScreenRes;
    totalUCHeight = minScreenRes;
    const pixelRatioScale = window.devicePixelRatio >= 2 ? 132 / 96 : 1;
    const totalSVGWidthIn = q.leftMarginWidthIn + q.graphWidthIn;
    const totalSVGHeightIn = q.bottomMarginHeightIn + q.graphHeightIn;
    const scaleHorizUCPerIn = minScreenRes / totalSVGWidthIn;
    const scaleVertUCPerIn = minScreenRes / totalSVGHeightIn;

    totalSVGWidth = `${totalSVGWidthIn * pixelRatioScale}in`;
    totalSVGHeight = `${totalSVGHeightIn * pixelRatioScale}in`;
    leftOffSetUC = scaleHorizUCPerIn * q.leftMarginWidthIn;
    bottomOffSetUC = scaleVertUCPerIn * q.bottomMarginHeightIn;
    barAreaWidthUC = minScreenRes - leftOffSetUC;
    barAreaHeightUC = minScreenRes - bottomOffSetUC;
    barWidth = 0.5 * scaleHorizUCPerIn; // bars are 0.1 inch wide
  }
  return {
    totalUCWidth,
    totalUCHeight,
    totalSVGWidth,
    totalSVGHeight,
    leftOffSetUC,
    bottomOffSetUC,
    barAreaWidthUC,
    barAreaHeightUC,
    barWidth,
  };
};