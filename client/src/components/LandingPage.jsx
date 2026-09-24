import React from 'react';
import { 
  Building2, 
  CalendarRange, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Award,
  BookOpen
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, #f0f7ff 0%, #ffffff 65%, #e0f2fe 100%)' }}>
      {/* Header Bar */}
      <header style={{ borderBottom: '1px solid var(--border-light)', background: '#ffffff', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 42,
              height: 42,
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
            }}>
              <Building2 size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                C.V. Raman Global University
              </h1>
              <div style={{ fontSize: '0.78rem', color: 'var(--sky-primary)', fontWeight: 600 }}>
                Academic Timetable & Faculty Scheduling Portal • Autumn 2026-27
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => onNavigate('login')}
              className="btn-secondary"
              style={{ fontSize: '0.84rem' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="btn-primary"
              style={{ fontSize: '0.84rem' }}
            >
              <span>Faculty / Student Registration</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-sky-light)', color: 'var(--sky-primary)', padding: '0.35rem 0.85rem', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 700, border: '1px solid var(--border-sky)', marginBottom: '1.25rem' }}>
            <Award size={14} />
            <span>Autonomous Engineering & Technology Scheduling Framework</span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            Ground-Level Timetable Management & <span style={{ color: 'var(--sky-primary)' }}>15-Faculty Workload Optimizer</span>
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Streamlining routine creation for the Department Timetable Coordinator. Automatically prevents room collisions, balances 15 department teachers' weekly credits, coordinates theory & 3-hour lab blocks, and gates account creation with administrator approval.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('login')}
              className="btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <span>Access Timetable System</span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <span>Register New Faculty Account</span>
            </button>
          </div>
        </div>

        {/* 3 Core Architecture Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div className="cgu-card" style={{ padding: '1.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-sky-light)', color: 'var(--sky-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <UserCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              15 Department Teachers Load Balance
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Track teaching hours in real-time across all 15 faculty members. AICTE credit caps (12-16 hrs) ensure fair distribution between theory lectures and laboratory blocks.
            </p>
          </div>

          <div className="cgu-card" style={{ padding: '1.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-sky-light)', color: 'var(--sky-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CalendarRange size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Triple-Collision Prevention Engine
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Real-time conflict detection prevents faculty double-booking, room overlap, and student batch clashes before slots are written to the master routine.
            </p>
          </div>

          <div className="cgu-card" style={{ padding: '1.5rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Gated Administrator Approvals
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              New signups are held in a secure verification queue. Accounts only activate once authorized by the Timetable Coordinator / Academic Officer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '2rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          C.V. Raman Global University • Department of Computer Science & Engineering • Academic Portal 2026-27
        </div>
      </main>
    </div>
  );
}
