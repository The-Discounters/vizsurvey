import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  ThemeProvider,
  StyledEngineProvider,
  Container,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
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
  setHouseholdIncome,
  setSelfDescribeHouseholdIncome,
  setEducationLevel,
  setSelfDescribeEducationLevel,
  demographicShown,
  demographicCompleted,
  getStatus,
  getHouseholdIncome,
  getSelfDescribeHouseholdIncome,
  getEducationLevel,
  getSelfDescribeEducationLevel,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { styles, theme } from "./ScreenHelper.js";
import "../App.css";

const employmentOptionValues = [
  { value: "full-time", text: "Full Time" },
  { value: "part-time", text: "Part Time" },
  { value: "unemployed", text: "Unemployed" },
  { value: "retried", text: "Retired" },
  {
    value: "self-describe",
    text: "Prefer to Self-Describe",
  },
];

const genderOptionValues = [
  { value: "female", text: "Female" },
  { value: "male", text: "Male" },
  { value: "transgender", text: "Transgender" },
  { value: "non-binary", text: "Non-binary" },
  { value: "intersex", text: "Intersex" },
  {
    value: "self-describe",
    text: "Prefer to Self-Describe",
  },
];

const householdIncomeOptionValues = [
  { value: "less-than-10K", text: "Less than $10,000" },
  { value: "10K-less-than-16K", text: "$10,000 - $15,999" },
  { value: "16K-less-than-20K", text: "$16,000 - $19,999" },
  { value: "20K-less-than-30K", text: "$20,000 - $29,999" },
  { value: "30K-less-than-40K", text: "$30,000 - $39,999" },
  { value: "40K-less-than-50K", text: "$40,000 - $49,999" },
  { value: "50K-less-than-60K", text: "$50,000 - $59,999" },
  { value: "60K-less-than-70K", text: "$60,000 - $69,999" },
  { value: "70K-less-than-80K", text: "$70,000 - $79,999" },
  { value: "80K-less-than-90K", text: "$80,000 - $89,999" },
  {
    value: "90K-less-than-100K",
    text: "$90,000 - $99,999",
  },
  {
    value: "100K-less-than-150K",
    text: "$100,000 - $149,999",
  },
  {
    value: "more-than-150K",
    text: "More than $150,000",
  },
  {
    value: "self-describe",
    text: "Prefer to Self-Describe",
  },
];

const educationLevelOptionValues = [
  { value: "no-formal", text: "No formal qualifications" },
  { value: "secondary", text: "Secondary (e.g. GED/GCSE)" },
  { value: "high-school", text: "High school" },
  { value: "college-no-degree", text: "Some college, no degree" },
  { value: "associates", text: "Associates degree" },
  { value: "undergraduate", text: "Bachelor's degree" },
  { value: "graduate", text: "Master's degree" },
  { value: "doctorate", text: "Doctorate degree" },
  {
    value: "self-describe",
    text: "Prefer to Self-Describe",
  },
];

export function Consent() {
  const dispatch = useDispatch();

  const countryOfResidence = useSelector(getCountryOfResidence);
  const vizFamiliarity = useSelector(getVizFamiliarity);
  const [age, setAgeState] = useState(useSelector(getAge));
  const gender = useSelector(getGender);
  const [selfDescribeGender, setSelfDescribeGenderState] = useState(
    useSelector(getSelfDescribeGender)
  );
  const [disableSelfDescribeGender, setDisableSelfDescribe] =
    React.useState(true);
  const [profession, setProfessionState] = useState(useSelector(getProfession));
  const employment = useSelector(getEmployment);
  const [selfDescribeEmployment, setSelfDescribeEmploymentState] = useState(
    useSelector(getSelfDescribeEmployment)
  );
  const [disableSelfDescribeEmployment, setDisableSelfDescribeEmployment] =
    React.useState(true);
  const householdIncome = useSelector(getHouseholdIncome);
  const [selfDescribeHouseholdIncome, setSelfDescribeHouseholdIncomeState] =
    useState(useSelector(getSelfDescribeHouseholdIncome));
  const [
    disableSelfDescribeHouseholdIncome,
    setDisableSelfDescribeHouseholdIncome,
  ] = React.useState(true);
  const educationLevel = useSelector(getEducationLevel);
  const [selfDescribeEducationLevel, setSelfDescribeEducationLevelState] =
    useState(useSelector(getSelfDescribeEducationLevel));
  const [
    disableSelfDescribeEducationLevel,
    setDisableSelfDescribeEducationLevel,
  ] = React.useState(true);
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
    } else {
      setSelfDescribeGenderState("");
      setDisableSelfDescribe(true);
    }
    if (employment === "self-describe") {
      setDisableSelfDescribeEmployment(false);
    } else {
      setSelfDescribeEmploymentState("");
      setDisableSelfDescribeEmployment(true);
    }
    if (householdIncome === "self-describe") {
      setDisableSelfDescribeHouseholdIncome(false);
    } else {
      setSelfDescribeHouseholdIncomeState("");
      setDisableSelfDescribeHouseholdIncome(true);
    }
    if (householdIncome === "self-describe") {
      setDisableSelfDescribeHouseholdIncome(false);
    } else {
      setSelfDescribeHouseholdIncomeState("");
      setDisableSelfDescribeHouseholdIncome(true);
    }
    if (educationLevel === "self-describe") {
      setDisableSelfDescribeEducationLevel(false);
    } else {
      setSelfDescribeEducationLevelState("");
      setDisableSelfDescribeEducationLevel(true);
    }
  }, [
    gender,
    selfDescribeGender,
    employment,
    selfDescribeEmployment,
    householdIncome,
    educationLevel,
    selfDescribeEducationLevel,
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" disableGutters={false}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
          >
            <Grid xs={12}>
              <Typography variant="h4">Demographic Questions</Typography>
              <hr
                style={{
                  color: "#ea3433",
                  backgroundColor: "#ea3433",
                  height: 4,
                }}
              />
            </Grid>
            <Grid xs={12}>
              <Typography>
                Please tell us about yourself by answering the questions below.
                All data collected will be analyzed in aggregate form only and
                will not be used to identify you.{" "}
              </Typography>
            </Grid>
            <Grid xs={12}>
              <Grid
                container
                direction="row"
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid xs={3}>
                  <FormControl variant="standard">
                    <InputLabel htmlFor="country-select-helper">
                      Country of residence
                    </InputLabel>
                    <NativeSelect
                      inputProps={{
                        name: "country-of-origin",
                        id: "country-select-helper",
                      }}
                      value={countryOfResidence}
                      onChange={(event) => {
                        dispatch(setCountryOfResidence(event.target.value));
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
                <Grid xs={3}>
                  <FormControl variant="standard">
                    <InputLabel htmlFor="familiarity-with-viz">
                      Dataviz experience
                    </InputLabel>
                    <NativeSelect
                      inputProps={{
                        id: "familiarity-with-viz",
                      }}
                      value={vizFamiliarity}
                      onChange={(event) => {
                        dispatch(setVizFamiliarity(event.target.value));
                      }}
                      name="familiarity-with-viz"
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
                <Grid xs={3}>
                  <TextField
                    id="age"
                    variant="standard"
                    label="Age"
                    type="number"
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
                    }}
                  />
                </Grid>
                <Grid xs={3}>
                  <TextField
                    id="current-profession"
                    variant="standard"
                    value={profession}
                    onBlur={(event) => {
                      dispatch(setProfession(event.target.value));
                    }}
                    onChange={(event) => {
                      setProfessionState(event.target.value);
                    }}
                    label="Current Profession"
                  />
                </Grid>
                <Grid xs={3}>
                  <FormControl variant="standard">
                    <InputLabel htmlFor="gender-select-helper">
                      Gender
                    </InputLabel>
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
                      {genderOptionValues.map(({ value, text }) => (
                        <option key={value} id={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </NativeSelect>
                    <FormHelperText>Your gender</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid xs={3}>
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
                    id="self-describe-gender"
                    disabled={disableSelfDescribeGender}
                  />
                </Grid>
                <Grid xs={3}>
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
                      {employmentOptionValues.map(({ value, text }) => (
                        <option key={value} id={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </NativeSelect>
                    <FormHelperText>Your current employment</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid xs={3}>
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
                    disabled={disableSelfDescribeEmployment}
                  />
                </Grid>
                <Grid xs={3}>
                  <FormControl variant="standard">
                    <InputLabel htmlFor="household-income-select-helper">
                      Household Income
                    </InputLabel>
                    <NativeSelect
                      value={householdIncome}
                      onChange={(event) => {
                        dispatch(setHouseholdIncome(event.target.value));
                      }}
                      inputProps={{
                        name: "household-income",
                        id: "household-income-select-helper",
                      }}
                    >
                      <option> </option>
                      {householdIncomeOptionValues.map(({ value, text }) => (
                        <option key={value} id={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Grid>
                <Grid xs={3}>
                  <TextField
                    variant="standard"
                    value={selfDescribeHouseholdIncome}
                    onBlur={(event) => {
                      dispatch(
                        setSelfDescribeHouseholdIncome(event.target.value)
                      );
                    }}
                    onChange={(event) => {
                      setSelfDescribeHouseholdIncomeState(event.target.value);
                    }}
                    label="Describe Household Income"
                    id="self-describe-household-income"
                    disabled={disableSelfDescribeHouseholdIncome}
                  />
                </Grid>
                <Grid xs={3}>
                  <FormControl variant="standard">
                    <InputLabel htmlFor="education-level-select-helper">
                      Formal Education Level
                    </InputLabel>
                    <NativeSelect
                      value={educationLevel}
                      onChange={(event) => {
                        dispatch(setEducationLevel(event.target.value));
                      }}
                      inputProps={{
                        name: "education-level",
                        id: "education-level-select-helper",
                      }}
                    >
                      <option> </option>
                      {educationLevelOptionValues.map(({ value, text }) => (
                        <option key={value} id={value} value={value}>
                          {text}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Grid>
                <Grid xs={3}>
                  <TextField
                    variant="standard"
                    value={selfDescribeEducationLevel}
                    onBlur={(event) => {
                      dispatch(
                        setSelfDescribeEducationLevel(event.target.value)
                      );
                    }}
                    onChange={(event) => {
                      setSelfDescribeEducationLevelState(event.target.value);
                    }}
                    label="Highest Education Level Obtained"
                    id="self-describe-education-level"
                    disabled={disableSelfDescribeEducationLevel}
                  />
                </Grid>
              </Grid>
              <Grid xs={12}>
                <hr
                  style={{
                    backgroundColor: "#aaaaaa",
                    height: 4,
                  }}
                />
              </Grid>
              <Grid align="center" xs={12}>
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
        </Container>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Consent;
