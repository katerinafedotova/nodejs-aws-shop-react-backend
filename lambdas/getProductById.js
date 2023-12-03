'use strict';

const AWS = require("aws-sdk");

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || '';
const STOCKS_TABLE = process.env.STOCKS_TABLE || '';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    // Access the path property from the API Gateway event
    const path = event.path;

    // Extract the productId from the path
    const productId = extractProductId(path);

    const params = {
      TableName: PRODUCTS_TABLE
    };
    const productsResult = await dynamoDB.scan(params).promise();
    const products = productsResult.Items;

    // Perform DynamoDB query to get stocks
    const stocksParams = {
      TableName: STOCKS_TABLE,
    };

    const stocksResult = await dynamoDB.scan(stocksParams).promise();
    const stocks = stocksResult.Items;

    // Join the products and stocks based on the common attribute 'id'
    const productsList = products.map((product) => {
      const stockEntry = stocks.find((stock) => stock.product_id === product.id);

      // Combine product information with stock information
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        count: stockEntry ? stockEntry.count : 0, // Assuming count is in the stocks table
      };
    });

    const product = productsList.find((product) => product.id === productId);

    if (product) {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
        headers: {
          'Access-Control-Allow-Origin': '*',  // or specify your origin
          'Access-Control-Allow-Credentials': true,
        },
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found' }),
        headers: {
          'Access-Control-Allow-Origin': '*',  // or specify your origin
          'Access-Control-Allow-Credentials': true,
        },
      };
    }
  } catch (error) {
    // Handle errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// Function to extract productId from the path
function extractProductId(path) {
  const parts = path.split('/');

  // Assuming the path is in the format "/products/{productId}"
  if (parts.length === 3 && parts[1] === 'products') {
    return parts[2];
  } else {
    throw new Error('ProductId not found in path');
  }
}
