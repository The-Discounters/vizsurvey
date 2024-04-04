import { createTheme } from "@mui/material";

import { adaptV4Theme } from "@mui/material/styles";

export const styles = {
  root: { flexGrow: 1, margin: 20 },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

export const theme = createTheme(
  adaptV4Theme({
    direction: "rtl",
    typography: {
      htmlFontSize: 12,
    },
  })
);

export const calcScreenValues = (
  horizontalPixels,
  verticalPixels,
  leftMarginWidthIn,
  graphWidthIn,
  bottomMarginHeightIn,
  graphHeightIn
) => {
  var totalUCWidth;
  var totalUCHeight;
  var totalSVGWidth;
  var totalSVGHeight;
  var leftOffSetUC;
  var bottomOffSetUC;
  var barAreaWidthUC;
  var barAreaHeightUC;
  var barWidth;
  if (horizontalPixels && verticalPixels) {
    totalUCWidth = horizontalPixels;
    totalUCHeight = verticalPixels;
    totalSVGWidth = `${totalUCWidth}px`;
    totalSVGHeight = `${totalUCHeight}px`;
    leftOffSetUC = 200;
    bottomOffSetUC = 100;
    barAreaWidthUC = totalUCWidth - leftOffSetUC;
    barAreaHeightUC = totalUCHeight - bottomOffSetUC;
    barWidth = 20;
  } else {
    // SVG thinks the resolution is 96 ppi when macbook is 132 ppi so we need to adjust by device pixel ratio
    const minScreenRes = Math.min(window.innerHeight, window.innerWidth);
    totalUCWidth = minScreenRes;
    totalUCHeight = minScreenRes;
    const pixelRatioScale = window.devicePixelRatio >= 2 ? 132 / 96 : 1;
    const totalSVGWidthIn = leftMarginWidthIn + graphWidthIn;
    const totalSVGHeightIn = bottomMarginHeightIn + graphHeightIn;
    const scaleHorizUCPerIn = minScreenRes / totalSVGWidthIn;
    const scaleVertUCPerIn = minScreenRes / totalSVGHeightIn;

    totalSVGWidth = `${totalSVGWidthIn * pixelRatioScale}in`;
    totalSVGHeight = `${totalSVGHeightIn * pixelRatioScale}in`;
    leftOffSetUC = scaleHorizUCPerIn * leftMarginWidthIn;
    bottomOffSetUC = scaleVertUCPerIn * bottomMarginHeightIn;
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
