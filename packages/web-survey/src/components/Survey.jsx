import { useSelector } from "react-redux";
import MELForm from "./MELForm.jsx";
import BarChart from "./BarChart.js";
import Calendar from "./Calendar.js";
import { ViewType } from "@the-discounters/domain/src/ViewType";
import { getCurrentQuestion } from "../features/questionSlice.js";

export function Survey() {
  const q = useSelector(getCurrentQuestion);

  // Got from https://stackoverflow.com/questions/31217268/center-div-on-the-middle-of-screen
  const divCenterContentStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={divCenterContentStyle}>
      {(() => {
        switch (q.viewType) {
          case ViewType.barchart:
            return <BarChart />;
          case ViewType.word:
            return <MELForm />;
          case ViewType.calendarBar:
          case ViewType.calendarIcon:
          case ViewType.calendarWord:
          case ViewType.calendarWordYear:
          case ViewType.calendarWordYearDual:
            /*
            if (
              stateToDate(q.dateLater)
                .diff(stateToDate(q.dateEarlier), "months")
                .toObject().months <= 1
            ) {
*/
            return <Calendar />;
          /*
            }
            return <CalendarYear />;
*/
        }
      })()}
    </div>
  );
}

export default Survey;
