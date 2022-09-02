import { createTheme } from "@mui/material";

export const styles = {
  root: { flexGrow: 1, margin: 0 },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

export const theme = createTheme({
  direction: "rtl",
  typography: {
    htmlFontSize: 12,
  },
});

export const selectEmpty = {
  marginTop: theme.spacing(2),
};

export const formControl = {
  margin: theme.spacing(1),
  flexGrow: 1,
};

export const formLabel = {
  fontSize: 32,
  color: "black",
};

export const formControlLabel = {
  color: "black",
  ".MuiTypography-root": { fontSize: 32 },
};

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
    totalUCWidth = q.horizontalPixels;
    totalUCHeight = q.verticalPixels;
    totalSVGWidth = `${totalUCWidth}px`;
    totalSVGHeight = `${totalUCHeight}px`;
    leftOffSetUC = 200;
    bottomOffSetUC = 100;
    barAreaWidthUC = totalUCWidth - leftOffSetUC;
    barAreaHeightUC = totalUCHeight - bottomOffSetUC;
    barWidth = 40;
  } else {
    // SVG thinks the resolution is 96 ppi when macbook is 132 ppi so we need to adjust by device pixel ratio
    const minScreenRes = Math.min(window.innerHeight, window.innerWidth);
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
