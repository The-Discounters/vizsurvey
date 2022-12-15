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
  selectAllQuestions,
  writeAnswers,
} from "../features/questionSlice";
import { FileIOAdapter } from "../features/FileIOAdapter";
import { navigateFromStatus } from "./Navigate";

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

  useEffect(() => {
    dispatch(theEndShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  useMemo(() => {
    navigateFromStatus(navigate, status);
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
          <Typography paragraph>
            If you encounter an error and are not able to submit your answers,
            please click{" "}
            <a
              href={`mailto:pncordone@wpi.edu?subject=Technical%20Problems%20With%20Survey&body=Please%20describe%20the%20technical%20problems%20you%20are%20having%20below%20giving%20as%20much%20details%20as%20you%20can.`}
            >
              here
            </a>{" "}
            to email pncordone@wpi.edu and give as detailed a description as you
            can of the problem.
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
