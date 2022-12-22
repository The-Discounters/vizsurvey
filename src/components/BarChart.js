import React, { useEffect, useState } from "react";
import { useD3 } from "../hooks/useD3";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Box, Button, ThemeProvider } from "@mui/material";

import { DateTime } from "luxon";
import { AmountType } from "../features/AmountType";
import { StatusType } from "../features/StatusType";
import {
  getCurrentQuestion,
  getCurrentChoice,
  getCurrentQuestionIndex,
  getStatus,
  setQuestionShownTimestamp,
  nextQuestion,
  answer,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { drawBarChart } from "./BarChartComponent";
import { styles, theme, calcScreenValues } from "./ScreenHelper";

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
    switch (status) {
      case StatusType.Instructions:
        navigate("/instruction");
        break;
      case StatusType.FinancialQuestionaire:
        navigate("/financialquestionaire");
        break;
      case StatusType.Attention:
        navigate("/attentioncheck");
        break;
    }
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
