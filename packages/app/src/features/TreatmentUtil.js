import { csvParse, group } from "d3";
import { Question } from "./Question.js";
import { ViewType } from "@the-discounters/types";
import { InteractionType } from "@the-discounters/types";
import { AmountType } from "@the-discounters/types";
import { stringToDate, dateToState } from "@the-discounters/util";
import {
  TREATMENTS_DEV_CSV,
  TREATMENTS_PROD_CSV,
  LATIN_SQUARE_DEV,
  LATIN_SQUARE_PROD,
} from "./treatments.js";

var TREATMENTS_CSV;
if (process.env.REACT_APP_ENV !== "production") {
  TREATMENTS_CSV = TREATMENTS_DEV_CSV;
} else {
  TREATMENTS_CSV = TREATMENTS_PROD_CSV;
}

export var LATIN_SQUARE;
if (process.env.REACT_APP_ENV !== "production") {
  LATIN_SQUARE = LATIN_SQUARE_DEV;
} else {
  LATIN_SQUARE = LATIN_SQUARE_PROD;
}

export const INSTRUCTIONS_TREATMENT_POSITION = "instructions";
export const RANDOM_TREATMENT_POSITION = "random";

/**
 * Got this from https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj.  It uses Fisher-Yates algorithm
 * to randomly shuffle the array.
 * @param {*} array
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export const loadTreatmentConfiguration = (treatmentIds) => {
  const rows = csvParse(TREATMENTS_CSV, (e) => {
    return fromCSVRow(e);
  }).filter((d) => treatmentIds.includes(d.treatmentId));
  const grouped = group(rows, (d) =>
    Number.isInteger(d.position) || d.position === RANDOM_TREATMENT_POSITION
      ? "questions"
      : INSTRUCTIONS_TREATMENT_POSITION
  );
  let questions = grouped.get("questions");
  const result = {
    questions: null,
    instructions: grouped
      .get(INSTRUCTIONS_TREATMENT_POSITION)
      .sort(
        (a, b) =>
          treatmentIds.indexOf(a.treatmentId) -
          treatmentIds.indexOf(b.treatmentId)
      ),
  };
  if (questions[0].position === RANDOM_TREATMENT_POSITION) {
    result.questions = [];
    const questionsByTreatment = group(questions, (d) => d.treatmentId);
    treatmentIds.forEach((treatmentId) => {
      const questionsForTreatment = questionsByTreatment.get(treatmentId);
      shuffleArray(questionsForTreatment);
      questionsForTreatment.forEach((cv, i) => {
        cv.position = i + 1;
      });
      result.questions.push(...questionsForTreatment);
    });
  } else {
    questions.sort((a, b) => {
      const treatmentSortResult =
        treatmentIds.indexOf(a.treatmentId) -
        treatmentIds.indexOf(b.treatmentId);
      const positionSortResult = a.positionId - b.positionId;
      return treatmentSortResult !== 0
        ? treatmentSortResult
        : positionSortResult;
    });
    result.questions = questions;
  }
  return result;
};

export const loadAllTreatmentsConfiguration = () => {
  const treatments = csvParse(TREATMENTS_CSV, (e) => {
    return fromCSVRow(e);
  })
    .filter((d) => d.position !== INSTRUCTIONS_TREATMENT_POSITION)
    .sort((a, b) => {
      const treatmentSortResult = a.treatmentId - b.treatmentId;
      const positionSortResult = a.positionId - b.positionId;
      return treatmentSortResult !== 0
        ? treatmentSortResult
        : positionSortResult;
    });
  return treatments;
};

const fromCSVRow = (row) => {
  return Question({
    treatmentId: row.treatment_id ? +row.treatment_id : undefined,
    position:
      row.position === INSTRUCTIONS_TREATMENT_POSITION ||
      row.position === RANDOM_TREATMENT_POSITION
        ? row.position
        : row.position
        ? +row.position
        : undefined,
    viewType: row.view_type ? ViewType[row.view_type] : undefined,
    interaction: row.interaction ? InteractionType[row.interaction] : undefined,
    variableAmount: row.variable_amount
      ? AmountType[row.variable_amount]
      : undefined,
    amountEarlier: row.amount_earlier ? +row.amount_earlier : undefined,
    timeEarlier: row.time_earlier ? +row.time_earlier : undefined,
    dateEarlier: row.date_earlier
      ? dateToState(stringToDate(row.date_earlier))
      : undefined,
    amountLater: row.amount_later ? +row.amount_later : undefined,
    timeLater: row.time_later ? +row.time_later : undefined,
    dateLater: row.date_later
      ? dateToState(stringToDate(row.date_later))
      : undefined,
    maxAmount: row.max_amount ? +row.max_amount : undefined,
    maxTime: row.max_time ? +row.max_time : undefined,
    horizontalPixels: row.horizontal_pixels
      ? +row.horizontal_pixels
      : undefined,
    verticalPixels: row.vertical_pixels ? +row.vertical_pixels : undefined,
    leftMarginWidthIn: row.left_margin_width_in
      ? +row.left_margin_width_in
      : undefined,
    bottomMarginHeightIn: row.bottom_margin_height_in
      ? +row.bottom_margin_height_in
      : undefined,
    graphWidthIn: row.graph_width_in ? +row.graph_width_in : undefined,
    graphHeightIn: row.graph_height_in ? +row.graph_height_in : undefined,
    widthIn: row.width_in ? +row.width_in : undefined,
    heightIn: row.height_in ? +row.height_in : undefined,
    showMinorTicks: row.show_minor_ticks
      ? "yes" === row.show_minor_ticks.trim().toLowerCase()
        ? true
        : false
      : false,
    instructionGifPrefix: row.instruction_gif_prefix,
    comment: row.comment,
  });
};
