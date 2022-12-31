import inquirer from "inquirer";

export const AMAZON_S3_BUCKET_KEY = "amazonS3Bucket";
export const AMAZON_REGION__KEY = "amazonRegion";
export const AMAZON_ACCESS_KEY_ID = "amazonAccessKeyId";
export const AMAZON_SECRET_ACCESS_KEY = "amazonSecretAccessKey";

export function askS3BucketInfo() {
  const questions = [
    {
      name: AMAZON_S3_BUCKET_KEY,
      type: "input",
      message: "Enter the Amazon S3 bucket name:",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter the Amazon S3 bucket name.";
        }
      },
    },
    {
      name: AMAZON_REGION__KEY,
      type: "input",
      message: "Enter the Amazon region the bucket is in.",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter the Amazon region the bucket is in.";
        }
      },
    },
    {
      name: AMAZON_ACCESS_KEY_ID,
      type: "input",
      message: "Enter the Amazon Access Key Id.",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter the Amazon Access Key Id.";
        }
      },
    },
    {
      name: AMAZON_SECRET_ACCESS_KEY,
      type: "input",
      message: "Enter the Amazon Secret Access Key.",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter he Amazon Secret Access Key.";
        }
      },
    },
  ];
  return inquirer.prompt(questions);
}
