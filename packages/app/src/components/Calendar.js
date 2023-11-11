import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import {
  getCurrentQuestion,
  getStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice.js";
import { useD3 } from "../hooks/useD3.js";
import { AmountType } from "../features/AmountType.js";
import { StatusType } from "../features/StatusType.js";
import { InteractionType } from "../features/InteractionType.js";
import { drawCalendar } from "./CalendarHelper.js";
import { dateToState, stateToDate } from "../features/ConversionUtil.js";

export function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(getCurrentQuestion);
  const status = useSelector(getStatus);
  const navigate = useNavigate();

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
          initialValues={{ choice: AmountType.none }}
          validate={() => {
            let errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              dispatch(
                answer({
                  choice: q.variableAmount,
                  choiceTimestamp: dateToState(DateTime.now()),
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

  if (status === StatusType.FinancialQuestionaire) {
    navigate("/questionaire");
  } else {
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
  }
  return result;
}

export default Calendar;
