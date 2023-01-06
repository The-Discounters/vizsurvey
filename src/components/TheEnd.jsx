import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  Grid,
  Box,
  Typography,
  ThemeProvider,
  Button,
} from "@material-ui/core";
import {
  theEndShownTimestamp,
  theEndCompleted,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";
import { getStatus, nextQuestion } from "../features/questionSlice";
import { navigateFromStatus } from "./Navigate";

const TheEnd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(getStatus);

  useEffect(() => {
    dispatch(theEndShownTimestamp(dateToState(DateTime.now())));
  }, []);

  useEffect(() => {
    const path = navigateFromStatus(status);
    navigate(path);
  }, [status]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4">Submit Your Answers</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography paragraph>
            <b>
              Click the &quot;Submit Your Answers&quot; button to complete the
              survey and have your answers recorded! You will be shown a code
              after submitting your answers that you must enter into prolific so
              that we can pay you {process.env.REACT_APP_PAYMENT_AMOUT} USD.
            </b>
          </Typography>
          <Typography paragraph>
            If you encounter an error and are not able to submit your answers,
            please click{" "}
            <a
              href={`mailto:pncordone@wpi.edu?subject=Technical%20Problems%20With%20Survey&body=Please%20describe%20the%20technical%20problems%20you%20are%20having%20below%20giving%20as%20much%20details%20as%20you%20can.`}
            >
              here
            </a>{" "}
            to email pncordone@wpi.edu and give as detailed a description as you
            can of the problem.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <hr
            style={{
              backgroundColor: "#aaaaaa",
              height: 4,
            }}
          />
        </Grid>
        <Grid item xs={12} style={{ margin: 0 }}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                dispatch(theEndCompleted(dateToState(DateTime.now())));
                dispatch(nextQuestion());
              }}
            >
              {" "}
              Submit Your Answers{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default TheEnd;
