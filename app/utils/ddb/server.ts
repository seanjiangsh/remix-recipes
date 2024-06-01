import dynamoose from "dynamoose";

const ARC_APP_NAME = process.env.ARC_APP_NAME || "remix-recipes";
const AWS_REGION = process.env.AWS_REGION || "ap-northeast-1";
const ARC_ENV = process.env.ARC_ENV || "testing";
const ddb = new dynamoose.aws.ddb.DynamoDB({ region: AWS_REGION });
dynamoose.aws.ddb.set(ddb);
const db = dynamoose;

export default db;
export const tablePrefix = `${ARC_APP_NAME}-${ARC_ENV}`;
