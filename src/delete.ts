import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  const params: any = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: "123",
      noteId: event.pathParameters!.id!,
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
});
