import { v1 as uuid_v1 } from 'uuid';
import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDB = new DynamoDB.DocumentClient()

export async function main(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<never>> {
    let data;

    if(event?.body) data = JSON.parse(event.body);
    else return {
        statusCode: 400,
    }

    const params: DocumentClient.PutItemInput = {
        TableName: process.env.TABLE_NAME!,
        Item: {
            userId: "123",
            noteId: uuid_v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    }

    try {
        await dynamoDB.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(params.Item)
        }
    } catch (e: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message})
        }
    }
}