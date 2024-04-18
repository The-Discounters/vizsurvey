import React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useTranslation } from "react-i18next";
import { AmountType } from "@the-discounters/types";
import { ReactComponent as EnterKey } from "../assets/enterKey.svg";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";

const HTMLTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    maxWidth: 300,
  },
}));

export const EnterButtonTooltip = (props) => {
  const { t } = useTranslation();
  return (
    <HTMLTooltip
      title={
        <React.Fragment>
          <Grid container spacing={2}>
            <Grid item xs="auto">
              {props.choice === AmountType.earlierAmount ||
              props.choice === AmountType.laterAmount ? (
                <EnterKey />
              ) : (
                <React.Fragment>
                  <LeftArrowKey /> <RightArrowKey />
                </React.Fragment>
              )}
            </Grid>
            <Grid item xs={6}>
              {props.choice === AmountType.earlierAmount ||
              props.choice === AmountType.laterAmount
                ? t("tooltipEnterSelectionInstructions", {
                    choice:
                      props.choice === AmountType.earlierAmount
                        ? "earlier amount"
                        : "later amount",
                  })
                : t("tooltipEnterNoSelectionInstructions")}
            </Grid>
          </Grid>
        </React.Fragment>
      }
    >
      <span>{props.children}</span>
    </HTMLTooltip>
  );
};
