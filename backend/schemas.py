from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Base schemas
class ContactLeadBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    subject: str
    queries: str

class ContactLeadCreate(ContactLeadBase):
    pass

class ContactLeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    assigned_to: Optional[str] = None
    responded_at: Optional[datetime] = None

class ContactLead(ContactLeadBase):
    id: str
    status: str
    source: str
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    responded_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Admin User schemas
class AdminUserBase(BaseModel):
    username: str
    email: EmailStr
    role: str = "editor"

class AdminUserCreate(AdminUserBase):
    password: str

class AdminUser(AdminUserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Authentication schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Project Category schemas
class ProjectCategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class ProjectCategoryCreate(ProjectCategoryBase):
    pass

class ProjectCategory(ProjectCategoryBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    project_type: Optional[str] = None
    location: Optional[str] = None
    year: Optional[int] = None
    is_hero: bool = False
    is_active: bool = True
    display_order: int = 0

class ProjectCreate(ProjectBase):
    category_id: Optional[str] = None

class Project(ProjectBase):
    id: str
    category_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Room Type schemas
class RoomTypeBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class RoomTypeCreate(RoomTypeBase):
    pass

class RoomType(RoomTypeBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Portfolio Item schemas
class PortfolioItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    s3_path: Optional[str] = None
    is_hero: bool = False
    is_active: bool = True
    display_order: int = 0

class PortfolioItemCreate(PortfolioItemBase):
    project_id: Optional[str] = None
    room_type_id: Optional[str] = None

class PortfolioItem(PortfolioItemBase):
    id: str
    project_id: Optional[str] = None
    room_type_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Media Asset schemas
class MediaAssetBase(BaseModel):
    file_name: str
    original_file_name: Optional[str] = None
    file_type: str
    s3_url: str
    s3_key: str
    s3_bucket: str = "jgi-menteetracker"
    width: Optional[int] = None
    height: Optional[int] = None
    size_bytes: Optional[int] = None
    is_edited: bool = False
    is_thumbnail: bool = False
    is_hero: bool = False
    alt_text: Optional[str] = None
    caption: Optional[str] = None

class MediaAssetCreate(MediaAssetBase):
    portfolio_item_id: Optional[str] = None

class MediaAsset(MediaAssetBase):
    id: str
    portfolio_item_id: Optional[str] = None
    uploaded_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# SEO Metadata schemas
class SeoMetadataBase(BaseModel):
    route_path: str
    title: str
    meta_description: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image_asset_id: Optional[str] = None

class SeoMetadataCreate(SeoMetadataBase):
    pass

class SeoMetadata(SeoMetadataBase):
    id: str
    updated_at: datetime

    class Config:
        from_attributes = True

# Analytics schemas
class AnalyticsEventBase(BaseModel):
    session_id: str
    visitor_id: str
    route: str
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    event_type: str = "page_view"
    event_metadata: Optional[Dict[str, Any]] = None

class AnalyticsEventCreate(AnalyticsEventBase):
    pass

class AnalyticsEvent(AnalyticsEventBase):
    id: str
    occurred_at: datetime

    class Config:
        from_attributes = True

# S3 schemas
class S3Image(BaseModel):
    id: str
    name: str
    s3_key: str
    s3_url: str
    file_name: str
    file_type: str
    size: int
    last_modified: Optional[datetime] = None
    project: str
    room_type: str
    is_edited: bool
    base_file_name: str

class S3ImageResponse(BaseModel):
    images: List[S3Image]

class S3ProjectsResponse(BaseModel):
    projects: List[str]

class S3RoomTypesResponse(BaseModel):
    room_types: List[str]

# Response schemas
class MessageResponse(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    message: str
    errors: Optional[List[Dict[str, Any]]] = None

# Analytics Summary schemas
class AnalyticsSummary(BaseModel):
    total_page_views: int
    unique_visitors: int
    active_sessions: int
    top_pages: List[Dict[str, Any]]
    period: Dict[str, str]

class AnalyticsSummaryResponse(BaseModel):
    summary: AnalyticsSummary
