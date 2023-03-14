import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { ThemeProvider, Box, Button } from "@mui/material";
import { Grid } from "@material-ui/core";
import { useD3 } from "../hooks/useD3.js";
import { AmountType } from "../features/AmountType.js";
import {
  getCurrentQuestion,
  getCurrentChoice,
  getCurrentQuestionIndex,
  getStatus,
  setQuestionShownTimestamp,
  nextQuestion,
  answer,
} from "../features/questionSlice.js";
import { dateToState } from "../features/ConversionUtil.js";
import { drawBarChart } from "./BarChartComponent.js";
import { styles, theme, calcScreenValues } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";
import { StatusType } from "../features/StatusType.js";

function BarChart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const q = useSelector(getCurrentQuestion);
  const qi = useSelector(getCurrentQuestionIndex);
  const status = useSelector(getStatus);
  const choice = useSelector(getCurrentChoice);
  const [disableSubmit, setDisableSubmit] = useState(true);

  useEffect(() => {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
  }, [qi]);

  useEffect(() => {
    switch (choice) {
      case AmountType.earlierAmount:
        setDisableSubmit(false);
        break;
      case AmountType.laterAmount:
        setDisableSubmit(false);
        break;
      default:
        setDisableSubmit(true);
    }
  }, [choice]);

  useEffect(() => {
    const path = navigateFromStatus(status);
    if (
      status !== StatusType.Survey &&
      status !== StatusType.Attention &&
      process.env.REACT_APP_FULLSCREEN === "enabled"
    ) {
      document.exitFullscreen();
    }
    navigate(path);
  }, [status]);

  const onClickCallback = (value) => {
    dispatch(
      answer({
        choice: value,
        choiceTimestamp: dateToState(DateTime.now()),
      })
    );
  };

  const { totalSVGWidth, totalSVGHeight, totalUCWidth, totalUCHeight } =
    calcScreenValues(
      q.horizontalPixels,
      q.verticalPixels,
      q.leftMarginWidthIn,
      q.graphWidthIn,
      q.bottomMarginHeightIn,
      q.graphHeightIn
    );

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
        <Grid item xs={12}>
          <svg
            width={totalSVGWidth}
            height={totalSVGHeight}
            viewBox={`0 0 ${totalUCWidth} ${totalUCHeight}`}
            ref={useD3(
              (svg) => {
                drawBarChart({
                  svg: svg,
                  maxTime: q.maxTime,
                  maxAmount: q.maxAmount,
                  interaction: q.interaction,
                  variableAmount: q.variableAmount,
                  amountEarlier: q.amountEarlier,
                  timeEarlier: q.timeEarlier,
                  amountLater: q.amountLater,
                  timeLater: q.timeLater,
                  onClickCallback: onClickCallback,
                  choice: choice,
                  horizontalPixels: q.horizontalPixels,
                  verticalPixels: q.verticalPixels,
                  leftMarginWidthIn: q.leftMarginWidthIn,
                  graphWidthIn: q.graphWidthIn,
                  bottomMarginHeightIn: q.bottomMarginHeightIn,
                  graphHeightIn: q.graphHeightIn,
                  showMinorTicks: q.showMinorTicks,
                });
              },
              [q]
            )}
          ></svg>
        </Grid>
        <Grid item xs={12} style={{ margin: 0 }}>
          <Box display="flex" justifyContent="center">
            <Button
              id="buttonNext"
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                dispatch(nextQuestion());
              }}
              disabled={disableSubmit}
            >
              {" "}
              Next{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default BarChart;
