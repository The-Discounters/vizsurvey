import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { v4 as uuidv4 } from "uuid";
import { Button } from "react-bootstrap";
import "./App.css";
import Survey from "./components/Survey";
import { QueryParam } from "./components/QueryParam";
import { selectAllQuestions, writeAnswers } from "./features/questionSlice";
import { ViewType } from "./features/ViewType";
//import { selectCurrentTreatment } from "./features/questionSlice";
import { selectCurrentQuestion } from "./features/questionSlice";
import { Footer } from "./footer";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <QueryParam />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/survey" component={Survey} />
            <Route path="/thankyou" component={ThankYou} />
            <Route path="/*" component={Home} />
          </Switch>
          <Footer className="footer bg-dark" />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

var handle = undefined;
const Home = () => {
  //const QandA = useSelector(selectCurrentTreatment);
  const QandA = useSelector(selectCurrentQuestion);
  console.log(QandA);
  handle = useFullScreenHandle();
  return (
    <div id="home-text">
      <p>
        {QandA === undefined || QandA === null ? (
          <span>
            Cannot display <b>common</b> instructions since a treatment has not
            been selected. Please select a treatment
          </span>
        ) : (
          <span>
            You will be presented with two choices about receiving money, one
            earlier and one later in time.
          </span>
        )}
        {QandA === undefined || QandA === null ? (
          <span>
            Cannot display <b>specific</b> instructions since a treatment has
            not been selected. Please select a treatment
          </span>
        ) : QandA.viewType === ViewType.barchart ? (
          <span>
            Click on the bar that represents the amount that you would like to
            receive.
          </span>
        ) : QandA.viewType === ViewType.word ? (
          <span>
            Click on the radio button that contains the amount you would like to
            receive.
          </span>
        ) : (
          <span>
            Click on the day that contains the amount that you would like to
            receive.
          </span>
        )}
      </p>
      {QandA === undefined || QandA === null ? (
        <div>
          <p>
            Cannot display <b>Start Survey button</b> since a treatment has not
            been selected. Please select a treatment
          </p>
          <p>
            <a
              href="
        https://github.com/pcordone/vizsurvey"
            >
              Github README.md
            </a>
          </p>
          <p>
            <a id="getQuestionSet" href="vizsurvey?treatment_id=1">
              relative treatment_id=1
            </a>
          </p>
          <p>
            <a href="https://pcordone.github.io">public website</a>
          </p>
        </div>
      ) : (
        <FullScreen handle={handle}>
          <Link to="/survey">
            <Button size="lg" onClick={handle.enter}>
              Start Survey
            </Button>
          </Link>
        </FullScreen>
      )}
    </div>
  );
};

function convertToCSV(answers) {
  const header = [
    "treatment_id,position,amount_earlier,time_earlier,amount_later,time_later,choice,answer_time,participant_id",
  ];
  const rows = answers.map(
    (a) =>
      `${a.treatmentId}, ${a.position}, ${a.amountEarlier}, ${a.timeEarlier}, ${a.amountLater}, ${a.timeLater}, ${a.choice}, ${a.answerTime}, ${a.participantId}`
  );
  return header.concat(rows).join("\n");
}

const ThankYou = () => {
  const dispatch = useDispatch();
  const allQuestions = useSelector(selectAllQuestions);
  const csv = convertToCSV(allQuestions);
  console.log(csv);
  dispatch(writeAnswers(csv));
  handle = useFullScreenHandle();

  const uuid = uuidv4();
  return (
    <FullScreen handle={handle}>
      <div>
        <p>
          Your answers have been submitted. Thank you for taking this survey!
        </p>
        <p>
          Your unique ID is: {uuid}. Please go back to Amazon Turk and present
          this unique ID in the form.
        </p>
        <Button
          size="lg"
          onClick={() => {
            handle.enter();
            setTimeout(() => {
              handle.exit();
            }, 400);
          }}
        >
          Exit Fullscreen
        </Button>
      </div>
    </FullScreen>
  );
};
