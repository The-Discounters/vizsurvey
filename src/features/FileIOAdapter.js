import { csvParse } from "d3";
import { DateTime } from "luxon";
import csv from "to-csv";
import * as d3 from "d3";

import { TREATMENTS_DEV_CSV, TREATMENTS_PROD_CSV } from "./treatments";
import { Question } from "./Question";
import { ViewType } from "./ViewType";
import { InteractionType } from "./InteractionType";
import { AmountType } from "./AmountType";
import { stringToDate, dateToState } from "./ConversionUtil";

import AWS from "aws-sdk";

export const INSTRUCTIONS_TREATMENT_POSITION = "instructions";

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

const uploadFileOffline = (name, data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, data: data }),
  };
  fetch("http://localhost:3001/test", requestOptions)
    .then((response) => response.json())
    .then((data) => console.log(data));
};

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

export class FileIOAdapter {
  constructor() {}

  loadAllTreatments = () => {
    const treatments = csvParse(TREATMENTS_CSV, (e) => {
      return this.fromCSVRow(e);
    })
      .filter((d) => d.position !== INSTRUCTIONS_TREATMENT_POSITION)
      .sort((a, b) =>
        a.position < b.position ? -1 : a.position === b.position ? 0 : 1
      );
    return treatments;
  };

  loadTreatment = (treatmentId) => {
    treatmentId = +treatmentId;
    const rows = csvParse(TREATMENTS_CSV, (e) => {
      return this.fromCSVRow(e);
    }).filter((d) => d.treatmentId === treatmentId);
    const grouped = d3.group(rows, (d) =>
      Number.isInteger(d.position)
        ? "questions"
        : INSTRUCTIONS_TREATMENT_POSITION
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

  fromCSVRow(row) {
    return Question({
      treatmentId: row.treatment_id ? +row.treatment_id : undefined,
      position:
        row.position === INSTRUCTIONS_TREATMENT_POSITION
          ? row.position
          : row.position
          ? +row.position
          : undefined,
      viewType: row.view_type ? ViewType[row.view_type] : undefined,
      interaction: row.interaction
        ? InteractionType[row.interaction]
        : undefined,
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
  }

  convertToCSV(answers) {
    return csv(answers);
  }

  generateFilenameSuffix(participantId, studyId) {
    return `${participantId}-${studyId}-${DateTime.now().toMillis()}`;
  }

  writeAnswers = async (
    participantId,
    studyId,
    answers,
    timestamps,
    discountLitSurvey,
    financialLitSurvey,
    purposeSurvey,
    demographic,
    legal
  ) => {
    const filename = `answers-${this.generateFilenameSuffix(
      participantId,
      studyId
    )}.json`;

    const answersCSV = this.convertToCSV(answers);
    const timestampsCSV = this.convertToCSV([timestamps]);
    const discountLitSurveyCSV = this.convertToCSV([discountLitSurvey]);
    const financialLitSurveyCSV = this.convertToCSV([financialLitSurvey]);
    const purposeSurveyCSV = this.convertToCSV([purposeSurvey]);
    const demographicCSV = this.convertToCSV([demographic]);
    const legalCSV = this.convertToCSV([legal]);

    const data = {
      surveyAnswers: {
        filename: `answers-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: answersCSV,
      },
      answerTimestamps: {
        filename: `answer-timestamps-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: timestampsCSV,
      },
      discountLitSurvey: {
        filename: `discount-lit-survey-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: discountLitSurveyCSV,
      },
      financialLitSurvey: {
        filename: `financial-lit-survey-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: financialLitSurveyCSV,
      },
      purposeSurvey: {
        filename: `purpose-survey-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: purposeSurveyCSV,
      },
      demographics: {
        filename: `demographics-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: demographicCSV,
      },
      legal: {
        filename: `legal-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: legalCSV,
      },
    };
    const dataJSON = JSON.stringify(data, null, 2);

    if (process.env.REACT_APP_AWS_ENABLED) {
      console.log("AWS ENABLED");
      uploadFile(filename, dataJSON);
    } else {
      console.log("AWS DISABLED");
      uploadFileOffline(filename, dataJSON);
    }
  };

  writeFeedback = async (participantId, studyId, feedback, timestamps) => {
    const fileNameFeedback = `debrief-${this.generateFilenameSuffix(
      participantId,
      studyId
    )}.json`;

    const feedbackCSV = this.convertToCSV([feedback]);
    const timestampsCSV = this.convertToCSV([timestamps]);

    const data = {
      feedback: {
        filename: `feedback-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: feedbackCSV,
      },
      debriefTimestamps: {
        filename: `debrief-timestamps-${this.generateFilenameSuffix(
          participantId,
          studyId
        )}.csv`,
        data: timestampsCSV,
      },
    };

    const dataJSON = JSON.stringify(data, null, 2);

    if (process.env.REACT_APP_AWS_ENABLED) {
      console.log("AWS ENABLED");
      uploadFile(fileNameFeedback, dataJSON);
    } else {
      console.log("AWS DISABLED");
      uploadFileOffline(fileNameFeedback, dataJSON);
    }
  };
}
