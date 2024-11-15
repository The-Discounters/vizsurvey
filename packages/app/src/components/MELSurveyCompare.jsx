import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider, Box } from "@mui/material";
import { AmountType } from "@the-discounters/types";
import { useTranslation } from "react-i18next";

import { useKeyDown } from "../hooks/useKeydown.js";
import { MELBarChartComponent } from "./MELBarChartComponent.js";
import { theme } from "./ScreenHelper.js";
import Spinner from "./Spinner.js";

import {
  initFirestore,
  readExperimentConfigurations,
} from "../features/serviceAPI.js";

export function MELSurveyCompare() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [compareMessage, setCompareMessage] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choice, setChoice] = useState(AmountType.none);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(" ");
  const [experiments, setExperiments] = useState([]);
  const [surveys, setSurveys] = useState([]);
  //const [instructions, setInstructions] = useState([]);
  const [status, setStatus] = useState("uninitialized");

  const handleKeyDownEvent = (event) => {
    switch (event.code) {
      case "Enter":
        if (
          choice !== AmountType.earlierAmount &&
          choice !== AmountType.laterAmount
        ) {
          setError(true);
          setHelperText(t("chooseSelection"));
        } else {
          setHelperText(" ");
          setError(false);
          if (
            questionIndex < surveys[0].length - 1 &&
            questionIndex < surveys[1].length - 1
          ) {
            setQuestionIndex(questionIndex + 1);
            setChoice(AmountType.none);
            setCompareMessage(`You are on question ${questionIndex + 1}`);
          } else {
            let text =
              "You are at the last question.  You have to reload the page if you want to go back to a previous question.";
            if (surveys[0].length !== surveys[1].length) {
              text = `${text}  The number of questions in experiment ${experiments[0].prolificId} is ${surveys[0].length} and doesn't match the number of questions in experiment ${experiments[1].prolificId} which is ${experiments[1].length}.  All questions rendering wasn't shown.`;
            }
            setCompareMessage(text);
          }
        }
        break;
      case "ArrowLeft":
        setHelperText(" ");
        setError(false);
        setChoice(AmountType.earlierAmount);
        break;
      case "ArrowRight":
        setChoice(AmountType.laterAmount);
        setHelperText(" ");
        setError(false);
        break;
      default:
    }
  };

  useKeyDown(
    (event) => {
      handleKeyDownEvent(event);
    },
    ["Enter", "ArrowLeft", "ArrowRight"]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("about to call initFirestore.");
        initFirestore({
          apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
          authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.REACT_APP_FIREBASE_APP_ID,
          measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
        });
        console.log("initFirestore returned.");
        console.log(
          `about to call readExperimentConfigurations with ${
            process.env.REACT_APP_FIREBASE_SERVER_URL
          }, ${searchParams.get("study_ids")}, ${searchParams.get(
            "study_ids"
          )}, ${searchParams.get("treatment_ids")}, ${searchParams.get(
            "question_order_ids"
          )}`
        );
        const data = await readExperimentConfigurations(
          process.env.REACT_APP_FIREBASE_SERVER_URL,
          searchParams.get("study_ids"),
          searchParams.get("treatment_ids"),
          searchParams.get("question_order_ids")
        );
        console.log(
          `readExperimentConfigurations returned with experiments=${JSON.stringify(
            data.experiments
          )}`
        );
        console.log(
          `readExperimentConfigurations returned with surveys=${JSON.stringify(
            data.surveys
          )}`
        );
        console.log(
          `readExperimentConfigurations returned with instructions=${JSON.stringify(
            data.instructions
          )}`
        );
        setExperiments(data.experiments);
        setSurveys(data.surveys);
        //setInstructions(data.instructions);
        setStatus("loaded");
      } catch (err) {
        console.log(err);
        throw Error(err);
      }
    };
    fetchData();
    setCompareMessage(
      `This page renders extended bar graph for two different experiment configurations to compare them visually.  You are on question ${
        questionIndex + 1
      }.`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSelectionHint = (selection) => {
    let errorMsg;
    if (selection === AmountType.earlierAmount) {
      errorMsg = t("leftArrowTooltip");
    } else if (selection === AmountType.laterAmount) {
      errorMsg = t("rightArrowTooltip");
    }
    setHelperText(errorMsg);
    setError(true);
  };

  const changeChoiceText = () => {
    if (choice === AmountType.none) {
      return " ";
    } else {
      return t("tryPressEnterToAdvanceSurvey", {
        arrowKey:
          choice === AmountType.earlierAmount
            ? t("rightArrow")
            : t("leftArrow"),
      });
    }
  };

  console.log(`status=${status}`);

  if (status !== "loaded") {
    return <Spinner text="Experiments are being loaded..." />;
  } else {
    return (
      <Box>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ fontSize: "26px" }}
            >
              {compareMessage}
            </Box>
            <hr></hr>
            <Box display="flex" alignItems="center" justifyContent="center">
              <MELBarChartComponent
                instructionText={t("chooseSelection")}
                changeChoiceText={changeChoiceText}
                helperText={helperText}
                amountEarlier={surveys[0][questionIndex].amountEarlier}
                timeEarlier={surveys[0][questionIndex].timeEarlier}
                amountLater={surveys[0][questionIndex].amountLater}
                timeLater={surveys[0][questionIndex].timeLater}
                maxTime={surveys[0][questionIndex].maxTime}
                maxAmount={surveys[0][questionIndex].maxAmount}
                interaction={surveys[0][questionIndex].interaction}
                variableAmount={surveys[0][questionIndex].variableAmount}
                horizontalPixels={surveys[0][questionIndex].horizontalPixels}
                verticalPixels={surveys[0][questionIndex].verticalPixels}
                leftMarginWidthIn={surveys[0][questionIndex].leftMarginWidthIn}
                graphWidthIn={surveys[0][questionIndex].graphWidthIn}
                bottomMarginHeightIn={
                  surveys[0][questionIndex].bottomMarginHeightIn
                }
                graphHeightIn={surveys[0][questionIndex].graphHeightIn}
                showMinorTicks={surveys[0][questionIndex].showMinorTicks}
                choice={choice}
                onClickCallback={(selection) => showSelectionHint(selection)}
                error={error}
              />
            </Box>
            <hr></hr>
            <Box display="flex" alignItems="center" justifyContent="center">
              <MELBarChartComponent
                instructionText={t("chooseSelection")}
                changeChoiceText={changeChoiceText}
                helperText={helperText}
                amountEarlier={surveys[1][questionIndex].amountEarlier}
                timeEarlier={surveys[1][questionIndex].timeEarlier}
                amountLater={surveys[1][questionIndex].amountLater}
                timeLater={surveys[1][questionIndex].timeLater}
                maxTime={surveys[1][questionIndex].maxTime}
                maxAmount={surveys[1][questionIndex].maxAmount}
                interaction={surveys[1][questionIndex].interaction}
                variableAmount={surveys[1][questionIndex].variableAmount}
                horizontalPixels={surveys[1][questionIndex].horizontalPixels}
                verticalPixels={surveys[1][questionIndex].verticalPixels}
                leftMarginWidthIn={surveys[1][questionIndex].leftMarginWidthIn}
                graphWidthIn={surveys[1][questionIndex].graphWidthIn}
                bottomMarginHeightIn={
                  surveys[1][questionIndex].bottomMarginHeightIn
                }
                graphHeightIn={surveys[1][questionIndex].graphHeightIn}
                showMinorTicks={surveys[1][questionIndex].showMinorTicks}
                choice={choice}
                onClickCallback={(selection) => showSelectionHint(selection)}
                error={error}
              />
            </Box>
          </ThemeProvider>
        </StyledEngineProvider>
      </Box>
    );
  }
}

export default MELSurveyCompare;
