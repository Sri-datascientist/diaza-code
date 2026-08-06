# AWS Lambda deployment script with environment variables
# Make sure you have AWS CLI configured and Docker running

param(
    [string]$AWS_REGION = "ap-south-1",
    [string]$ECR_REPOSITORY = "diaz",
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$IMAGE_TAG = "latest"
)

# Get AWS Account ID
$AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

Write-Host "🚀 Starting AWS Lambda deployment with environment variables..." -ForegroundColor Green

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

# Step 5: Update Lambda function code
Write-Host "⚡ Updating Lambda function code..." -ForegroundColor Yellow
aws lambda update-function-code `
    --function-name ${LAMBDA_FUNCTION_NAME} `
    --image-uri ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG} `
    --region ${AWS_REGION}

# Step 6: Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow
aws lambda update-function-configuration `
    --function-name ${LAMBDA_FUNCTION_NAME} `
    --environment Variables='{
        "AWS_DEFAULT_REGION": "ap-south-1",
        "S3_BUCKET_NAME": "jgi-menteetrackers",
        "AWS_ACCESS_KEY_ID": "YOUR_AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY": "YOUR_AWS_SECRET_ACCESS_KEY",
        "DATABASE_URL": "YOUR_DATABASE_URL",
        "SECRET_KEY": "di-aza-studio-secret-key-change-in-production",
        "ALGORITHM": "HS256",
        "ACCESS_TOKEN_EXPIRE_MINUTES": "10080"
    }' `
    --region ${AWS_REGION}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Lambda function URL: https://${AWS_REGION}.lambda-url.${AWS_REGION}.on.aws/" -ForegroundColor Cyan
Write-Host "📋 Environment variables set for S3 and database access" -ForegroundColor Cyan
