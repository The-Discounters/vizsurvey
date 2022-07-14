import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { Grid, Typography, ThemeProvider } from "@material-ui/core";
import { theEndShownTimestamp } from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";

const TheEnd = () => {
  useEffect(() => {
    dispatch(theEndShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Thank You and The End</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          <Typography paragraph>
            You have completed the survey and your answers have been submitted.
            We hope you have enjoyed taking this survey and welcome any feedback
            and/or questions through email by clicking&nbsp;
            <a
              href={`mailto:pncordone@wpi.edu?subject=Survey Feedback&body=${encodeURIComponent(
                "Enter your feedback here."
              )}`}
            >
              here
            </a>
            .
          </Typography>
          <Typography paragraph>
            You can now close this browser window.
          </Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default TheEnd;
