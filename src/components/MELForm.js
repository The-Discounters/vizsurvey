/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import {
  createTheme,
  Grid,
  Button,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";
import { format } from "d3";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formLabel: {
    fontSize: 32,
    color: "black",
  },
  formControlLabel: {
    fontSize: 24,
    color: "black",
  },
}));

export function MELForm() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);
  const navigate = useNavigate();
  const [choice, setChoice] = useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  useEffect(() => {
    dispatch(dispatch(setQuestionShownTimestamp(dateToState(DateTime.utc()))));
  }, []);

  const classes = useStyles();

  const todayText = (sooner_time) =>
    sooner_time === 0 ? "today" : `in ${sooner_time} months`;

  function questionText() {
    return `Make a choice to receive ${question1stPartText()} or ${question2ndPartText()}.`;
  }

  function question1stPartText() {
    return `${format("$,.0f")(q.amountEarlier)} ${todayText(q.timeEarlier)}`;
  }

  function question2ndPartText() {
    return `${format("$,.0f")(q.amountLater)} in ${q.timeLater} months`;
  }

  const result = (
    <div>
      <Grid container style={styles.root} justifyContent="center">
        <Grid item xs={12}>
          <form onSubmit={(event) => {}}>
            <FormControl
              className={classes.formControl}
              required={false}
              error={error}
            >
              <FormLabel className={classes.formLabel} id="question-text">
                {questionText()}
              </FormLabel>
              <FormHelperText>{helperText}</FormHelperText>
              <RadioGroup
                row
                aria-labelledby={q.textShort + "-row-radio-buttons-group-label"}
                name={"question-radio-buttons-group"}
                onChange={(event) => {
                  setChoice(event.target.value);
                  setHelperText("");
                  setError(false);
                }}
                value={choice}
              >
                <FormControlLabel
                  className={classes.formControlLabel}
                  key={ChoiceType.earlier}
                  value={ChoiceType.earlier}
                  checked={choice === ChoiceType.earlier}
                  control={<Radio />}
                  label={question1stPartText()}
                />
                <FormControlLabel
                  className={classes.formControlLabel}
                  key={ChoiceType.later}
                  value={ChoiceType.later}
                  checked={choice === ChoiceType.later}
                  control={<Radio />}
                  label={question2ndPartText()}
                />
              </RadioGroup>
            </FormControl>
          </form>
        </Grid>
        <Grid item xs={12} style={{ margin: 0 }}>
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              if (
                choice !== ChoiceType.earlier &&
                choice !== ChoiceType.later
              ) {
                setError(true);
                setHelperText("You must choose one of the options below.");
              } else {
                setError(false);
                setHelperText("");
                setTimeout(() => {
                  dispatch(
                    answer({
                      choice: choice,
                      choiceTimestamp: dateToState(DateTime.utc()),
                    })
                  );
                  setChoice(null);
                  if (status === StatusType.Questionaire) {
                    navigate("/questionaire");
                  }
                }, 400);
              }
            }}
          >
            {" "}
            Next{" "}
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  return result;
}

export default MELForm;
