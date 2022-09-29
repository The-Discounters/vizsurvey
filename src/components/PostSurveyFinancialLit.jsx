/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
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
  Box,
  ThemeProvider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { StatusType } from "../features/StatusType";
import {
  getStatus,
  postSurveyQuestionsShown,
  nextQuestion,
  previousQuestion,
  setPostSurvey,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { POST_SURVEY_QUESTIONS } from "../features/postsurveyquestionsfinanciallit";
import { styles, theme } from "./ScreenHelper";

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
  const handle = useFullScreenHandle();
  let surveys = POST_SURVEY_QUESTIONS;

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const status = useSelector(getStatus);

  useEffect(() => {
    dispatch(postSurveyQuestionsShown(dateToState(DateTime.utc())));
    if (process.env.REACT_APP_FULLSCREEN === "enabled") handle.exit();
  }, []);

  useEffect(() => {
    switch (status) {
      case StatusType.Survey:
        navigate("/survey");
        break;
      case StatusType.PurposeQuestionaire:
        navigate("/purposequestionaire");
        break;
    }
  }, [status]);

  surveys.questions = surveys.questions.filter(({ question }) => {
    if (question.disabled === true) {
      return false;
    } else {
      return true;
    }
  });

  let qList = [];
  let setQList = [];
  surveys.questions.forEach(() => {
    const [q, setQ] = React.useState("");
    qList.push(q);
    setQList.push(setQ);
  });

  const checkEnableSubmit = () => {
    let result = false;
    qList.forEach((q) => {
      if (q.length <= 0) {
        result = true;
      }
    });
    setDisableSubmit(result);
  };

  useEffect(() => {
    checkEnableSubmit();
  }, qList);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <FullScreen handle={handle}>
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
                                handleFieldChange(event, setQList[index]);
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
                                handleFieldChange(event, setQList[index]);
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
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                disableRipple
                disableFocusRipple
                style={styles.button}
                onClick={() => {
                  dispatch(previousQuestion());
                }}
              >
                {" "}
                Previous{" "}
              </Button>
            </Grid>
            <Grid item xs={6} style={{ margin: 0 }}>
              <Box display="flex" justifyContent="flex-end">
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
                      dispatch(nextQuestion());

                      // setPostSurvey({
                      //   data: surveys.questions.reduce(
                      //     (prev, { question }, index) => {
                      //       prev[question.textShort] = qList[index];
                      //       return prev;
                      //     },
                      //     {}
                      //   ),
                      //   key: surveys.promptShort,
                      // })
                      //);

                      navigate("/purposequestionaire");
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
        </FullScreen>
      </div>
    </ThemeProvider>
  );
}

export default PostSurvey;
