"""
AWS Lambda handler for FastAPI application using Mangum.
"""
from mangum import Mangum
from main import app

# Create the Mangum ASGI adapter
handler = Mangum(app, lifespan="off")

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
