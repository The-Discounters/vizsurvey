import { DateTime } from "luxon";

export function dateToState(date) {
  if (date) {
    return date.toISO();
  }
  return null;
}

export function stateToDate(date) {
  if (date) {
    return DateTime.fromISO(date);
  }
  return null;
}

export function stringToDate(date) {
  // Luxon will use the sytem default timezone.
  // We want the date to show the same regadrless of the users timezone.
  const result = DateTime.fromFormat(date, "M/d/yyyy");
  return result;
}

export const secondsBetween = (before, after) => {
  return after && before
    ? stateToDate(after).diff(stateToDate(before), ["seconds"]).seconds
    : "";
};

export const ISODateStringWithNanoSec = (date, nanosec) => {
  const dateStr = DateTime.fromJSDate(date).toISO(); // produces '2017-04-22T20:47:05.335-04:00'
  // and we want format yyyy-mm-dd hh:mm:ss.fffffffff, where ffffffffff indicates nanoseconds.
  const regex = /\.[\d]+/;
  const result = dateStr.replace(regex, `.${nanosec}`);
  return result;
};

export const dateFromISOStringWithNanoSec = (ISOdateStr) => {
  // format 2017-04-22T20:47:05.3350000000-04:00
  const regex = /\.(?<nanosec>[\d]+)/;
  const matches = ISOdateStr.match(regex);
  return {
    date: DateTime.fromISO(ISOdateStr),
    nanosec: matches ? parseInt(matches.groups.nanosec) : null,
  };
};
