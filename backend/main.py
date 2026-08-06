from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import time
import logging
from contextlib import asynccontextmanager

from database import engine
from models import Base
from routers import public, admin
from config import settings
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting up FastAPI application...")
    
    # Create database tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down FastAPI application...")

# Create FastAPI app
app = FastAPI(
    title="Di-Aza Studio API",
    description="FastAPI backend for Di-Aza Studio website",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
# Check if running on Lambda (Lambda Function URL handles CORS separately)
# When using Lambda Function URL, disable FastAPI CORS to avoid duplicate headers
# Check multiple Lambda environment variables for better detection
is_lambda = (
    os.environ.get("AWS_LAMBDA_FUNCTION_NAME") is not None or
    os.environ.get("AWS_EXECUTION_ENV") is not None or
    os.environ.get("LAMBDA_TASK_ROOT") is not None
)

if not is_lambda:
    # Only add CORS middleware when running locally
    # Lambda Function URL handles CORS at the infrastructure level
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins
        allow_credentials=False,  # Must be False when using "*"
        allow_methods=["*"],  # Allow all HTTP methods
        allow_headers=["*"],  # Allow all headers
        expose_headers=["*"],  # Expose all headers
    )
    logger.info("Running locally - FastAPI CORS middleware enabled")
else:
    # On Lambda, Lambda Function URL handles CORS exclusively
    logger.info("Running on Lambda - CORS handled by Lambda Function URL, FastAPI CORS disabled")

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure this properly for production
)

# Middleware to remove CORS headers on Lambda (prevent duplicates)
@app.middleware("http")
async def remove_cors_on_lambda(request: Request, call_next):
    """Remove CORS headers on Lambda to prevent duplicates with Lambda Function URL."""
    response = await call_next(request)
    
    # If running on Lambda, remove any CORS headers that might have been added
    # Lambda Function URL will add them at the infrastructure level
    if is_lambda:
        cors_headers = [
            "access-control-allow-origin",
            "access-control-allow-credentials",
            "access-control-allow-methods",
            "access-control-allow-headers",
            "access-control-expose-headers",
            "access-control-max-age",
        ]
        # Remove headers case-insensitively
        headers_to_remove = []
        for key in response.headers.keys():
            if key.lower() in cors_headers:
                headers_to_remove.append(key)
        for header in headers_to_remove:
            del response.headers[header]
    
    return response

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests."""
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Calculate processing time
    process_time = time.time() - start_time
    
    # Log API requests
    if request.url.path.startswith("/api"):
        log_line = f"{request.method} {request.url.path} {response.status_code} in {process_time:.3f}s"
        
        # Truncate long log lines
        if len(log_line) > 80:
            log_line = log_line[:79] + "…"
        
        logger.info(log_line)
    
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    # Don't add CORS headers here - Lambda Function URL or CORS middleware handles it
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"}
    )

# Include routers
app.include_router(public.router)
app.include_router(admin.router)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Di-Aza Studio API is running"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Di-Aza Studio API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
