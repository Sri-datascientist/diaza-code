from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, func
from datetime import datetime, timedelta
from typing import Optional, List
from database import get_db
from models import (
    AdminUser, ContactLead, ProjectCategory, Project, RoomType, 
    PortfolioItem, MediaAsset, SeoMetadata, AnalyticsEvent, AnalyticsSession
)
from schemas import (
    LoginRequest, Token, AdminUser as AdminUserSchema, ContactLead as ContactLeadSchema,
    ContactLeadUpdate, ProjectCategory as ProjectCategorySchema, ProjectCategoryCreate,
    Project as ProjectSchema, ProjectCreate, RoomType as RoomTypeSchema, RoomTypeCreate,
    PortfolioItem as PortfolioItemSchema, PortfolioItemCreate, MediaAsset as MediaAssetSchema,
    SeoMetadata as SeoMetadataSchema, SeoMetadataCreate, AnalyticsSummaryResponse,
    MessageResponse, S3ImageResponse, S3ProjectsResponse, S3RoomTypesResponse
)
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash
from s3_service import S3Service
from config import settings

# Create S3Service instance
s3_service = S3Service()

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Authentication routes
@router.post("/auth/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Admin login."""
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/me", response_model=AdminUserSchema)
async def get_current_admin_user(current_user: AdminUser = Depends(get_current_user)):
    """Get current admin user."""
    return current_user

@router.post("/auth/logout", response_model=MessageResponse)
async def logout():
    """Logout endpoint (client-side token removal)."""
    return MessageResponse(message="Logged out successfully")

@router.post("/auth/create-admin", response_model=MessageResponse)
async def create_admin_user(
    username: str = "admin",
    password: str = "admin123",
    email: str = "admin@diazastudio.com",
    db: Session = Depends(get_db)
):
    """Create the first admin user (for initial setup)."""
    # Check if any admin users exist
    existing_admin = db.query(AdminUser).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user already exists"
        )
    
    # Create new admin user
    admin_user = AdminUser(
        username=username,
        password=get_password_hash(password),  # Store as plain text
        email=email,
        role="super_admin"
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    return MessageResponse(message=f"Admin user '{username}' created successfully")

# Contact Leads Management
@router.get("/leads", response_model=List[ContactLeadSchema])
async def get_leads(
    status: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get contact leads with optional filtering."""
    query = db.query(ContactLead)
    
    if status:
        query = query.filter(ContactLead.status == status)
    if assigned_to:
        query = query.filter(ContactLead.assigned_to == assigned_to)
    
    leads = query.order_by(desc(ContactLead.created_at)).all()
    return leads

@router.patch("/leads/{lead_id}", response_model=ContactLeadSchema)
async def update_lead(
    lead_id: str,
    lead_update: ContactLeadUpdate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Update a contact lead."""
    lead = db.query(ContactLead).filter(ContactLead.id == lead_id).first()
    if not lead:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found"
        )
    
    update_data = lead_update.dict(exclude_unset=True)
    if "responded_at" in update_data and update_data["responded_at"]:
        update_data["responded_at"] = datetime.fromisoformat(update_data["responded_at"].replace('Z', '+00:00'))
    
    for field, value in update_data.items():
        setattr(lead, field, value)
    
    db.commit()
    db.refresh(lead)
    return lead

# Portfolio Items Management
@router.get("/portfolio/items", response_model=List[PortfolioItemSchema])
async def get_portfolio_items(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all portfolio items."""
    items = db.query(PortfolioItem).order_by(
        desc(PortfolioItem.display_order), 
        desc(PortfolioItem.created_at)
    ).all()
    
    # Fetch media assets for each item
    items_with_media = []
    for item in items:
        media = db.query(MediaAsset).filter(
            MediaAsset.portfolio_item_id == item.id
        ).order_by(MediaAsset.created_at).all()
        item_dict = item.__dict__.copy()
        item_dict['media'] = media
        items_with_media.append(item_dict)
    
    return items_with_media

@router.post("/portfolio/items", response_model=PortfolioItemSchema)
async def create_portfolio_item(
    item_data: PortfolioItemCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Create a new portfolio item."""
    db_item = PortfolioItem(**item_data.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/portfolio/items/{item_id}", response_model=MessageResponse)
async def delete_portfolio_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete a portfolio item."""
    item = db.query(PortfolioItem).filter(PortfolioItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    db.delete(item)
    db.commit()
    return MessageResponse(message="Portfolio item deleted successfully")

# S3 Management
@router.get("/s3/images", response_model=S3ImageResponse)
async def get_admin_s3_images(
    folder_path: Optional[str] = Query(None),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get S3 images for admin."""
    try:
        images = s3_service.list_images_from_folder(folder_path)
        return S3ImageResponse(images=images)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch S3 images"
        )

@router.get("/s3/projects", response_model=S3ProjectsResponse)
async def get_admin_s3_projects(
    current_user: AdminUser = Depends(get_current_user)
):
    """Get S3 projects for admin."""
    try:
        projects = s3_service.get_s3_projects()
        return S3ProjectsResponse(projects=projects)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch S3 projects"
        )

@router.get("/s3/projects/{project_name}/rooms", response_model=S3RoomTypesResponse)
async def get_admin_s3_room_types(
    project_name: str,
    current_user: AdminUser = Depends(get_current_user)
):
    """Get S3 room types for a project."""
    try:
        room_types = s3_service.get_s3_room_types(project_name)
        return S3RoomTypesResponse(room_types=room_types)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch S3 room types"
        )

# Media Assets Management
@router.post("/media/assets", response_model=MessageResponse)
async def create_media_asset(
    asset_data: dict,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Create a new media asset."""
    try:
        db_asset = MediaAsset(
            portfolio_item_id=asset_data.get("portfolio_item_id"),
            file_name=asset_data.get("file_name"),
            file_type=asset_data.get("file_type"),
            storage_path=asset_data.get("storage_path"),
            width=asset_data.get("width"),
            height=asset_data.get("height"),
            size_bytes=asset_data.get("size_bytes"),
            alt_text=asset_data.get("alt_text"),
            uploaded_by=current_user.id
        )
        
        db.add(db_asset)
        db.commit()
        return MessageResponse(message="Media asset created successfully")
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.delete("/media/assets/{asset_id}", response_model=MessageResponse)
async def delete_media_asset(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete a media asset."""
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media asset not found"
        )
    
    db.delete(asset)
    db.commit()
    return MessageResponse(message="Media asset deleted successfully")

# Project Categories Management
@router.get("/project-categories", response_model=List[ProjectCategorySchema])
async def get_project_categories(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all project categories."""
    categories = db.query(ProjectCategory).order_by(
        desc(ProjectCategory.display_order), 
        desc(ProjectCategory.created_at)
    ).all()
    return categories

@router.post("/project-categories", response_model=MessageResponse)
async def create_project_category(
    category_data: ProjectCategoryCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Create a new project category."""
    db_category = ProjectCategory(**category_data.dict())
    db.add(db_category)
    db.commit()
    return MessageResponse(message="Project category created successfully")

# Projects Management
@router.get("/projects", response_model=List[ProjectSchema])
async def get_projects(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all projects."""
    projects = db.query(Project).order_by(
        desc(Project.display_order), 
        desc(Project.created_at)
    ).all()
    return projects

@router.post("/projects", response_model=MessageResponse)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Create a new project."""
    db_project = Project(**project_data.dict())
    db.add(db_project)
    db.commit()
    return MessageResponse(message="Project created successfully")

# Room Types Management
@router.get("/room-types", response_model=List[RoomTypeSchema])
async def get_room_types(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all room types."""
    room_types = db.query(RoomType).order_by(
        desc(RoomType.display_order), 
        desc(RoomType.created_at)
    ).all()
    return room_types

@router.post("/room-types", response_model=MessageResponse)
async def create_room_type(
    room_type_data: RoomTypeCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Create a new room type."""
    db_room_type = RoomType(**room_type_data.dict())
    db.add(db_room_type)
    db.commit()
    return MessageResponse(message="Room type created successfully")

# Analytics
@router.get("/analytics/summary", response_model=AnalyticsSummaryResponse)
async def get_analytics_summary(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get analytics summary."""
    try:
        # Default to last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        start = datetime.fromisoformat(start_date) if start_date else thirty_days_ago
        end = datetime.fromisoformat(end_date) if end_date else datetime.utcnow()
        
        # Total page views
        total_page_views = db.query(func.count(AnalyticsEvent.id)).filter(
            and_(
                AnalyticsEvent.event_type == "page_view",
                AnalyticsEvent.occurred_at >= start,
                AnalyticsEvent.occurred_at <= end
            )
        ).scalar() or 0
        
        # Unique visitors
        unique_visitors = db.query(func.count(func.distinct(AnalyticsEvent.visitor_id))).filter(
            and_(
                AnalyticsEvent.occurred_at >= start,
                AnalyticsEvent.occurred_at <= end
            )
        ).scalar() or 0
        
        # Top pages
        top_pages = db.query(
            AnalyticsEvent.route,
            func.count(AnalyticsEvent.id).label('views')
        ).filter(
            and_(
                AnalyticsEvent.event_type == "page_view",
                AnalyticsEvent.occurred_at >= start,
                AnalyticsEvent.occurred_at <= end
            )
        ).group_by(AnalyticsEvent.route).order_by(
            desc(func.count(AnalyticsEvent.id))
        ).limit(10).all()
        
        # Active sessions (last 30 minutes)
        active_sessions = db.query(func.count(AnalyticsSession.session_id)).filter(
            AnalyticsSession.last_seen >= datetime.utcnow() - timedelta(minutes=30)
        ).scalar() or 0
        
        return AnalyticsSummaryResponse(
            summary={
                "total_page_views": total_page_views,
                "unique_visitors": unique_visitors,
                "active_sessions": active_sessions,
                "top_pages": [{"route": page.route, "views": page.views} for page in top_pages],
                "period": {
                    "start": start.isoformat(),
                    "end": end.isoformat()
                }
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# SEO Management
@router.get("/seo", response_model=List[SeoMetadataSchema])
async def get_seo_metadata(
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all SEO metadata."""
    seo_data = db.query(SeoMetadata).order_by(SeoMetadata.route_path).all()
    return seo_data

@router.put("/seo/{seo_id}", response_model=SeoMetadataSchema)
async def update_seo_metadata(
    seo_id: str,
    seo_data: SeoMetadataCreate,
    db: Session = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Update SEO metadata."""
    seo = db.query(SeoMetadata).filter(SeoMetadata.id == seo_id).first()
    if not seo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SEO metadata not found"
        )
    
    update_data = seo_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(seo, field, value)
    
    db.commit()
    db.refresh(seo)
    return seo
