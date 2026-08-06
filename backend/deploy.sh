#!/bin/bash

# AWS Lambda deployment script for Di-Aza Studio Backend
# Make sure you have AWS CLI configured and Docker running

set -e

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPOSITORY="di-aza-backend"
LAMBDA_FUNCTION_NAME="di-aza-backend"
IMAGE_TAG="latest"

echo "🚀 Starting AWS Lambda deployment..."

# Step 1: Build Docker image
echo "📦 Building Docker image..."
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

# Step 2: Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Step 3: Create ECR repository if it doesn't exist
echo "📁 Creating ECR repository if needed..."
aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} 2>/dev/null || \
aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}

# Step 4: Tag and push image
echo "🏷️  Tagging and pushing image..."
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}

# Step 5: Update Lambda function
echo "⚡ Updating Lambda function..."
aws lambda update-function-code \
    --function-name ${LAMBDA_FUNCTION_NAME} \
    --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG} \
    --region ${AWS_REGION}

echo "✅ Deployment completed successfully!"
echo "🌐 Lambda function URL: https://${AWS_REGION}.lambda-url.${AWS_REGION}.on.aws/"
