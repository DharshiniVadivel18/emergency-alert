import React, { useState } from 'react';
import axios from 'axios';

const GmailAuthSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'authorized' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const getAuthorizationUrl = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/oauth/gmail-auth-url');
      setAuthUrl(response.data.authUrl);
      setStatus('idle');
      setMessage('Click the button below to authorize Gmail');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to get authorization URL');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = () => {
    if (authUrl) {
      window.open(authUrl, '_blank', 'width=500,height=600');
      setMessage('✅ Authorization window opened. Please complete the authorization process.');
    }
  };

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      // Try to send a test email to verify authorization
      const response = await axios.post('http://localhost:5000/api/test-email', {
        to: 'test@example.com',
        subject: 'Gmail OAuth2 Test',
        message: 'If you received this, Gmail OAuth2 is working!'
      });
      
      if (response.data.success) {
        setStatus('authorized');
        setMessage('✅ Gmail OAuth2 is authorized and working!');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage('Gmail not yet authorized. Please complete the authorization process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📧 Gmail OAuth2 Setup</h2>
        
        <div style={styles.section}>
          <h3>Step 1: Get Authorization URL</h3>
          <button 
            onClick={getAuthorizationUrl}
            disabled={loading}
            style={{...styles.button, opacity: loading ? 0.6 : 1}}
          >
            {loading ? 'Loading...' : 'Get Authorization URL'}
          </button>
        </div>

        {authUrl && (
          <div style={styles.section}>
            <h3>Step 2: Authorize Gmail</h3>
            <button 
              onClick={handleAuthorize}
              style={{...styles.button, backgroundColor: '#4285F4'}}
            >
              🔐 Authorize with Gmail
            </button>
            <p style={styles.info}>
              A new window will open. Sign in and grant permissions.
            </p>
          </div>
        )}

        <div style={styles.section}>
          <h3>Step 3: Verify Authorization</h3>
          <button 
            onClick={checkAuthStatus}
            disabled={loading}
            style={{...styles.button, backgroundColor: '#34A853', opacity: loading ? 0.6 : 1}}
          >
            {loading ? 'Checking...' : 'Check Authorization Status'}
          </button>
        </div>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: status === 'authorized' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#e7f3ff',
            borderColor: status === 'authorized' ? '#28a745' : status === 'error' ? '#dc3545' : '#0066cc',
            color: status === 'authorized' ? '#155724' : status === 'error' ? '#721c24' : '#004085'
          }}>
            {message}
          </div>
        )}

        <div style={styles.instructions}>
          <h4>📋 Instructions:</h4>
          <ol>
            <li>Click "Get Authorization URL"</li>
            <li>Click "Authorize with Gmail"</li>
            <li>Sign in with your Gmail account</li>
            <li>Grant the requested permissions</li>
            <li>You'll be redirected back automatically</li>
            <li>Click "Check Authorization Status" to verify</li>
          </ol>
        </div>

        <div style={styles.notes}>
          <h4>📝 Notes:</h4>
          <ul>
            <li>This setup is required only once</li>
            <li>Tokens are stored securely on the server</li>
            <li>Your Gmail account will be used to send emergency alerts</li>
            <li>Emergency contacts will receive real emails</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '30px'
  },
  title: {
    color: '#333',
    textAlign: 'center' as const,
    marginBottom: '30px'
  },
  section: {
    marginBottom: '25px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    width: '100%',
    transition: 'background-color 0.3s'
  },
  info: {
    marginTop: '10px',
    color: '#666',
    fontSize: '14px'
  },
  message: {
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid',
    marginBottom: '20px',
    marginTop: '20px'
  },
  instructions: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  notes: {
    backgroundColor: '#f0f8ff',
    padding: '15px',
    borderRadius: '4px',
    borderLeft: '4px solid #0066cc'
  }
};

export default GmailAuthSetup;
