import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  Grid,
  Button,
  Box,
  Typography,
  ThemeProvider,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch } from "react-redux";
import { dateToState } from "../features/ConversionUtil";
import { consentShown, consentCompleted } from "../features/questionSlice";
import { styles, theme } from "./ScreenHelper";
import "../App.css";

export function Consent() {
  const dispatch = useDispatch();

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setDisableSubmit(!event.target.checked);
  };

  useEffect(() => {
    dispatch(consentShown(dateToState(DateTime.utc())));
  }, []);

  const navigate = useNavigate();

  const ConsentTextEn = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>The goal of this research is </b> to study how people make choices
          about receiving money.
        </Typography>
        <Typography paragraph>
          <b>Procedure: </b>You will be presented with a series of choices about
          receiving money at different points in time.
          <b>You will choose</b> either the earlier or later amount.{" "}
        </Typography>
        {/* For all parts, do NOT provide numerical answers, always think of words and expressions instead!  */}
        <Typography paragraph>
          <b>What you will get: </b> You will learn more about the goal of this
          reasearch and how people make decisions about money.
        </Typography>
        <Typography paragraph>
          <b>Duration: </b> The experiment will take you about 10 minutes.
        </Typography>
        <Typography paragraph>
          <b>Privacy: </b> Your participation is anonymous and your responses
          cannot be used to identify you.
        </Typography>
        <Typography paragraph>
          <b>Record keeping: </b>Records of your participation will be held
          confidential so far as permitted by law. However, the study
          investigators and, under certain circumstances, the Worcester
          Polytechnic Institute Institutional Review Board (WPI IRB) will be
          able to inspect and have access to this data. Any publication or
          presentation of the data will not identify you.
        </Typography>
        <Typography paragraph>
          <b>Contact info: </b>
          {[
            { name: "Prof. Daniel Reichman", email: "dreichman@wpi.edi" },
            {
              name: "Prof. Ravit Heskiau",
              email: "r.heskiau@northeastern.edu",
            },
            { name: "Prof. Lane Harrison", email: "ltharrison@wpi.edu" },
            { name: "Peter Cordone", email: "pcordone@wpi.edu" },
            { name: "Yahel Nachum", email: "ynachum@wpi.edu" },
          ].map(({ name, email }, index) => {
            return (
              <span key={index}>
                {name} &lt;
                <a href={`mailto:${email}`}>{email}</a>&gt;
                {index < 4 ? ", " : ""}
              </span>
            );
          })}
        </Typography>
        <Typography paragraph>
          <b>Your participation in this research is voluntary. </b> Your refusal
          to participate will not result in any penalty to you or any loss of
          benefits to which you may otherwise be entitled. You may decide to
          stop participating in the research at any time without penalty or loss
          of other benefits. The project investigators retain the right to
          cancel or postpone the experimental procedures at any time they see
          fit.
        </Typography>
        <Typography paragraph>
          For more information about your rights as a research participant, or
          any concerns related to this study, please contact the:
          <br />
          <br />
          {[
            {
              name: "IRB Chair Professor Kent Rissmiller",
              phone: "508-831-5019",
              email: "kjr@wpi.edu",
            },
            {
              name: "Human Protection Administrator Gabriel Johnson",
              phone: "508-831-4989",
              email: "gjohnson@wpi.edu",
            },
          ].map(({ name, phone, email }, index) => {
            return (
              <span key={index}>
                {name}
                <br />
                Tel: {phone}
                <br />
                Email: &lt;<a href={`mailto:${email}`}>{email}</a>&gt;
                <br />
                {index < 1 ? <br /> : ""}
              </span>
            );
          })}
        </Typography>
      </React.Fragment>
    );
  };

  let qList2 = [];
  let setQList2 = [];
  [
    "strongly-disagree",
    "disagree",
    "neutral",
    "agree",
    "strongly-agree",
  ].forEach(() => {
    const [q, setQ] = React.useState("");
    qList2.push(q);
    setQList2.push(setQ);
  });

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Box height="25%" alignItems="center">
          <img
            style={{ maxHeight: "240px" }}
            src="generic-questionaire-icon.svg"
            alt="Questionaire image."
          ></img>
        </Box>{" "}
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5">
              <b>Choices About Money?</b>
              <br />
            </Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
            <Typography>
              We often have to make choices about receiveing rewards at
              different points in time.
            </Typography>
            <Typography paragraph>
              <br />
              <i>
                {" "}
                <u>
                  Before you proceed, please read the following consent form
                  carefully:{" "}
                </u>{" "}
              </i>
            </Typography>
            <ConsentTextEn />
            <Typography paragraph>
              By clicking &ldquo;Next&ldquo;, you agree to participate.
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ margin: 0 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    name="checkConsent"
                    id="checkConsent"
                    color="primary"
                  />
                }
                label={
                  <Typography>
                    I agree that any information provided in this survey can be
                    used for the purpose(s) mentioned in the Consent Form
                  </Typography>
                }
              />
            </FormGroup>
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
                dispatch(consentCompleted(dateToState(DateTime.utc())));
                navigate("/demographic");
              }}
              disabled={disableSubmit}
            >
              {" "}
              Next{" "}
            </Button>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default Consent;
