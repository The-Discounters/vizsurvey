import fs from "fs";
import { parseCSV, parseJSON } from "./parserUtil.js";

describe("parseCSV test.", () => {
  test("parseCSV test.", async () => {
    const CSV = fs.readFileSync(
      "/Users/pete/vizsurvey/packages/util/src/test.csv",
      "utf8"
    );
    const result = parseCSV(CSV);
    const strResult = JSON.stringify(result);
    const expctedResult = '[{"column1":"colValue1","column2":"colValue2"}]';
    expect(strResult).toBe(expctedResult);
  });

  test("parseJSON array input.", async () => {
    const result = parseJSON(
      "[[1, 2, 3], [1, 3, 2], [3, 1, 2], [3, 2, 1], [2, 3, 1], [2, 1, 3]]"
    );
    expect(result.length).toBe(6);
    expect(result[0].length).toBe(3);
  });
});
