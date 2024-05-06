import React, { useEffect, useState } from "react";
import { format } from "d3";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { useD3 } from "../hooks/useD3.js";
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
  fetchCurrentTreatment,
  getInstructionTreatment,
  getStatus,
  getExperiment,
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";
import { useTranslation } from "react-i18next";
import { styles, theme } from "./ScreenHelper.js";
import { MELWordComponent } from "./MELWordComponent.js";
import { MELBarChartComponent } from "./MELBarChartComponent.js";
import { drawCalendar } from "./CalendarHelper.js";
import { drawCalendarYear } from "./CalendarYearHelper.js";
import { ReactComponent as EnterKey } from "../assets/enterKey.svg";
import { ReactComponent as LeftArrowKey } from "../assets/leftArrowKey.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightArrowKey.svg";
import { EnterButtonTooltip } from "./EnterButtonTooltip.js";

const MELQuestionInstructions = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);
  const instructionTreatment = useSelector(getInstructionTreatment);
  const experiment = useSelector(getExperiment);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [choice, setChoice] = useState(AmountType.none);
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(" ");
  const [showNextPrevious, setShowNextPrevious] = useState(false);
  const status = useSelector(getStatus);

  useEffect(() => {
    dispatch(MCLInstructionsShown(dateToState(DateTime.now())));
    if (!treatment) navigate("/invalidlink");
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
          setHelperText(
            "Press the left arrow key to select the earlier amount and the right arrow key to select the later amount."
          );
        } else {
          setHelperText(" ");
          setError(false);
          dispatch(MCLInstructionsCompleted(dateToState(DateTime.now())));
        }
        break;
      case "ArrowLeft":
        setChoice(AmountType.earlierAmount);
        setShowNextPrevious(true);
        break;
      case "ArrowRight":
        setChoice(AmountType.laterAmount);
        setShowNextPrevious(true);
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
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
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
      case ViewType.calendarBar:
        return instructions(
          experiment.type === ExperimentType.betweenSubject
            ? "as a calendar bar chart"
            : "in words, as a bar chart, or as a calendar bar chart",
          "radio button on the left",
          "radio button on the right",
          "as bars on a calendar"
        );
      case ViewType.calendarWord:
      case ViewType.calendarWordYear:
      case ViewType.calendarWordYearDual:
        return instructions(
          experiment.type === ExperimentType.betweenSubject
            ? "as a calendar space"
            : "in words or as a calendar space",
          "space on the earlier day",
          "space on the later day",
          "as words on a calendar"
        );
      case ViewType.calendarIcon:
        return instructions(
          experiment.type === ExperimentType.betweenSubject
            ? "as a calendar icon chart"
            : "in words or as a calendar icon chart",
          "icon chart on the earlier day",
          "icon chart on the later day",
          "as icon charts on a calendar"
        );
      default:
        return <React.Fragment>{navigate("/invalidlink")}</React.Fragment>;
    }
  };

  const DrawCalendar = () => {
    return (
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
            drawCalendar({
              table: table,
              qDateEarlier: instructionTreatment.dateEarlier,
              qDateLater: instructionTreatment.dateLater,
              qAmountEarlier: instructionTreatment.amountEarlier,
              qAmountLater: instructionTreatment.amountLater,
              choice: choice,
            });
          },
          [choice]
        )}
      ></table>
    );
  };

  const DrawCalendarYear = () => {
    return (
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
            drawCalendarYear({
              table: table,
              qDateEarlier: instructionTreatment.dateEarlier,
              qDateLater: instructionTreatment.dateLater,
              qAmountEarlier: instructionTreatment.amountEarlier,
              qAmountLater: instructionTreatment.amountLater,
              choice: choice,
            });
          },
          [choice]
        )}
      ></table>
    );
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

  const vizTry = () => {
    switch (instructionTreatment.viewType) {
      case ViewType.word:
        return (
          <MELWordComponent
            textShort={"MELRadioGroup"}
            error={error}
            amountEarlier={instructionTreatment.amountEarlier}
            timeEarlier={instructionTreatment.timeEarlier}
            dateEarlier={instructionTreatment.dateEarlier}
            amountLater={instructionTreatment.amountLater}
            timeLater={instructionTreatment.timeLater}
            dateLater={instructionTreatment.dateLater}
            helperText={helperText}
            choice={choice}
            onClickCallback={(value) => {
              let errorMsg;
              if (value === AmountType.earlierAmount) {
                errorMsg = t("leftArrowTooltip");
              } else if (value === AmountType.laterAmount) {
                errorMsg = t("rightArrowTooltip");
              }
              setHelperText(errorMsg);
              setError(true);
            }}
          />
        );
      case ViewType.barchart:
        return (
          <MELBarChartComponent
            error={error}
            helperText={helperText}
            maxTime={instructionTreatment.maxTime}
            maxAmount={instructionTreatment.maxAmount}
            interaction={instructionTreatment.interaction}
            variableAmount={instructionTreatment.variableAmount}
            amountEarlier={instructionTreatment.amountEarlier}
            timeEarlier={instructionTreatment.timeEarlier}
            amountLater={instructionTreatment.amountLater}
            timeLater={instructionTreatment.timeLater}
            choice={choice}
            horizontalPixels={instructionTreatment.horizontalPixels}
            verticalPixels={instructionTreatment.verticalPixels}
            leftMarginWidthIn={instructionTreatment.leftMarginWidthIn}
            graphWidthIn={instructionTreatment.graphWidthIn}
            bottomMarginHeightIn={instructionTreatment.bottomMarginHeightIn}
            graphHeightIn={instructionTreatment.graphHeightIn}
            showMinorTicks={instructionTreatment.showMinorTicks}
            onClickCallback={(selection) => {
              showSelectionHint(selection);
            }}
          />
        );
      case ViewType.calendarBar:
        return "";
      case ViewType.calendarWord:
        return <DrawCalendar />;
      case ViewType.calendarWordYear:
      case ViewType.calendarWordYearDual:
        return <DrawCalendarYear />;
      case ViewType.calendarIcon:
        return "";
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
          <Grid item xs={12}>
            {showNextPrevious && (
              <>
                <hr
                  style={{
                    backgroundColor: "#aaaaaa",
                    height: 4,
                  }}
                />
                <Typography paragraph>
                  {t("tryPressEnterToAdvance", {
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
                  })}
                </Typography>
              </>
            )}
            <hr
              style={{
                backgroundColor: "#aaaaaa",
                height: 4,
              }}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <EnterButtonTooltip choice={choice}>
              <Button
                variant="contained"
                color="secondary"
                id="buttonNext"
                disableRipple
                disableFocusRipple
                style={styles.button}
                onClick={() => {
                  setError(true);
                  setHelperText(
                    choice === AmountType.earlierAmount ||
                      choice === AmountType.laterAmount
                      ? t("tooltipEnterSelectionInstructions", {
                          choice:
                            choice === AmountType.earlierAmount
                              ? "earlier amount"
                              : "later amount",
                        })
                      : t("tooltipEnterNoSelectionInstructions")
                  );
                }}
                disabled={disableSubmit}
              >
                Press Enter to start the survey
              </Button>
            </EnterButtonTooltip>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default MELQuestionInstructions;
