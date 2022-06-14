import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Button, Grid, Typography } from "@material-ui/core";
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

const styles = {
  root: {
    flexGrow: 1, // flex:1, padding: 5,height: "100%", width: "100%"
    margin: 20,
  },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

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
            <Typography paragraph>Word instructions.</Typography>
            <img src="test.png" alt="Word instructions"></img>
          </React.Fragment>
        );
      case ViewType.barchart:
        return (
          <React.Fragment>
            <Typography paragraph>Barchart instructions.</Typography>
            <img src="test.png" alt="Barchart instructions"></img>
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
    <React.Fragment>
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
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Instructions;
