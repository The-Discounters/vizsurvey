//const fs = require("fs");
import fs from "fs";
//const path = require("path");
import path from "path";

export function getCurrentDirectoryBase() {
  return path.basename(process.cwd());
}

export function directoryExists(filePath) {
  return fs.existsSync(filePath);
}
