# Script to update Lambda environment variables for S3 access
# Run this after deploying to ensure S3 credentials are set

param(
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$AWS_REGION = "ap-south-1"
)

Write-Host "🔧 Updating Lambda environment variables for S3 access..." -ForegroundColor Yellow

# Update Lambda function configuration with S3 credentials
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

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variables updated successfully!" -ForegroundColor Green
    Write-Host "📋 Set variables:" -ForegroundColor Cyan
    Write-Host "   - AWS_DEFAULT_REGION: ap-south-1" -ForegroundColor White
    Write-Host "   - S3_BUCKET_NAME: jgi-menteetrackers" -ForegroundColor White
    Write-Host "   - AWS_ACCESS_KEY_ID: (set)" -ForegroundColor White
    Write-Host "   - AWS_SECRET_ACCESS_KEY: (set)" -ForegroundColor White
} else {
    Write-Host "❌ Failed to update environment variables!" -ForegroundColor Red
    exit 1
}

