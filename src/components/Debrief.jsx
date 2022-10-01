import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import {
  Grid,
  Box,
  Button,
  Typography,
  ThemeProvider,
} from "@material-ui/core";
import { StatusType } from "../features/StatusType";
import {
  getStatus,
  debriefShownTimestamp,
  debriefCompleted,
  nextQuestion,
  previousQuestion,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";

const Debrief = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const status = useSelector(getStatus);

  useEffect(() => {
    dispatch(debriefShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  useEffect(() => {
    switch (status) {
      case StatusType.PurposeQuestionaire:
        navigate("/purposequestionaire");
        break;
      case StatusType.Done:
        navigate("/theend");
        break;
    }
  }, [status]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Study Explanation</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          <Typography paragraph>
            When it comes to decisions between payoffs sooner or later in time,
            people tend to place less value on the later reward and choose the
            sooner option even at the cost of larger later rewards. This is
            called discounting the later reward. Discounting can manifest itself
            in decisions regarding finance, health, and the environment. Life
            expectancy and quality of life can be negatively impacted,
            especially in later years as the negative consequence of choosing
            the shorter term option accumulate over time. Decisions like these
            are malleable and discounting can be counteracted by how attention
            is focused, how a reference point is framed, and how time is
            represented. Visualization offers a powerful tool that influence all
            three of these factors.
          </Typography>

          <Typography paragraph>
            This experiment seeks to examine how visualization can be designed
            to influence people in making long term decisions differently. For
            this purpose, participants in this experiment are randomly assigned
            to be presented with word choices or different versions of graphical
            displays, such as a bar graph. In particluar, we examine how space
            can be used in the time (horizontal) axis to increase the likelihood
            of choosing the longer-term option.
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              dispatch(previousQuestion());
            }}
          >
            {" "}
            Previous{" "}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ margin: 0 }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              dispatch(debriefCompleted(dateToState(DateTime.utc())));
              dispatch(nextQuestion());
            }}
          >
            {" "}
            Next{" "}
          </Button>
        </Box>
      </Grid>
    </ThemeProvider>
  );
};

export default Debrief;
