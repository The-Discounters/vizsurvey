import {
  loadAllTreatmentsConfiguration,
  loadTreatmentConfiguration,
} from "./TreatmentUtil";
import { InteractionType } from "./InteractionType";
import { AmountType } from "./AmountType";
import { ViewType } from "./ViewType";

describe("TreatmentUtil tests", () => {
  test("Validate loadTreatmentConfiguration loads CSV fields correctly single treatment with position values.", async () => {
    var { questions, instructions } = await loadTreatmentConfiguration([1]);
    expect(questions.length).toBe(3);
    expect(questions[0].treatmentId).toBe(1);
    expect(questions[0].position).toBe(1);
    expect(questions[0].viewType).toBe(ViewType.word);
    expect(questions[0].interaction).toBe(InteractionType.none);
    expect(questions[0].variableAmount).toBe(AmountType.none);
    expect(questions[0].amountEarlier).toBe(500);
    expect(questions[0].timeEarlier).toBe(2);
    expect(questions[0].dateEarlier).toBeUndefined();
    expect(questions[0].amountLater).toBe(1000);
    expect(questions[0].timeLater).toBe(5);
    expect(questions[0].dateLater).toBeUndefined();
    expect(questions[0].maxAmount).toBeUndefined();
    expect(questions[0].maxTime).toBe(10);
    expect(questions[0].horizontalPixels).toBeUndefined();
    expect(questions[0].verticalPixels).toBeUndefined();
    expect(questions[0].leftMarginWidthIn).toBeUndefined();
    expect(questions[0].bottomMarginHeightIn).toBeUndefined();
    expect(questions[0].graphWidthIn).toBeUndefined();
    expect(questions[0].graphHeightIn).toBeUndefined();
    expect(questions[0].widthIn).toBe(4);
    expect(questions[0].heightIn).toBe(4);

    expect(questions[0].showMinorTicks).toBe(false);
    expect(questions[0].comment).toBe(
      "Worded with no interaction and Read 2001 example values."
    );
    expect(instructions.length).toBe(1);
    expect(instructions[0].amountEarlier).toBe(300);
    expect(instructions[0].timeEarlier).toBe(2);
    expect(instructions[0].amountLater).toBe(700);
    expect(instructions[0].timeLater).toBe(7);

    ({ questions, instructions } = await loadTreatmentConfiguration([3]));
    expect(questions.length).toBe(5);
    expect(questions[0].treatmentId).toBe(3);
    expect(questions[0].position).toBe(1);
    expect(questions[0].viewType).toBe(ViewType.barchart);
    expect(questions[0].interaction).toBe(InteractionType.none);
    expect(questions[0].variableAmount).toBe(AmountType.none);
    expect(questions[0].amountEarlier).toBe(300);
    expect(questions[0].timeEarlier).toBe(2);
    expect(questions[0].dateEarlier).toBeUndefined();
    expect(questions[0].amountLater).toBe(700);
    expect(questions[0].timeLater).toBe(5);
    expect(questions[0].dateLater).toBeUndefined();
    expect(questions[0].maxAmount).toBe(1100);
    expect(questions[0].maxTime).toBe(10);
    expect(questions[0].horizontalPixels).toBe(800);
    expect(questions[0].verticalPixels).toBe(300);
    expect(questions[0].leftMarginWidthIn).toBeUndefined();
    expect(questions[0].bottomMarginHeightIn).toBeUndefined();
    expect(questions[0].graphWidthIn).toBeUndefined();
    expect(questions[0].graphHeightIn).toBeUndefined();
    expect(questions[0].widthIn).toBeUndefined();
    expect(questions[0].heightIn).toBeUndefined();
    expect(questions[0].comment).toBe(
      "Barchart MEL question with no interaction pixels."
    );
    expect(instructions.length).toBe(1);
    expect(instructions[0].amountEarlier).toBe(300);
    expect(instructions[0].timeEarlier).toBe(2);
    expect(instructions[0].amountLater).toBe(700);
    expect(instructions[0].timeLater).toBe(7);
  });

  test("Validate loadAllTreatmentsConfiguration loads all treatments correctly.", async () => {
    var questions = await loadAllTreatmentsConfiguration();
    expect(questions.length).toBe(90);
  });

  test("Validate loadTreatmentConfiguration loads CSV fields correctly three treatment with random values", async () => {
    const treatmentIds = [25, 24, 23];
    var { questions, instructions } = await loadTreatmentConfiguration(
      treatmentIds
    );
    expect(questions.length).toBe(24);
    expect(instructions.length).toBe(3);
    for (let i = 1; i < questions.length; i++) {
      expect(
        treatmentIds.indexOf(questions[i - 1].treatmentId) <=
          treatmentIds.indexOf(questions[i].treatmentId)
      ).toBe(true);
      if (questions[i - 1].treatmentId == questions[i].treatmentId) {
        expect(questions[i - 1].position <= questions[i].position).toBe(true);
      } else {
        expect(questions[i - 1].position).toBe(8);
        expect(questions[i].position).toBe(1);
      }
    }
  });
});
