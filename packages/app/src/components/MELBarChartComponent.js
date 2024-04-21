import React from "react";
import ReactDOMServer from "react-dom/server";
import { FormControl, FormHelperText } from "@mui/material";
import { VegaLite } from "react-vega";
import vegaTooltipHandler from "vega-tooltip";
import { useTranslation } from "react-i18next";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useMount, useSetState } from "react-use";
import { AmountType } from "@the-discounters/types";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";

export const MELBarChartComponent = (props) => {
  const { t } = useTranslation();
  const [{ run, steps }, setState] = useSetState({
    run: props.showWizard,
    steps: [
      {
        content: <h2>Let's begin our journey!</h2>,
        locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
        placement: "center",
        target: "body",
      },
      {
        content: <h2>Sticky elements</h2>,
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 20,
        target: ".star-burst",
      },
      {
        content: "These are our super awesome projects!",
        placement: "bottom",
        styles: {
          options: {
            width: 300,
          },
        },
        target: ".demo__projects h2",
        title: "Our projects",
      },
      {
        content: (
          <div>
            You can render anything!
            <br />
            <h3>Like this H3 title</h3>
          </div>
        ),
        placement: "top",
        target: ".demo__how-it-works h2",
        title: "Our Mission",
      },
      {
        content: (
          <div>
            <h3>All about us</h3>
            <svg
              height="50px"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 96 96"
              width="50px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M83.2922435,72.3864207 C69.5357835,69.2103145 56.7313553,66.4262214 62.9315626,54.7138297 C81.812194,19.0646376 67.93573,0 48.0030634,0 C27.6743835,0 14.1459311,19.796662 33.0745641,54.7138297 C39.4627778,66.4942237 26.1743334,69.2783168 12.7138832,72.3864207 C0.421472164,75.2265157 -0.0385432192,81.3307198 0.0014581185,92.0030767 L0.0174586536,96.0032105 L95.9806678,96.0032105 L95.9966684,92.1270809 C96.04467,81.3747213 95.628656,75.2385161 83.2922435,72.3864207 Z"
                  fill="#000000"
                />
              </g>
            </svg>
          </div>
        ),
        placement: "left",
        target: ".demo__about h2",
      },
    ],
  });

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setState({ run: false });
    }
  };

  const data = Array.from(
    Array(props.showMinorTicks ? props.maxTime * 4 : props.maxTime + 1).keys()
  ).map((d) => {
    const isMajor = props.showMinorTicks ? d % 4 === 0 : true;
    const delay = props.showMinorTicks ? d / 4 : d;
    if (isMajor && delay === props.timeEarlier) {
      return {
        time: delay,
        amount: props.amountEarlier,
        chosen: props.choice === AmountType.earlierAmount,
        tooltipHTML: `${ReactDOMServer.renderToStaticMarkup(
          <LeftArrowKey />
        )} ${t("leftArrowTooltip")}`,
      };
    } else if (isMajor && delay === props.timeLater) {
      return {
        time: delay,
        amount: props.amountLater,
        chosen: props.choice === AmountType.laterAmount,
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
        scale: { domain: [0, props.maxAmount] },
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
      <FormHelperText>{props.helperText}</FormHelperText>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <VegaLite
        spec={spec}
        actions={false}
        tooltip={(vegaTooltipHandler, tooltipOptions)}
      />
    </FormControl>
  );
};
