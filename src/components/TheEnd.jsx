import React, { useEffect } from "react";
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
  getParticipant,
  getFinancialLitSurvey,
  nextQuestion,
  getCountryOfResidence,
  getVizFamiliarity,
  getAge,
  getGender,
  getSelfDescribeGender,
  getProfession,
  getAttentionCheck,
  getTimestamps,
  getFeedback,
  selectAllQuestions,
  writeAnswers,
} from "../features/questionSlice";
import { StatusType } from "../features/StatusType";
import { FileIOAdapter } from "../features/FileIOAdapter";

const TheEnd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const participantId = useSelector(getParticipant);
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  const postsurvey = useSelector(getFinancialLitSurvey);
  const countryOfResidence = useSelector(getCountryOfResidence);
  const vizFamiliarity = useSelector(getVizFamiliarity);
  const age = useSelector(getAge);
  const gender = useSelector(getGender);
  const selfDescribeGender = useSelector(getSelfDescribeGender);
  const profession = useSelector(getProfession);
  const attentioncheck = useSelector(getAttentionCheck);
  const timestamps = useSelector(getTimestamps);
  const status = useSelector(getStatus);
  const feedback = useSelector(getFeedback);

  useEffect(() => {
    dispatch(theEndShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  useEffect(() => {
    switch (status) {
      case StatusType.PurposeQuestionaire:
        navigate("/purposequestionaire");
        break;
      case StatusType.Debrief:
        navigate("/debrief");
        break;
    }
  }, [status]);

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
              get paid ${process.env.REACT_APP_PAYMENT_AMOUT} USD.
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
                dispatch(
                  writeAnswers({
                    csv: csv,
                    participantId: participantId,
                    postSurveyAnswers: {
                      postsurvey: postsurvey,
                      demographics: {
                        countryOfResidence: countryOfResidence,
                        vizFamiliarity: vizFamiliarity,
                        age: age,
                        gender: gender,
                        selfDescribeGender: selfDescribeGender,
                        profession: profession,
                      },
                      attentioncheck: attentioncheck,
                      timestamps: timestamps,
                      feedback: feedback,
                    },
                  })
                );
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
