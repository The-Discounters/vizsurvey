import { csvParse } from "d3";
import csv from "to-csv";
import * as csvtojson from "csvtojson";

// TODO combine this file with the content of the IOAdapater class once I change that to be functions and not a class.

export const parseCSV = (CSVData) => {
  return csvParse(CSVData);
};

export const parseCSVFile = async (path) => {
  return await csvtojson.csv().fromFile(path);
};

export const parseJSON = (JSONString) => {
  //console.log(`...parsing data ${JSONString}`);
  return JSON.parse(JSONString);
};

export const convertToCSV = (data) => {
  return csv(data);
};
