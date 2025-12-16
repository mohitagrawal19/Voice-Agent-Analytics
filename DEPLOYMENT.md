# Deployment Guide

This guide explains how to deploy the Voice Analytics Dashboard to the cloud.

## Quick Start - Vercel (Recommended)

Vercel is the easiest option and is built by the creators of Next.js. The deployment takes about 2 minutes.

### Step 1: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/voice-analytics-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Accept default settings
5. Click "Deploy"

Your app will be live in ~2 minutes at a URL like:
`https://voice-analytics-dashboard-YOUR_USERNAME.vercel.app`

### Optional: Add Supabase Integration

If you want to use Supabase for persistent data storage:

1. Create a Supabase project at https://supabase.com
2. In Supabase dashboard, create a table named `chart_customizations`:
   - Column: `id` (uuid, primary key)
   - Column: `email` (text)
   - Column: `chartType` (text)
   - Column: `customData` (jsonb)
   - Column: `createdAt` (timestamp)
   - Column: `updatedAt` (timestamp)

3. Copy your Supabase credentials
4. In Vercel project settings → Environment Variables, add:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
5. Redeploy (Vercel → Deployments → Click on latest → Redeploy)

## Alternative: Deploy to Netlify

### Step 1: Build Locally
```bash
npm run build
```

### Step 2: Deploy
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Or connect your GitHub repo to https://netlify.com for automatic deployments.

## Alternative: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "GitHub Repo"
4. Choose your repository
5. Configure:
   - Build Command: `npm run build`
   - Start Command: Not needed (static app)
6. Add environment variables if using Supabase
7. Deploy

## Testing Locally Before Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Visit http://localhost:4173 to test the production build.

## Environment Variables

The app works with or without Supabase. Without it, custom data is stored in localStorage.

### With Supabase (Recommended for Production)
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Without Supabase (Uses localStorage)
No environment variables needed. The app will work with in-browser storage.

## Monitoring & Logs

### Vercel
- Deployments page shows build status and logs
- Analytics available in Vercel dashboard
- Real-time monitoring of request metrics

### Netlify
- Deploy logs visible in "Deploys" tab
- Analytics in site settings

### Railway
- Logs available in "Logs" tab
- Monitoring dashboard for resource usage

## Common Issues

**Build fails with "module not found"**
- Ensure all dependencies are listed in `package.json`
- Run `npm install` locally to verify
- Check `.env` variables are correctly set

**Supabase connection fails**
- Verify environment variables are set correctly
- Check Supabase table exists with correct schema
- Test with `curl https://YOUR_SUPABASE_URL/rest/v1/chart_customizations`

**Charts not loading**
- Open browser DevTools → Console to check for errors
- Verify dummy data is working (app works without Supabase)
- Check network requests to identify failed API calls

## Domain Setup

### Custom Domain on Vercel
1. Project Settings → Domains
2. Add your custom domain
3. Update DNS records (Vercel shows instructions)
4. SSL certificate auto-issued (takes ~5 min)

### Custom Domain on Netlify
1. Site Settings → Domain Management
2. Add Domain
3. Update DNS (Netlify shows instructions)
4. SSL auto-configured

## Performance Optimization

Current bundle size: ~170KB gzipped

To optimize further:
```bash
npm run build
```

View detailed bundle analysis:
```bash
npm install -D rollup-plugin-visualizer
# Update vite.config.ts to use plugin
```

## Rollback & Versioning

All platforms allow instant rollback to previous deployments:

**Vercel**: Deployments page → click previous version → Rollback
**Netlify**: Deploys tab → right-click previous deploy → Publish deploy
**Railway**: Deployments → select version → Redeploy

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs in deployment dashboard
- Ensure `npm run build` works locally first
- Verify all environment variables are set
