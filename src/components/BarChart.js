import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  axisBottom,
  axisLeft,
  scaleLinear,
  range,
  format,
  drag,
  select,
} from "d3";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import { useD3 } from "../hooks/useD3";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import { InteractionType } from "../features/InteractionType";
import { AmountType } from "../features/AmountType";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";

function BarChart() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);
  const navigate = useNavigate();

  var totalSVGWidth;
  var totalSVGHeight;
  var totalUCWidth;
  var totalUCHeight;
  var leftOffSetUC;
  var bottomOffSetUC;
  var barAreaWidthUC;
  var barAreaHeightUC;
  var barWidth;
  console.log("hello");
  if (q.horizontalPixels && q.verticalPixels) {
    totalUCWidth = q.horizontalPixels * window.devicePixelRatio;
    totalUCHeight = q.verticalPixels * window.devicePixelRatio;
    totalSVGWidth = `${totalUCWidth}px`;
    totalSVGHeight = `${totalUCHeight}px`;
    leftOffSetUC = 200;
    bottomOffSetUC = 75;
    barAreaWidthUC = totalUCWidth - leftOffSetUC;
    barAreaHeightUC = totalUCHeight - bottomOffSetUC;
    barWidth = 20;
  } else {
    // SVG thinks the resolution is 96 ppi when macbook is 132 ppi so we need to adjust by device pixel ratio
    const minScreenRes = Math.min(window.screen.height, window.screen.width);
    totalUCWidth = minScreenRes;
    totalUCHeight = minScreenRes;
    const pixelRatioScale = window.devicePixelRatio >= 2 ? 132 / 96 : 1;
    const totalSVGWidthIn = q.leftMarginWidthIn + q.graphWidthIn;
    const totalSVGHeightIn = q.bottomMarginHeightIn + q.graphHeightIn;
    const scaleHorizUCPerIn = minScreenRes / totalSVGWidthIn;
    const scaleVertUCPerIn = minScreenRes / totalSVGHeightIn;

    totalSVGWidth = `${totalSVGWidthIn * pixelRatioScale}in`;
    totalSVGHeight = `${totalSVGHeightIn * pixelRatioScale}in`;
    leftOffSetUC = scaleHorizUCPerIn * q.leftMarginWidthIn;
    bottomOffSetUC = scaleVertUCPerIn * q.bottomMarginHeightIn;
    barAreaWidthUC = minScreenRes - leftOffSetUC;
    barAreaHeightUC = minScreenRes - bottomOffSetUC;
    barWidth = 0.5 * scaleHorizUCPerIn; // bars are 0.1 inch wide
  }

  const TickType = {
    major: "major",
    minor: "minor",
  };

  const x = 1;
  console.log(x);
  const data = Array.from(Array(q.maxTime * 4 + 1).keys()).map((d) => {
    const isMajor = d % 4 === 0;
    const delay = d / 4;
    if (isMajor && delay === q.timeEarlier) {
      return {
        type: TickType.major,
        time: delay,
        amount: q.amountEarlier,
        barType: AmountType.earlierAmount,
      };
    } else if (isMajor && delay === q.timeLater) {
      return {
        type: TickType.major,
        time: delay,
        amount: q.amountLater,
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

  const result = (
    <div>
      <svg
        width={totalSVGWidth}
        height={totalSVGHeight}
        viewBox={`0 0 ${totalUCWidth} ${totalUCHeight}`}
        ref={useD3(
          (svg) => {
            var chart = svg
              .selectAll(".plot-area")
              .data([null])
              .join("g")
              .attr("class", "plot-area");

            const x = scaleLinear()
              .domain([0, q.maxTime])
              .range([0, barAreaWidthUC]);

            const yRange = [0, q.maxAmount];
            const y = scaleLinear().domain(yRange).range([barAreaHeightUC, 0]);

            const xAxis = chart
              .selectAll(".x-axis")
              .data([null])
              .join("g")
              .attr(
                "transform",
                `translate(${leftOffSetUC / 2},${
                  barAreaHeightUC + bottomOffSetUC / 2
                })`
              )
              .attr("class", "x-axis")
              .call(
                axisBottom(x)
                  .tickValues(xTickValues)
                  .tickFormat(function (d, i) {
                    const entry = data[i];
                    return entry.type === TickType.major ? entry.time : "";
                  })
                  .tickSize(6)
              );

            // Add the class 'minor' to all minor ticks
            xAxis
              .selectAll("g")
              .filter(function (d, i) {
                return data[i].type === TickType.major;
              })
              .style("stroke-width", "3px")
              .attr("y2", "12");
            //.classed("minor", "true");
            // .attr(
            //   "style",
            //   "stroke: #777; stroke-width: 1px; stroke-dasharray: 6,4"
            // );

            const yTickValues = range(yRange[0], yRange[1], yRange[1] / 5);
            yTickValues.push(yRange[1]);

            chart
              .selectAll(".y-axis")
              .data([null])
              .join("g")
              .attr("class", "y-axis")
              .attr(
                "transform",
                `translate(${leftOffSetUC / 2},${bottomOffSetUC / 2})`
              )
              .call(
                //axisLeft(y).tickValues(yTickValues).tickFormat(d3.format("$,.2f"))
                axisLeft(y).tickValues(yTickValues).tickFormat(format("$,.0f"))
              );

            svg
              .selectAll(".y-axis-label")
              .data([null])
              .join("g")
              .attr("transform", "rotate(-90)")
              .attr("class", "y-axis-label")
              .style("font-size", "1em")
              .selectAll(".y-axis-text")
              .data([null])
              .join("text")
              .attr("class", "y-axis-text")
              .attr("dominant-baseline", "hanging")
              .attr("text-anchor", "middle")
              .attr("x", -(barAreaHeightUC + bottomOffSetUC) / 2)
              .attr("y", 0)
              .text("$ in USD");

            svg
              .selectAll(".x-axis-label")
              .data([null])
              .join("g")
              .attr("class", "x-axis-label")
              .selectAll(".x-axis-text")
              .data([null])
              .join("text")
              .attr("class", "x-axis-text")
              //.attr("text-anchor", "middle")
              .attr("dominant-baseline", "auto")
              //.attr("aligment-baseline", "ideographics")
              //.attr("x", -barAreaWidthUC / 2)
              .attr("x", barAreaWidthUC / 2)
              .attr("y", totalUCHeight)
              //.attr("y", 100)
              .text("Delay in Months")
              .attr("font-size", "1em");

            chart
              .selectAll(".bar")
              .data(data)
              .join("rect")
              .attr("id", (d) => {
                return "id" + d.time;
              })
              .attr("fill", "steelblue")
              .attr("class", "bar")
              .attr("x", (d) => x(d.time) - barWidth / 2)
              .attr("y", (d) => y(d.amount))
              .attr(
                "transform",
                `translate(${leftOffSetUC / 2},${bottomOffSetUC / 2})`
              )
              .attr("width", barWidth)
              .attr("height", (d) => y(0) - y(d.amount))
              .on("click", (d) => {
                if (
                  q.interaction === InteractionType.titration ||
                  q.interaction === InteractionType.none
                ) {
                  if (d.target.__data__.amount === q.amountEarlier) {
                    dispatch(
                      answer({
                        choice: ChoiceType.earlier,
                        choiceTimestamp: dateToState(DateTime.utc()),
                      })
                    );
                  } else if (d.target.__data__.amount === q.amountLater) {
                    dispatch(
                      answer({
                        choice: ChoiceType.later,
                        choiceTimestamp: dateToState(DateTime.utc()),
                      })
                    );
                  }
                }
              });
            var dragHandler = drag().on("drag", function (d) {
              if (
                q.interaction === InteractionType.drag &&
                d.subject.barType === q.variableAmount
              ) {
                select(this)
                  .attr("y", d.y)
                  .attr("height", y(0) - d.y);
              }
            });
            dragHandler(chart.selectAll(".bar"));
          },
          [q]
        )}
      ></svg>
      {q.interaction === InteractionType.drag ? (
        <Formik
          initialValues={{ choice: ChoiceType.Unitialized }}
          validate={() => {
            let errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              dispatch(
                answer({
                  choice: ChoiceType.earlier,
                  choiceTimestamp: dateToState(DateTime.utc()),
                })
              );
              setSubmitting(false);
              resetForm();
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        ""
      )}
    </div>
  );

  if (status === StatusType.Questionaire) {
    navigate("/questionaire");
  } else {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.utc())));
  }
  return result;
}

export default BarChart;
