import dynamoose from "dynamoose";

const { ARC_ENV, ARC_APP_NAME } = process.env;
const isDev = ARC_ENV === "testing";
if (isDev) {
  // console.log("Using local DynamoDB for development");
  dynamoose.aws.ddb.local("http://localhost:5555");
}

const db = dynamoose;
export default db;

export const tablePrefix = `${ARC_APP_NAME}-${ARC_ENV}`;
