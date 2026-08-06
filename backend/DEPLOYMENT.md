# AWS Lambda Deployment Guide

This guide explains how to deploy the Di-Aza Studio backend to AWS Lambda using Docker containers.

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Docker** installed and running
3. **AWS Account** with Lambda and ECR permissions

## Required AWS Permissions

Your AWS user/role needs the following permissions:
- `lambda:UpdateFunctionCode`
- `ecr:CreateRepository`
- `ecr:DescribeRepositories`
- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:BatchGetImage`
- `ecr:InitiateLayerUpload`
- `ecr:UploadLayerPart`
- `ecr:CompleteLayerUpload`
- `ecr:PutImage`

## Deployment Steps

### 1. Configure AWS CLI
```bash
aws configure
```

### 2. Create Lambda Function (First Time Only)
```bash
aws lambda create-function \
    --function-name di-aza-backend \
    --package-type Image \
    --code ImageUri=YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/di-aza-backend:latest \
    --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-execution-role \
    --timeout 30 \
    --memory-size 1024
```

### 3. Deploy Using Scripts

#### Windows (PowerShell):
```powershell
.\deploy.ps1
```

#### Linux/Mac (Bash):
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Manual Deployment (Alternative)

```bash
# Build image
docker build -t di-aza-backend:latest .

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create repository
aws ecr create-repository --repository-name di-aza-backend --region us-east-1

# Tag and push
docker tag di-aza-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/di-aza-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/di-aza-backend:latest

# Update Lambda
aws lambda update-function-code \
    --function-name di-aza-backend \
    --image-uri YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/di-aza-backend:latest
```

## Environment Variables

Set these in your Lambda function configuration:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# CORS (if needed)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Lambda Configuration

### Recommended Settings:
- **Memory**: 1024 MB (minimum for FastAPI)
- **Timeout**: 30 seconds
- **Architecture**: x86_64

### Function URL (Required for CORS):
```bash
# Create or update Lambda Function URL CORS configuration
# IMPORTANT: Explicitly list headers instead of using "*" to avoid CORS issues
aws lambda update-function-url-config \
    --function-name di-aza-backend \
    --auth-type NONE \
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

**Note**: The FastAPI CORS middleware is automatically disabled when running on Lambda to avoid duplicate CORS headers. Lambda Function URL handles CORS at the infrastructure level.

## Testing

After deployment, test your API:

```bash
# Health check
curl https://YOUR_LAMBDA_URL/health

# API docs
curl https://YOUR_LAMBDA_URL/docs
```

## Troubleshooting

### Common Issues:

1. **Import Errors**: Ensure all dependencies are in `requirements.txt`
2. **Timeout**: Increase Lambda timeout for database operations
3. **Memory**: Increase memory if you get out-of-memory errors
4. **CORS**: Configure CORS properly for your frontend domain

### Logs:
```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/di-aza-backend
aws logs tail /aws/lambda/di-aza-backend --follow
```

## Cost Optimization

- Use **Provisioned Concurrency** only if needed
- Set appropriate **memory allocation**
- Monitor **CloudWatch** for performance metrics
- Consider **API Gateway** for additional features

## Security Notes

- Never commit AWS credentials to code
- Use **IAM roles** instead of access keys when possible
- Enable **VPC** if database is in private subnet
- Configure **CORS** properly for production
