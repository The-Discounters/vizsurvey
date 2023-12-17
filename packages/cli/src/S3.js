// TODO This really needs to be merged with FileIOAdapter.js in vizsurvey code base.
import AWS from "aws-sdk";

import {
  AMAZON_ACCESS_KEY_ID,
  AMAZON_SECRET_ACCESS_KEY,
  AMAZON_REGION__KEY,
  AMAZON_S3_BUCKET_KEY,
} from "./index.js";

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

export const downloadFile = async (file) => {
  //if (process.env.AWS_ENABLED?.toLowerCase?.() === "true") {
  const dataGet = await myBucket
    .getObject({
      Bucket: bucketName,
      Key: file.Key,
    })
    .promise();
  return dataGet.Body.toString();
  //} else {
  //}
};

export const listFiles = async () => {
  const fileList = await myBucket
    .listObjectsV2({ Bucket: `${bucketName}` })
    .promise();
  return fileList;
};
