# AWS Lambda deployment script for Di-Aza Studio Backend
# Make sure you have AWS CLI configured and Docker running

param(
    [string]$AWS_REGION = "us-east-1",
    [string]$ECR_REPOSITORY = "di-aza-backend",
    [string]$LAMBDA_FUNCTION_NAME = "di-aza-backend",
    [string]$IMAGE_TAG = "latest"
)

# Get AWS Account ID
$AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

Write-Host "🚀 Starting AWS Lambda deployment..." -ForegroundColor Green

# Step 1: Build Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Login to ECR
Write-Host "🔐 Logging into ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Step 3: Create ECR repository if it doesn't exist
Write-Host "📁 Creating ECR repository if needed..." -ForegroundColor Yellow
try {
    aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} 2>$null
} catch {
    aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}
}

# Step 4: Tag and push image
Write-Host "🏷️  Tagging and pushing image..." -ForegroundColor Yellow
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}

# Step 5: Update Lambda function
Write-Host "⚡ Updating Lambda function..." -ForegroundColor Yellow
aws lambda update-function-code `
    --function-name ${LAMBDA_FUNCTION_NAME} `
    --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG} `
    --region ${AWS_REGION}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Lambda function URL: https://${AWS_REGION}.lambda-url.${AWS_REGION}.on.aws/" -ForegroundColor Cyan
