# Add Environment Variables to Lambda

Since your environment variables are empty, you need to add the required ones.

## Step 1: Add Environment Variables in AWS Console

1. In the **Environment variables** section, click the **Edit** button
2. Click **Add environment variable** for each of these:

### Required Variables:

| Key | Value |
|-----|-------|
| `S3_BUCKET_NAME` | `jgi-menteetrackers` |
| `AWS_REGION` | `ap-south-1` |
| `DATABASE_URL` | `YOUR_DATABASE_URL` |
| `SECRET_KEY` | `di-aza-studio-secret-key-change-in-production` |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` |

### ⚠️ Important:
- **DO NOT** add `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`
- The code will use IAM role for S3 access (more secure)

3. Click **Save**

## Step 2: Verify IAM Role Has S3 Permissions

1. Go to **Configuration** → **Permissions**
2. Click on the **Execution role** name
3. Check if there's a policy with S3 permissions
4. If not, add one (see below)

## Step 3: Add S3 Permissions (If Missing)

1. In the IAM role page, click **Add permissions** → **Create inline policy**
2. Click **JSON** tab
3. Paste this policy:

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

4. Click **Next**
5. Name: `S3AccessPolicy`
6. Click **Create policy**

## Step 4: Redeploy Lambda Function

After adding environment variables and ensuring IAM permissions:
1. Redeploy your Lambda function with the updated code
2. Wait 1-2 minutes
3. Test the S3 endpoint

## Quick Checklist

- [ ] Added `S3_BUCKET_NAME` environment variable
- [ ] Added `AWS_REGION` environment variable  
- [ ] Added other required variables (DATABASE_URL, SECRET_KEY, etc.)
- [ ] **Did NOT** add AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY
- [ ] Verified/added S3 permissions to IAM role
- [ ] Redeployed Lambda function
- [ ] Tested S3 endpoint

