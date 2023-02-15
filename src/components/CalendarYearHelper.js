import { select /*, format, scaleLinear, scaleBand, range, drag */ } from "d3";
import { AmountType } from "../features/AmountType.js";
import { drawCalendar } from "./CalendarHelper.js";

export const drawCalendarYear = ({
  table: table,
  onClickCallback: onClickCallback,
  choice: choice,
  qDateEarlier: qDateEarlier,
  qDateLater: qDateLater,
  qAmountEarlier: qAmountEarlier,
  qAmountLater: qAmountLater,
}) => {
  let selection = { d: -1, a: -1 };
  /*
  console.log("qDateEarlier: " + qDateEarlier);
  console.log("qDateLater: " + qDateLater);
  const firstOfMonth = new Date(qDateEarlier);
  firstOfMonth.setDate(1);
  const lastOfMonth = new Date(qDateEarlier);
  lastOfMonth.setMonth(lastOfMonth.getMonth() + 1);
  lastOfMonth.setDate(0);
  console.log("lastOfMonth: " + lastOfMonth);
  */
  const date = new Date(qDateEarlier);
  const dateLater = new Date(qDateLater);
  console.log("date: " + date);
  console.log("date.getMonth(): " + date.getMonth());
  console.log("dateLater: " + dateLater);
  console.log("dateLater.getMonth(): " + dateLater.getMonth());
  const year = [];
  //const month = [];
  // let counter = -1 * firstOfMonth.getDay() + 1;
  let counter = 0;
  let change = 1;
  // for (let i = 0; i < 6 /* max num of weeks */; i++) {
  for (let i = 0; i < 3 /* 3 rows of monthsr */; i++) {
    // if (counter > lastOfMonth.getDate() || counter < -5) continue;
    let row = [];
    //let week = [];
    // for (let j = 0; j < 7 /* length of week */; j++) {
    for (let j = 0; j < 4 /* 4 months in a row */; j++) {
      /*if (counter > lastOfMonth.getDate()) {
        change = -1;
        counter *= -1;
      }*/
      let month = counter;
      // let day = counter;
      if (month === date.getMonth()) {
        month = { d: month, a: qAmountEarlier, k: "earlierAmount" };
      } else if (month === dateLater.getMonth()) {
        month = { d: month, a: qAmountLater };
      }
      row.push(month);
      counter += change;
    }
    year.push(row);
    // month.push(week);
  }
  /*
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
  */
  //const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //const monthNum = date.getMonth();

  table.selectAll("table > *").remove();

  //const header = table.append("thead");
  const body = table.append("tbody");
  /*
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
  */

  console.log("year: " + JSON.stringify(year));
  //let boxLength = "100px";
  //let boxLength01 = "10px";
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
      .on("click", (d) => {
        console.log("click: target: " + JSON.stringify(d.target.__data__));
        if (isNaN(d.target.__data__)) {
          console.log("click: setselection");
          console.log("click: target: selection: " + JSON.stringify(selection));
          if (
            d.target.__data__.k === "earlierAmount" &&
            choice !== AmountType.earlierAmount
          ) {
            body
              .selectAll("#laterAmount")
              .style("background-color", "steelblue");
          } else if (
            d.target.__data__.k !== "earlierAmount" &&
            choice !== AmountType.laterAmount
          ) {
            body
              .selectAll("#earlierAmount")
              .style("background-color", "steelblue");
          }
          console.log("click: selection: " + JSON.stringify(selection));
          select(this)
            .selectAll("#laterAmount")
            .style("background-color", "lightblue");
          select(this)
            .selectAll("#earlierAmount")
            .style("background-color", "lightblue");
          if (d.target.__data__.k === "earlierAmount") {
            console.log("click: target: onClickCallback: earlierAmount");
            onClickCallback(AmountType.earlierAmount);
          } else {
            console.log("click: target: onClickCallback: laterAmount");
            onClickCallback(AmountType.laterAmount);
          }
        }
      })
      .on("mouseover", function (d) {
        console.log("mouseover: target: " + JSON.stringify(d.target.__data__));
        if (isNaN(d.target.__data__)) {
          select(this)
            .selectAll("#laterAmount")
            .style("background-color", "lightblue");
          select(this)
            .selectAll("#earlierAmount")
            .style("background-color", "lightblue");
        }
      })
      .on("mouseout", function (d) {
        console.log("mouseout: target: " + JSON.stringify(d.target.__data__));
        console.log("mouseout: selection: " + selection.d);
        if (
          isNaN(d.target.__data__) &&
          ((d.target.__data__.k === "earlierAmount" &&
            choice !== AmountType.earlierAmount) ||
            (d.target.__data__.k !== "earlierAmount" &&
              choice !== AmountType.laterAmount))
        ) {
          select(this)
            .selectAll("#laterAmount")
            .style("background-color", "steelblue");
          select(this)
            .selectAll("#earlierAmount")
            .style("background-color", "steelblue");
        }
      })
      .each(function (d) {
        const td = select(this);
        console.log(d);
        let table01 = td.append("table");
        drawCalendar({
          table: table01,
          onClickCallback: onClickCallback,
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
