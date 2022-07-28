import React, { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
} from "@material-ui/core";
import {
  postSurveyQuestionsShown,
  setAttentionCheck,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme } from "./ScreenHelper";

export function AttentionCheck() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handle = useFullScreenHandle();

  useEffect(() => {
    dispatch(postSurveyQuestionsShown(dateToState(DateTime.utc())));
    if (process.env.REACT_APP_FULLSCREEN === "enabled") handle.exit();
  }, []);

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  let qList2 = [];
  let setQList2 = [];
  const [q, setQ] = React.useState("");
  qList2.push(q);
  setQList2.push(setQ);

  const checkEnableSubmit = () => {
    let result = false;
    qList2.forEach((q) => {
      if (q.length <= 0) {
        result = true;
      }
    });
    setDisableSubmit(result);
  };

  useEffect(() => {
    checkEnableSubmit();
  }, qList2);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <FullScreen handle={handle}>
          <Grid container style={styles.root} justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h4">Attention Check</Typography>
              <hr
                style={{
                  color: "#ea3433",
                  backgroundColor: "#ea3433",
                  height: 4,
                }}
              />
              <Typography paragraph>
                The middle step in this survey is to answer the attention check
                question below.
              </Typography>
              <hr
                style={{
                  backgroundColor: "#aaaaaa",
                  height: 4,
                }}
              />
            </Grid>
            <Grid item xs={12} style={{ margin: 0 }}>
              {[
                {
                  // Examples of Good (and Bad) Attention Check Questions in Surveys
                  // https://www.cloudresearch.com/resources/blog/attention-check-questions-in-surveys-examples/
                  question: {
                    textShort: "attention-check",
                    textFull:
                      "Please select 'stongly agree' to show that you are paying attention to this question.",
                  },
                },
              ].map(({ question }, index) => (
                <FormControl key={index} required>
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
                    {[
                      "strongly-disagree",
                      "disagree",
                      "neutral",
                      "agree",
                      "strongly-agree",
                    ].map((option, index1) => (
                      <FormControlLabel
                        key={index1}
                        value={option}
                        id={"attention-check-" + option}
                        checked={qList2[index] === option}
                        control={<Radio />}
                        label={option.replace("-", " ")}
                        onChange={(event) => {
                          handleFieldChange(event, setQList2[index]);
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
                  dispatch(setAttentionCheck(qList2[0]));
                  navigate("/survey");
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

export default AttentionCheck;
