import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { Button, Box, ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { MELSelectionForm } from "./MELSelectionForm.jsx";

import { AmountType } from "@the-discounters/types";
import {
  getCurrentQuestion,
  getCurrentChoice,
  getCurrentQuestionIndex,
  getStatus,
  setQuestionShownTimestamp,
  nextQuestion,
  answer,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { styles, theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";
import { StatusType } from "../features/StatusType.js";

function MELForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let q = useSelector(getCurrentQuestion);
  const qi = useSelector(getCurrentQuestionIndex);
  const status = useSelector(getStatus);
  const choice = useSelector(getCurrentChoice);

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  useEffect(() => {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);

  useEffect(() => {
    if (
      choice === AmountType.earlierAmount ||
      choice === AmountType.laterAmount
    ) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [choice, q.treatmentQuestionId, dispatch]);

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
        <MELSelectionForm
          textShort={q.textShort}
          error={error}
          amountEarlier={q.amountEarlier}
          dateEarlier={q.dateEarlier}
          timeEarlier={q.timeEarlier}
          amountLater={q.amountLater}
          dateLater={q.dateLater}
          timeLater={q.timeLater}
          helperText={helperText}
          onClickCallback={(value) => {
            dispatch(
              answer({
                choice: value,
                choiceTimestamp: dateToState(DateTime.now()),
                window: window,
              })
            );
            setHelperText("");
            setError(false);
          }}
          choice={choice}
        />
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
              onClick={() => {
                if (
                  choice !== AmountType.earlierAmount &&
                  choice !== AmountType.laterAmount
                ) {
                  setError(true);
                  setHelperText("Please choose one of the options below.");
                } else {
                  setError(false);
                  setHelperText("");
                  dispatch(nextQuestion());
                }
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
export default MELForm;
