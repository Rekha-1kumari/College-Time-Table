import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Layers, 
  AlertCircle,
  FileCheck,
  CalendarCheck
} from 'lucide-react';
import { api } from '../api/client';

export default function DeanHODDashboard({ currentUser, meta }) {
  const [substitutions, setSubstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const data = await api.getSubstitutions();
      setSubstitutions(data.substitutions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateSubstitutionStatus(id, status);
      setStatusMsg(`Faculty proxy assignment marked as ${status}. Timetable synced.`);
      setTimeout(() => setStatusMsg(''), 3000);
      fetchSubs();
    } catch (err) {
      alert(err.message);
    }
  };

  const isDean = currentUser.role === 'DEAN';
  const roleTitle = isDean ? 'Dean of School' : 'Head of Department (HOD)';
  const deptFilter = isDean ? 'All Engineering Departments' : `${currentUser.department} Department`;

  return (
    <div>
      {/* Dean/HOD Banner */}
      <div className="cgu-card punch-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f5f3ff 50%, #f0f7ff 100%)', borderColor: '#ddd6fe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 16px rgba(124, 58, 237, 0.25)'
          }}>
            <Layers size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentUser.name}
              </h2>
              <span className={`role-tag ${isDean ? 'dean' : 'hod'}`}>
                {roleTitle}
              </span>
            </div>
            <p style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.85rem' }}>
              {deptFilter} • Academic Quality & Resource Allocation Council
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Course-Faculty Mappings • Proxy Substitution Approvals • Departmental Adherence
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="academic-badge" style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#7c3aed' }}>
            <CalendarCheck size={14} />
            Academic Cycle 2026-27 Active
          </span>
        </div>
      </div>

      {statusMsg && (
        <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.75rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.84rem' }}>
          ✓ {statusMsg}
        </div>
      )}

      {/* 2-Column: Proxy Approvals & Course Offerings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Substitution & Proxy Approval Workflow */}
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <Clock size={18} color="#7c3aed" />
              <span>Faculty Leave & Class Proxy Authorizations</span>
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              {substitutions.filter(s => s.status === 'Pending').length} Pending
            </span>
          </div>
          <div className="card-body">
            {substitutions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <CheckCircle size={40} color="#a78bfa" style={{ margin: '0 auto 0.5rem' }} />
                <p>No active substitution requests at this time.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {substitutions.map(sub => (
                  <div key={sub.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.9rem', background: sub.status === 'Pending' ? '#fffbeb' : '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <span className="slot-subject-code">{sub.subjectCode}</span>
                        <strong style={{ marginLeft: '0.4rem', fontSize: '0.88rem' }}>{sub.sectionId}</strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          ({sub.day} • {sub.slotId})
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: sub.status === 'Approved' ? 'var(--success-bg)' : sub.status === 'Pending' ? '#fef3c7' : 'var(--danger-bg)',
                        color: sub.status === 'Approved' ? 'var(--success)' : sub.status === 'Pending' ? 'var(--warning)' : 'var(--danger)'
                      }}>
                        {sub.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <div>Original Faculty: <strong>{sub.originalTeacherName}</strong></div>
                      <div>Assigned Proxy: <strong style={{ color: '#7c3aed' }}>{sub.substituteTeacherName}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Reason: <em>"{sub.reason}"</em>
                      </div>
                    </div>

                    {sub.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #fde68a', paddingTop: '0.5rem' }}>
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'Approved')}
                          className="btn-primary"
                          style={{ fontSize: '0.76rem', padding: '0.3rem 0.7rem', background: '#059669', borderColor: '#059669' }}
                        >
                          <CheckCircle size={13} />
                          Approve Proxy
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'Rejected')}
                          className="btn-danger-outline"
                          style={{ fontSize: '0.76rem', padding: '0.3rem 0.7rem' }}
                        >
                          <XCircle size={13} />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Department Course Allocations & L-T-P Credits */}
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <BookOpen size={18} color="#0284c7" />
              <span>Department Curriculum & Credit Distribution</span>
            </h3>
            <span className="academic-badge">Autonomous Syllabus</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {meta?.subjects?.map(s => (
                <div key={s.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-sky-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-sky-subtle)' }}>
                  <div>
                    <span className="slot-subject-code">{s.code}</span>
                    <strong style={{ marginLeft: '0.4rem', fontSize: '0.84rem' }}>{s.name}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Dept: {s.dept} • Structure (L-T-P): <strong>{s.ltp}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--sky-primary)' }}>
                      {s.credits} Credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
