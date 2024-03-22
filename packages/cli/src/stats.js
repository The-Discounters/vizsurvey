import { group } from "d3";
import { StatusType } from "@the-discounters/types";
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
      Object.entries(StatusType).map(([key, value]) => [
        value,
        value === StatusType.Survey ||
        value === StatusType.Debrief ||
        value === StatusType.Finished
          ? new Map([...this.#treatments].map((treatment) => [treatment, 0]))
          : 0,
      ])
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

  updateStats(participants) {
    const participantsByStatus = group(participants, (d) => d.status);
    Object.values(StatusType).forEach((status) => {
      if (
        status === StatusType.Survey ||
        status === StatusType.Debrief ||
        status === StatusType.Finished
      ) {
        this.#treatments.forEach((treatmentId) => {
          const participants = participantsByStatus.get(status);
          this.countsForStatus(status).set(
            treatmentId,
            participants
              ? participantsByStatus
                  .get(status)
                  .reduce(
                    (pv, cv) =>
                      pv +
                      cv.questions.filter((p) => p.treatmentId === treatmentId)
                        .length,
                    0
                  )
              : 0
          );
        });
      } else {
        this.#stats.set(
          status,
          participantsByStatus.get(status)
            ? participantsByStatus.get(status).length
            : 0
        );
      }
    });
    // TODO should we have a country type that we share with app drop down for country with a USA constant value
    this.#countryUSACount = participants.reduce(
      (acc, participant) =>
        acc + participant.countryOfResidence === "usa" ? 1 : 0,
      0
    );
    this.#countryOtherCount = participants.reduce(
      (acc, participant) =>
        acc + participant.countryOfResidence &&
        participant.countryOfResidence !== "usa"
          ? 1
          : 0,
      0
    );
    this.#feedback = participants.reduce((acc, participant) => {
      if (participant.feedback) {
        acc.push({
          date: stateToDate(participant.timestamps.debriefCompletedTimestamp),
          feedback: participant.feedback,
        });
      }
      return acc;
    }, []);
  }
}
