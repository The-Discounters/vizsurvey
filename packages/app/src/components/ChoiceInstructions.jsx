import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { useD3 } from "../hooks/useD3.js";
import { useKeyDown } from "../hooks/useKeydown.js";
import "../App.css";
import { ViewType } from "@the-discounters/types";
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

import { styles, theme } from "./ScreenHelper.js";
import { AmountType } from "@the-discounters/types";
import { MELWordComponent } from "./MELWordComponent.js";
import { MELBarChartComponent } from "./MELBarChartComponent.js";
import { StatusType } from "@the-discounters/types";
import { drawCalendar } from "./CalendarHelper.js";
import { drawCalendarYear } from "./CalendarYearHelper.js";
// import { ReactComponent as LeftArrowKey } from "../assets/leftarrow.svg";
// import { ReactComponent as RightArrowKey } from "../assets/rightarrow.svg";
import { ReactComponent as EnterKey } from "../assets/enter.svg";
import { ReactComponent as LeftArrowKey } from "../assets/leftarrow.svg";
import { ReactComponent as RightArrowKey } from "../assets/rightarrow.svg";

const ChoiceInstructions = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);
  const instructionTreatment = useSelector(getInstructionTreatment);
  const experiment = useSelector(getExperiment);
  const navigate = useNavigate();

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

  const instructions = (description, gifAltText, tryLeftDesc, tryRightDesc) => {
    return (
      <React.Fragment>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            You will be presented with a series of hypothetical choices of
            receiving two different amounts of money at two different times.
            Both amounts are in United States Dollars (USD) and both times are
            the delay in months from today.{" "}
            <b>
              All amounts and delay times in the questions are hypothetical. We
              do ask that you imagine to the best of your ability that you are
              in this situation and need to make a choice between the two
              payments. These are very realistic choices that can present
              themselves to anyone, so for each question, please think which
              option you would choose if you were truly in this situation.
            </b>
          </Grid>
          <Grid item xs={12}>
            The amount and delay time for each option will be represented as{" "}
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
              enter key <EnterKey /> to accept your choice and advance to the
              next question.{" "}
            </b>{" "}
            You must make a selection to proceed onto the next question. You can
            not make your money choice selection using a mouse and{" "}
            <b>must use the left or right arrow keys and the enter key.</b> You
            can use a mouse to answer the additional survey questions after the
            money choice questions.
          </Grid>
          <Grid align="center" item xs={12}>
            <VizDemo />
          </Grid>
          <Grid item xs={12}>
            <b>Try it out below: </b>
            In the example below, the {tryLeftDesc} represents the choice of
            receiving $300 two months from now and the {tryRightDesc} receiving
            $700 seven months from now. Select the earlier amount by pressing
            the left arrow key and later amount by pressing the right arrow key.
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  const vizExplanation = () => {
    switch (instructionTreatment.viewType) {
      case ViewType.word:
        return instructions(
          "a radio button",
          "Radio button example",
          "button on the left",
          "button on the right"
        );
      case ViewType.barchart:
        return instructions(
          "a bar chart",
          "Bar chart button example",
          "bar on the left",
          "bar on the right"
        );
      case ViewType.calendarBar:
        return instructions(
          "calendar bar chart",
          "Radio button example",
          "button on the left",
          "button on the right"
        );
      case ViewType.calendarWord:
      case ViewType.calendarWordYear:
      case ViewType.calendarWordYearDual:
        return instructions(
          "a calendar space",
          "Calendar word chart example",
          "space on the earlier day",
          "space on the later day"
        );
      case ViewType.calendarIcon:
        return instructions(
          "calendar icon chart",
          "Calendar icon chart example",
          "icon chart on the earlier day",
          "icon chart on the later day"
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
      errorMsg = "To choose the earlier amount press the left arrow key.";
    } else if (selection === AmountType.laterAmount) {
      errorMsg = "To choose the later amount press the right arrow key.";
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
                errorMsg =
                  "To choose the earlier amount press the left arrow key.";
              } else if (value === AmountType.laterAmount) {
                errorMsg =
                  "To choose the later amount press the right arrow key.";
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
            onHoverOverSelection={(selection) => {
              showSelectionHint(selection);
            }}
            onHoverOutSelection={(selection) => {
              setHelperText(" ");
              setError(false);
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

  const VizDemo = () => {
    const ref = useRef();

    // This is simply an example that demonstrates
    // how you can dispatch an event on the element.
    useEffect(() => {
      // ref.dispatchEvent(
      //   new KeyboardEvent("keypress", {
      //     key: "ArrowLeft",
      //   })
      // );
    }, []);

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
                errorMsg =
                  "To choose the earlier amount press the left arrow key.";
              } else if (value === AmountType.laterAmount) {
                errorMsg =
                  "To choose the later amount press the right arrow key.";
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
            onHoverOverSelection={(selection) => {
              showSelectionHint(selection);
            }}
            onHoverOutSelection={(selection) => {
              setHelperText(" ");
              setError(false);
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
                  Once you have made your selection, press the enter key to
                  accept it and advance to the next question. You must make a
                  selection to proceed onto the next question.
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
                  `Press the Enter key to accept your selection of ${
                    choice === AmountType.earlierAmount
                      ? "earlier amount"
                      : "later amount"
                  } and start the survey.`
                );
              }}
              disabled={disableSubmit}
            >
              Press Enter to start the survey
            </Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ChoiceInstructions;
