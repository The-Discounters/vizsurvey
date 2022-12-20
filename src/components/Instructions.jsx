import React, { useMemo, useEffect } from "react";
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
import { navigateFromStatus } from "./Navigate";
import { styles, theme } from "./ScreenHelper";

const Instructions = () => {
  const dispatch = useDispatch();
  const status = useSelector(getStatus);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(instructionsShown(DateTime.utc().toString()));
  }, []);

  useMemo(() => {
    navigateFromStatus(navigate, status);
  }, [status]);

  return (
    <ThemeProvider theme={theme}>
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
        </Grid>
        <Grid item xs={12}>
          <Typography paragraph>
            <b>Survey questions: </b>
            After making your money choice selections, you will be presented
            with two short surveys of questions to get a better undestanding of
            yourself, an explanation of the goals of this research project, and
            then a screen to submit your final answers.{" "}
            <b>
              You must click on the button at the end to have your answers be
              registered and get paid.
            </b>
          </Typography>
          <img
            width="100%"
            src="submit-and-exit.png"
            alt="Submit answers button."
          ></img>
          <Typography paragraph></Typography>
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
                dispatch(instructionsCompleted(DateTime.utc().toString()));
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
