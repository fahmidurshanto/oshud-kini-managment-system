# Oshud Kini Management System

This is a React-based web application for managing company products, employees, and salaries with Firebase authentication.

## Features

- User authentication with Firebase (Email/Password and Google Sign-In)
- Product management (CRUD operations)
- Employee management (CRUD operations)
- Salary management (CRUD operations)
- Responsive design with Tailwind CSS

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Register your web app in the Firebase project
3. Copy your Firebase configuration values
4. Update the environment variables in `.env.local` with your Firebase config:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
Open [https://oshud-kini-managment-system.vercel.app](https://oshud-kini-managment-system.vercel.app) to view it in the browser.

The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run preview`

Preview the production build locally.

## Deployment

### Vercel Deployment

This project includes a `vercel.json` file for proper deployment to Vercel:

1. Push your code to a GitHub repository
2. Sign up or log in to [Vercel](https://vercel.com)
3. Create a new project and import your repository
4. Vercel will automatically detect the Vite project and configure it
5. Add your Firebase environment variables in the Vercel project settings:
   - Go to your project settings → Environment Variables
   - Add all your `VITE_FIREBASE_*` variables
6. Deploy the project

The `vercel.json` configuration handles:
- SPA routing with rewrites to `index.html`
- Security headers for enhanced protection

## Project Structure

```
src/
  components/     # Reusable UI components
  contexts/       # React context files
  hooks/          # Custom React hooks
  pages/          # Page components
  routes/         # Routing configuration
  services/       # Data service files
  utils/          # Utility functions
```

## Authentication

The app uses Firebase Authentication for user management with:
- Email/password registration and login
- Google Sign-In
- Protected routes for authenticated users only