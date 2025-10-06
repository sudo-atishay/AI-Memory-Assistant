# 🚀 AI Memory Assistant - Deployment Guide

## Quick Deploy to Railway (Recommended)

### Step 1: Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-memory-assistant.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `ai-memory-assistant` repository
5. Railway will automatically detect it's a Node.js app
6. Your app will be live in 2-3 minutes!

### Step 3: Access Your App
- Railway will give you a URL like: `https://your-app-name.railway.app`
- Your AI Memory Assistant will be live and ready to use!

## Alternative: Deploy to Render

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Click "Create Web Service"

## Environment Variables (Optional)
Both platforms will work with the default settings, but you can add:
- `NODE_ENV=production`
- `PORT=3000`

## Features After Deployment
✅ **Full-stack AI Memory Assistant**  
✅ **Persistent SQLite database**  
✅ **Beautiful React UI**  
✅ **Memory management with categories**  
✅ **Search and filtering**  
✅ **Statistics dashboard**  
✅ **AI-ready architecture**  

## Cost
- **Railway**: Free tier (500 hours/month)
- **Render**: Free tier (750 hours/month)
- Both are completely free for personal use!

## Support
If you need help with deployment, the app is fully configured and ready to go. Just follow the steps above!
