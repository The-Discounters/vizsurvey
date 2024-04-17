import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { ThemeProvider, StyledEngineProvider, Button } from "@mui/material";
import { Grid } from "@mui/material";
import {
  AmountType,
  WindowAttributes,
  ScreenAttributes,
} from "@the-discounters/types";
import { dateToState } from "@the-discounters/util";
import { StatusType } from "@the-discounters/types";
import { ViewType } from "@the-discounters/types";
import { useTranslation } from "react-i18next";

import { useKeyDown } from "../hooks/useKeydown.js";
import {
  getCurrentQuestion,
  getCurrentChoice,
  getCurrentDragAmount,
  getCurrentQuestionIndex,
  getStatus,
  getExperiment,
  setQuestionShownTimestamp,
  nextQuestion,
  answer,
} from "../features/questionSlice.js";
import { MELCalendarComponent } from "./MELCalendarComponent.js";
import { MELBarChartComponent } from "./MELBarChartComponent.js";
import { MELWordComponent } from "./MELWordComponent.js";
import { styles, theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";

export function Survey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(" ");
  const q = useSelector(getCurrentQuestion);
  const qi = useSelector(getCurrentQuestionIndex);
  const status = useSelector(getStatus);
  const choice = useSelector(getCurrentChoice);
  const experiment = useSelector(getExperiment);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const dragAmount = useSelector(getCurrentDragAmount);

  const handleKeyDownEvent = (event) => {
    switch (event.code) {
      case "Enter":
        if (
          choice !== AmountType.earlierAmount &&
          choice !== AmountType.laterAmount
        ) {
          setError(true);
          setHelperText(
            "Press the left arrow key to select the earlier amount and the right arrow key to select the later amount."
          );
        } else {
          setHelperText(" ");
          setError(false);
          dispatch(nextQuestion());
        }
        break;
      case "ArrowLeft":
        setHelperText(" ");
        setError(false);
        dispatch(
          answer({
            choice: AmountType.earlierAmount,
            choiceTimestamp: dateToState(DateTime.now()),
            window: WindowAttributes(window),
            screen: ScreenAttributes(window.screen),
          })
        );
        break;
      case "ArrowRight":
        dispatch(
          answer({
            choice: AmountType.laterAmount,
            choiceTimestamp: dateToState(DateTime.now()),
            window: WindowAttributes(window),
            screen: ScreenAttributes(window.screen),
          })
        );
        setHelperText(" ");
        setError(false);
        break;
      default:
    }
  };

  useKeyDown(
    (event) => {
      handleKeyDownEvent(event);
    },
    ["Enter", "ArrowLeft", "ArrowRight"]
  );

  useEffect(() => {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);

  useEffect(() => {
    if (
      choice === AmountType.earlierAmount ||
      choice === AmountType.laterAmount
    ) {
      setError(false);
      setHelperText(" ");
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [choice, dragAmount, q.treatmentQuestionId]);

  useEffect(() => {
    const path = navigateFromStatus(status);
    if (
      status !== StatusType.Survey &&
      status !== StatusType.Attention &&
      experiment.fullScreen === "enabled" &&
      document.fullscreenElement
    ) {
      document.exitFullscreen();
    }
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const showSelectionHint = (selection) => {
    let errorMsg;
    if (selection === AmountType.earlierAmount) {
      errorMsg = t("leftArrowTooltip");
    } else if (selection === AmountType.laterAmount) {
      errorMsg = t("rightArrowTooltip");
    }
    setHelperText(errorMsg);
    setError(true);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={12}>
            {(() => {
              switch (q.viewType) {
                case ViewType.barchart:
                  return (
                    <MELBarChartComponent
                      maxTime={q.maxTime}
                      maxAmount={q.maxAmount}
                      interaction={q.interaction}
                      variableAmount={q.variableAmount}
                      amountEarlier={q.amountEarlier}
                      timeEarlier={q.timeEarlier}
                      amountLater={q.amountLater}
                      timeLater={q.timeLater}
                      horizontalPixels={q.horizontalPixels}
                      verticalPixels={q.verticalPixels}
                      leftMarginWidthIn={q.leftMarginWidthIn}
                      graphWidthIn={q.graphWidthIn}
                      bottomMarginHeightIn={q.bottomMarginHeightIn}
                      graphHeightIn={q.graphHeightIn}
                      showMinorTicks={q.showMinorTicks}
                      error={error}
                      helperText={helperText}
                      choice={choice}
                      onClickCallback={(selection) => {
                        showSelectionHint(selection);
                      }}
                      onHoverOverSelection={(selection) => {
                        showSelectionHint(selection);
                      }}
                      onHoverOutSelection={(selection) => {
                        setHelperText(" ");
                        setError(false);
                      }}
                    />
                  );
                case ViewType.word:
                  return (
                    <MELWordComponent
                      textShort={"MELRadioGroup"}
                      amountEarlier={q.amountEarlier}
                      timeEarlier={q.timeEarlier}
                      dateEarlier={q.dateEarlier}
                      amountLater={q.amountLater}
                      timeLater={q.timeLater}
                      dateLater={q.dateLater}
                      error={error}
                      helperText={helperText}
                      choice={choice}
                      onClickCallback={(value) => {
                        let errorMsg;
                        if (value === AmountType.earlierAmount) {
                          errorMsg = t("leftArrowTooltip");
                        } else if (value === AmountType.laterAmount) {
                          errorMsg = t("rightArrowTooltip");
                        }
                        setHelperText(errorMsg);
                        setError(true);
                      }}
                    />
                  );
                case ViewType.calendarBar:
                case ViewType.calendarIcon:
                case ViewType.calendarWord:
                case ViewType.calendarWordYear:
                case ViewType.calendarWordYearDual:
                  return (
                    <MELCalendarComponent
                      viewType={q.viewType}
                      amountEarlier={q.amountEarlier}
                      dateEarlier={q.dateEarlier}
                      amountLater={q.amountLater}
                      dateLater={q.dateLater}
                      error={error}
                      helperText={helperText}
                      choice={choice}
                      onClickCallback={(value) => {
                        let errorMsg;
                        if (value === AmountType.earlierAmount) {
                          errorMsg = t("leftArrowTooltip");
                        } else if (value === AmountType.laterAmount) {
                          errorMsg = t("rightArrowTooltip");
                        }
                        setHelperText(errorMsg);
                        setError(true);
                      }}
                    />
                  );
                default:
                  return "";
              }
            })()}
          </Grid>
          <Grid item xs={12}>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
          </Grid>
          <Grid item align="center" xs={12}>
            <Button
              id="buttonNext"
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              disabled={disableSubmit}
              onClick={() => {
                setError(true);
                setHelperText(
                  t("tooltipEnterSelectionInstructions", {
                    choice:
                      choice === AmountType.earlierAmount
                        ? "earlier amount"
                        : "later amount",
                  })
                );
              }}
            >
              Press Enter to advance to the next question
            </Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Survey;
