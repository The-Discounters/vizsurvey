import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";
import { format } from "d3";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AmountType } from "../features/AmountType.js";
import { formControl } from "./ScreenHelper.js";

export function MELSelectionForm(props) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daySuffix = [
    "SHOULD NOT BE SEEN",
    "st", // 1st
    "nd",
    "rd",
    "th", // 4th
    "th",
    "th",
    "th",
    "th",
    "th",
    "th", // 10th
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "st", // 21st
    "nd",
    "rd",
    "th", // 24th
    "th",
    "th",
    "th",
    "th",
    "th",
    "th", // 30th
    "st", // 31st
  ];
  const todayText = function (sooner_time) {
    const date = new Date(sooner_time);
    //return sooner_time === 0 ? "today" : `in ${sooner_time} months`;
    const monthNumber = date.getMonth();
    const dayNumber = date.getDate();
    const yearNumber = date.getFullYear();
    return (
      "on " +
      monthNames[monthNumber] +
      " " +
      dayNumber +
      daySuffix[dayNumber] +
      ", " +
      yearNumber
    );
  };

  function questionText(amountEarlier, timeEarlier, amountLater, timeLater) {
    return `Make a choice to receive ${question1stPartText(
      amountEarlier,
      timeEarlier
    )} or ${question2ndPartText(amountLater, timeLater)}.`;
  }

  function question1stPartText(amountEarlier, timeEarlier) {
    return `${format("$,.0f")(amountEarlier)} ${todayText(timeEarlier)}`;
  }

  function question2ndPartText(amountLater, timeLater) {
    return `${format("$,.0f")(amountLater)} ${todayText(timeLater)}`;
    //return `${format("$,.0f")(amountLater)} in ${timeLater} months`;
  }

  let useStyles;

  function resetUseStyles() {
    let part = ["btn0", "btn1"].reduce((result, key) => {
      result[key] = {
        backgroundColor: "steelblue",
        "border-radius": "20px",
        "border-width": "5px",
        borderColor: "#ffffff",
        color: "black",
        paddingRight: "10px",
        "&:hover": {
          backgroundColor: "lightblue",
        },
      };
      return result;
    }, {});

    let part1 = ["btn0Clicked", "btn1Clicked"].reduce((result, key) => {
      result[key] = {
        backgroundColor: "lightblue",
        "border-radius": "20px",
        "border-width": "5px",
        borderColor: "#000000",
        color: "black",
        paddingRight: "10px",
        "&:hover": {
          backgroundColor: "lightblue",
        },
      };
      return result;
    }, {});

    useStyles = makeStyles(() => ({
      btn0: part.btn0,
      btn1: part.btn1,
      btn0Clicked: part1.btn0Clicked,
      btn1Clicked: part1.btn1Clicked,
      qArea: {
        "border-width": "5px",
        "border-radius": "20px",
        padding: "10px",
        borderColor: "#000000",
      },
      qTitle: {
        fontSize: "32px",
      },
    }));
    7;
  }

  resetUseStyles();

  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <form className={classes.qArea}>
        <FormControl
          sx={{ ...formControl }}
          required={false}
          error={props.error}
        >
          <p className={classes.qTitle}>
            {questionText(
              props.amountEarlier,
              props.dateEarlier,
              props.amountLater,
              props.dateLater
            )}
          </p>
          <FormHelperText>{props.helperText}</FormHelperText>
          <Box
            component="span"
            sx={{ width: 1 }}
            m={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            border="1"
          >
            <RadioGroup
              row
              aria-labelledby={
                props.textShort + "-row-radio-buttons-group-label"
              }
              name={"question-radio-buttons-group"}
              onChange={(event) => {
                props.onClickCallback(event.target.value);
              }}
              value={props.choice}
            >
              {[
                {
                  key: AmountType.earlierAmount,
                  label: question1stPartText(
                    props.amountEarlier,
                    props.dateEarlier
                  ),
                },
                {
                  key: AmountType.laterAmount,
                  label: question2ndPartText(
                    props.amountLater,
                    props.dateLater
                  ),
                },
              ].map(({ key, label }, index) => (
                <FormControlLabel
                  sx={{ mr: "100px" }}
                  key={key}
                  id={key}
                  value={key}
                  checked={props.choice === key}
                  control={<Radio />}
                  label={label}
                  className={
                    classes[
                      "btn" + (props.choice === key ? index + "Clicked" : index)
                    ]
                  }
                />
              ))}
            </RadioGroup>
          </Box>
        </FormControl>
      </form>
    </Grid>
  );
}

export default MELSelectionForm;
