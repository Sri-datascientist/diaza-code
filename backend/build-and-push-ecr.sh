#!/bin/bash
# Docker build and ECR push script (Bash version)
# Builds Docker image and pushes to ECR

AWS_ACCOUNT_ID="474833638797"
AWS_REGION="ap-south-1"
ECR_REPOSITORY="diaz"
IMAGE_TAG="latest"

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_NAME="${ECR_URI}/${ECR_REPOSITORY}:${IMAGE_TAG}"

echo "🐳 Docker Build and ECR Push Script"
echo "===================================="
echo "Account ID: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"
echo "Repository: $ECR_REPOSITORY"
echo "Tag: $IMAGE_TAG"
echo ""

# Step 1: Build Docker image
echo "📦 Step 1: Building Docker image..."
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi
echo "✅ Docker image built successfully"
echo ""

# Step 2: Login to ECR
echo "🔐 Step 2: Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

if [ $? -ne 0 ]; then
    echo "❌ ECR login failed!"
    exit 1
fi
echo "✅ Logged into ECR successfully"
echo ""

# Step 3: Create ECR repository if it doesn't exist
echo "📁 Step 3: Checking/creating ECR repository..."
aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "   Repository doesn't exist, creating..."
    aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}
    if [ $? -eq 0 ]; then
        echo "✅ ECR repository created"
    else
        echo "❌ Failed to create repository!"
        exit 1
    fi
else
    echo "✅ ECR repository already exists"
fi
echo ""

# Step 4: Tag image for ECR
echo "🏷️  Step 4: Tagging image for ECR..."
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo "❌ Image tagging failed!"
    exit 1
fi
echo "✅ Image tagged: ${IMAGE_NAME}"
echo ""

# Step 5: Push image to ECR
echo "📤 Step 5: Pushing image to ECR..."
docker push ${IMAGE_NAME}

if [ $? -ne 0 ]; then
    echo "❌ Image push failed!"
    exit 1
fi
echo "✅ Image pushed successfully!"
echo ""

echo "===================================="
echo "✅ Build and Push Complete!"
echo "===================================="
echo ""
echo "Image URI: ${IMAGE_NAME}"
echo ""
echo "Next step: Update Lambda function with this image:"
echo "  aws lambda update-function-code --function-name diaz --image-uri ${IMAGE_NAME} --region ${AWS_REGION}"

