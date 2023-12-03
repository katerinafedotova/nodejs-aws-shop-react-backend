#!/bin/bash

# Define the AWS DynamoDB table name for stocks
STOCKS_TABLE_NAME="AWS_stocks"

# Dummy data for the stocks table
STOCKS_DATA='[
    {"PutRequest": {"Item": {"product_id": {"S": "1"}, "count": {"N": "10"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "2"}, "count": {"N": "15"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "3"}, "count": {"N": "8"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "4"}, "count": {"N": "12"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "5"}, "count": {"N": "20"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "6"}, "count": {"N": "9"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "7"}, "count": {"N": "11"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "8"}, "count": {"N": "13"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "9"}, "count": {"N": "7"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "10"}, "count": {"N": "16"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "11"}, "count": {"N": "9"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "12"}, "count": {"N": "18"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "13"}, "count": {"N": "7"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "14"}, "count": {"N": "11"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "15"}, "count": {"N": "13"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "16"}, "count": {"N": "5"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "17"}, "count": {"N": "12"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "18"}, "count": {"N": "10"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "19"}, "count": {"N": "7"}}}},
    {"PutRequest": {"Item": {"product_id": {"S": "20"}, "count": {"N": "14"}}}}
]'

# Use the AWS CLI to put items into the DynamoDB table for stocks
aws dynamodb batch-write-item --request-items "{\"$STOCKS_TABLE_NAME\": $STOCKS_DATA}"
