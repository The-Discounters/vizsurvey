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

export const downloadFiles = (dir, laterThanDate) => {
  myBucket.listObjectsV2({ Bucket: `${bucketName}` }, (errList, dataList) => {
    if (errList) {
      console.log("Error", errList);
    } else {
      for (const file of dataList.Contents) {
        console.log(
          `...downloading file ${file.Key} of size ${file.Size} created on date ${file.LastModified}`
        );
        const objectDate = DateTime.fromJSDate(file.LastModified);
        if (objectDate < laterThanDate) {
          console.log(
            `...skipping ${file.Key} since the date is before ${laterThanDate}`
          );
        } else {
          const fullObject = myBucket.getObject(
            {
              Bucket: bucketName,
              Key: file.Key,
            },
            (errGet, dataGet) => {
              if (errGet) {
                console.log("Error", errGet);
              } else {
                const JSONData = dataGet.Body.toString();
                fs.writeFile(dir + file.Key, JSONData, function (err) {
                  if (err) {
                    console.log(`error writing file ${file.Key}`, err);
                    throw err;
                  }
                });
                console.log(`...file ${file.Key} downloaded.`);
              }
            }
          );
        }
      }
    }
  });
};
