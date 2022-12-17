import React, { useMemo, useEffect } from "react";
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
import TextField from "@mui/material/TextField";
import {
  getStatus,
  debriefShownTimestamp,
  debriefCompleted,
  getParticipant,
  writeFeedback,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";
import { navigateFromStatus } from "./Navigate";

const Debrief = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const participantId = useSelector(getParticipant);
  const status = useSelector(getStatus);
  const [feedback, setFeedback] = React.useState("");

  useEffect(() => {
    dispatch(debriefShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  useMemo(() => {
    navigateFromStatus(navigate, status);
  }, [status]);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

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
        </Grid>
        <Grid item xs={12}>
          <Typography paragraph>
            <b>
              Your answers have been submitted. You must enter the code{" "}
              {process.env.REACT_APP_PROLIFIC_CODE} into Prolific to be paid{" "}
              {process.env.REACT_APP_PAYMENT_AMOUT} USD.
            </b>
          </Typography>
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
          <Typography paragraph>
            For more information about this research or about the rights of
            research participants, or if you would like to get in touch with us
            for any other reason the contact information from the consent form
            is repeated below:
          </Typography>
          {[
            {
              name: "Peter Cordone",
              phone: "(617)678-5190",
              email: "pncordone@wpi.edu",
            },
            {
              name: "IRB Manager Ruth McKeogh",
              phone: "(508)831-6699",
              email: "irb@wpi.edu",
            },
            {
              name: "Human Protection Administrator Gabriel Johnson",
              phone: "(508)831-4989",
              email: "gjohnson@wpi.edu",
            },
          ].map(({ name, phone, email }, index) => {
            return (
              <Typography key={index} paragraph>
                <span key={index}>
                  {name}
                  <br />
                  Tel: {phone}
                  <br />
                  Email: &lt;<a href={`mailto:${email}`}>{email}</a>&gt;
                  <br />
                </span>
              </Typography>
            );
          })}
          <Typography paragraph>
            <b>
              Please remember to enter the code C1KQNGZK into Prolific before
              you click exit or you will not be paid $3 USD.
            </b>
          </Typography>
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
                dispatch(
                  writeFeedback({
                    participantId: participantId,
                    feedback: feedback,
                  })
                );
                dispatch(debriefCompleted(dateToState(DateTime.utc())));
              }}
            >
              {" "}
              Exit{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Debrief;
