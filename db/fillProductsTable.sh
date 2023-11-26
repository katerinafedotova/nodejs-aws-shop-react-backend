#!/bin/bash

# Define the AWS DynamoDB table name
TABLE_NAME="AWS_Products"

# Define the list of products
PRODUCT_LIST='[
    {"PutRequest": {"Item": {"id": {"S": "1"}, "title": {"S": "Lipstick"}, "description": {"S": "Long-lasting matte lipstick in various shades"}, "price": {"N": "12.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "2"}, "title": {"S": "Facial Cleanser"}, "description": {"S": "Gentle cleanser for all skin types"}, "price": {"N": "19.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "3"}, "title": {"S": "Hair Conditioner"}, "description": {"S": "Hydrating conditioner for silky smooth hair"}, "price": {"N": "14.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "4"}, "title": {"S": "Eyeshadow Palette"}, "description": {"S": "Palette with a mix of vibrant and neutral colors"}, "price": {"N": "24.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "5"}, "title": {"S": "Perfume"}, "description": {"S": "Elegant fragrance with floral and woody notes"}, "price": {"N": "39.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "6"}, "title": {"S": "Moisturizing Cream"}, "description": {"S": "Deeply hydrating cream for all-day moisture"}, "price": {"N": "29.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "7"}, "title": {"S": "Nail Polish Set"}, "description": {"S": "Set of trendy nail polish colors"}, "price": {"N": "16.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "8"}, "title": {"S": "Mascara"}, "description": {"S": "Lengthening and volumizing mascara for bold lashes"}, "price": {"N": "17.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "9"}, "title": {"S": "Anti-Aging Serum"}, "description": {"S": "Revitalizing serum for a youthful complexion"}, "price": {"N": "49.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "10"}, "title": {"S": "Shampoo"}, "description": {"S": "Sulfate-free shampoo for healthy hair"}, "price": {"N": "22.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "11"}, "title": {"S": "Blush Palette"}, "description": {"S": "Palette with a mix of blush shades for a rosy glow"}, "price": {"N": "27.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "12"}, "title": {"S": "Cleansing Wipes"}, "description": {"S": "Convenient wipes for quick and easy makeup removal"}, "price": {"N": "9.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "13"}, "title": {"S": "Sunscreen SPF 30"}, "description": {"S": "Broad-spectrum sunscreen for daily sun protection"}, "price": {"N": "18.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "14"}, "title": {"S": "Liquid Highlighter"}, "description": {"S": "Dewy liquid highlighter for a radiant glow"}, "price": {"N": "14.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "15"}, "title": {"S": "Hair Styling Gel"}, "description": {"S": "Strong-hold styling gel for creative hairstyles"}, "price": {"N": "11.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "16"}, "title": {"S": "Curling Iron"}, "description": {"S": "Professional-grade curling iron for perfect curls"}, "price": {"N": "34.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "17"}, "title": {"S": "Lip Balm Set"}, "description": {"S": "Set of nourishing lip balms in different flavors"}, "price": {"N": "8.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "18"}, "title": {"S": "Setting Spray"}, "description": {"S": "Long-lasting setting spray for makeup that stays"}, "price": {"N": "21.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "19"}, "title": {"S": "Exfoliating Scrub"}, "description": {"S": "Gentle exfoliating scrub for smooth and radiant skin"}, "price": {"N": "15.99"}}}},
    {"PutRequest": {"Item": {"id": {"S": "20"}, "title": {"S": "Eyelash Curler"}, "description": {"S": "Precision eyelash curler for lifted lashes"}, "price": {"N": "8.99"}}}}
]'

# Use the AWS CLI to put items into the DynamoDB table
aws dynamodb batch-write-item --request-items "{\"$TABLE_NAME\": $PRODUCT_LIST}"
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
