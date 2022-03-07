import { APIGatewayProxyEventV2, Context } from "aws-lambda";

export default function handler(lambda: any) {
  return async function (event: APIGatewayProxyEventV2, context: Context) {
    let body: {}, statusCode: number;

    try {
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e: any) {
      console.error(e.message);
      body = { error: e.message };
      statusCode = 500;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
    };
  };
}
