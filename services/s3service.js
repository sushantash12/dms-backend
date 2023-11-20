const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'xxxxxx',
        secretAccessKey: 'xxxxxx'
    }
});

module.exports = s3Client;
