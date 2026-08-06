# Diagnostic script to identify S3 access issues on Lambda
# This helps debug why S3 works locally but not on Lambda

param(
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$AWS_REGION = "ap-south-1"
)

Write-Host "🔍 Diagnosing Lambda S3 Access Issues..." -ForegroundColor Green
Write-Host ""

# Step 1: Check Lambda function configuration
Write-Host "📋 Step 1: Checking Lambda function configuration..." -ForegroundColor Yellow
$functionInfo = aws lambda get-function --function-name ${LAMBDA_FUNCTION_NAME} --region ${AWS_REGION} | ConvertFrom-Json

if (-not $functionInfo) {
    Write-Host "❌ Lambda function not found: ${LAMBDA_FUNCTION_NAME}" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Lambda function found: ${LAMBDA_FUNCTION_NAME}" -ForegroundColor Green
Write-Host ""

# Step 2: Check environment variables
Write-Host "📋 Step 2: Checking environment variables..." -ForegroundColor Yellow
$envVars = $functionInfo.Configuration.Environment.Variables

if ($envVars) {
    Write-Host "Environment Variables:" -ForegroundColor Cyan
    Write-Host "  AWS_DEFAULT_REGION: $($envVars.AWS_DEFAULT_REGION)" -ForegroundColor $(if ($envVars.AWS_DEFAULT_REGION) { 'Green' } else { 'Red' })
    Write-Host "  S3_BUCKET_NAME: $($envVars.S3_BUCKET_NAME)" -ForegroundColor $(if ($envVars.S3_BUCKET_NAME) { 'Green' } else { 'Red' })
    Write-Host "  AWS_ACCESS_KEY_ID: $(if ($envVars.AWS_ACCESS_KEY_ID) { 'SET ✓' } else { 'NOT SET ✗' })" -ForegroundColor $(if ($envVars.AWS_ACCESS_KEY_ID) { 'Green' } else { 'Red' })
    Write-Host "  AWS_SECRET_ACCESS_KEY: $(if ($envVars.AWS_SECRET_ACCESS_KEY) { 'SET ✓' } else { 'NOT SET ✗' })" -ForegroundColor $(if ($envVars.AWS_SECRET_ACCESS_KEY) { 'Green' } else { 'Red' })
} else {
    Write-Host "❌ No environment variables set!" -ForegroundColor Red
}

Write-Host ""

# Step 3: Check IAM role and permissions
Write-Host "📋 Step 3: Checking IAM role and permissions..." -ForegroundColor Yellow
$roleArn = $functionInfo.Configuration.Role
Write-Host "  IAM Role: $roleArn" -ForegroundColor Cyan

$roleName = $roleArn -replace '.*role/', ''
Write-Host "  Role Name: $roleName" -ForegroundColor Cyan

# Get attached policies
$policies = aws iam list-attached-role-policies --role-name $roleName | ConvertFrom-Json
Write-Host "  Attached Policies:" -ForegroundColor Cyan
if ($policies.AttachedPolicies) {
    foreach ($policy in $policies.AttachedPolicies) {
        Write-Host "    - $($policy.PolicyName)" -ForegroundColor White
        
        # Check if it's an S3 policy
        if ($policy.PolicyName -like "*s3*" -or $policy.PolicyName -like "*S3*") {
            Write-Host "      ✓ S3-related policy found" -ForegroundColor Green
        }
    }
} else {
    Write-Host "    ⚠️  No policies attached!" -ForegroundColor Yellow
}

# Check inline policies
$inlinePolicies = aws iam list-role-policies --role-name $roleName | ConvertFrom-Json
if ($inlinePolicies.PolicyNames) {
    Write-Host "  Inline Policies:" -ForegroundColor Cyan
    foreach ($policyName in $inlinePolicies.PolicyNames) {
        Write-Host "    - $policyName" -ForegroundColor White
    }
}

Write-Host ""

# Step 4: Check CloudWatch logs (recent errors)
Write-Host "📋 Step 4: Checking recent CloudWatch logs..." -ForegroundColor Yellow
Write-Host "  Log Group: /aws/lambda/${LAMBDA_FUNCTION_NAME}" -ForegroundColor Cyan
Write-Host "  (Check CloudWatch console for detailed logs)" -ForegroundColor Gray

Write-Host ""

# Step 5: Recommendations
Write-Host "💡 Recommendations:" -ForegroundColor Cyan

$issues = @()

if (-not $envVars.S3_BUCKET_NAME) {
    $issues += "S3_BUCKET_NAME environment variable is not set"
}

if (-not $envVars.AWS_DEFAULT_REGION) {
    $issues += "AWS_DEFAULT_REGION environment variable is not set"
}

# Check if S3 permissions exist
$hasS3Policy = $false
if ($policies.AttachedPolicies) {
    foreach ($policy in $policies.AttachedPolicies) {
        if ($policy.PolicyName -like "*s3*" -or $policy.PolicyName -like "*S3*") {
            $hasS3Policy = $true
            break
        }
    }
}

if (-not $hasS3Policy) {
    $issues += "No S3 access policy attached to IAM role"
}

if ($issues.Count -eq 0) {
    Write-Host "  ✅ Configuration looks good!" -ForegroundColor Green
    Write-Host "  If S3 still doesn't work, check:" -ForegroundColor Yellow
    Write-Host "    1. CloudWatch logs for detailed error messages" -ForegroundColor White
    Write-Host "    2. S3 bucket name matches exactly: $($envVars.S3_BUCKET_NAME)" -ForegroundColor White
    Write-Host "    3. S3 bucket exists in region: $($envVars.AWS_DEFAULT_REGION)" -ForegroundColor White
    Write-Host "    4. IAM policy allows access to the specific bucket" -ForegroundColor White
} else {
    Write-Host "  Issues found:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "    - $issue" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "  Run this to fix:" -ForegroundColor Yellow
    Write-Host "    .\fix-lambda-s3.ps1" -ForegroundColor White
}

Write-Host ""

