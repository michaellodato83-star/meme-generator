'use client';

import { useState } from 'react';
import { useDB } from '@/components/InstantDBProvider';

export default function Auth() {
  const db = useDB();
  
  if (!db) {
    return <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>Loading...</div>;
  }

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email'); // 'email' or 'code'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await db.auth.sendMagicCode({ email });
      setSuccess('Magic code sent to your email! Check your inbox.');
      setStep('code');
    } catch (err: any) {
      setError(err.body?.message || err.message || 'Failed to send magic code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await db.auth.signInWithMagicCode({ email, code });
      setSuccess('Sign in successful!');
      // User will be automatically redirected via useAuth hook
    } catch (err: any) {
      setError(err.body?.message || err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Sign In
      </h2>
      {step === 'email' ? (
        <form onSubmit={handleSendCode} className="auth-form">
          <p style={{ marginBottom: '15px', color: '#666', fontSize: '0.9rem' }}>
            Enter your email to receive a magic code
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', fontSize: '0.9rem', marginTop: '10px' }}>{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Magic Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="auth-form">
          <p style={{ marginBottom: '15px', color: '#666', fontSize: '0.9rem' }}>
            Enter the code sent to {email}
          </p>
          <input
            type="text"
            placeholder="Magic Code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
            style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }}
          />
          {error && <div style={{ color: 'red', fontSize: '0.9rem', marginTop: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', fontSize: '0.9rem', marginTop: '10px' }}>{success}</div>}
          <button type="submit" disabled={loading || code.length !== 6}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button
            type="button"
            onClick={handleBackToEmail}
            style={{
              marginTop: '10px',
              background: 'transparent',
              color: '#667eea',
              border: '1px solid #667eea',
            }}
          >
            Back to Email
          </button>
        </form>
      )}
    </div>
  );
}

