# Deployment Guide

This document explains how to deploy the CompanyManager Lite application to various platforms, with specific focus on Vercel.

## Vercel Deployment

The project includes a `vercel.json` configuration file that ensures proper deployment and routing.

### Configuration Details

The `vercel.json` file contains:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### Rewrites
The rewrites configuration is essential for client-side routing in SPA (Single Page Applications). It ensures that all routes are redirected to `index.html` so React Router can handle the navigation.

#### Headers
Security headers are added to enhance the application's security:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection

### Deployment Steps

1. **Prepare Your Code**
   - Ensure all code is committed and pushed to a Git repository (GitHub, GitLab, or Bitbucket)
   - Verify that the `vercel.json` file is in the root directory

2. **Set Up Vercel**
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

3. **Configure Project**
   - Vercel will automatically detect the Vite project
   - Framework preset should be set to "Vite"
   - Build command: `npm run build`
   - Output directory: `dist`
   - Development command: `npm run dev`

4. **Environment Variables**
   - Go to your project settings → Environment Variables
   - Add all your Firebase configuration variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

5. **Deploy**
   - Click "Deploy" to build and deploy your application
   - Vercel will provide you with a deployment URL

### Post-Deployment

After deployment, make sure to:
1. Test all routes to ensure navigation works correctly
2. Verify Firebase authentication is working
3. Check that all environment variables are properly configured

## Other Deployment Options

### Netlify
For Netlify deployment, you would need a `_redirects` file in the `public` directory with:
```
/*    /index.html   200
```

### Firebase Hosting
For Firebase Hosting, you would need to configure `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Troubleshooting

### Common Issues

1. **404 Errors on Routes**
   - Ensure the rewrites configuration is properly set up
   - Check that the redirect pattern matches your routing structure

2. **Environment Variables Not Loading**
   - Verify that variables are prefixed with `VITE_`
   - Check that variables are added to the Vercel project settings, not just local `.env` files

3. **Firebase Authentication Not Working**
   - Ensure Firebase project is configured to allow web authentication
   - Check that authorized domains include your deployment URL

### Best Practices

1. Always use environment variables for sensitive configuration
2. Test deployment in a staging environment before production
3. Monitor deployment logs for any build errors
4. Set up custom domains through your deployment platform