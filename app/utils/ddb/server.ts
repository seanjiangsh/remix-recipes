import dynamoose from "dynamoose";

const ARC_APP_NAME = process.env.ARC_APP_NAME || "remix-recipes";
const ARC_ENV = process.env.ARC_ENV || "testing";
const ddb = new dynamoose.aws.ddb.DynamoDB({ region: "ap-northeast-1" });
dynamoose.aws.ddb.set(ddb);
const db = dynamoose;

export default db;
export const tablePrefix = `${ARC_APP_NAME}-${ARC_ENV}`;
