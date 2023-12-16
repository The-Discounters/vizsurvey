import { select /*, format, scaleLinear, scaleBand, range, drag */ } from "d3";
import { AmountType } from "@the-discounters/types";

export const monthNames = [
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

export const daySuffix = [
  "SHOULD NOT BE SEEN",
  "st", // 1st
  "nd",
  "rd",
  "th", // 4th
  "th",
  "th",
  "th",
  "th",
  "th",
  "th", // 10th
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "th",
  "st", // 21st
  "nd",
  "rd",
  "th", // 24th
  "th",
  "th",
  "th",
  "th",
  "th",
  "th", // 30th
  "st", // 31st
];

export const todayText = function (sooner_time) {
  const date = new Date(sooner_time);
  const monthNumber = date.getMonth();
  const dayNumber = date.getDate();
  const yearNumber = date.getFullYear();
  return (
    "on " +
    monthNames[monthNumber] +
    " " +
    dayNumber +
    daySuffix[dayNumber] +
    ", " +
    yearNumber
  );
};

export const drawCalendarYearDual = ({
  table,
  onClickCallback,
  choice,
  qDateEarlier,
  qDateLater,
  qAmountEarlier,
  qAmountLater,
}) => {
  let selection = { d: -1, a: -1 };
  const date = new Date(qDateEarlier);
  const dateLater = new Date(qDateLater);
  console.log("date: " + date);
  console.log("date.getMonth(): " + date.getMonth());
  console.log("dateLater: " + dateLater);
  console.log("dateLater.getMonth(): " + dateLater.getMonth());
  const year = [];
  let counter = 0;
  let change = 1;
  for (let i = 0; i < 4 /* 4 rows of months */; i++) {
    let row = [];
    for (let j = 0; j < 6 /* 6 months in a row */; j++) {
      if (counter >= 12) {
        counter = 0;
      }
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

  const body = table.append("tbody");

  let boxLength = "100px";
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
        if (isNaN(d)) {
          td.append("div")
            .text(function (d) {
              return monthNames[d.d];
            })
            .style("text-align", "center")
            .style("margin", "0px 5px 0px 5px")
            .style("width", boxLength)
            .on("click", () => {})
            .on("mouseover", function () {})
            .on("mouseout", function () {});
          let selectionDiv = td
            .append("div")
            .text(function (d) {
              return "$" + d.a;
            })
            .style("background-color", "steelblue")
            .style("border-style", "solid")
            .style("border-width", "3px")
            .style("border-color", "rgb(0,0,0)")
            .style("width", boxLength)
            .style("height", boxLength)
            .style("text-align", "center")
            .style("font-size", "25px");
          if (d.k === "earlierAmount") selectionDiv.attr("id", "earlierAmount");
          else selectionDiv.attr("id", "laterAmount");
        } else {
          td.append("div")
            .text(function (d) {
              if (!d) return "";
              if (d < 1) return "";
              return monthNames[d];
            })
            .style("text-align", "center");
          td.append("div")
            .style("border-style", "solid")
            .style("border-width", "3px")
            .style("border-color", "rgb(0,0,0)")
            .style("margin", "0px 5px 0px 5px")
            .style("width", boxLength)
            .style("height", boxLength);
        }
      });
  });
};
