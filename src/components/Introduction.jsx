import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography, ThemeProvider } from "@material-ui/core";
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
import { styles, theme } from "./ScreenHelper";

const Introduction = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(introductionShown(dateToState(DateTime.utc())));
    if (!treatment) navigate("/invalidlink");
  }, []);

  const radioBtnExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Radio Buttons:{" "}
          </b>
          Radio buttons allow a user to pick one of two options as shown below.
        </Typography>
        <img src="test.png" alt="Barchart example"></img>
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
          horizontal a second. In this experiment, the height represents the
          amount of money and the position the delay in months of when that
          money is received.
        </Typography>
        <img src="test.png" alt="Barchart example"></img>
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
              dispatch(introductionCompleted(dateToState(DateTime.utc())));
              dispatch(startSurvey());
              navigate("/instruction");
            }}
          >
            {" "}
            Start{" "}
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Introduction;
