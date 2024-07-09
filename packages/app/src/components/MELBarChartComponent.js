import React from "react";
import ReactDOMServer from "react-dom/server";
import { FormControl, FormHelperText, Box } from "@mui/material";
import { VegaLite } from "react-vega";
import vegaTooltipHandler from "vega-tooltip";
import { useTranslation } from "react-i18next";
import { AmountType } from "@the-discounters/types";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";

export const MELBarChartComponent = (props) => {
  const { t } = useTranslation();

  const data = Array.from(Array(props.maxTime + 1).keys()).map((d) => {
    const delay = d;
    if (delay === props.timeEarlier) {
      return {
        time: delay,
        amount: props.amountEarlier,
        chosen: props.choice === AmountType.earlierAmount,
        barType: AmountType.earlierAmount,
        tooltipHTML: `${ReactDOMServer.renderToStaticMarkup(
          <LeftArrowKey />
        )} ${t("leftArrowTooltip")}`,
      };
    } else if (delay === props.timeLater) {
      return {
        time: delay,
        amount: props.amountLater,
        chosen: props.choice === AmountType.laterAmount,
        barType: AmountType.laterAmount,
        tooltipHTML: `
          ${ReactDOMServer.renderToStaticMarkup(<RightArrowKey />)} ${t(
          "rightArrowTooltip"
        )}`,
      };
    } else {
      return {
        time: delay,
        amount: 0,
        chosen: false,
        barType: AmountType.none,
        tooltipHTML: null,
      };
    }
  });

  /**
   * Helfull links
   * https://github.com/vega/vega-tooltip/blob/main/docs/customizing_your_tooltip.md
   * https://vega.github.io/vega-lite/docs/tooltip.html
   * https://observablehq.com/@amitkaps/custom-tooltip
   */
  var tooltipOptions = {
    formatTooltip: (value, sanitize) => {
      return value.tooltipHTML;
    },
    theme: "custom",
  };

  const spec = {
    data: { values: data },
    signals: [
      {
        name: "click",
        value: {},
        on: [{ events: "*:mousedown", update: "datum" }],
      },
    ],
    width: props.horizontalPixels,
    height: props.verticalPixels,
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
        scale: { domain: [0, props.maxAmount], nice: true },
        axis: {
          title: "Amount USD",
          format: "$,.0f",
          titleFontSize: 18,
          labelFontSize: 15,
          minExtent: 50,
        },
      },
    },
    layer: [
      {
        mark: {
          type: "bar",
          name: "bars",
        },
        encoding: {
          fill: {
            condition: { test: "datum.chosen", value: "lightblue" },
            value: "white",
          },
          stroke: { value: "black" },
          strokeWidth: {
            condition: { test: "datum.amount > 0", value: 1 },
            value: 0,
          },
          tooltip: [{ field: "tooltipHTML", type: "nominal" }],
          id: { value: "datum.barType" },
        },
      },
      {
        mark: {
          type: "text",
          align: "center",
          baseline: "bottom",
          dx: 0,
          dy: -10,
          fontSize: 15,
        },
        encoding: {
          text: {
            condition: {
              test: "datum.amount > 0",
              value: { expr: "'$' + datum.amount" },
            },
            value: "",
          },
        },
      },
    ],
  };

  return (
    <FormControl variant="standard" required={false} error={props.error}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <FormHelperText id="errorMessage" sx={{ fontSize: "22px" }}>
          {props.helperText}
        </FormHelperText>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="22px"
        sx={{ fontSize: "22px" }}
      >
        {t("MELChoicePrompt")}
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" p="1em">
        <VegaLite
          renderer={"svg"}
          spec={spec}
          patch={(spec) => {
            // usefull links
            // https://stackoverflow.com/questions/57707494/whats-the-proper-way-to-implement-a-custom-click-handler-in-vega-lite
            // https://codepen.io/stephenshank/pen/XWJpPxo
            spec.signals = {
              name: "barClick",
              value: 0,
              on: [{ events: "rect:mousedown", update: "datum" }],
            };
            return spec;
          }}
          onNewView={(view) =>
            view.addSignalListener("barClick", (n, v) => {
              props.onClickCallback(v.barType);
            })
          }
          actions={false}
          tooltip={(vegaTooltipHandler, tooltipOptions)}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ fontSize: "22px" }}
        height="22px"
        p="1em"
      >
        {props.instructionText}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ fontSize: "22px" }}
        height="22px"
      >
        {props.changeChoiceText()}
      </Box>
    </FormControl>
  );
};
