import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  const params: any = {
    TableName: process.env.TABLE_NAME!,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": "123",
    },
  };

  const result = await dynamoDb.query(params);
  if (!result.Items) throw new Error("Item not found.");

  return result.Items;
});
