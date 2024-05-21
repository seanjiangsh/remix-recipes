import dynamoose from "dynamoose";

const ARC_APP_NAME = process.env.ARC_APP_NAME || "remix-recipes";
const ARC_ENV = process.env.ARC_ENV || "testing";
const db = dynamoose;

export default db;
export const tablePrefix = `${ARC_APP_NAME}-${ARC_ENV}`;
