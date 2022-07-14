/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  Grid,
  TextField,
  Button,
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
  const [vizFamiliarity, setVizFamiliarity] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [selfDescribeGender, setSelfDescribeGender] = React.useState("");
  const [profession, setProfession] = React.useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (
      country &&
      country.length > 1 &&
      vizFamiliarity &&
      vizFamiliarity.length > 0 &&
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
    if (gender === "self-describe") {
      setDisableSelfDescribe(false);
    } else if (
      ["female", "male", "transgender", "non-binary", "intersex"].includes(
        gender
      )
    ) {
      setSelfDescribeGender("");
      setDisableSelfDescribe(true);
    }
  }, [
    disableSelfDescribe,
    country,
    vizFamiliarity,
    age,
    gender,
    selfDescribeGender,
    profession,
  ]);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
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

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5">
              <b>Demographic Data</b>
              <br />
            </Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
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
              <Typography>
                Before you proceed, please tell us about yourself by answering
                the questions below:{" "}
              </Typography>
            </div>
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
              <InputLabel htmlFor="country-select-helper">
                Dataviz experience
              </InputLabel>
              <NativeSelect
                value={vizFamiliarity}
                onChange={(event) => {
                  handleFieldChange(event, setVizFamiliarity);
                }}
                name="familiarity-with-viz"
                className={classes.selectEmpty}
                inputProps={{ "aria-label": "Datavis experience" }}
                helperText
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
                if (
                  event.target.value.length != 0 &&
                  +event.target.value <= 0
                ) {
                  event.target.value = age;
                } else {
                  handleFieldChange(event, setAge);
                }
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
                ].map(({ value, text }) => (
                  <option key={value} id={value} value={value}>
                    {text}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <TextField
              required
              value={selfDescribeGender}
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
                    vizFamiliarity: vizFamiliarity,
                    age: age,
                    gender: gender,
                    selfDescribeGender: selfDescribeGender,
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
