import { DateTime } from "luxon";

export function dateToState(date) {
  return date.toISO();
}

export function stateToDate(date) {
  return DateTime.fromISO(date);
}

export function stringToDate(date) {
  // Luxon will use the sytem default timezone.
  // We want the date to show the same regadrless of the users timezone.
  const result = DateTime.fromFormat(date, "M/d/yyyy");
  return result;
}
