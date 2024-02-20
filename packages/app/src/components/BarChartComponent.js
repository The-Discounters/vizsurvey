import React from "react";
import { FormControl, FormHelperText } from "@mui/material";
import { useD3 } from "../hooks/useD3.js";
import {
  axisBottom,
  axisLeft,
  scaleLinear,
  range,
  format,
  drag,
  select,
} from "d3";
import { InteractionType } from "@the-discounters/types";
import { AmountType } from "@the-discounters/types";
import { calcScreenValues } from "./ScreenHelper.js";

const drawBarChart = ({
  svg,
  maxTime,
  maxAmount,
  interaction,
  variableAmount,
  amountEarlier,
  timeEarlier,
  amountLater,
  timeLater,
  choice,
  horizontalPixels,
  verticalPixels,
  leftMarginWidthIn,
  graphWidthIn,
  bottomMarginHeightIn,
  graphHeightIn,
  showMinorTicks,
  onClickCallback,
}) => {
  const {
    totalUCWidth,
    totalUCHeight,
    leftOffSetUC,
    bottomOffSetUC,
    barAreaWidthUC,
    barAreaHeightUC,
    barWidth,
  } = calcScreenValues(
    horizontalPixels,
    verticalPixels,
    leftMarginWidthIn,
    graphWidthIn,
    bottomMarginHeightIn,
    graphHeightIn
  );

  const TickType = {
    major: "major",
    minor: "minor",
  };

  const data = Array.from(
    Array(showMinorTicks ? maxTime * 4 : maxTime + 1).keys()
  ).map((d) => {
    const isMajor = showMinorTicks ? d % 4 === 0 : true;
    const delay = showMinorTicks ? d / 4 : d;
    if (isMajor && delay === timeEarlier) {
      return {
        type: TickType.major,
        time: delay,
        amount: amountEarlier,
        barType: AmountType.earlierAmount,
      };
    } else if (isMajor && delay === timeLater) {
      return {
        type: TickType.major,
        time: delay,
        amount: amountLater,
        barType: AmountType.laterAmount,
      };
    } else {
      return {
        type: isMajor ? TickType.major : TickType.minor,
        time: delay,
        amount: 0,
        barType: AmountType.none,
      };
    }
  });

  const xTickValues = data.map((d) => d.time);

  var chart = svg
    .selectAll(".plot-area")
    .data([null])
    .join("g")
    .attr("class", "plot-area");

  const x = scaleLinear().domain([0, maxTime]).range([0, barAreaWidthUC]);
  const yRange = [0, maxAmount];
  const y = scaleLinear().domain(yRange).range([barAreaHeightUC, 0]);

  const majorTicks = xTickValues.filter((v, i) => {
    const entry = data[i];
    return entry.type === TickType.major;
  });

  const minorTicks = xTickValues.filter((v, i) => {
    const entry = data[i];
    return entry.type === TickType.minor;
  });

  const xAxis = chart
    .selectAll(".x-axis-major")
    .data([null])
    .join("g")
    .attr("font-weight", 700)
    .attr(
      "transform",
      `translate(${leftOffSetUC / 2},${barAreaHeightUC + bottomOffSetUC / 2})`
    )
    .attr("class", "x-axis-major")
    .call(
      axisBottom(x).tickValues(majorTicks).tickSize(10).tickFormat(format(""))
    );

  xAxis
    .selectAll("g")
    .filter(function (d, i) {
      return majorTicks[i].type === TickType.major;
    })
    .style("stroke-width", "3px")
    .attr("y2", "12");

  if (showMinorTicks) {
    chart
      .selectAll(".x-axis-minor")
      .data([null])
      .join("g")
      .attr(
        "transform",
        `translate(${leftOffSetUC / 2},${barAreaHeightUC + bottomOffSetUC / 2})`
      )
      .attr("class", "x-axis-minor")
      .call(
        axisBottom(x)
          .tickValues(minorTicks)
          .tickFormat(function () {
            return "";
          })
          .tickSize(6)
      );
  }

  chart
    .selectAll(".x-axis-label")
    .data([null])
    .join("g")
    .attr("class", "x-axis-label")
    .selectAll(".x-axis-text")
    .data([null])
    .join("text")
    .attr("class", "x-axis-text")
    .attr("dominant-baseline", "auto")
    .attr("x", totalUCWidth / 2)
    .attr("y", totalUCHeight - 4) // TODO how do I fix the -5 so that the bottom of the y doesn't get clipped
    .attr("text-anchor", "middle")
    .text("Delay in Months")
    .attr("font-size", "1.2em");

  const yTickValues = range(yRange[0], yRange[1], yRange[1] / 5);
  yTickValues.push(yRange[1]);

  chart
    .selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .attr("font-weight", 700)
    .attr("transform", `translate(${leftOffSetUC / 2},${bottomOffSetUC / 2})`)
    .call(axisLeft(y).tickValues(yTickValues).tickFormat(format("$,.0f")));

  chart
    .selectAll(".y-axis-label")
    .data([null])
    .join("g")
    .attr("transform", "rotate(-90)")
    .attr("class", "y-axis-label")
    .style("font-size", "1.2em")
    .selectAll(".y-axis-text")
    .data([null])
    .join("text")
    .attr("class", "y-axis-text")
    .attr("dominant-baseline", "hanging")
    .attr("text-anchor", "middle")
    .attr("x", -(barAreaHeightUC + bottomOffSetUC) / 2)
    .attr("y", 0)
    .text("US Dollars");

  chart
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("id", (d) => {
      return d.barType;
    })
    .attr("fill", (d) => {
      return d.barType === choice ? "lightblue" : "steelblue";
    })
    .attr("class", "bar")
    .attr("x", (d) => x(d.time) - barWidth / 2)
    .attr("y", (d) => y(d.amount))
    .attr("transform", `translate(${leftOffSetUC / 2},${bottomOffSetUC / 2})`)
    .attr("width", barWidth)
    .attr("height", (d) => y(0) - y(d.amount))
    // .on("mouseover", function () {
    //   d3.select(this).attr("fill", "lightblue");
    // })
    // .on("mouseout", function () {
    //   d3.select(this).attr("fill", (d) => {
    //     return d.barType === choice ? "lightblue" : "steelblue";
    //   });
    // })
    .on("click", function (d) {
      if (
        interaction === InteractionType.titration ||
        interaction === InteractionType.none
      ) {
        onClickCallback(d.target.__data__.barType);
        choice = d.target.__data__.barType;
      }
    });

  const earlierEntry = data.find((v) => v.barType === AmountType.earlierAmount);
  const laterEntry = data.find((v) => v.barType === AmountType.laterAmount);

  chart
    .selectAll(".earlier-amount-label")
    .data([null])
    .join("g")
    .attr("class", "earlier-amount-label")
    .selectAll(".earlier-amount-text")
    .data([earlierEntry])
    .join("text")
    .attr("class", "earlier-amount-text")
    .attr(
      "transform",
      `translate(${leftOffSetUC / 2},${bottomOffSetUC / 2 - 6})`
    )
    .attr("x", (d) => x(d.time))
    .attr("y", (d) => y(d.amount))
    .attr("text-anchor", "middle")
    .text((d) => format("$,.0f")(d.amount))
    .attr("font-size", "1.2em")
    .attr("font-weight", 700);

  chart
    .selectAll(".later-amount-label")
    .data([null])
    .join("g")
    .attr("class", "later-amount-label")
    .selectAll(".later-amount-text")
    .data([laterEntry])
    .join("text")
    .attr("class", "later-amount-text")
    .attr(
      "transform",
      `translate(${leftOffSetUC / 2},${bottomOffSetUC / 2 - 6})`
    )
    .attr("x", (d) => x(d.time))
    .attr("y", (d) => y(d.amount))
    .attr("text-anchor", "middle")
    .text((d) => format("$,.0f")(d.amount))
    .attr("font-size", "1.2em")
    .attr("font-weight", 700);

  var dragHandler = drag().on("drag", function (d) {
    if (
      interaction === InteractionType.drag &&
      d.subject.barType === variableAmount
    ) {
      select(this)
        .attr("y", d.y)
        .attr("height", y(0) - d.y);
    }
  });
  dragHandler(chart.selectAll(".bar"));
};

export const BarChartComponent = (props) => {
  const { totalSVGWidth, totalSVGHeight, totalUCWidth, totalUCHeight } =
    calcScreenValues(
      props.horizontalPixels,
      props.verticalPixels,
      props.leftMarginWidthIn,
      props.graphWidthIn,
      props.bottomMarginHeightIn,
      props.graphHeightIn
    );
  return (
    <FormControl required={false} error={props.error}>
      <FormHelperText>{props.helperText}</FormHelperText>
      <svg
        width={totalSVGWidth}
        height={totalSVGHeight}
        viewBox={`0 0 ${totalUCWidth} ${totalUCHeight}`}
        ref={useD3(
          (svg) => {
            drawBarChart({
              svg: svg,
              maxTime: props.maxTime,
              maxAmount: props.maxAmount,
              interaction: props.interaction,
              variableAmount: props.variableAmount,
              amountEarlier: props.amountEarlier,
              timeEarlier: props.timeEarlier,
              amountLater: props.amountLater,
              timeLater: props.timeLater,
              choice: props.choice,
              horizontalPixels: props.horizontalPixels,
              verticalPixels: props.verticalPixels,
              leftMarginWidthIn: props.leftMarginWidthIn,
              graphWidthIn: props.graphWidthIn,
              bottomMarginHeightIn: props.bottomMarginHeightIn,
              graphHeightIn: props.graphHeightIn,
              showMinorTicks: props.showMinorTicks,
              onClickCallback: props.onClickCallback,
            });
          },
          [props.choice]
        )}
      ></svg>
    </FormControl>
  );
};
