import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Box,
} from "@mui/material";
import { HTMLTooltip } from "./HTMLTooltip";
import { useTranslation } from "react-i18next";
import { format } from "d3";
import { AmountType } from "@the-discounters/types";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";

export const MELWordComponent = (props) => {
  const { t } = useTranslation();

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
                key: `tooltip-${AmountType.earlierAmount}`,
                label: question1stPartText(
                  props.amountEarlier,
                  props.timeEarlier
                ),
              },
              {
                key: `tooltip-${AmountType.laterAmount}`,
                label: question2ndPartText(props.amountLater, props.timeLater),
              },
            ].map(({ key, label }, index) => (
              <HTMLTooltip
                title={
                  key === `tooltip-${AmountType.earlierAmount}` ? (
                    <React.Fragment>
                      <LeftArrowKey /> {t("leftArrowTooltip")}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <RightArrowKey /> {t("rightArrowTooltip")}
                    </React.Fragment>
                  )
                }
              >
                <FormControlLabel
                  sx={{
                    mr: "100px",
                    border: 1,
                    backgroundColor:
                      props.choice === key ? "lightblue" : "none",
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
                />
              </HTMLTooltip>
            ))}
          </RadioGroup>
        </Box>
      </FormControl>
    </form>
  );
};

export default MELWordComponent;
