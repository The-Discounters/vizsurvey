import { select } from "d3";
import { AmountType } from "../features/AmountType.js";

export const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

export const drawCalendar = ({
  table: table,
  onClickCallback: onClickCallback,
  choice: choice,
  qDateEarlier: qDateEarlier,
  qDateLater: qDateLater,
  qAmountEarlier: qAmountEarlier,
  qAmountLater: qAmountLater,
}) => {
  let selection = { d: -1, a: -1 };
  console.log("qDateEarlier: " + qDateEarlier);
  console.log("qDateLater: " + qDateLater);
  const firstOfMonth = new Date(qDateEarlier);
  firstOfMonth.setDate(1);
  const lastOfMonth = new Date(qDateEarlier);
  lastOfMonth.setMonth(lastOfMonth.getMonth() + 1);
  lastOfMonth.setDate(0);
  console.log("lastOfMonth: " + lastOfMonth);
  const date = new Date(qDateEarlier);
  const dateLater = new Date(qDateLater);
  console.log("date: " + date);
  console.log("date.getDate(): " + date.getDate());
  const month = [];
  let counter = -1 * firstOfMonth.getDay() + 1;
  let change = 1;
  for (let i = 0; i < 6 /* max num of weeks */; i++) {
    if (counter > lastOfMonth.getDate() || counter < -5) continue;
    let week = [];
    for (let j = 0; j < 7 /* length of week */; j++) {
      if (counter > lastOfMonth.getDate()) {
        change = -1;
        counter *= -1;
      }
      let day = counter;
      if (day === date.getDate()) {
        day = { d: day, a: qAmountEarlier, k: "earlierAmount" };
      } else if (day === dateLater.getDate()) {
        day = { d: day, a: qAmountLater };
      }
      week.push(day);
      counter += change;
    }
    month.push(week);
  }
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
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNum = date.getMonth();

  table.selectAll("table > *").remove();

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
          select(this).style("background-color", "lightblue");
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
          select(this).style("background-color", "lightblue");
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
          select(this).style("background-color", "steelblue");
        }
      })
      .each(function (d) {
        const td = select(this);
        console.log(d);
        if (isNaN(d)) {
          td.style("background-color", "steelblue");
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
          if (d.k === "earlierAmount") td.attr("id", "earlierAmount");
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
};
