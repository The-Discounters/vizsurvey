import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Typography,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import { useSelector, useDispatch } from "react-redux";
import { navigateFromStatus } from "./Navigate.js";
import * as countries from "./countries.json";
import {
  getCountryOfResidence,
  getVizFamiliarity,
  getAge,
  getGender,
  getSelfDescribeGender,
  getProfession,
  getEmployment,
  getSelfDescribeEmployment,
  setCountryOfResidence,
  setVizFamiliarity,
  setAge,
  setGender,
  setSelfDescribeGender,
  setProfession,
  setEmployment,
  setSelfDescribeEmployment,
  demographicShown,
  demographicCompleted,
  getStatus,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { styles, theme } from "./ScreenHelper.js";
import "../App.css";

export function Consent() {
  const dispatch = useDispatch();
  const [disableSelfDescribe, setDisableSelfDescribe] = React.useState(true);
  const [disableSelfDescribeEmployment, setDisableSelfDescribeEmployment] =
    React.useState(true);

  const countryOfResidence = useSelector(getCountryOfResidence);
  const vizFamiliarity = useSelector(getVizFamiliarity);
  const [age, setAgeState] = useState(useSelector(getAge));
  const gender = useSelector(getGender);
  const [selfDescribeGender, setSelfDescribeGenderState] = useState(
    useSelector(getSelfDescribeGender)
  );
  const [profession, setProfessionState] = useState(useSelector(getProfession));
  const employment = useSelector(getEmployment);
  const [selfDescribeEmployment, setSelfDescribeEmploymentState] = useState(
    useSelector(getSelfDescribeEmployment)
  );
  const status = useSelector(getStatus);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(demographicShown(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = navigateFromStatus(status);
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (gender === "self-describe") {
      setDisableSelfDescribe(false);
    } else if (
      [
        "female",
        "male",
        "transgender",
        "non-binary",
        "intersex",
        "refuse-answer",
      ].includes(gender)
    ) {
      setSelfDescribeGenderState("");
      setDisableSelfDescribe(true);
    }
    if (employment === "self-describe") {
      setDisableSelfDescribeEmployment(false);
    } else if (
      ["full-time", "part-time", "unemployed", "prefer-not-to-say"].includes(
        employment
      )
    ) {
      setSelfDescribeEmploymentState("");
      setDisableSelfDescribeEmployment(true);
    }
  }, [gender, selfDescribeGender, employment, selfDescribeEmployment]);

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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            <Typography variant="h5">
              <b>Demographic Questions</b>
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
            <Typography>
              Please tell us about yourself by answering the questions below.
              All data collected will be analyzed in aggregate form only and
              will not be used to identify you.{" "}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={3}>
                <FormControl variant="standard">
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
                  <FormHelperText>
                    The country you are living in now
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="standard">
                  <InputLabel htmlFor="familiarity-with-viz">
                    Dataviz experience
                  </InputLabel>
                  <NativeSelect
                    value={vizFamiliarity}
                    onChange={(event) => {
                      dispatch(setVizFamiliarity(event.target.value));
                    }}
                    name="familiarity-with-viz"
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
              <Grid item xs={3}>
                <TextField
                  variant="standard"
                  label="Age"
                  type="number"
                  id="Age"
                  value={age}
                  onBlur={(event) => {
                    if (
                      event.target.value.length !== 0 &&
                      +event.target.value <= 0
                    ) {
                      event.target.value = age;
                    } else {
                      dispatch(setAge(event.target.value));
                    }
                  }}
                  onChange={(event) => {
                    if (
                      event.target.value.length !== 0 &&
                      +event.target.value <= 0
                    ) {
                      event.target.value = age;
                    } else {
                      setAgeState(event.target.value);
                    }
                  }} />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  variant="standard"
                  value={profession}
                  onBlur={(event) => {
                    dispatch(setProfession(event.target.value));
                  }}
                  onChange={(event) => {
                    setProfessionState(event.target.value);
                  }}
                  label="Current Profession"
                  id="Current-Profession" />
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="standard">
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
                      {
                        value: "self-describe",
                        text: "Prefer to Self-Describe",
                      },
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
                  variant="standard"
                  value={selfDescribeGender}
                  onChange={(event) => {
                    setSelfDescribeGenderState(event.target.value);
                  }}
                  onBlur={(event) => {
                    dispatch(setSelfDescribeGender(event.target.value));
                  }}
                  label="Self Describe Gender"
                  id="Self-Describe-Gender"
                  disabled={disableSelfDescribe} />
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="standard">
                  <InputLabel htmlFor="employment-select-helper">
                    Current Employment
                  </InputLabel>
                  <NativeSelect
                    value={employment}
                    onChange={(event) => {
                      dispatch(setEmployment(event.target.value));
                    }}
                    inputProps={{
                      name: "employment",
                      id: "employment-select-helper",
                    }}
                  >
                    <option> </option>
                    {[
                      { value: "full-time", text: "Full Time" },
                      { value: "part-time", text: "Part Time" },
                      { value: "unemployed", text: "Unemployed" },
                      { value: "retried", text: "Retired" },
                      {
                        value: "self-describe",
                        text: "Prefer to Self-Describe",
                      },
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
                  variant="standard"
                  value={selfDescribeEmployment}
                  onBlur={(event) => {
                    dispatch(setSelfDescribeEmployment(event.target.value));
                  }}
                  onChange={(event) => {
                    setSelfDescribeEmploymentState(event.target.value);
                  }}
                  label="Describe Employment"
                  id="self-describe-employment"
                  disabled={disableSelfDescribeEmployment} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <hr
                style={{
                  backgroundColor: "#aaaaaa",
                  height: 4,
                }}
              />
            </Grid>
            <Grid item align="center" xs={12}>
              <Button
                variant="contained"
                color="secondary"
                disableRipple
                disableFocusRipple
                style={styles.button}
                onClick={() => {
                  dispatch(demographicCompleted(dateToState(DateTime.now())));
                }}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Consent;
