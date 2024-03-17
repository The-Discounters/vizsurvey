import { group } from "d3";
import { StatusType, AmountType } from "@the-discounters/types";
import { stateToDate } from "@the-discounters/util";

export class Stats {
  #totalParticipants;
  #treatments;
  #countryUSACount;
  #countryOtherCount;
  #stats;
  #feedback;

  constructor(treatments, totalParticipants) {
    this.#totalParticipants = totalParticipants;
    this.#treatments = treatments;
    this.#stats = new Map(
      Object.entries(StatusType).map(([key, value]) => [value, 0])
    );
    this.#stats.set(
      StatusType.Survey,
      new Map([...this.#treatments].map((treatment) => [treatment, 0]))
    );
  }

  get countryUSACount() {
    return this.#countryUSACount;
  }

  get countryOtherCount() {
    return this.#countryOtherCount;
  }

  get totalParticipants() {
    return this.#totalParticipants;
  }

  get feedback() {
    return this.#feedback;
  }

  get treatments() {
    return this.#treatments;
  }

  countsForStatus(status) {
    return this.#stats.get(status);
  }

  completedQuestionsCount(questions) {
    const result = new Map(
      [...this.#treatments].map((treatment) => [treatment, 0])
    );
    group(questions, (d) => d.treatmentId).forEach(
      (questionsForTreatment, treatmentId) =>
        result.set(
          treatmentId,
          questionsForTreatment.filter(
            (question) => question.choice !== AmountType.none
          ).length
        )
    );
    return result;
  }

  updateStats(participants) {
    group(participants, (d) => d.status).forEach(
      (participantsForStatus, status) => {
        if (
          status === StatusType.Survey ||
          status === StatusType.Debrief ||
          status === StatusType.Finished
        ) {
          participantsForStatus.forEach((participant) => {
            this.#stats.set(
              status,
              this.completedQuestionsCount(participant.questions)
            );
          });
        } else {
          this.#stats.set(status, participantsForStatus.length);
        }
      }
    );
    this.#countryUSACount = participants.filter(
      (participant) => participant.countryOfResidence === "usa" // TODO should we have a country type that we share with app drop down for country with a USA constant value
    ).length;
    this.#countryOtherCount = participants.length - this.#countryUSACount;
    this.#feedback = participants.reduce((acc, participant) => {
      if (participant.feedback) {
        acc.push({
          date: stateToDate(participant.debriefCompletedTimestamp),
          feedback: participant.feedback,
        });
      }
      return acc;
    }, []);
  }
}
