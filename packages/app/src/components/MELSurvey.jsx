import React, { useEffect, useState } from "react";
import { useNavigate } from "../hooks/useNavigation.js";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
import { ThemeProvider, StyledEngineProvider, Box } from "@mui/material";
import {
  AmountType,
  WindowAttributes,
  ScreenAttributes,
} from "@the-discounters/types";
import { dateToState } from "@the-discounters/util";
import { StatusType } from "@the-discounters/types";
import { ViewType } from "@the-discounters/types";
import { useTranslation } from "react-i18next";

import { useKeyDown } from "../hooks/useKeydown.js";
import {
  getCurrentQuestion,
  getCurrentChoice,
  getCurrentDragAmount,
  getCurrentQuestionIndex,
  getStatus,
  getExperiment,
  setQuestionShownTimestamp,
  nextQuestion,
  answer,
} from "../features/questionSlice.js";
import { MELBarChartComponent } from "./MELBarChartComponent.js";
import { MELWordComponent } from "./MELWordComponent.js";
import { theme } from "./ScreenHelper.js";
import { navigateFromStatus } from "./Navigate.js";

export function MELSurvey() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(" ");
  const q = useSelector(getCurrentQuestion);
  const qi = useSelector(getCurrentQuestionIndex);
  const status = useSelector(getStatus);
  const choice = useSelector(getCurrentChoice);
  const experiment = useSelector(getExperiment);
  const dragAmount = useSelector(getCurrentDragAmount);

  // Early return for SSR/prerendering when state is not initialized
  if (!q || !experiment) {
    return <div>Loading...</div>;
  }

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
          dispatch(nextQuestion());
        }
        break;
      case "ArrowLeft":
        setHelperText(" ");
        setError(false);
        dispatch(
          answer({
            choice: AmountType.earlierAmount,
            choiceTimestamp: dateToState(DateTime.now()),
            window: WindowAttributes(window),
            screen: ScreenAttributes(window.screen),
          })
        );
        break;
      case "ArrowRight":
        dispatch(
          answer({
            choice: AmountType.laterAmount,
            choiceTimestamp: dateToState(DateTime.now()),
            window: WindowAttributes(window),
            screen: ScreenAttributes(window.screen),
          })
        );
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
    dispatch(setQuestionShownTimestamp(dateToState(DateTime.now())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);

  useEffect(() => {
    if (
      choice === AmountType.earlierAmount ||
      choice === AmountType.laterAmount
    ) {
      setError(false);
      setHelperText(" ");
    }
  }, [choice, dragAmount, q.treatmentQuestionId]);

  useEffect(() => {
    const path = navigateFromStatus(status);
    if (
      status !== StatusType.Survey &&
      experiment.fullScreen === "enabled" &&
      document.fullscreenElement
    ) {
      document.exitFullscreen();
    }
    navigate(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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

  return (
    <Box>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "100vh" }}
          >
            {(() => {
              switch (q.viewType) {
                case ViewType.word:
                  return (
                    <MELWordComponent
                      textShort={"MELRadioGroup"}
                      instructionText={t("chooseSelection")}
                      changeChoiceText={changeChoiceText}
                      helperText={helperText}
                      amountEarlier={q.amountEarlier}
                      timeEarlier={q.timeEarlier}
                      dateEarlier={q.dateEarlier}
                      amountLater={q.amountLater}
                      timeLater={q.timeLater}
                      dateLater={q.dateLater}
                      choice={choice}
                      onClickCallback={(selection) =>
                        showSelectionHint(selection)
                      }
                      error={error}
                    />
                  );
                case ViewType.barchart:
                  return (
                    <MELBarChartComponent
                      instructionText={t("chooseSelection")}
                      changeChoiceText={changeChoiceText}
                      helperText={helperText}
                      amountEarlier={q.amountEarlier}
                      timeEarlier={q.timeEarlier}
                      amountLater={q.amountLater}
                      timeLater={q.timeLater}
                      maxTime={q.maxTime}
                      maxAmount={q.maxAmount}
                      interaction={q.interaction}
                      variableAmount={q.variableAmount}
                      horizontalPixels={q.horizontalPixels}
                      verticalPixels={q.verticalPixels}
                      leftMarginWidthIn={q.leftMarginWidthIn}
                      graphWidthIn={q.graphWidthIn}
                      bottomMarginHeightIn={q.bottomMarginHeightIn}
                      graphHeightIn={q.graphHeightIn}
                      showMinorTicks={q.showMinorTicks}
                      choice={choice}
                      onClickCallback={(selection) =>
                        showSelectionHint(selection)
                      }
                      error={error}
                    />
                  );
                default:
                  return "";
              }
            })()}
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </Box>
  );
}

export default MELSurvey;
