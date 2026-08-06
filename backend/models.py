from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(VARCHAR(255), unique=True, nullable=False)
    password = Column(Text, nullable=False)  # stored as plain text
    email = Column(VARCHAR(255), unique=True, nullable=False)
    role = Column(VARCHAR(50), nullable=False, default="editor")  # super_admin, editor, analyst
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    assigned_leads = relationship("ContactLead", back_populates="assigned_admin")
    uploaded_assets = relationship("MediaAsset", back_populates="uploader")

class ContactLead(Base):
    __tablename__ = "contact_leads"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(VARCHAR(255), nullable=False)
    last_name = Column(VARCHAR(255), nullable=False)
    email = Column(VARCHAR(255), nullable=False)
    subject = Column(VARCHAR(500), nullable=False)
    queries = Column(Text, nullable=False)
    status = Column(VARCHAR(50), nullable=False, default="new")  # new, contacted, in_progress, closed
    source = Column(VARCHAR(100), default="website")
    assigned_to = Column(VARCHAR(36), ForeignKey("admin_users.id", ondelete="SET NULL"))
    notes = Column(Text)
    responded_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    assigned_admin = relationship("AdminUser", back_populates="assigned_leads")

class ProjectCategory(Base):
    __tablename__ = "project_categories"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(VARCHAR(255), unique=True, nullable=False)  # "Residential", "Commercial", "Hospitality"
    slug = Column(VARCHAR(100), unique=True, nullable=False)  # "residential", "commercial", "hospitality"
    description = Column(Text)
    display_order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    projects = relationship("Project", back_populates="category")
    portfolio_items = relationship("PortfolioItem", back_populates="category")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_id = Column(VARCHAR(36), ForeignKey("project_categories.id", ondelete="CASCADE"))
    name = Column(VARCHAR(255), nullable=False)  # "Anushka Site", "Sangamitra", etc.
    slug = Column(VARCHAR(100), unique=True, nullable=False)  # "anushka-site", "sangamitra", etc.
    description = Column(Text)
    client_name = Column(VARCHAR(255))
    project_type = Column(VARCHAR(100))  # "Full Home", "Kitchen", "Living Room", etc.
    location = Column(VARCHAR(255))
    year = Column(Integer)
    is_hero = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    category = relationship("ProjectCategory", back_populates="projects")

class RoomType(Base):
    __tablename__ = "room_types"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(VARCHAR(255), unique=True, nullable=False)  # "Living Room", "Kitchen", "Master Bedroom", etc.
    slug = Column(VARCHAR(100), unique=True, nullable=False)  # "living-room", "kitchen", "master-bedroom", etc.
    description = Column(Text)
    display_order = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships

class PortfolioItem(Base):
    __tablename__ = "portfolio_items"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_id = Column(VARCHAR(36), ForeignKey("project_categories.id", ondelete="CASCADE"))
    title = Column(VARCHAR(500), nullable=False)  # "Modern Living Room", "Contemporary Kitchen", etc.
    description = Column(Text)
    is_hero = Column(Boolean, default=False)
    display_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    category = relationship("ProjectCategory", back_populates="portfolio_items")
    media = relationship("MediaAsset", back_populates="portfolio_item")

class MediaAsset(Base):
    __tablename__ = "media_assets"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    portfolio_item_id = Column(VARCHAR(36), ForeignKey("portfolio_items.id", ondelete="CASCADE"))
    file_name = Column(VARCHAR(500), nullable=False)  # "DSC03315.JPG", "living-room-1.jpg"
    file_type = Column(VARCHAR(100), nullable=False)  # "image/jpeg", "image/png", "video/mp4"
    storage_path = Column(Text)  # Storage path
    width = Column(Integer)
    height = Column(Integer)
    size_bytes = Column(Integer)
    uploaded_by = Column(VARCHAR(36), ForeignKey("admin_users.id", ondelete="SET NULL"))
    alt_text = Column(Text)  # Alt text for accessibility
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    # Relationships
    portfolio_item = relationship("PortfolioItem", back_populates="media")
    uploader = relationship("AdminUser", back_populates="uploaded_assets")

class SeoMetadata(Base):
    __tablename__ = "seo_metadata"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    route_path = Column(VARCHAR(500), unique=True, nullable=False)  # /, /about, /contact, etc
    title = Column(VARCHAR(500), nullable=False)
    meta_description = Column(Text)
    og_title = Column(VARCHAR(500))
    og_description = Column(Text)
    og_image_asset_id = Column(VARCHAR(36), ForeignKey("media_assets.id", ondelete="SET NULL"))
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    occurred_at = Column(DateTime, default=func.now(), nullable=False)
    session_id = Column(VARCHAR(255), nullable=False)
    visitor_id = Column(VARCHAR(255), nullable=False)  # hashed identifier
    route = Column(VARCHAR(500), nullable=False)
    referrer = Column(Text)
    user_agent = Column(Text)
    event_type = Column(VARCHAR(100), nullable=False, default="page_view")  # page_view, click, etc
    event_metadata = Column(Text)

class AnalyticsSession(Base):
    __tablename__ = "analytics_sessions"
    
    session_id = Column(VARCHAR(255), primary_key=True)
    first_seen = Column(DateTime, default=func.now(), nullable=False)
    last_seen = Column(DateTime, default=func.now(), nullable=False)
    page_view_count = Column(Integer, default=0)
    visitor_id = Column(VARCHAR(255), nullable=False)

class AnalyticsAggregate(Base):
    __tablename__ = "analytics_aggregates"
    
    id = Column(VARCHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    date = Column(VARCHAR(10), nullable=False)  # YYYY-MM-DD
    route = Column(VARCHAR(500), nullable=False)
    views = Column(Integer, default=0)
    unique_visitors = Column(Integer, default=0)
    bounce_rate = Column(Integer, default=0)
