# 🏗️ Gmail OAuth2 System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     EMERGENCY ALERT SYSTEM                      │
│                    with Gmail OAuth2 Email                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Admin Dashboard                                 │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │  Gmail Setup Component                           │  │   │
│  │  │  ┌────────────────────────────────────────────┐ │  │   │
│  │  │  │ 1. Get Authorization URL                  │ │  │   │
│  │  │  │ 2. Authorize with Gmail                   │ │  │   │
│  │  │  │ 3. Check Authorization Status             │ │  │   │
│  │  │  └────────────────────────────────────────────┘ │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Emergency Alert Form                            │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ Create Alert → Send to Backend                  │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↕
                         HTTP/REST API
                              ↕
┌──────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         OAuth Routes (/api/oauth)                       │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ GET /gmail-auth-url                              │  │   │
│  │  │ GET /oauth2callback                              │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Email Service (emailService.js)                 │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ • OAuth2 Client Management                       │  │   │
│  │  │ • Token Loading/Saving                           │  │   │
│  │  │ • Token Refresh Logic                            │  │   │
│  │  │ • Email Sending                                  │  │   │
│  │  │ • HTML Template Formatting                       │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Local File Storage                             │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ credentials/gmail-credentials.json               │  │   │
│  │  │ tokens/gmail-token.json                          │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↕
                         OAuth2 Protocol
                              ↕
┌──────────────────────────────────────────────────────────────────┐
│                    GOOGLE OAUTH2 SERVER                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. User Authorization                                  │   │
│  │     • User signs in to Google                           │   │
│  │     • Grants email permissions                          │   │
│  │     • Returns authorization code                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  2. Token Exchange                                      │   │
│  │     • Backend sends authorization code                  │   │
│  │     • Google returns access token                       │   │
│  │     • Backend saves token locally                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  3. Email Sending                                       │   │
│  │     • Backend uses token to send email                  │   │
│  │     • Gmail API processes email                         │   │
│  │     • Email delivered to recipient                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    GMAIL INBOX                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📧 Emergency Alert Email                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ From: your-email@gmail.com                               │  │
│  │ To: emergency-contact@example.com                        │  │
│  │ Subject: 🚨 EMERGENCY ALERT - Immediate Action Required │  │
│  │                                                          │  │
│  │ 🚨 EMERGENCY ALERT                                      │  │
│  │                                                          │  │
│  │ John Doe needs help!                                    │  │
│  │ Help needed at my location                              │  │
│  │ 📍 Location: 123 Main St, City                          │  │
│  │                                                          │  │
│  │ 🆘 Emergency Numbers:                                   │  │
│  │ 🚓 Police: 100                                          │  │
│  │ 👮 Women Helpline: 1091                                 │  │
│  │ 🚑 Emergency: 112                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Authorization Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Initiates Authorization
┌──────────────────┐
│  Frontend UI     │
│  "Authorize"     │
│  Button Clicked  │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ GET /api/oauth/gmail-auth-url            │
│ Backend generates Google OAuth2 URL      │
└────────┬─────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│ Frontend receives authUrl                │
│ Opens in new window                      │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 2: User Signs In to Google
┌──────────────────────────────────────────┐
│ Google Login Page                        │
│ User enters credentials                  │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 3: User Grants Permissions
┌──────────────────────────────────────────┐
│ Google Permissions Screen                │
│ "Allow access to Gmail?"                 │
│ User clicks "Allow"                      │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 4: Google Redirects with Code
┌──────────────────────────────────────────┐
│ Redirect to:                             │
│ http://localhost:5000/api/oauth/         │
│ oauth2callback?code=AUTH_CODE            │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 5: Backend Exchanges Code for Token
┌──────────────────────────────────────────┐
│ Backend receives authorization code      │
│ Sends code to Google                     │
│ Google returns access token              │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 6: Token Saved Locally
┌──────────────────────────────────────────┐
│ Save to: tokens/gmail-token.json         │
│ Contains:                                │
│ • access_token                           │
│ • refresh_token                          │
│ • expiry_date                            │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 7: Authorization Complete
┌──────────────────────────────────────────┐
│ ✅ System Ready to Send Emails           │
│ Token will auto-refresh when needed      │
└──────────────────────────────────────────┘
```

---

## Email Sending Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL SENDING FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: User Creates Emergency Alert
┌──────────────────────────────────────────┐
│ Frontend                                 │
│ POST /api/emergency                      │
│ {                                        │
│   message: "Help needed",                │
│   location: { address: "..." }           │
│ }                                        │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 2: Backend Receives Alert
┌──────────────────────────────────────────┐
│ Backend Alert Handler                    │
│ • Save alert to database                 │
│ • Get user's emergency contacts          │
│ • Prepare email list                     │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 3: Load OAuth2 Token
┌──────────────────────────────────────────┐
│ Email Service                            │
│ • Load token from file                   │
│ • Check if expired                       │
│ • Refresh if needed                      │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 4: Create Email Transporter
┌──────────────────────────────────────────┐
│ Nodemailer + OAuth2                      │
│ • Initialize Gmail transporter           │
│ • Set OAuth2 credentials                 │
│ • Ready to send                          │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 5: Format Email Content
┌──────────────────────────────────────────┐
│ Email Template                           │
│ • User name                              │
│ • Alert message                          │
│ • Location details                       │
│ • Emergency numbers                      │
│ • HTML formatting                        │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 6: Send Email via Gmail API
┌──────────────────────────────────────────┐
│ Gmail API                                │
│ • Authenticate with token                │
│ • Send email                             │
│ • Return message ID                      │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 7: Email Delivered
┌──────────────────────────────────────────┐
│ Emergency Contact Inbox                  │
│ 📧 Email received                        │
│ ✅ Notification sent                     │
└────────┬─────────────────────────────────┘
         │
         ↓
Step 8: Update Dashboard
┌──────────────────────────────────────────┐
│ Admin Dashboard                          │
│ • Real-time alert update                 │
│ • Contact notification status            │
│ • Email delivery confirmation            │
└──────────────────────────────────────────┘
```

---

## File Structure Diagram

```
emergency-alert/
│
├── mern-backend/
│   ├── credentials/                    ← Create this
│   │   └── gmail-credentials.json      ← Download from Google
│   │
│   ├── tokens/                         ← Auto-created
│   │   └── gmail-token.json            ← Auto-created after auth
│   │
│   ├── utils/
│   │   ├── emailService.js             ← NEW: OAuth2 + Email
│   │   ├── notifications.js            ← Existing
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── oauth.js                    ← NEW: OAuth2 endpoints
│   │   ├── alerts.js                   ← Existing
│   │   └── ...
│   │
│   ├── server.js                       ← UPDATED
│   ├── package.json                    ← UPDATED
│   ├── .env                            ← UPDATE THIS
│   ├── .gitignore                      ← NEW
│   ├── GMAIL-OAUTH2-SETUP.md           ← NEW
│   └── GMAIL-QUICK-START.md            ← NEW
│
├── mern-frontend/
│   └── src/components/Admin/
│       ├── GmailAuthSetup.tsx          ← NEW: Auth UI
│       ├── AdminDashboard.tsx          ← Existing
│       └── ...
│
├── GMAIL-OAUTH2-COMPLETE-SETUP.md      ← NEW
├── GMAIL-SETUP-CHECKLIST.md            ← NEW
└── IMPLEMENTATION-SUMMARY.md           ← NEW
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

Layer 1: Credential Protection
┌──────────────────────────────────────────┐
│ credentials/gmail-credentials.json       │
│ • Stored locally only                    │
│ • In .gitignore (never committed)        │
│ • Never exposed to frontend              │
│ • Never sent over network                │
└──────────────────────────────────────────┘

Layer 2: Token Management
┌──────────────────────────────────────────┐
│ tokens/gmail-token.json                  │
│ • Stored locally only                    │
│ • In .gitignore (never committed)        │
│ • Auto-refresh mechanism                 │
│ • Expiry handling                        │
└──────────────────────────────────────────┘

Layer 3: OAuth2 Protocol
┌──────────────────────────────────────────┐
│ • Industry standard security             │
│ • No passwords stored                    │
│ • Secure token exchange                  │
│ • User consent required                  │
└──────────────────────────────────────────┘

Layer 4: Backend Isolation
┌──────────────────────────────────────────┐
│ • Credentials only on backend            │
│ • Frontend never sees tokens             │
│ • API endpoints protected                │
│ • Error messages sanitized               │
└──────────────────────────────────────────┘

Layer 5: Environment Variables
┌──────────────────────────────────────────┐
│ .env file (in .gitignore)                │
│ • EMAIL_USER stored securely             │
│ • Never hardcoded                        │
│ • Different per environment              │
└──────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW                           │
└─────────────────────────────────────────────────────────────────┘

User Creates Emergency Alert
         ↓
    Frontend sends POST /api/emergency
         ↓
    Backend receives alert data
         ↓
    Save alert to MongoDB
         ↓
    Get user's emergency contacts
         ↓
    For each contact:
         ├─ Load OAuth2 token from file
         ├─ Check token expiry
         ├─ Refresh if needed
         ├─ Create email transporter
         ├─ Format email content
         ├─ Send via Gmail API
         └─ Log result
         ↓
    Update alert with contact notifications
         ↓
    Emit real-time update to admin dashboard
         ↓
    Return success response to frontend
         ↓
    Emergency contacts receive emails
         ↓
    Admin sees alert in dashboard
         ↓
    System ready for next alert
```

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                COMPONENT INTERACTIONS                           │
└─────────────────────────────────────────────────────────────────┘

Frontend Components:
┌──────────────────────────────────────────┐
│ GmailAuthSetup.tsx                       │
│ • Get auth URL                           │
│ • Open auth window                       │
│ • Check status                           │
└────────┬─────────────────────────────────┘
         │
         ↓
Backend Routes:
┌──────────────────────────────────────────┐
│ routes/oauth.js                          │
│ • /gmail-auth-url                        │
│ • /oauth2callback                        │
└────────┬─────────────────────────────────┘
         │
         ↓
Email Service:
┌──────────────────────────────────────────┐
│ utils/emailService.js                    │
│ • createOAuth2Client()                   │
│ • getAccessToken()                       │
│ • createTransporter()                    │
│ • sendEmail()                            │
│ • sendEmergencyAlertEmail()              │
└────────┬─────────────────────────────────┘
         │
         ↓
File System:
┌──────────────────────────────────────────┐
│ credentials/gmail-credentials.json       │
│ tokens/gmail-token.json                  │
└────────┬─────────────────────────────────┘
         │
         ↓
Google APIs:
┌──────────────────────────────────────────┐
│ OAuth2 Server                            │
│ Gmail API                                │
└──────────────────────────────────────────┘
```

---

This architecture ensures:
✅ Security - Credentials protected
✅ Reliability - Token auto-refresh
✅ Scalability - Efficient email sending
✅ Maintainability - Clear separation of concerns
✅ User Experience - Simple authorization flow
