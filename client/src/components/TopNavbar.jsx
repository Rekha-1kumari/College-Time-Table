import React from 'react';
import { 
  Building2, 
  Calendar, 
  LogOut, 
  Award, 
  Bell, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

export default function TopNavbar({ currentUser, onLogout, meta, onOpenAnnouncements }) {
  const getRoleClass = (role) => {
    switch (role) {
      case 'VC': return 'role-tag vc';
      case 'DEAN': return 'role-tag dean';
      case 'HOD': return 'role-tag hod';
      case 'ADMIN': return 'role-tag admin';
      case 'TEACHER': return 'role-tag teacher';
      case 'STUDENT': return 'role-tag student';
      default: return 'role-tag';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'VC': return 'Vice Chancellor';
      case 'DEAN': return 'Dean of School';
      case 'HOD': return 'Head of Department';
      case 'ADMIN': return 'Time Table Officer';
      case 'TEACHER': return 'Faculty Professor';
      case 'STUDENT': return 'Undergraduate Student';
      default: return role;
    }
  };

  return (
    <header className="top-navbar">
      <div className="nav-inner">
        {/* University Brand */}
        <div className="brand-section">
          <div className="brand-emblem">
            <Building2 size={24} />
          </div>
          <div className="brand-info">
            <h1>
              <span>{meta?.university?.name || 'C.V. Raman Global University'}</span>
              <span className="academic-badge">
                <Award size={12} />
                Autonomous • NAAC A++
              </span>
            </h1>
            <div className="brand-subtitle">
              {meta?.university?.currentSemester || 'Autumn Semester 2026-27'} | Integrated Academic Scheduling & Faculty ERP
            </div>
          </div>
        </div>

        {/* User Badge & Actions */}
        <div className="user-controls">
          {currentUser && (
            <>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                onClick={onOpenAnnouncements}
                title="University Circulars & Announcements"
              >
                <Bell size={15} color="#0284c7" />
                <span>Circulars</span>
              </button>

              <div className="user-badge-btn" title={`${currentUser.name} - ${currentUser.title}`}>
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                  alt={currentUser.name} 
                  className="avatar-img"
                />
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                    <span className={getRoleClass(currentUser.role)}>
                      {getRoleLabel(currentUser.role)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {currentUser.department}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={onLogout} 
                className="btn-secondary" 
                style={{ padding: '0.4rem 0.75rem', color: 'var(--danger)', borderColor: '#fecaca' }}
                title="Log out of institutional portal"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
