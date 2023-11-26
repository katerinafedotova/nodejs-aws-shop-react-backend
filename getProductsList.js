"use strict";

const { productList } = require("./dummy-data/productList");

module.exports.getProductsList = async (event) => {
  try {
    // Simulate an error for demonstration purposes
    // Uncomment the line below to simulate an error
    // throw new Error("Simulated error");

    return {
      statusCode: 200,
      body: JSON.stringify(productList),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
