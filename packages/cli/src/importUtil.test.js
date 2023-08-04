import admin from "firebase-admin";
import { DateTime } from "luxon";
import {
  typeExperimentObj,
  typeQuestionObj,
  typeTreatmentObj,
  typeTreatmentQuestionObj,
  parseLinkText,
} from "./importUtil.js";
import { ExperimentType } from "@the-discounters/domain";
import { InteractionType } from "@the-discounters/domain";
import { AmountType } from "@the-discounters/domain";
import { ViewType } from "@the-discounters/domain";
import { ProlificStudyStatusType } from "@the-discounters/prolific";

describe("importUtil test ", () => {
  it("Test typeExperimentObj valid fields.", async () => {
    const input = {
      id: "1",
      status: "unpublished",
      type: "betweenSubject",
      start_date: "1/1/2023",
      end_date: "1/2/2023",
      num_participants: "1",
      num_participants_completed: "0",
      num_participants_started: "0",
    };
    const result = typeExperimentObj(input);
    expect(result).toEqual({
      id: 1,
      status: ProlificStudyStatusType.unpublished,
      type: ExperimentType.betweenSubject,
      start_date: admin.firestore.Timestamp.fromDate(
        DateTime.fromFormat("1/1/2023", "M/d/yyyy").toJSDate()
      ),
      end_date: admin.firestore.Timestamp.fromDate(
        DateTime.fromFormat("1/2/2023", "M/d/yyyy").toJSDate()
      ),
      num_participants: 1,
      num_participants_completed: 0,
      num_participants_started: 0,
    });
  });

  it("Test typeQuestionObj valid fields.", async () => {
    const input = {
      id: "1",
      amount_earlier: "100",
      time_earlier: "1",
      date_earlier: "1/1/2023",
      amount_later: "200",
      time_later: "2",
      date_later: "2/2/2023",
      max_amount: "300",
      max_time: "4",
    };
    const result = typeQuestionObj(input);
    expect(result).toEqual({
      id: 1,
      amount_earlier: 100,
      time_earlier: 1,
      date_earlier: admin.firestore.Timestamp.fromDate(
        DateTime.fromFormat("1/1/2023", "M/d/yyyy").toJSDate()
      ),
      amount_later: 200,
      time_later: 2,
      date_later: admin.firestore.Timestamp.fromDate(
        DateTime.fromFormat("2/2/2023", "M/d/yyyy").toJSDate()
      ),
      max_amount: 300,
      max_time: 4,
    });
  });

  it("Test typeTreatmentObj.", async () => {
    const input = {
      id: "1",
      interaction: "none",
      variable_amount: "earlierAmount",
      instruction_question_id: "1",
      view_type: "word",
      horizontal_pixels: "100",
      vertical_pixels: "200",
      left_margin_width_in: "1",
      left_margin_width_in: "2",
      bottom_margin_height_in: "3",
      graph_width_in: "4",
      graph_height_in: "5",
      width_in: "6",
      height_in: "7",
      show_minor_ticks: "yes",
    };
    const result = typeTreatmentObj(input);
    expect(result).toEqual({
      id: 1,
      interaction: InteractionType.none,
      variable_amount: AmountType.earlierAmount,
      instruction_question_id: 1,
      view_type: ViewType.word,
      horizontal_pixels: 100,
      vertical_pixels: 200,
      left_margin_width_in: 1,
      left_margin_width_in: 2,
      bottom_margin_height_in: 3,
      graph_width_in: 4,
      graph_height_in: 5,
      width_in: 6,
      height_in: 7,
      show_minor_ticks: true,
    });
  });

  it("Test typeTreatmentQuestionObj.", async () => {
    const input = {
      exp_id: "1",
      treatment_id: "1",
      question_id: "1",
      sequence_id: "1",
    };
    const result = typeTreatmentQuestionObj(input);
    expect(result).toEqual({
      exp_id: 1,
      treatment_id: 1,
      question_id: 1,
      sequence_id: 1,
    });
  });

  it("Test parseLinkText.", async () => {
    const result = parseLinkText(
      "docRefForeign.foreignKey=>docRefPrimary.primaryKey"
    );
    expect(result.leftPath).toBe("docRefForeign");
    expect(result.leftField).toBe("foreignKey");
    expect(result.rightPath).toBe("docRefPrimary");
    expect(result.rightField).toBe("primaryKey");
  });
});
