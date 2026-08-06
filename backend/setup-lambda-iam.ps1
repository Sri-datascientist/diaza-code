# Script to create IAM role and policies for Lambda function
# This ensures Lambda has proper permissions to access S3 and RDS

param(
    [string]$AWS_REGION = "ap-south-1",
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$S3_BUCKET_NAME = "jgi-menteetrackers"
)

Write-Host "🔐 Setting up IAM role and policies for Lambda function..." -ForegroundColor Green

# Step 1: Create IAM role for Lambda
Write-Host "📝 Creating IAM role..." -ForegroundColor Yellow
$TRUST_POLICY = @"
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
"@

$TRUST_POLICY | Out-File -FilePath "trust-policy.json" -Encoding UTF8

try {
    aws iam create-role `
        --role-name "diaz-lambda-execution-role" `
        --assume-role-policy-document file://trust-policy.json `
        --region ${AWS_REGION}
    Write-Host "✅ IAM role created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  IAM role might already exist, continuing..." -ForegroundColor Yellow
}

# Step 2: Attach basic Lambda execution policy
Write-Host "📋 Attaching basic Lambda execution policy..." -ForegroundColor Yellow
aws iam attach-role-policy `
    --role-name "diaz-lambda-execution-role" `
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" `
    --region ${AWS_REGION}

# Step 3: Create S3 access policy
Write-Host "🪣 Creating S3 access policy..." -ForegroundColor Yellow
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

$S3_POLICY | Out-File -FilePath "s3-policy.json" -Encoding UTF8

aws iam create-policy `
    --policy-name "diaz-s3-access-policy" `
    --policy-document file://s3-policy.json `
    --region ${AWS_REGION}

# Get account ID for policy ARN
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text

# Attach S3 policy to role
aws iam attach-role-policy `
    --role-name "diaz-lambda-execution-role" `
    --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/diaz-s3-access-policy" `
    --region ${AWS_REGION}

# Step 4: Create RDS access policy
Write-Host "🗄️  Creating RDS access policy..." -ForegroundColor Yellow
$RDS_POLICY = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rds-db:connect"
      ],
      "Resource": [
        "arn:aws:rds-db:${AWS_REGION}:${ACCOUNT_ID}:dbuser:*/admin"
      ]
    }
  ]
}
"@

$RDS_POLICY | Out-File -FilePath "rds-policy.json" -Encoding UTF8

aws iam create-policy `
    --policy-name "diaz-rds-access-policy" `
    --policy-document file://rds-policy.json `
    --region ${AWS_REGION}

# Attach RDS policy to role
aws iam attach-role-policy `
    --role-name "diaz-lambda-execution-role" `
    --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/diaz-rds-access-policy" `
    --region ${AWS_REGION}

# Step 5: Update Lambda function to use the role
Write-Host "⚡ Updating Lambda function to use IAM role..." -ForegroundColor Yellow
aws lambda update-function-configuration `
    --function-name ${LAMBDA_FUNCTION_NAME} `
    --role "arn:aws:iam::${ACCOUNT_ID}:role/diaz-lambda-execution-role" `
    --region ${AWS_REGION}

# Clean up temporary files
Remove-Item "trust-policy.json" -ErrorAction SilentlyContinue
Remove-Item "s3-policy.json" -ErrorAction SilentlyContinue
Remove-Item "rds-policy.json" -ErrorAction SilentlyContinue

Write-Host "✅ IAM setup completed successfully!" -ForegroundColor Green
Write-Host "📋 Lambda function now has proper permissions for S3 and RDS access" -ForegroundColor Cyan
