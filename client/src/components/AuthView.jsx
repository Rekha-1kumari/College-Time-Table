import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Phone,
  AlertCircle
} from 'lucide-react';
import { api, setAuthToken, setCurrentUser } from '../api/client';

export default function AuthView({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Form
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [department, setDepartment] = useState('CSE');
  const [school, setSchool] = useState('Faculty of Engineering & Technology');
  const [regNo, setRegNo] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      setAuthToken(data.token);
      setCurrentUser(data.user);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register({
        name,
        email: regEmail,
        password: regPassword,
        role,
        department,
        school,
        phone,
        regNo: role === 'STUDENT' ? regNo : undefined,
        empCode: role !== 'STUDENT' ? empCode : undefined
      });
      setAuthToken(data.token);
      setCurrentUser(data.user);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Account registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo Fast Login Handler
  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    // trigger auto login
    setTimeout(() => {
      api.login({ email: demoEmail, password: 'password123' })
        .then(data => {
          setAuthToken(data.token);
          setCurrentUser(data.user);
          onLoginSuccess(data.user);
        })
        .catch(err => setError(err.message));
    }, 100);
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
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '640px' }}>
        <div style={{
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          margin: '0 auto 1rem',
          boxShadow: '0 8px 20px rgba(14, 165, 233, 0.25)'
        }}>
          <Building2 size={32} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          C.V. Raman Global University
        </h1>
        <p style={{ color: 'var(--sky-primary)', fontWeight: 600, fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Academic Timetable, Faculty Scheduling & Digital Logbook ERP
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '0.35rem' }}>
          Autonomous Academic Cycle (Autumn 2026-27) • NAAC A++ Accredited Institution
        </p>
      </div>

      {/* Main Form Card */}
      <div className="cgu-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-sky-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.25rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-sky)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? 'var(--sky-primary)' : 'var(--text-muted)',
              boxShadow: mode === 'login' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Institutional Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.55rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? 'var(--sky-primary)' : 'var(--text-muted)',
              boxShadow: mode === 'register' ? 'var(--shadow-subtle)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Register / Create Account
          </button>
        </div>

        {error && (
          <div className="conflict-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                University Email ID
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--sky-primary)" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="email"
                  required
                  placeholder="e.g. vc@cgu-odisha.ac.in or teacher@cgu-odisha.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cgu-input"
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.74rem', color: 'var(--sky-primary)', cursor: 'pointer' }}>
                  Demo: password123
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--sky-primary)" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Authenticating Credentials...' : 'Sign In to Academic Portal'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Ramesh Kumar"
                value={name}
                onChange={e => setName(e.target.value)}
                className="cgu-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Institutional Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="cgu-select"
                style={{ width: '100%' }}
              >
                <option value="TEACHER">Faculty / Teacher</option>
                <option value="STUDENT">Student</option>
                <option value="HOD">Head of Department (HOD)</option>
                <option value="ADMIN">Time Table Coordinator / Admin</option>
                <option value="DEAN">Dean of School</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="cgu-select"
                  style={{ width: '100%' }}
                >
                  <option value="CSE">Computer Science & Engg</option>
                  <option value="AIML">Artificial Intelligence & ML</option>
                  <option value="ECE">Electronics & Comm Engg</option>
                  <option value="MBA">Management Studies</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {role === 'STUDENT' ? 'Reg / Roll No.' : 'Employee Code'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'STUDENT' ? 'e.g. 2301297099' : 'e.g. CGU-FAC-2024'}
                  value={role === 'STUDENT' ? regNo : empCode}
                  onChange={e => role === 'STUDENT' ? setRegNo(e.target.value) : setEmpCode(e.target.value)}
                  className="cgu-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="name@cgu-odisha.ac.in"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                className="cgu-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Set Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="cgu-input"
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.7rem', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating University Account...' : 'Complete Institutional Registration'}
              <CheckCircle2 size={16} />
            </button>
          </form>
        )}

        {/* Quick Demo Access Bar */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--sky-primary)', marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>Instant Role Simulation (1-Click Test):</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('vc@cgu-odisha.ac.in')}
              className="demo-pill-btn"
              style={{ justifyContent: 'center', padding: '0.4rem' }}
            >
              👑 Vice Chancellor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('dean.engineering@cgu-odisha.ac.in')}
              className="demo-pill-btn"
              style={{ justifyContent: 'center', padding: '0.4rem' }}
            >
              🏛️ Dean Engineering
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('hod.cse@cgu-odisha.ac.in')}
              className="demo-pill-btn"
              style={{ justifyContent: 'center', padding: '0.4rem' }}
            >
              📋 HOD (CSE)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('timetable.officer@cgu-odisha.ac.in')}
              className="demo-pill-btn"
              style={{ justifyContent: 'center', padding: '0.4rem' }}
            >
              ⚙️ Timetable Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya.sharma@cgu-odisha.ac.in')}
              className="demo-pill-btn"
              style={{ justifyContent: 'center', padding: '0.4rem' }}
            >
              👩‍🏫 Faculty (Dr. Priya)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('rohit.behera@cgu.edu.in')}
              className="demo-pill-btn"
              style={{ justifyContent: 'center', padding: '0.4rem' }}
            >
              🎒 Student (Rohit)
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        © 2026 C.V. Raman Global University • Timetable, Scheduling & Academic Management System
      </div>
    </div>
  );
}
