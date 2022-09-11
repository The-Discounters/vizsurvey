import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Button,
  Grid,
  Box,
  Typography,
  ThemeProvider,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import "../App.css";
import { ViewType } from "../features/ViewType";
import {
  instructionsShown,
  instructionsCompleted,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { fetchCurrentTreatment } from "../features/questionSlice";
import InvalidSurveyLink from "./InvalidSurveyLink";
import { styles, theme } from "./ScreenHelper";

const Instructions = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);
  var handle = useFullScreenHandle();

  useEffect(() => {
    dispatch(instructionsShown(dateToState(DateTime.utc())));
  }, []);

  const navigate = useNavigate();

  const vizExplanation = (viewType) => {
    switch (viewType) {
      case ViewType.word:
        return (
          <React.Fragment>
            <Typography paragraph>
              You will be presented with a choice of receiving an amount of
              money earlier or a different amount of money later. All amounts
              are in US dollars and the time of receiving the money is in months
              from the present. Select one of the options by clicking on the
              circle for your choice and then clicking the next button. You must
              make a selection to proceed onto the next question.
            </Typography>
            <img src="worded-instructions.gif" alt="Word instructions"></img>
          </React.Fragment>
        );
      case ViewType.barchart:
        return (
          <React.Fragment>
            <Typography paragraph>
              You will be presented with a bar chart representing a choice of
              receiving an amount of money earlier or a different amount of
              money later. All amounts are in US dollars and the time of
              receiving the money is in months from the present. Select one of
              the options by clicking on the bar for your choice and the next
              option will be presented. You must make a selection to proceed
              onto the next question.
            </Typography>
            <img
              src="barchart-instructions.gif"
              alt="Barchart instructions"
            ></img>
          </React.Fragment>
        );
      case ViewType.calendarBar:
        return (
          <React.Fragment>
            <Typography paragraph>Calendar barchart instructions</Typography>
            <img src="test.png" alt="Calendar example."></img>
          </React.Fragment>
        );
      case ViewType.calendarWord:
        return (
          <React.Fragment>
            <Typography paragraph>Calendar word instructions.</Typography>
            <img src="test.png" alt="Calendar example."></img>
          </React.Fragment>
        );
      case ViewType.calendarIcon:
        return (
          <React.Fragment>
            <Typography paragraph>Calendar icon instructions.</Typography>
            <img src="test.png" alt="Calendar example."></img>
          </React.Fragment>
        );
      default:
        return <InvalidSurveyLink />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Instructions</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          {vizExplanation(treatment.viewType)}
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              navigate("/introduction");
            }}
          >
            {" "}
            Previous{" "}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-end">
            <FullScreen handle={handle}>
              <Button
                variant="contained"
                color="secondary"
                disableRipple
                disableFocusRipple
                style={styles.button}
                onClick={() => {
                  dispatch(instructionsCompleted(dateToState(DateTime.utc())));
                  if (process.env.REACT_APP_FULLSCREEN === "enabled")
                    handle.enter();
                  navigate("/survey");
                }}
              >
                {" "}
                Start{" "}
              </Button>
            </FullScreen>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Instructions;
