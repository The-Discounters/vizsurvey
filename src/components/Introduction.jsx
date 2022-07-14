import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  ThemeProvider,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Box,
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
  startSurvey,
} from "../features/questionSlice";
import { styles, theme, formControlLabel } from "./ScreenHelper";

const Introduction = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);
  const navigate = useNavigate();

  const [choice, setChoice] = useState("");
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  useEffect(() => {
    dispatch(introductionShown(dateToState(DateTime.utc())));
    if (!treatment) navigate("/invalidlink");
  }, []);

  useEffect(() => {
    if (choice && choice.length > 1) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [choice]);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    formLabel: {
      fontSize: 24,
      color: "black",
    },
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

  const classes = useStyles();

  const radioBtnExp = () => {
    return (
      <React.Fragment>
        <Typography>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Radio Buttons:{" "}
          </b>
          Radio buttons allow a user to pick one of two options as shown in the
          video clip below.
        </Typography>
        <img src="radio-buttons.gif" alt="Radio button example"></img>
        <Typography>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span>&nbsp;Try it out below:
          </b>
        </Typography>

        <form onSubmit={() => {}}>
          <FormControl
            className={classes.formControl}
            required={false}
            error={error}
          >
            <FormLabel className={classes.formLabel} id="question-text">
              Select one of the options below by clicking on the circle and then
              click the Next button to proceed.
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
                aria-labelledby="row-radio-buttons-group-label"
                name="question-radio-buttons-group"
                onChange={(event) => {
                  setChoice(event.target.value);
                  setHelperText("");
                  setError(false);
                }}
                value={choice}
              >
                {[
                  {
                    key: "firstOption",
                    label: "First option.",
                  },
                  {
                    key: "secondOption",
                    label: "Second option.",
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
          choice is to receive $300 in two months or $700 in five months.
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
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Introduction</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          {treatment ? vizExplanation(treatment.viewType) : <p />}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              if (
                treatment.viewType === ViewType.word &&
                choice !== "firstOption" &&
                choice !== "secondOption"
              ) {
                setError(true);
                setHelperText("You must choose one of the options below.");
              } else {
                dispatch(introductionCompleted(dateToState(DateTime.utc())));
                dispatch(startSurvey());
                navigate("/instruction");
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
};

export default Introduction;
