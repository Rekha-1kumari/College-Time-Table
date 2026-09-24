import React, { useState, useEffect } from 'react';
import { 
  CalendarRange, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Printer, 
  ShieldAlert, 
  Building2, 
  Clock, 
  Users, 
  BookOpen,
  MapPin
} from 'lucide-react';
import { api } from '../api/client';

export default function AdminTimetableScheduler({ currentUser, meta }) {
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSection, setFilterSection] = useState('CSE-5A');
  const [filterDay, setFilterDay] = useState('All');
  const [filterRoom, setFilterRoom] = useState('All');

  // Add Slot Modal & Conflict Engine State
  const [showAddModal, setShowAddModal] = useState(false);
  const [candidateSlot, setCandidateSlot] = useState({
    day: 'Monday',
    slotId: 'P1',
    sectionId: 'CSE-5A',
    subjectCode: 'CS501',
    teacherId: 'fac-101',
    roomId: 'LH-101'
  });
  const [conflicts, setConflicts] = useState([]);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = meta?.timeSlots?.filter(t => !t.isBreak) || [
    { id: 'P1', label: 'P1 (08:30-09:25)' },
    { id: 'P2', label: 'P2 (09:25-10:20)' },
    { id: 'P3', label: 'P3 (10:35-11:30)' },
    { id: 'P4', label: 'P4 (11:30-12:25)' },
    { id: 'P5', label: 'P5 (01:15-02:10)' },
    { id: 'P6', label: 'P6 (02:10-03:05)' },
    { id: 'P7', label: 'Lab Block (03:15-05:00)' }
  ];

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await api.getTimetable({
        sectionId: filterSection !== 'All' ? filterSection : undefined,
        roomId: filterRoom !== 'All' ? filterRoom : undefined
      });
      setTimetableSlots(res.slots || []);
    } catch (err) {
      console.error("Error fetching timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [filterSection, filterRoom]);

  // Live Conflict Check
  useEffect(() => {
    if (!showAddModal) return;
    const timer = setTimeout(async () => {
      setIsCheckingConflict(true);
      try {
        const res = await api.checkConflict(candidateSlot);
        setConflicts(res.conflicts || []);
      } catch (e) {
        console.error("Conflict check error:", e);
      } finally {
        setIsCheckingConflict(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [candidateSlot, showAddModal]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (conflicts.length > 0) {
      alert("Cannot schedule slot: Collisions detected. Please choose another room, time, or faculty.");
      return;
    }
    try {
      await api.createSlot(candidateSlot);
      setAddSuccess("Slot scheduled cleanly without conflict!");
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess('');
        fetchTimetable();
      }, 1200);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm("Are you sure you want to remove this timetable slot?")) return;
    try {
      await api.deleteSlot(id);
      fetchTimetable();
    } catch (err) {
      alert(err.message);
    }
  };

  const displayedDays = filterDay === 'All' ? days : [filterDay];

  return (
    <div>
      {/* Top Controls & Metrics */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="filter-label">
            <Filter size={15} color="#0284c7" />
            <span>Target Section / Batch:</span>
          </div>
          <select 
            value={filterSection} 
            onChange={e => setFilterSection(e.target.value)}
            className="cgu-select"
          >
            <option value="All">All Sections</option>
            {meta?.sections?.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div className="filter-label" style={{ marginLeft: '0.5rem' }}>
            <span>Day:</span>
          </div>
          <select 
            value={filterDay} 
            onChange={e => setFilterDay(e.target.value)}
            className="cgu-select"
          >
            <option value="All">All 6 Days</option>
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <div className="filter-label" style={{ marginLeft: '0.5rem' }}>
            <span>Room:</span>
          </div>
          <select 
            value={filterRoom} 
            onChange={e => setFilterRoom(e.target.value)}
            className="cgu-select"
          >
            <option value="All">All Rooms / Labs</option>
            {meta?.rooms?.map(r => (
              <option key={r.id} value={r.id}>{r.id} ({r.name})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => window.print()} className="btn-secondary">
            <Printer size={15} />
            <span>Print Master Grid</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={16} />
            <span>Assign New Period Slot</span>
          </button>
        </div>
      </div>

      {/* Main Timetable Matrix */}
      <div className="cgu-card">
        <div className="card-header-styled">
          <div>
            <h3>
              <CalendarRange size={18} color="#0284c7" />
              <span>Timetable Master Matrix — {filterSection === 'All' ? 'All Sections' : filterSection}</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Conflict-free automated scheduling engine • {timetableSlots.length} active periods mapped
            </p>
          </div>
          <span className="academic-badge">
            Autonomous Academic Slotting
          </span>
        </div>

        <div className="card-body">
          <div className="timetable-scroll-wrapper">
            <table className="tt-table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Day \ Slot</th>
                  {periods.map(p => (
                    <th key={p.id}>
                      <div>{p.id}</div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.85 }}>{p.label || p.startTime}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedDays.map(day => (
                  <tr key={day}>
                    <td className="day-header-cell">
                      <strong>{day}</strong>
                    </td>
                    {periods.map(period => {
                      const matchingSlots = timetableSlots.filter(s => s.day.toLowerCase() === day.toLowerCase() && s.slotId === period.id);

                      return (
                        <td key={period.id} style={{ minWidth: '155px', height: '90px' }}>
                          {matchingSlots.length === 0 ? (
                            <div 
                              onClick={() => {
                                setCandidateSlot({ ...candidateSlot, day, slotId: period.id });
                                setShowAddModal(true);
                              }}
                              style={{ 
                                height: '100%', 
                                minHeight: '60px', 
                                border: '1px dashed #e2e8f0', 
                                borderRadius: 'var(--radius-sm)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: '#94a3b8',
                                fontSize: '0.74rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              title="Click to schedule class in this empty slot"
                            >
                              + Free Slot
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {matchingSlots.map(slot => (
                                <div key={slot.id} className="slot-class-card">
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span className="slot-subject-code">{slot.subjectCode}</span>
                                    <button 
                                      onClick={() => handleDeleteSlot(slot.id)}
                                      title="Delete slot"
                                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                  <div className="slot-subject-name">{slot.subjectName}</div>
                                  <div className="slot-meta">
                                    <div className="slot-meta-item">
                                      <Users size={12} color="#0284c7" />
                                      <span>{slot.teacherName}</span>
                                    </div>
                                    <div className="slot-meta-item">
                                      <MapPin size={12} color="#0284c7" />
                                      <span><strong>{slot.roomId}</strong></span>
                                    </div>
                                    {filterSection === 'All' && (
                                      <div style={{ fontSize: '0.7rem', color: 'var(--sky-primary)', fontWeight: 600 }}>
                                        Sec: {slot.sectionId}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: ADD PERIOD WITH LIVE CONFLICT DETECTION */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="card-header-styled">
              <h3>
                <CalendarRange size={18} color="#0284c7" />
                <span>Schedule Timetable Slot with Real-Time Conflict Detector</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSlot} style={{ padding: '1.25rem' }}>
              {addSuccess && (
                <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.84rem' }}>
                  ✓ {addSuccess}
                </div>
              )}

              {/* LIVE CONFLICT WARNING BOX */}
              {conflicts.length > 0 && (
                <div className="conflict-box">
                  <div className="conflict-title">
                    <ShieldAlert size={16} />
                    <span>Scheduling Conflict Detected!</span>
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                    {conflicts.map((c, i) => (
                      <li key={i}>{c.message}</li>
                    ))}
                  </ul>
                  <div style={{ fontSize: '0.74rem', marginTop: '0.4rem', fontWeight: 600 }}>
                    Please alter the Room, Time Slot, or Faculty to avoid physical collision.
                  </div>
                </div>
              )}

              {conflicts.length === 0 && !isCheckingConflict && (
                <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.5rem 0.75rem', borderRadius: 6, marginBottom: '1rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} />
                  <span>Verified: No room collision or teacher double-booking for this configuration.</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Day of Week</label>
                  <select
                    value={candidateSlot.day}
                    onChange={e => setCandidateSlot({ ...candidateSlot, day: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Period Slot</label>
                  <select
                    value={candidateSlot.slotId}
                    onChange={e => setCandidateSlot({ ...candidateSlot, slotId: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    {periods.map(p => <option key={p.id} value={p.id}>{p.id} - {p.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Target Section</label>
                  <select
                    value={candidateSlot.sectionId}
                    onChange={e => setCandidateSlot({ ...candidateSlot, sectionId: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    {meta?.sections?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Course / Subject</label>
                  <select
                    value={candidateSlot.subjectCode}
                    onChange={e => setCandidateSlot({ ...candidateSlot, subjectCode: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    {meta?.subjects?.map(sub => (
                      <option key={sub.code} value={sub.code}>{sub.code} - {sub.name} ({sub.ltp})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Faculty In-Charge</label>
                  <select
                    value={candidateSlot.teacherId}
                    onChange={e => setCandidateSlot({ ...candidateSlot, teacherId: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    {meta?.facultyList?.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Room / Smart Lab</label>
                  <select
                    value={candidateSlot.roomId}
                    onChange={e => setCandidateSlot({ ...candidateSlot, roomId: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    {meta?.rooms?.map(r => (
                      <option key={r.id} value={r.id}>{r.id} - {r.name} (Cap: {r.capacity})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={conflicts.length > 0} 
                  className="btn-primary"
                  style={conflicts.length > 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  Commit Slot to Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
