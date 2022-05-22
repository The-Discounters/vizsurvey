import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        return (
          <React.Fragment>
            <Typography paragraph>
              You have been provided an invalid survey link. Please click
              <a
                href={`mailto:pncordone@wpi.edu?subject=!!!Invlaid survey link!!!t&body=${encodeURIComponent(
                  "TODO put in invalid survey email text."
                )}`}
              >
                here
              </a>
              to send an email to the administrator reporting this error.
            </Typography>
          </React.Fragment>
        );
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
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              dispatch(instructionsCompleted(dateToState(DateTime.utc())));
              navigate("/survey");
            }}
          >
            {" "}
            Start{" "}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Instructions;
