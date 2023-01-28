import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useNavigate,
  useSearchParams,
  BrowserRouter,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { Typography } from "@mui/material";
//import { redirect } from "react-router-dom";
import { Container } from "@material-ui/core";
import "./App.css";
import { navigateFromStatus } from "./components/Navigate";
import Introduction from "./components/Introduction";
import Demographic from "./components/Demographic";
import Instructions from "./components/Instructions";
import Survey from "./components/Survey";
import PostSurveyFinancialLit from "./components/PostSurveyFinancialLit";
import PostSurveySenseOfPurpose from "./components/PostSurveySenseOfPurpose";
import AttentionCheck from "./components/AttentionCheck";
import Debrief from "./components/Debrief";
import TheEnd from "./components/TheEnd";
import InvalidSurveyLink from "./components/InvalidSurveyLink";
import {
  loadAllTreatments,
  fetchAllTreatments,
  getStatus,
  clearState,
  genRandomTreatment,
  setSessionId,
  setParticipantId,
  setTreatmentId,
  setStudyId,
  setUserAgent,
  loadTreatment,
  nextStatus,
} from "./features/questionSlice";
import { StatusType } from "./features/StatusType";
import { Consent } from "./components/Consent";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return <InvalidSurveyLink />;
    }
    // Normally, just render children
    return this.props.children;
  }
}

const App = () => {
  return (
    <div>
      <ErrorBoundary>
        <BrowserRouter>
          <Container>
            <Routes>
              {process.env.REACT_APP_ENV !== "production" ? (
                <Route path="dev" element={<DevHome />} />
              ) : (
                ""
              )}
              <Route path="start" element={<GenTreatmentId />} />
              <Route path={"consent"} element={<Consent />} />
              <Route path={"demographic"} element={<Demographic />} />
              <Route path={"introduction"} element={<Introduction />} />
              <Route path={"instruction"} element={<Instructions />} />
              <Route path={"survey"} element={<Survey />} />
              <Route
                path={"financialquestionaire"}
                element={<PostSurveyFinancialLit />}
              />
              <Route
                path={"purposequestionaire"}
                element={<PostSurveySenseOfPurpose />}
              />
              <Route path={"attentioncheck"} element={<AttentionCheck />} />
              <Route path={"theend"} element={<TheEnd />} />
              <Route path={"debrief"} element={<Debrief />} />
              <Route path={"invalidlink"} element={<InvalidSurveyLink />} />
              <Route path="*" element={<InvalidSurveyLink />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
};

const GenTreatmentId = () => {
  const status = useSelector(getStatus);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    var treatmentId = searchParams.get("treatment_id");
    if (!treatmentId) {
      dispatch(genRandomTreatment());
    } else {
      dispatch(setTreatmentId(treatmentId));
    }
    dispatch(setSessionId(searchParams.get("session_id")));
    dispatch(setParticipantId(searchParams.get("participant_id")));
    dispatch(setStudyId(searchParams.get("study_id")));
    dispatch(setUserAgent(navigator.userAgent));
    dispatch(nextStatus());
    dispatch(loadTreatment());
    dispatch(nextStatus());
  }, []);

  useEffect(() => {
    if (status != StatusType.Unitialized && status != StatusType.Fetching) {
      const path = navigateFromStatus(status);
      navigate(path);
    }
  }, [status]);

  return (
    <React.Fragment>
      <Typography paragraph>The application is initializing.</Typography>
    </React.Fragment>
  );
};

const DevHome = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAllTreatments());
  }, []);

  const status = useSelector(getStatus);
  const allTreatments = useSelector(fetchAllTreatments);

  function testLinks() {
    return (
      <div key="testlinks-parent">
        <p>
          This page will not be available when deployed in production since the
          participants will be provided a link with the treatment id in the URL.
        </p>
        {status === StatusType.Unitialized ? (
          <p>Please wait while all treatments are loaded...</p>
        ) : (
          <div key="testlinks-list">
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
              https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=&#123;&#123;%PROLIFIC_PID%&#125;&#125;&study_id=&#123;&#123;%STUDY_ID%&#125;&#125;&session_id=&#123;&#123;%session_id%&#125;&#125;
            </p>
            <p>
              An example is
              https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&study_id=2&session_id=3
            </p>
            <p>
              And for localhost with the treatment id being randomly determined
              http://localhost:3000/start?participant_id=1&study_id=2&session_id=3
            </p>
            <p>
              Click a link below to launch one of the experiments. The
              experimental parameters are not setup yet and are configurable
              through a file. Right now these links give a feel for what each
              type of stimulus is like.
            </p>
            <p>
              <b>
                Teest treatments are listed below for the different
                configuraiton scenarios.
              </b>
            </p>
            <p>
              <Link
                id="1"
                to="/start?participant_id=1&treatment_id=1&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=2&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=3&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=4&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=5&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=6&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=7&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=8&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=9&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=10&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=11&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=12&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=13&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=14&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=15&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=16&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=17&study_id=2&session_id=3"
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
                to="/start?participant_id=1&treatment_id=18&study_id=2&session_id=3"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 18 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="19"
                to="/start?participant_id=1&treatment_id=19&study_id=2&session_id=3"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 19 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <b>Production treatments are listed below.</b>
            </p>
            <p>
              <Link
                id="20"
                to="/start?participant_id=1&treatment_id=20&study_id=2&session_id=3"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 20 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="21"
                to="/start?participant_id=1&treatment_id=21&study_id=2&session_id=3"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 21 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link
                id="22"
                to="/start?participant_id=1&treatment_id=22&study_id=2&session_id=3"
              >
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 22 && d.position === 1
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

export default App;
