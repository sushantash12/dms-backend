const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'AKIA6KYON4BHWF7WPUG3',
        secretAccessKey: '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'
    }
});

module.exports = s3Client;