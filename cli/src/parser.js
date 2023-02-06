import { csvParse } from "d3";

export const parseCSV = (CSVData) => {
  return csvParse(CSVData);
};

export const parseJSON = (JSONString) => {
  console.log(`...parsing data ${JSONString}`);
  return JSON.parse(JSONString);
};
