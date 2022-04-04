import React from "react";
import { Redirect } from "react-router-dom";
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
import { Container, Row, Col } from "react-bootstrap";
import { DateTime } from "luxon";
import { useD3 } from "../hooks/useD3";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import { InteractionType } from "../features/InteractionType";
import { VariableType } from "../features/VariableType";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";

function BarChart(props) {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  const barWidth = 15;

  const height = q.verticalPixels;
  const width = q.horizontalPixels;
  const margin = {
    top: props.top_margin,
    right: props.right_margin,
    bottom: props.bottom_margin,
    left: props.left_margin,
  };

  const totalHeight = height + parseInt(margin.top) + parseInt(margin.bottom);
  const totalWidth = width + parseInt(margin.left) + parseInt(margin.right);

  const xTickValues = Array.from(Array(q.maxTime + 1).keys());
  const data = xTickValues.map((d) => {
    if (d === q.timeEarlier) {
      return {
        time: d,
        amount: q.amountEarlier,
        barType: VariableType.earlierAmount,
      };
    } else if (d === q.timeLater) {
      return {
        time: d,
        amount: q.amountLater,
        barType: VariableType.laterAmount,
      };
    } else {
      return { time: d, amount: 0, barType: VariableType.none };
    }
  });

  const result = (
    <Container fluid>
      <Row>
        <Col>
          <svg
            width={`${totalWidth}`}
            height={`${totalHeight}`}
            ref={useD3(
              (svg) => {
                var chart = svg
                  .selectAll(".plot-area")
                  .data([null])
                  .join("g")
                  .attr("class", "plot-area")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

                const x = scaleLinear()
                  .domain([0, q.maxTime])
                  .range([0, width]);

                const yRange = [0, q.maxAmount];
                const y = scaleLinear().domain(yRange).range([height, 0]);

                chart
                  .selectAll(".x-axis")
                  .data([null])
                  .join("g")
                  .attr("transform", `translate(0,${height})`)
                  .attr("class", "x-axis")
                  .call(
                    axisBottom(x)
                      .tickValues(xTickValues)
                      .tickFormat(format(",.0f"))
                  );

                const yTickValues = range(yRange[0], yRange[1], yRange[1] / 5);
                yTickValues.push(yRange[1]);

                chart
                  .selectAll(".y-axis")
                  .data([null])
                  .join("g")
                  .attr("class", "y-axis")
                  //.attr("transform", `translate(${margin.left},${margin.bottom})`)
                  .call(
                    //axisLeft(y).tickValues(yTickValues).tickFormat(d3.format("$,.2f"))
                    axisLeft(y)
                      .tickValues(yTickValues)
                      .tickFormat(format("$,.0f"))
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
                  .attr("fill", "steelblue")
                  .attr("class", "bar")
                  .attr("x", (d) => x(d.time) - barWidth / 2)
                  .attr("width", barWidth)
                  .attr("y", (d) => y(d.amount))
                  .attr("id", (d) => {
                    return "id" + d.time;
                  })
                  .on("click", (d) => {
                    if (
                      q.interaction === InteractionType.titration ||
                      q.interaction !== InteractionType.drag
                    ) {
                      if (d.target.__data__.amount === q.amountEarlier) {
                        dispatch(
                          answer({
                            choice: ChoiceType.earlier,
                            choiceTimestamp: DateTime.now(),
                          })
                        );
                      } else if (d.target.__data__.amount === q.amountLater) {
                        dispatch(
                          answer({
                            choice: ChoiceType.later,
                            choiceTimestamp: DateTime.now(),
                          })
                        );
                      }
                    }
                  })
                  .attr("height", (d) => y(0) - y(d.amount));
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
        </Col>
      </Row>
      <Row>
        <Col>
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
                      choiceTimestamp: DateTime.now(),
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
        </Col>
      </Row>
    </Container>
  );

  if (status === StatusType.Complete) {
    return <Redirect to="/vizsurvey/thankyou" />;
  } else {
    dispatch(setQuestionShownTimestamp(Date.now()));
    return result;
  }
}

export default BarChart;
