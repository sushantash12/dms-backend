const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const dynamoDBClient  = new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIA6KYON4BHWF7WPUG3',
        secretAccessKey: '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'
    }
});

module.exports = dynamoDBClient;