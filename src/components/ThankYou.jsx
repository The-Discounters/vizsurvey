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
          <Typography variant="h4">Thank You!</Typography>
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
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ThankYou;
