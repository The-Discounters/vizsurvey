import React, { useEffect } from "react";
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
import { StatusType } from "../features/StatusType.js";
import {
  getStatus,
  purposeSurveyQuestionsShown,
  purposeSurveyQuestionsCompleted,
  initPurposeSurveyQuestion,
  setPurposeSurveyQuestion,
  getPurposeSurveyAnswers,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util/src/ConversionUtil";
import { styles, theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  formLabel: {
    fontWeight: "bold",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export function PostSurvey(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const status = useSelector(getStatus);
  const answers = useSelector(getPurposeSurveyAnswers);
  const [dispatchPageShown, setDispatchPageShown] = React.useState(true);

  useEffect(() => {
    const path = navigateFromStatus(status);
    setDispatchPageShown(true);
    navigate(path);
  }, [status]);

  if (dispatchPageShown) {
    dispatch(purposeSurveyQuestionsShown(dateToState(DateTime.now())));
    window.scrollTo(0, 0);
    setDispatchPageShown(false);
  }

  const shownQuestions = props.content.questions.filter(({ question }) => {
    if (question.disabled === true) {
      return false;
    } else {
      return true;
    }
  });

  let qList = [];
  shownQuestions.forEach((q) => {
    dispatch(initPurposeSurveyQuestion(q.question.textShort));
    const value = answers[q.question.textShort];
    qList.push(value);
  });

  const pageNumber = status === StatusType.PurposeAwareQuestionaire ? 3 : 4;

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Grid container style={styles.root}>
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
                  key={`form-control-${index}`}
                  className={classes.formControl}
                >
                  <FormLabel
                    id={question.textShort}
                    className={classes.formLabel}
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
          <Grid item xs={12} style={{ margin: 0 }}>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
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
                      purposeSurveyQuestionsCompleted(
                        dateToState(DateTime.now())
                      )
                    );
                  }, 400);
                }}
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
