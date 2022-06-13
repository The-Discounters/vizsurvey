import React, { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DateTime } from "luxon";
import { FileIOAdapter } from "../features/FileIOAdapter";
import {
  Grid,
  Button,
  Typography,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  getParticipant,
  postSurveyQuestionsShown,
  selectAllQuestions,
  writeAnswers,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";

const styles = {
  root: { flexGrow: 1, margin: 0 },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

export function PostSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handle = useFullScreenHandle();

  useEffect(async () => {
    dispatch(postSurveyQuestionsShown(dateToState(DateTime.utc())));
    if (process.env.REACT_APP_FULLSCREEN === "enabled") handle.exit();
  }, []);

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [q15vs30, setQ15vs30] = React.useState("");
  const [q50k6p, setQ50k6p] = React.useState("");
  const [q100k5p, setQ100k5p] = React.useState("");
  const [q200k5p, setQ200k5p] = React.useState("");

  const checkEnableSubmit = () => {
    if (
      q15vs30.length > 0 &&
      q50k6p.length > 0 &&
      q100k5p.length > 0 &&
      q200k5p.length > 0
    ) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  };

  useEffect(async () => {
    checkEnableSubmit();
  }, [q15vs30, q50k6p, q100k5p, q200k5p]);

  const handleFieldChange = (event, setter) => {
    setter(event.target.value);
  };

  const participantId = useSelector(getParticipant);
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  return (
    <div>
      <FullScreen handle={handle}>
        <Grid container style={styles.root} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4">Questionaire</Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
            <Typography paragraph>
              The last step in this survey is to answer the questions below.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl} required>
              <FormLabel id="15vs30">
                Suppose a 15 year mortgage and a 30 year mortgage have the same
                Annual Percentage Rate and the same amount borrowed. The total
                amount repaid will be:
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="15vs30-row-radio-buttons-group-label"
                name="15vs30-radio-buttons-group"
              >
                <FormControlLabel
                  value="15+"
                  checked={q15vs30 === "15+"}
                  control={<Radio />}
                  label="Higher for the 15 year mortgage"
                  onChange={(event) => {
                    handleFieldChange(event, setQ15vs30);
                  }}
                />
                <FormControlLabel
                  value="30+"
                  checked={q15vs30 === "30+"}
                  control={<Radio />}
                  label="Higher for the 30 year mortgage"
                  onChange={(event) => {
                    handleFieldChange(event, setQ15vs30);
                  }}
                />
                <FormControlLabel
                  value="15=30"
                  checked={q15vs30 === "5=30"}
                  control={<Radio />}
                  label="The total amount repaid will be the same"
                  onChange={(event) => {
                    handleFieldChange(event, setQ15vs30);
                  }}
                />
              </RadioGroup>
            </FormControl>
            <FormControl className={classes.formControl} required>
              <FormLabel id="50k6p">
                Suppose you owe $50,000 on a mortgage at an Annual Percentage
                Rate of 6%. If you didn’t make any payments on this mortgage how
                much would you owe in total after one year?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="50k6p-row-radio-buttons-group-label"
                name="50k6p-radio-buttons-group"
              >
                <FormControlLabel
                  value="<50k"
                  checked={q50k6p === "<50k"}
                  control={<Radio />}
                  label="Less than $50,000"
                  onChange={(event) => {
                    handleFieldChange(event, setQ50k6p);
                  }}
                />
                <FormControlLabel
                  value="50kto55k"
                  checked={q50k6p === "50kto55k"}
                  control={<Radio />}
                  label="$50,000 – $54,999"
                  onChange={(event) => {
                    handleFieldChange(event, setQ50k6p);
                  }}
                />
                <FormControlLabel
                  value="55kto60k"
                  checked={q50k6p === "55kto60k"}
                  control={<Radio />}
                  label="$55,000 – $59,999"
                  onChange={(event) => {
                    handleFieldChange(event, setQ50k6p);
                  }}
                />
                <FormControlLabel
                  value="60kto65k"
                  checked={q50k6p.value === "60kto65k"}
                  control={<Radio />}
                  label="$60,000 – $64,999"
                  onChange={(event) => {
                    handleFieldChange(event, setQ50k6p);
                  }}
                />
                <FormControlLabel
                  value="65k+"
                  checked={q50k6p === "65k+"}
                  control={<Radio />}
                  label="More than $65,000"
                  onChange={(event) => {
                    handleFieldChange(event, setQ50k6p);
                  }}
                />
              </RadioGroup>
            </FormControl>
            <FormControl className={classes.formControl} required>
              <FormLabel id="100k5p">
                Suppose you owe $100,000 on a mortgage at an Annual Percentage
                Rate of 5%. If you didn’t make any payments on this mortgage how
                much would you owe in total after five years?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="100k5p-row-radio-buttons-group-label"
                name="100k5p-radio-buttons-group"
              >
                <FormControlLabel
                  value="<120k"
                  checked={q100k5p === "<120k"}
                  control={<Radio />}
                  label="Less than $120,000"
                  onChange={(event) => {
                    handleFieldChange(event, setQ100k5p);
                  }}
                />
                <FormControlLabel
                  value="120kto125k"
                  checked={q100k5p === "120kto125k"}
                  control={<Radio />}
                  label="Between $120,000 and $125,000"
                  onChange={(event) => {
                    handleFieldChange(event, setQ100k5p);
                  }}
                />
                <FormControlLabel
                  value="125k+"
                  checked={q100k5p === "125k+"}
                  control={<Radio />}
                  label="More than $125,000"
                  onChange={(event) => {
                    handleFieldChange(event, setQ100k5p);
                  }}
                />
              </RadioGroup>
            </FormControl>
            <FormControl className={classes.formControl} required>
              <FormLabel id="200k5p">
                Suppose you owe $200,000 on a mortgage with at an Annual
                Percentage Rate of 5%. If you made annual payments of $10,000
                per year how long would it take to repay the whole mortgage?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="15vs30-radio-buttons-group"
              >
                <FormControlLabel
                  value="<20y"
                  checked={q200k5p === "<20y"}
                  control={<Radio />}
                  label="Less than 20 years"
                  onChange={(event) => {
                    handleFieldChange(event, setQ200k5p);
                  }}
                />
                <FormControlLabel
                  value="20yto30y"
                  checked={q200k5p === "20yto30y"}
                  control={<Radio />}
                  label="Between 20 and 30 years"
                  onChange={(event) => {
                    handleFieldChange(event, setQ200k5p);
                  }}
                />
                <FormControlLabel
                  value="30yto40y"
                  checked={q200k5p === "30yto40y"}
                  control={<Radio />}
                  label="Between 30 and 40 years"
                  onChange={(event) => {
                    handleFieldChange(event, setQ200k5p);
                  }}
                />
                <FormControlLabel
                  value="never"
                  checked={q200k5p === "never"}
                  control={<Radio />}
                  label="The mortgage would never be repaid"
                  onChange={(event) => {
                    handleFieldChange(event, setQ200k5p);
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ margin: 0 }}>
            <Button
              variant="contained"
              color="secondary"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                handle.enter();
                setTimeout(() => {
                  handle.exit();
                  dispatch(
                    writeAnswers({
                      csv: csv,
                      participantId: participantId,
                      postSurveyAnswers: {
                        q15vs30: q15vs30,
                        q50k6p: q50k6p,
                        q100k5p: q100k5p,
                        q200k5p: q200k5p,
                      },
                    })
                  );
                  navigate("/thankyou");
                }, 400);
              }}
              disabled={disableSubmit}
            >
              {" "}
              Next{" "}
            </Button>
          </Grid>
        </Grid>
      </FullScreen>
    </div>
  );
}

export default PostSurvey;
