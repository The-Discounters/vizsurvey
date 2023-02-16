import fs from "fs";
import path from "path";

export const isJSONExt = (filename) => {
  return path.extname(filename).toLowerCase() === ".json";
};

export const isCSVExt = (filename) => {
  return path.extname(filename).toLowerCase() === ".csv";
};

export const appendSepToPath = (dir) => {
  return `${dir}${path.sep}`;
};

export const fullPath = (root, filename) => {
  return `${root}${path.sep}${filename}`;
};

export function getCurrentDirectoryBase() {
  return path.basename(process.cwd());
}

export function directoryExists(filePath) {
  return fs.existsSync(filePath);
}

export const loadFile = (filename) => {
  console.log(`...reading file ${filename}`);
  return fs.readFileSync(filename, "utf8");
};

export const writeFile = (filename, stringData) => {
  if (stringData) {
    console.log(`...writing file: ${filename}`);
    fs.writeFileSync(filename, stringData);
    console.log(`...file written.`);
  } else {
    console.log(`...no date to write`);
  }
};
