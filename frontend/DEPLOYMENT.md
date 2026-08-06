# Frontend Deployment Guide

This guide explains how to deploy the Di-Aza Studio frontend with the AWS Lambda backend.

## Backend Configuration

The frontend is configured to use the AWS Lambda function URL as the backend:

**Backend URL**: `https://qspymodxjflkq236wpddyjh7ey0vqztx.lambda-url.ap-south-1.on.aws`

This URL is hardcoded in the application, so no environment variables are needed.

## Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Deployment Options

### 1. Static Hosting (Netlify, Vercel, GitHub Pages)

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting platform

3. **No environment variables needed** - the Lambda URL is hardcoded

### 2. AWS S3 + CloudFront

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** to serve from S3

### 3. Docker Deployment

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run:**
   ```bash
   docker build -t di-aza-frontend .
   docker run -p 80:80 di-aza-frontend
   ```

## Configuration Details

### Vite Configuration
- **Simplified Configuration**: No environment variables needed
- **No Proxy**: Direct API calls to Lambda URL
- **Build**: Optimized for production with source maps

### API Integration
- **Hardcoded Lambda URL**: Always uses the deployed Lambda function
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Automatic redirect to login on 401 errors

## Testing

### Local Development
```bash
# Start frontend (connects directly to Lambda)
npm run dev
```

### Production Testing
```bash
# Build and preview
npm run build
npm run preview
```

## Troubleshooting

### Common Issues:

1. **API calls failing**: Check if Lambda function is running and accessible
2. **CORS errors**: Ensure Lambda function has proper CORS configuration
3. **Build failures**: Check if all dependencies are properly installed
4. **Authentication issues**: Verify JWT token handling in localStorage

### API URL Debugging:
```javascript
// Add this to any component to debug
console.log('API Base URL:', 'https://qspymodxjflkq236wpddyjh7ey0vqztx.lambda-url.ap-south-1.on.aws');
```

## Security Notes

- **Hardcoded URL**: The Lambda URL is hardcoded and publicly accessible
- **API Keys**: Never put sensitive API keys in frontend code
- **CORS**: Configure Lambda function to only allow your domain in production
- **HTTPS**: Always use HTTPS in production
