const createProduct = require('./createProduct')
const sns = new AWS.SNS();

exports.handler = async (event) => {
    try {
        console.log("sqs event", event);
        const records = event && event.Records ? event.Records : [];

        for (const record of records) {
            const createdProduct = await createProduct(JSON.parse(record.body))

            console.log(createdProduct)

            // After creating products, publish a message to the SNS topic
            await sns.publish({
                TopicArn: process.env.SNS_TOPIC_ARN,
                Message: 'Products created successfully.',
            }).promise();

        }
        return {
            statusCode: 200,
            body: JSON.stringify(records),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }
        };
    } catch (error) {
        console.error("Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }
        };
    }

}