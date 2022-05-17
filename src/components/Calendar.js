import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";
import { useD3 } from "../hooks/useD3";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import { InteractionType } from "../features/InteractionType";
import { drawCalendar } from "./CalendarHelper";
import { dateToState, stateToDate } from "../features/ConversionUtil";

export function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  var dragAmount = null;

  const result = (
    <div>
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
            drawCalendar({
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
            });
          },
          [q]
        )}
      ></table>
      {q.interaction === InteractionType.drag ? (
        <Formik
          initialValues={{ choice: ChoiceType.Unitialized }}
          validate={() => {
            let errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              dispatch(
                answer({
                  choice: q.variableAmount,
                  choiceTimestamp: dateToState(DateTime.utc()),
                  dragAmount: dragAmount.amount,
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

  if (status === StatusType.Complete) {
    return <Redirect to="/vizsurvey/post-survey" />;
  } else {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
    return result;
  }
}

export default Calendar;
