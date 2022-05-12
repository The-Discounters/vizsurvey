import { dateToState, stateToDate, stringToDate } from "./ConversionUtil";
import { DateTime } from "luxon";

describe("ConversionUtil test.", () => {
  test("luxon library test.", async () => {
    const datetime = DateTime.fromFormat("11/8/1974", "M/d/yyyy");
    expect(datetime.year).toBe(1974);
    expect(datetime.month).toBe(11);
    expect(datetime.day).toBe(8);
    const strValue = datetime.toLocaleString();
    expect(strValue).toBe("11/8/1974");
  });

  test("Conversion utility test.", async () => {
    const conversionValue = stringToDate("11/8/1974");
    const datetimeValue = DateTime.utc(1974, 11, 8, {
      locale: "en-US",
      zone: "utc",
    });
    expect(conversionValue).toStrictEqual(datetimeValue);
    expect(dateToState(conversionValue)).toBe(153100800000);
    expect(stateToDate(153100800000)).toStrictEqual(conversionValue);
  });
});
