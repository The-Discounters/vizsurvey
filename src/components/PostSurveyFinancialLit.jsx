import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import {
  Grid,
  Box,
  Button,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  getStatus,
  financialLitSurveyQuestionsShown,
  financialLitSurveyQuestionsCompleted,
  nextQuestion,
  initFinancialLitSurveyQuestion,
  setFinancialLitSurveyQuestion,
  getFinancialLitSurveyQuestion,
} from "../features/questionSlice";
import { POST_SURVEY_QUESTIONS } from "../features/postsurveyquestionsfinanciallit";
import { styles, theme } from "./ScreenHelper";
import { navigateFromStatus } from "./Navigate";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export function PostSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  let surveys = POST_SURVEY_QUESTIONS;
  const status = useSelector(getStatus);

  const [disableSubmit, setDisableSubmit] = React.useState(true);

  surveys.questions = surveys.questions.filter(({ question }) => {
    if (question.disabled === true) {
      return false;
    } else {
      return true;
    }
  });

  let qList = [];
  surveys.questions.forEach((q) => {
    dispatch(initFinancialLitSurveyQuestion(q.question.textShort));
    const value = useSelector(
      getFinancialLitSurveyQuestion(q.question.textShort)
    );
    qList.push(value);
  });

  useEffect(() => {
    dispatch(financialLitSurveyQuestionsShown(DateTime.utc().toString()));
  }, []);

  useMemo(() => {
    navigateFromStatus(navigate, status);
  }, [status]);

  useEffect(() => {
    checkEnableSubmit();
    if (process.env.REACT_APP_FULLSCREEN === "enabled")
      document.exitFullscreen();
  }, qList);

  const checkEnableSubmit = () => {
    let result = false;
    qList.forEach((q) => {
      if (q.length <= 0) {
        result = true;
      }
    });
    setDisableSubmit(result);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4">Additional Questions</Typography>
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
              The last step in this survey is to answer the questions below.
            </Typography>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <div>
              <Typography paragraph>{surveys.prompt}</Typography>
              {surveys.questions.map(({ question, options }, index) => (
                <FormControl
                  key={index}
                  className={classes.formControl}
                  required
                >
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
                    {surveys.questionsType === "multiple choice"
                      ? options.map((option, index1) => (
                          <FormControlLabel
                            key={index1}
                            value={option.textShort}
                            checked={qList[index] === option.textShort}
                            style={{
                              width: "100%",
                            }}
                            control={<Radio />}
                            label={option.textFull}
                            onChange={(event) => {
                              dispatch(
                                setFinancialLitSurveyQuestion({
                                  key: surveys.questions[index].question
                                    .textShort,
                                  value: event.target.value,
                                })
                              );
                            }}
                          />
                        ))
                      : [
                          "prefer not to answer",
                          "strongly-disagree",
                          "disagree",
                          "neutral",
                          "agree",
                          "strongly-agree",
                        ].map((option, index1) => (
                          <FormControlLabel
                            key={index1}
                            value={option}
                            id={question.textShort + "-" + option}
                            checked={qList[index] === option}
                            style={{
                              width: "100%",
                            }}
                            control={<Radio />}
                            label={option.replace("-", " ")}
                            onChange={(event) => {
                              dispatch(
                                setFinancialLitSurveyQuestion({
                                  key: surveys.questions[index].question
                                    .textShort,
                                  value: event.target.value,
                                })
                              );
                            }}
                          />
                        ))}
                  </RadioGroup>
                </FormControl>
              ))}
              <hr
                style={{
                  backgroundColor: "#aaaaaa",
                  height: 4,
                }}
              />
            </div>
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
                  setTimeout(() => {
                    dispatch(
                      financialLitSurveyQuestionsCompleted(
                        DateTime.utc().toString()
                      )
                    );
                    dispatch(nextQuestion());
                  }, 400);
                }}
                disabled={disableSubmit}
              >
                {" "}
                Next{" "}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default PostSurvey;
