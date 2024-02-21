import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { ThemeProvider, Box, Button } from "@mui/material";
import { Grid } from "@material-ui/core";
import {
  AmountType,
  WindowAttributes,
  ScreenAttributes,
} from "@the-discounters/types";
import { dateToState } from "@the-discounters/util";
import { StatusType } from "../features/StatusType.js";
import { useKeyDown } from "../hooks/useKeydown.js";
import {
  getCurrentQuestion,
  getCurrentChoice,
  getCurrentDragAmount,
  getCurrentQuestionIndex,
  getStatus,
  setQuestionShownTimestamp,
  nextQuestion,
  answer,
} from "../features/questionSlice.js";
import { CalendarComponent } from "./CalendarComponent.js";
import { styles, theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";

export function Calendar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const q = useSelector(getCurrentQuestion);
  const qi = useSelector(getCurrentQuestionIndex);
  const status = useSelector(getStatus);
  const choice = useSelector(getCurrentChoice);
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
          setHelperText("");
          setError(false);
          dispatch(nextQuestion());
        }
        break;
      case "ArrowLeft":
        setHelperText("");
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
        setHelperText("");
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
      setHelperText("");
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
      process.env.REACT_APP_FULLSCREEN === "enabled" &&
      document.fullscreenElement
    ) {
      document.exitFullscreen();
    }
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
        <Grid item xs={12}>
          <CalendarComponent
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
                errorMsg =
                  "To choose the earlier amount use the left arrow key.";
              } else if (value === AmountType.laterAmount) {
                errorMsg =
                  "To choose the later amount use the right arrow key.";
              }
              setHelperText(errorMsg);
              setError(true);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <hr
            style={{
              backgroundColor: "#aaaaaa",
              height: 4,
            }}
          />
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
              disabled={disableSubmit}
              onClick={() => {
                setError(true);
                setHelperText(
                  `Press the Enter key to accept your selection of ${
                    choice === AmountType.earlierAmount
                      ? "earlier amount"
                      : "later amount"
                  } and start the survey.`
                );
              }}
            >
              Press Enter to advance to the next question
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Calendar;
