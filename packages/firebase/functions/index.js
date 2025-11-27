/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { stateToDate } from "@the-discounters/util";
import {
  Experiment,
  ServerStatusType,
  StatusError,
  clientSurveyQuestionFields,
  setUndefinedPropertiesNull,
} from "@the-discounters/types";
import {
  readParticipant,
  updateParticipant,
  createAuditLogEntry,
  readExperiment,
  readExperimentAndQuestions,
} from "@the-discounters/firebase-shared";
import {
  signupParticipant,
  validateExperiment,
  assignParticipantSequenceNumberXaction,
  filterQuestions,
  parseQuestions,
  orderQuestions,
  //incParticipantCompletedXaction,
} from "./functionsUtil.js";

initializeApp();
const db = getFirestore();

//const CORS_URLS = process.env.CORS_URLS ? process.env.CORS_URLS.split(",") : [];;

const validateKeyValues = ({ participantId, studyId, sessionId }) => {
  if (!participantId || !studyId) {
    throw new StatusError({
      message: `Error with request parameters. prolific_pid or study_id not in request.`,
      httpstatus: 400,
      reason: ServerStatusType.invalid,
      participantId,
      studyId,
      sessionId,
    });
  }
  return { participantId, studyId, sessionId };
};

// TODO fix cors to use CORS_URL since we can then specify the urls per environment.
export const signup = onRequest(
  {
    cors: [
      "https://localhost:3000",
      "https://main.d2ptxb5fbsc082.amplifyapp.com",
      "https://staging.d2ptxb5fbsc082.amplifyapp.com",
      "https://release.d2ptxb5fbsc082.amplifyapp.com",
    ],
  },
  async (request, response) => {
    logger.info(
      `signup request prolific_pid=${request.query.prolific_pid}, study_id=${request.query.study_id}, session_id=${request.query.session_id}, treatment_ids=${request.query.treatment_ids}`
    );
    const participantId = request.query.prolific_pid;
    const studyId = request.query.study_id;
    const sessionId = request.query.session_id;
    const requestTreatmentIds = request.query.treatment_ids
      ? JSON.parse(request.query.treatment_ids)
      : null;
    const requestQuestionIdsOrder = request.query.question_order_ids
      ? JSON.parse(request.query.question_order_ids)
      : null;
    const userAgent = request.query.user_agent;
    try {
      if (requestTreatmentIds) {
        logger.info(
          `signup REQUEST OVER RODE TREATMENTS IN EXPERIMENT CONFIGURATION WITH TREATMENT IDS ${requestTreatmentIds}`
        );
      }
      if (requestQuestionIdsOrder) {
        logger.info(
          `signup REQUEST OVER RODE QUESTION ORDER IN EXPERIMENT CONFIGURATION WITH QUESTION IDS IN ORDER ${requestQuestionIdsOrder}`
        );
      }
      validateKeyValues({ participantId, studyId, sessionId });
      logger.info(
        `signup fetching experiment for prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      const { experimentId, sequenceNumber } =
        await assignParticipantSequenceNumberXaction(db, studyId);
      logger.info(
        `signup Assigned participant number ${sequenceNumber}, experimentId ${experimentId}, participantId ${participantId}.`
      );
      logger.info(
        `signup reading back experiment for prolificPid=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      const exp =  validateExperiment(
        await readExperimentAndQuestions(db, studyId)
      );
      // It's possible other participants signed up and the count increased so we can't check equal to
      if (exp.numParticipantsStarted < sequenceNumber) {
        logger.warning(
          `signup read back experiment with numParticipantsStarted ${exp.numParticipantsStarted} which is less than the value ${sequenceNumber} when it should be equal to or greater than.`
        );
      }
      logger.info(
        `signup Signing up participant for experimentId ${exp.experimentId}, participantId ${participantId}, server assigned sequence ${sequenceNumber}`
      );
      const signupData = await signupParticipant(
        db,
        participantId,
        studyId,
        sessionId,
        sequenceNumber,
        exp,
        (isError, msg) => {
          if (!isError) {
            logger.info(msg);
          } else {
            throw new StatusError({
              message: msg,
              httpstatus: 500,
              reason: ServerStatusType.error,
            });
          }
        },
        requestTreatmentIds,
        requestQuestionIdsOrder
      );
      signupData.status = ServerStatusType.success;
      signupData.experiment = Experiment(exp);
      logger.info(
        `signup Senging back singup data ${JSON.stringify(
          signupData
        )} for experimentId ${
          exp.experimentId
        }, participantId ${participantId}, server assigned sequence ${sequenceNumber}`
      );
      response.status(200).json(signupData);
    } catch (err) {
      logger.error(
        `signup ${err.message} participantId=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      if (err.message == `Experiment not found for studyId ${studyId}`) {
        response
          .status(404)
          .json({ status: ServerStatusType.notfound });
      } else {
        response
          .status(err.httpstatus ? err.httpstatus : 500)
          .json({ status: err.reason ? err.reason : ServerStatusType.error });
      }
    }
  }
);

export const updateState = onRequest(
  {
    cors: [
      "https://localhost:3000",
      "https://main.d2ptxb5fbsc082.amplifyapp.com",
      "https://staging.d2ptxb5fbsc082.amplifyapp.com",
      "https://release.d2ptxb5fbsc082.amplifyapp.com",
    ],
  },
  async (request, response) => {
    logger.info(
      `updateState prolific_pid=${request.body.prolific_pid}, study_id=${request.body.study_id}, session_id=${request.body.session_id}`
    );
    const participantId = request.body.prolific_pid;
    const studyId = request.body.study_id;
    const sessionId = request.body.session_id;
    let requestSequence;
    try {
      validateKeyValues({ participantId, studyId, sessionId });
      let state = request.body.state;
      requestSequence = state.requestSequence;
      if (!state) {
        throw new StatusError({
          message: "Error with request parameters. payload not in request.",
          httpstatus: 400,
          reason: ServerStatusType.invalid,
        });
      }
      const exp = validateExperiment(await readExperiment(db, studyId));
      logger.info(
        `updateState requestSequence=${requestSequence} fetched experiment ${exp.experimentId} for studyId=${studyId}, numParticipantsStarted = ${exp.numParticipantsStarted}, numParticipants = ${exp.numParticipants}, status = ${exp.status}, prolificPid = ${participantId}, sessionId = ${sessionId}`
      );
      state = { ...state, serverTimestamp: Timestamp.now() };
      state.browserTimestamp = state.browserTimestamp
        ? Timestamp.fromDate(stateToDate(state.browserTimestamp).toJSDate())
        : state.browserTimestamp;

      const currentParticipant = await readParticipant(
        db,
        exp.path,
        participantId
      );
      if (
        !currentParticipant.requestSequence ||
        state.requestSequence > currentParticipant.requestSequence
      ) {
        logger.info(
          `updateState current requestSequence ${state.requestSequence} is greater than last request sequence ${currentParticipant.requestSequence} so updating participant entry foer participantId=${participantId}, study_id=${studyId}, session_id=${sessionId}}`
        );
        const writeTime = await updateParticipant(
          db,
          exp.path,
          participantId,
          state
        );
        if (!writeTime) {
          throw new StatusError({
            message: "did not update.",
            httpstatus: 400,
            reason: ServerStatusType.invalid,
          });
        }
        logger.info(
          `updateState succesfull requestSequence=${requestSequence}, participantId=${participantId}, study_id=${studyId}, session_id=${sessionId} update time ${writeTime.toDate()}`
        );
        // TODO not clear that we need this.  I can count the number of completed participant entries.
        // if (currentParticipant.status === StatusType.Debrief) {
        //   const numCompletedBefore = exp.numCompleted;
        //   const numCompleted = incParticipantCompletedXaction(db, studyId);
        //   logger.info(
        //     `updateState numParticipantsCompleted incremented from ${numCompletedBefore} to ${numCompleted} for study_id=${studyId}} on participantId=${participantId}`
        //   );
        // }
      } else {
        logger.info(
          `updateState current requestSequence ${state.requestSequence} is NOT greater than or is equal to last request sequence ${currentParticipant.requestSequence} so NOT updating participant entry for participantId=${participantId}, study_id=${studyId}, session_id=${sessionId}}`
        );
      }
      await createAuditLogEntry(
        db,
        exp.path,
        participantId,
        requestSequence,
        state.serverTimestamp,
        state
      );
      response.status(200).json({
        status: ServerStatusType.success,
        requestSequence: requestSequence,
      });
    } catch (err) {
      logger.error(
        `updateState requestSequence=${requestSequence}, ${err.message}, httpstatus=${err.httpstatus} participantId=${participantId}, studyId=${studyId}, sessionId=${sessionId}`
      );
      if (err.message == `Experiment not found for studyId ${studyId}`) {
        response
          .status(404)
          .json({ status: ServerStatusType.notfound });
      } else {
      response
        .status(err.httpstatus ? err.httpstatus : 500)
        .json({ status: err.reason ? err.reason : ServerStatusType.error });
      }
    }
  }
);

export const version = onRequest(
  {
    cors: [
      "https://localhost:3000",
      "https://main.d2ptxb5fbsc082.amplifyapp.com",
      "https://staging.d2ptxb5fbsc082.amplifyapp.com",
      "https://release.d2ptxb5fbsc082.amplifyapp.com",
    ],
  },
  async (request, response) => {
    logger.info(`version ${process.env.npm_package_version}`);
    try {
      response.status(200).json({
        version: process.env.npm_package_version,
        commitId: `${process.env.GIT_COMMIT_HASH}`,
      });
    } catch (err) {
      logger.error(`version ${err.message}, httpstatus=${err.httpstatus}`);
      response
        .status(err.httpstatus ? err.httpstatus : 500)
        .json({ status: err.reason ? err.reason : ServerStatusType.error });
    }
  }
);

export const readExperimentConfigurations = onRequest(
  {
    cors: [
      "https://localhost:3000",
      "https://main.d2ptxb5fbsc082.amplifyapp.com",
      "https://staging.d2ptxb5fbsc082.amplifyapp.com",
      "https://release.d2ptxb5fbsc082.amplifyapp.com",
    ],
  },
  async (request, response) => {
    logger.info(
      `readExperimentConfigurations study_ids=${request.query.study_ids}, treatment_ids=${request.query.treatment_ids}, question_order_ids=${request.query.question_order_ids}`
    );
    const studyIds = request.query.study_ids
      ? request.query.study_ids.split(",")
      : null;
    const requestTreatmentIds = request.query.treatment_ids
      ? request.query.treatment_ids.split(",").map((v) => +v)
      : null;
    1;
    const requestQuestionIdsOrder = request.query.question_order_ids
      ? request.query.question_order_ids.split(",").map((v) => +v)
      : null;
    try {
      if (requestQuestionIdsOrder) {
        logger.info(
          `readExperimentConfigurations REQUEST OVER RODE QUESTION ORDER IN EXPERIMENT CONFIGURATION WITH QUESTION IDS IN ORDER ${requestQuestionIdsOrder}`
        );
      }
      if (!studyIds || !requestTreatmentIds) {
        throw new StatusError({
          message: `Error with request parameters. study_ids or treatment_ids not in request.`,
          httpstatus: 400,
          reason: ServerStatusType.invalid,
          participantId: null,
          studyId: studyIds,
          sessionId: null,
        });
      }
      const result = {
        experiments: [],
        surveys: [],
        instructions: [],
      };
      for (let studyId of studyIds) {
        logger.info(
          `readExperimentConfigurations fetching experiment for studyId=${studyId}`
        );
        const exp = await readExperimentAndQuestions(db, studyId);
        if (!exp) {
          throw new StatusError({
            message: "tried to access experiment that was not found",
            httpstatus: 400,
            reason: ServerStatusType.invalid,
          });
        }
        result.experiments.push(Experiment(exp));
        let treatmentQuestions = filterQuestions(
          requestTreatmentIds,
          exp.treatmentQuestions
        );
        let { instruction, survey } = parseQuestions(treatmentQuestions);
        survey = clientSurveyQuestionFields(survey);
        survey = survey.map((v) => setUndefinedPropertiesNull(v));
        survey = orderQuestions(
          survey,
          requestTreatmentIds,
          requestQuestionIdsOrder
        );
        if (survey === undefined) {
          throw new StatusError({
            message: `readExperimentConfigurations could not order questions for ${exp.experimentId}`,
            httpstatus: 500,
            reason: ServerStatusType.error,
          });
        }
        result.surveys.push(survey);
        result.instructions.push(instruction);
      }
      logger.info(
        `readExperimentConfigurations Senging back singup data ${JSON.stringify(
          result
        )} for studIds ${studyIds}`
      );
      result.status = ServerStatusType.success;
      response.status(200).json(result);
    } catch (err) {
      logger.error(
        `readExperimentConfigurations ${err.message}, studyIds=${studyIds}`
      );
      if (err.message == `Experiment not found for studyId ${studyId}`) {
        response
          .status(404)
          .json({ status: ServerStatusType.notfound });
      } else {
      response
        .status(err.httpstatus ? err.httpstatus : 500)
        .json({ status: err.reason ? err.reason : ServerStatusType.error });
      }
    }
  }
);
