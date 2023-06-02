import fs from "fs";
import { parseCSV, parseCSVFile } from "./parserUtil.js";

describe("parserUtil test.", () => {
  test("parseCSVFile test.", async () => {
    const result = await parseCSVFile(
      "/Users/pete/vizsurvey/src/features/test.csv"
    );
    const expctedResult = '[{"column1":"colValue1","column2":"colValue2"}]';
    const strResult = JSON.stringify(result);
    expect(strResult).toBe(expctedResult);
  });

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
