'use strict';

const { productList } = require("../data/productList");

module.exports.getProductById = async (productId) => {
  try {
    const product = productList.find((product) => product.id === productId);
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
