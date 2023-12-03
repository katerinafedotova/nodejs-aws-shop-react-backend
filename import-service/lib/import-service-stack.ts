import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Reference an existing S3 bucket by name or ARN
    const s3BucketName = "import-files-storage";

    const bucket = s3.Bucket.fromBucketName(
      this,
      "FilesStorage",
      s3BucketName
    );

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

    // Define API Gateway
    const api = new apigateway.RestApi(this, "ImportServiceAPI");

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
