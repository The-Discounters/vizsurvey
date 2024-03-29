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
import ChoiceInstructions from "./components/ChoiceInstructions.jsx";
import Demographic from "./components/Demographic.jsx";
import Instructions from "./components/Instructions.jsx";
import Survey from "./components/Survey.jsx";
import PostSurveyExperience from "./components/PostSurveyExperience.jsx";
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
  console.log(chalk.yellow(`Running for ${process.env.REACT_APP_ENV}`));
  return (
    <div>
      <Container>
        <ErrorBoundary>
          <Routes>
            <Route path="/start" element={<GenTreatmentId />} />
            <Route path="/consent" element={<Consent />} />
            <Route path="/demographic" element={<Demographic />} />
            <Route
              path="/choiceinstructions"
              element={<ChoiceInstructions />}
            />
            <Route path="/instruction" element={<Instructions />} />
            <Route path="/survey" element={<Survey />} />
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
    </div>
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
  console.log("in DevHome");
  const dispatch = useDispatch();
  return (
    <div id="home-text">
      <div key="testlinks-parent">
        <p>
          This page will not be available when deployed in production since the
          participants will be provided a link with the treatment id in the URL.
        </p>
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
            An example for production is where participant_id must be unique for
            the study_id
            https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&study_id=2&session_id=3
          </p>
          <p>
            And for staging is where participant_id must be unique for the
            study_id
            https://staging.d2ptxb5fbsc082.amplifyapp.com/start??participant_id=1&session_id=4&study_id=testbetween
          </p>
          <p>
            And for localhost with the particpant_id must be unique for the
            study_id
            https://localhost:3000/start?participant_id=1&study_id=2&session_id=3
          </p>
          <p>
            Click a link below to launch one of the experiments. The
            experimental parameters are not setup yet and are configurable
            through a file. Right now these links give a feel for what each type
            of stimulus is like.
          </p>
          <p>
            <b>
              Refactored google functions back end treatment links are listed
              below.
            </b>
          </p>
          <p>
            <Link
              id="1"
              to={`/start?participant_id=${getRandomIntInclusive(
                0,
                1000000
              )}&study_id=testbetween&session_id=3`}
              onClick={() => {
                dispatch(clearState());
              }}
            >
              Between subject barchart experiment with production values used in
              thesis and CHI paper.
            </Link>
          </p>
          <p>
            <Link
              id="1"
              to={`/start?participant_id=${getRandomIntInclusive(
                0,
                1000000
              )}&study_id=testwithin&session_id=3`}
              onClick={() => {
                dispatch(clearState());
              }}
            >
              Within subject bar chart experiment with production values used in
              thesis and CHI paper.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
