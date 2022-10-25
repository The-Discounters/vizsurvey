import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { Button, Box, ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { MELSelectionForm } from "./MELSelectionForm";

import { AmountType } from "../features/AmountType";
import { StatusType } from "../features/StatusType";
import {
  getCurrentQuestion,
  getCurrentChoice,
  getCurrentQuestionIndex,
  getStatus,
  setQuestionShownTimestamp,
  nextQuestion,
  previousQuestion,
  answer,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";

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
    dispatch(dispatch(setQuestionShownTimestamp(dateToState(DateTime.utc()))));
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
        choiceTimestamp: dateToState(DateTime.utc()),
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
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              dispatch(previousQuestion());
            }}
          >
            {" "}
            Previous{" "}
          </Button>
        </Grid>
        <Grid item xs={6} style={{ margin: 0 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                console.log("onClick");
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
