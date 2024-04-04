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
import { AmountType } from "@the-discounters/types";

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

  return (
    <form>
      <FormControl
        variant="standard"
        required={false}
        error={props.error}
        sx={{ fontSize: "32px" }}
      >
        {questionText(
          props.amountEarlier,
          props.timeEarlier,
          props.amountLater,
          props.timeLater
        )}
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
                sx={{
                  mr: "100px",
                  border: 1,
                  backgroundColor: props.choice === key ? "lightblue" : "none",
                  borderRadius: "20px",
                  borderWidth: "1px",
                  borderColor: "black",
                  color: "black",
                  paddingRight: "10px",
                }}
                key={key}
                id={key}
                value={key}
                checked={props.choice === key}
                control={<Radio />}
                label={label}
                // className={
                //   classes[
                //     "btn" + (props.choice === key ? index + "Clicked" : index)
                //   ]
                // }
              />
            ))}
          </RadioGroup>
        </Box>
      </FormControl>
    </form>
  );
}

export default MELWordComponent;
