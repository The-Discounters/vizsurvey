import { Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ChoiceType } from "../features/ChoiceType";
import { POST_SURVEY_QUESTIONS } from "../features/postsurveyquestions";
import { useHistory } from "react-router-dom";

const divCenterContentStyle1 = {
  position: "absolute",
  left: "50%",
  width: "500px",
  marginRight: "-50%",
  transform: "translate(-50%, 0%)",
};

export function PostSurvey() {
  //const dispatch = useDispatch();

  const history = useHistory();
  const routeChange = () => {
    let path = `/vizsurvey/thankyou`;
    history.push(path);
  };

  const questions = POST_SURVEY_QUESTIONS;
  return (
    <div id="home-text" style={divCenterContentStyle1}>
      <Formik
        initialValues={questions.reduce((result, currentObj) => {
          result["choice" + currentObj.question.textShort] =
            ChoiceType.unitialized;
          return result;
        }, {})}
        validate={(values) => {
          return questions.reduce((errors, currentObj) => {
            const key = "choice" + currentObj.question.textShort;
            if (!values[key] || values[key] === ChoiceType.unitialized) {
              errors[key] = "Please choose a selection to continue.";
            }
            return errors;
          }, {});
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            /*dispatch(
              answer({
                choice: values.choice,
                choiceTimestamp: dateToState(DateTime.utc()),
              })
            );*/
            setSubmitting(false);
            resetForm();
            routeChange();
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {questions.map(({ question, options }, index) => (
              <div key={index}>
                <div
                  role={"group" + index}
                  aria-labelledby={"my-radio-group" + index}
                  className="radio-choice-label"
                >
                  <p>{index + 1 + ". " + question.textFull}</p>
                  {options.map((option, index1) => (
                    <div key={index1}>
                      <label>
                        <Field
                          type="radio"
                          name={"choice" + question.textShort}
                          value={"value" + option.textShort}
                        />
                        &nbsp;{option.textFull}
                      </label>
                      <br />
                    </div>
                  ))}
                  <label>
                    <Field
                      type="radio"
                      name={"choice" + question.textShort}
                      value="unsure"
                    />
                    &nbsp;Do not know
                  </label>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    <ErrorMessage
                      name={"choice" + question.textShort}
                      component="div"
                    />
                  </span>
                </div>
                <br />
                <div className="post-survey-separator"></div>
                <br />
              </div>
            ))}
            <Button id="submit" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
            <br />
            <br />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default PostSurvey;
