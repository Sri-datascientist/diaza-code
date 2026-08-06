# Comprehensive script to fix Lambda S3 access issues
# This script:
# 1. Updates Lambda environment variables
# 2. Sets up IAM permissions for S3 access
# 3. Verifies the configuration

param(
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$AWS_REGION = "ap-south-1",
    [string]$S3_BUCKET_NAME = "jgi-menteetrackers"
)

Write-Host "🔧 Fixing Lambda S3 Access Configuration..." -ForegroundColor Green
Write-Host ""

# Step 1: Update environment variables
Write-Host "📝 Step 1: Updating Lambda environment variables..." -ForegroundColor Yellow

# Create environment variables JSON file
# NOTE: We do NOT set AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY
# Lambda should use IAM role for S3 access (more secure and reliable)
$envJsonContent = @'
{
  "Variables": {
    "AWS_DEFAULT_REGION": "ap-south-1",
    "S3_BUCKET_NAME": "jgi-menteetrackers",
    "DATABASE_URL": "YOUR_DATABASE_URL",
    "SECRET_KEY": "di-aza-studio-secret-key-change-in-production",
    "ALGORITHM": "HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES": "10080"
  }
}
'@

$envJsonContent | Out-File -FilePath "lambda-env.json" -Encoding UTF8 -NoNewline

$envResult = aws lambda update-function-configuration `
    --function-name ${LAMBDA_FUNCTION_NAME} `
    --environment file://lambda-env.json `
    --region ${AWS_REGION} 2>&1

Remove-Item "lambda-env.json" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variables updated successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Environment variables update had issues" -ForegroundColor Yellow
    Write-Host $envResult -ForegroundColor Gray
}

Write-Host ""

# Step 2: Get account ID and current role
Write-Host "📝 Step 2: Checking IAM configuration..." -ForegroundColor Yellow
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
Write-Host "   Account ID: $ACCOUNT_ID" -ForegroundColor Cyan

# Get current Lambda function configuration
$functionInfo = aws lambda get-function --function-name ${LAMBDA_FUNCTION_NAME} --region ${AWS_REGION} | ConvertFrom-Json
$currentRoleArn = $functionInfo.Configuration.Role
Write-Host "   Current IAM Role: $currentRoleArn" -ForegroundColor Cyan

# Extract role name
$roleName = $currentRoleArn -replace '.*role/', ''
Write-Host "   Role Name: $roleName" -ForegroundColor Cyan

Write-Host ""

# Step 3: Create/Update S3 policy
Write-Host "📝 Step 3: Setting up S3 access policy..." -ForegroundColor Yellow

$S3_POLICY = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetObjectVersion",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::${S3_BUCKET_NAME}",
        "arn:aws:s3:::${S3_BUCKET_NAME}/*"
      ]
    }
  ]
}
"@

$S3_POLICY | Out-File -FilePath "s3-policy-temp.json" -Encoding UTF8

# Try to create policy (might already exist)
Write-Host "   Creating S3 access policy..." -ForegroundColor White
$policyResult = aws iam create-policy `
    --policy-name "diaz-s3-access-policy" `
    --policy-document file://s3-policy-temp.json 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Policy created" -ForegroundColor Green
} else {
    # Policy might already exist, try to update it
    Write-Host "   ⚠️  Policy might already exist, trying to create new version..." -ForegroundColor Yellow
    aws iam create-policy-version `
        --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/diaz-s3-access-policy" `
        --policy-document file://s3-policy-temp.json `
        --set-as-default 2>&1 | Out-Null
}

# Attach policy to role
Write-Host "   Attaching policy to role..." -ForegroundColor White
$attachResult = aws iam attach-role-policy `
    --role-name $roleName `
    --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/diaz-s3-access-policy" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Policy attached to role" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Policy might already be attached" -ForegroundColor Yellow
}

# Clean up
Remove-Item "s3-policy-temp.json" -ErrorAction SilentlyContinue

Write-Host ""

# Step 4: Verify configuration
Write-Host "📝 Step 4: Verifying configuration..." -ForegroundColor Yellow

$functionInfo = aws lambda get-function --function-name ${LAMBDA_FUNCTION_NAME} --region ${AWS_REGION} | ConvertFrom-Json
$envVars = $functionInfo.Configuration.Environment.Variables

Write-Host "   Environment Variables:" -ForegroundColor Cyan
Write-Host "      - AWS_DEFAULT_REGION: $($envVars.AWS_DEFAULT_REGION)" -ForegroundColor White
Write-Host "      - S3_BUCKET_NAME: $($envVars.S3_BUCKET_NAME)" -ForegroundColor White
Write-Host "      - AWS_ACCESS_KEY_ID: $(if ($envVars.AWS_ACCESS_KEY_ID) { 'SET (will use IAM role instead)' } else { 'NOT SET (using IAM role) ✓' })" -ForegroundColor $(if ($envVars.AWS_ACCESS_KEY_ID) { 'Yellow' } else { 'Green' })
Write-Host "      - AWS_SECRET_ACCESS_KEY: $(if ($envVars.AWS_SECRET_ACCESS_KEY) { 'SET (will use IAM role instead)' } else { 'NOT SET (using IAM role) ✓' })" -ForegroundColor $(if ($envVars.AWS_SECRET_ACCESS_KEY) { 'Yellow' } else { 'Green' })
Write-Host ""
Write-Host "   ⚠️  Note: Lambda will use IAM role for S3 access (more secure)" -ForegroundColor Yellow
Write-Host "      Ensure Lambda execution role has S3 permissions!" -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Configuration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Wait 1-2 minutes for changes to propagate" -ForegroundColor White
Write-Host "   2. Test the S3 endpoint: GET /api/public/s3/images?folder_path=beula/" -ForegroundColor White
Write-Host "   3. Check CloudWatch logs if issues persist" -ForegroundColor White
Write-Host ""

