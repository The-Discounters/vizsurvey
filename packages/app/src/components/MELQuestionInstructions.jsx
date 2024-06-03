import React, { useEffect, useState } from "react";
import { format } from "d3";
import { useNavigate } from "react-router-dom";
import { Typography, ThemeProvider, StyledEngineProvider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { useKeyDown } from "../hooks/useKeydown.js";
import "../App.css";
import {
  ExperimentType,
  ViewType,
  AmountType,
  StatusType,
} from "@the-discounters/types";
import { navigateFromStatus } from "./Navigate.js";
import {
  MCLInstructionsShown,
  MCLInstructionsCompleted,
  getCurrentQuestion,
  getInstructionTreatment,
  getStatus,
  getExperiment,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { useTranslation } from "react-i18next";
import { theme } from "./ScreenHelper.js";
import { MELWordComponent } from "./MELWordComponent.js";
import { MELBarChartComponent } from "./MELBarChartComponent.js";
import { ReactComponent as EnterKey } from "../assets/enterKey.svg";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";

const MELQuestionInstructions = () => {
  const dispatch = useDispatch();
  const currentQuestion = useSelector(getCurrentQuestion);
  const instructionTreatment = useSelector(getInstructionTreatment);
  const experiment = useSelector(getExperiment);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [choice, setChoice] = useState(AmountType.none);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(" ");
  const status = useSelector(getStatus);

  useEffect(() => {
    dispatch(MCLInstructionsShown(dateToState(DateTime.now())));
    if (!currentQuestion) navigate("/invalidlink");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyDownEvent(event) {
    switch (event.code) {
      case "Enter":
        if (
          choice !== AmountType.earlierAmount &&
          choice !== AmountType.laterAmount
        ) {
          setError(true);
          setHelperText(t("enterNoSelectionError"));
        } else {
          setHelperText(" ");
          setError(false);
          dispatch(MCLInstructionsCompleted(dateToState(DateTime.now())));
        }
        break;
      case "ArrowLeft":
        setChoice(AmountType.earlierAmount);
        break;
      case "ArrowRight":
        setChoice(AmountType.laterAmount);
        break;
      default:
    }
  }

  useKeyDown(
    (event) => {
      handleKeyDownEvent(event);
    },
    ["Enter", "ArrowLeft", "ArrowRight"]
  );

  useEffect(() => {
    if (
      choice === AmountType.earlierAmount ||
      choice === AmountType.laterAmount
    ) {
      setError(false);
      setHelperText(" ");
    }
  }, [choice]);

  useEffect(() => {
    const path = navigateFromStatus(status);
    if (status === StatusType.Survey && experiment.fullScreen === "enabled") {
      document.body.requestFullscreen();
    }
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const instructions = (description, tryLeftDesc, tryRightDesc, tryView) => {
    return (
      <React.Fragment>
        <Typography paragraph>
          You will be presented with a series of hypothetical choices of
          receiving two different amounts of money at two different times. Both
          amounts are in United States Dollars (USD) and both times are the
          delay in months from today.{" "}
          <b>
            All amounts and delay times in the questions are hypothetical. We do
            ask that you imagine to the best of your ability that you are in
            this situation and need to make a choice between the two payments.
            These are very realistic choices that can present themselves to
            anyone, so for each question, please think which option you would
            choose if you were truly in this situation.
          </b>
        </Typography>
        <Typography paragraph>
          The amount and delay time for each option will be represented{" "}
          {description}. You will make your choice by using keys on your
          keyboard (not your mouse). Press the{" "}
          <b>
            left arrow key <LeftArrowKey /> to choose the earlier amount
          </b>{" "}
          or the{" "}
          <b>
            right arrow key <RightArrowKey /> to choose the later amount
          </b>{" "}
          then press the{" "}
          <b>
            enter key <EnterKey /> to accept your choice and advance to the next
            question.{" "}
          </b>{" "}
          You must make a selection to proceed onto the next question. You can
          not make your money choice selection using a mouse and{" "}
          <b>must use the left or right arrow keys and the enter key.</b> You
          can use a mouse to answer the additional survey questions after the
          money choice questions.
        </Typography>
        <Typography paragraph>
          <b>Try it out below: </b>
          In the example below the amounts and times are represented {tryView}.
          The {tryLeftDesc} represents the choice of receiving $300 two months
          from now and the {tryRightDesc} receiving $700 seven months from now.
          Select the earlier amount by pressing the left arrow key or later
          amount by pressing the right arrow key.
        </Typography>
      </React.Fragment>
    );
  };

  const vizExplanation = () => {
    switch (instructionTreatment.viewType) {
      case ViewType.word:
        return instructions(
          experiment.type === ExperimentType.betweenSubject
            ? "in words"
            : "in words or as a bar chart",
          "radio button on the left",
          "radio button on the right",
          "in words as radio buttons"
        );
      case ViewType.barchart:
        return instructions(
          experiment.type === ExperimentType.betweenSubject
            ? "as a bar chart"
            : "in words or as a bar chart",
          "bar on the left",
          "bar on the right",
          "as a bar chart"
        );
      default:
        return <React.Fragment>{navigate("/invalidlink")}</React.Fragment>;
    }
  };

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

  const instructionText = () => {
    if (choice === AmountType.none) {
      return t("enterNoSelectionInstructions");
    } else {
      return t("tryPressEnterToAdvanceInstruction", {
        choiceText: t("choiceText", {
          amount:
            choice === AmountType.earlierAmount
              ? format("$,.0f")(instructionTreatment.amountEarlier)
              : format("$,.0f")(instructionTreatment.amountLater),
          delay:
            choice === AmountType.earlierAmount
              ? instructionTreatment.timeEarlier
              : instructionTreatment.timeLater,
        }),
        arrowKey:
          choice === AmountType.earlierAmount
            ? t("rightArrow")
            : t("leftArrow"),
      });
    }
  };

  const vizTry = () => {
    switch (instructionTreatment.viewType) {
      case ViewType.word:
        return (
          <MELWordComponent
            textShort={"MELRadioGroup"}
            instructionText={instructionText}
            helperText={helperText}
            amountEarlier={instructionTreatment.amountEarlier}
            timeEarlier={instructionTreatment.timeEarlier}
            dateEarlier={instructionTreatment.dateEarlier}
            amountLater={instructionTreatment.amountLater}
            timeLater={instructionTreatment.timeLater}
            dateLater={instructionTreatment.dateLater}
            choice={choice}
            onClickCallback={(selection) => showSelectionHint(selection)}
            error={error}
          />
        );
      case ViewType.barchart:
        return (
          <MELBarChartComponent
            instructionText={instructionText}
            helperText={helperText}
            amountEarlier={instructionTreatment.amountEarlier}
            timeEarlier={instructionTreatment.timeEarlier}
            amountLater={instructionTreatment.amountLater}
            timeLater={instructionTreatment.timeLater}
            maxTime={instructionTreatment.maxTime}
            maxAmount={instructionTreatment.maxAmount}
            interaction={instructionTreatment.interaction}
            variableAmount={instructionTreatment.variableAmount}
            horizontalPixels={instructionTreatment.horizontalPixels}
            verticalPixels={instructionTreatment.verticalPixels}
            leftMarginWidthIn={instructionTreatment.leftMarginWidthIn}
            graphWidthIn={instructionTreatment.graphWidthIn}
            bottomMarginHeightIn={instructionTreatment.bottomMarginHeightIn}
            graphHeightIn={instructionTreatment.graphHeightIn}
            showMinorTicks={instructionTreatment.showMinorTicks}
            choice={choice}
            onClickCallback={(selection) => showSelectionHint(selection)}
            error={error}
          />
        );
      default:
        return "";
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            <Typography variant="h4">Money Choice Instructions</Typography>
            <hr
              style={{
                color: "#ea3433",
                backgroundColor: "#ea3433",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            {vizExplanation()}
          </Grid>
          <Grid item xs={12} align="center">
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
            {vizTry()}
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default MELQuestionInstructions;
