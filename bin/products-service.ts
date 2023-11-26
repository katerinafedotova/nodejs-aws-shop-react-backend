#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsServiceStack } from '../lib/products-service-stack';

class BackendStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string) {
    super(parent, name);

    new ProductsServiceStack(this, "ProductsServiceStack");
  }
}

const app = new cdk.App();
new BackendStack(app, 'ProductsServiceStack');

app.synth();
