import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { Grid, Typography, ThemeProvider } from "@material-ui/core";
import { thankYouShownTimestamp } from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";

const ThankYou = () => {
  useEffect(() => {
    dispatch(thankYouShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Thank You and Debrief!</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          <Typography paragraph>
            You have completed the survey and your answers have been submitted.
            Thank you for taking this survey!
          </Typography>
          <Typography paragraph>
            When it comes to decisions between payoffs sooner or later in time,
            people tend to discount the later reward and choose the sooner
            option even at the cost of larger later rewards. This is called
            discounting the later reward. Discounting can manifest itself in
            decisions regarding finance, health, and the environment. Life
            expectancy and quality of life can be negatively impacted,
            especially in later years as the negative consequence of choosing
            the shorter term option accumulate over time. Decisions like these
            are malleable and discounting can be counteracted by how attention
            is focused, how a reference point is framed, and how time is
            represented. Visualization offers a powerful tool that influence all
            three of these factors. This experiment seeks to see how
            visualization can be designed to influence people in making better
            long term decisions. In particluar, how space is used in the time
            (horizontal) axis to influence people to choose the longer term
            option.
          </Typography>
          <Typography paragraph>
            We hope you have enjoyed taking this survey and welcome any feedback
            through email by clicking
            <a
              href={`mailto:pncordone@wpi.edu?subject=Experiment Feedback&body=${encodeURIComponent(
                "Enter your feedback here."
              )}`}
            >
              here
            </a>
          </Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ThankYou;
