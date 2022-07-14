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
            Thank you and we hope you have enjoyed this experience.
          </Typography>
          <Typography paragraph>
            We welcome any feedback through email by clicking
            <a
              href={`mailto:pncordone@wpi.edu?subject=Survey Feedback&body=${encodeURIComponent(
                "Enter your feedback here."
              )}`}
            >
              &nbsp;here&nbsp;
            </a>
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
