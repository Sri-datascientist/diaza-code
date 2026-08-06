from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database Configuration
    database_url: str = "mysql+pymysql://admin:Mentee_tracker#2025@mentee.cr82604eu9d2.ap-south-1.rds.amazonaws.com:3306/diaz"
    
    # JWT Configuration
    secret_key: str = "di-aza-studio-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 days
    
    # AWS S3 Configuration
    # On Lambda: Use IAM role (no credentials needed)
    # Local dev: Use environment variables or .env file
    aws_access_key_id: Optional[str] = os.getenv('AWS_ACCESS_KEY_ID')  # No default - must be set for local dev
    aws_secret_access_key: Optional[str] = os.getenv('AWS_SECRET_ACCESS_KEY')  # No default - must be set for local dev
    aws_region: str = os.getenv('AWS_DEFAULT_REGION') or os.getenv('AWS_REGION') or 'ap-south-1'
    s3_bucket_name: str = os.getenv('S3_BUCKET_NAME') or 'jgi-menteetrackers'
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()
