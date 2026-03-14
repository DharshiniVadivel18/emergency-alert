# 🚀 Gmail OAuth2 Quick Start

## What You Need to Do

### 1️⃣ Get Google OAuth2 Credentials (5 minutes)

Go to: https://console.cloud.google.com/

**Follow these steps:**
- Create new project: "Emergency Alert System"
- Enable Gmail API
- Create OAuth Client ID (Web application)
- Set redirect URI: `http://localhost:5000/api/oauth/oauth2callback`
- Download credentials JSON

### 2️⃣ Save Credentials File

1. Create folder: `mern-backend/credentials/`
2. Save downloaded JSON as: `mern-backend/credentials/gmail-credentials.json`

### 3️⃣ Update .env

Add to `mern-backend/.env`:
```
EMAIL_USER=your-email@gmail.com
```

### 4️⃣ Install & Start

```bash
cd mern-backend
npm install
npm start
```

### 5️⃣ Authorize Gmail

**Option A: Using Frontend**
1. Start frontend: `npm start` (in mern-frontend)
2. Go to Admin Dashboard
3. Find "Gmail Setup" section
4. Click "Authorize with Gmail"
5. Sign in and grant permissions

**Option B: Using API**
1. Open: `http://localhost:5000/api/oauth/gmail-auth-url`
2. Copy the `authUrl`
3. Open it in browser
4. Sign in and grant permissions

### 6️⃣ Done! ✅

Emails will now be sent automatically when:
- Users create emergency alerts
- Emergency contacts receive notifications
- Admins get updates

---

## 📁 File Structure

```
mern-backend/
├── credentials/
│   └── gmail-credentials.json  (← Download from Google Cloud)
├── tokens/
│   └── gmail-token.json        (← Auto-created after authorization)
├── utils/
│   └── emailService.js         (← Email sending logic)
├── routes/
│   └── oauth.js                (← OAuth2 endpoints)
└── GMAIL-OAUTH2-SETUP.md       (← Detailed guide)
```

---

## 🧪 Test Email

```bash
node test-email.js
```

---

## ❓ Need Help?

See: `GMAIL-OAUTH2-SETUP.md` for detailed troubleshooting

---

## 🔒 Security

- ✅ Credentials stored locally (never exposed)
- ✅ Tokens auto-refresh
- ✅ OAuth2 is industry standard
- ✅ No passwords stored
