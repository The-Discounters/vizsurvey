import { DateTime } from "luxon";

export function dateToState(date) {
  return date.toMillis();
}

export function stateToDate(datems) {
  return DateTime.fromMillis(datems, {
    locale: "en-US",
    zone: "utc",
  });
}

export function stringToDate(date) {
  const result = DateTime.fromFormat(date, "M/d/yyyy", {
    locale: "en-US",
    zone: "utc",
  });
  return result;
}
