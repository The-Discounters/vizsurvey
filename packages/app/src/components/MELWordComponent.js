import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { HTMLTooltip } from "./HTMLTooltip";
import { useTranslation } from "react-i18next";
import { format } from "d3";
import { AmountType } from "@the-discounters/types";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";

const todayText = (sooner_time) =>
  sooner_time === 0 ? "today" : `in ${sooner_time} months`;

export function MELQuestionText(
  amountEarlier,
  timeEarlier,
  amountLater,
  timeLater
) {
  return `Make a choice to receive ${MELQuestion1stPartText(
    amountEarlier,
    timeEarlier
  )} or ${MEQuestion2ndPartText(amountLater, timeLater)}.`;
}

export function MELQuestion1stPartText(amountEarlier, timeEarlier) {
  return `${format("$,.0f")(amountEarlier)} ${todayText(timeEarlier)}`;
}

export function MEQuestion2ndPartText(amountLater, timeLater) {
  return `${format("$,.0f")(amountLater)} in ${timeLater} months`;
}

export const MELWordComponent = (props) => {
  const { t } = useTranslation();

  return (
    <form>
      <FormControl variant="standard" required={false} error={props.error}>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50px"
        >
          <FormHelperText id="errorMessage" sx={{ fontSize: "22px" }}>
            {props.helperText}
          </FormHelperText>
        </Grid>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50px"
          sx={{ fontSize: "32px" }}
        >
          {MELQuestionText(
            props.amountEarlier,
            props.timeEarlier,
            props.amountLater,
            props.timeLater
          )}
        </Grid>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50px"
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
                key: `${AmountType.earlierAmount}`,
                label: MELQuestion1stPartText(
                  props.amountEarlier,
                  props.timeEarlier
                ),
              },
              {
                key: `${AmountType.laterAmount}`,
                label: MEQuestion2ndPartText(
                  props.amountLater,
                  props.timeLater
                ),
              },
            ].map(({ key, label }) => (
              <HTMLTooltip
                key={`tooltip-${key}`}
                title={
                  key === `${AmountType.earlierAmount}` ? (
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
                    cursor: "default",
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
        </Grid>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50px"
          sx={{ fontSize: "22px" }}
        >
          {props.instructionText}
        </Grid>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50px"
          sx={{ fontSize: "22px" }}
        >
          {props.choiceText()}
        </Grid>
        <Grid
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50px"
          sx={{ fontSize: "22px" }}
        >
          {props.changeChoiceText()}
        </Grid>
      </FormControl>
    </form>
  );
};

export default MELWordComponent;
