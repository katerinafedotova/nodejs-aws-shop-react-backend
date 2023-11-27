const AWS = require('aws-sdk');

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || '';
const STOCKS_TABLE = process.env.STOCKS_TABLE || '';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        const { title, price, description, count } = requestBody;
        if (!title || !price || !description) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields" })
            };
        }
        const id = Date.now().toString();
        const productItem = {
            id,
            title,
            description,
            price
        };
        const stockItem = {
            product_id: id,
            count: count || 0
        };

        const productCreated = {
            ...productItem, count: stockItem.count
        }

        await dynamoDB.put({
            TableName: PRODUCTS_TABLE,
            Item: productItem
        }).promise();
        await dynamoDB.put({
            TableName: STOCKS_TABLE,
            Item: stockItem
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Product created successfully", product: productCreated })
        };
    } catch (error) {
        console.error("Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }
};
