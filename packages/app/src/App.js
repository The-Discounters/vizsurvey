import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useNavigate,
  useSearchParams,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { Container } from "@mui/material";
import chalk from "chalk";
import "./App.css";
import { navigateFromStatus } from "./components/Navigate.js";
import MELQuestionInstructions from "./components/MELQuestionInstructions.jsx";
import Demographic from "./components/Demographic.jsx";
import Instructions from "./components/Instructions.jsx";
import MELSurvey from "./components/MELSurvey.jsx";
import PostSurveyExperience from "./components/PostSurveyExperience.jsx";
import Break from "./components/Break.jsx";
import PostSurveyFinancialLit from "./components/PostSurveyFinancialLit.jsx";
import Debrief from "./components/Debrief.jsx";
import Finished from "./components/Finished.jsx";
import Spinner from "./components/Spinner.js";
import InvalidSurveyLink from "./components/InvalidSurveyLink.jsx";
import {
  getStatus,
  clearState,
  initializeSurvey,
} from "./features/questionSlice.js";
import { StatusType } from "@the-discounters/types";
import { Consent } from "./components/Consent.jsx";
import { getRandomIntInclusive } from "@the-discounters/util";

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
  console.log(
    chalk.yellow(
      `Running for ${process.env.REACT_APP_ENV}, app version ${process.env.REACT_APP_VERSION}`
    )
  );
  return (
    <Container maxWidth={false} disableGutters>
      <ErrorBoundary>
        <Routes>
          <Route path="/start" element={<GenTreatmentId />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/demographic" element={<Demographic />} />
          <Route
            path="/melquestioninstructions"
            element={<MELQuestionInstructions />}
          />
          <Route path="/instruction" element={<Instructions />} />
          <Route path="/survey" element={<MELSurvey />} />
          <Route path="/break" element={<Break />} />
          <Route
            path="/experiencequestionaire"
            element={<PostSurveyExperience />}
          />
          <Route
            path="/financialquestionaire"
            element={<PostSurveyFinancialLit />}
          />
          <Route path="/debrief" element={<Debrief />} />
          <Route path="/finished" element={<Finished />} />
          <Route path="/invalidlink" element={<InvalidSurveyLink />} />
          <Route
            path="*"
            element={
              process.env.REACT_APP_ENV !== "production" ? (
                <DevHome />
              ) : (
                <InvalidSurveyLink />
              )
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

const GenTreatmentId = () => {
  const status = useSelector(getStatus);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      initializeSurvey({
        treatmentId: searchParams.get("treatment_id"),
        sessionId: searchParams.get("session_id"),
        participantId: searchParams.get("participant_id"),
        studyId: searchParams.get("study_id"),
        userAgent: navigator.userAgent,
        treatmentIds: searchParams.get("treatment_ids"),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== StatusType.Unitialized && status !== StatusType.Fetching) {
      const path = navigateFromStatus(status);
      navigate(path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return <Spinner text="The application is initializing..." />;
};

const DevHome = () => {
  const dispatch = useDispatch();
  return (
    <div id="home-text">
      <div key="testlinks-parent">
        <p>
          This page will not be available when deployed in production since the
          participants will be provided a link with the treatment id in the URL.
          The links below are provided for convience in testing in non
          production environments. Click a link below to launch one of the
          experiments
        </p>
        <div key="testlinks-list">
          <p>
            <b>Test Links</b>
          </p>

          <table style={{ border: "1px solid black" }}>
            <tbody>
              <tr style={{ border: "1px solid black" }}>
                <th style={{ border: "1px solid black" }}>Environment</th>
                <th style={{ border: "1px solid black" }}>Within Subject</th>
                <th style={{ border: "1px solid black" }}>Between Subject</th>
                <th style={{ border: "1px solid black" }}>Word</th>
                <th style={{ border: "1px solid black" }}>Barchart</th>
                <th style={{ border: "1px solid black" }}>Barchart Extended</th>
              </tr>
              <tr style={{ border: "1px solid black" }}>
                <td style={{ border: "1px solid black" }}>development</td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="1"
                    to={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testwithin&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Within Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="2"
                    to={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="3"
                    to={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="4"
                    to={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="5"
                    to={`https://main.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </Link>
                </td>
              </tr>
              <tr style={{ border: "1px solid black" }}>
                <td style={{ border: "1px solid black" }}>localhost</td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="1"
                    to={`https:localhost:3000/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testwithin&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Within Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="2"
                    to={`https:localhost:3000/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="3"
                    to={`https:localhost:3000/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="4"
                    to={`https:localhost:3000/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="5"
                    to={`https:localhost:3000/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </Link>
                </td>
              </tr>
              <tr style={{ border: "1px solid black" }}>
                <td style={{ border: "1px solid black" }}>staging</td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="1"
                    to={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testwithin&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Within Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="2"
                    to={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="3"
                    to={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="4"
                    to={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="5"
                    to={`https://staging.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </Link>
                </td>
              </tr>
              <tr style={{ border: "1px solid black" }}>
                <td style={{ border: "1px solid black" }}>production</td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="1"
                    to={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testwithin&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Within Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="2"
                    to={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Between Subject.
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="3"
                    to={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B1%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Word
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="4"
                    to={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B2%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart
                  </Link>
                </td>
                <td style={{ border: "1px solid black" }}>
                  <Link
                    id="5"
                    to={`https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=${getRandomIntInclusive(
                      0,
                      1000000
                    )}&study_id=testbetween&session_id=3&treatment_ids=%5B3%5D`}
                    onClick={() => {
                      dispatch(clearState());
                    }}
                  >
                    Bar Chart Extended
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <b>Reference Information</b>
          </p>
          <a href="https://github.com/The-Discounters/vizsurvey">
            Github README.md
          </a>
          <br></br>
          <a href="https://github.com/The-Discounters">public website</a>
          <p></p>
          <p>
            The prolific production url is:
            https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=&#123;&#123;%PROLIFIC_PID%&#125;&#125;&study_id=&#123;&#123;%STUDY_ID%&#125;&#125;&session_id=&#123;&#123;%session_id%&#125;&#125;
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
