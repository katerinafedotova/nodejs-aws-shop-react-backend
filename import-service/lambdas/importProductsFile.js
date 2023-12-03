const AWS = require('aws-sdk');

exports.handler = async function (event) {
    try {
        const s3 = new AWS.S3();
        const bucketName = process.env.BUCKET_NAME || '';
        const fileName = event.queryStringParameters?.name || '';
        
        // Generate a signed URL
        const signedUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: bucketName,
            Key: `uploaded/${fileName}`,
            Expires: 60, // URL expires in 60 seconds
        });

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                'Access-Control-Allow-Methods': 'GET',
            },
            body: JSON.stringify(signedUrl),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                'Access-Control-Allow-Methods': 'GET',
            },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}
