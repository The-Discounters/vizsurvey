import { csvParse } from "d3";
import { DateTime } from "luxon";
import { TREATMENTS_DEV_CSV, TREATMENTS_PROD_CSV } from "./treatments";
import { Question } from "./Question";
import { ViewType } from "./ViewType";
import { InteractionType } from "./InteractionType";
import { AmountType } from "./AmountType";
import { stringToDate, dateToState } from "./ConversionUtil";
import AWS from "aws-sdk";
import csv from "to-csv";

var TREATMENTS_CSV;
if (process.env.REACT_APP_ENV !== "production") {
  TREATMENTS_CSV = TREATMENTS_DEV_CSV;
} else {
  TREATMENTS_CSV = TREATMENTS_PROD_CSV;
}

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_REGION;

AWS.config.update({
  accessKeyId: process.env.REACT_APP_accessKeyId,
  secretAccessKey: process.env.REACT_APP_secretAccessKey,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

async function uploadFileOffline(name, data) {
  console.log("data: " + data);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, data: data }),
  };
  try {
    const response = await fetch("http://localhost:3001/test", requestOptions);
    const json = await response.json();
    console.log(json);
    console.log(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const uploadFile = (name, data) => {
  const params = {
    ACL: "public-read",
    Body: data,
    Bucket: S3_BUCKET,
    Key: name,
  };

  myBucket
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      console.log(Math.round((evt.loaded / evt.total) * 100));
    })
    .send((err) => {
      if (err) console.log(err);
    });
};

export const loadAllTreatments = () => {
  const treatments = csvParse(TREATMENTS_CSV, (e) => {
    return fromCSVRow(e);
  }).sort((a, b) =>
    a.position < b.position ? -1 : a.position === b.position ? 0 : 1
  );
  return treatments;
};

export const loadTreatment = (treatmentId) => {
  treatmentId = +treatmentId;
  const questions = csvParse(TREATMENTS_CSV, (e) => {
    return fromCSVRow(e);
  })
    .filter((d) => d.treatmentId === treatmentId)
    .sort((a, b) =>
      a.position < b.position ? -1 : a.position === b.position ? 0 : 1
    );
  return questions;
};

export const fromCSVRow = (row) => {
  return Question({
    treatmentId: row.treatment_id ? +row.treatment_id : undefined,
    position: row.position ? +row.position : undefined,
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
    comment: row.comment,
  });
};

export const convertToCSV = (answers) => {
  return csv(answers);
};

export const writeAnswers = (
  participantId,
  answers,
  timestamps,
  financialLitSurvey,
  purposeSurvey,
  demographic,
  legal
) => {
  const filename =
    "answers-" + participantId + "-" + DateTime.utc().toISO() + ".json";

  const answersCSV = convertToCSV(answers);
  const timestampsCSV = convertToCSV([timestamps]);
  const financialLitSurveyCSV = convertToCSV([financialLitSurvey]);
  const purposeSurveyCSV = convertToCSV([purposeSurvey]);
  const demographicCSV = convertToCSV([demographic]);
  const legalCSV = convertToCSV([legal]);

  const data = {
    surveyAnswers: {
      filename:
        "answers-" + participantId + "-" + DateTime.utc().toISO() + ".csv",
      data: answersCSV,
    },
    timestamps: {
      filename:
        "timestamps-" + participantId + "-" + DateTime.utc().toISO() + ".csv",
      data: timestampsCSV,
    },
    financialLitSurvey: {
      filename:
        "financial-lit-survey-" +
        participantId +
        "-" +
        DateTime.utc().toISO() +
        ".csv",
      data: financialLitSurveyCSV,
    },
    purposeSurvey: {
      filename:
        "purpose-survey-" +
        participantId +
        "-" +
        DateTime.utc().toISO() +
        ".csv",
      data: purposeSurveyCSV,
    },
    demographics: {
      filename:
        "demographic-" +
        demographic.participantId +
        "-" +
        DateTime.utc().toISO() +
        ".csv",
      data: demographicCSV,
    },
    legal: {
      filename:
        "legal-" + legal.participantId + "-" + DateTime.utc().toISO() + ".csv",
      data: legalCSV,
    },
  };

  if (process.env.REACT_APP_AWS_ENABLED) {
    console.log("AWS ENABLED");
    uploadFile(filename, data);
  } else {
    console.log("AWS DISABLED");
    uploadFileOffline(filename, data);
  }
};

export const writeTimestamps = (timestamps) => {
  const filename =
    "timestamps-" +
    timestamps.participantId +
    "-" +
    DateTime.utc().toISO() +
    ".csv";
  const csv = convertToCSV([timestamps]);
  if (process.env.REACT_APP_AWS_ENABLED) {
    console.log("AWS ENABLED");
    uploadFile(filename, csv);
  } else {
    console.log("AWS DISABLED");
    uploadFileOffline(filename, csv);
  }
};

export const writeFeedback = (feedback) => {
  const filename =
    "feedback-" +
    feedback.participantId +
    "-" +
    DateTime.utc().toISO() +
    ".csv";
  const csv = convertToCSV([feedback]);
  if (process.env.REACT_APP_AWS_ENABLED) {
    console.log("AWS ENABLED");
    uploadFile(filename, csv);
  } else {
    console.log("AWS DISABLED");
    uploadFileOffline(filename, csv);
  }
};
