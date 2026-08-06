# Script to remove invalid AWS credentials from Lambda environment variables
# This forces Lambda to use IAM role instead (more secure)

param(
    [string]$LAMBDA_FUNCTION_NAME = "diaz",
    [string]$AWS_REGION = "ap-south-1"
)

Write-Host "🔧 Removing invalid AWS credentials from Lambda..." -ForegroundColor Green
Write-Host "   This will force Lambda to use IAM role for S3 access" -ForegroundColor Yellow
Write-Host ""

# Get current environment variables
Write-Host "📋 Getting current Lambda configuration..." -ForegroundColor Yellow
$functionInfo = aws lambda get-function --function-name $LAMBDA_FUNCTION_NAME --region $AWS_REGION | ConvertFrom-Json

if (-not $functionInfo) {
    Write-Host "❌ Lambda function not found: $LAMBDA_FUNCTION_NAME" -ForegroundColor Red
    exit 1
}

$currentEnvVars = $functionInfo.Configuration.Environment.Variables

if (-not $currentEnvVars) {
    Write-Host "⚠️  No environment variables found" -ForegroundColor Yellow
    exit 0
}

# Create new environment variables without AWS credentials
$newEnvVars = @{}
foreach ($key in $currentEnvVars.PSObject.Properties.Name) {
    if ($key -ne "AWS_ACCESS_KEY_ID" -and $key -ne "AWS_SECRET_ACCESS_KEY") {
        $newEnvVars[$key] = $currentEnvVars.$key
    }
}

# Build JSON file
$jsonContent = "{`n  `"Variables`": {`n"
$keys = $newEnvVars.Keys | Sort-Object
$count = 0
foreach ($key in $keys) {
    $count++
    $value = $newEnvVars[$key]
    $valueEscaped = $value -replace '\', '\\' -replace '"', '\"'
    if ($count -lt $keys.Count) {
        $jsonContent += "    `"$key`": `"$valueEscaped`",`n"
    } else {
        $jsonContent += "    `"$key`": `"$valueEscaped`"`n"
    }
}
$jsonContent += "  }`n}"

$jsonContent | Out-File -FilePath "lambda-env-clean.json" -Encoding UTF8 -NoNewline

Write-Host "📝 Updating Lambda environment variables (removing AWS credentials)..." -ForegroundColor Yellow
$result = aws lambda update-function-configuration --function-name $LAMBDA_FUNCTION_NAME --environment file://lambda-env-clean.json --region $AWS_REGION 2>&1

Remove-Item "lambda-env-clean.json" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully removed AWS credentials!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Lambda will now use IAM role for S3 access" -ForegroundColor Cyan
    Write-Host "   Make sure Lambda execution role has S3 permissions:" -ForegroundColor Yellow
    Write-Host "   - s3:ListBucket on arn:aws:s3:::jgi-menteetrackers" -ForegroundColor White
    Write-Host "   - s3:GetObject on arn:aws:s3:::jgi-menteetrackers/*" -ForegroundColor White
    Write-Host ""
    Write-Host "   Run this to set up IAM permissions:" -ForegroundColor Yellow
    Write-Host "   .\setup-lambda-iam.ps1" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Failed to update environment variables!" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    exit 1
}
