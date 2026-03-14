# 📧 Gmail OAuth2 Setup Guide

## Step 1: Get Your Google OAuth2 Credentials

### A. Create Google Cloud Project
1. Go to: https://console.cloud.google.com/
2. Create a new project named "Emergency Alert System"
3. Note your Project ID

### B. Enable Gmail API
1. Go to: https://console.cloud.google.com/apis/library
2. Search for "Gmail API"
3. Click "Enable"

### C. Create OAuth2 Client ID
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Configure OAuth consent screen:
   - User Type: External
   - App name: Emergency Alert System
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
   - Add scope: https://mail.google.com/
   - Add test user: your-email@gmail.com
4. Create OAuth Client ID:
   - Application type: Web application
   - Name: Emergency Alert Mailer
   - Authorized redirect URIs: http://localhost:5000/api/oauth/oauth2callback
5. Download the credentials JSON file

---

## Step 2: Add Credentials to Your Project

### A. Create credentials directory
```bash
mkdir credentials
```

### B. Save credentials file
1. Download the JSON file from Google Cloud Console
2. Save it as: `mern-backend/credentials/gmail-credentials.json`

The file should look like:
```json
{
  "installed": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uris": ["http://localhost:5000/api/oauth/oauth2callback"],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

---

## Step 3: Update .env File

Add to `mern-backend/.env`:
```
EMAIL_USER=your-email@gmail.com
```

---

## Step 4: Install Dependencies

```bash
cd mern-backend
npm install
```

---

## Step 5: Authorize Gmail

### A. Start the backend server
```bash
npm start
```

### B. Get authorization URL
Open in browser:
```
http://localhost:5000/api/oauth/gmail-auth-url
```

You'll get a response with `authUrl`. Copy it.

### C. Authorize
1. Open the `authUrl` in your browser
2. Sign in with your Gmail account
3. Grant permissions
4. You'll be redirected to: `http://localhost:5000/api/oauth/oauth2callback?code=...`
5. The token will be saved automatically

### D. Verify
Check if `mern-backend/tokens/gmail-token.json` was created.

---

## Step 6: Test Email

Run the test script:
```bash
node test-email.js
```

You should see:
```
✅ SUCCESS! Email sent successfully
```

---

## 🎉 Done!

Your Gmail OAuth2 is now configured. Emails will be sent automatically when:
- Users create emergency alerts
- Emergency contacts receive notifications
- Admins get alert updates

---

## 🔧 Troubleshooting

### "Gmail credentials not found"
- Make sure `credentials/gmail-credentials.json` exists
- Check the file path is correct

### "No valid token found"
- Run the authorization process again
- Delete `tokens/gmail-token.json` and re-authorize

### "Token expired"
- The system automatically refreshes expired tokens
- If issues persist, re-authorize

### "Email not sending"
- Check `EMAIL_USER` in .env matches your Gmail account
- Verify Gmail API is enabled in Google Cloud Console
- Check browser console for errors

---

## 📝 Frontend Integration

The frontend can trigger email sending through these API endpoints:

### Create Emergency Alert (sends emails)
```
POST /api/emergency
Body: {
  message: "Help needed",
  location: { address: "..." }
}
```

### Get Authorization URL
```
GET /api/oauth/gmail-auth-url
Response: { authUrl: "https://..." }
```

---

## 🔒 Security Notes

- Never commit `credentials/gmail-credentials.json` to git
- Never commit `tokens/gmail-token.json` to git
- Add to `.gitignore`:
  ```
  credentials/
  tokens/
  ```
- Tokens are stored locally and never exposed to frontend
- OAuth2 uses secure token refresh mechanism

---

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Verify all credentials are correct
3. Check Google Cloud Console settings
4. Review server logs for error messages
