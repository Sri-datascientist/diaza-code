# Script to check and configure Lambda S3 access
# This verifies that Lambda has the necessary permissions to access S3

param(
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$AWS_REGION = "ap-south-1"
)

Write-Host "🔍 Checking Lambda function configuration..." -ForegroundColor Yellow

# Get Lambda function details
$functionInfo = aws lambda get-function --function-name ${LAMBDA_FUNCTION_NAME} --region ${AWS_REGION} | ConvertFrom-Json

if (-not $functionInfo) {
    Write-Host "❌ Lambda function not found: ${LAMBDA_FUNCTION_NAME}" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Lambda function found: ${LAMBDA_FUNCTION_NAME}" -ForegroundColor Green
Write-Host "📋 Current configuration:" -ForegroundColor Cyan

# Check environment variables
$envVars = $functionInfo.Configuration.Environment.Variables
if ($envVars) {
    Write-Host "`n🔧 Environment Variables:" -ForegroundColor Yellow
    Write-Host "   - AWS_DEFAULT_REGION: $($envVars.AWS_DEFAULT_REGION)" -ForegroundColor White
    Write-Host "   - S3_BUCKET_NAME: $($envVars.S3_BUCKET_NAME)" -ForegroundColor White
    Write-Host "   - AWS_ACCESS_KEY_ID: $(if ($envVars.AWS_ACCESS_KEY_ID) { 'SET' } else { 'NOT SET' })" -ForegroundColor $(if ($envVars.AWS_ACCESS_KEY_ID) { 'Green' } else { 'Red' })
    Write-Host "   - AWS_SECRET_ACCESS_KEY: $(if ($envVars.AWS_SECRET_ACCESS_KEY) { 'SET' } else { 'NOT SET' })" -ForegroundColor $(if ($envVars.AWS_SECRET_ACCESS_KEY) { 'Green' } else { 'Red' })
} else {
    Write-Host "⚠️  No environment variables set!" -ForegroundColor Red
}

# Check IAM role
$roleArn = $functionInfo.Configuration.Role
Write-Host "`n🔐 IAM Role: $roleArn" -ForegroundColor Cyan

# Extract role name from ARN
$roleName = $roleArn -replace '.*role/', ''
Write-Host "📝 Role name: $roleName" -ForegroundColor White

# Check if role has S3 permissions
Write-Host "`n🔍 Checking IAM role policies..." -ForegroundColor Yellow
$policies = aws iam list-attached-role-policies --role-name $roleName | ConvertFrom-Json

if ($policies.AttachedPolicies) {
    Write-Host "✅ Attached policies:" -ForegroundColor Green
    foreach ($policy in $policies.AttachedPolicies) {
        Write-Host "   - $($policy.PolicyName)" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  No policies attached to role!" -ForegroundColor Red
}

Write-Host "`n💡 Recommendations:" -ForegroundColor Cyan
if (-not $envVars.AWS_ACCESS_KEY_ID) {
    Write-Host "   1. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables" -ForegroundColor Yellow
    Write-Host "      Run: .\update-lambda-env.ps1" -ForegroundColor White
}
Write-Host "   2. Ensure Lambda execution role has S3 permissions:" -ForegroundColor Yellow
Write-Host "      - s3:ListBucket on arn:aws:s3:::jgi-menteetrackers" -ForegroundColor White
Write-Host "      - s3:GetObject on arn:aws:s3:::jgi-menteetrackers/*" -ForegroundColor White
Write-Host "      - s3:GetBucketLocation on arn:aws:s3:::jgi-menteetrackers" -ForegroundColor White

