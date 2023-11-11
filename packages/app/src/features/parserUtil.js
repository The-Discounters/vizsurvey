import { csvParse } from "d3";
import csv from "to-csv";

// TODO combine this file with the content of the IOAdapater class once I change that to be functions and not a class.

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
