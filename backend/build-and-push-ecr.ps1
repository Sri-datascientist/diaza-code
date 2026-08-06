# Docker build and ECR push script
# Builds Docker image and pushes to ECR

param(
    [string]$AWS_ACCOUNT_ID = "474833638797",
    [string]$AWS_REGION = "ap-south-1",
    [string]$ECR_REPOSITORY = "diaz",
    [string]$IMAGE_TAG = "latest"
)

$ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
$IMAGE_NAME = "${ECR_URI}/${ECR_REPOSITORY}:${IMAGE_TAG}"

Write-Host "🐳 Docker Build and ECR Push Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host "Account ID: $AWS_ACCOUNT_ID" -ForegroundColor Cyan
Write-Host "Region: $AWS_REGION" -ForegroundColor Cyan
Write-Host "Repository: $ECR_REPOSITORY" -ForegroundColor Cyan
Write-Host "Tag: $IMAGE_TAG" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build Docker image
Write-Host "📦 Step 1: Building Docker image..." -ForegroundColor Yellow
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker image built successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Login to ECR
Write-Host "🔐 Step 2: Logging into ECR..." -ForegroundColor Yellow
$loginCmd = aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ECR login failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged into ECR successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Create ECR repository if it doesn't exist
Write-Host "📁 Step 3: Checking/creating ECR repository..." -ForegroundColor Yellow
$repoExists = aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Repository doesn't exist, creating..." -ForegroundColor Yellow
    aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ECR repository created" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create repository!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ ECR repository already exists" -ForegroundColor Green
}
Write-Host ""

# Step 4: Tag image for ECR
Write-Host "🏷️  Step 4: Tagging image for ECR..." -ForegroundColor Yellow
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${IMAGE_NAME}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Image tagging failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Image tagged: ${IMAGE_NAME}" -ForegroundColor Green
Write-Host ""

# Step 5: Push image to ECR
Write-Host "📤 Step 5: Pushing image to ECR..." -ForegroundColor Yellow
docker push ${IMAGE_NAME}
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Image push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "====================================" -ForegroundColor Green
Write-Host "✅ Build and Push Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Image URI: ${IMAGE_NAME}" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step: Update Lambda function with this image:" -ForegroundColor Yellow
Write-Host "  aws lambda update-function-code --function-name diaz --image-uri ${IMAGE_NAME} --region ${AWS_REGION}" -ForegroundColor White

