// TODO TOTAL HACK.  I HAD TO COPY THIS FILE FROM VIZSURVEY SOURCE BEACUSE WHEN I ADD type: "module" TO PACKAGE.JSON
// I GET PROBLEMS WITH REACT 17.  CLI NEEDS TO BE MOVED TO ITS OWN PROJECT AND THEN SHARED CODE IMPORTED.
import _ from "lodash";
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
