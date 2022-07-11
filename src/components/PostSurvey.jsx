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
  ThemeProvider,
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
  const handle = useFullScreenHandle();

  useEffect(() => {
    dispatch(postSurveyQuestionsShown(dateToState(DateTime.utc())));
    if (process.env.REACT_APP_FULLSCREEN === "enabled") handle.exit();
  }, []);

  const classes = useStyles();

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  let surveys = POST_SURVEY_QUESTIONS;
  surveys = surveys.map((survey) => {
    survey["questions"] = survey.questions.filter(({ question }) => {
      if (question.disabled === true) {
        return false;
      } else {
        return true;
      }
    });
    return survey;
  });

  let qList2 = [];
  let qList2Flat = [];
  let setQList2 = [];
  surveys.forEach(({ questions }) => {
    let qList = [];
    let setQList = [];
    questions.forEach(() => {
      const [q, setQ] = React.useState("");
      qList.push(q);
      qList2Flat.push(q);
      setQList.push(setQ);
    });
    qList2.push(qList);
    setQList2.push(setQList);
  });

  const checkEnableSubmit = () => {
    let result = false;
    qList2.forEach((qList) => {
      qList.forEach((q) => {
        if (q.length <= 0) {
          result = true;
        }
      });
    });
    setDisableSubmit(result);
  };

  useEffect(() => {
    checkEnableSubmit();
  }, qList2Flat);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  const participantId = useSelector(getParticipant);
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  return (
    <ThemeProvider theme={theme}>
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
              <hr
                style={{
                  backgroundColor: "#aaaaaa",
                  height: 4,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {surveys.map(({ prompt, questionsType, questions }, index2) => (
                <div key={index2}>
                  <Typography paragraph>{prompt}</Typography>
                  {
                    questions.map(({ question, options }, index) => (
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
                            question.textShort +
                            "-row-radio-buttons-group-label"
                          }
                          name={question.textShort + "-radio-buttons-group"}
                        >
                          {questionsType === "multiple choice"
                            ? options.map((option, index1) => (
                                <FormControlLabel
                                  key={index1}
                                  value={option.textShort}
                                  checked={
                                    qList2[index2][index] === option.textShort
                                  }
                                  control={<Radio />}
                                  label={option.textFull}
                                  onChange={(event) => {
                                    handleFieldChange(
                                      event,
                                      setQList2[index2][index]
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
                                  checked={qList2[index2][index] === option}
                                  control={<Radio />}
                                  label={option.replace("-", " ")}
                                  onChange={(event) => {
                                    handleFieldChange(
                                      event,
                                      setQList2[index2][index]
                                    );
                                  }}
                                />
                              ))}
                        </RadioGroup>
                      </FormControl>
                    ))
                  }
                  <hr
                    style={{
                      backgroundColor: "#aaaaaa",
                      height: 4,
                    }}
                  />
                </div>
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
                        postSurveyAnswers: surveys.reduce(
                          (prev1, { questions, promptShort }, index1) => {
                            prev1[promptShort] = questions.reduce(
                              (prev, { question }, index) => {
                                prev[question.textShort] =
                                  qList2[index1][index];
                                return prev;
                              },
                              {}
                            );
                            return prev1;
                          },
                          {}
                        ),
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
    </ThemeProvider>
  );
}

export default PostSurvey;
