import React, { useMemo, useEffect } from "react";
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
import TextField from "@mui/material/TextField";
import { theEndShownTimestamp } from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";
import {
  getStatus,
  nextQuestion,
  writeAnswers,
} from "../features/questionSlice";
import { navigateFromStatus } from "./Navigate";

const TheEnd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(getStatus);
  const [feedback, setFeedback] = React.useState("");

  useEffect(() => {
    dispatch(theEndShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  useMemo(() => {
    navigateFromStatus(navigate, status);
  }, [status]);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

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
            We hope you have enjoyed taking this survey and welcome any feedback
            or questions by filling out the text box below. If you encountered
            any technical problems please let us know.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Feedback"
            fullWidth
            value={feedback}
            onChange={(event) => {
              handleFieldChange(event, setFeedback);
            }}
            multiline
            rows={8}
            label="Feedback"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography paragraph>
            <b>
              Click the &quot;Submit Your Answers&quot; button to complete the
              survey and have your answers recorded! You must do this step to
              get paid {process.env.REACT_APP_PAYMENT_AMOUT} USD.
            </b>
          </Typography>
          <Typography paragraph>
            <b>
              You will be shown a code on the next screen after you submit your
              answers that you must enter into prolific to get paid.
            </b>{" "}
          </Typography>
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
                dispatch(writeAnswers());
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
