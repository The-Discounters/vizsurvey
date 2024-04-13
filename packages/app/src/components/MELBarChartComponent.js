import React from "react";
import { FormControl, FormHelperText } from "@mui/material";
import { VegaLite } from "react-vega";
import { AmountType } from "@the-discounters/types";

export const MELBarChartComponent = (props) => {
  const data = Array.from(
    Array(props.showMinorTicks ? props.maxTime * 4 : props.maxTime + 1).keys()
  ).map((d) => {
    const isMajor = props.showMinorTicks ? d % 4 === 0 : true;
    const delay = props.showMinorTicks ? d / 4 : d;
    if (isMajor && delay === props.timeEarlier) {
      return {
        time: delay,
        amount: props.amountEarlier,
        strokeWidth: 1,
      };
    } else if (isMajor && delay === props.timeLater) {
      return {
        time: delay,
        amount: props.amountLater,
        strokeWidth: 1,
      };
    } else {
      return {
        time: delay,
        amount: 0,
        strokeWidth: 0,
      };
    }
  });

  const spec = {
    data: { values: data },
    width: props.horizontalPixels,
    height: props.verticalPixels,
    layer: [
      {
        mark: "bar",
        encoding: {
          x: {
            field: "time",
            type: "ordinal",
            axis: {
              title: "Months",
              labelAngle: 0,
              titleFontSize: 18,
              labelFontSize: 15,
            },
          },
          y: {
            field: "amount",
            type: "quantitative",
            scale: { domain: [0, props.maxAmount] },
            axis: {
              title: "Amount USD",
              format: "$,.0f",
              titleFontSize: 18,
              labelFontSize: 15,
              minExtent: 50,
            },
          },
          fill: { value: "white" },
          stroke: { value: "black" },
          strokeWidth: {
            condition: { test: "datum['amount'] > 0", value: 1 },
            value: 0,
          },
        },
      },
    ],
  };

  return (
    <FormControl variant="standard" required={false} error={props.error}>
      <FormHelperText>{props.helperText}</FormHelperText>
      <VegaLite spec={spec} />,
    </FormControl>
  );
};
