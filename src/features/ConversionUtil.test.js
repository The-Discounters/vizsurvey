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
    // we will get the timestamps in local timezone
    const nowLocal = DateTime.now();
    // but we want to report them in utc format
    const strLocal = nowLocal.toString();
    expect(strLocal.slice(-6)).toBe("-05:00");
  });

  // we need to be able to convert from a date object to a primitive while
  // preserving the timezone since we want to know what timezone the user was
  // in and have to store state in redux as primitives.
  test("CTest dateToState and stateToDate.", async () => {
    const stringValue = "1974-11-08T00:00:00.000-05:00";
    const dateValue = DateTime.fromISO(stringValue);
    expect(dateToState(dateValue)).toBe("1974-11-08T00:00:00.000-05:00");
    expect(stateToDate("1974-11-08T00:00:00.000-05:00")).toStrictEqual(
      dateValue
    );
  });

  // we want to render the date from the treatment configuration the same
  // regardless of the timezone that the user is in since we want all
  // users to see the same date value on the screen.  Not really sure
  // what I was trying to test in this test, but I do see that the
  // users default timezone will be set in the string that is created
  // from an input date with no timezone specified when .toISO is called.
  test("Test stringToDate.", async () => {
    const dateStr = "11/8/1974";
    const date = stringToDate(dateStr);
    expect(date.toISO()).toBe("1974-11-08T00:00:00.000-05:00");
  });
});
