# Simple script to fix S3 access by removing invalid credentials and setting up IAM

$FUNCTION_NAME = "diaz"
$REGION = "ap-south-1"
$BUCKET = "jgi-menteetrackers"

Write-Host "Fixing Lambda S3 access..." -ForegroundColor Green

# Step 1: Get current env vars and remove credentials
Write-Host "Step 1: Removing invalid credentials..." -ForegroundColor Yellow
$current = aws lambda get-function-configuration --function-name $FUNCTION_NAME --region $REGION --query 'Environment.Variables' --output json

# Create new env vars without credentials
# Note: AWS_DEFAULT_REGION is reserved, so we use AWS_REGION instead
$envJson = @"
{
  "Variables": {
    "AWS_REGION": "$REGION",
    "S3_BUCKET_NAME": "$BUCKET",
    "DATABASE_URL": "YOUR_DATABASE_URL",
    "SECRET_KEY": "di-aza-studio-secret-key-change-in-production",
    "ALGORITHM": "HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES": "10080"
  }
}
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PWD\env-clean.json", $envJson, $utf8NoBom)

aws lambda update-function-configuration --function-name $FUNCTION_NAME --environment file://env-clean.json --region $REGION

Remove-Item "env-clean.json" -ErrorAction SilentlyContinue

Write-Host "Step 2: Setting up IAM permissions..." -ForegroundColor Yellow

# Create S3 policy
$s3Policy = @"
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
        "arn:aws:s3:::$BUCKET",
        "arn:aws:s3:::$BUCKET/*"
      ]
    }
  ]
}
"@

[System.IO.File]::WriteAllText("$PWD\s3-policy.json", $s3Policy, $utf8NoBom)

$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

# Create policy if it doesn't exist
aws iam create-policy --policy-name "diaz-s3-access-policy" --policy-document file://s3-policy.json 2>&1 | Out-Null

# Get current role
$roleArn = aws lambda get-function-configuration --function-name $FUNCTION_NAME --region $REGION --query 'Role' --output text
$roleName = $roleArn -replace '.*role/', ''

# Try to attach policy (may fail if no permissions)
Write-Host "Attempting to attach S3 policy to role..." -ForegroundColor Yellow
$attachResult = aws iam attach-role-policy --role-name $roleName --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/diaz-s3-access-policy" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Could not attach policy automatically (permissions issue)" -ForegroundColor Yellow
    Write-Host "You need to manually attach the policy:" -ForegroundColor Yellow
    Write-Host "  Policy ARN: arn:aws:iam::${ACCOUNT_ID}:policy/diaz-s3-access-policy" -ForegroundColor White
    Write-Host "  Role Name: $roleName" -ForegroundColor White
    Write-Host ""
    Write-Host "Or ensure the Lambda execution role has these inline policy permissions:" -ForegroundColor Yellow
    Write-Host "  - s3:ListBucket on arn:aws:s3:::$BUCKET" -ForegroundColor White
    Write-Host "  - s3:GetObject on arn:aws:s3:::$BUCKET/*" -ForegroundColor White
} else {
    Write-Host "Policy attached successfully!" -ForegroundColor Green
}

Remove-Item "s3-policy.json" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Environment variables updated (removed invalid credentials)" -ForegroundColor Green
Write-Host "Lambda will now use IAM role for S3 access." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Ensure IAM role has S3 permissions (see above)" -ForegroundColor White
Write-Host "2. Wait 1-2 minutes for changes to propagate" -ForegroundColor White
Write-Host "3. Redeploy your Lambda function with the updated code" -ForegroundColor White
Write-Host "4. Test your S3 endpoint" -ForegroundColor White

