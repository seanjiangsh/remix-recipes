import dynamoose from "dynamoose";

const { ARC_ENV, ARC_APP_NAME } = process.env;
const db = dynamoose;
export default db;
export const tablePrefix = `${ARC_APP_NAME}-${ARC_ENV}`;
