import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  instructionsShown,
  instructionsCompleted,
  getStatus,
} from "../features/questionSlice.js";
import { dateToState } from "../features/ConversionUtil.js";
import { navigateFromStatus } from "./Navigate.js";
import { styles, theme } from "./ScreenHelper.js";

const Instructions = () => {
  const dispatch = useDispatch();
  const status = useSelector(getStatus);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(instructionsShown(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = navigateFromStatus(status);
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">General Instructions</Typography>
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
            In the first set of questions, you will be asked to make money
            choices as instructed in the next screen. You will need to answer
            all these questions in order to remain in the study.
          </Typography>
          <Typography paragraph>
            Then, you will be presented with four short sets of questions about
            your experience answering the survey, as well as about you in
            general.
          </Typography>
          <Typography paragraph>
            Finally, you will be presented with a more detailed explanation of
            the goals behind this research along with an opportunity to submit
            feedback and a <b>code you must enter into Prolific to get paid.</b>
          </Typography>
          <Typography paragraph>
            The entire survey will take about{" "}
            {process.env.REACT_APP_TIME_IN_MIN_TO_COMPLETE} minutes to complete.
          </Typography>
          <Typography paragraph>
            <b>Click the Next button to start.</b>
          </Typography>{" "}
          <hr
            style={{
              backgroundColor: "#aaaaaa",
              height: 4,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                dispatch(instructionsCompleted(dateToState(DateTime.now())));
              }}
            >
              {" "}
              Next{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Instructions;
