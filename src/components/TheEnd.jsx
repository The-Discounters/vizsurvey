import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { Grid, Typography, ThemeProvider, Button } from "@material-ui/core";
import { theEndShownTimestamp } from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";
import {
  getParticipant,
  getPostSurvey,
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

const TheEnd = () => {
  useEffect(() => {
    dispatch(theEndShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  const dispatch = useDispatch();

  const participantId = useSelector(getParticipant);
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  const postsurvey = useSelector(getPostSurvey);
  const countryOfResidence = useSelector(getCountryOfResidence);
  const vizFamiliarity = useSelector(getVizFamiliarity);
  const age = useSelector(getAge);
  const gender = useSelector(getGender);
  const selfDescribeGender = useSelector(getSelfDescribeGender);
  const profession = useSelector(getProfession);
  const attentioncheck = useSelector(getAttentionCheck);
  const timestamps = useSelector(getTimestamps);

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Thank You and The End</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          <Typography paragraph>
            You have completed the survey. We hope you have enjoyed taking this
            survey and welcome any feedback and/or questions through email by
            clicking&nbsp;
            <a
              href={`mailto:pncordone@wpi.edu?subject=Survey Feedback&body=${encodeURIComponent(
                "Enter your feedback here."
              )}`}
            >
              here
            </a>
            . Please click the button below to submit your answers and exit this
            tab.
          </Typography>
          <Typography paragraph>
            You can now close this browser window.
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ margin: 0 }}>
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
              setTimeout(() => {
                window.open("about:blank", "_self");
                window.close();
              }, 400);
            }}
          >
            {" "}
            Submit and Exit{" "}
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default TheEnd;
