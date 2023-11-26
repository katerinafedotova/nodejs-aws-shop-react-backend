import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class ProductsServiceStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // const bucket = new s3.Bucket(this, "ProductsStore");

    const productsTable = Table.fromTableName(this, 'AWS_Products', 'AWS_Products')

    const nodeJsFunctionProps: NodejsFunctionProps= {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, '/', 'package-lock.json'),
      environment: {
        PRIMARY_KEY: 'itemId',
        TABLE_NAME: productsTable.tableName,
      },
      runtime: lambda.Runtime.NODEJS_16_X,
    }

    const getAllLambda = new NodejsFunction(this, 'getProductsList', {
      entry: join(__dirname, 'lambdas', 'getProductsList.js'),
      ...nodeJsFunctionProps,
    });

    productsTable.grantReadWriteData(getAllLambda);

    const getProductsIntegration = new apigateway.LambdaIntegration(getAllLambda);

    const api = new apigateway.RestApi(this, "products-api", {
      restApiName: "Products Service",
      description: "This service serves products.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,  // You can specify specific origins if needed
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['*'],  // You can specify specific headers if needed
      },
    });

    // const getProductsIntegration = new apigateway.LambdaIntegration(handler, {
    //   requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    // });

    // api.root.addMethod("GET", getProductsIntegration); // GET /

    const products = api.root.addResource("products");
    products.addMethod("GET", getProductsIntegration); // GET /products
    
    // const product = products.addResource('{productId}');
    // product.addMethod("GET", getProductsIntegration); // GET /products/productId

  }
}