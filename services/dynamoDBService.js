const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const dynamoDBClient  = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'xxxxxx',
        secretAccessKey: 'xxxxxx'
    }
});

module.exports = dynamoDBClient;
