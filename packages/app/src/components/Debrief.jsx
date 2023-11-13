import React, { useEffect } from "react";
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
import { ViewType } from "@the-discounters/types";
import {
  getStatus,
  getInstructionTreatment,
  setFeedback,
  debriefShownTimestamp,
  debriefCompleted,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { styles, theme } from "./ScreenHelper.js";
import { StatusType } from "../features/StatusType.js";

const Debrief = () => {
  const dispatch = useDispatch();
  const status = useSelector(getStatus);
  const instructionTreatment = useSelector(getInstructionTreatment);
  const [comment, setComment] = React.useState("");

  useEffect(() => {
    dispatch(debriefShownTimestamp(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === StatusType.Finished) {
      setTimeout(() => {
        window.open("about:blank", "_self");
        window.close();
      }, 400);
    }
  }, [status]);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  const debriefText = () => {
    switch (instructionTreatment.viewType) {
      case ViewType.word:
      case ViewType.barchart:
        return `This experiment seeks to examine how visualization can be designed to
          influence people in making long term decisions differently.  For this
          purpose, participants in this experiment are randomly assigned to be presented 
          with word choices or different versions of graphical displays, such as a bar graph. 
          In particular, we examine how space can be used in the time (horizontal) axis to increase 
          the likelihood of choosing the longer-term option.`;
      case ViewType.calendarIcon:
      case ViewType.calendarBar:
      case ViewType.calendarWord:
      case ViewType.calendarWordYear:
      case ViewType.calendarWordYearDual:
        return `This experiment seeks to examine how visualization can be designed to
          influence people in making long term decisions differently.  For this
          purpose, participants in this experiment are randomly assigned to be presented 
          with word choices or different versions of graphical displays, such as a calendar. 
          In particular, we examine how this familiar single-year calendar layout can be used to 
          increase the likelihood .`;
      default:
        return "*** SHOULD NOT SEE THIS TEXT ***";
    }
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
            <b>Your answers have been recorded.</b>
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
            represented. Visualization offers a powerful tool that influences
            all three of these factors.
          </Typography>
          <Typography paragraph>{debriefText()}</Typography>
          <Typography paragraph>
            For more information about this research or about the rights of
            research participants, or if you would like to get in touch with us
            for any other reason the contact information is below:
          </Typography>
          {[
            {
              name: `${process.env.REACT_APP_CONTACT_NAME}`,
              phone: `${process.env.REACT_APP_CONTACT_PHONE}`,
              email: `${process.env.REACT_APP_CONTACT_EMAIL}`,
            },
            {
              name: `${process.env.REACT_APP_IRB_NAME}`,
              phone: `${process.env.REACT_APP_IRB_PHONE}`,
              email: `${process.env.REACT_APP_IRB_EMAIL}`,
            },
            {
              name: `${process.env.REACT_APP_HPA_NAME}`,
              phone: `${process.env.REACT_APP_HPA_PHONE}`,
              email: `${process.env.REACT_APP_HPA_EMAIL}`,
            },
          ].map(({ name, phone, email }, index) => {
            return (
              <Typography key={index} paragraph>
                <span key={index}>
                  {name}
                  <br />
                  Tel: {phone}
                  <br />
                  Email:{" "}
                  <a href={`mailto:${email}?subject=%5bSurvey Feedback%5d`}>
                    {email}
                  </a>
                  <br />
                </span>
              </Typography>
            );
          })}
          <Typography paragraph variant="h6">
            <b>
              Please remember to enter the code{" "}
              {process.env.REACT_APP_PROLIFIC_CODE} into Prolific so that you
              will be paid {process.env.REACT_APP_PAYMENT_AMOUT}.
            </b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography paragraph>
            We hope you have enjoyed taking this survey and welcome any feedback
            or questions by filling out the text box below and clicking submit &
            exit.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="Feedback"
            fullWidth
            value={comment}
            onChange={(event) => {
              handleFieldChange(event, setComment);
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
                dispatch(setFeedback(comment));
                dispatch(debriefCompleted(dateToState(DateTime.now())));
              }}
            >
              {" "}
              Submit Feedback & Exit{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Debrief;
