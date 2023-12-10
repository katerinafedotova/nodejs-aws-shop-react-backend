const createProduct = require('./createProduct')

exports.handler = async (event) => {
    try {
        console.log("sqs event", event);
        const records = get(event, 'Records', [])

        for (const record of records) {
            const createdProduct = await createProduct(JSON.parse(record.body))

            console.log(createdProduct)
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