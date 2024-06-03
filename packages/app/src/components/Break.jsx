import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import "../App.css";
import {
  breakShown,
  breakCompleted,
  getStatus,
  getRemainingTreatmentCount,
  getCompletedTreatmentCount,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { navigateFromStatus } from "./Navigate.js";
import { styles, theme } from "./ScreenHelper.js";

const Break = () => {
  const dispatch = useDispatch();
  const status = useSelector(getStatus);
  const remainingTreatments = useSelector(getRemainingTreatmentCount);
  const completedTreatments = useSelector(getCompletedTreatmentCount);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(breakShown(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = navigateFromStatus(status);
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            <Typography variant="h4">Question Break</Typography>
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
              You have completed {completedTreatments}{" "}
              {completedTreatments === 1 ? "block" : "blocks"} of trials. There
              are {remainingTreatments}{" "}
              {remainingTreatments === 1 ? "block" : "blocks"} remaining. Please
              feel free to take a break and press continue when you are ready
              for the next block.
            </Typography>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
          </Grid>
          <Grid item align="center" xs={12}>
            <Button
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                dispatch(breakCompleted(dateToState(DateTime.now())));
              }}
            >
              {" "}
              Continue{" "}
            </Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Break;
