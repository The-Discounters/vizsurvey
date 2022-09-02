import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import {
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Box,
  ThemeProvider,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { AmountType } from "../features/AmountType";
import {
  selectCurrentQuestion,
  isLastTreatment,
  isMiddleTreatment,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";
import { format } from "d3";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme, formControl } from "./ScreenHelper";

let useStyles;
function resetUseStyles() {
  let part = ["btn0", "btn0UnClicked", "btn1", "btn1UnClicked"].reduce(
    (result, key) => {
      result[key] = {
        "border-style": "solid",
        backgroundColor: "steelblue",
        "border-radius": "20px",
        "border-width": "5px",
        borderColor: "#ffffff",
        color: "black",
        paddingRight: "10px",
        "&:hover": {
          backgroundColor: "lightblue",
        },
      };
      return result;
    },
    {}
  );
  let part1 = ["btn0Clicked", "btn1Clicked"].reduce((result, key) => {
    result[key] = {
      "border-style": "solid",
      backgroundColor: "steelblue",
      "border-radius": "20px",
      "border-width": "5px",
      borderColor: "#000000",
      color: "black",
      paddingRight: "10px",
      "&:hover": {
        backgroundColor: "lightblue",
      },
    };
    return result;
  }, {});
  useStyles = makeStyles(() => ({
    btn0: part.btn0,
    btn0UnClicked: part.btn0UnClicked,
    btn1: part.btn1,
    btn1UnClicked: part.btn1UnClicked,
    btn0Clicked: part1.btn0Clicked,
    btn1Clicked: part1.btn1Clicked,
    qArea: {
      "border-style": "solid",
      "border-width": "5px",
      "border-radius": "20px",
      padding: "10px",
      borderColor: "#000000",
    },
    qTitle: {
      fontSize: "32px",
    },
  }));
}
resetUseStyles();

// const boxDefault = {
//   height: 100,
//   //display: "flex",
//   border: "1px solid black",
//   padding: 2,
// };

export function MELForm() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const isLastTreatmentQ = useSelector(isLastTreatment);
  const isMiddleTreatmentQ = useSelector(isMiddleTreatment);
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
          <form className={classes.qArea}>
            <FormControl sx={{ ...formControl }} required={false} error={error}>
              <p className={classes.qTitle}>{questionText()}</p>
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
                    if (event.target.value === AmountType.earlierAmount) {
                      classes.btn0 = classes.btn0Clicked;
                      classes.btn1 = classes.btn1UnClicked;
                    } else if (event.target.value === AmountType.laterAmount) {
                      classes.btn0 = classes.btn0UnClicked;
                      classes.btn1 = classes.btn1Clicked;
                    }
                    setHelperText("");
                    setError(false);
                  }}
                  value={choice}
                >
                  {[
                    {
                      key: AmountType.earlierAmount,
                      label: question1stPartText(),
                    },
                    {
                      key: AmountType.laterAmount,
                      label: question2ndPartText(),
                    },
                  ].map(({ key, label }, index) => (
                    <FormControlLabel
                      sx={{ mr: "100px" }}
                      key={key}
                      id={key}
                      value={key}
                      checked={choice === key}
                      control={<Radio />}
                      label={label}
                      className={classes["btn" + index]}
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
                choice !== AmountType.earlierAmount &&
                choice !== AmountType.laterAmount
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
                  if (isLastTreatmentQ) {
                    navigate("/postsurvey1");
                  } else if (isMiddleTreatmentQ) {
                    navigate("/attentioncheck");
                  }
                }, 400);
                resetUseStyles();
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
