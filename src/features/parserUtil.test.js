import fs from "fs";
import { parseCSV } from "./parserUtil.js";

describe("parserUtil test.", () => {
  test("parseCSV test.", async () => {
    const CSV = fs.readFileSync(
      "/Users/pete/vizsurvey/src/features/test.csv",
      "utf8"
    );
    const result = parseCSV(CSV);
    const strResult = JSON.stringify(result);
    const expctedResult = '[{"column1":"colValue1","column2":"colValue2"}]';
    expect(strResult).toBe(expctedResult);
  });
});
