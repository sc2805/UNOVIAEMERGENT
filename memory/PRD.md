# Unovia Consulting Website - PRD

## Original Problem Statement
Unovia consulting is a wealth management cum Tax consulting firm established in 2025 by TEAM CAs and MBA in Kolkata West Bengal with domain expertise of more than 10 years. The website must match with logo and contain Contact details as Email: Connect@unovia.in M: 7278671467

## User Personas
- **Potential Clients**: HNWIs, businesses seeking wealth management and tax consulting
- **Business Owners**: Companies needing GST compliance and financial advisory
- **Admin Users**: Team members managing inquiries and blog content

## Core Requirements
- Single-page landing website with modern, professional design
- Light theme with navy blue accents matching the logo
- Sections: Hero, About, Services, Team, Insights/Blog, Contact
- Contact form with database storage
- Admin dashboard for content management

## What's Been Implemented

### Phase 1 (December 2025)
- [x] Responsive navigation with sticky header and glass effect
- [x] Hero section with CTAs and asymmetric layout
- [x] About section with 10+ years expertise stats
- [x] Services grid (5 services)
- [x] Team section with overlapping cards
- [x] Blog/Insights section with API integration
- [x] Contact section with functional form (saves to MongoDB)
- [x] Contact details: Email, Phone, Location
- [x] Mobile responsive design

### Phase 2 (December 2025)
- [x] WhatsApp floating button (wa.me/917278671467)
- [x] Admin dashboard at /admin with protected routes
- [x] Admin login with JWT authentication (connect@unovia.in / Unovia@2805)
- [x] Contact inquiry management (view, update status, delete)
- [x] Full blog CRUD (Create, Read, Update, Delete)
- [x] Blog categories and tags support
- [x] Featured image support for blogs
- [x] Publish/Draft toggle for blogs
- [x] Dashboard stats (total inquiries, new inquiries, blogs count)
- [x] Email notification ready (Resend integration - needs API key)

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI + MongoDB
- **Auth**: JWT with httpOnly cookies
- **Email**: Resend (when API key is configured)

## APIs
### Public
- GET /api/ - Health check
- POST /api/contact - Submit contact form
- GET /api/blogs - Get published blogs
- GET /api/blogs/{id} - Get single blog
- POST /api/blogs/seed - Seed initial blogs

### Auth
- POST /api/auth/login - Admin login
- POST /api/auth/logout - Admin logout
- GET /api/auth/me - Get current user

### Admin (Protected)
- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/inquiries - List all inquiries
- PATCH /api/admin/inquiries/{id} - Update inquiry status
- DELETE /api/admin/inquiries/{id} - Delete inquiry
- GET /api/admin/blogs - List all blogs
- POST /api/admin/blogs - Create blog
- PATCH /api/admin/blogs/{id} - Update blog
- DELETE /api/admin/blogs/{id} - Delete blog

## Pending Configuration
- **RESEND_API_KEY**: Add to backend/.env to enable email notifications

## Prioritized Backlog
### P0 (Critical) - DONE
- All core features implemented

### P1 (Important)
- Configure Resend API key for email notifications
- Add rich text editor for blog content

### P2 (Nice to have)
- Newsletter subscription
- Client testimonials section
- Blog image upload to cloud storage
- SEO meta tags per blog post

## Admin Credentials
- **Email**: connect@unovia.in
- **Password**: Unovia@2805
- **URL**: /admin/login
