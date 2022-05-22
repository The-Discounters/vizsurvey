import React, { useEffect } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import "../App.css";
import { ViewType } from "../features/ViewType";
import { dateToState } from "../features/ConversionUtil";
import {
  introductionShown,
  introductionCompleted,
  fetchCurrentTreatment,
} from "../features/questionSlice";

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

const Introduction = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);

  useEffect(() => {
    dispatch(introductionShown(dateToState(DateTime.utc())));
  }, []);

  function buttonClicked() {
    dispatch(introductionCompleted(dateToState(DateTime.utc())));
  }

  const vizExplanation = (viewType) => {
    switch (viewType) {
      case ViewType.word:
        return (
          <React.Fragment>
            <Typography paragraph>
              You will be presented with the choice of two amounts at two
              differen times. Select the radio button that corresponds to your
              choice.
            </Typography>
            <img src="test.png" alt="Barchart example"></img>
          </React.Fragment>
        );
      case ViewType.barchart:
        return (
          <React.Fragment>
            <Typography paragraph>
              <b>
                {" "}
                <span style={{ fontSize: 20 }}>&#8226;</span> Bar chart:{" "}
              </b>
              A bar chart represents the choice of earlier or later amounts at
              two different times where the height of the bar will represent the
              amount of money and the position of the bar along the horizontal
              axis will represent the time of receiving the money. Below is an
              example bar chart where the amounts offered are $100 at one month
              from now or $500 six months from now.
            </Typography>
            <img src="test.png" alt="Barchart example"></img>
            <Typography paragraph>
              You could also be offered the amounts on specific dates in which
              case the horizontal axis would represent the date of receiving the
              money.
            </Typography>
          </React.Fragment>
        );
      case ViewType.calendarBar:
        return (
          <React.Fragment>
            <Typography paragraph>
              <b>
                {" "}
                <span style={{ fontSize: 20 }}>&#8226;</span> Calendar bar
                chart:{" "}
              </b>
              A calendar view represents the date of receving the earlier or
              later amounts with the square for the day. The vertical height of
              a bar in the earlier and later day will indicate the amount of
              money for each day with the amount as text also shows.
            </Typography>
            <img src="test.png" alt="Calendar example."></img>
            <Typography paragraph>.</Typography>
          </React.Fragment>
        );
      case ViewType.calendarWord:
        return (
          <React.Fragment>
            <Typography paragraph>
              <b>
                {" "}
                <span style={{ fontSize: 20 }}>&#8226;</span>Calendar word:{" "}
              </b>
              A calendar view represents the date of receving the earlier or
              later amounts with the square for the day. The text in the
              corresponding day square will indicate the earlier and later
              amounts.
            </Typography>
            <img src="test.png" alt="Calendar example."></img>
          </React.Fragment>
        );
      case ViewType.calendarIcon:
        return (
          <React.Fragment>
            <Typography paragraph>
              <b>
                {" "}
                <span style={{ fontSize: 20 }}>&#8226;</span> Icon array:{" "}
              </b>
              An icon array is a visual display that shows a proportion using
              colored icons. For example, to represent a proportion of 67%, one
              can start with 100 gray icons (here we use square ones), and color
              67 of them orange.
            </Typography>
            <img
              src="intro-icon-array-67-10PerRow.png"
              alt="Icon array example"
            ></img>
            <Typography paragraph>
              A calendar view represents the date of receving the earlier or
              later amounts with the square for the day. The icon array in the
              corresponding day square will indicate the earlier and later
              amounts.
            </Typography>
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
          <Typography variant="h4">Introduction</Typography>
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
            onClick={(e) => buttonClicked(e)}
          >
            {" "}
            Start{" "}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Introduction;
