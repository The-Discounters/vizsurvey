import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import {
  Typography,
  ThemeProvider,
  StyledEngineProvider,
  Container,
} from "@mui/material";
import {
  finishedShownTimestamp,
  getExperiment,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { theme } from "./ScreenHelper.js";
import Spinner from "../components/Spinner.js";
import { Context } from "../app/ReactContext.js";

const Finished = () => {
  const dispatch = useDispatch();
  const experiment = useSelector(getExperiment);
  const processingRequests = React.useContext(Context);

  useEffect(() => {
    dispatch(finishedShownTimestamp(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (processingRequests) {
    return <Spinner text="Your answers are being saved..." />;
  } else {
    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Container maxWidth="lg" disableGutters={false}>
            <Typography variant="h4">Finished</Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
            <Typography paragraph>
              Thank you for your feedback. You have completed the survey and may
              close the browser. Before you do, please remember to enter the
              code {experiment.prolificCode} into Prolific so that you will be
              paid {experiment.paymentAmount}.
            </Typography>
          </Container>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }
};

export default Finished;
