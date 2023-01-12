import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { DateTime } from "luxon";
import {
  getCurrentQuestion,
  getStatus,
  setQuestionShownTimestamp,
  nextQuestion,
  answer,
} from "../features/questionSlice";
import { useD3 } from "../hooks/useD3";
import { select } from "d3";
import { AmountType } from "../features/AmountType";
import { StatusType } from "../features/StatusType";
import { InteractionType } from "../features/InteractionType";
//import { drawCalendar } from "./CalendarHelper";
//import { dateToState, stateToDate } from "../features/ConversionUtil";
import { dateToState } from "../features/ConversionUtil";
import Grid from "@mui/material/Unstable_Grid2";
import { styles } from "./ScreenHelper";
import { Button, Box } from "@mui/material";

export function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(getCurrentQuestion);
  const status = useSelector(getStatus);
  const navigate = useNavigate();

  var dragAmount = null;

  /*
  function generateRow(startNum) {
    let arr = [];
    for (let i = startNum; i < startNum + 7; i++) {
      arr.push(i);
    }
    return arr;
  }

  function generate4Rows() {
    let rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(generateRow(i * 7 + 1));
    }
    return rows;
  }
  let rows = generate4Rows();
  let headers = ["S", "M", "T", "W", "T", "F", "S"];

  function dayClick(day) {
    return () => {
      console.log("day: " + day);
    };
  }
  */
  let selection = { d: -1, a: -1 };

  const result = (
    <div>
      <Grid container style={styles.root} justifyContent="center">
        {/* February
      <table>
        <tr>
          {headers.map((header, index) => {
            return <th key={index}>{header}</th>;
          })}
        </tr>
        {rows.map((row, index1) => {
          return (
            <tr key={index1}>
              {row.map((day, index) => {
                return (
                  <td key={index} onClick={dayClick(day)}>
                    {day}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
      hello world 1 */}
        <table
          id="calendar"
          style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
          ref={useD3(
            (table) => {
              const month = [
                [1, 2, { d: 3, a: 100, k: "earlierAmount" }, 4, 5, 6, 7],
                [8, 9, 10, 11, 12, 13, 14],
                [15, 16, { d: 17, a: 200 }, 18, 19, 20, 21],
                [22, 23, 24, 25, 26, 27, 28],
                [29, 30, 31, -1, -2, -3, -4],
              ];
              const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              const dayNames = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ];
              const monthNum = 9;

              const header = table.append("thead");
              const body = table.append("tbody");

              header
                .append("tr")
                .append("td")
                .attr("colspan", 7)
                .append("h2")
                .text(monthNames[monthNum])
                .style("text-align", "center")
                .style("font-size", "40px");

              header
                .append("tr")
                .selectAll("td")
                .data(dayNames)
                .enter()
                .append("td")
                .text(function (d) {
                  return d;
                })
                .style("text-align", "center")
                .style("font-size", "20px");

              let boxLength = "100px";
              month.forEach(function (week) {
                body
                  .append("tr")
                  .selectAll("td")
                  .data(week)
                  .enter()
                  .append("td")
                  .attr("class", function (d) {
                    return d > 0 ? "" : "empty";
                  })
                  .style("border-style", "solid")
                  .style("border-width", "3px")
                  .style("border-color", "rgb(0,0,0)")
                  .style("width", boxLength)
                  .style("height", boxLength)
                  .on("click", (d) => {
                    console.log(
                      "click: target: " + JSON.stringify(d.target.__data__)
                    );
                    if (isNaN(d.target.__data__)) {
                      console.log("click: setselection");
                      if (d.target.__data__.k !== selection.k) {
                        if (selection.k === "earlierAmount") {
                          body
                            .selectAll("#earlierAmount")
                            .style("background-color", "steelblue");
                        } else {
                          body
                            .selectAll("#laterAmount")
                            .style("background-color", "steelblue");
                        }
                      }
                      selection = d.target.__data__;
                      console.log(
                        "click: selection: " + JSON.stringify(selection)
                      );
                      select(this).style("background-color", "lightblue");
                    }
                    // TODO add selection mechanism
                  })
                  .on("mouseover", function (d) {
                    console.log(
                      "mouseover: target: " + JSON.stringify(d.target.__data__)
                    );
                    if (isNaN(d.target.__data__)) {
                      select(this).style("background-color", "lightblue");
                    }
                  })
                  .on("mouseout", function (d) {
                    console.log(
                      "mouseout: target: " + JSON.stringify(d.target.__data__)
                    );
                    console.log("mouseout: selection: " + selection.d);
                    if (
                      isNaN(d.target.__data__) &&
                      d.target.__data__.d != selection.d
                    ) {
                      select(this).style("background-color", "steelblue");
                    }
                  })
                  .each(function (d) {
                    const td = select(this);
                    console.log(d);
                    if (isNaN(d)) {
                      td.append("div")
                        .text(function (d) {
                          return d.d;
                        })
                        .style("width", boxLength)
                        .style("height", "10px")
                        .style("top", "-33px")
                        .style("position", "relative")
                        .on("click", () => {})
                        .on("mouseover", function () {})
                        .on("mouseout", function () {});
                      td.append("div")
                        .text(function (d) {
                          return "$" + d.a;
                        })
                        .style("width", "95px")
                        .style("text-align", "center")
                        .style("top", "-5px")
                        .style("position", "relative")
                        .style("font-size", "25px");
                      if (d.k === "earlierAmount")
                        td.attr("id", "earlierAmount");
                      else td.attr("id", "laterAmount");
                    } else {
                      td.append("div")
                        .text(function (d) {
                          if (!d) return "";
                          if (d < 1) return "";
                          return d;
                        })
                        .style("width", boxLength)
                        .style("height", boxLength);
                    }
                  });
              });

              /*
            let columns = headers; //["date", "close"];
            var data = [["2013-08-01"]];

            var thead = table.append("thead");
            var tbody = table.append("tbody");

            // append the header row
            thead
              .append("tr")
              .selectAll("th")
              .data(columns)
              .enter()
              .append("th")
              .text(function (column) {
                return column;
              });

            // create a row for each object in the data
            var rows = tbody.selectAll("tr").data(data).enter().append("tr");

            // create a cell in each row for each column
  */ /*var cells = */ /*rows
              .selectAll("td")
              .data(function (row) {
                return columns.map(function (column) {
                  return { column: column, value: row[column] };
                });
              })
              .enter()
              .append("td")
              .text(function (d) {
                return d.value;
              });
*/
              return table;
              /*drawCalendar({
              table: table,
              question: q,
              monthDate: stateToDate(q.dateEarlier),
              tableWidthIn: q.widthIn,
              showYear: true,
              showAmountOnBar: true,
              numIconCol: 10,
              numIconRow: 10,
              iconSize: 3,
              dragCallback: (amount) => {
                dragAmount = amount;
              },
              dispatchCallback: (answer) => {
                dispatch(answer);
              },
            });*/
            },
            [q]
          )}
        ></table>
      </Grid>
      <Grid item xs={12} style={{ margin: 0 }}>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            disableRipple
            disableFocusRipple
            style={styles.button}
            onClick={() => {
              /*
              if (
                choice !== AmountType.earlierAmount &&
                choice !== AmountType.laterAmount
              ) {
                setError(true);
                setHelperText("Please choose one of the options below.");
              } else {
                setError(false);
                setHelperText("");
                dispatch(nextQuestion());
              }*/
              dispatch(nextQuestion());
            }}
            // disabled={disableSubmit}
          >
            {" "}
            Next{" "}
          </Button>
        </Box>
      </Grid>
      {q.interaction === InteractionType.drag ? (
        <Formik
          initialValues={{ choice: AmountType.none }}
          validate={() => {
            let errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              dispatch(
                answer({
                  choice: q.variableAmount,
                  choiceTimestamp: dateToState(DateTime.now()),
                  dragAmount: dragAmount.amount,
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

  if (status === StatusType.FinancialQuestionaire) {
    navigate("/questionaire");
  } else {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
  }
  return result;
}

export default Calendar;
