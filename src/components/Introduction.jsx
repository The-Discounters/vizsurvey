import React, { useMemo, useEffect, useState } from "react";
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
import { dateToState } from "../features/ConversionUtil";
import { navigateFromStatus } from "./Navigate";
import {
  introductionShown,
  introductionCompleted,
  fetchCurrentTreatment,
  getStatus,
  startSurvey,
} from "../features/questionSlice";
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
    dispatch(introductionShown(dateToState(DateTime.utc())));
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

  useMemo(() => {
    setChoice("");
    navigateFromStatus(navigate, status);
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
          amounts are in United States Dollars and both times are the delay in
          months from now.{" "}
          <b>
            All amounts and delay times are hypothetical. You will not be
            compensated the amounts in the questions. You will be compensated{" "}
            {process.env.REACT_APP_PAYMENT_AMOUT} upon completion of all the
            questions in this survey and the review of your answers by the
            researchers. The researches will review your answers in a timely
            manner and initiate a credit of{" "}
            {process.env.REACT_APP_PAYMENT_AMOUT} to your Prolific account.
          </b>
        </Typography>
        <Typography paragraph>
          The amount and delay time for each option will be represented as a{" "}
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
    const result = [];
    switch (viewType) {
      case ViewType.word:
        result.push(
          instructions(
            "radio buttons",
            "buttons",
            radioButtonGif,
            "Radio button example",
            "button on the left",
            "button on the right",
            "clicking the button"
          )
        );
        result.push(
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
        break;
      case ViewType.barchart:
        result.push(
          instructions(
            "bar chart",
            "bars",
            barchartGif,
            "Bar chart button example",
            "bar on the left",
            "bar on the right",
            "clicking the bar"
          )
        );
        result.push(
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
        break;
      case ViewType.calendarBar:
        result.push(
          instructions(
            "calendar bar chart",
            "bars",
            testGif,
            "Radio button example",
            "button on the left",
            "button on the right",
            "clicking the button"
          )
        );
        break;
      case ViewType.calendarWord:
        result.push(
          instructions(
            "calendar word chart",
            "amounts",
            testGif,
            "Calendar word chart example",
            "bar on the earlier day",
            "bar on the laster day",
            "clicking the bar"
          )
        );
        break;
      case ViewType.calendarIcon:
        result.push(
          instructions(
            "calendar icon chart",
            "icon charts",
            testGif,
            "Calendar icon chart example",
            "icon chart on the earlier day",
            "icon chart on the laster day",
            "clicking the icon chart"
          )
        );
        break;
      default:
        result.push(
          <React.Fragment>{navigate("/invalidlink")}</React.Fragment>
        );
    }
    return <React.Fragment>{result}</React.Fragment>;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container style={styles.root} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4">Introduction</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {treatment ? vizExplanation(treatment.viewType) : <p />}
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
                  treatment.viewType === ViewType.word &&
                  choice !== AmountType.earlierAmount &&
                  choice !== AmountType.laterAmount
                ) {
                  setError(true);
                  setHelperText("You must choose one of the options below.");
                } else {
                  dispatch(introductionCompleted(dateToState(DateTime.utc())));
                  dispatch(startSurvey());
                  navigateFromStatus(navigate, status);
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
