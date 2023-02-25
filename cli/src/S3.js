import AWS from "aws-sdk";
import fs from "fs";
import { DateTime } from "luxon";

import {
  AMAZON_ACCESS_KEY_ID,
  AMAZON_SECRET_ACCESS_KEY,
  AMAZON_REGION__KEY,
  AMAZON_S3_BUCKET_KEY,
} from "../index.js";

var myBucket = null;
var bucketName;
var myBucket;
export const init = (conf) => {
  AWS.config.update({
    accessKeyId: conf.get(AMAZON_ACCESS_KEY_ID),
    secretAccessKey: conf.get(AMAZON_SECRET_ACCESS_KEY),
  });

  myBucket = new AWS.S3({
    params: { Bucket: conf.get(AMAZON_S3_BUCKET_KEY) },
    region: conf.get(AMAZON_REGION__KEY),
  });

  bucketName = conf.get(AMAZON_S3_BUCKET_KEY);
};

export const ProgressType = {
  downloading: "downloading",
  downloaded: "downloaded",
  skip: "skip",
  error: "error",
};

Object.freeze(ProgressType);

const downloadFile = (file, progressCallback) => {
  myBucket.getObject(
    {
      Bucket: bucketName,
      Key: file.Key,
    },
    (errGet, dataGet) => {
      if (errGet) {
        console.log("Error", errGet);
      } else {
        progressCallback(ProgressType.downloaded, {
          file: file,
          data: dataGet.Body.toString(),
        });
      }
    }
  );
};

export const downloadFiles = (laterThanDate, progressCallback) => {
  myBucket.listObjectsV2({ Bucket: `${bucketName}` }, (errList, dataList) => {
    if (errList) {
      progressCallback(ProgressType.error, errList);
    } else {
      for (const file of dataList.Contents) {
        const objectDate = DateTime.fromJSDate(file.LastModified);
        if (laterThanDate && objectDate < laterThanDate) {
          progressCallback(ProgressType.skip, file);
        } else {
          progressCallback(ProgressType.downloading, file);
          downloadFile(file, progressCallback);
        }
      }
    }
  });
};
