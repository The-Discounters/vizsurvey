import { select } from "d3";
import { drawCalendar } from "./CalendarHelper.js";

export const drawCalendarYear = ({
  table,
  choice,
  qDateEarlier,
  qDateLater,
  qAmountEarlier,
  qAmountLater,
}) => {
  const date = new Date(qDateEarlier);
  const dateLater = new Date(qDateLater);
  const year = [];
  let counter = 0;
  let change = 1;
  for (let i = 0; i < 3 /* 3 rows of monthsr */; i++) {
    let row = [];
    for (let j = 0; j < 4 /* 4 months in a row */; j++) {
      let month = counter;
      if (month === date.getMonth()) {
        month = { d: month, a: qAmountEarlier, k: "earlierAmount" };
      } else if (month === dateLater.getMonth()) {
        month = { d: month, a: qAmountLater };
      }
      row.push(month);
      counter += change;
    }
    year.push(row);
  }

  table.selectAll("table > *").remove();

  const header = table.append("thead");
  const body = table.append("tbody");

  header
    .append("tr")
    .append("th")
    .attr("colspan", 4)
    .append("h2")
    .text(date.getFullYear())
    .style("text-align", "center")
    .style("font-size", "40px");

  year.forEach(function (row) {
    body
      .append("tr")
      .selectAll("td")
      .data(row)
      .enter()
      .append("td")
      .attr("class", function (d) {
        return d > 0 ? "" : "empty";
      })
      .on("click", () => {})
      .on("mouseover", function () {})
      .on("mouseout", function () {})
      .each(function (d) {
        const td = select(this);
        let table01 = td.append("table");
        table01.style("width", "125px").style("height", "125px");
        drawCalendar({
          table: table01,
          choice: choice,
          qDateEarlier: qDateEarlier,
          qDateLater: qDateLater,
          qAmountEarlier: qAmountEarlier,
          qAmountLater: qAmountLater,
          minimalStyle: true,
          boxLengthOverride: 0.15,
          monthNumber: isNaN(d) ? d.d : d,
        });
      });
  });
};
