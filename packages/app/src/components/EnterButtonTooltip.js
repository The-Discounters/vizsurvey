import React from "react";
import { useTranslation } from "react-i18next";
import { AmountType } from "@the-discounters/types";
import { HTMLTooltip } from "./HTMLTooltip";
import { ReactComponent as EnterKey } from "../assets/enterKey.svg";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";

export const EnterButtonTooltip = (props) => {
  const { t } = useTranslation();
  return (
    <HTMLTooltip
      title={
        <React.Fragment>
          {props.choice === AmountType.earlierAmount ||
          props.choice === AmountType.laterAmount ? (
            <EnterKey />
          ) : (
            <React.Fragment>
              <LeftArrowKey /> <RightArrowKey />
            </React.Fragment>
          )}{" "}
          {props.choice === AmountType.earlierAmount ||
          props.choice === AmountType.laterAmount
            ? t("tooltipEnterSelectionInstructions", {
                choice:
                  props.choice === AmountType.earlierAmount
                    ? "earlier amount"
                    : "later amount",
              })
            : t("tooltipEnterNoSelectionInstructions")}
        </React.Fragment>
      }
    >
      <span>{props.children}</span>
    </HTMLTooltip>
  );
};
