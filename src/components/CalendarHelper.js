//import * as d3 from "d3";
import { select /*, format, scaleLinear, scaleBand, range, drag */ } from "d3";
// import { DateTime } from "luxon";
// import { answer } from "../features/questionSlice";
// import { ViewType } from "../features/ViewType";
import { AmountType } from "../features/AmountType";
// import { InteractionType } from "../features/InteractionType";
// import { dateToState } from "../features/ConversionUtil";

// var calendarMatrix = require("calendar-matrix");

// export const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

export const drawCalendar = ({
  table: table,
  // setDisableSubmit: setDisableSubmit,
  question: q,
  // monthDate: monthDate,
  // tableWidthIn: tableWidthIn,
  // showYear: showYear,
  // showAmountOnBar: showAmountOnBar,
  // numIconCol: numIconCol,
  // numIconRow: numIconRow,
  // dragCallback: dragCallback,
  // dispatchCallback: dispatchCallback,
  onClickCallback: onClickCallback,
}) => {
  let selection = { d: -1, a: -1 };
  /*
  var table = svg
    .selectAll(".plot-area")
    .data([null])
    .join("g")
    .attr("class", "plot-area");
  */
  console.log("q: " + JSON.stringify(q, null, 2));
  console.log("q.dateEalier: " + q.dateEarlier);
  console.log("q.dateEalier: " + q.dateLater);
  const date = new Date(q.dateEarlier);
  const dateLater = new Date(q.dateLater);
  console.log("date: " + date);
  console.log("date.getDate(): " + date.getDate());
  const month = [
    //[1, 2, { d: 3, a: q.amountEarlier, k: "earlierAmount" }, 4, 5, 6, 7],
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    //[15, 16, { d: 17, a: q.amountLater }, 18, 19, 20, 21],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31, -1, -2, -3, -4],
  ];
  for (let i = 0; i < month.length; i++) {
    let week = month[i];
    for (let j = 0; j < week.length; j++) {
      let day = week[j];
      if (day === date.getDate()) {
        week[j] = { d: day, a: q.amountEarlier, k: "earlierAmount" };
      } else if (day === dateLater.getDate()) {
        week[j] = { d: day, a: q.amountLater };
      }
    }
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
          if (d.target.__data__.k !== selection.k) {
            if (selection.k === "earlierAmount") {
              onClickCallback(AmountType.earlierAmount);
              body
                .selectAll("#earlierAmount")
                .style("background-color", "steelblue");
            } else {
              onClickCallback(AmountType.laterAmount);
              body
                .selectAll("#laterAmount")
                .style("background-color", "steelblue");
            }
          }
          selection = d.target.__data__;
          // setDisableSubmit(false);
          console.log("click: selection: " + JSON.stringify(selection));
          select(this).style("background-color", "lightblue");
        }
        // TODO add selection mechanism
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
        if (isNaN(d.target.__data__) && d.target.__data__.d != selection.d) {
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

  /*
  console.log(q);
  const dpi = 100; //window.devicePixelRatio >= 2 ? 132 : 96;
  const tableSquareSizeIn = tableWidthIn / 7;
  const tableSquareSizePx = Math.round(tableSquareSizeIn * dpi);

  const monthDays = calendarMatrix(monthDate.toJSDate());

  const monthDaysAmounts = monthDays.map((week) =>
    week.map((day) => {
      const date =
        day <= 0 ? null : DateTime.utc(monthDate.year, monthDate.month, day);
      return {
        day: day,
        amount:
          date === null
            ? null
            : date.toMillis() === q.dateEarlier
            ? q.amountEarlier
            : date.toMillis() === q.dateLater
            ? q.amountLater
            : null,
        type:
          date === null
            ? AmountType.none
            : date.toMillis() === q.dateEarlier
            ? AmountType.earlierAmount
            : date.toMillis() === q.dateLater
            ? AmountType.laterAmount
            : AmountType.none,
        date: date,
      };
    })
  );
  console.log(monthDaysAmounts); // 2-dimensional array of calendar days

  const lastDayOfMonth = Math.max(...[].concat(...monthDays));
  const firstDaysOfWeek = monthDaysAmounts.reduce((acc, cv) => {
    return acc.concat(cv[0].day);
  }, []);

  const yRange = [0, q.maxAmount];

  const iconAmtInc = q.maxAmount / (numIconRow * numIconCol);
  const iconAmtData = range(0, q.maxAmount, iconAmtInc);

  const amtToIconIdx = (a) => Math.floor(a / iconAmtInc);
  var yIcon;
  var xIcon;
  var yBar;

  // TODO fix this hack of -4 on square size.
  const iconSize = (tableSquareSizePx - 4) / numIconRow / 2;

  const thead = table
    .selectAll("#month-head")
    .data([null])
    .join("thead")
    .attr("id", "month-head");

  thead
    .selectAll("#month-head-year-row")
    .data([null])
    .join("tr")
    .attr("id", "month-head-year-row")
    .style("text-align", "center")
    .selectAll("#month-year-cell")
    .data([monthDate])
    .join("td")
    .attr("id", "month-year-cell")
    .attr("style", "font-size: 40px; box-sizing: border-box;") // year title styling
    .attr("colspan", 7)
    .text((d) => `${d.monthLong}${showYear ? " " + d.year : ""}`);
  thead
    .selectAll(".weekday-name-row")
    .data([null])
    .join("tr")
    .attr("class", "weekday-name-row")
    .selectAll(".weekday-name-cell")
    .data(dayNames)
    .join("td")
    .attr("class", "weekday-name-cell")
    .attr(
      "style",
      "font-size: 20px; text-align: center; box-sizing: border-box;" // weekday abbreviation styling (ex. S,M,T,W,T,F,S)
    )
    .text((d) => d);

  const tbody = table
    .selectAll("#calendar-body")
    .data([null])
    .join("tbody")
    .attr("id", "calendar-body");

  const drawBar = (parent, idPrefix, dayAndAmount) => {
    const svg = parent
      .append("svg")
      .data([dayAndAmount], (d) => d.day)
      .attr("id", `${idPrefix}-svg`)
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", `${tableSquareSizePx - 4}`) // TODO how do I get out of doing this math?  Without it, the year view jumps when the svg shifts cells.  I assume the math is incorporating the boarder, passing, etc.
      .attr("height", `${tableSquareSizePx - 4}`)
      .attr("style", "text-align: center");
    svg
      .append("rect")
      .data([dayAndAmount], (d) => d.day)
      .attr("id", `${idPrefix}-rect`)
      .attr("class", "bar")
      .attr("fill", "black")
      .attr("x", "0")
      .attr("y", (d) => yBar(d.amount))
      .attr("width", tableSquareSizePx - 4)
      .attr("height", (d) => {
        const y0 = yBar(0);
        const yamt = yBar(d.amount);
        return y0 - yamt;
      });
    if (showAmountOnBar) {
      svg
        .append("text")
        .data([dayAndAmount], (d) => d.day)
        .attr("id", `${idPrefix}-text`)
        .attr("x", (tableSquareSizePx - 4) / 2)
        .attr("y", (d) => yBar(d.amount))
        .attr("style", "font-size: large; pointer-events: none;")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging")
        .text((d) => format("$,.0f")(d.amount));
    }
  };

  const updateBar = (parent, idPrefix) => {
    parent
      .select(`#${idPrefix}-text`)
      .attr("y", (d) => yBar(d.amount))
      .text((d) => format("$,.0f")(d.amount));
    parent
      .select(`#${idPrefix}-rect`)
      .attr("y", (d) => yBar(d.amount))
      .attr("height", (d) => {
        const y0 = yBar(0);
        const yamt = yBar(d.amount);
        return y0 - yamt;
      });
  };

  const drawWord = (parent, idPrefix, dayAndAmount) => {
    parent
      .append("div")
      .data([dayAndAmount], (d) => d)
      .attr("id", `${idPrefix}-div`)
      .attr("class", "amount-div")
      .attr(
        "style",
        "font-size:12px; position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); font-weight: bold;"
      )
      .text(format("$,.0f")(dayAndAmount.amount));
  };

  const updateWord = (parent, idPrefix) => {
    const selection = parent.select(`#${idPrefix}-div`);
    selection.text((d) => format("$,.0f")(d.amount));
  };

  const drawIcon = (parent, idPrefix, dayAndAmount) => {
    const g = parent
      .append("svg")
      .data([dayAndAmount], (d) => d.day)
      .attr("id", `${idPrefix}-svg`)
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", `${tableSquareSizePx - 4}`) // TODO how do I get out of doing this math?  Without it, the year view jumps when the svg shifts cells.  I assume the math is incorporating the boarder, passing, etc.
      .attr("height", `${tableSquareSizePx - 4}`)
      .attr("style", "text-align: center")
      .append("g")
      .attr("transform", `translate(${iconSize},${iconSize})`);
    g.selectAll(`.${idPrefix}-icon`)
      .data(iconAmtData, (d) => d)
      .join(
        (enter) => {
          enter
            .append("circle")
            .attr("class", `${idPrefix}-circle`)
            .attr("cx", (d) => {
              const iconIdx = amtToIconIdx(d);
              const iconX = xIcon(iconIdx % numIconCol);
              return iconX;
            })
            .attr("cy", (d) => {
              const iconIdx = amtToIconIdx(d);
              const iconY = yIcon(Math.floor(iconIdx / numIconCol));
              return iconY;
            })
            .attr("r", iconSize)
            .attr("fill", (d) => {
              const color = d < dayAndAmount.amount ? "black" : "lightgrey";
              return color;
            })
            .attr(
              "style",
              (d) =>
                `pointer-events: none; stroke: ${
                  d < dayAndAmount.amount ? "black" : "darkgrey"
                };`
            );
        },
        (update) => {
          update
            .select(`.${idPrefix}-icon`)
            .attr("fill", (d) => {
              const color = d < dayAndAmount.amount ? "black" : "lightgrey";
              return color;
            })
            .attr(
              "style",
              (d) =>
                `pointer-events: none; stroke: ${
                  d < dayAndAmount.amount ? "black" : "darkgrey"
                };`
            );
        },
        (exit) => exit.remove()
      );
  };

  // const drawHoverText = (parent, idPrefix, dayAndAmount) => {
  //   parent
  //     .append("span")
  //     .data([dayAndAmount], (d) => d.day)
  //     .attr("id", `${idPrefix}-span`)
  //     .attr("class", "details-hover")
  //     .text(format("$,.0f")(dayAndAmount.amount));
  // };

  // const updateHoverText = (parent, idPrefix) => {
  //   const selection = parent.select(`#${idPrefix}-span`);
  //   selection.text((d) => format("$,.0f")(d.amount));
  // };

  tbody
    .selectAll(".day-rows")
    .data(monthDaysAmounts, (d) => d.day)
    .join("tr")
    .attr("class", "day-rows")
    .selectAll(".day-cells")
    .data(
      (d) => d,
      (d) => JSON.stringify(d)
    )
    .join(
      (enter) => {
        //const tooltip = d3.select(".tooltip-area").style("opacity", 0);
        enter
          .append("td")
          .attr("class", "day-cells")
          .attr("id", (d) =>
            d.type === AmountType.earlierAmount
              ? "earlier-day"
              : d.type === AmountType.laterAmount
              ? "later-day"
              : null
          )
          .attr("width", tableSquareSizePx)
          .attr("height", tableSquareSizePx)
          .attr("style", (d) =>
            d.day > 0
              ? //? "border: 1px solid black; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                `font-size: 1vw; background-color: ${
                  d.type === AmountType.none ? "lightgrey" : "lightgrey"
                }; border: ${
                  d.type === AmountType.none
                    ? "2px solid white; "
                    : "2px solid white; "
                } border-radius: 5px; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;`
              : `border: none;`
          )
          .attr("title", (d) =>
            d.type === AmountType.none ? null : format("$,.0f")(d.amount)
          )
          .on("click", (d) => {
            if (
              q.interaction === InteractionType.titration ||
              q.interaction === InteractionType.none
            ) {
              if (d.target.__data__.type === AmountType.earlierAmount) {
                dispatchCallback(
                  answer({
                    choice: AmountType.earlierAmount,
                    choiceTimestamp: dateToState(DateTime.now()),
                  })
                );
              } else if (d.target.__data__.type === AmountType.laterAmount) {
                dispatchCallback(
                  answer({
                    choice: AmountType.laterAmount,
                    choiceTimestamp: dateToState(DateTime.now()),
                  })
                );
              }
            }
          })
          // .on("mousemove", () => {
          //   tooltip.style("opacity", 1);
          // })
          // .on("mouseleave", () => {
          //   tooltip.style("opacity", 0);
          // })
          // .on("mouseover", (event, d) => {
          //   const text = d3.select(".tooltip-area__text");
          //   text.text(format("$,.0f")(d.amount));
          //   const [x, y] = d3.pointer(event);
          //   tooltip.attr("transform", `translate(${x}, ${y - 20})`);
          // })
          .each(function (d) {
            const td = select(this);
            if (d.day >= 0) {
              td.append("div")
                .attr("style", "font-size: 20px; float: right") // TODO: still fix first day of month font-size
                .attr("class", "day-div")
                .text((d) => {
                  if (d.day <= 0) return "";
                  if (
                    (d.day === 1 ||
                      d.day === lastDayOfMonth ||
                      firstDaysOfWeek.includes(d.day)) &&
                    d.type === AmountType.none
                  )
                    return d.day;
                });
            }
            if (
              d.type === AmountType.earlierAmount ||
              d.type === AmountType.laterAmount
            ) {
              // TODO this is a hack.  Must be a better way.
              yBar = scaleLinear()
                .domain(yRange)
                .range([td.node().clientHeight, 0]);
              yIcon = scaleBand()
                .range([tableSquareSizePx - 4, 0])
                .domain(d3.range(numIconRow));
              xIcon = d3
                .scaleBand()
                .range([0, tableSquareSizePx - 4])
                .domain(d3.range(numIconCol));

              switch (q.viewType) {
                case ViewType.calendarWord:
                  drawWord(
                    td,
                    d.type === AmountType.earlierAmount ? "earlier" : "later",
                    d
                  );
                  break;
                case ViewType.calendarBar:
                  drawBar(
                    td,
                    d.type === AmountType.earlierAmount ? "earlier" : "later",
                    d
                  );
                  break;
                case ViewType.calendarIcon:
                  drawIcon(
                    td,
                    d.type === AmountType.earlierAmount ? "earlier" : "later",
                    d
                  );
                  break;
              }
              // drawHoverText(
              //   td,
              //   d.type === AmountType.earlierAmount ? "earlier" : "later",
              //   d
              // );
            }
          });
      },
      (update) => {
        switch (q.viewType) {
          case ViewType.calendarBar:
            updateBar(update, "earlier");
            updateBar(update, "later");
            // updateHoverText(update, "earlier");
            // updateHoverText(update, "later");
            break;
          case ViewType.calendarWord:
            updateWord(update, "earlier");
            updateWord(update, "later");
            // updateHoverText(update, "earlier");
            // updateHoverText(update, "later");
            break;
          case ViewType.calendarIcon:
            //updateIcon(update, "earlier", update.datum().amount);
            //updateIcon(update, "later", update.datum().amount);
            break;
        }
      },
      (exit) => exit.remove()
    );
  if (q.interaction === InteractionType.drag) {
    var dragHandler = drag().on("drag", function (d) {
      if (d.subject.type === q.variableAmount) {
        const newAmount = yBar.invert(d.y);
        if (newAmount > q.maxAmount) return;
        d.subject.amount = newAmount;
        select(this)
          .attr("y", d.y)
          .attr("height", yBar(0) - d.y);
        dragCallback(d.subject);
        d3.select(
          `#${d.type === AmountType.earlierAmount ? "earlier" : "later"}-text`
        )
          .attr("y", (d) => yBar(d.amount))
          .text(() => format("$,.0f")(d.subject.amount));
      }
    });
    dragHandler(table.selectAll(".bar"));
  }
  */
};
