import { csvParse, group } from "d3";
import { Question } from "./Question.js";
import { ViewType } from "./ViewType.js";
import { InteractionType } from "./InteractionType.js";
import { AmountType } from "./AmountType.js";
import { stringToDate, dateToState } from "./ConversionUtil.js";
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

export const loadTreatmentConfiguration = (treatmentId) => {
  treatmentId = +treatmentId;
  const rows = csvParse(TREATMENTS_CSV, (e) => {
    return fromCSVRow(e);
  }).filter((d) => d.treatmentId === treatmentId);
  const grouped = group(rows, (d) =>
    Number.isInteger(d.position) ? "questions" : INSTRUCTIONS_TREATMENT_POSITION
  );
  const questions = grouped
    .get("questions")
    .filter((d) => Number.isInteger(d.position))
    .sort((a, b) =>
      a.position < b.position ? -1 : a.position === b.position ? 0 : 1
    );

  return {
    questions: questions,
    instructions: grouped.get(INSTRUCTIONS_TREATMENT_POSITION),
  };
};

export const loadAllTreatmentsConfiguration = () => {
  const treatments = csvParse(TREATMENTS_CSV, (e) => {
    return fromCSVRow(e);
  })
    .filter((d) => d.position !== INSTRUCTIONS_TREATMENT_POSITION)
    .sort((a, b) =>
      a.position < b.position ? -1 : a.position === b.position ? 0 : 1
    );
  return treatments;
};

const fromCSVRow = (row) => {
  return Question({
    treatmentId: row.treatment_id ? +row.treatment_id : undefined,
    position:
      row.position === INSTRUCTIONS_TREATMENT_POSITION
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
