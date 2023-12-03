# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Fill DynamoDb tables with data

There are 2 scripts available in /db folder. In order to fill the table, you need to:

* give the file execute permissions: `chmod +x fillProductsTable.sh`

* run the file `./populate-stocks.sh`

## API

Please use this API: <https://eou9la9ryi.execute-api.eu-central-1.amazonaws.com/prod>

**Available endpoints**:

* `/products` - GET - gets all products

* `/products` - POST - accepts product in form of

```
{
  "title": "Test Product",
  "description": "This is a Test product description.",
  "price": 99.99,
  "count": 8
}
```

and returns newly created product with an "id"

* `/products/{id}` - GET - gets product by id
