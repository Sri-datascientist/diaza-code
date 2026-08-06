# PowerShell script to update Lambda Function URL CORS configuration
# This fixes the CORS errors by explicitly allowing Content-Type header and all origins

$FUNCTION_NAME = "diaz"  # Lambda function name
$AWS_REGION = "ap-south-1"

Write-Host "Updating Lambda Function URL CORS configuration for: $FUNCTION_NAME" -ForegroundColor Green
Write-Host "Region: $AWS_REGION" -ForegroundColor Cyan

# Create CORS configuration JSON file
$corsConfigContent = @'
{
  "AllowCredentials": false,
  "AllowHeaders": [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "X-CSRFToken",
    "X-Request-ID"
  ],
  "AllowMethods": [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH",
    "HEAD"
  ],
  "AllowOrigins": [
    "*"
  ],
  "ExposeHeaders": [],
  "MaxAge": 86400
}
'@

$corsConfigContent | Out-File -FilePath "cors-config.json" -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "CORS Configuration:" -ForegroundColor Yellow
Write-Host "  - AllowOrigins: * (all origins)" -ForegroundColor White
Write-Host "  - AllowHeaders: Content-Type, Authorization, Accept, Origin, X-Requested-With, etc." -ForegroundColor White
Write-Host "  - AllowMethods: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD" -ForegroundColor White
Write-Host ""

Write-Host "Executing AWS CLI command..." -ForegroundColor Yellow
$result = aws lambda update-function-url-config --function-name $FUNCTION_NAME --cors file://cors-config.json --region $AWS_REGION 2>&1

# Clean up temp file
Remove-Item "cors-config.json" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ CORS configuration updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Note: If you're still seeing CORS errors, you may need to:" -ForegroundColor Yellow
    Write-Host "1. Wait a few minutes for the changes to propagate" -ForegroundColor White
    Write-Host "2. Clear your browser cache and hard refresh (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "3. Verify the Lambda Function URL CORS is the only source of CORS headers" -ForegroundColor White
    Write-Host "4. Check that the backend code is not adding duplicate CORS headers" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Failed to update CORS configuration!" -ForegroundColor Red
    Write-Host "Error output:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. AWS CLI is configured correctly" -ForegroundColor White
    Write-Host "2. You have permissions to update Lambda function URL config" -ForegroundColor White
    Write-Host "3. The Lambda function name is correct: $FUNCTION_NAME" -ForegroundColor White
    exit 1
}

