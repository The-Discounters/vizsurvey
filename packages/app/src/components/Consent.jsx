import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  Grid,
  Button,
  Box,
  Typography,
  ThemeProvider,
  FormControlLabel,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import {
  consentShown,
  consentCompleted,
  getStatus,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { navigateFromStatus } from "./Navigate.js";
import { styles, theme } from "./ScreenHelper.js";
import "../App.css";

export function Consent() {
  const dispatch = useDispatch();

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const status = useSelector(getStatus);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setDisableSubmit(!event.target.checked);
  };

  useEffect(() => {
    dispatch(consentShown(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = navigateFromStatus(status);
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const ConsentTextEn = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>Investigator: </b>
          {process.env.REACT_APP_RESEARCHER_NAMES}
        </Typography>
        <Typography paragraph>
          <b>Contact Information: </b> {process.env.REACT_APP_CONTACT_NAME}{" "}
          <a
            href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}?subject=%5b${process.env.REACT_APP_RESEARCH_TITLE}%20Survey%20Consent%5d`}
          >
            {process.env.REACT_APP_CONTACT_EMAIL}
          </a>
        </Typography>
        <Typography paragraph>
          <b>Title of Research Study: </b>
          {process.env.REACT_APP_RESEARCH_TITLE}
        </Typography>
        <Typography paragraph>
          <b>Sponsor: </b>
          <a
            href={`mailto:${process.env.REACT_APP_SPONSOR_EMAIL}?subject=%5b${process.env.REACT_APP_RESEARCH_TITLE}%20Survey%20Consent%5d`}
          >
            {process.env.REACT_APP_SPONSOR_NAME} (
            {process.env.REACT_APP_SPONSOR_EMAIL})
          </a>
        </Typography>
        <Typography paragraph>
          <b>Introduction: </b>
          You are being asked to participate in a research study. Before you
          agree, however, you must be fully informed about the purpose of the
          study, the procedures to be followed, and any benefits, risks or
          discomfort that you may experience as a result of your participation.
          This form presents information about the study so that you may make a
          fully informed decision regarding your participation.
        </Typography>
        <Typography paragraph>
          <b>Purpose of the study: </b> To study how people make choices about
          money.
        </Typography>
        <Typography paragraph>
          <b>Procedures to be followed: </b>You will be presented with a series
          of choices about receiving money at different points in time.&nbsp;
          <b>You will choose</b> either the earlier or later amount. Then you
          will be presented with additional questions about your experience
          taking the survey as well as questions about yourself. The study
          should take about {process.env.REACT_APP_TIME_IN_MIN_TO_COMPLETE}{" "}
          minutes to complete.&nbsp;
          <b>
            This survey is not designed to render on a mobile device and should
            be taken on a laptop or desktop computer with a reliable Internet
            connection.
          </b>
        </Typography>
        <Typography paragraph>
          <b>Risks to study participants:</b> To the best of the researchers
          knowledge risks to you are minimal or nonexistent. All data collected,
          including demographic information, will be analyzed in aggregate form
          only and will not be used to identify you.
        </Typography>
        <Typography paragraph>
          <b>Benefits to research participants and others: </b> You will learn
          more about the goal of this research and how people make decisions
          about money at the end.
        </Typography>
        <Typography paragraph>
          <b>Record keeping and confidentiality: </b>
          Records of your participation in this study will be held confidential
          so far as permitted by law. However, the study investigators, the
          sponsor or it’s designee and, under certain circumstances, the
          Worcester Polytechnic Institute Institutional Review Board (WPI IRB)
          will be able to inspect and have access to confidential data that
          identify you by name. Any publication or presentation of the data will
          not identify you. Your prolific ID will be recorded in the data solely
          for the purpose of paying you and then will be deleted from the data.
        </Typography>
        <Typography paragraph>
          <b> Compensation or treatment in the event of injury:</b> There is
          minimal or no risk of injury in this research so there is no
          compensation available for injury from the researchers. You do not
          give up any of your legal rights by signing this statement.
        </Typography>
        <Typography paragraph>
          <b>Cost/Payment:</b>
          <b>
            <i>
              You will be compensated {process.env.REACT_APP_PAYMENT_AMOUT}{" "}
              (United States Dollars) for your participation in this survey if
              you complete the survey in its entirety and enter the code
              presented at the end into Prolific. If you choose to end the
              survey before completion, you will not be paid. All dollar amounts
              in the survey questions are hypothetical and you will not be
              compensated the survey question amounts. You will be compensated{" "}
              {process.env.REACT_APP_PAYMENT_AMOUT} upon completion and
              submission of all questions, entering the code presented into
              Prolific, and acknowledgement of your completion by the
              researchers.
            </i>
          </b>
        </Typography>
        <Typography paragraph>
          <b>
            For more information about this research or about the rights of
            research participants, or in case of research-related injury,
            contact:
          </b>
        </Typography>
        {[
          {
            name: `${process.env.REACT_APP_CONTACT_NAME}`,
            phone: `${process.env.REACT_APP_CONTACT_PHONE}`,
            email: `${process.env.REACT_APP_CONTACT_EMAIL}`,
          },
          {
            name: `${process.env.REACT_APP_IRB_NAME}`,
            phone: `${process.env.REACT_APP_IRB_PHONE}`,
            email: `${process.env.REACT_APP_IRB_EMAIL}`,
          },
          {
            name: `${process.env.REACT_APP_HPA_NAME}`,
            phone: `${process.env.REACT_APP_HPA_PHONE}`,
            email: `${process.env.REACT_APP_HPA_EMAIL}`,
          },
        ].map(({ name, phone, email }, index) => {
          return (
            <Typography key={index} paragraph>
              <span key={index}>
                {name}
                <br />
                Tel: {phone}
                <br />
                Email:
                <a
                  href={`mailto:${email}?subject=%5b${process.env.REACT_APP_RESEARCH_TITLE}%20Survey%20Consent%5d`}
                >
                  {email}
                </a>
                <br />
              </span>
            </Typography>
          );
        })}
        <Typography paragraph>
          <b>Your participation in this research is voluntary. </b>
          Your refusal to participate will not result in any penalty to you or
          any loss of benefits to which you may otherwise be entitled. You may
          decide to stop participating in the research at any time without
          penalty or loss of other benefits; however, you will not receive the
          compensation of {process.env.REACT_APP_PAYMENT_AMOUT} unless you
          complete the survey in its entirety. The project investigators retain
          the right to cancel or postpone the experimental procedures at any
          time they see fit.
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
            alt="Question mark."
          ></img>
        </Box>{" "}
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5">
              <b>Informed Consent</b>
              <br />
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
            <Typography paragraph>
              <b>
                This survey is not designed to render on a mobile device and
                should be taken on a laptop or desktop computer.
              </b>
            </Typography>
            <ConsentTextEn />
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
                    used for the purpose(s) mentioned in the Consent Form.
                  </Typography>
                }
              />
              <Typography paragraph>
                <b>By selecting the checkbox and clicking &ldquo;Next&ldquo;</b>
                , you acknowledge that you have been informed about and consent
                to be a participant in the study described above. Make sure that
                your questions are answered to your satisfaction before signing.
                You are entitled to retain a copy of this consent agreement.
              </Typography>
              <Typography paragraph>
                I also confirm that I am on a reliable internet connection for
                completing the survey.
              </Typography>
            </FormGroup>
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
                  dispatch(consentCompleted(dateToState(DateTime.now())));
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

export default Consent;
