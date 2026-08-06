# CORS Troubleshooting Guide

## Understanding the CORS Errors

### Error 1: "Request header field content-type is not allowed"
**Cause**: The Lambda Function URL CORS configuration doesn't explicitly allow the `Content-Type` header in the preflight response.

**Solution**: Update the Lambda Function URL CORS configuration to explicitly list `Content-Type` in the `AllowHeaders` array.

### Error 2: "Access-Control-Allow-Origin header contains multiple values '*, *'"
**Cause**: Both the Lambda Function URL CORS configuration AND the FastAPI CORS middleware are adding CORS headers, causing duplicates.

**Solution**: The backend code now automatically disables FastAPI CORS middleware when running on Lambda, letting Lambda Function URL handle CORS exclusively.

## Fixing the Issues

### Step 1: Update Lambda Function URL CORS Configuration

Run one of these scripts (depending on your OS):

**Linux/Mac:**
```bash
cd backend
chmod +x update_lambda_cors.sh
./update_lambda_cors.sh
```

**Windows (PowerShell):**
```powershell
cd backend
.\update_lambda_cors.ps1
```

**Or manually via AWS CLI:**
```bash
aws lambda update-function-url-config \
    --function-name di-aza-backend \
    --cors '{
        "AllowCredentials": false,
        "AllowHeaders": [
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With"
        ],
        "AllowMethods": [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS",
            "PATCH"
        ],
        "AllowOrigins": ["*"],
        "ExposeHeaders": [],
        "MaxAge": 86400
    }'
```

**Important**: Replace `di-aza-backend` with your actual Lambda function name.

### Step 2: Verify Backend Code Changes

The backend code (`backend/main.py`) has been updated to:
- Detect when running on Lambda (checks for `AWS_LAMBDA_FUNCTION_NAME` environment variable)
- Disable FastAPI CORS middleware when on Lambda (to avoid duplicate headers)
- Keep CORS middleware enabled for local development

### Step 3: Wait for Propagation

After updating the Lambda Function URL CORS configuration:
1. Wait 1-2 minutes for changes to propagate
2. Clear your browser cache or use incognito mode
3. Test the requests again

## Testing

After applying the fixes, test these endpoints:

1. **Analytics Event (POST with Content-Type header):**
   ```bash
   curl -X POST https://YOUR_LAMBDA_URL/api/public/analytics/event \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:5173" \
     -d '{"test": "data"}'
   ```

2. **S3 Images (GET request):**
   ```bash
   curl -X GET "https://YOUR_LAMBDA_URL/api/public/s3/images?folder_path=beula/" \
     -H "Origin: http://localhost:5173"
   ```

## Common Issues

### Still seeing duplicate headers?
- Verify Lambda Function URL CORS is configured (not just FastAPI)
- Check that `AWS_LAMBDA_FUNCTION_NAME` environment variable is set in Lambda
- Clear browser cache completely

### Still seeing Content-Type blocked?
- Verify `Content-Type` is explicitly listed in `AllowHeaders` (not just `["*"]`)
- Check that the Lambda Function URL CORS update was successful
- Wait a few minutes for propagation

### Local development works but Lambda doesn't?
- This is expected - local uses FastAPI CORS, Lambda uses Function URL CORS
- Make sure Lambda Function URL CORS is properly configured
- The backend automatically switches between the two modes

## Additional Resources

- [AWS Lambda Function URL CORS Documentation](https://docs.aws.amazon.com/lambda/latest/dg/urls-configuration.html)
- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)


