import { stateToDate } from "@the-discounters/util";

describe("questionSlice tests", () => {
  test("Check how to use Luxon diff to calcualte elapsed time in seconds.", () => {
    const elapsedTimeInSec = stateToDate("2023-01-27T00:00:00.000-05:00").diff(
      stateToDate("2023-01-26T00:00:00.000-05:00"),
      ["seconds"]
    );
    expect(elapsedTimeInSec.seconds).toBe(60 * 60 * 24);
  });

  test("Spread operator behavior on objects with the same property names", () => {
    const obj1 = { prop1: "value1", prop2: "value2", unique: "valueunique" };
    const obj2 = {
      prop1: "value1",
      prop2: "value2",
      uniqueSecond: "valueuniquesecond",
    };
    const obj3 = { ...obj1, ...obj2 };
    expect(obj3).toStrictEqual({
      prop1: "value1",
      prop2: "value2",
      unique: "valueunique",
      uniqueSecond: "valueuniquesecond",
    });
    const obj4 = {
      prop1: "value1",
      prop2: "value2x",
      uniqueSecond: "valueuniquesecond",
    };
    const obj5 = { ...obj1, ...obj4 };
    expect(obj5).toStrictEqual({
      prop1: "value1",
      prop2: "value2",
      prop2: "value2x",
      unique: "valueunique",
      uniqueSecond: "valueuniquesecond",
    });
  });
});
