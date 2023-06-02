import Configstore from "configstore";
import askS3BucketInfo from "./inquier.js";

export const AMAZON_S3_BUCKET_KEY = "amazonS3Bucket";
export const AMAZON_REGION_KEY = "amazonRegion";
export const AMAZON_ACCESS_KEY_ID = "amazonAccessKeyId";
export const AMAZON_SECRET_ACCESS_KEY = "amazonSecretAccessKey";

const conf = new Configstore("discounters");

export const loadConfig = async () => {
  if (!conf.has(AMAZON_S3_BUCKET_KEY)) {
    const settings = await askS3BucketInfo();
    conf.set(settings);
  }
};

export const getConfigValue = (key) => {
  return conf.get(key);
};

export const getS3BucketName = () => {
  return getConfigValue(AMAZON_S3_BUCKET_KEY);
};

export const getS3Region = () => {
  return getConfigValue(AMAZON_REGION_KEY);
};

export const getAmazonAccessKey = () => {
  return getConfigValue(AMAZON_ACCESS_KEY_ID);
};

export const getSecretAccessKey = () => {
  return getConfigValue(AMAZON_SECRET_ACCESS_KEY);
};
