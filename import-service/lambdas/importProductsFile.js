import { S3 } from 'aws-sdk';

export async function handler(event) {
    try {
        const s3 = new S3();
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
            body: JSON.stringify({ signedUrl }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}
