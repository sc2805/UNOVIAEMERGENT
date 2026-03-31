# Unovia Consulting - Frontend

## Vercel Deployment

### Step 1: Push to GitHub
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Set the following environment variable:
   - `REACT_APP_BACKEND_URL` = Your Railway/Render backend URL (e.g., `https://unovia-api.railway.app`)
5. Click "Deploy"

### Step 3: After Backend is Deployed
Update the `REACT_APP_BACKEND_URL` in Vercel:
1. Go to Project Settings → Environment Variables
2. Update `REACT_APP_BACKEND_URL` with your actual backend URL
3. Redeploy

## Local Development
```bash
yarn install
yarn start
```

## Build
```bash
yarn build
```
