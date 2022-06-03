import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFullScreenHandle } from "react-full-screen";
import { DateTime } from "luxon";
import { Grid, Typography } from "@material-ui/core";
import { thankYouShownTimestamp } from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";

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

const ThankYou = () => {
  useEffect(() => {
    dispatch(thankYouShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  const handle = useFullScreenHandle();
  handle.exit();

  const dispatch = useDispatch();

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default ThankYou;
