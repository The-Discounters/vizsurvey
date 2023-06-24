import admin from "firebase-admin";
import { ProlificStudyStatusType } from "./ProlificStatusTypes.js";
import { ExperimentType } from "./experimentType.js";
import { InteractionType } from "./InteractionType.js";
import { ViewType } from "./ViewType.js";
import { stringToDate } from "./ConversionUtil.js";
import { AmountType } from "./AmountType.js";

export const typeExperimentObj = (obj) => {
  obj.id = +obj.id;
  if (!ProlificStudyStatusType[obj.status]) {
    throw "Invalid status column value.";
  }
  obj.status = ProlificStudyStatusType[obj.status];
  if (!ExperimentType[obj.type]) {
    throw "Invalid type column value.";
  }
  obj.type = ExperimentType[obj.type];
  obj.start_date = obj.start_date
    ? admin.firestore.Timestamp.fromDate(
        stringToDate(obj.start_date).toJSDate()
      )
    : null;
  obj.end_date = obj.end_date
    ? admin.firestore.Timestamp.fromDate(stringToDate(obj.end_date).toJSDate())
    : null;
  obj.num_participants = +obj.num_participants;
  obj.num_participants_started = obj.num_participants_started
    ? +obj.num_participants_started
    : null;
  obj.num_participants_completed = obj.num_participants_completed
    ? +obj.num_participants_completed
    : null;
  return obj;
};

export const typeQuestionObj = (obj) => {
  obj.id = +obj.id;
  obj.amount_earlier = +obj.amount_earlier;
  obj.time_earlier = +obj.time_earlier;
  obj.date_earlier = obj.date_earlier
    ? admin.firestore.Timestamp.fromDate(
        stringToDate(obj.date_earlier).toJSDate()
      )
    : null;
  obj.amount_later = +obj.amount_later;
  obj.time_later = +obj.time_later;
  obj.date_later = obj.date_later
    ? admin.firestore.Timestamp.fromDate(
        stringToDate(obj.date_later).toJSDate()
      )
    : null;
  obj.max_amount = +obj.max_amount;
  obj.max_time = +obj.max_time;
  return obj;
};

export const typeTreatmentObj = (obj) => {
  obj.id = +obj.id;
  if (!InteractionType[obj.interaction]) {
    throw "Invalid interaction type column value.";
  }
  if (!ViewType[obj.view_type]) {
    throw "Invalid view_type column value.";
  }
  if (!InteractionType[obj.interaction]) {
    throw "Invalid interaction column value.";
  }
  if (!AmountType[obj.variable_amount]) {
    throw "Invalid variable_amount column value.";
  }
  obj.instruction_question_id = +obj.instruction_question_id;
  obj.horizontal_pixels = obj.horizontal_pixels ? +obj.horizontal_pixels : null;
  obj.vertical_pixels = obj.vertical_pixels ? +obj.vertical_pixels : null;
  obj.left_margin_width_in = obj.left_margin_width_in
    ? +obj.left_margin_width_in
    : null;
  obj.bottom_margin_height_in = obj.bottom_margin_height_in
    ? +obj.bottom_margin_height_in
    : null;
  obj.graph_width_in = obj.graph_width_in ? +obj.graph_width_in : null;
  obj.graph_height_in = obj.graph_height_in ? +obj.graph_height_in : null;
  obj.width_in = obj.width_in ? +obj.width_in : null;
  obj.height_in = obj.height_in ? +obj.height_in : null;
  obj.show_minor_ticks = obj.show_minor_ticks
    ? "yes" === obj.show_minor_ticks.trim().toLowerCase()
      ? true
      : false
    : false;
  return obj;
};

export const typeTreatmentQuestionObj = (obj) => {
  obj.exp_id = +obj.exp_id;
  obj.treatment_id = +obj.treatment_id;
  obj.question_id = +obj.question_id;
  obj.sequence_id = +obj.sequence_id;
  return obj;
};

export const parseLinkText = (text) => {
  //  <collection path>.<field name>=><collection path>.<field name>
  const terms = text.split("=>");
  const leftTerm = terms[0].split(".");
  const rightTerm = terms[1].split(".");
  return {
    leftPath: leftTerm[0],
    leftField: leftTerm[1],
    rightPath: rightTerm[0],
    rightField: rightTerm[1],
  };
};
