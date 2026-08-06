#!/bin/bash

# Script to update Lambda Function URL CORS configuration
# This fixes the CORS errors by explicitly allowing Content-Type header

FUNCTION_NAME="di-aza-backend"  # Update this with your actual Lambda function name

echo "Updating Lambda Function URL CORS configuration for: $FUNCTION_NAME"

aws lambda update-function-url-config \
    --function-name "$FUNCTION_NAME" \
    --cors '{
        "AllowCredentials": false,
        "AllowHeaders": [
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With"
        ],
        "AllowMethods": [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS",
            "PATCH"
        ],
        "AllowOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAge": 86400
    }'

echo ""
echo "CORS configuration updated successfully!"
echo ""
echo "Note: If you're still seeing duplicate headers, you may need to:"
echo "1. Wait a few minutes for the changes to propagate"
echo "2. Clear your browser cache"
echo "3. Verify the Lambda Function URL CORS is the only source of CORS headers"


