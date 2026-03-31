from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class ContactInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    service_interest: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactInquiryCreate(BaseModel):
    name: str
    email: EmailStr
    service_interest: str
    message: str

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    category: str
    date: str
    read_time: str

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    category: str
    date: str
    read_time: str


# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Unovia Consulting API"}

# Contact Inquiry Endpoints
@api_router.post("/contact", response_model=ContactInquiry)
async def create_contact_inquiry(input: ContactInquiryCreate):
    inquiry_dict = input.model_dump()
    inquiry_obj = ContactInquiry(**inquiry_dict)
    
    doc = inquiry_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.contact_inquiries.insert_one(doc)
    return inquiry_obj

@api_router.get("/contact", response_model=List[ContactInquiry])
async def get_contact_inquiries():
    inquiries = await db.contact_inquiries.find({}, {"_id": 0}).to_list(1000)
    
    for inquiry in inquiries:
        if isinstance(inquiry['timestamp'], str):
            inquiry['timestamp'] = datetime.fromisoformat(inquiry['timestamp'])
    
    return inquiries

# Blog Posts Endpoints
@api_router.get("/blogs", response_model=List[BlogPost])
async def get_blog_posts():
    blogs = await db.blog_posts.find({}, {"_id": 0}).to_list(100)
    return blogs

@api_router.post("/blogs", response_model=BlogPost)
async def create_blog_post(input: BlogPostCreate):
    blog_dict = input.model_dump()
    blog_obj = BlogPost(**blog_dict)
    
    doc = blog_obj.model_dump()
    await db.blog_posts.insert_one(doc)
    return blog_obj

# Seed initial blog posts
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
            "category": "GST & Compliance",
            "date": "December 2025",
            "read_time": "5 min read"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Wealth Preservation for HNWIs",
            "excerpt": "Strategic approaches to protecting and growing wealth for high net worth individuals in volatile market conditions.",
            "category": "Wealth Management",
            "date": "December 2025",
            "read_time": "7 min read"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Corporate Tax Planning Strategies",
            "excerpt": "Essential tax planning techniques for corporations looking to optimize their tax liability while maintaining full compliance.",
            "category": "Tax Consulting",
            "date": "November 2025",
            "read_time": "6 min read"
        }
    ]
    
    await db.blog_posts.insert_many(sample_blogs)
    return {"message": "Blog posts seeded successfully", "count": len(sample_blogs)}


# Include the router in the main app
app.include_router(api_router)

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
