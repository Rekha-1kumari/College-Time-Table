import React from 'react';
import { 
  Crown, 
  BookOpen, 
  GraduationCap, 
  CalendarRange, 
  UserCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function DemoRoleSwitcher({ currentRole, onSelectDemoUser, activeUserId }) {
  const demoAccounts = [
    {
      id: 'vc-01',
      role: 'VC',
      name: 'Prof. B.K. Sahoo',
      label: 'Vice Chancellor (VC)',
      icon: Crown,
      color: '#db2777'
    },
    {
      id: 'dean-fet',
      role: 'DEAN',
      name: 'Prof. R.K. Mohapatra',
      label: 'Dean (Engineering)',
      icon: Layers,
      color: '#7c3aed'
    },
    {
      id: 'hod-cse',
      role: 'HOD',
      name: 'Dr. Suchismita Rautray',
      label: 'HOD (CSE Dept)',
      icon: BookOpen,
      color: '#4338ca'
    },
    {
      id: 'admin-tt',
      role: 'ADMIN',
      name: 'Er. Manoj Pattnaik',
      label: 'Time Table Officer',
      icon: CalendarRange,
      color: '#c2410c'
    },
    {
      id: 'fac-101',
      role: 'TEACHER',
      name: 'Dr. Priya Sharma',
      label: 'Faculty (AI & Algo)',
      icon: UserCheck,
      color: '#0284c7'
    },
    {
      id: 'stu-501',
      role: 'STUDENT',
      name: 'Rohit Behera',
      label: 'Student (CSE 5A)',
      icon: GraduationCap,
      color: '#047857'
    }
  ];

  return (
    <div className="demo-switcher-bar">
      <div className="demo-switcher-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--sky-primary)' }}>
          <Sparkles size={16} />
          <span>Hierarchy Preview Mode:</span>
          <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Switch role to test live access & redirection:</span>
        </div>

        <div className="demo-pills">
          {demoAccounts.map(acc => {
            const Icon = acc.icon;
            const isActive = activeUserId === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => onSelectDemoUser(acc.id)}
                className={`demo-pill-btn ${isActive ? 'active' : ''}`}
                style={isActive ? { background: acc.color, borderColor: acc.color, color: '#fff' } : {}}
              >
                <Icon size={13} />
                <span>{acc.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
