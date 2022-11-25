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
import { dateToState } from "../features/ConversionUtil";
import {
  introductionShown,
  introductionCompleted,
  fetchCurrentTreatment,
  getStatus,
  startSurvey,
} from "../features/questionSlice";
import { styles, theme, calcScreenValues } from "./ScreenHelper";
import { StatusType } from "../features/StatusType";
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

  useEffect(() => {
    setChoice("");
    switch (status) {
      case StatusType.Instructions:
        navigate("/instruction");
        break;
      case StatusType.Demographic:
        navigate("/demographic");
        break;
    }
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
    "introduction-barchart-later.gif",
    "introduction-barchart-earlier.gif"
  );

  const radioBtnExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>Radio Buttons: </b>
          Radio buttons represent information where a left button represents one
          option, and the right button represents a second option. You will be
          presented with a series of questions where you will make a choice of
          receiving an amount of money earlier or a different amount of money
          later. All amounts are in US dollars and the time of receiving the
          money is in months from the present. Select one of the options by
          clicking on the circle for your choice.
        </Typography>
        <img
          src={
            radioButtonGif[Math.floor(Math.random() * radioButtonGif.length)]
          }
          alt="Radio button example"
        ></img>
        <Typography paragraph></Typography>
        <Typography paragraph>
          <b>Try it out below: </b>
          In the example below, the left button represents the choice of
          receiving $300 in two months and the right button $700 in seven
          months. Select one of the options by clicking on the circle for your
          choice.
        </Typography>

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
      </React.Fragment>
    );
  };

  const barchartExp = () => {
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
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Bar chart:{" "}
          </b>
          Bar charts represent information where the height of the bar
          represents one value and the position of the bar a second. In the
          chart below, the height represents the amount of money is US dollars
          and the position on the horizontal axis the delay in months of when
          that money is received. You will be presented with a series of
          questions where you will make a choice of receiving an amount of money
          earlier or a different amount of money later. All amounts are in US
          dollars and the time of receiving the money is in months from the
          present. In this case the choice is to receive $300 in two months or
          $700 in seven months. Select one of the options by clicking on the bar
          that represents your choice.
        </Typography>
        <img
          src={barchartGif[Math.floor(Math.random() * radioButtonGif.length)]}
          alt="Barchart example"
        ></img>
        <Typography paragraph></Typography>
        <Typography paragraph>
          <b>Try it out below:</b> In the example below, the left bar represents
          the choice of receiving $300 in two months and the right bar $700 in
          seven months. Select one of the bars by clicking on the in for your
          choice.
        </Typography>

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
              });
            },
            [choice]
          )}
        ></svg>
      </React.Fragment>
    );
  };

  const calendarExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Calendar:{" "}
          </b>
          A calendar is a pictoral representation of dates. In this experiment,
          the date that money will be received is shown on a calendar.
        </Typography>
        <img src="test.png" alt="Calendar example."></img>
        <Typography paragraph>.</Typography>
      </React.Fragment>
    );
  };

  const iconExp = () => {
    return (
      <React.Fragment>
        <Typography paragraph>
          <b>
            {" "}
            <span style={{ fontSize: 20 }}>&#8226;</span> Icon array:{" "}
          </b>
          An icon array is a visual display that shows a proportion using
          colored icons. For example, to represent a proportion of 67%, one can
          start with 100 gray icons (here we use squares), and color 67 of them
          orange.
        </Typography>
        <img
          src="intro-icon-array-67-10PerRow.png"
          alt="Icon array example"
        ></img>
      </React.Fragment>
    );
  };

  const vizExplanation = (viewType) => {
    const result = [];
    switch (viewType) {
      case ViewType.word:
        return radioBtnExp();
      case ViewType.barchart:
        return barchartExp();
      case ViewType.calendarBar:
        result.push(barchartExp());
        result.push(calendarExp());
        return <React.Fragment>{result}</React.Fragment>;
      case ViewType.calendarWord:
        return calendarExp();
      case ViewType.calendarIcon:
        result.push(iconExp());
        result.push(calendarExp());
        return <React.Fragment>{result}</React.Fragment>;
      default:
        return <React.Fragment>{navigate("/invalidlink")}</React.Fragment>;
    }
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
