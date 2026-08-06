from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import ContactLead, AnalyticsEvent, AnalyticsSession
from schemas import ContactLeadCreate, AnalyticsEventCreate, MessageResponse, S3ImageResponse, S3ProjectsResponse, S3RoomTypesResponse
from s3_service import S3Service
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Create S3Service instance
s3_service = S3Service()

router = APIRouter(prefix="/api/public", tags=["public"])

@router.post("/contact", response_model=MessageResponse)
async def create_contact_lead(
    contact_data: ContactLeadCreate,
    db: Session = Depends(get_db)
):
    """Create a new contact lead."""
    try:
        # Create new contact lead
        db_lead = ContactLead(
            first_name=contact_data.first_name,
            last_name=contact_data.last_name,
            email=contact_data.email,
            subject=contact_data.subject,
            queries=contact_data.queries,
            status="new",
            source="website"
        )
        
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        
        return MessageResponse(message="Contact lead created successfully")
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.post("/analytics/event")
async def track_analytics_event(event_data: dict):
    """Track an analytics event."""
    try:
        # Simple endpoint that just returns the received data
        return {"message": "Analytics event received", "data": event_data}
        
    except Exception as e:
        logger.error(f"Analytics event error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/s3/images", response_model=S3ImageResponse)
async def get_s3_images(folder_path: Optional[str] = None):
    """Get images from S3 folder."""
    try:
        # FastAPI may decode + to spaces in query params, so we need to convert back
        # If folder_path has spaces, convert them to + (S3 uses + not spaces)
        if folder_path:
            # Replace spaces with + signs (S3 object keys use + for spaces)
            folder_path = folder_path.replace(' ', '+')
            logger.info(f"[API] Received folder_path: {folder_path}")
        
        logger.info(f"[API] Calling S3 service to list images from folder: {folder_path}")
        images = s3_service.list_images_from_folder(folder_path)
        logger.info(f"[API] Successfully retrieved {len(images)} images from S3")
        return S3ImageResponse(images=images)
    except Exception as e:
        error_msg = f"Error fetching images: {str(e)}"
        logger.error(f"[API] Error getting S3 images: {error_msg}", exc_info=True)
        # Include more details in the error response for debugging
        import traceback
        logger.error(f"[API] Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_msg
        )

@router.get("/s3/projects", response_model=S3ProjectsResponse)
async def get_s3_projects():
    """Get all projects from S3."""
    try:
        projects = s3_service.get_s3_projects()
        return S3ProjectsResponse(projects=projects)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/s3/projects/{project_name}/rooms", response_model=S3RoomTypesResponse)
async def get_s3_room_types(project_name: str):
    """Get room types for a specific project."""
    try:
        room_types = s3_service.get_s3_room_types(project_name)
        return S3RoomTypesResponse(room_types=room_types)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/s3/image/{s3_key}")
async def get_s3_image(s3_key: str):
    """Get specific image from S3."""
    try:
        image_data = s3_service.get_s3_image(s3_key)
        return image_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/s3/debug")
async def debug_s3():
    """Debug endpoint to see what's actually in the S3 bucket."""
    try:
        debug_data = s3_service.debug_s3_bucket()
        return debug_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/debug/tables")
async def debug_tables(db: Session = Depends(get_db)):
    """Debug endpoint to check database tables."""
    try:
        # Get all table names
        result = db.execute("SHOW TABLES")
        tables = [row[0] for row in result.fetchall()]
        return {"tables": tables}
    except Exception as e:
        logger.error(f"Debug tables error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
