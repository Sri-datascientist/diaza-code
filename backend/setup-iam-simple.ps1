# Simple IAM setup for Lambda function
param(
    [string]$AWS_REGION = "ap-south-1",
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$S3_BUCKET_NAME = "jgi-menteetrackers"
)

Write-Host "Setting up IAM role and policies for Lambda function..." -ForegroundColor Green

# Get account ID
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
Write-Host "Account ID: $ACCOUNT_ID" -ForegroundColor Yellow

# Step 1: Create trust policy file
$TRUST_POLICY = @'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@

$TRUST_POLICY | Out-File -FilePath "trust-policy.json" -Encoding UTF8

# Step 2: Create IAM role
Write-Host "Creating IAM role..." -ForegroundColor Yellow
try {
    aws iam create-role --role-name "diaz-lambda-execution-role" --assume-role-policy-document file://trust-policy.json --region $AWS_REGION
    Write-Host "IAM role created successfully" -ForegroundColor Green
} catch {
    Write-Host "IAM role might already exist, continuing..." -ForegroundColor Yellow
}

# Step 3: Attach basic Lambda execution policy
Write-Host "Attaching basic Lambda execution policy..." -ForegroundColor Yellow
aws iam attach-role-policy --role-name "diaz-lambda-execution-role" --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" --region $AWS_REGION

# Step 4: Create S3 policy
$S3_POLICY = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetObjectVersion"
      ],
      "Resource": [
        "arn:aws:s3:::$S3_BUCKET_NAME",
        "arn:aws:s3:::$S3_BUCKET_NAME/*"
      ]
    }
  ]
}
"@

$S3_POLICY | Out-File -FilePath "s3-policy.json" -Encoding UTF8

# Step 5: Create and attach S3 policy
Write-Host "Creating S3 access policy..." -ForegroundColor Yellow
aws iam create-policy --policy-name "diaz-s3-access-policy" --policy-document file://s3-policy.json --region $AWS_REGION

aws iam attach-role-policy --role-name "diaz-lambda-execution-role" --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/diaz-s3-access-policy" --region $AWS_REGION

# Step 6: Update Lambda function to use the role
Write-Host "Updating Lambda function to use IAM role..." -ForegroundColor Yellow
aws lambda update-function-configuration --function-name $LAMBDA_FUNCTION_NAME --role "arn:aws:iam::$ACCOUNT_ID:role/diaz-lambda-execution-role" --region $AWS_REGION

# Clean up
Remove-Item "trust-policy.json" -ErrorAction SilentlyContinue
Remove-Item "s3-policy.json" -ErrorAction SilentlyContinue

Write-Host "IAM setup completed successfully!" -ForegroundColor Green
