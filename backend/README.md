# Di-Aza Studio FastAPI Backend

This is the FastAPI backend for the Di-Aza Studio website, providing a complete REST API with authentication, database management, and S3 integration.

## Features

- **FastAPI Framework**: Modern, fast web framework for building APIs
- **MySQL Database**: SQLAlchemy ORM with MySQL database
- **JWT Authentication**: Secure token-based authentication
- **AWS S3 Integration**: Image storage and management
- **Admin Panel API**: Complete admin functionality
- **Analytics Tracking**: User behavior and page view tracking
- **CORS Support**: Cross-origin resource sharing
- **Request Logging**: Comprehensive request/response logging

## Installation

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Configuration**:
   - Copy `.env.example` to `.env` (if needed)
   - Update database and AWS credentials in `config.py`

3. **Database Setup**:
   - The application will automatically create tables on startup
   - Ensure your MySQL database is accessible

## Running the Server

### Development Mode
```bash
python run.py
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The server will start on `http://localhost:8000` by default.

## API Documentation

- **Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

## API Endpoints

### Public Endpoints
- `POST /api/public/contact` - Submit contact form
- `POST /api/public/analytics/event` - Track analytics events
- `GET /api/public/s3/images` - Get S3 images
- `GET /api/public/s3/projects` - Get S3 projects
- `GET /api/public/s3/projects/{project_name}/rooms` - Get room types

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current user
- `GET /api/admin/leads` - Get contact leads
- `PATCH /api/admin/leads/{id}` - Update lead
- `GET /api/admin/portfolio/items` - Get portfolio items
- `POST /api/admin/portfolio/items` - Create portfolio item
- `DELETE /api/admin/portfolio/items/{id}` - Delete portfolio item
- `GET /api/admin/analytics/summary` - Get analytics summary
- `GET /api/admin/seo` - Get SEO metadata
- `PUT /api/admin/seo/{id}` - Update SEO metadata

## Database Models

- **AdminUser**: Admin user accounts
- **ContactLead**: Contact form submissions
- **ProjectCategory**: Project categories (Residential, Commercial, etc.)
- **Project**: Individual projects (Anushka Site, Sangamitra, etc.)
- **RoomType**: Room types (Living Room, Kitchen, etc.)
- **PortfolioItem**: Portfolio items with media
- **MediaAsset**: S3 media assets
- **SeoMetadata**: SEO metadata for pages
- **AnalyticsEvent**: User analytics events
- **AnalyticsSession**: User session tracking

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login**: `POST /api/admin/auth/login` with username/password
2. **Get Token**: Receive JWT token in response
3. **Use Token**: Include `Authorization: Bearer <token>` header in requests

## S3 Integration

The backend integrates with AWS S3 for image storage:

- **Bucket**: `jgi-menteetracker`
- **Region**: `ap-south-1`
- **Structure**: `beula+(interior+design+site)/{project}/{room_type}/`

## Configuration

All configuration is managed in `config.py`:

- Database connection string
- JWT secret key and expiration
- AWS S3 credentials
- Server host and port settings

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Pydantic model validation
- **Authentication Errors**: JWT token validation
- **Database Errors**: SQLAlchemy error handling
- **S3 Errors**: AWS SDK error handling
- **Global Exception Handler**: Catches unhandled exceptions

## Logging

The application logs:

- All HTTP requests and responses
- Database operations
- S3 operations
- Authentication events
- Error conditions

## Development

### Project Structure
```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── database.py          # Database connection
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── auth.py              # Authentication logic
├── s3_service.py        # AWS S3 service
├── run.py               # Server runner
├── requirements.txt     # Python dependencies
└── routers/
    ├── __init__.py
    ├── public.py        # Public API routes
    └── admin.py         # Admin API routes
```

### Adding New Endpoints

1. Create Pydantic schemas in `schemas.py`
2. Add database models in `models.py` (if needed)
3. Implement routes in appropriate router file
4. Add authentication dependencies for admin routes

## Production Deployment

For production deployment:

1. Set `debug=False` in configuration
2. Use proper CORS origins
3. Configure trusted hosts
4. Use environment variables for secrets
5. Set up proper logging
6. Use a production ASGI server like Gunicorn

## License

MIT License - see LICENSE file for details.
