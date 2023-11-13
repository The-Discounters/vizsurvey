import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import {
  Grid,
  Button,
  Box,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
} from "@material-ui/core";
import {
  getStatus,
  attentionCheckShown,
  setAttentionCheck,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { styles, theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";
import { StatusType } from "../features/StatusType.js";

export function AttentionCheck() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(getStatus);
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [attentionCheckValue, setAttentionCheckValue] = React.useState("");

  useEffect(() => {
    dispatch(attentionCheckShown(dateToState(DateTime.now())));
  }, []);

  useEffect(() => {
    if (
      status !== StatusType.Survey &&
      status !== StatusType.Attention &&
      process.env.REACT_APP_FULLSCREEN === "enabled"
    ) {
      document.exitFullscreen();
    }

    const path = navigateFromStatus(status);
    navigate(path);
  }, [status]);

  const checkEnableSubmit = () => {
    let result = false;
    if (attentionCheckValue.length <= 0) {
      result = true;
    }
    setDisableSubmit(result);
  };

  useEffect(() => {
    checkEnableSubmit();
  }, [attentionCheckValue]);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  const question0 = {
    // Examples of Good (and Bad) Attention Check Questions in Surveys
    // https://www.cloudresearch.com/resources/blog/attention-check-questions-in-surveys-examples/
    question: {
      textShort: "attention-check",
      textFull: "Please select the 'stongly agree' option below.",
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4">Additional Question</Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>Answer the question below.</Typography>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ margin: 0 }}>
            <FormControl required>
              <FormLabel id={question0.question.textShort}>
                {"1. " + question0.question.textFull}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby={
                  question0.question.textShort +
                  "-row-radio-buttons-group-label"
                }
                name={question0.question.textShort + "-radio-buttons-group"}
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
                    checked={attentionCheckValue === option}
                    control={<Radio />}
                    label={option.replace("-", " ")}
                    onChange={(event) => {
                      handleFieldChange(event, setAttentionCheckValue);
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
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
                    setAttentionCheck({
                      value: attentionCheckValue,
                      timestamp: dateToState(DateTime.now()),
                    })
                  );
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

export default AttentionCheck;
