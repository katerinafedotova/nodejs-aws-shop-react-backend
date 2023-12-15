const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async function (event) {
    const bucketName = process.env.BUCKET_NAME;

    if (!bucketName) {
        throw new Error('Bucket name is not configured.');
    }

    try {
        const fileName = event.queryStringParameters?.name || '';

        // Generate a signed URL
        const signedUrl = await getSignedUrl(s3, bucketName, fileName);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, PUT",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(signedUrl),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, PUT",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}

async function getSignedUrl(s3, bucketName, fileName) {
    // Generate a signed URL
    const signedUrl = await s3.getSignedUrlPromise('putObject', {
        Bucket: bucketName,
        Key: `uploaded/${fileName}`,
        Expires: 60, // URL expires in 60 seconds
    });

    return signedUrl;
}
