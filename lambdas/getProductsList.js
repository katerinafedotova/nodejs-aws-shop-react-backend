"use strict";

// asset-input/lambdas/getProductsList.js
const AWS = require("aws-sdk");
const productsTable = "AWS_Products";
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const params = {
      TableName: productsTable
    };
    const productsResult = await dynamoDB.scan(params).promise();
    const products = productsResult.Items;
    
    // Perform DynamoDB query to get stocks
    const stocksParams = {
      TableName: 'AWS_stocks',
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
    
    return {
      statusCode: 200,
      body: JSON.stringify(productsList),
      headers: {
        "Access-Control-Allow-Origin": "*",
        // or specify your origin
        "Access-Control-Allow-Credentials": true
      }
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        // or specify your origin
        "Access-Control-Allow-Credentials": true
      }
    };
  }
};
