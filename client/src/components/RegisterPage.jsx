import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  ChevronLeft,
  Clock
} from 'lucide-react';
import { api } from '../api/client';

export default function RegisterPage({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [department, setDepartment] = useState('CSE');
  const [specialization, setSpecialization] = useState('');
  const [empCode, setEmpCode] = useState('');
  const [regNo, setRegNo] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await api.register({
        name,
        email,
        password,
        role,
        department,
        designation: role === 'TEACHER' ? designation : 'Student Scholar',
        specialization: role === 'TEACHER' ? specialization : undefined,
        empCode: role === 'TEACHER' ? empCode : undefined,
        regNo: role === 'STUDENT' ? regNo : undefined,
        phone
      });
      setRegisteredSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, #f0f7ff 0%, #ffffff 70%, #e0f2fe 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <button 
          onClick={() => onNavigate('landing')}
          style={{ background: 'none', border: 'none', color: 'var(--sky-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', marginBottom: '1.25rem' }}
        >
          <ChevronLeft size={16} />
          <span>Back to University Home</span>
        </button>

        <div className="cgu-card" style={{ padding: '2rem' }}>
          {registeredSuccess ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: 60,
                height: 60,
                background: 'var(--success-bg)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                margin: '0 auto 1.25rem'
              }}>
                <Clock size={32} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Registration Submitted for Verification
              </h2>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Your institutional registration has been submitted successfully with email <strong>{email}</strong>.
              </p>

              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                textAlign: 'left',
                color: '#92400e',
                fontSize: '0.82rem',
                marginBottom: '1.5rem'
              }}>
                <strong>🔒 Security & Authorization Policy:</strong>
                <p style={{ marginTop: '0.35rem', lineHeight: 1.4 }}>
                  In accordance with university regulations, your account must be verified and approved by the <strong>Chief Timetable Coordinator / Academic Admin</strong> before you can sign in. The coordinator has been notified in their approval queue.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => onNavigate('login')}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Proceed to Sign In Page
                </button>
                <button
                  onClick={() => onNavigate('landing')}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  margin: '0 auto 0.75rem',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
                }}>
                  <Building2 size={26} />
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Institutional Registration
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  New Faculty & Student Academic Onboarding
                </p>
              </div>

              {errorMsg && (
                <div className="conflict-box" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Subhendu Mohapatra"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Institutional Role
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="cgu-select"
                      style={{ width: '100%' }}
                    >
                      <option value="TEACHER">Faculty Member / Professor</option>
                      <option value="STUDENT">Student Scholar</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="cgu-select"
                      style={{ width: '100%' }}
                    >
                      <option value="CSE">Computer Science & Engineering</option>
                    </select>
                  </div>
                </div>

                {role === 'TEACHER' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Designation
                      </label>
                      <select
                        value={designation}
                        onChange={e => setDesignation(e.target.value)}
                        className="cgu-select"
                        style={{ width: '100%' }}
                      >
                        <option value="Professor">Professor (12 hrs cap)</option>
                        <option value="Associate Professor">Associate Professor (14 hrs cap)</option>
                        <option value="Assistant Professor">Assistant Professor (16 hrs cap)</option>
                        <option value="Visiting Lecturer">Visiting Faculty</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Employee ID Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CGU-CSE-116"
                        value={empCode}
                        onChange={e => setEmpCode(e.target.value)}
                        className="cgu-input"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Student Registration / Roll No
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2301297055"
                      value={regNo}
                      onChange={e => setRegNo(e.target.value)}
                      className="cgu-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                )}

                {role === 'TEACHER' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Primary Subject Specialization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Compiler Design / High Performance Computing / Web Tech"
                      value={specialization}
                      onChange={e => setSpecialization(e.target.value)}
                      className="cgu-input"
                      style={{ width: '100%' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    University Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@cgu-odisha.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Set Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ background: 'var(--bg-sky-subtle)', border: '1px solid var(--border-sky)', borderRadius: 6, padding: '0.65rem 0.85rem', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  ℹ️ <strong>Admin Gate Notice:</strong> To maintain institutional security, your account will be activated only after the Timetable Coordinator verifies your department credentials.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.7rem', justifyContent: 'center', marginTop: '0.25rem' }}
                >
                  {loading ? 'Submitting Registration...' : 'Submit Registration for Admin Approval'}
                  <ArrowRight size={16} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    style={{ background: 'none', border: 'none', color: 'var(--sky-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
