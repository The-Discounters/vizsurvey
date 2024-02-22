import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";
import { format } from "d3";
import { makeStyles } from "@material-ui/core/styles";
import { AmountType } from "@the-discounters/types";
import { formControl } from "./ScreenHelper.js";

export function MELWordComponent(props) {
  const todayText = (sooner_time) =>
    sooner_time === 0 ? "today" : `in ${sooner_time} months`;

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
    return `${format("$,.0f")(amountLater)} in ${timeLater} months`;
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
        // "&:hover": {
        //   backgroundColor: "lightblue",
        // },
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
        // "&:hover": {
        //   backgroundColor: "lightblue",
        // },
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
  }

  resetUseStyles();
  const classes = useStyles();

  return (
    <form className={classes.qArea}>
      <FormControl sx={{ ...formControl }} required={false} error={props.error}>
        <p className={classes.qTitle}>
          {questionText(
            props.amountEarlier,
            props.timeEarlier,
            props.amountLater,
            props.timeLater
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
            aria-labelledby={props.textShort + "-row-radio-buttons-group-label"}
            name={"question-radio-buttons-group"}
            onClick={(event) => {
              props.onClickCallback(event.target.value);
            }}
            value={props.choice}
          >
            {[
              {
                key: AmountType.earlierAmount,
                label: question1stPartText(
                  props.amountEarlier,
                  props.timeEarlier
                ),
              },
              {
                key: AmountType.laterAmount,
                label: question2ndPartText(props.amountLater, props.timeLater),
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
  );
}

export default MELWordComponent;
