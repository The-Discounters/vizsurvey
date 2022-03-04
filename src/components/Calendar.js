import React from "react";

import { useSelector } from "react-redux";
import { selectCurrentQuestion } from "../features/questionSlice";

import * as d3 from "d3";
import { useD3 } from "../hooks/useD3";
var calendarMatrix = require("calendar-matrix");

function Calendar(props) {
  const question = useSelector(selectCurrentQuestion);

  const height = question.vertical_pixels;
  const width = question.horizontal_pixels;
  const margin = {
    top: props.top_margin,
    right: props.right_margin,
    bottom: props.bottom_margin,
    left: props.left_margin,
  };

  const totalHeight = height + parseInt(margin.top) + parseInt(margin.bottom);
  const totalWidth = width + parseInt(margin.left) + parseInt(margin.right);

  const style = {
    height: totalHeight,
    width: totalWidth,
    marginLeft: margin.left + "px",
    marginRight: margin.right + "px",
  };

  //   const dateMonth = question.date_earlier.getMonth();
  //   const dateYear = question.date_earlier.getFullYear();

  return (
    <table
      id="calendar"
      ref={useD3((table) => {
        const monthDays = calendarMatrix(question.date_earlier);
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
        const month = question.date_earlier.getMonth();
        const monthName = monthNames[month];
        table.html(
          `<thead>
                <tr>
                    <td span='7'>
                        <h2 id='currentMonth'></h2>
                    </td>
                </tr>
                <tr>
                    <td style='text-align: center;'>Sunday</td>
                    <td style='text-align: center;'>Monday</td>
                    <td style='text-align: center;'>Tuesday</td>
                    <td style='text-align: center;'>Wednesday</td>
                    <td style='text-align: center;'>Thursday</td>
                    <td style='text-align: center;'>Friday</td>
                    <td style='text-align: center;'>Saturday</td>
                </tr>
            </thead>
            <tbody id='calendarBody'></tbody>`
        );

        const calendar = d3.select("#calendar");

        calendar
          .select("#currentMonth")
          .data([monthName])
          .join("h2")
          .text((d) => d);

        const tbody = calendar.select("#calendarBody");

        const rows = tbody.selectAll("tbody").data(monthDays).join("tr");

        const earlierDay = question.date_earlier.getDate();
        const laterDay = question.date_later.getDate();
        rows
          .selectAll("td")
          .data((d) => d)
          .join("td")
          .attr("class", function (d) {
            return d > 0 ? "calendarDay" : "calendarDayEmpty";
          })
          .attr("id", (d) => "calendarDay-" + d)
          .html((d) => {
            if (d === earlierDay || d === laterDay) {
              return `<div>${d}</div><svg id='${
                d === earlierDay ? "earlierAmount" : "laterAmount"
              }'></svg>`;
            } else if (d > 0) {
              return d;
            } else {
              return "";
            }
          });

        const earlierAmountSVG = rows.select("#earlierAmount");

        earlierAmountSVG
          .select("text")
          .data([question.earlier_amount])
          .join("text")
          .attr("text-anchor", "middle")
          .attr("class", "earlier-amount")
          .text((d) => d);

        //   .text(function (d) {
        //     return d > 0 ? d : "";
        //   });

        // const cellId = "#calendarDay-" + question.date_earlier.getDay();
        // const earlierDayCell = rows.select(cellId);
        // const earlierDayHTML = `<td id="${cellId}`

        // earlierDayCell.html(earlierDayCell.node() + '<svg id=""></svg>')
        // rows.select(cellId).data([question.amount_earlier]).join("svg");
      }, question)}
      style={style}
    ></table>
  );
}

export default Calendar;
