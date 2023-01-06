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
import { useD3 } from "../hooks/useD3";
import { DateTime } from "luxon";
import "../App.css";
import { ViewType } from "../features/ViewType";
import { navigateFromStatus } from "./Navigate";
import {
  introductionShown,
  introductionCompleted,
  fetchCurrentTreatment,
  getStatus,
  startSurvey,
} from "../features/questionSlice";
import { dateToState } from "../features/ConversionUtil";
import { styles, theme, calcScreenValues } from "./ScreenHelper";
import { AmountType } from "../features/AmountType";
import { MELSelectionForm } from "./MELSelectionForm";
import { drawBarChart } from "./BarChartComponent";
import { InteractionType } from "../features/InteractionType";

const Introduction = () => {
  const dispatch = useDispatch();
  const treatment = useSelector(fetchCurrentTreatment);
  const navigate = useNavigate();

  const [choice, setChoice] = useState(AmountType.none);
  const [disableSubmit, setDisableSubmit] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");
  const [showNextPrevious, setShowNextPrevious] = useState(false);
  const status = useSelector(getStatus);

  useEffect(() => {
    dispatch(introductionShown(dateToState(DateTime.now())));
    setChoice("");
    if (!treatment) navigate("/invalidlink");
  }, []);

  useEffect(() => {
    const nextButtonContentHeight =
      document.querySelector("#buttonNext").scrollHeight;
    const nextButtonHintArrow = document.querySelector("#nextButtonHintArrow");
    if (nextButtonHintArrow)
      nextButtonHintArrow.height = nextButtonContentHeight;
  }, [showNextPrevious]);

  useEffect(() => {
    if (
      choice === AmountType.earlierAmount ||
      choice === AmountType.laterAmount
    ) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [choice]);

  useEffect(() => {
    setChoice("");
    const path = navigateFromStatus(status);
    navigate(path);
  }, [status]);

  const onClickCallback = (value) => {
    setChoice(value);
    setShowNextPrevious(true);
    setHelperText("");
    setError(false);
  };

  const radioButtonGif = new Array(
    "introduction-radio-button-earlier.gif",
    "introduction-radio-button-later.gif"
  );

  const barchartGif = new Array(
    "introduction-barchart-later-" +
      (treatment.showMinorTicks ? "ticks" : "no-ticks") +
      ".gif",
    "introduction-barchart-earlier-" +
      (treatment.showMinorTicks ? "ticks" : "no-ticks") +
      ".gif"
  );

  const testGif = new Array("test.png");

  const instructions = (
    description,
    clickDesc,
    gifs,
    gifAltText,
    tryLeftDesc,
    tryRightDesc,
    tryAction
  ) => {
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
          {description}. You will make your choice by clicking on one of the{" "}
          {clickDesc}.
        </Typography>
        <Typography paragraph>
          <img
            src={gifs[Math.floor(Math.random() * gifs.length)]}
            alt={gifAltText}
          ></img>
        </Typography>
        <Typography paragraph>
          <b>Try it out below: </b>
          In the example below, the {tryLeftDesc} represents the choice of
          receiving $300 two months from now and the {tryRightDesc} receiving
          $700 seven months from now. Select one of the options by {tryAction}{" "}
          for your choice.
        </Typography>
      </React.Fragment>
    );
  };

  const vizExplanation = (viewType) => {
    switch (viewType) {
      case ViewType.word:
        return instructions(
          "radio buttons",
          "buttons",
          radioButtonGif,
          "Radio button example",
          "button on the left",
          "button on the right",
          "clicking the button"
        );
      case ViewType.barchart:
        return instructions(
          "a bar chart",
          "bars",
          barchartGif,
          "Bar chart button example",
          "bar on the left",
          "bar on the right",
          "clicking the bar"
        );
      case ViewType.calendarBar:
        return instructions(
          "calendar bar chart",
          "bars",
          testGif,
          "Radio button example",
          "button on the left",
          "button on the right",
          "clicking the button"
        );
      case ViewType.calendarWord:
        return instructions(
          "calendar word chart",
          "amounts",
          testGif,
          "Calendar word chart example",
          "bar on the earlier day",
          "bar on the laster day",
          "clicking the bar"
        );
      case ViewType.calendarIcon:
        return instructions(
          "calendar icon chart",
          "icon charts",
          testGif,
          "Calendar icon chart example",
          "icon chart on the earlier day",
          "icon chart on the laster day",
          "clicking the icon chart"
        );
      default:
        return <React.Fragment>{navigate("/invalidlink")}</React.Fragment>;
    }
  };

  const vizTry = (viewType) => {
    const horizontalPixels = 800;
    const verticalPixels = 400;
    const { totalSVGWidth, totalSVGHeight, totalUCWidth, totalUCHeight } =
      calcScreenValues(
        horizontalPixels,
        verticalPixels,
        null,
        null,
        null,
        null
      );
    switch (viewType) {
      case ViewType.word:
        return (
          <MELSelectionForm
            textShort={"textShort"}
            error={error}
            amountEarlier={300}
            timeEarlier={2}
            amountLater={700}
            timeLater={7}
            helperText={helperText}
            onClickCallback={onClickCallback}
            choice={choice}
          />
        );
      case ViewType.barchart:
        return (
          <svg
            width={totalSVGWidth}
            height={totalSVGHeight}
            viewBox={`0 0 ${totalUCWidth} ${totalUCHeight}`}
            ref={useD3(
              (svg) => {
                drawBarChart({
                  svg: svg,
                  maxTime: 8,
                  maxAmount: 1000,
                  interaction: InteractionType.none,
                  variableAmount: AmountType.none,
                  amountEarlier: 300,
                  timeEarlier: 2,
                  amountLater: 700,
                  timeLater: 7,
                  onClickCallback: onClickCallback,
                  choice: choice,
                  horizontalPixels: horizontalPixels,
                  verticalPixels: verticalPixels,
                  leftMarginWidthIn: null,
                  graphWidthIn: null,
                  bottomMarginHeightIn: null,
                  graphHeightIn: null,
                  showMinorTicks: treatment.showMinorTicks,
                });
              },
              [choice]
            )}
          ></svg>
        );
      case ViewType.calendarBar:
        return "";
      case ViewType.calendarWord:
        return "";
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
          <Typography variant="h4">Instructions</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {vizExplanation(treatment.viewType)}
          {vizTry(treatment.viewType)}
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
                Once you have made your selection, the Next button will be
                enabled to allow you to advance to the next question. You must
                make a selection to proceed onto the next question.
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
            {showNextPrevious && (
              <img
                id="nextButtonHintArrow"
                width="auto"
                src="arrow.png"
                alt="Click next button after making selection."
              ></img>
            )}

            <Button
              variant="contained"
              color="secondary"
              id="buttonNext"
              disableRipple
              disableFocusRipple
              style={styles.button}
              onClick={() => {
                if (
                  choice !== AmountType.earlierAmount &&
                  choice !== AmountType.laterAmount
                ) {
                  setError(true);
                  setHelperText("You must choose one of the options below.");
                } else {
                  dispatch(introductionCompleted(dateToState(DateTime.now())));
                  dispatch(startSurvey());
                }
              }}
              disabled={disableSubmit}
            >
              {" "}
              Next{" "}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Introduction;
