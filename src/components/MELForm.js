import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import {
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

const styles = {
  root: { flexGrow: 1, margin: 0 },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

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

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

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
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (choice === ChoiceType.earlier) {
                setHelperText("Earlier");
                setError(false);
              } else if (choice === ChoiceType.later) {
                setHelperText("Later");
                setError(false);
              } else {
                setHelperText("Please select an option.");
                setError(true);
              }
            }}
          >
            <FormControl
              className={classes.formControl}
              required={true}
              InputLabelProps={{ required: false }}
              error={error}
            >
              <FormLabel className={classes.root} id="question-text">
                <Typography paragraph>{questionText()}</Typography>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby={q.textShort + "-row-radio-buttons-group-label"}
                name={"question-radio-buttons-group"}
                onChange={(event) => {
                  setChoice(event.target.value);
                  setHelperText(" ");
                  setError(false);
                }}
                value={choice}
              >
                <FormControlLabel
                  key={ChoiceType.earlier}
                  value={ChoiceType.earlier}
                  checked={choice === ChoiceType.earlier}
                  control={<Radio />}
                  label={question1stPartText()}
                  error={() => {
                    console.log("error");
                    return choice === "";
                  }}
                  helperText={() => {
                    console.log("helperText");
                    return choice === ""
                      ? "You must choose an earlier or later amount below!"
                      : " ";
                  }}
                />
                <FormControlLabel
                  key={ChoiceType.later}
                  value={ChoiceType.later}
                  checked={choice === ChoiceType.later}
                  control={<Radio />}
                  label={question2ndPartText()}
                  error={() => {
                    console.log("error");
                    return choice === "";
                  }}
                  helperText={() => {
                    console.log("helperText");
                    return choice === ""
                      ? "You must choose an earlier or later amount below!"
                      : " ";
                  }}
                />
              </RadioGroup>
              <FormHelperText>{helperText}</FormHelperText>
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
