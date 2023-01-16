import AWS from "aws-sdk";

var myBucket = null;

export const init = (conf) => {
  AWS.config.update({
    accessKeyId: conf.get(AMAZON_ACCESS_KEY_ID),
    secretAccessKey: conf.get(AMAZON_SECRET_ACCESS_KEY),
  });

  const myBucket = new AWS.S3({
    params: { Bucket: conf.get(AMAZON_S3_BUCKET_KEY) },
    region: conf.get(AMAZON_REGION__KEY),
  });
};

export const downloadAllFiles = () => {
  const params = {
    ACL: "public-read",
    Body: data,
    Bucket: S3_BUCKET,
    Key: name,
  };

  myBucket
    .putObject(params)
    .on("httpUploadProgress", (evt) => {
      console.log(Math.round((evt.loaded / evt.total) * 100));
    })
    .send((err) => {
      if (err) console.log(err);
    });
};
