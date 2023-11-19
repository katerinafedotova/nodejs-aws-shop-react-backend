'use strict';

const { productList } = require("./dummy-data/productList");

module.exports.getProductById = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = productList.find((product) => product.id === productId);
    if (product) {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found' }),
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
