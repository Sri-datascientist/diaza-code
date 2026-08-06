# Docker and ECR Commands

Quick reference for building and pushing Docker images to ECR.

## Configuration
- **Account ID**: `474833638797`
- **Region**: `ap-south-1`
- **Repository**: `diaz`
- **ECR URI**: `474833638797.dkr.ecr.ap-south-1.amazonaws.com`

## Quick Commands (Copy & Paste)

### Option 1: Use the Script (Recommended)

**PowerShell (Windows):**
```powershell
cd backend
.\build-and-push-ecr.ps1
```

**Bash (Linux/Mac):**
```bash
cd backend
chmod +x build-and-push-ecr.sh
./build-and-push-ecr.sh
```

### Option 2: Manual Commands

#### Step 1: Build Docker Image
```bash
docker build -t diaz:latest .
```

#### Step 2: Login to ECR
```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com
```

#### Step 3: Create ECR Repository (if doesn't exist)
```bash
aws ecr create-repository --repository-name diaz --region ap-south-1
```

#### Step 4: Tag Image for ECR
```bash
docker tag diaz:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest
```

#### Step 5: Push Image to ECR
```bash
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest
```

## Update Lambda Function

After pushing the image, update your Lambda function:

```bash
aws lambda update-function-code \
  --function-name diaz \
  --image-uri 474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest \
  --region ap-south-1
```

## One-Liner (All Steps)

**PowerShell:**
```powershell
cd backend; docker build -t diaz:latest .; aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com; aws ecr describe-repositories --repository-names diaz --region ap-south-1 2>$null || aws ecr create-repository --repository-name diaz --region ap-south-1; docker tag diaz:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest; docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest
```

**Bash:**
```bash
cd backend && \
docker build -t diaz:latest . && \
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 474833638797.dkr.ecr.ap-south-1.amazonaws.com && \
aws ecr describe-repositories --repository-names diaz --region ap-south-1 2>/dev/null || aws ecr create-repository --repository-name diaz --region ap-south-1 && \
docker tag diaz:latest 474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest && \
docker push 474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest
```

## Troubleshooting

### Error: "Repository does not exist"
Run Step 3 to create the repository first.

### Error: "Unable to locate credentials"
Make sure AWS CLI is configured:
```bash
aws configure
```

### Error: "denied: Your authorization token has expired"
Re-run the ECR login command (Step 2).

### Error: "Cannot connect to Docker daemon"
Make sure Docker is running:
```bash
# Windows
# Start Docker Desktop

# Linux
sudo systemctl start docker
```

## Image URI Format

```
474833638797.dkr.ecr.ap-south-1.amazonaws.com/diaz:latest
```

Use this URI when updating Lambda function code.

