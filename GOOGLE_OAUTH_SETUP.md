# Google OAuth Setup Guide

## Prerequisites
- A Google Cloud Project
- OAuth 2.0 credentials configured

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if you haven't already
6. Select **Web application** as the application type
7. Add authorized JavaScript origins:
   - `http://localhost:5173` (for Vite dev server)
   - `http://localhost:3000` (optional)
   - Your production domain when ready
8. Add authorized redirect URIs:
   - `http://localhost:5173` (for Vite dev server)
   - Your production domain when ready
9. Click **Create** and copy your Client ID

## Step 2: Configure Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` folder:
```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
JWT_SECRET=your-super-secret-jwt-key-here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

**Important:** You need both the Client ID and Client Secret from Google Cloud Console for the auth-code flow to work.

### Frontend (.env)
Create a `.env` file in the `frontend` folder:
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Important:** Use the same Google Client ID for both frontend and backend.

## Step 3: Install Dependencies

Both `@react-oauth/google` (frontend) and `google-auth-library` (backend) are already installed.

## Step 4: Run the Application

### Backend
```bash
cd backend
node index.js
```

### Frontend
```bash
cd frontend
npm run dev
```

## How It Works

1. User clicks the custom "Sisene Google'iga" button on the login page
2. Google OAuth popup appears for user authentication (using auth-code flow)
3. Upon successful authentication, Google returns an authorization code
4. Frontend sends this code to `POST http://localhost:3005/api/google`
5. Backend exchanges the code with Google's servers for tokens (ID token + access token)
6. Backend verifies the ID token and extracts user information
7. Backend checks if user exists in database:
   - If yes: Returns existing user with JWT token
   - If no: Creates new user and returns JWT token
8. Frontend stores the JWT token and user data in localStorage
9. User is redirected to the home page

## API Endpoint

**POST** `/api/google`
 (auth-code flow):
```json
{
  "code": "authorization-code-from-google"
}
```

Or (credential flow - backward compatible)
Request body:
```json
{
  "credential": "google-jwt-token-here"
}
```

Response (success):
```json
{
  "success": true,
  "message": "User logged in via Google.",
  "token": "your-jwt-token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": null,
    "birthday": null,
    "picture": "https://lh3.googleusercontent.com/...",
    "role": "user"
  }
}
```

## Security Notes

- Never commit `.env` files to version control
- The backend verifies tokens with Google's servers to prevent token forgery
- JWT tokens expire after 7 days for Google login
- Passwords are not required for Google OAuth users (stored as `null`)
- Email must be verified by Google for authentication to succeed

## Troubleshooting

### "Google login failed"
- Verify your Google Client ID is correct in both `.env` files
- Check that the Client ID matches in Google Cloud Console
- Ensure authorized origins include your frontend URL

### "Email not verified by Google"
- The user's Google account email must be verified
- This is a security measure built into the implementation

### Token verification fails
- Make sure backend `.env` has the correct `GOOGLE_CLIENT_ID`
- Check that the Google Cloud project has the OAuth consent screen configured
