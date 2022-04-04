import { FileIOAdapter } from "./FileIOAdapter";
import { InteractionType } from "./InteractionType";
import { VariableType } from "./VariableType";
import { ViewType } from "./ViewType";
import { ChoiceType } from "./ChoiceType";
import { Answer } from "./Answer";
import { DateTime } from "luxon";

describe("FileIOAdapter tests", () => {
  test("Validate treatment CSV fields are loaded correctly.", async () => {
    const io = new FileIOAdapter();
    const questions = await io.fetchQuestions(1);
    expect(questions.length).toBe(1);
    expect(questions[0].treatmentId).toBe(1);
    expect(questions[0].position).toBe(1);
    expect(questions[0].viewType).toBe(ViewType.word);
    expect(questions[0].interaction).toBe(InteractionType.none);
    expect(questions[0].variableAmount).toBe(VariableType.none);
    expect(questions[0].amountEarlier).toBe(500);
    expect(questions[0].timeEarlier).toBe(2);
    expect(questions[0].dateEarlier).toBeUndefined();
    expect(questions[0].amountLater).toBe(1000);
    expect(questions[0].timeLater).toBe(3);
    expect(questions[0].dateLater).toBeUndefined();
    expect(questions[0].maxAmount).toBe(0);
    expect(questions[0].maxTime).toBe(10);
    expect(questions[0].horizontalPixels).toBe(0);
    expect(questions[0].verticalPixels).toBe(0);
    expect(questions[0].leftMarginWidthIn).toBeNaN();
    expect(questions[0].bottomMarginHeightIn).toBeNaN();
    expect(questions[0].graphWidthIn).toBe(0);
    expect(questions[0].graphHeightIn).toBe(0);
    expect(questions[0].width).toBeNaN();
    expect(questions[0].height).toBeNaN();
    expect(questions[0].comment).toBe("Read 2001 example, absolute size");
  });

  test("Validate treatment CSV fields are loaded correctly.", async () => {
    const answer1 = new Answer({
      treatmentId: 1,
      position: 2,
      viewType: ViewType.word,
      interaction: InteractionType.none,
      amountEarlier: 3,
      timeEarlier: 4,
      dateEarlier: DateTime.utc(2001, 1, 1, 1, 1, 1, 1),
      amountLater: 5,
      timeLater: 6,
      dateLater: DateTime.utc(2001, 1, 1, 2, 1, 1, 1),
      maxAmount: 7,
      maxTime: 8,
      verticalPixels: 9,
      horizontalPixels: 10,
      leftMarginWidthIn: 11,
      bottomMarginHeightIn: 12,
      graphWidthIn: 13,
      graphHeightIn: 14,
      choice: ChoiceType.earlier,
      shownTimestamp: DateTime.utc(2001, 1, 1, 3, 1, 1, 1),
      choiceTimestamp: DateTime.utc(2001, 1, 1, 4, 1, 1, 1),
      highup: 15,
      lowdown: 16,
      participantCode: "participant code",
    });
    const answer2 = new Answer({
      treatmentId: 13,
      position: 14,
      viewType: ViewType.barchart,
      interaction: InteractionType.drag,
      amountEarlier: 15,
      timeEarlier: 16,
      dateEarlier: DateTime.utc(2001, 1, 2, 1, 1, 1, 1),
      amountLater: 17,
      timeLater: 18,
      dateLater: DateTime.utc(2001, 1, 2, 2, 1, 1, 1),
      maxAmount: 19,
      maxTime: 20,
      verticalPixels: 21,
      horizontalPixels: 22,
      leftMarginWidthIn: 23,
      bottomMarginHeightIn: 24,
      graphWidthIn: 25,
      graphHeightIn: 26,
      choice: ChoiceType.later,
      shownTimestamp: DateTime.utc(2001, 1, 2, 3, 1, 1, 1),
      choiceTimestamp: DateTime.utc(2001, 1, 2, 4, 1, 1, 1),
      highup: 27,
      lowdown: 28,
      participantCode: "participant code 2",
    });
    const answers = [answer1, answer2];
    const io = new FileIOAdapter();
    const result = io.convertToCSV(answers);
    console.log(result);
    expect(result)
      .toBe(`treatment_id,position,view_type,interaction,amount_earlier,time_earlier,date_earlier,amount_later,time_later,date_later,max_amount,max_time,vertical_pixels,horizontal_pixels,left_margin_width_in,bottom_margin_height_in,graph_width_in,graph_height_in,choice,shown_timestamp,choice_timestamp,highup,lowdown,participant_code
1, 2, ViewType.word, InteractionType.none, 3, 4, 2001-01-01T01:01:01.001Z, 5, 6, 2001-01-01T02:01:01.001Z, 7, 8, 9, 10, 11, 12, 13, 14, earlier, 2001-01-01T03:01:01.001Z, 2001-01-01T04:01:01.001Z, 15, 16, participant code
13, 14, ViewType.barchart, InteractionType.drag, 15, 16, 2001-01-02T01:01:01.001Z, 17, 18, 2001-01-02T02:01:01.001Z, 19, 20, 21, 22, 23, 24, 25, 26, later, 2001-01-02T03:01:01.001Z, 2001-01-02T04:01:01.001Z, 27, 28, participant code 2`);
  });
});
