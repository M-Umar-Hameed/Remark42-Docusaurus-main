# Remark42 Comments Setup Guide

This guide will help you set up and run the Remark42 comment system with your Docusaurus blog.

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed
- ngrok account (free tier works)

## Quick Start

### 1. Start ngrok tunnel
```bash
# Start ngrok tunnel to port 8080 (where Remark42 runs)
ngrok http 8080
```

### 2. Update configuration with your ngrok URL
```bash
# Copy the HTTPS URL from ngrok (e.g., https://abc123.ngrok-free.app)
# Then run our automation script:
node update-ngrok.js https://your-ngrok-url.ngrok-free.app
```

### 3. Start the development servers
```bash
# Start Docusaurus dev server
npm start
```

That's it! Your blog should now have interactive Remark42 comments.

## Detailed Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set up ngrok
1. Install ngrok: https://ngrok.com/download
2. Sign up for free account: https://ngrok.com/signup
3. Get your authtoken from dashboard
4. Configure ngrok:
   ```bash
   ngrok authtoken YOUR_TOKEN_HERE
   ```

### Step 3: Start ngrok
```bash
ngrok http 8080
```

You'll see output like:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:8080
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### Step 4: Update Configuration
Run the automation script with your ngrok URL:

```bash
node update-ngrok.js https://abc123.ngrok-free.app
```

This script will:
- Update `.env` file
- Update `docker-compose.yml` 
- Update CSP configuration
- Restart Docker containers with fresh data
- Clear any cached configurations

### Step 5: Start Docusaurus
```bash
npm start
```

Visit http://localhost:3000 and navigate to any blog post. You should see the Remark42 comment widget.

## Troubleshooting

### Comments not loading?
1. **Clear browser cache**: Hard refresh with `Ctrl+Shift+R`
2. **Check console**: Look for error messages in browser DevTools
3. **Verify URLs**: Make sure ngrok URL is correct in all config files

### Getting 500 errors?
1. **Restart everything**: Run the update script again
2. **Check Docker logs**: `docker logs remark42`
3. **Clear data**: The script automatically clears old data

### Old URLs still being used?
1. **Clear browser cache completely**
2. **Restart dev server**: Stop and start `npm start`
3. **Check Service Workers**: Disable in DevTools > Application tab

## When ngrok URL changes

Every time you restart ngrok, you'll get a new URL. Simply run:

```bash
# Get new URL from ngrok
node update-ngrok.js https://your-new-ngrok-url.ngrok-free.app
```

## Production Deployment

For production, you'll want to:

1. **Replace ngrok** with a permanent domain pointing to your Remark42 server
2. **Update environment variables** in your hosting platform
3. **Set up persistent storage** for Remark42 data
4. **Configure proper SSL** certificates

## Files Modified

- `.env` - Contains Remark42 host configuration
- `docker-compose.yml` - Remark42 Docker container setup
- `src/components/Remark42.js` - React component for comments
- `src/clientModules/remark42-csp.js` - Content Security Policy setup
- `update-ngrok.js` - Automation script for URL updates

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Check Docker logs: `docker logs remark42`
3. Verify all URLs match in configuration files
4. Try clearing all browser data for localhost

## Configuration Files

### .env
```env
REMARK42_HOST=https://your-ngrok-url.ngrok-free.app
REMARK42_SITE_ID=remark
```

### Key Docker Environment Variables
- `REMARK_URL`: Your ngrok URL
- `ALLOWED_HOSTS`: Domains allowed to embed
- `ALLOWED_ORIGINS`: CORS origins
- `AUTH_ANON`: Allow anonymous comments (true)
- `CORS_ENABLED`: Enable CORS (true)