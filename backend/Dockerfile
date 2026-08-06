FROM public.ecr.aws/lambda/python:3.11

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy requirements first for better layer caching
COPY requirements.txt ${LAMBDA_TASK_ROOT}/

# Install Python packages
# Lambda Python images have dependencies installed to /var/runtime and /var/lang/lib/python3.11/site-packages
# We install to the task root so they're available to the Lambda function
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt && \
    pip list

# Copy the application code
COPY . ${LAMBDA_TASK_ROOT}/

# Verify installation
RUN python -c "import fastapi; import mangum; import sqlalchemy; import boto3; print('Dependencies verified successfully')"

# Set the CMD to your Lambda handler
CMD ["lambda_handler.handler"]