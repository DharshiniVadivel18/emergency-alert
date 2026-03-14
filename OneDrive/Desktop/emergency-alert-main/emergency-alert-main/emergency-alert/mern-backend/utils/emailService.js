const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = ['https://mail.google.com/'];
const TOKEN_PATH = path.join(__dirname, '../tokens/gmail-token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/gmail-credentials.json');

// Ensure directories exist
const ensureDirectories = () => {
  const tokensDir = path.join(__dirname, '../tokens');
  const credentialsDir = path.join(__dirname, '../credentials');
  
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, { recursive: true });
  }
  if (!fs.existsSync(credentialsDir)) {
    fs.mkdirSync(credentialsDir, { recursive: true });
  }
};

ensureDirectories();

// Load credentials from file
const loadCredentials = () => {
  try {
    if (fs.existsSync(CREDENTIALS_PATH)) {
      const content = fs.readFileSync(CREDENTIALS_PATH);
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error loading credentials:', error.message);
    return null;
  }
};

// Save token to file
const saveToken = (token) => {
  try {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
    console.log('✅ Token saved to', TOKEN_PATH);
  } catch (error) {
    console.error('Error saving token:', error.message);
  }
};

// Load token from file
const loadToken = () => {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const content = fs.readFileSync(TOKEN_PATH);
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error('Error loading token:', error.message);
    return null;
  }
};

// Create OAuth2 client
const createOAuth2Client = () => {
  const credentials = loadCredentials();
  
  if (!credentials) {
    console.warn('⚠️  Gmail credentials not found. Email service in demo mode.');
    return null;
  }

  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
  
  return new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
};

// Get authorization URL
const getAuthorizationUrl = () => {
  const oauth2Client = createOAuth2Client();
  
  if (!oauth2Client) {
    return null;
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return authUrl;
};

// Exchange authorization code for token
const getAccessToken = async (code) => {
  const oauth2Client = createOAuth2Client();
  
  if (!oauth2Client) {
    throw new Error('OAuth2 client not initialized');
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    saveToken(tokens);
    return tokens;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
};

// Create transporter with OAuth2
const createTransporter = async () => {
  const oauth2Client = createOAuth2Client();
  
  if (!oauth2Client) {
    console.warn('⚠️  Gmail OAuth2 not configured. Using demo mode.');
    return null;
  }

  const token = loadToken();
  
  if (!token) {
    console.warn('⚠️  No valid token found. Please authorize first.');
    return null;
  }

  oauth2Client.setCredentials(token);

  // Refresh token if expired
  if (token.expiry_date && token.expiry_date < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      saveToken(credentials);
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Error refreshing token:', error.message);
      return null;
    }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: oauth2Client._clientId,
      clientSecret: oauth2Client._clientSecret,
      refreshToken: token.refresh_token,
      accessToken: token.access_token,
    },
  });

  return transporter;
};

// Send email
const sendEmail = async (to, subject, htmlContent, textContent = '') => {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.log(`📧 DEMO EMAIL to ${to}:`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Message: ${textContent || htmlContent}`);
      return { success: true, demo: true };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: textContent || subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}. ID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Email Error to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Send emergency alert email
const sendEmergencyAlertEmail = async (to, userName, message, location) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #e74c3c;">
      <h2 style="color: #e74c3c; text-align: center;">🚨 EMERGENCY ALERT</h2>
      <div style="background: #fff5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
          <strong>${userName}</strong> needs help!
        </p>
        <p style="font-size: 14px; margin: 10px 0 0 0;">
          ${message}
        </p>
        <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">
          📍 Location: ${location?.address || 'Location not available'}
        </p>
      </div>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <h3 style="color: #2c3e50; margin-top: 0;">🆘 Emergency Numbers:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 5px 0;">🚓 Police: <strong>100</strong></li>
          <li style="padding: 5px 0;">👮 Women Helpline: <strong>1091</strong></li>
          <li style="padding: 5px 0;">🚑 Emergency: <strong>112</strong></li>
        </ul>
      </div>
      <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
        This is an automated emergency notification from Women Safety Portal
      </p>
    </div>
  `;

  return sendEmail(to, '🚨 EMERGENCY ALERT - Immediate Action Required', htmlContent, message);
};

module.exports = {
  sendEmail,
  sendEmergencyAlertEmail,
  getAuthorizationUrl,
  getAccessToken,
  createTransporter,
  loadToken,
  saveToken,
};
