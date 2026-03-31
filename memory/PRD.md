# Unovia Consulting Website - PRD

## Original Problem Statement
Unovia consulting is a wealth management cum Tax consulting firm established in 2025 by TEAM CAs and MBA in Kolkata West Bengal with domain expertise of more than 10 years. The website must match with logo and contain Contact details as Email: Connect@unovia.in M: 7278671467

## User Personas
- **Potential Clients**: HNWIs, businesses seeking wealth management and tax consulting
- **Business Owners**: Companies needing GST compliance and financial advisory
- **Investors**: Individuals seeking investment planning services

## Core Requirements
- Single-page landing website with modern, professional design
- Light theme with navy blue accents matching the logo
- Sections: Hero, About, Services, Team, Insights/Blog, Contact
- Contact form with database storage
- Contact details prominently displayed

## What's Been Implemented (December 2025)
- [x] Responsive navigation with sticky header and glass effect
- [x] Hero section with CTAs and asymmetric layout
- [x] About section with 10+ years expertise stats
- [x] Services grid (5 services: Wealth Management, Tax Consulting, Financial Advisory, GST & Compliance, Investment Planning)
- [x] Team section with overlapping cards
- [x] Blog/Insights section with API integration
- [x] Contact section with functional form (saves to MongoDB)
- [x] Contact details: Email, Phone, Location
- [x] Mobile responsive design
- [x] Typography: Cormorant Garamond (headings), Manrope (body)
- [x] Color scheme: Navy (#0B1B3D), Gold accent (#C5A880), Warm background (#FAF9F6)

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI + MongoDB
- **APIs**: /api/contact (POST/GET), /api/blogs (POST/GET), /api/blogs/seed

## Prioritized Backlog
### P0 (Critical) - DONE
- All core sections implemented

### P1 (Important)
- Email notification on form submission
- Admin panel to manage inquiries

### P2 (Nice to have)
- Blog management system
- Client testimonials section
- Newsletter subscription
- WhatsApp integration

## Next Tasks
1. Add email notification for contact form submissions
2. Create admin dashboard for managing inquiries
3. Add more blog posts management
