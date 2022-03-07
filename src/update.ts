import handler from "./util/handler";
import dynamoDB from "./util/dynamodb";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { DynamoReturnValues } from "aws-cdk-lib/aws-stepfunctions-tasks";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  let data;

  if (event?.body) data = JSON.parse(event.body);
  else throw new Error("No body provided");

  const params: any = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      userId: "123",
      noteId: event!.pathParameters!.id,
    },
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null,
    },
    ReturnValues: DynamoReturnValues.ALL_NEW,
  };

  await dynamoDB.update(params);

  return { status: true };
});
