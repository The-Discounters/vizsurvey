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
  Box,
  ThemeProvider,
} from "@mui/material";
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
import {
  styles,
  theme,
  formControl,
  formLabel,
  formControlLabel,
} from "./ScreenHelper";

const useStyles = makeStyles(() => ({
  btn: {
    borderColor: "#ffffff",
    "border-style": "solid",
    "border-width": "5px",
    "border-radius": "20px",
    paddingRight: "10px",
    "&:hover": {
      borderColor: "#000000",
    },
  },
}));

// const boxDefault = {
//   height: 100,
//   //display: "flex",
//   border: "1px solid black",
//   padding: 2,
// };

export function MELForm() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);
  const navigate = useNavigate();
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [choice, setChoice] = useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  useEffect(() => {
    dispatch(dispatch(setQuestionShownTimestamp(dateToState(DateTime.utc()))));
  }, []);

  useEffect(() => {
    if (choice && choice.length > 1) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [choice]);

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

  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
        <Grid item xs={12}>
          <form>
            <FormControl sx={{ ...formControl }} required={false} error={error}>
              <FormLabel sx={{ ...formLabel }} id="question-text">
                {questionText()}
              </FormLabel>
              <FormHelperText>{helperText}</FormHelperText>
              <Box
                component="span"
                m={1}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                border="1"
              >
                <RadioGroup
                  row
                  aria-labelledby={
                    q.textShort + "-row-radio-buttons-group-label"
                  }
                  name={"question-radio-buttons-group"}
                  onChange={(event) => {
                    setChoice(event.target.value);
                    setHelperText("");
                    setError(false);
                  }}
                  value={choice}
                >
                  {[
                    {
                      key: ChoiceType.earlier,
                      label: question1stPartText(),
                    },
                    {
                      key: ChoiceType.later,
                      label: question2ndPartText(),
                    },
                  ].map(({ key, label }) => (
                    <FormControlLabel
                      sx={{ ...formControlLabel, mr: "100px" }}
                      key={key}
                      value={key}
                      checked={choice === key}
                      control={<Radio />}
                      label={label}
                      className={classes.btn}
                    />
                  ))}
                </RadioGroup>
              </Box>
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
                setHelperText("Please choose one of the options below.");
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
            disabled={disableSubmit}
          >
            {" "}
            Next{" "}
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default MELForm;
