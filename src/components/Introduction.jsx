/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Box,
  Typography,
  ThemeProvider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import "../App.css";
import { ViewType } from "../features/ViewType";
import { dateToState } from "../features/ConversionUtil";
import {
  introductionShown,
  introductionCompleted,
  fetchCurrentTreatment,
  getStatus,
  startSurvey,
  previousQuestion,
} from "../features/questionSlice";
import { styles, theme, formControl } from "./ScreenHelper";
import { StatusType } from "../features/StatusType";

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

const Introduction = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);
  const navigate = useNavigate();

  const [choice, setChoice] = useState("");
  const [disableSubmit, setDisableSubmit] = React.useState(
    treatment.viewType === ViewType.word ? true : false
  );
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");
  const [showNextPrevious, setShowNextPrevious] = useState(false);
  const status = useSelector(getStatus);

  useEffect(() => {
    dispatch(introductionShown(dateToState(DateTime.utc())));
    setChoice("");
    if (event.target.value === "300") {
      classes.btn0 = classes.btn0Clicked;
      classes.btn1 = classes.btn1UnClicked;
    } else if (event.target.value === "700") {
      setChoice("");
      classes.btn0 = classes.btn0UnClicked;
      classes.btn1 = classes.btn1Clicked;
    }
    if (!treatment) navigate("/invalidlink");
  }, []);

  useEffect(() => {
    const nextButtonContentHeight =
      document.querySelector("#buttonNext").scrollHeight;
    const nextButtonHintArrow = document.querySelector("#nextButtonHintArrow");
    if (nextButtonHintArrow)
      nextButtonHintArrow.height = nextButtonContentHeight;
  }, [showNextPrevious]);

  useEffect(() => {
    if (treatment.viewType === ViewType.word) {
      if (choice && choice.length > 1) {
        setDisableSubmit(false);
      } else {
        setDisableSubmit(true);
      }
    } else {
      setDisableSubmit(false);
    }
  }, [choice]);

  useEffect(() => {
    classes.btn0 = classes.btn0UnClicked;
    classes.btn1 = classes.btn0UnClicked;
    setChoice("");
    switch (status) {
      case StatusType.Instructions:
        navigate("/instruction");
        break;
      case StatusType.Demographic:
        navigate("/demographic");
        break;
    }
  }, [status]);

  const classes = useStyles();

  const radioButtonGif = new Array(
    "introduction-radio-button-earlier.gif",
    "introduction-radio-button-later.gif"
  );

  const radioBtnExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>Radio Buttons: </b>
          Radio buttons represent information where a left button represents one
          option, and the right button represents a second option. You will be
          presented with a series of questoins where you will make a choice of
          receiving an amount of money earlier or a different amount of money
          later. All amounts are in US dollars and the time of receiving the
          money is in months from the present. Select one of the options by
          clicking on the circle for your choice.
        </Typography>
        <img
          width="100%"
          src={
            radioButtonGif[Math.floor(Math.random() * radioButtonGif.length)]
          }
          alt="Radio button example"
        ></img>
        <Typography paragraph></Typography>
        <Typography paragraph>
          <b>Try it out below:</b> In the example below, the left button
          represents one choice of receiving money and the right button
          represents another choice of receiving money. In this case the choice
          is to receive $300 in two months or $700 in seven months.
        </Typography>
        <form className={classes.qArea}>
          <FormControl sx={{ ...formControl }} required={false} error={error}>
            <p className={classes.qTitle}>
              Make a choice to receive $300 in 2 months or $700 in 7 months
            </p>
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
                aria-labelledby="introduction-question-row-radio-buttons-group-label"
                name={"question-radio-buttons-group"}
                onChange={(event) => {
                  setChoice(event.target.value);
                  if (event.target.value === "300") {
                    classes.btn0 = classes.btn0Clicked;
                    classes.btn1 = classes.btn1UnClicked;
                  } else if (event.target.value === "700") {
                    classes.btn0 = classes.btn0UnClicked;
                    classes.btn1 = classes.btn1Clicked;
                  }
                  setShowNextPrevious(true);
                  setHelperText("");
                  setError(false);
                }}
                value={choice}
              >
                {[
                  {
                    key: "300",
                    id: "earlierAmount",
                    label: "$300 in 2 months",
                  },
                  {
                    key: "700",
                    id: "laterAmount",
                    label: "$700 in 7 months",
                  },
                ].map(({ key, id, label }, index) => (
                  <FormControlLabel
                    sx={{ mr: "100px" }}
                    key={key}
                    id={id}
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
        {showNextPrevious && (
          <>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
            <Typography paragraph></Typography>
            <Typography paragraph>
              <b>Next Question: </b>
              Once you have made your selection, the Next button will be enabled
              to allow you to advance to the next question. You must make a
              selection to proceed onto the next question.
            </Typography>
          </>
        )}
      </React.Fragment>
    );
  };

  const barchartExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Bar chart:{" "}
          </b>
          A bar chart is a pictoral representation of information where the
          height of the bar represents one value and the position of the bar
          horizontal a second. In the chart below, the height represents the
          amount of money is US dollars and the position on the horizontal axis
          the delay in months of when that money is received. In this case the
          choice is to receive $300 in two months or $700 in seven months.
        </Typography>
        <img
          src="barchart-introduction-760x280.png"
          alt="Barchart example"
        ></img>
      </React.Fragment>
    );
  };

  const calendarExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Calendar:{" "}
          </b>
          A calendar is a pictoral representation of dates. In this experiment,
          the date that money will be received is shown on a calendar.
        </Typography>
        <img src="test.png" alt="Calendar example."></img>
        <Typography paragraph>.</Typography>
      </React.Fragment>
    );
  };

  const iconExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Icon array:{" "}
          </b>
          An icon array is a visual display that shows a proportion using
          colored icons. For example, to represent a proportion of 67%, one can
          start with 100 gray icons (here we use squares), and color 67 of them
          orange.
        </Typography>
        <img
          src="intro-icon-array-67-10PerRow.png"
          alt="Icon array example"
        ></img>
      </React.Fragment>
    );
  };

  const vizExplanation = (viewType) => {
    const result = [];
    switch (viewType) {
      case ViewType.word:
        return radioBtnExp();
      case ViewType.barchart:
        return barchartExp();
      case ViewType.calendarBar:
        result.push(barchartExp());
        result.push(calendarExp());
        return <React.Fragment>{result}</React.Fragment>;
      case ViewType.calendarWord:
        return calendarExp();
      case ViewType.calendarIcon:
        result.push(iconExp());
        result.push(calendarExp());
        return <React.Fragment>{result}</React.Fragment>;
      default:
        return <React.Fragment>{navigate("/invalidlink")}</React.Fragment>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4">Introduction</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {treatment ? vizExplanation(treatment.viewType) : <p />}
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
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            {showNextPrevious && (
              <img
                id="nextButtonHintArrow"
                width="auto"
                src="arrow.png"
                alt="Click next button after making selection."
              ></img>
            )}

            <Button
              variant="contained"
              color="secondary"
              id="buttonNext"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                if (
                  treatment.viewType === ViewType.word &&
                  choice !== "300" &&
                  choice !== "700"
                ) {
                  setError(true);
                  setHelperText("You must choose one of the options below.");
                } else {
                  classes.btn0 = classes.btn0UnClicked;
                  classes.btn1 = classes.btn1UnClicked;
                  dispatch(introductionCompleted(dateToState(DateTime.utc())));
                  dispatch(startSurvey());
                }
              }}
              disabled={disableSubmit && treatment.viewType === ViewType.word}
            >
              {" "}
              Next{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Introduction;
