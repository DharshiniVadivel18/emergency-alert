# ✅ Gmail OAuth2 Setup Checklist

## 📋 Pre-Setup Checklist

- [ ] You have a Gmail account
- [ ] You have access to Google Cloud Console
- [ ] Backend is ready (Node.js installed)
- [ ] Frontend is ready (React installed)

---

## 🔐 Google Cloud Setup (5-10 minutes)

### Create Project
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project: "Emergency Alert System"
- [ ] Wait for project creation
- [ ] Note your Project ID

### Enable Gmail API
- [ ] Go to APIs & Services → Library
- [ ] Search for "Gmail API"
- [ ] Click "Enable"
- [ ] Wait for enablement

### Configure OAuth Consent Screen
- [ ] Go to APIs & Services → OAuth consent screen
- [ ] Select "External"
- [ ] Fill in:
  - [ ] App name: "Emergency Alert System"
  - [ ] User support email: your-email@gmail.com
  - [ ] Developer contact: your-email@gmail.com
- [ ] Add scope: https://mail.google.com/
- [ ] Add test user: your-email@gmail.com
- [ ] Save and continue

### Create OAuth Client ID
- [ ] Go to APIs & Services → Credentials
- [ ] Click "Create Credentials" → "OAuth client ID"
- [ ] Application type: "Web application"
- [ ] Name: "Emergency Alert Mailer"
- [ ] Add redirect URI: `http://localhost:5000/api/oauth/oauth2callback`
- [ ] Click "Create"
- [ ] Download the JSON file

---

## 💾 Local Setup (5 minutes)

### Create Directories
- [ ] Create folder: `mern-backend/credentials/`
- [ ] Create folder: `mern-backend/tokens/`

### Add Credentials
- [ ] Save downloaded JSON as: `mern-backend/credentials/gmail-credentials.json`
- [ ] Verify file exists and is readable

### Update Environment
- [ ] Open `mern-backend/.env`
- [ ] Add: `EMAIL_USER=your-email@gmail.com`
- [ ] Save file

### Install Dependencies
- [ ] Open terminal in `mern-backend/`
- [ ] Run: `npm install`
- [ ] Wait for completion

---

## 🚀 Start Services (2 minutes)

### Start Backend
- [ ] Open terminal in `mern-backend/`
- [ ] Run: `npm start`
- [ ] Wait for: "✅ MongoDB Connected" or "Server running without database"
- [ ] Verify: "🚀 Server running on port 5000"

### Start Frontend (Optional for UI setup)
- [ ] Open new terminal in `mern-frontend/`
- [ ] Run: `npm start`
- [ ] Wait for: "Compiled successfully"
- [ ] Browser opens to http://localhost:3000

---

## 🔑 Authorization (2 minutes)

### Option A: Using Frontend UI (Recommended)
- [ ] Go to Admin Dashboard
- [ ] Find "Gmail Setup" section
- [ ] Click "Get Authorization URL"
- [ ] Click "Authorize with Gmail"
- [ ] Sign in with your Gmail account
- [ ] Grant all requested permissions
- [ ] You'll be redirected back automatically
- [ ] Click "Check Authorization Status"
- [ ] See: "✅ Gmail OAuth2 is authorized and working!"

### Option B: Using API Direct
- [ ] Open: `http://localhost:5000/api/oauth/gmail-auth-url`
- [ ] Copy the `authUrl` value
- [ ] Open it in a new browser tab
- [ ] Sign in with your Gmail account
- [ ] Grant all requested permissions
- [ ] You'll be redirected to: `http://localhost:5000/api/oauth/oauth2callback?code=...`
- [ ] Token is saved automatically

---

## 🧪 Verification (1 minute)

### Check Token File
- [ ] Open: `mern-backend/tokens/gmail-token.json`
- [ ] Verify file exists and contains token data
- [ ] Should have: `access_token`, `refresh_token`, `expiry_date`

### Test Email Sending
- [ ] Open terminal in `mern-backend/`
- [ ] Run: `node test-email.js`
- [ ] Look for: `✅ SUCCESS! Email sent successfully`
- [ ] Check your Gmail inbox for test email

### Test Emergency Alert
- [ ] Go to app and create emergency alert
- [ ] Check email inbox
- [ ] Should receive formatted emergency alert email

---

## 🎉 Completion Checklist

- [ ] Google OAuth2 credentials obtained
- [ ] Credentials file saved locally
- [ ] .env file updated
- [ ] Dependencies installed
- [ ] Backend started successfully
- [ ] Authorization completed
- [ ] Token file created
- [ ] Test email sent successfully
- [ ] Emergency alert email received

---

## 📊 Status Indicators

### ✅ Everything Working
- Backend running on port 5000
- Token file exists: `mern-backend/tokens/gmail-token.json`
- Test email sent successfully
- Emergency alerts send emails

### ⚠️ Needs Attention
- Backend not starting → Check MongoDB connection
- Authorization failed → Verify credentials file
- Email not sending → Check EMAIL_USER in .env
- Token expired → System auto-refreshes, but re-authorize if needed

---

## 🔒 Security Checklist

- [ ] Credentials file in .gitignore
- [ ] Tokens file in .gitignore
- [ ] .env file in .gitignore
- [ ] Never commit credentials to git
- [ ] Never share credentials file
- [ ] Never expose tokens to frontend
- [ ] Use HTTPS in production

---

## 📞 Quick Help

### "Gmail credentials not found"
→ Check `mern-backend/credentials/gmail-credentials.json` exists

### "No valid token found"
→ Run authorization process again

### "Email not sending"
→ Check `EMAIL_USER` in .env matches your Gmail

### "Authorization failed"
→ Verify redirect URI: `http://localhost:5000/api/oauth/oauth2callback`

---

## 🎯 Next Steps After Setup

1. **Test with real data**
   - Create emergency alert
   - Verify email received

2. **Add more features**
   - Multiple email templates
   - Admin notifications
   - Delivery tracking

3. **Monitor and maintain**
   - Check email logs
   - Monitor token refresh
   - Handle failures gracefully

4. **Production deployment**
   - Use HTTPS
   - Update redirect URI
   - Secure credentials storage
   - Set up email queuing

---

## ✨ You're Ready!

Once all checkboxes are complete, your Gmail OAuth2 email system is fully operational! 🚀

**Questions?** See `GMAIL-OAUTH2-SETUP.md` for detailed documentation.
