import { csvParse } from "d3";
import { Octokit } from "octokit";
import { DateTime } from "luxon";
import { TREATMENTS_CSV } from "./treatments";
import { fromCSVRow } from "./Question";

export class FileIOAdapter {
  constructor() {}

  fetchQuestions = async (treatmentId) => {
    treatmentId = +treatmentId;
    const questions = csvParse(TREATMENTS_CSV, (e) => {
      return fromCSVRow(e);
    }).filter((d) => d.treatmentId === treatmentId);
    return questions;
  };

  writeAnswers = async (answersCSV, { getState }) => {
    const state = getState();
    const octokit = new Octokit({
      userAgent: "thesis_answers/v1.0",
      // eslint-disable-next-line no-undef
      auth: atob(process.env.REACT_APP_AUTH_TOKEN),
    });
    // eslint-disable-next-line no-undef
    const gistAnswerId = process.env.REACT_APP_GIST_ANSWER_ID;
    const url = `PATCH /gists/${gistAnswerId}`;
    const now = DateTime.now().toFormat("yyyy-MM-dd-H-mm-ss-SSS-ZZZZ");
    const files = {};
    answersCSV = `${answersCSV}`;
    files[`answers-subject-${state.questions.participant_id}-${now}.csv`] = {
      content: answersCSV,
    };
    const description = `Answer results for participant ${state.questions.participant_id} at ${now}`;
    console.log("submitting answers for " + description);
    const payloadObj = {
      gist_id: gistAnswerId,
      description: description,
      files: files,
    };
    const response = await octokit.request(url, payloadObj);

    const status = response.status;
    console.log("answers submitted with status of " + status);
  };
}
