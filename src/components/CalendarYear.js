/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { select } from "d3";
import * as d3 from "d3";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import {
  getCurrentQuestion,
  getStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice.js";
import { useD3 } from "../hooks/useD3.js";
import { AmountType } from "../features/AmountType.js";
import { StatusType } from "../features/StatusType.js";
import { InteractionType } from "../features/InteractionType.js";
import { drawCalendar } from "./CalendarHelper.js";
import { stateToDate, dateToState } from "../features/ConversionUtil.js";

export function drawCalendarYear() {
  const dispatch = useDispatch();
  const q = useSelector(getCurrentQuestion);
  const status = useSelector(getStatus);
  const navigate = useNavigate();

  const monthsMatrix = [
    [
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 1, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 1,
        hasLaterDate: stateToDate(q.dateLater).month === 1,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 2, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 2,
        hasLaterDate: stateToDate(q.dateLater).month === 2,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 3, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 3,
        hasLaterDate: stateToDate(q.dateLater).month === 3,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 4, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 4,
        hasLaterDate: stateToDate(q.dateLater).month === 4,
      },
    ],
    [
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 5, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 5,
        hasLaterDate: stateToDate(q.dateLater).month === 5,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 6, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 6,
        hasLaterDate: stateToDate(q.dateLater).month === 6,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 7, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 7,
        hasLaterDate: stateToDate(q.dateLater).month === 7,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 8, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 8,
        hasLaterDate: stateToDate(q.dateLater).month === 8,
      },
    ],
    [
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 9, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 9,
        hasLaterDate: stateToDate(q.dateLater).month === 9,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 10, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 10,
        hasLaterDate: stateToDate(q.dateLater).month === 10,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 11, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 11,
        hasLaterDate: stateToDate(q.dateLater).month === 11,
      },
      {
        firstOfMonth: DateTime.utc(stateToDate(q.dateEarlier).year, 12, 1),
        hasEarlierDate: stateToDate(q.dateEarlier).month === 12,
        hasLaterDate: stateToDate(q.dateLater).month === 12,
      },
    ],
  ];

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;
  const noAmountMonthCellSizeIng = 0.1875; // width and height is 34px without
  // TODO this will always be constrained by q.heightIn since the monitor aspect ration is shorter in height.  Unessarily complex to consider q.widthIn in calculation
  const monthTdSquareSizeIn = Math.min(q.heightIn / 3, q.widthIn / 4);
  const monthTdSquareSizePx = Math.round(monthTdSquareSizeIn * dpi);
  // I gave up on trying to shrink the months that don't have amounts for now.  Left the code in place to try to fix later.
  //const monthTdSquareSizePxNoAmount = monthTdSquareSizePx;
  //const monthTdSquareSizePxAmount = monthTdSquareSizePx;

  var dragAmount = null;

  const result = (
    <div>
      <table
        id="year-calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
            const yearTable = d3
              .select("#year-calendar")
              .data([null])
              .join("table");
            const yearHead = yearTable
              .selectAll("#year-head")
              .data([null])
              .join("thead")
              .attr("id", "year-head");
            yearHead
              .selectAll("#year-head-row")
              .data([null])
              .join("tr")
              .attr("id", "year-head-row")
              .style("text-align", "center")
              .selectAll("#year-cell")
              .data([q.dateEarlier])
              .join("td")
              .attr("id", "year-cell")
              .attr("style", "font-size: 14px;")
              .attr("colspan", 7)
              .text((d) => d.year);
            const yearBody = yearTable
              .selectAll("#year-calendar-body")
              .data([null])
              .join("tbody")
              .attr("id", "year-calendar-body");
            yearBody
              .selectAll(".months-rows")
              .data(monthsMatrix)
              .join("tr")
              .attr("class", "months-rows")
              .selectAll(".months-cells")
              .data(
                (d) => d,
                (d) => d
              )
              .join("td")
              .attr("class", "months-cells")
              .attr(
                "width",
                (d) => monthTdSquareSizePx
                // d.hasEarlierDate || d.hasLaterDate
                //</div>   ? monthTdSquareSizePxAmount
                //   : monthTdSquareSizePxNoAmount
              )
              .attr(
                "height",
                (d) => monthTdSquareSizePx
                //d.hasEarlierDate || d.hasLaterDate
                //</div>  ? monthTdSquareSizePxAmount
                //  : monthTdSquareSizePxNoAmount
              )
              .attr("style", "vertical-align: top;")
              .each(function (monthDate) {
                const yearTd = select(this);
                drawCalendar({
                  table: yearTd,
                  question: q,
                  monthDate: monthDate.firstOfMonth,
                  tableWidthIn: monthTdSquareSizeIn,
                  showYear: false,
                  showAmountOnBar: false,
                  numIconCol: 5,
                  numIconRow: 5,
                  iconSize: 3,
                  dragCallback: (amount) => {
                    dragAmount = amount;
                  },
                  dispatchCallback: (answer) => {
                    dispatch(answer);
                  },
                });
              });
          },
          [q]
        )}
      ></table>
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
                  choice: AmountType.earlierAmount,
                  choiceTimestamp: dateToState(DateTime.now()),
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

export default drawCalendarYear;
