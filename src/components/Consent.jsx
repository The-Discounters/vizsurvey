/* eslint-disable no-unused-vars */
import React from "react";
import { Grid, TextField, Button, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import { useDispatch } from "react-redux";
import "../App.css";
import * as countries from "./countries.json";
import * as allLanguages from "./languages.json";
import { setDemographic } from "../features/questionSlice";

const styles = {
  root: { flexGrow: 1, margin: 0 },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

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
  const classes = useStyles();
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [country, setCountry] = React.useState("");
  const [firstLanguage, setFirstLanguage] = React.useState("");
  const [secondLanguage, setSecondLanguage] = React.useState("");
  const [visFamiliarity, setVisFamiliarity] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [profession, setProfession] = React.useState("");

  const checkEnableSubmit = () => {
    if (
      country.length > 1 &&
      firstLanguage.length > 1 &&
      secondLanguage.length > 1 &&
      visFamiliarity.length > 0 &&
      age.length > 1 &&
      gender.length > 0 &&
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

  const languages = allLanguages.default
    .filter(function (value) {
      return value["en"];
    })
    .sort((a, b) => (a["en"] > b["en"] ? 1 : -1));

  const ConsentTextEn = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <React.Fragment>
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
              <i> Money earlier or later?</i> -{" "}
              <b>Does visualization influence your choice? </b>
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
            <FormControl required style={{ maxWidth: 200, marginRight: 20 }}>
              <InputLabel htmlFor="country-select-helper">
                Country of residence
              </InputLabel>
              <NativeSelect
                value={country}
                onChange={(event, c, sc, scs) => {
                  handleFieldChange(event, setCountry);
                }}
                inputProps={{
                  name: "country-of-origin",
                  id: "country-select-helper",
                }}
              >
                <option> </option>
                {countries.default.map((option) => (
                  <option key={option.alpha3} value={option.alpha3}>
                    {option.name}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>The country you are living in now</FormHelperText>
            </FormControl>
            <FormControl required style={{ maxWidth: 200, marginRight: 20 }}>
              <InputLabel htmlFor="first-language-select-helper">
                First language
              </InputLabel>
              <NativeSelect
                value={firstLanguage}
                onChange={(event, c, sc, scs) => {
                  handleFieldChange(event, setFirstLanguage);
                }}
                inputProps={{
                  name: "first-language",
                  id: "first-language-select-helper",
                }}
              >
                <option> </option>
                {languages.map((option) => (
                  <option key={option.alpha3} value={option.alpha3}>
                    {option["en"]}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>The language you use the most.</FormHelperText>
            </FormControl>
            <FormControl required style={{ maxWidth: 200, marginRight: 20 }}>
              <InputLabel htmlFor="second-language-select-helper">
                Second language
              </InputLabel>
              <NativeSelect
                value={secondLanguage}
                onChange={(event, c, sc, scs) => {
                  handleFieldChange(event, setSecondLanguage);
                }}
                inputProps={{
                  name: "second-language",
                  id: "second-language-select-helper",
                }}
              >
                <option> </option>
                {languages.map((option) => (
                  <option key={option.alpha3} value={option.alpha3}>
                    {option["en"]}
                  </option>
                ))}
              </NativeSelect>
              <FormHelperText>
                The second language you use the most.
              </FormHelperText>
            </FormControl>
            <FormControl required style={{ maxWidth: 200, marginRight: 20 }}>
              <NativeSelect
                value={visFamiliarity}
                onChange={(event, c, sc, scs) => {
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
              label="Age"
              type="number"
              onChange={(event, c, sc, scs) => {
                handleFieldChange(event, setAge);
              }}
            />
            <label style={{ marginRight: 20 }}> </label>
            <TextField
              required
              label="Gender"
              onChange={(event, c, sc, scs) => {
                handleFieldChange(event, setGender);
              }}
            />
            <label style={{ marginLeft: 25 }}> </label>
            <TextField
              required
              label="Current Profession"
              onChange={(event, c, sc, scs) => {
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
              onClick={(e) => {
                dispatch(
                  setDemographic({
                    country: country,
                    firstLanguage: firstLanguage,
                    secondLanguage: secondLanguage,
                    visFamiliarity: visFamiliarity,
                    age: age,
                    gender: gender,
                    profession: profession,
                  })
                );
              }}
              disabled={disableSubmit}
            >
              {" "}
              Next{" "}
            </Button>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default Consent;
