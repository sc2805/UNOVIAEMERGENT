# Unovia Consulting - Backend API

## Railway/Render Deployment

### Environment Variables Required
Set these in Railway/Render dashboard:

```
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
DB_NAME=unovia_db
CORS_ORIGINS=https://your-vercel-app.vercel.app
JWT_SECRET=your-secure-random-64-char-secret
ADMIN_EMAIL=connect@unovia.in
ADMIN_PASSWORD=Unovia@2805
RESEND_API_KEY=re_7K9NpryJ_MwxtXjpqFWSjnYNcFbZqY7Nz
SENDER_EMAIL=noreply@unovia.in
```

### Railway Deployment

1. Push backend to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (above)
6. Railway auto-detects Python and deploys

### Render Deployment

1. Push backend to GitHub  
2. Go to https://render.com
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Click "Create Web Service"

### MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Add to MONGO_URL env variable

## Local Development
```bash
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

## API Endpoints
- `GET /api/` - Health check
- `POST /api/contact` - Submit contact form
- `GET /api/blogs` - Get published blogs
- `POST /api/auth/login` - Admin login
- `GET /api/admin/stats` - Dashboard stats (protected)
