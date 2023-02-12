import { MergedData } from "./MergedData";

describe("MergedData tests", () => {
  test("Test addEntry.", () => {
    const md = new MergedData();
    md.addEntry({ participantId: "1", property1: "value1" });
    expect(md.getEntry(1)).toBe(60 * 60 * 24);
  });
});
