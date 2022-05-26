import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
//import { v4 as uuidv4 } from "uuid";
import { Button } from "react-bootstrap";
import "./App.css";
import Survey from "./components/Survey";
import PostSurvey from "./components/PostSurvey";
import { QueryParam } from "./components/QueryParam";
import {
  loadAllTreatments,
  loadTreatment,
  fetchAllTreatments,
  fetchStatus,
  //selectAllQuestions,
  //selectAllPostSurveyAnswers,
  startSurvey,
  //writeAnswers,
  getParticipant,
} from "./features/questionSlice";
import { ViewType } from "./features/ViewType";
import { InteractionType } from "./features/InteractionType";
//import { FileIOAdapter } from "./features/FileIOAdapter";
import {
  fetchTreatmentId,
  fetchCurrentTreatment,
} from "./features/questionSlice";
import { StatusType } from "./features/StatusType";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <QueryParam />
          <Switch>
            <Route exact path="/vizsurvey" component={Home} />
            <Route
              exact
              path={"/vizsurvey/instructions"}
              component={Instructions}
            />
            <Route path="/vizsurvey/survey" component={Survey} />
            <Route path="/vizsurvey/post-survey" component={PostSurvey} />
            <Route path="/vizsurvey/thankyou" component={ThankYou} />
            <Route path="/vizsurvey/*" component={Home} />
            <Route path="/*" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

const Home = () => {
  const treatmentId = useSelector(fetchTreatmentId);
  const dispatch = useDispatch();

  // eslint-disable-next-line no-undef
  if (process.env.REACT_APP_ENV !== "production") {
    if (treatmentId === null) {
      dispatch(loadAllTreatments());
    }
  }

  const status = useSelector(fetchStatus);
  const allTreatments = useSelector(fetchAllTreatments);

  function testLinks() {
    return (
      <div>
        <p>
          This page will not be available when deployed in production since the
          participants will be provided a link with the treatment id in the URL.
        </p>
        {status === StatusType.Unitialized ? (
          <p>Please wait while all treatments are loaded...</p>
        ) : (
          <div>
            <a href="https://github.com/pcordone/vizsurvey">Github README.md</a>
            <br></br>
            <a href="https://github.com/pcordone">public website</a>
            <br></br>
            <p>
              Click a link below to launch one of the experiments. The
              experimental parameters are not setup yet and are configurable
              through a file. Right now these links give a feel for what each
              type of stimulus is like.
            </p>
            <p>
              <Link id="1" to="/vizsurvey/instructions?treatment_id=1">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 1 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="2" to="/vizsurvey/instructions?treatment_id=2">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 2 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="3" to="/vizsurvey/instructions?treatment_id=3">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 3 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="4" to="/vizsurvey/instructions?treatment_id=4">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 4 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="5" to="/vizsurvey/instructions?treatment_id=5">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 5 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="6" to="/vizsurvey/instructions?treatment_id=6">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 6 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="7" to="/vizsurvey/instructions?treatment_id=7">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 7 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="8" to="/vizsurvey/instructions?treatment_id=8">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 8 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="9" to="/vizsurvey/instructions?treatment_id=9">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 9 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="10" to="/vizsurvey/instructions?treatment_id=10">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 10 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="11" to="/vizsurvey/instructions?treatment_id=11">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 11 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="12" to="/vizsurvey/instructions?treatment_id=12">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 12 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="13" to="/vizsurvey/instructions?treatment_id=13">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 13 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="14" to="/vizsurvey/instructions?treatment_id=14">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 14 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="15" to="/vizsurvey/instructions?treatment_id=15">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 15 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="16" to="/vizsurvey/instructions?treatment_id=16">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 16 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="17" to="/vizsurvey/instructions?treatment_id=17">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 17 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="18" to="/vizsurvey/instructions?treatment_id=18">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 18 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="home-text">
      {treatmentId === null ? (
        // eslint-disable-next-line no-undef
        process.env.REACT_APP_ENV !== "production" ? (
          testLinks()
        ) : (
          "You were provided a bad survey link.  Please report this error to todo@todo.com"
        )
      ) : (
        <Redirect to={`/vizsurvey/instructions?treatment_id=${treatmentId}`} />
      )}
    </div>
  );
};

const divCenterContentStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "500px",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
};

const buttonCenterContentStyle = {
  position: "absolute",
  left: "50%",
  marginRight: "-50%",
  transform: "translate(-50%, 0%)",
};

const Instructions = () => {
  var handle = useFullScreenHandle();
  const dispatch = useDispatch();
  const treatmentId = useSelector(fetchTreatmentId);
  dispatch(loadTreatment(treatmentId));
  const treatment = useSelector(fetchCurrentTreatment);
  function surveyButtonClicked() {
    dispatch(startSurvey());
    handle.enter();
  }

  const startSurveyLink = (
    <Link to="/vizsurvey/survey">
      <Button
        size="lg"
        onClick={surveyButtonClicked}
        style={buttonCenterContentStyle}
        id="start-survey"
      >
        Start Survey
      </Button>
    </Link>
  );
  return (
    <div id="home-text" style={divCenterContentStyle}>
      <p>
        You will be presented with a choice between two amounts of money to
        recieve, one earlier and one later in time.
      </p>
      <span>
        {(() => {
          switch (treatment.viewType) {
            case ViewType.word:
              return `Click on the radio button that contains the amount you would like to
                    receive.`;
            case ViewType.barchart:
              switch (treatment.interaction) {
                case InteractionType.titration:
                  return `Click on the bar that represents the amount that you would like to
                        receive.  For each click, the amounts will be updated. Continue to
                        click to choose an earlier and later amount.`;
                case InteractionType.drag:
                  return `Drag the bar to an amount that makes choosing the earlier option
                        equal to the later option. Note that these amounts do not have to
                        be literally equal dollar amounts (e.g. you would rather have $10
                        today than even $20 a year from now).`;
                case InteractionType.none:
                  return `Click on the bar graph that represents the amount that you would
                        like to choose.`;
                default:
                  return `Can not display <b>specific</b> instructions since the interaction 
                        type was not specified in the experiment setup/`;
              }
            case ViewType.calendarBar:
              return `Click on the day that contains the amount that you would like to
                    receive.`;
            case ViewType.calendarWord:
              return `Provide calendar word instructions`;
            case ViewType.calendarIcon:
              return `Provide calendar icon grap instructions`;
            default:
              return `Cannot display <b>specific</b> instructions since a treatment has not
                    been selected. Please select a treatment`;
          }
        })()}
      </span>
      {process.env.REACT_APP_FULLSCREEN === "enabled" ? (
        <FullScreen handle={handle}>${startSurveyLink}</FullScreen>
      ) : (
        startSurveyLink
      )}
    </div>
  );
};

const ThankYou = () => {
  //const dispatch = useDispatch();
  // const answers = useSelector(selectAllQuestions);
  const uuid = useSelector(getParticipant);
  // const io = new FileIOAdapter();
  // const csv = io.convertToCSV(answers);
  /*
  dispatch(
    writeAnswers({
      csv: csv,
      uuid: uuid,
      postSurveyAnswers: postSurveyAnswers,
    })
  );
*/
  const handle = useFullScreenHandle();

  return (
    <FullScreen handle={handle}>
      <div id="home-text" style={divCenterContentStyle}>
        <p>
          Your answers have been submitted. Thank you for taking this survey!
        </p>
        <p>
          Your unique ID is:&nbsp;
          <input
            id="uuid"
            type="text"
            value={uuid}
            style={{ width: "340px" }}
            readOnly
          />
          &nbsp;
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(uuid);
            }}
          >
            Copy
          </Button>
          . Please go back to Amazon Turk and present this unique ID in the
          form.
        </p>
        <Button
          size="lg"
          onClick={() => {
            handle.enter();
            setTimeout(() => {
              handle.exit();
            }, 400);
          }}
          style={buttonCenterContentStyle}
        >
          Exit Fullscreen
        </Button>
      </div>
    </FullScreen>
  );
};
