import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import {
  Grid,
  Button,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import {
  getStatus,
  financialLitSurveyQuestionsShown,
  financialLitSurveyQuestionsCompleted,
  initFinancialLitSurveyQuestion,
  setFinancialLitSurveyQuestion,
  getFinancialLitSurveyAnswers,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { POST_SURVEY_QUESTIONS } from "../features/postsurveyquestionsfinanciallit.js";
import { styles, theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";

export function PostSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let surveys = POST_SURVEY_QUESTIONS;
  const status = useSelector(getStatus);
  const answers = useSelector(getFinancialLitSurveyAnswers);

  surveys.questions = surveys.questions.filter(({ question }) => {
    if (question.disabled === true) {
      return false;
    } else {
      return true;
    }
  });

  // creates an array of answers to questions to use to check checked for each radio button
  let qList = surveys.questions.map((q) => answers[q.question.textShort]);

  useEffect(() => {
    dispatch(financialLitSurveyQuestionsShown(dateToState(DateTime.now())));
    // maps the question array into an object where short text is the key to initialize the redux global state
    const questionObj = surveys.questions.reduce((acc, q) => {
      acc[q.question.textShort] = "";
      return acc;
    }, {});
    // combine the objects so that we have an empty field for questions that weren't answered.
    const initObj = { ...questionObj, ...answers };
    dispatch(initFinancialLitSurveyQuestion(initObj));
    window.scrollTo(0, 0);
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
            <Typography variant="h4">Additional Questions 2 of 4</Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>{surveys.prompt}</Typography>
          </Grid>
          {surveys.questions.map(({ question, options }, index) => (
            <div key={`div-${index}`}>
              <Grid item xs={12} key={`grid-${index}`}>
                <FormControl
                  variant="standard"
                  key={`form-control-${index}`}
                  sx={{ fontWeight: "bold" }}
                  required
                >
                  <FormLabel
                    id={question.textShort}
                    sx={{ fontWeight: "bold" }}
                  >
                    {question.textFull}
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
                            key={`radio-${index1}`}
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
                          "strongly-disagree",
                          "disagree",
                          "neutral",
                          "agree",
                          "strongly-agree",
                        ].map((option, index1) => (
                          <FormControlLabel
                            key={`radio-${index1}`}
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
              </Grid>
              <br key={`br-${index}`}></br>
            </div>
          ))}
          <Grid item align="center" xs={12}>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
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
                      dateToState(DateTime.now())
                    )
                  );
                }, 400);
              }}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default PostSurvey;
