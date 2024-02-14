import fs from "fs";
import { DateTime } from "luxon";
import { parseCSV, parseJSON, convertToCSV } from "./parserUtil.js";

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

  test("Validate answer CSV fields are written correctly.", async () => {
    const answers = [
      { key1: "key1Value1", key2: "key2Value1" },
      { key1: "key1Value2", key2: "key2Value2" },
    ];
    const result = convertToCSV(answers);
    console.log(result);
    expect(result).toBe(
      "key1,key2\nkey1Value1,key2Value1\r\nkey1Value2,key2Value2\r\n"
    );
  });
});
