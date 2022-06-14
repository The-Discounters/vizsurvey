import MELForm from "./MELForm";
import BarChart from "./BarChart";
import Calendar from "./Calendar";
import CalendarYear from "./CalendarYear";
import { useSelector } from "react-redux";
import { ViewType } from "../features/ViewType";
import { selectCurrentQuestion } from "../features/questionSlice";
import { stateToDate } from "../features/ConversionUtil";

export function Survey() {
  const q = useSelector(selectCurrentQuestion);

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
            if (
              stateToDate(q.dateLater)
                .diff(stateToDate(q.dateEarlier), "months")
                .toObject().months <= 1
            ) {
              return <Calendar />;
            }
            return <CalendarYear />;
        }
      })()}
    </div>
  );
}

export default Survey;
