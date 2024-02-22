import { FormControl, FormHelperText } from "@mui/material";
import { useD3 } from "../hooks/useD3.js";
import { drawCalendar } from "./CalendarHelper.js";
import { drawCalendarYear } from "./CalendarYearHelper.js";
import { drawCalendarYearDual } from "./CalendarYearDualHelper.js";
import { ViewType } from "@the-discounters/types";

export const MELCalendarComponent = (props) => {
  return (
    <FormControl variant="standard" required={false} error={props.error}>
      <FormHelperText>{props.helperText}</FormHelperText>
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
            switch (props.viewType) {
              case ViewType.calendarWord:
                drawCalendar({
                  table: table,
                  onClickCallback: (value) => {
                    props.onClickCallback(value);
                  },
                  choice: props.choice,
                  qDateEarlier: props.dateEarlier,
                  qDateLater: props.dateLater,
                  qAmountEarlier: props.amountEarlier,
                  qAmountLater: props.amountLater,
                  monthNumber: new Date(props.dateEarlier).getMonth(),
                });
                break;
              case ViewType.calendarWordYear:
                drawCalendarYear({
                  table: table,
                  onClickCallback: (value) => {
                    props.onClickCallback(value);
                  },
                  choice: props.choice,
                  qDateEarlier: props.dateEarlier,
                  qDateLater: props.dateLater,
                  qAmountEarlier: props.amountEarlier,
                  qAmountLater: props.amountLater,
                });
                break;
              case ViewType.calendarWordYearDual:
                drawCalendarYearDual({
                  table: table,
                  onClickCallback: (value) => {
                    props.onClickCallback(value);
                  },
                  choice: props.choice,
                  qDateEarlier: props.dateEarlier,
                  qDateLater: props.dateLater,
                  qAmountEarlier: props.amountEarlier,
                  qAmountLater: props.amountLater,
                });
                break;
              default:
                return "";
            }
          },
          [props.choice]
        )}
      ></table>
    </FormControl>
  );
};
