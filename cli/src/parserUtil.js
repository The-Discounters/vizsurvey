// TODO TOTAL HACK.  I HAD TO COPY THIS FILE FROM VIZSURVEY SOURCE BEACUSE WHEN I ADD type: "module" TO PACKAGE.JSON
// I GET PROBLEMS WITH REACT 17.  CLI NEEDS TO BE MOVED TO ITS OWN PROJECT AND THEN SHARED CODE IMPORTED.
import { csvParse } from "d3";
import csv from "to-csv";

export const parseCSV = (CSVData) => {
  return csvParse(CSVData);
};

export const parseJSON = (JSONString) => {
  //console.log(`...parsing data ${JSONString}`);
  return JSON.parse(JSONString);
};

export const convertToCSV = (data) => {
  return csv(data);
};
