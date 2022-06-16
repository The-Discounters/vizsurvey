import React, { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { FileIOAdapter } from "../features/FileIOAdapter";
import {
  Grid,
  Button,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  getParticipant,
  postSurveyQuestionsShown,
  selectAllQuestions,
  writeAnswers,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { POST_SURVEY_QUESTIONS } from "../features/postsurveyquestions";

const styles = {
  root: { flexGrow: 1, margin: 0 },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

export function PostSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handle = useFullScreenHandle();

  useEffect(async () => {
    dispatch(postSurveyQuestionsShown(dateToState(DateTime.utc())));
    if (process.env.REACT_APP_FULLSCREEN === "enabled") handle.exit();
  }, []);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [q15vs30, setQ15vs30] = React.useState("");
  const [q50k6p, setQ50k6p] = React.useState("");
  const [q100k5p, setQ100k5p] = React.useState("");
  const [q200k5p, setQ200k5p] = React.useState("");

  const checkEnableSubmit = () => {
    if (
      q15vs30.length > 0 &&
      q50k6p.length > 0 &&
      q100k5p.length > 0 &&
      q200k5p.length > 0
    ) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  };

  const qList = [q15vs30, q50k6p, q100k5p, q200k5p];
  const setQList = [setQ15vs30, setQ50k6p, setQ100k5p, setQ200k5p];
  useEffect(async () => {
    checkEnableSubmit();
  }, qList);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  const participantId = useSelector(getParticipant);
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  const questions = POST_SURVEY_QUESTIONS;
  return (
    <div>
      <FullScreen handle={handle}>
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4">Questionaire</Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
            <Typography paragraph>
              The last step in this survey is to answer the questions below.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {questions.map(({ question, options }, index) => (
              <FormControl key={index} className={classes.formControl} required>
                <FormLabel id={question.textShort}>
                  {index + 1 + ". " + question.textFull}
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby={
                    question.textShort + "-row-radio-buttons-group-label"
                  }
                  name={question.textShort + "-radio-buttons-group"}
                >
                  {options.map((option, index1) => (
                    <FormControlLabel
                      key={index1}
                      value={option.textShort}
                      checked={qList[index] === option.textShort}
                      control={<Radio />}
                      label={option.textFull}
                      onChange={(event) => {
                        handleFieldChange(event, setQList[index]);
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ))}
          </Grid>
          <Grid item xs={12} style={{ margin: 0 }}>
            <Button
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                if (process.env.REACT_APP_FULLSCREEN === "enabled")
                  handle.enter();
                setTimeout(() => {
                  if (process.env.REACT_APP_FULLSCREEN === "enabled")
                    handle.exit();
                  dispatch(
                    writeAnswers({
                      csv: csv,
                      participantId: participantId,
                      postSurveyAnswers: {
                        q15vs30: q15vs30,
                        q50k6p: q50k6p,
                        q100k5p: q100k5p,
                        q200k5p: q200k5p,
                      },
                    })
                  );
                  navigate("/thankyou");
                }, 400);
              }}
              disabled={disableSubmit}
            >
              {" "}
              Next{" "}
            </Button>
          </Grid>
        </Grid>
      </FullScreen>
    </div>
  );
}

export default PostSurvey;
