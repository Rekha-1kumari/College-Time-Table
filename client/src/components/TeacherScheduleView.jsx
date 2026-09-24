import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, LogOut, Building2, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export default function TeacherScheduleView({ currentUser, onLogout, meta }) {
  const [mySlots, setMySlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeacherSlots = async () => {
      setLoading(true);
      try {
        const res = await api.getTimetable({ teacherId: currentUser.id });
        setMySlots(res.slots || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherSlots();
  }, [currentUser]);

  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = mySlots.filter(s => s.day.toLowerCase() === currentDayName.toLowerCase());

  return (
    <div className="app-container">
      <header className="top-navbar">
        <div className="nav-inner">
          <div className="brand-section">
            <div className="brand-emblem">
              <Building2 size={24} />
            </div>
            <div className="brand-info">
              <h1>
                <span>C.V. Raman Global University</span>
                <span className="academic-badge">Faculty Portal</span>
              </h1>
              <div className="brand-subtitle">
                Department of Computer Science & Engineering
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--sky-primary)' }}>{currentUser.designation} • {currentUser.empCode}</div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.75rem', color: 'var(--danger)', borderColor: '#fecaca', fontSize: '0.8rem' }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-wrapper">
        {/* Banner */}
        <div className="cgu-card punch-card" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Welcome, {currentUser.name}
            </h2>
            <p style={{ color: 'var(--sky-primary)', fontSize: '0.84rem', fontWeight: 600 }}>
              Specialization: {currentUser.specialization || 'Computer Science & Engineering'}
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Allocated Weekly Load: <strong>{mySlots.length} Slots</strong> • Account Status: <strong style={{ color: 'var(--success)' }}>Active & Verified</strong>
            </div>
          </div>

          <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            Print My Routine
          </button>
        </div>

        {/* Today's Classes */}
        <div className="cgu-card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header-styled">
            <h3>
              <Clock size={18} color="#0284c7" />
              <span>Today's Classes ({currentDayName})</span>
            </h3>
            <span className="academic-badge">{todayClasses.length} Lectures</span>
          </div>

          <div className="card-body">
            {todayClasses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <Calendar size={36} color="#bae6fd" style={{ margin: '0 auto 0.5rem' }} />
                <p>No lectures scheduled for today. Great time for lab prep or academic research!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {todayClasses.map(slot => (
                  <div key={slot.id} className="slot-class-card" style={{ padding: '0.9rem' }}>
                    <span className="slot-subject-code">{slot.subjectCode}</span>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0.35rem 0' }}>
                      {slot.subjectName}
                    </h4>
                    <div className="slot-meta" style={{ gap: '0.35rem', marginTop: '0.5rem' }}>
                      <div className="slot-meta-item">
                        <Clock size={13} color="#0284c7" />
                        <span>{slot.timeSlotLabel}</span>
                      </div>
                      <div className="slot-meta-item">
                        <MapPin size={13} color="#0284c7" />
                        <span><strong>{slot.roomId}</strong> ({slot.roomName})</span>
                      </div>
                      <div className="slot-meta-item">
                        <Users size={13} color="#0284c7" />
                        <span>Batch: <strong>{slot.sectionId}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full Weekly Routine */}
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <Calendar size={18} color="#0284c7" />
              <span>My Complete Weekly Teaching Routine</span>
            </h3>
          </div>

          <div className="card-body">
            <div className="timetable-scroll-wrapper">
              <table className="tt-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Period</th>
                    <th>Course Code & Title</th>
                    <th>Batch / Section</th>
                    <th>Classroom / Lab</th>
                  </tr>
                </thead>
                <tbody>
                  {mySlots.map(slot => (
                    <tr key={slot.id}>
                      <td className="day-header-cell">{slot.day}</td>
                      <td>
                        <strong>{slot.slotId}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{slot.timeSlotLabel}</div>
                      </td>
                      <td>
                        <span className="slot-subject-code">{slot.subjectCode}</span>
                        <div style={{ fontWeight: 600 }}>{slot.subjectName}</div>
                      </td>
                      <td>
                        <strong>{slot.sectionId}</strong>
                      </td>
                      <td>
                        <strong>{slot.roomId}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{slot.roomName}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
