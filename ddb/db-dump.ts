import { DynamoDB } from "@aws-sdk/client-dynamodb";

const config = { endpoint: "http://localhost:5555", region: "ap-northeast-1" };
const db = new DynamoDB(config);

db.listTables({}, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // console.log(data);
  // * show all items in the table
  data?.TableNames?.forEach((TableName) => {
    db.scan({ TableName }, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const { Items } = data || {};
      if (!Items?.length) return;
      console.log(`Table: ${TableName}`);
      console.table(Items);
    });
  });
});
