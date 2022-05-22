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

  const minScreenRes = Math.min(window.screen.height, window.screen.width);

  const totalWidthUC = minScreenRes; //q.horizontalPixels; // may want to get rid of this configuation and just make it 100
  const totalHeightUC = minScreenRes; //q.verticalPixels; // may want to get rid of this configuation and just make it 100
  const leftMarginWidthIn = q.leftMarginWidthIn;
  const bottomMarginHeightIn = q.bottomMarginHeightIn;
  const barAreaWidthIn = q.graphWidthIn;
  const barAreaHeightIn = q.graphHeightIn;

  const totalSVGWidthIn = leftMarginWidthIn + barAreaWidthIn;
  const totalSVGHeightIn = bottomMarginHeightIn + barAreaHeightIn;

  const scaleHorizUCPerIn = totalWidthUC / totalSVGWidthIn;
  const scaleVertUCPerIn = totalHeightUC / totalSVGHeightIn;

  const leftOffSetUC = scaleHorizUCPerIn * leftMarginWidthIn;
  const bottomOffSetUC = scaleVertUCPerIn * bottomMarginHeightIn;
  const barAreaWidthUC = totalWidthUC - leftOffSetUC;
  const barAreaHeightUC = totalHeightUC - bottomOffSetUC;

  const barWidth = 0.15 * scaleHorizUCPerIn; // bars are 0.1 inch wide

  // SVG thinks the resolution is 96 ppi when macbook is 132 ppi so we need to adjust by device pixel ratio
  const pixelRatioScale = window.devicePixelRatio >= 2 ? 132 / 96 : 1;

  const xTickValues = Array.from(Array(q.maxTime + 1).keys());
  const data = xTickValues.map((d) => {
    if (d === q.timeEarlier) {
      return {
        time: d,
        amount: q.amountEarlier,
        barType: AmountType.earlierAmount,
      };
    } else if (d === q.timeLater) {
      return {
        time: d,
        amount: q.amountLater,
        barType: AmountType.laterAmount,
      };
    } else {
      return { time: d, amount: 0, barType: AmountType.none };
    }
  });

  const result = (
    <div>
      <svg
        width={`${totalSVGWidthIn * pixelRatioScale}in`}
        height={`${totalSVGHeightIn * pixelRatioScale}in`}
        viewBox={`0 0 ${totalWidthUC} ${totalHeightUC}`}
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

            chart
              .selectAll(".x-axis")
              .data([null])
              .join("g")
              .attr(
                "transform",
                `translate(${leftOffSetUC},${barAreaHeightUC})`
              )
              .attr("class", "x-axis")
              .call(
                axisBottom(x).tickValues(xTickValues).tickFormat(format(",.0f"))
              );

            const yTickValues = range(yRange[0], yRange[1], yRange[1] / 5);
            yTickValues.push(yRange[1]);

            chart
              .selectAll(".y-axis")
              .data([null])
              .join("g")
              .attr("class", "y-axis")
              .attr("transform", `translate(${leftOffSetUC},0)`)
              .call(
                //axisLeft(y).tickValues(yTickValues).tickFormat(d3.format("$,.2f"))
                axisLeft(y).tickValues(yTickValues).tickFormat(format("$,.0f"))
              );

            // const yLabelG = svg
            //   .select("#y-axis-label")
            //   .data([1])
            //   .join("g")
            //   .attr("transform", "rotate(-90)");

            // .data(nullData)
            // .join("text")
            // .attr("id", "y-axis-label")
            // .attr("text-anchor", "middle")
            // .attr("x", -innerHeight / 2)
            // .attr("y", -margin.left)

            // .text("Amount in USD");

            chart
              .selectAll(".bar")
              .data(data)
              .join("rect")
              .attr("id", (d) => {
                return "id" + d.time;
              })
              .attr("fill", "black")
              .attr("class", "bar")
              .attr("x", (d) => x(d.time) - barWidth / 2)
              .attr("y", (d) => y(d.amount))
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

  if (status === StatusType.Complete) {
    navigate("/post-survey");
  } else {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
    return result;
  }
}

export default BarChart;
