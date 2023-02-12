import { participantUniqueKey } from "../../src/features/QuestionSliceUtil.js";

export class MergedData {
  #data = new Map();

  constructor() {}

  getEntry(key) {
    return this.#data.get(key);
  }

  addEntry(entry) {
    const key = participantUniqueKey(entry);
    console.log(`...merging data for key ${key}`);
    if (entry) {
      let existingData = this.#data.has(key)
        ? this.#data.get(key)
        : BLANK_STATE_JSON;
      if (entry.length === 1) {
        console.log("...merging single row entry");
        this.#data.set(key, { ...existingData, ...entry[0] });
      } else {
        console.log(
          "...detected answer data (multiple rows) so converting to single row"
        );
        this.#data.set(key, {
          ...existingData,
          // for the legacy files from the pilot study, convert the multiple answer rows to a single row
          ...convertAnswersAryToObj(entry),
        });
      }
      console.log(`...data merged`);
    } else {
      console.log(`...no data to merge`);
    }
  }
}
