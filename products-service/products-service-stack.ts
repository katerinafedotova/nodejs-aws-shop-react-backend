import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class ProductsServiceStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const productsTable = Table.fromTableName(
      this,
      "AWS_Products",
      "AWS_Products"
    );
    const stocksTable = Table.fromTableName(this, "AWS_stocks", "AWS_stocks");

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, "/", "package-lock.json"),
      environment: {
        PRIMARY_KEY: "itemId",
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      },
      runtime: lambda.Runtime.NODEJS_16_X,
    };

    const getAllLambda = new NodejsFunction(this, "getProductsList", {
      entry: join(__dirname, "lambdas", "getProductsList.js"),
      ...nodeJsFunctionProps,
    });
    const getOneLambda = new NodejsFunction(this, "getProductById", {
      entry: join(__dirname, "lambdas", "getProductById.js"),
      ...nodeJsFunctionProps,
    });
    const createLambda = new NodejsFunction(this, "createProduct", {
      entry: join(__dirname, "lambdas", "createProduct.js"),
      ...nodeJsFunctionProps,
    });

    productsTable.grantReadWriteData(getAllLambda);
    stocksTable.grantReadWriteData(getAllLambda);
    productsTable.grantReadWriteData(getOneLambda);
    stocksTable.grantReadWriteData(getOneLambda);
    productsTable.grantReadWriteData(createLambda);
    stocksTable.grantReadWriteData(createLambda);

    const getProductsIntegration = new apigateway.LambdaIntegration(
      getAllLambda
    );

    const getProductByIdIntegration = new apigateway.LambdaIntegration(
      getOneLambda
    );

    const createProductIntegration = new apigateway.LambdaIntegration(
      createLambda
    );

    const api = new apigateway.RestApi(this, "products-api", {
      restApiName: "Products Service",
      description: "This service serves products.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // You can specify specific origins if needed
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["*"], // You can specify specific headers if needed
      },
    });

    const requestModel = api.addModel("RequestModel", {
      contentType: "application/json",
      modelName: "RequestModel",
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          title: { type: apigateway.JsonSchemaType.STRING },
          description: { type: apigateway.JsonSchemaType.STRING },
          price: { type: apigateway.JsonSchemaType.NUMBER },
          count: { type: apigateway.JsonSchemaType.NUMBER },
        },
        required: ["title", "description", "price", "count"],
      },
    });

    const products = api.root.addResource("products");
    products.addMethod("GET", getProductsIntegration); // GET /products
    products.addMethod("POST", createProductIntegration, {
      requestModels: { "application/json": requestModel },
    }); // POST /products

    const productIdResource = products.addResource("{productId}");
    productIdResource.addMethod("GET", getProductByIdIntegration); // GET /products/{productId}
  }
}
