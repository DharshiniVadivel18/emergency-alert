const express = require('express');
const { getAuthorizationUrl, getAccessToken } = require('../utils/emailService');

const router = express.Router();

// Get authorization URL
router.get('/gmail-auth-url', (req, res) => {
  try {
    const authUrl = getAuthorizationUrl();
    
    if (!authUrl) {
      return res.status(400).json({
        message: 'Gmail credentials not configured. Please add credentials/gmail-credentials.json'
      });
    }

    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle OAuth2 callback
router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ message: 'No authorization code provided' });
  }

  try {
    await getAccessToken(code);
    res.json({
      message: '✅ Gmail authorization successful!',
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Authorization failed',
      error: error.message
    });
  }
});

module.exports = router;
