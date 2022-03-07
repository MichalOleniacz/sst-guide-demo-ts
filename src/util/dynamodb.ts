import { DynamoDB } from "aws-sdk";
import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";

const client = new DynamoDB.DocumentClient()

export default {
    get:    (params: GetItemInput)     => client.get(params).promise(),
    put:    (params: PutItemInput)     => client.put(params).promise(),
    query:  (params: QueryInput)       => client.query(params).promise(),
    update: (params: UpdateItemInput)  => client.update(params).promise(),
    delete: (params: DeleteItemInput)  => client.delete(params).promise()
}