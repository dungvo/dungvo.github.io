import { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { createFoodServer } from './server/api.mjs';
import { dynamoBackend } from './server/dynamo.mjs';
import { lambdaHttp } from './server/lambda-http.mjs';

const client = new DynamoDBClient({});
const commands = { GetItem: GetItemCommand, PutItem: PutItemCommand, UpdateItem: UpdateItemCommand };
const env = process.env;
const server = createFoodServer({
  token: env.FOOD_TOKEN,
  provider: 'groq',
  pollIntervalMs: 6000,
  aiKey: env.GROQ_API_KEY,
  allowTranscription: env.FOOD_TRANSCRIBE === '1',
  allowedOrigins: (env.FOOD_ORIGINS ?? '').split(',').filter(Boolean),
  backend: options => dynamoBackend((operation, input) => client.send(new commands[operation](input)), env.FOOD_TABLE, options),
});
export const handler = lambdaHttp(server.listeners('request')[0]);
