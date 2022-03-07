import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";
import { GetItemInput } from "aws-sdk/clients/dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  let noteId;
  if (event?.pathParameters?.id) noteId = event.pathParameters.id;

  const params: any = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: "123",
      noteId: noteId,
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) throw new Error("Item not found.");

  return result.Item;
});
