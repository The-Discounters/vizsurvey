import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  ThemeProvider,
} from "@material-ui/core";
import { useSearchParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { useSelector, useDispatch } from "react-redux";
import "../App.css";
import * as countries from "./countries.json";
import { dateToState } from "../features/ConversionUtil";
import {
  setTreatmentId,
  setSessionId,
  setParticipantId,
  loadTreatment,
  fetchStatus,
  consentShown,
  setDemographic,
} from "../features/questionSlice";
import { StatusType } from "../features/StatusType";
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

export function Consent() {
  const dispatch = useDispatch();
  const status = useSelector(fetchStatus);

  useEffect(() => {
    dispatch(consentShown(dateToState(DateTime.utc())));
  }, []);

  const rand = () => {
    return Math.floor(Math.random() * 10);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  var treatmentId;
  useEffect(() => {
    if (!treatmentId) {
      treatmentId = rand() + 1;
      const sessionId = searchParams.get("session_id");
      const participantId = searchParams.get("participant_id");
      setSearchParams({
        treatment_id: treatmentId,
        session_id: sessionId,
        participant_id: participantId,
      });
    }
  }, []);

  if (status === StatusType.Unitialized) {
    const sessionId = searchParams.get("session_id");
    if (sessionId) dispatch(setSessionId(sessionId));
    const participantId = searchParams.get("participant_id");
    if (participantId) dispatch(setParticipantId(participantId));
    treatmentId = searchParams.get("treatment_id");
    if (treatmentId) dispatch(setTreatmentId(treatmentId));
    if (treatmentId && sessionId && participantId) dispatch(loadTreatment());
  }

  const classes = useStyles();
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [country, setCountry] = React.useState("");
  const [visFamiliarity, setVisFamiliarity] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [profession, setProfession] = React.useState("");

  const navigate = useNavigate();

  const checkEnableSubmit = () => {
    if (
      country &&
      country.length > 1 &&
      visFamiliarity &&
      visFamiliarity.length > 0 &&
      age &&
      age.length > 1 &&
      gender &&
      gender.length > 0 &&
      profession &&
      profession.length > 0
    ) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  };

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
    checkEnableSubmit();
  };

  const vizFamiliarityLevel = [
    {
      id: 1,
      name: " 1 (I don't use charts and data visualizations)",
      value: 1,
    },
    { id: 2, name: " 2", value: 2 },
    { id: 3, name: " 3", value: 3 },
    { id: 4, name: " 4", value: 4 },
    { id: 5, name: " 5", value: 5 },
    { id: 6, name: " 6", value: 6 },
    {
      id: 7,
      name: " 7 (I use charts and data visualizations everyday)",
      value: 7,
    },
  ];

  const ConsentTextEn = () => {
    return (
      <React.Fragment>
        <p>
          <b>The goal of this research is </b> to understand how choices between
          receiving two amounts of money, a smaller sooner amount or a larger
          later amount are effected by how the choice is visualizaed.{" "}
        </p>
        <p>
          <b>Procedure: </b>You will be presented with a series of worded
          questions, or barcharts or calendar visualizations of smaller earlier
          and larger later amounts of money.
          <b>You will choose</b> either the earlier or later amount. You may
          also be asked to interact with the visualization <b>to adjust</b> the
          barchart height of the earlier or later amount by dragging the mouse
          vertically.{" "}
        </p>
        {/* For all parts, do NOT provide numerical answers, always think of words and expressions instead!  */}
        <p>
          <b>What you will get: </b> You will learn about how visualization of
          money amounts effects your decision to choose earlier or later
          amounts.
        </p>
        <p>
          <b>Duration: </b> The experiment will take you about 10 minutes.
        </p>
        <p>
          <b>Privacy: </b> Your participation is anonymous and your responses
          cannot be used to identify you.
        </p>
        <p>
          <b>Record keeping: </b>Records of your participation will be held
          confidential so far as permitted by law. However, the study
          investigators and, under certain circumstances, the Worcester
          Polytechnic Institute Institutional Review Board (WPI IRB) will be
          able to inspect and have access to this data. Any publication or
          presentation of the data will not identify you.
        </p>
        <p>
          <b>Contact info: </b> pcordone@wpi.edu (PI), ynachum@wpi.edu@
        </p>
        <p>
          <b>Your participation in this research is voluntary. </b> Your refusal
          to participate will not result in any penalty to you or any loss of
          benefits to which you may otherwise be entitled. You may decide to
          stop participating in the research at any time without penalty or loss
          of other benefits. The project investigators retain the right to
          cancel or postpone the experimental procedures at any time they see
          fit.
        </p>
        <p>
          For more information about your rights as a research participant, or
          any concerns related to this study, please contact the IRB Chair
          (Professor Kent Rissmiller, Tel. 508-831-5019, Email: kjr@wpi.edu) and
          the Human Protection Administrator (Gabriel Johnson, Tel.
          508-831-4989, Email: gjohnson@wpi.edu).
        </p>
      </React.Fragment>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Box height="25%" alignItems="center">
          <img
            style={{ maxHeight: "240px" }}
            src="money-on-calendar.png"
            alt="$100 bills on calendar"
          ></img>
        </Box>
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5">
              <i>Receiving Money</i> - <b>How to Visualize It</b>
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
              We are often faced with decisions in life to choose between two
              options of different value at different times where a sooner
              option is of less value than the later one. For example if I were
              to offer you $100 dollars now vs $300 dollars three months from
              now which would you choose?
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
              By clicking &ldquo;Next&ldquo;, you agree to participate. Before
              we begin, please enter your:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              className={classes.formControl}
              required
              style={{ maxWidth: 230, marginRight: 20 }}
            >
              <InputLabel htmlFor="country-select-helper">
                Country of residence
              </InputLabel>
              <NativeSelect
                value={country}
                onChange={(event) => {
                  handleFieldChange(event, setCountry);
                }}
                inputProps={{
                  name: "country-of-origin",
                  id: "country-select-helper",
                }}
              >
                <option> </option>
                {countries.default.map((option) => (
                  <option
                    key={option.alpha3}
                    id={option.alpha3}
                    value={option.alpha3}
                  >
                    {option.name}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>The country you are living in now</FormHelperText>
            </FormControl>
            <FormControl
              className={classes.formControl}
              required
              style={{ maxWidth: 230, marginRight: 20 }}
            >
              <NativeSelect
                value={visFamiliarity}
                onChange={(event) => {
                  handleFieldChange(event, setVisFamiliarity);
                }}
                name="familiarity-with-viz"
                className={classes.selectEmpty}
                inputProps={{ "aria-label": "Datavis experience" }}
              >
                <option> </option>
                {vizFamiliarityLevel.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option["name"]}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>
                Your experience with data visualizations and charts
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ margin: 0 }}>
            <TextField
              required
              className={classes.formControl}
              label="Age"
              type="number"
              id="Age"
              onChange={(event) => {
                handleFieldChange(event, setAge);
              }}
            />
            <label style={{ marginRight: 20 }}> </label>
            <TextField
              required
              className={classes.formControl}
              label="Gender"
              id="Gender"
              onChange={(event) => {
                handleFieldChange(event, setGender);
              }}
            />
            <label style={{ marginLeft: 25 }}> </label>
            <TextField
              required
              className={classes.formControl}
              label="Current Profession"
              id="Current-Profession"
              onChange={(event) => {
                handleFieldChange(event, setProfession);
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ margin: 0 }}>
            <Button
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                dispatch(
                  setDemographic({
                    country: country,
                    visFamiliarity: visFamiliarity,
                    age: age,
                    gender: gender,
                    profession: profession,
                  })
                );
                navigate("/introduction");
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
