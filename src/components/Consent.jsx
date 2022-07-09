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
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { useDispatch } from "react-redux";
import * as countries from "./countries.json";
import { dateToState } from "../features/ConversionUtil";
import { consentShown, setDemographic } from "../features/questionSlice";
import { styles, theme } from "./ScreenHelper";
import "../App.css";

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

  useEffect(() => {
    dispatch(consentShown(dateToState(DateTime.utc())));
  }, []);

  const classes = useStyles();
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [disableSelfDescribe, setDisableSelfDescribe] = React.useState(true);
  const [country, setCountry] = React.useState("");
  const [visFamiliarity, setVisFamiliarity] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [selfDescribeGender, setSelfDescribeGender] = React.useState("");
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
      (gender !== "self-describe" ||
        (selfDescribeGender && selfDescribeGender.length > 0)) &&
      profession &&
      profession.length > 0
    ) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  };

  const handleFieldChange = (event, setter) => {
    // reject negative ages.
    // if (event.target.value <= 0) {
    //   event.target.value = "";
    // } else {
    setter(event.target.value);
    checkEnableSubmit();
    if (event.target.value === "self-describe") {
      setDisableSelfDescribe(false);
    } else if (
      ["female", "male", "transgender", "non-binary", "intersex"].includes(
        event.target.value
      )
    ) {
      setDisableSelfDescribe(true);
    }
    //    }
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
          receiving two amounts of money, one sooner and the other later, are
          affected by the way they are presented.
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
            src="bar-chart.png"
            alt="$100 bills on calendar"
          ></img>
        </Box>{" "}
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5">
              <b>Money Earlier or Later?</b>
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
              different point in time.
            </Typography>
            <Typography>
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

            <Typography>
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
                event.target.value < 0 ||
                event.target.value.includes("e") ||
                event.target.value.includes("-") ||
                event.target.value.includes(".")
                  ? (event.target.value = 0)
                  : event.target.value;
                handleFieldChange(event, setAge);
              }}
            />
            <label style={{ marginRight: 20 }}> </label>
            <FormControl
              className={classes.formControl}
              required
              style={{ maxWidth: 230, marginRight: 20 }}
            >
              <InputLabel htmlFor="gender-select-helper">Gender</InputLabel>
              <NativeSelect
                value={gender}
                onChange={(event) => {
                  handleFieldChange(event, setGender);
                }}
                inputProps={{
                  name: "gender",
                  id: "gender-select-helper",
                }}
              >
                <option> </option>
                {[
                  { value: "female", text: "Female" },
                  { value: "male", text: "Male" },
                  { value: "transgender", text: "Transgender" },
                  { value: "non-binary", text: "Non-binary" },
                  { value: "intersex", text: "Intersex" },
                  { value: "self-describe", text: "Prefer to self-describe" },
                  { value: "prefer-not-to-say", text: "Prefer not to say" },
                ].map(({ value, text }) => (
                  <option key={value} id={value} value={value}>
                    {text}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <TextField
              required
              className={classes.formControl}
              label="Self Describe Gender"
              id="Self-Describe-Gender"
              onChange={(event) => {
                handleFieldChange(event, setSelfDescribeGender);
              }}
              disabled={disableSelfDescribe}
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
