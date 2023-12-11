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
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Duration } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class ProductsServiceStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // get products and stock tables
    const productsTable = Table.fromTableName(
      this,
      "AWS_Products",
      "AWS_Products"
    );
    const stocksTable = Table.fromTableName(this, "AWS_stocks", "AWS_stocks");

    // set default nodeJsFunctionProps
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          "aws-sdk",
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

    // create lambdas
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

    // grant access to tables
    productsTable.grantReadWriteData(getAllLambda);
    stocksTable.grantReadWriteData(getAllLambda);
    productsTable.grantReadWriteData(getOneLambda);
    stocksTable.grantReadWriteData(getOneLambda);
    productsTable.grantReadWriteData(createLambda);
    stocksTable.grantReadWriteData(createLambda);

    // set api gateway
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

    // set endpoints
    const products = api.root.addResource("products");
    products.addMethod("GET", getProductsIntegration); // GET /products
    products.addMethod("POST", createProductIntegration, {
      requestModels: { "application/json": requestModel },
    }); // POST /products

    const productIdResource = products.addResource("{productId}");
    productIdResource.addMethod("GET", getProductByIdIntegration); // GET /products/{productId}

    // Create an SQS queue
    const catalogItemsQueue = new Queue(this, 'CatalogItemsQueue', {
      visibilityTimeout: Duration.seconds(300),
    });

    // Create an SNS topic
    const createProductTopic = new sns.Topic(this, 'CreateProductTopic', {
      displayName: 'Create Product Topic',
    });

    // Create an email subscription
    createProductTopic.addSubscription(
      new snsSubscriptions.EmailSubscription('fedotova490@gmail.com')
    );

    // Create a Lambda function
    const catalogBatchProcessLambda = new NodejsFunction(this, 'CatalogBatchProcess', {
      entry: join(__dirname, "lambdas", "catalogBatchProcess.js"),
      ...nodeJsFunctionProps,
      environment: {
        SNS_TOPIC_ARN: createProductTopic.topicArn
      }
    });

    createProductTopic.grantPublish(catalogBatchProcessLambda)

    // Grant the Lambda function permissions to access DynamoDB, SQS, and SNS
    catalogBatchProcessLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:PutItem'],
        resources: [
          'arn:aws:dynamodb:eu-central-1:073384432771:table/AWS_Products',
          'arn:aws:dynamodb:eu-central-1:073384432771:table/AWS_stocks',
        ],
      })
    );

    catalogBatchProcessLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [catalogItemsQueue.queueArn],
      })
    );

    // Set up the SQS trigger for the Lambda function
    catalogBatchProcessLambda.addEventSource(
      new SqsEventSource(catalogItemsQueue, {
        batchSize: 5,
      })
    );
  }

}
