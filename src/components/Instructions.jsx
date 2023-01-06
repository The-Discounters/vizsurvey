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
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { navigateFromStatus } from "./Navigate";
import { styles, theme } from "./ScreenHelper";

const Instructions = () => {
  const dispatch = useDispatch();
  const status = useSelector(getStatus);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(instructionsShown(dateToState(DateTime.now())));
  }, []);

  useEffect(() => {
    const path = navigateFromStatus(status);
    navigate(path);
  }, [status]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Instructions Continued</Typography>
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
            <b>Survey questions: </b>
            After making your money choice selections, you will be presented
            with two short surveys of questions to learn more about you and then
            a screen to submit your final answers.{" "}
            <b>
              You must click on the button to submit your final answers to get
              paid.
            </b>
          </Typography>
          <Typography paragraph>
            After you submit your answers, you will be presented with a more
            detailed explanation of the goals behind this research along with a
            section to submit feedback. The researchers greatly appreciate any
            feedback you are willing to share.
          </Typography>
          <img
            width="100%"
            src="submit-and-exit.png"
            alt="Submit answers button."
          ></img>
          <Typography paragraph>
            <b>Click the Next button to start the survey!</b>
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
                if (process.env.REACT_APP_FULLSCREEN === "enabled")
                  document.body.requestFullscreen();
              }}
            >
              {" "}
              Start{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Instructions;
