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
import { StatusType } from "@the-discounters/types";
import {
  getStatus,
  purposeSurveyQuestionsShown,
  purposeSurveyQuestionsCompleted,
  initPurposeSurveyQuestion,
  setPurposeSurveyQuestion,
  getPurposeSurveyAnswers,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { styles, theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";

export function PostSurvey(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(getStatus);
  const answers = useSelector(getPurposeSurveyAnswers);
  const [dispatchPageShown, setDispatchPageShown] = React.useState(true);

  useEffect(() => {
    const path = navigateFromStatus(status);
    setDispatchPageShown(true);
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const shownQuestions = props.content.questions.filter(({ question }) => {
    if (question.disabled === true) {
      return false;
    } else {
      return true;
    }
  });

  if (dispatchPageShown) {
    dispatch(purposeSurveyQuestionsShown(dateToState(DateTime.now())));
    // maps the question array into an object where short text is the key to initialize the redux global state
    const questionObj = shownQuestions.reduce((acc, q) => {
      acc[q.question.textShort] = "";
      return acc;
    }, {});
    dispatch(initPurposeSurveyQuestion(questionObj));
    window.scrollTo(0, 0);
    setDispatchPageShown(false);
  }

  // creates an array of answers to questions to use to check checked for each radio button
  let qList = shownQuestions.map((q) => answers[q.question.textShort]);

  const pageNumber = status === StatusType.PurposeAwareQuestionaire ? 3 : 4;

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
            <Typography variant="h4">
              Additional Questions {pageNumber} of 4
            </Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>{props.content.prompt}</Typography>
          </Grid>
          {shownQuestions.map(({ question, options }, index) => (
            <div key={`div-${index}`}>
              <Grid item xs={12} key={`grid-${index}`}>
                <FormControl
                  variant="standard"
                  key={`form-control-${index}`}
                  sx={{ fontWeight: "bold" }}
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
                    {props.content.questionsType === "multiple choice"
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
                                setPurposeSurveyQuestion({
                                  key: shownQuestions[index].question.textShort,
                                  value: event.target.value,
                                })
                              );
                            }}
                          />
                        ))
                      : [
                          "strongly-disagree",
                          "disagree",
                          "somewhat-disagree",
                          "neither-agree-nor-disagree",
                          "somewhat-agree",
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
                            label={option.replace(/-/g, " ")}
                            onChange={(event) => {
                              dispatch(
                                setPurposeSurveyQuestion({
                                  key: shownQuestions[index].question.textShort,
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
                    purposeSurveyQuestionsCompleted(dateToState(DateTime.now()))
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
