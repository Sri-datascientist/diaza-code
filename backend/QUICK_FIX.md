# Quick Fix - No Scripts Needed

## Option 1: AWS Console (Recommended - Easiest)

### Remove Invalid Credentials:
1. AWS Console → Lambda → `diaz` function
2. Configuration → Environment variables
3. **Delete**: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
4. **Save**

### Add S3 Permissions:
1. Lambda → `diaz` → Configuration → Permissions
2. Click the **Execution role** name
3. **Add permissions** → **Create inline policy** → **JSON** tab
4. Copy/paste contents from `s3-policy.json`
5. Name: `S3AccessPolicy` → **Create**

**Done!** Redeploy your Lambda function.

---

## Option 2: AWS CLI Commands (Copy & Paste)

### Step 1: Remove Invalid Credentials
```bash
aws lambda update-function-configuration \
  --function-name diaz \
  --region ap-south-1 \
  --environment file://lambda-env-clean.json
```

### Step 2: Add S3 Policy to IAM Role
```bash
# Get role name
ROLE_NAME=$(aws lambda get-function-configuration --function-name diaz --region ap-south-1 --query 'Role' --output text | awk -F'/' '{print $2}')

# Add inline policy
aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name S3AccessPolicy \
  --policy-document file://s3-policy.json
```

**Done!** Redeploy your Lambda function.

---

## Option 3: Just Redeploy (If IAM Role Already Has Permissions)

If your Lambda execution role already has S3 permissions, you just need to:
1. **Redeploy** your Lambda function with the updated code
2. The code now uses IAM role instead of explicit credentials

---

## Verify It Works

1. Wait 1-2 minutes
2. Test: `GET /api/public/s3/images?folder_path=beula/`
3. Check CloudWatch logs - should see: `[S3] Using IAM role credentials`

