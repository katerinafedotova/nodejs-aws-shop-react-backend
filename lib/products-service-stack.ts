import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

export class ProductsServiceStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, "ProductsStore");

    const handler = new lambda.Function(this, "ProductsHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "products.handler",
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    bucket.grantReadWrite(handler);

    const api = new apigateway.RestApi(this, "products-api", {
      restApiName: "Products Service",
      description: "This service serves products."
    });

    const getProductsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    // api.root.addMethod("GET", getProductsIntegration); // GET /

    const products = api.root.addResource("products");
    products.addMethod("GET", getProductsIntegration); // GET /products
    
    const product = products.addResource('{productId}');
    product.addMethod("GET", getProductsIntegration); // GET /products/productId

  }
}