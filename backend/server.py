from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import resend
import base64

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'unovia-secret-key-2025-secure')
JWT_ALGORITHM = "HS256"

# Resend Configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_NOTIFICATION_EMAIL = os.environ.get('ADMIN_EMAIL', 'Connect@unovia.in')

# Create the main app
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth")
admin_router = APIRouter(prefix="/api/admin")


# ============ PASSWORD HASHING ============
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


# ============ JWT TOKEN MANAGEMENT ============
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, 
        "email": email, 
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id, 
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# ============ AUTH HELPER ============
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ============ MODELS ============
class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    service_interest: str
    message: str
    status: str = "new"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactInquiryCreate(BaseModel):
    name: str
    email: EmailStr
    service_interest: str
    message: str

class ContactInquiryUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: Optional[str] = ""
    category: str
    tags: List[str] = []
    featured_image: Optional[str] = None
    date: str
    read_time: str
    published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: Optional[str] = ""
    category: str
    tags: List[str] = []
    featured_image: Optional[str] = None
    date: str
    read_time: str
    published: bool = True

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    date: Optional[str] = None
    read_time: Optional[str] = None
    published: Optional[bool] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str


# ============ EMAIL NOTIFICATION ============
async def send_contact_notification(inquiry: ContactInquiry):
    if not resend.api_key:
        logging.warning("Resend API key not configured, skipping email notification")
        return
    
    service_labels = {
        "wealth-management": "Wealth Management",
        "tax-consulting": "Tax Consulting & Planning",
        "financial-advisory": "Financial Advisory",
        "gst-compliance": "GST & Compliance",
        "investment-planning": "Investment Planning"
    }
    service_name = service_labels.get(inquiry.service_interest, inquiry.service_interest)
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #0B1B3D; padding: 20px; text-align: center;">
            <h1 style="color: #FAF9F6; margin: 0;">New Contact Inquiry</h1>
        </div>
        <div style="padding: 30px; background-color: #FAF9F6;">
            <h2 style="color: #0B1B3D; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold; color: #0B1B3D;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #4A5568;">{inquiry.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold; color: #0B1B3D;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #4A5568;">{inquiry.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-weight: bold; color: #0B1B3D;">Service Interest:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; color: #4A5568;">{service_name}</td>
                </tr>
            </table>
            <h3 style="color: #0B1B3D; margin-top: 20px;">Message:</h3>
            <p style="color: #4A5568; background-color: #F3F0EA; padding: 15px; border-left: 3px solid #C5A880;">{inquiry.message}</p>
            <p style="color: #718096; font-size: 12px; margin-top: 30px;">
                Received on: {inquiry.timestamp.strftime('%B %d, %Y at %I:%M %p')}
            </p>
        </div>
        <div style="background-color: #0B1B3D; padding: 15px; text-align: center;">
            <p style="color: #FAF9F6; margin: 0; font-size: 12px;">Unovia Consulting - Wealth Management & Tax Advisory</p>
        </div>
    </div>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [ADMIN_NOTIFICATION_EMAIL],
        "subject": f"New Inquiry from {inquiry.name} - {service_name}",
        "html": html_content
    }
    
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Email notification sent for inquiry from {inquiry.email}")
    except Exception as e:
        logging.error(f"Failed to send email notification: {str(e)}")


# ============ PUBLIC ENDPOINTS ============
@api_router.get("/")
async def root():
    return {"message": "Unovia Consulting API"}

@api_router.post("/contact", response_model=ContactInquiry)
async def create_contact_inquiry(input: ContactInquiryCreate):
    inquiry_dict = input.model_dump()
    inquiry_obj = ContactInquiry(**inquiry_dict)
    
    doc = inquiry_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    doc['created_at'] = doc['timestamp']
    doc['updated_at'] = doc['timestamp']
    
    await db.contact_inquiries.insert_one(doc)
    
    # Send email notification asynchronously
    asyncio.create_task(send_contact_notification(inquiry_obj))
    
    return inquiry_obj

@api_router.get("/blogs", response_model=List[BlogPost])
async def get_blog_posts():
    blogs = await db.blog_posts.find({"published": True}, {"_id": 0}).to_list(100)
    return blogs

@api_router.get("/blogs/{blog_id}", response_model=BlogPost)
async def get_blog_post(blog_id: str):
    blog = await db.blog_posts.find_one({"id": blog_id}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@api_router.post("/blogs/seed")
async def seed_blog_posts():
    existing = await db.blog_posts.count_documents({})
    if existing > 0:
        return {"message": "Blog posts already seeded", "count": existing}
    
    sample_blogs = [
        {
            "id": str(uuid.uuid4()),
            "title": "Navigating GST Changes in 2026",
            "excerpt": "Understanding the latest amendments to GST regulations and how they impact your business compliance and tax planning strategies.",
            "content": "The GST landscape continues to evolve with significant amendments expected in 2026. This comprehensive guide helps businesses understand and adapt to these changes...",
            "category": "GST & Compliance",
            "tags": ["GST", "Compliance", "Tax"],
            "featured_image": None,
            "date": "December 2025",
            "read_time": "5 min read",
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Wealth Preservation for HNWIs",
            "excerpt": "Strategic approaches to protecting and growing wealth for high net worth individuals in volatile market conditions.",
            "content": "High net worth individuals face unique challenges in wealth preservation. This article explores proven strategies for protecting assets during market volatility...",
            "category": "Wealth Management",
            "tags": ["Wealth", "HNWI", "Investment"],
            "featured_image": None,
            "date": "December 2025",
            "read_time": "7 min read",
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Corporate Tax Planning Strategies",
            "excerpt": "Essential tax planning techniques for corporations looking to optimize their tax liability while maintaining full compliance.",
            "content": "Effective corporate tax planning requires a strategic approach that balances tax efficiency with regulatory compliance. Here are the key strategies every corporation should consider...",
            "category": "Tax Consulting",
            "tags": ["Corporate Tax", "Planning", "Compliance"],
            "featured_image": None,
            "date": "November 2025",
            "read_time": "6 min read",
            "published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.blog_posts.insert_many(sample_blogs)
    return {"message": "Blog posts seeded successfully", "count": len(sample_blogs)}


# ============ AUTH ENDPOINTS ============
@auth_router.post("/login")
async def login(request: LoginRequest, response: Response):
    email = request.email.lower()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(user["id"], email)
    refresh_token = create_refresh_token(user["id"])
    
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        secure=False, 
        samesite="lax", 
        max_age=86400,
        path="/"
    )
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        secure=False, 
        samesite="lax", 
        max_age=604800,
        path="/"
    )
    
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@auth_router.get("/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user


# ============ ADMIN ENDPOINTS ============
@admin_router.get("/inquiries")
async def get_all_inquiries(request: Request):
    await get_current_user(request)
    inquiries = await db.contact_inquiries.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    
    for inquiry in inquiries:
        if isinstance(inquiry.get('timestamp'), str):
            inquiry['timestamp'] = datetime.fromisoformat(inquiry['timestamp'].replace('Z', '+00:00'))
    
    return inquiries

@admin_router.get("/inquiries/{inquiry_id}")
async def get_inquiry(inquiry_id: str, request: Request):
    await get_current_user(request)
    inquiry = await db.contact_inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry

@admin_router.patch("/inquiries/{inquiry_id}")
async def update_inquiry(inquiry_id: str, update: ContactInquiryUpdate, request: Request):
    await get_current_user(request)
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.contact_inquiries.update_one(
        {"id": inquiry_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    return await db.contact_inquiries.find_one({"id": inquiry_id}, {"_id": 0})

@admin_router.delete("/inquiries/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, request: Request):
    await get_current_user(request)
    
    result = await db.contact_inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    return {"message": "Inquiry deleted successfully"}

@admin_router.get("/blogs")
async def get_all_blogs_admin(request: Request):
    await get_current_user(request)
    blogs = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return blogs

@admin_router.post("/blogs", response_model=BlogPost)
async def create_blog_admin(blog: BlogPostCreate, request: Request):
    await get_current_user(request)
    
    blog_dict = blog.model_dump()
    blog_obj = BlogPost(**blog_dict)
    
    doc = blog_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.blog_posts.insert_one(doc)
    return blog_obj

@admin_router.patch("/blogs/{blog_id}")
async def update_blog_admin(blog_id: str, update: BlogPostUpdate, request: Request):
    await get_current_user(request)
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.blog_posts.update_one(
        {"id": blog_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return await db.blog_posts.find_one({"id": blog_id}, {"_id": 0})

@admin_router.delete("/blogs/{blog_id}")
async def delete_blog_admin(blog_id: str, request: Request):
    await get_current_user(request)
    
    result = await db.blog_posts.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return {"message": "Blog post deleted successfully"}

@admin_router.get("/stats")
async def get_admin_stats(request: Request):
    await get_current_user(request)
    
    total_inquiries = await db.contact_inquiries.count_documents({})
    new_inquiries = await db.contact_inquiries.count_documents({"status": "new"})
    total_blogs = await db.blog_posts.count_documents({})
    published_blogs = await db.blog_posts.count_documents({"published": True})
    
    return {
        "total_inquiries": total_inquiries,
        "new_inquiries": new_inquiries,
        "total_blogs": total_blogs,
        "published_blogs": published_blogs
    }


# ============ ADMIN SEEDING ============
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "Connect@unovia.in").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Unovia@2805")
    
    existing = await db.users.find_one({"email": admin_email})
    
    if existing is None:
        hashed = hash_password(admin_password)
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logging.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logging.info(f"Admin password updated: {admin_email}")


# ============ APP SETUP ============
app.include_router(api_router)
app.include_router(auth_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await seed_admin()
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.contact_inquiries.create_index("timestamp")
    await db.blog_posts.create_index("created_at")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
