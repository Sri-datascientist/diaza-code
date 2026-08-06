# Lambda S3 Access Fix Guide

## Problem
S3 images work locally but fail on Lambda with 500 errors.

## Root Causes
1. **Environment Variables**: May not be set correctly on Lambda
2. **IAM Permissions**: Lambda execution role may lack S3 permissions
3. **Credential Handling**: Different behavior between local and Lambda environments

## Solutions Applied

### 1. Improved S3 Service Initialization
- Enhanced Lambda detection
- Better credential handling (IAM role vs explicit credentials)
- Improved logging for debugging
- Connection testing on initialization

### 2. Better Configuration Handling
- Improved environment variable loading
- Support for both IAM role and explicit credentials
- Better fallback mechanisms

### 3. Enhanced Error Messages
- More descriptive error messages
- Better error codes (AccessDenied, NoSuchBucket, etc.)
- Detailed logging for CloudWatch

## Fix Steps

### Step 1: Diagnose the Issue
```powershell
cd backend
.\diagnose-lambda-s3.ps1
```

This will show:
- Current environment variables
- IAM role and permissions
- Missing configurations

### Step 2: Fix Configuration
```powershell
cd backend
.\fix-lambda-s3.ps1
```

This will:
- Set all required environment variables
- Create/update S3 access IAM policy
- Attach policy to Lambda execution role

### Step 3: Update CORS (if needed)
```powershell
cd backend
.\update_lambda_cors.ps1
```

### Step 4: Verify
1. Wait 1-2 minutes for changes to propagate
2. Test the endpoint: `GET /api/public/s3/images?folder_path=beula/`
3. Check CloudWatch logs for detailed error messages
4. Use debug endpoint: `GET /api/public/s3/debug`

## Debugging

### Check CloudWatch Logs
1. Go to AWS Console → CloudWatch → Log Groups
2. Find `/aws/lambda/diaz`
3. Look for `[S3]` prefixed log messages
4. Check for error messages and stack traces

### Test Endpoints
- **Debug S3**: `GET /api/public/s3/debug` - Shows bucket contents
- **List Images**: `GET /api/public/s3/images?folder_path=beula/`
- **List Projects**: `GET /api/public/s3/projects`

### Common Issues

#### Issue: "Access Denied"
**Solution**: Lambda execution role needs S3 permissions
```powershell
.\setup-lambda-iam.ps1
```

#### Issue: "Bucket not found"
**Solution**: Check S3_BUCKET_NAME environment variable matches exactly
```powershell
.\fix-lambda-s3.ps1
```

#### Issue: "No credentials"
**Solution**: Either set AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or ensure IAM role has permissions
```powershell
.\fix-lambda-s3.ps1
```

## Environment Variables Required

On Lambda, these must be set:
- `AWS_DEFAULT_REGION` = "ap-south-1"
- `S3_BUCKET_NAME` = "jgi-menteetrackers"
- `AWS_ACCESS_KEY_ID` = (your access key)
- `AWS_SECRET_ACCESS_KEY` = (your secret key)

OR use IAM role with S3 permissions (more secure).

## IAM Permissions Required

The Lambda execution role needs:
```json
{
  "Effect": "Allow",
  "Action": [
    "s3:GetObject",
    "s3:ListBucket",
    "s3:GetObjectVersion",
    "s3:GetBucketLocation"
  ],
  "Resource": [
    "arn:aws:s3:::jgi-menteetrackers",
    "arn:aws:s3:::jgi-menteetrackers/*"
  ]
}
```

## After Fixing

1. **Redeploy** the Lambda function (if code changed)
2. **Wait** 1-2 minutes for propagation
3. **Test** the S3 endpoint
4. **Check** CloudWatch logs if issues persist

