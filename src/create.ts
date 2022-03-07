import { v1 as uuid_v1 } from "uuid";
import handler from "./util/handler";
import dynamoDB from "./util/dynamodb";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { PutItemInput } from "aws-sdk/clients/dynamodb";

export const main = handler(
  async (
    event: APIGatewayProxyEventV2
  ): Promise<APIGatewayProxyResultV2<never>> => {
    let data;

    if (event?.body) data = JSON.parse(event.body);
    else throw new Error("No body provided");

    const params: PutItemInput = {
      TableName: process.env.TABLE_NAME!,
      Item: {
        userId: { S: "123" },
        noteId: { S: uuid_v1() },
        content: { S: data.content },
        attachment: { S: data.attachment },
        createdAt: { N: Date.now().toString() },
      },
    };

    await dynamoDB.put(params);

    return params.Item;
  }
);
