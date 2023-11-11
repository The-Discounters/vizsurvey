To run type the following from the cli folder.

### `node index.js <command> <options>`

To see help on a particular command type

### `node index.js <command> -h`

Useful Amazon SDK reference documentation links
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property - Note we are currently using v2 of the amazon SDK (not v3)

### .env file settings

Create a .env file in the root of the project with the following values.

ENV=development
AWS_ENABLED=false
TEST_DATA_DIR=./S3-downloaded/
