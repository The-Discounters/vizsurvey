// TODO This really needs to be merged with FileIOAdapter.js in vizsurvey code base.
import AWS from "aws-sdk";

import {
  getS3BucketName,
  getS3Region,
  getAmazonAccessKey,
  getSecretAccessKey,
} from "./configuration.js";

var myBucket = null;
var bucketName;
export const init = (conf) => {
  AWS.config.update({
    accessKeyId: getAmazonAccessKey(),
    secretAccessKey: getSecretAccessKey(),
  });

  myBucket = new AWS.S3({
    params: { Bucket: getS3BucketName() },
    region: getS3Region(),
  });

  bucketName = getS3BucketName();
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
