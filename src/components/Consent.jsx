import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  Grid,
  Button,
  Box,
  Typography,
  ThemeProvider,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { dateToState } from "../features/ConversionUtil";
import { consentShown, consentCompleted } from "../features/questionSlice";
import { styles, theme } from "./ScreenHelper";
import "../App.css";

export function Consent() {
  const dispatch = useDispatch();

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
          any concerns related to this study, please contact the:<br></br>
          IRB Chair Professor Kent Rissmiller<br></br>
          Tel. 508-831-5019<br></br>
          Email: kjr@wpi.edu<br></br>
          and the<br></br>
          Human Protection Administrator Gabriel Johnson<br></br>
          Tel. 508-831-4989<br></br>
          Email: gjohnson@wpi.edu
        </Typography>
      </React.Fragment>
    );
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
            <div
              className="overflow-auto"
              style={{
                padding: 10,
                marginBottom: 25,
                maxWidth: "95%",
                maxHeight: "300px",
              }}
              id="consent-section"
            >
              <ConsentTextEn />
            </div>

            <Typography paragraph>
              By clicking &ldquo;Next&ldquo;, you agree to participate.
            </Typography>
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
