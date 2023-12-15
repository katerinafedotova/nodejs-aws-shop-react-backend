import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Reference an existing S3 bucket by name or ARN
    const s3BucketName = "import-files-storage";

    const bucket = s3.Bucket.fromBucketName(this, "FilesStorage", s3BucketName);
    const sqsQueue = sqs.Queue.fromQueueArn(this, "FileImportQueue", "arn:aws:sqs:eu-central-1:073384432771:ProductsServiceStack-ProductsServiceStackCatalogItemsQueue17F4E3CA-ujSbrGXKayJs")

    const importProductsFileLambda = new lambda.Function(
      this,
      "ImportProductsFileLambda",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "importProductsFile.handler",
        code: lambda.Code.fromAsset("lambdas"),
        environment: {
          BUCKET_NAME: s3BucketName,
        },
      }
    );

    // Grant Lambda permissions to interact with S3
    bucket.grantReadWrite(importProductsFileLambda);

    // Define Lambda function for S3 event
    const importFileParserLambda = new lambda.Function(
      this,
      "ImportFileParserLambda",
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "importFileParser.handler",
        code: lambda.Code.fromAsset("lambdas"),
        environment: {
          BUCKET_NAME: s3BucketName,
          SQS_QUEUE_URL: sqsQueue.queueUrl
        },
      }
    );

    // Grant Lambda permissions to interact with S3 and SQS
    bucket.grantRead(importFileParserLambda);

    importFileParserLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [sqsQueue.queueArn],
      })
    );

    importFileParserLambda.addEventSource(
      new S3EventSource(bucket as s3.Bucket, {
        events: [s3.EventType.OBJECT_CREATED],
        filters: [{ prefix: "uploaded/", suffix: ".csv" }],
      })
    );

    // Define API Gateway
    const api = new apigateway.RestApi(this, "import-service-api", {
      restApiName: "Import Service",
      description: "This service imports products.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["*"],
      },
    });

    // Define Lambda Integration
    const importProductsIntegration = new apigateway.LambdaIntegration(
      importProductsFileLambda
    );

    // Create /import Resource
    const importResource = api.root.addResource("import");

    // Create /import GET Method
    importResource.addMethod("GET", importProductsIntegration);

    // Output the API Gateway endpoint URL
    new cdk.CfnOutput(this, "ImportServiceApiUrl", {
      value: api.url,
    });
  }
}
