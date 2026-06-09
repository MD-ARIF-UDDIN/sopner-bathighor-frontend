import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('ইউজারনেম এবং পাসওয়ার্ড পূরণ করুন');
      return;
    }

    setLoadingState(true);

    const promise = login(username, password);

    toast.promise(promise, {
      loading: 'লগইন করা হচ্ছে...',
      success: 'সফলভাবে লগইন হয়েছে!',
      error: (err) => err.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
    });

    try {
      await promise;
      navigate('/');
    } catch (err) { } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="login-bg" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Animated floating blobs using theme colors */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '400px', margin: '0 auto' }}>

        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src="/main_logo.png"
            alt="Logo"
            className="login-logo"
            style={{
              width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover',
              border: '3px solid rgba(255,255,255,0.25)',
              backgroundColor: '#fff',
              padding: '2px',
              display: 'inline-block'
            }}
          />
          <h1 className="login-somiti-title">
            স্বপ্নের বাতিঘর 
          </h1>
        </div>

        {/* Login Card */}
        <div className="login-card" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.22)'
        }}>
          <h2 style={{
            marginBottom: '24px', textAlign: 'center', fontSize: '1.4rem',
            color: 'var(--primary-dark)', fontWeight: '700'
          }}>লগইন করুন</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" htmlFor="username" style={{ fontWeight: '600', color: '#334155' }}>ইউজারনেম</label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="আপনার ইউজারনেম"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loadingState}
                autoCapitalize="none"
                style={{
                  backgroundColor: '#fefce8',
                  border: '1px solid #d6b87d',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                  e.target.style.backgroundColor = '#fffbeb';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d6b87d';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#fefce8';
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label" htmlFor="password" style={{ fontWeight: '600', color: '#334155' }}>পাসওয়ার্ড</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loadingState}
                style={{
                  backgroundColor: '#fefce8',
                  border: '1px solid #d6b87d',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                  e.target.style.backgroundColor = '#fffbeb';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d6b87d';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#fefce8';
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingState}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                gap: '8px',
                background: loadingState
                  ? 'var(--primary-dark)'
                  : 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 50%, var(--primary-dark) 100%)',
                border: 'none',
                boxShadow: '0 4px 14px rgba(180, 83, 9, 0.38)',
                transition: 'transform 0.2s, box-shadow 0.2s, background 0.3s'
              }}
              onMouseEnter={(e) => {
                if (!loadingState) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(180, 83, 9, 0.48)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingState) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(180, 83, 9, 0.38)';
                }
              }}
            >
              <LogIn size={20} />
              <span>{loadingState ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer" style={{ marginTop: '28px', textAlign: 'center', fontSize: '0.85rem' }}>
          <div style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '8px' }}>
            © {new Date().getFullYear()} স্বপ্নের বাতিঘর 
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            Developed by: <span style={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.88)' }}>Md Arif Uddin</span> |{' '}
            <a
              href="https://wa.me/8801825334505"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'none', fontWeight: '700', marginLeft: '2px' }}
            >
              01825334505 (WhatsApp)
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
