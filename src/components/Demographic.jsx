import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
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
import { useSelector, useDispatch } from "react-redux";
import { navigateFromStatus } from "./Navigate";
import * as countries from "./countries.json";
import {
  getCountryOfResidence,
  getVizFamiliarity,
  getAge,
  getGender,
  getSelfDescribeGender,
  getProfession,
  setCountryOfResidence,
  setVizFamiliarity,
  setAge,
  setGender,
  setSelfDescribeGender,
  setProfession,
  nextQuestion,
  getStatus,
} from "../features/questionSlice";
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
  const classes = useStyles();
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [disableSelfDescribe, setDisableSelfDescribe] = React.useState(true);

  const countryOfResidence = useSelector(getCountryOfResidence);
  const vizFamiliarity = useSelector(getVizFamiliarity);
  const age = useSelector(getAge);
  const gender = useSelector(getGender);
  const selfDescribeGender = useSelector(getSelfDescribeGender);
  const profession = useSelector(getProfession);
  const status = useSelector(getStatus);

  const navigate = useNavigate();

  useEffect(() => {}, []);

  useMemo(() => {
    navigateFromStatus(navigate, status);
  }, [status]);

  useEffect(() => {
    if (
      countryOfResidence &&
      countryOfResidence.length > 1 &&
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
    countryOfResidence,
    vizFamiliarity,
    age,
    gender,
    selfDescribeGender,
    profession,
  ]);

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
          </Grid>
          <Grid item xs={12}>
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
              <Typography paragraph>
                <b>
                  This survey is not designed to render on a mobile device and
                  should be taken on a laptop or desktop computer.
                </b>
              </Typography>
              <Typography>
                Before you proceed, please tell us about yourself by answering
                the questions below:{" "}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={3}>
            <FormControl
              className={classes.formControl}
              required
              style={{ maxWidth: 230, marginRight: 20 }}
            >
              <InputLabel htmlFor="country-select-helper">
                Country of residence
              </InputLabel>
              <NativeSelect
                value={countryOfResidence}
                onChange={(event) => {
                  dispatch(setCountryOfResidence(event.target.value));
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
          </Grid>
          <Grid item xs={3}>
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
                  dispatch(setVizFamiliarity(event.target.value));
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
          <Grid item xs={3}></Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}>
            <TextField
              required
              className={classes.formControl}
              label="Age"
              type="number"
              id="Age"
              value={age}
              onChange={(event) => {
                if (
                  event.target.value.length != 0 &&
                  +event.target.value <= 0
                ) {
                  event.target.value = age;
                } else {
                  dispatch(setAge(event.target.value));
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
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
                  dispatch(setGender(event.target.value));
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
          </Grid>
          <Grid item xs={3}>
            <TextField
              required
              value={selfDescribeGender}
              onChange={(event) => {
                dispatch(setSelfDescribeGender(event.target.value));
              }}
              className={classes.formControl}
              label="Self Describe Gender"
              id="Self-Describe-Gender"
              disabled={disableSelfDescribe}
            />
            <label style={{ marginLeft: 25 }}> </label>
          </Grid>
          <Grid item xs={3}>
            <TextField
              required
              value={profession}
              onChange={(event) => {
                dispatch(setProfession(event.target.value));
              }}
              className={classes.formControl}
              label="Current Profession"
              id="Current-Profession"
            />
          </Grid>
          <Grid item xs={12}>
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="secondary"
                disableRipple
                disableFocusRipple
                style={styles.button}
                onClick={() => {
                  dispatch(nextQuestion());
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
