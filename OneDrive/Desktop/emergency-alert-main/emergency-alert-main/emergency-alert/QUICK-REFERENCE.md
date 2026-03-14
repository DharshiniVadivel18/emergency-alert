# 📋 Gmail OAuth2 - Quick Reference Card

## 🎯 ONE-PAGE SETUP GUIDE

### Step 1: Get Credentials (5 min)
```
1. Go: https://console.cloud.google.com/
2. Create project: "Emergency Alert System"
3. Enable Gmail API
4. Create OAuth Client ID (Web application)
5. Set redirect URI: http://localhost:5000/api/oauth/oauth2callback
6. Download JSON file
```

### Step 2: Save Locally (1 min)
```bash
mkdir mern-backend/credentials
# Save downloaded JSON as: mern-backend/credentials/gmail-credentials.json
```

### Step 3: Update .env (1 min)
```
EMAIL_USER=your-email@gmail.com
```

### Step 4: Install (2 min)
```bash
cd mern-backend
npm install
```

### Step 5: Start (1 min)
```bash
npm start
```

### Step 6: Authorize (2 min)
```
Option A: http://localhost:5000/api/oauth/gmail-auth-url
Option B: Admin Dashboard → Gmail Setup
Sign in and grant permissions
```

### Step 7: Test (1 min)
```bash
node test-email.js
```

**Total: ~15 minutes** ✅

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `utils/emailService.js` | Email service |
| `routes/oauth.js` | OAuth2 routes |
| `components/Admin/GmailAuthSetup.tsx` | Auth UI |
| `credentials/gmail-credentials.json` | Google credentials |
| `tokens/gmail-token.json` | OAuth2 token |

---

## 🔗 IMPORTANT LINKS

| Link | Purpose |
|------|---------|
| https://console.cloud.google.com/ | Get credentials |
| http://localhost:5000/api/oauth/gmail-auth-url | Get auth URL |
| http://localhost:5000/api/oauth/oauth2callback | OAuth callback |

---

## 📚 DOCUMENTATION

| Document | Time | Purpose |
|----------|------|---------|
| GMAIL-QUICK-START.md | 5 min | Quick reference |
| GMAIL-SETUP-CHECKLIST.md | 15 min | Step-by-step |
| GMAIL-OAUTH2-SETUP.md | 20 min | Detailed guide |
| ARCHITECTURE-DIAGRAM.md | 10 min | System design |

---

## ✅ VERIFICATION

After setup, check:
- [ ] Backend running on port 5000
- [ ] Token file exists: `tokens/gmail-token.json`
- [ ] Test email sent successfully
- [ ] Emergency alert email received

---

## 🆘 QUICK HELP

| Issue | Solution |
|-------|----------|
| Credentials not found | Check `credentials/gmail-credentials.json` exists |
| No valid token | Run authorization process again |
| Email not sending | Check `EMAIL_USER` in .env |
| Authorization failed | Verify redirect URI matches exactly |

---

## 🔐 SECURITY CHECKLIST

- [ ] Credentials in .gitignore
- [ ] Tokens in .gitignore
- [ ] .env in .gitignore
- [ ] Never commit credentials
- [ ] Never share credentials file

---

## 📊 SYSTEM STATUS

```
✅ Backend email service
✅ OAuth2 routes
✅ Frontend UI
✅ Token management
✅ Email templates
✅ Security
✅ Documentation
✅ Ready to deploy
```

---

## 🚀 COMMANDS

```bash
# Install
npm install

# Start backend
npm start

# Test email
node test-email.js

# Get auth URL
curl http://localhost:5000/api/oauth/gmail-auth-url
```

---

## 📞 SUPPORT

- **Setup**: See GMAIL-SETUP-CHECKLIST.md
- **Details**: See GMAIL-OAUTH2-SETUP.md
- **Architecture**: See ARCHITECTURE-DIAGRAM.md
- **Troubleshooting**: See GMAIL-OAUTH2-SETUP.md (Troubleshooting)

---

## 🎯 NEXT STEPS

1. ✅ Read GMAIL-QUICK-START.md
2. ✅ Follow GMAIL-SETUP-CHECKLIST.md
3. ✅ Get Google credentials
4. ✅ Complete setup
5. ✅ Test system
6. ✅ Deploy

---

**Status**: ✅ Ready
**Cost**: $0 FREE
**Time**: ~15 min
**Security**: ⭐⭐⭐⭐⭐
