import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
//import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Container from "@material-ui/core/Container";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { v4 as uuidv4 } from "uuid";
import { Button } from "react-bootstrap";
import "./App.css";
import Introduction from "./components/Introduction";
import Instructions from "./components/Instructions";
import Survey from "./components/Survey";
import PostSurvey from "./components/PostSurvey";
import {
  loadAllTreatments,
  fetchAllTreatments,
  fetchStatus,
  selectAllQuestions,
  writeAnswers,
  setParticipantId,
  clearState,
} from "./features/questionSlice";
import { FileIOAdapter } from "./features/FileIOAdapter";
import { StatusType } from "./features/StatusType";
import { Consent } from "./components/Consent";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Container>
          <Routes>
            {
              // eslint-disable-next-line no-undef
              process.env.REACT_APP_ENV !== "production" ? (
                <Route path="/dev" element={<DevHome />} />
              ) : (
                ""
              )
            }
            <Route path="/" element={<Consent />} />
            <Route path={"introduction"} element={<Introduction />} />
            <Route path={"instruction"} element={<Instructions />} />
            <Route path={"survey"} element={<Survey />} />
            <Route path={"questionaire"} element={<PostSurvey />} />
            <Route path={"thankyou"} element={<ThankYou />} />
            <Route path="*" element={<Consent />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
};

export default App;

const DevHome = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAllTreatments());
  }, []);

  // if (treatmentId === null) {
  //   dispatch(loadAllTreatments());
  // }

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
            <a href="https://github.com/The-Discounters/vizsurvey">
              Github README.md
            </a>
            <br></br>
            <a href="https://github.com/The-Discounters">public website</a>
            <br></br>
            <a href="https://release.d2ptxb5fbsc082.amplifyapp.com/">
              Dev URL Treatment List
            </a>
            <p>
              The prolific url is:
              https://release.d2ptxb5fbsc082.amplifyapp.com/instructions?participant_id=&#123;&#123;%PROLIFIC_PID%&#125;&#125;&treatment_id=&#123;&#123;%STUDY_ID%&#125;&#125;&session_id=&#123;&#123;%SESSION_ID%&#125;&#125;
              ?PROLIFIC_PID=&#123;&#123;%PROLIFIC_PID%&#125;&#125;&STUDY_ID=&#123;&#123;%STUDY_ID%&#125;&#125;&SESSION_ID=&#123;&#123;%SESSION_ID%&#125;&#125;
            </p>
            <p>
              Click a link below to launch one of the experiments. The
              experimental parameters are not setup yet and are configurable
              through a file. Right now these links give a feel for what each
              type of stimulus is like.
            </p>
            <p>
              <Link
                id="1"
                to="/?participant_id=1&treatment_id=1&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 1 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="2"
                to="/?participant_id=1&treatment_id=2&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 2 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="3"
                to="/?participant_id=1&treatment_id=3&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 3 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="4"
                to="/?participant_id=1&treatment_id=4"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 4 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="5"
                to="/?participant_id=1&treatment_id=5&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 5 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="6"
                to="/?participant_id=1&treatment_id=6&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 6 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="7"
                to="/?participant_id=1&treatment_id=7&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 7 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="8"
                to="/?participant_id=1&treatment_id=8&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 8 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="9"
                to="/?participant_id=1&treatment_id=9&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 9 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="10"
                to="/?participant_id=1&treatment_id=10&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 10 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="11"
                to="/?participant_id=1&treatment_id=11&session_id=1"
                onClick={() => {
                  dispatch(clearState());
                }}
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 11 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="12"
                to="/?participant_id=1&treatment_id=12&session_id=1"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 12 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="13"
                to="/?participant_id=1&treatment_id=13&session_id=1"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 13 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="14"
                to="/?participant_id=1&treatment_id=14&session_id=1"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 14 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="15"
                to="/?participant_id=1&treatment_id=15&session_id=1"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 15 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="16"
                to="/?participant_id=1&treatment_id=16&session_id=1"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 16 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="17"
                to="/?participant_id=1&treatment_id=17&session_id=1"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 17 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="18"
                to="/?participant_id=1&treatment_id=18&session_id=1"
              >
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

  return <div id="home-text">{testLinks()}</div>;
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

const uuid = uuidv4();
const ThankYou = () => {
  const dispatch = useDispatch();
  dispatch(setParticipantId(uuid));
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  dispatch(writeAnswers(csv));
  const handle = useFullScreenHandle();

  return (
    <FullScreen handle={handle}>
      <div id="home-text" style={divCenterContentStyle}>
        <p>
          Your answers have been submitted. Thank you for taking this survey!
        </p>
        <p>
          Your unique ID is:&nbsp;
          <input type="text" value={uuid} style={{ width: "340px" }} readOnly />
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
