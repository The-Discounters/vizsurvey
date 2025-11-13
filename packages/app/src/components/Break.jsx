import React, { useEffect } from "react";
import { useNavigate } from "../hooks/useNavigation.js";
import {
  Button,
  Typography,
  ThemeProvider,
  StyledEngineProvider,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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
        <Container maxWidth="lg" disableGutters={false}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            sx={{ minHeight: "100vh" }}
            alignItems="stretch"
          >
            <Grid xs={12}>
              <Typography paragraph>
                You have completed {completedTreatments}{" "}
                {completedTreatments === 1 ? "block" : "blocks"} of trials.
                There {remainingTreatments === 1 ? "is" : "are"}{" "}
                {remainingTreatments}{" "}
                {remainingTreatments === 1 ? "block" : "blocks"} remaining.
                Please press continue when you are ready for the next block.
              </Typography>
              <hr
                style={{
                  backgroundColor: "#aaaaaa",
                  height: 4,
                }}
              />
            </Grid>
            <Grid align="center" xs={12}>
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
        </Container>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Break;
