import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { Button, Box, ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { MELSelectionForm } from "./MELSelectionForm.jsx";

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
  }, [choice, qi]);

  useEffect(() => {
    const path = navigateFromStatus(status);
    if (
      status === StatusType.Demographic &&
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
    setHelperText("");
    setError(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
        <MELSelectionForm
          textShort={q.textShort}
          error={error}
          amountEarlier={q.amountEarlier}
          timeEarlier={q.timeEarlier}
          amountLater={q.amountLater}
          timeLater={q.timeLater}
          helperText={helperText}
          onClickCallback={onClickCallback}
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
