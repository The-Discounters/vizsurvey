import { csvParse } from "d3";
// import { Octokit } from "octokit";
// import { DateTime } from "luxon";
import { TREATMENTS_CSV } from "./treatments";
import { fromCSVRow } from "./Question";

export class FileIOAdapter {
  constructor() {}

  fetchQuestions = (treatmentId) => {
    treatmentId = +treatmentId;
    const questions = csvParse(TREATMENTS_CSV, (e) => {
      return fromCSVRow(e);
    }).filter((d) => d.treatmentId === treatmentId);
    return questions;
  };

  convertToCSV(answers) {
    const header = [
      "treatment_id,position,view_type,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,choice,shown_timestamp,answer_timestamp,highup,lowdown,participant_code",
    ];
    const rows = answers.map(
      (a) =>
        `${a.treatmentId}, ${a.position}, ${a.viewType}, ${a.amountEarlier}, ${a.timeEarlier}, ${a.dateEarlier}, ${a.amountLater}, ${a.timeLater}, ${a.dateLater}, , ${a.maxAmount}, ${a.maxTime}, ${a.choice}, ,${a.shownTimestamp}, ${a.choiceTimestamp}, ${a.highup}, ${a.lowdown}, ${a.paarticipantCode}`
    );
    return header.concat(rows).join("\n");
  }

  writeAnswers = async (answersCSV, { getState }) => {
    const state = getState();
    console.log(answersCSV);
    console.log(JSON.stringify(state));
    // const octokit = new Octokit({
    //   userAgent: "thesis_answers/v1.0",
    //   // eslint-disable-next-line no-undef
    //   auth: atob(process.env.REACT_APP_AUTH_TOKEN),
    // });
    // // eslint-disable-next-line no-undef
    // const gistAnswerId = process.env.REACT_APP_GIST_ANSWER_ID;
    // const url = `PATCH /gists/${gistAnswerId}`;
    // const now = DateTime.now().toFormat("yyyy-MM-dd-H-mm-ss-SSS-ZZZZ");
    // const files = {};
    // answersCSV = `${answersCSV}`;
    // files[`answers-subject-${state.questions.participant_id}-${now}.csv`] = {
    //   content: answersCSV,
    // };
    // const description = `Answer results for participant ${state.questions.participant_id} at ${now}`;
    // console.log("submitting answers for " + description);
    // const payloadObj = {
    //   gist_id: gistAnswerId,
    //   description: description,
    //   files: files,
    // };
    // const response = await octokit.request(url, payloadObj);

    // const status = response.status;
    // console.log("answers submitted with status of " + status);
  };
}
