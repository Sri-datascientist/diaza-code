# Manual Fix for Lambda S3 Access (No Scripts Required)

## Problem
Lambda is using invalid AWS credentials (`InvalidAccessKeyId` error). We need to:
1. Remove invalid credentials from Lambda environment variables
2. Ensure Lambda IAM role has S3 permissions

## Solution 1: Using AWS Console (Easiest)

### Step 1: Remove Invalid Credentials from Lambda

1. Go to **AWS Console** → **Lambda** → **Functions**
2. Click on your function: **`diaz`**
3. Go to **Configuration** tab → **Environment variables**
4. **Delete** these variables if they exist:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
5. **Keep** these variables (or add if missing):
   - `S3_BUCKET_NAME` = `jgi-menteetrackers`
   - `AWS_REGION` = `ap-south-1`
   - `DATABASE_URL` = `YOUR_DATABASE_URL`
   - `SECRET_KEY` = `di-aza-studio-secret-key-change-in-production`
   - `ALGORITHM` = `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` = `10080`
6. Click **Save**

### Step 2: Add S3 Permissions to Lambda IAM Role

1. Go to **AWS Console** → **Lambda** → **Functions** → **`diaz`**
2. Go to **Configuration** tab → **Permissions**
3. Click on the **Execution role** name (e.g., `diaz-role-twng8jxf`)
4. This opens the IAM role in a new tab
5. Click **Add permissions** → **Create inline policy**
6. Click **JSON** tab and paste this:

```json
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
        "arn:aws:s3:::jgi-menteetrackers",
        "arn:aws:s3:::jgi-menteetrackers/*"
      ]
    }
  ]
}
```

7. Click **Next**
8. Name it: `S3AccessPolicy`
9. Click **Create policy**

### Step 3: Redeploy Lambda Function

After updating the code (which now uses IAM role), redeploy your Lambda function.

## Solution 2: Using AWS CLI Commands (Direct)

### Remove Invalid Credentials

```bash
# Get current environment variables
aws lambda get-function-configuration --function-name diaz --region ap-south-1 --query 'Environment.Variables' > current-env.json

# Edit the JSON file to remove AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
# Then update Lambda:
aws lambda update-function-configuration \
  --function-name diaz \
  --region ap-south-1 \
  --environment file://updated-env.json
```

### Add S3 Policy to IAM Role

```bash
# Get the role name
ROLE_NAME=$(aws lambda get-function-configuration --function-name diaz --region ap-south-1 --query 'Role' --output text | cut -d'/' -f2)

# Create inline policy
aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name S3AccessPolicy \
  --policy-document file://s3-policy.json
```

Where `s3-policy.json` contains:
```json
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
        "arn:aws:s3:::jgi-menteetrackers",
        "arn:aws:s3:::jgi-menteetrackers/*"
      ]
    }
  ]
}
```

## Solution 3: Update Code to Handle Missing Credentials Better

The code has already been updated to:
- Use IAM role on Lambda (no explicit credentials needed)
- Fall back gracefully if credentials are missing
- Provide better error messages

Just **redeploy your Lambda function** with the updated code.

## Verification

After making changes:

1. Wait 1-2 minutes for changes to propagate
2. Test the endpoint: `GET /api/public/s3/images?folder_path=beula/`
3. Check CloudWatch logs - you should see:
   - `[S3] Using IAM role credentials (Lambda execution role)`
   - No `InvalidAccessKeyId` errors

## Quick Checklist

- [ ] Removed `AWS_ACCESS_KEY_ID` from Lambda environment variables
- [ ] Removed `AWS_SECRET_ACCESS_KEY` from Lambda environment variables
- [ ] Added S3 permissions to Lambda execution role
- [ ] Redeployed Lambda function with updated code
- [ ] Tested S3 endpoint

