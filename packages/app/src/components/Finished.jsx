import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { Grid, Typography, ThemeProvider } from "@material-ui/core";
import { finishedShownTimestamp } from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { styles, theme } from "./ScreenHelper.js";
import Spinner from "../components/Spinner.js";
import { Context } from "../app/ReactContext.js";

const Finished = () => {
  const dispatch = useDispatch();
  const processingRequests = React.useContext(Context);

  useEffect(() => {
    dispatch(finishedShownTimestamp(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (processingRequests) {
    return <Spinner text="Your answers are being saved..." />;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            <Typography variant="h4">Finished</Typography>
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
              Thank you for your feedback. You have completed the survey and may
              close the browswer and please remember to enter the code{" "}
              {process.env.REACT_APP_PROLIFIC_CODE} into Prolific so that you
              will be paid {process.env.REACT_APP_PAYMENT_AMOUT}.
            </Typography>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }
};

export default Finished;
