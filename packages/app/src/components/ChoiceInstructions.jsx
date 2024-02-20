import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Box,
  Typography,
  ThemeProvider,
} from "@material-ui/core";
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
} from "../features/questionSlice.js";
import { dateToState } from "@the-discounters/util";

import { styles, theme, calcScreenValues } from "./ScreenHelper.js";
import { AmountType } from "@the-discounters/types";
import { MELSelectionForm } from "./MELSelectionForm.jsx";
import { BarChartComponent } from "./BarChartComponent.js";
import { StatusType } from "../features/StatusType.js";
import { drawCalendar } from "./CalendarHelper.js";
import { drawCalendarYear } from "./CalendarYearHelper.js";

const ChoiceInstructions = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);
  const instructionTreatment = useSelector(getInstructionTreatment);
  const navigate = useNavigate();

  const [choice, setChoice] = useState(AmountType.none);
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");
  const [showNextPrevious, setShowNextPrevious] = useState(false);
  const status = useSelector(getStatus);

  const { totalSVGWidth, totalSVGHeight } = calcScreenValues(
    instructionTreatment.horizontalPixels,
    instructionTreatment.verticalPixels,
    instructionTreatment.leftMarginWidthIn,
    instructionTreatment.graphWidthIn,
    instructionTreatment.bottomMarginHeightIn,
    instructionTreatment.graphHeightIn
  );

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
            "You must choose one of the options below.  Press the left arrow key to select the earlier amount and the right arrow key to select the later amount."
          );
        } else {
          setHelperText("");
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
      setHelperText("");
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [choice]);

  useEffect(() => {
    const path = navigateFromStatus(status);
    if (
      status === StatusType.Survey &&
      process.env.REACT_APP_FULLSCREEN === "enabled"
    ) {
      document.body.requestFullscreen();
    }
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /**
   * @returns The name of the animated gif filename to show in the instructions page.
   */
  const gifFilename = () => {
    const randIndex = Math.floor(Math.random() * 2);
    const randAmountType = AmountType[Object.keys(AmountType)[randIndex + 1]];
    return `${instructionTreatment.instructionGifPrefix}-${randAmountType}.gif`;
  };

  const instructions = (description, gifAltText, tryLeftDesc, tryRightDesc) => {
    return (
      <React.Fragment>
        <Typography paragraph>
          You will be presented with a series of hypothetical choices of
          receiving two different amounts of money at two different times. Both
          amounts are in United States Dollars (USD) and both times are the
          delay in months from now.{" "}
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
          The amount and delay time for each option will be represented as{" "}
          {description}. You will make your choice by using keys on your
          keyboard (not your mouse). Press the left arrow key{" "}
          <img
            src="leftarrow.png"
            alt="left arrow keyboard key"
            width="40px"
            height="40px"
          ></img>{" "}
          to choose the earlier amount or the right arrow key{" "}
          <img
            src="rightarrow.png"
            alt="right arrow keyboard key"
            width="40px"
            height="40px"
          ></img>{" "}
          to choose the later amount then press the enter key{" "}
          <img
            src="enterkey.png"
            alt="enter keyboard key"
            width="75px"
            height="40px"
          ></img>{" "}
          to accept your choice and advance to the next question. You must make
          a selection to proceed onto the next question. You can not make your
          money choice selection using a mouse and must use the left or right
          arrow keys and the enter key. You can use a mouse to answer the
          additional survey questions after the money choice questions.
        </Typography>
        <Typography paragraph>
          <img
            src={gifFilename()}
            alt={gifAltText}
            width={totalSVGWidth}
            height={totalSVGHeight}
          ></img>
        </Typography>
        <Typography paragraph>
          <b>Try it out below: </b>
          In the example below, the {tryLeftDesc} represents the choice of
          receiving $300 two months from now and the {tryRightDesc} receiving
          $700 seven months from now. Select the earlier amount by pressing the
          left arrow key and later amount by pressing the right arrow key.
        </Typography>
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

  const vizTry = () => {
    switch (instructionTreatment.viewType) {
      case ViewType.word:
        return (
          <MELSelectionForm
            textShort={"textShort"}
            error={error}
            amountEarlier={instructionTreatment.amountEarlier}
            timeEarlier={instructionTreatment.timeEarlier}
            dateEarlier={instructionTreatment.dateEarlier}
            amountLater={instructionTreatment.amountLater}
            timeLater={instructionTreatment.timeLater}
            dateLater={instructionTreatment.dateLater}
            helperText={helperText}
            choice={choice}
          />
        );
      case ViewType.barchart:
        return (
          <BarChartComponent
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
            onClickCallback={(value) => {
              let errorMsg;
              if (value === AmountType.earlierAmount) {
                errorMsg =
                  "To choose the earlier amount, use the left arrow key.";
              } else if (value === AmountType.laterAmount) {
                errorMsg =
                  "To choose the later amount, use the right arrow key.";
              }
              setHelperText(errorMsg);
              setError(true);
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
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
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
          {vizTry()}
          {showNextPrevious && (
            <>
              <hr
                style={{
                  backgroundColor: "#aaaaaa",
                  height: 4,
                }}
              />
              <Typography paragraph></Typography>
              <Typography paragraph>
                Once you have made your selection, press the enter key to accept
                it and advance to the next question. You must make a selection
                to proceed onto the next question.
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
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
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
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default ChoiceInstructions;
