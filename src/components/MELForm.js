import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";

export function MELForm() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);
  const navigate = useNavigate();

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;

  const todayText = (sooner_time) =>
    sooner_time === 0 ? "today" : `in ${sooner_time} weeks`;

  function questionText() {
    return `Make a choice to received ${question1stPartText()} or ${question2ndPartText()}`;
  }

  function question1stPartText() {
    return `$${q.amountEarlier} ${todayText(q.timeEarlier)}`;
  }

  function question2ndPartText() {
    return `$${q.amountLater} in ${q.timeLater} weeks`;
  }

  const result = (
    <div
      width={`${Math.round(q.widthIn * dpi)}px`}
      height={`${Math.round(q.heightIn * dpi)}px`}
      overflow="hidden"
    >
      <Formik
        initialValues={{ choice: ChoiceType.unitialized }}
        validate={(values) => {
          let errors = {};
          if (!values.choice || values.choice === ChoiceType.unitialized) {
            errors.choice = "Please choose a selection to continue.";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            dispatch(
              answer({
                choice: values.choice,
                choiceTimestamp: dateToState(DateTime.utc()),
              })
            );
            setSubmitting(false);
            resetForm();
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div
              role="group"
              aria-labelledby="my-radio-group"
              className="radio-choice-label"
            >
              <p>{questionText()} </p>
              <label>
                <Field type="radio" name="choice" value={ChoiceType.earlier} />
                &nbsp;{question1stPartText()}
              </label>
              <br></br>
              <label>
                <Field type="radio" name="choice" value={ChoiceType.later} />
                &nbsp;{question2ndPartText()}
              </label>
              <span style={{ color: "red", fontWeight: "bold" }}>
                <ErrorMessage name="choice" component="div" />
              </span>
            </div>
            <Button id="submit" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );

  if (status === StatusType.Complete) {
    navigate("/post-survey");
  } else {
    // TODO fix this so timezone is UTC
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
    return result;
  }
}

export default MELForm;
