import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { api, setAuthToken, setCurrentUser } from '../api/client';

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsPendingApproval(false);
    setLoading(true);

    try {
      const data = await api.login({ email, password });
      setAuthToken(data.token);
      setCurrentUser(data.user);
      onLoginSuccess(data.user);
    } catch (err) {
      if (err.data?.error === 'ACCOUNT_PENDING_APPROVAL') {
        setIsPendingApproval(true);
      } else {
        setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail, testPass) => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrorMsg('');
    setIsPendingApproval(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, #f0f7ff 0%, #ffffff 70%, #e0f2fe 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <button 
          onClick={() => onNavigate('landing')}
          style={{ background: 'none', border: 'none', color: 'var(--sky-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.25rem' }}
        >
          <ChevronLeft size={16} />
          <span>Back to University Home</span>
        </button>

        <div className="cgu-card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 50,
              height: 50,
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              margin: '0 auto 0.75rem',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
            }}>
              <Building2 size={28} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Institutional Sign In
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              C.V. Raman Global University Timetable & Academic ERP
            </p>
          </div>

          {/* Pending Approval Warning Alert */}
          {isPendingApproval && (
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem',
              marginBottom: '1.25rem',
              color: '#92400e',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Clock size={16} />
                <span>Account Awaiting Admin Approval</span>
              </div>
              <p style={{ lineHeight: 1.4 }}>
                Your institutional registration is currently pending review by the <strong>Timetable Coordinator / Academic Admin</strong>. You will be able to sign in as soon as an administrator verifies and activates your account.
              </p>
            </div>
          )}

          {errorMsg && !isPendingApproval && (
            <div className="conflict-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                University Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--sky-primary)" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@cgu-odisha.ac.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="cgu-input"
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--sky-primary)" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="cgu-input"
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.7rem', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? 'Validating Credentials...' : 'Sign In to Portal'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sky-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.65rem' }}>
              <Sparkles size={14} />
              <span>One-Click Test Accounts:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@cgu-odisha.ac.in', 'password123')}
                className="demo-pill-btn"
                style={{ justifyContent: 'center', padding: '0.4rem 0.2rem' }}
              >
                ⚙️ Timetable Coordinator
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('priya.sharma@cgu-odisha.ac.in', 'password123')}
                className="demo-pill-btn"
                style={{ justifyContent: 'center', padding: '0.4rem 0.2rem' }}
              >
                👩‍🏫 Faculty Dr. Priya
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('alok.tripathy@cgu-odisha.ac.in', 'password123')}
                style={{ background: 'none', border: 'none', color: '#b45309', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline' }}
                title="Test signing in with an account that is still pending approval"
              >
                Test: Try logging in as Dr. Alok (Pending Approval)
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span>Need an institutional account? </span>
            <button
              onClick={() => onNavigate('register')}
              style={{ background: 'none', border: 'none', color: 'var(--sky-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Register Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
