import React, { useState, useEffect } from 'react';
import { 
  CalendarRange, 
  Users, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Filter, 
  Layers, 
  BarChart3, 
  LogOut,
  Building2,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { api } from '../api/client';

export default function CoordinatorDashboard({ currentUser, onLogout, meta }) {
  const [activeTab, setActiveTab] = useState('routine'); // 'routine', 'workload', 'approvals'
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [facultyWorkload, setFacultyWorkload] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Routine Filters
  const [filterSection, setFilterSection] = useState('CSE-5A');
  const [filterRoom, setFilterRoom] = useState('All');
  const [filterDay, setFilterDay] = useState('All');

  // Add Slot Modal & Live Clash Detector State
  const [showAddModal, setShowAddModal] = useState(false);
  const [candidateSlot, setCandidateSlot] = useState({
    day: 'Monday',
    slotId: 'P1',
    sectionId: 'CSE-5A',
    subjectCode: 'CS501',
    teacherId: 'fac-01',
    roomId: 'LH-101'
  });
  const [clashes, setClashes] = useState([]);
  const [isCheckingClash, setIsCheckingClash] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = meta?.timeSlots?.filter(t => !t.isBreak) || [
    { id: 'P1', label: 'P1 (08:30 - 09:25)' },
    { id: 'P2', label: 'P2 (09:25 - 10:20)' },
    { id: 'P3', label: 'P3 (10:35 - 11:30)' },
    { id: 'P4', label: 'P4 (11:30 - 12:25)' },
    { id: 'P5', label: 'P5 (01:15 - 02:10)' },
    { id: 'P6', label: 'P6 (02:10 - 03:05)' },
    { id: 'P7', label: 'Lab Block (03:15 - 05:00)' }
  ];

  const refreshAllData = async () => {
    setLoading(true);
    try {
      // 1. Timetable slots
      const tt = await api.getTimetable({
        sectionId: filterSection !== 'All' ? filterSection : undefined,
        roomId: filterRoom !== 'All' ? filterRoom : undefined,
        day: filterDay !== 'All' ? filterDay : undefined
      });
      setTimetableSlots(tt.slots || []);

      // 2. Faculty workload
      const wl = await api.getFacultyWorkload();
      setFacultyWorkload(wl.facultyWorkload || []);

      // 3. Pending approvals
      const pend = await api.getPendingUsers();
      setPendingUsers(pend.pendingUsers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, [filterSection, filterRoom, filterDay]);

  // Live Clash Checking
  useEffect(() => {
    if (!showAddModal) return;
    const timer = setTimeout(async () => {
      setIsCheckingClash(true);
      try {
        const res = await api.checkClash(candidateSlot);
        setClashes(res.conflicts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsCheckingClash(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [candidateSlot, showAddModal]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (clashes.length > 0) {
      alert("Cannot allocate slot: Clash detected with teacher, room, or section!");
      return;
    }
    try {
      await api.createSlot(candidateSlot);
      setAddSuccess("Class/Lab slot allocated cleanly!");
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess('');
        refreshAllData();
      }, 1000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm("Are you sure you want to remove this scheduled slot?")) return;
    try {
      await api.deleteSlot(id);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const res = await api.approveUser(userId);
      setStatusMsg(res.message);
      setTimeout(() => setStatusMsg(''), 4000);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectUser = async (userId) => {
    if (!confirm("Reject and remove this registration?")) return;
    try {
      const res = await api.rejectUser(userId);
      setStatusMsg(res.message);
      setTimeout(() => setStatusMsg(''), 4000);
      refreshAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const displayedDays = filterDay === 'All' ? days : [filterDay];

  return (
    <div className="app-container">
      {/* Top Navbar for Timetable Coordinator */}
      <header className="top-navbar">
        <div className="nav-inner">
          <div className="brand-section">
            <div className="brand-emblem">
              <Building2 size={24} />
            </div>
            <div className="brand-info">
              <h1>
                <span>C.V. Raman Global University</span>
                <span className="academic-badge">Coordinator Console</span>
              </h1>
              <div className="brand-subtitle">
                Department of Computer Science & Engineering • Autumn Routine 2026-27
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--sky-primary)', fontWeight: 600 }}>
                Chief Timetable Coordinator
              </div>
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

      {/* Main Subnav Tabs */}
      <div className="subnav-tabs">
        <div className="subnav-inner">
          <button
            onClick={() => setActiveTab('routine')}
            className={`tab-btn ${activeTab === 'routine' ? 'active' : ''}`}
          >
            <CalendarRange size={16} />
            <span>Weekly Routine Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('workload')}
            className={`tab-btn ${activeTab === 'workload' ? 'active' : ''}`}
          >
            <BarChart3 size={16} />
            <span>15-Faculty Workload Monitor ({facultyWorkload.length} Teachers)</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            <ShieldCheck size={16} />
            <span>Account Approvals Queue</span>
            {pendingUsers.length > 0 && (
              <span style={{
                background: '#ea580c',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: 9999,
                marginLeft: '0.35rem'
              }}>
                {pendingUsers.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="main-wrapper">
        {statusMsg && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.84rem' }}>
            ✓ {statusMsg}
          </div>
        )}

        {/* TAB 1: WEEKLY ROUTINE MATRIX */}
        {activeTab === 'routine' && (
          <div>
            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-group">
                <div className="filter-label">
                  <Filter size={15} color="#0284c7" />
                  <span>Section / Batch:</span>
                </div>
                <select
                  value={filterSection}
                  onChange={e => setFilterSection(e.target.value)}
                  className="cgu-select"
                >
                  <option value="All">All Batches</option>
                  {meta?.sections?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                  {meta?.rooms?.map(r => <option key={r.id} value={r.id}>{r.id} ({r.name})</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => window.print()} className="btn-secondary">
                  <Printer size={15} />
                  <span>Print Section Routine</span>
                </button>
                <button onClick={() => setShowAddModal(true)} className="btn-primary">
                  <Plus size={16} />
                  <span>Assign Period / Lab Slot</span>
                </button>
              </div>
            </div>

            {/* Routine Grid */}
            <div className="cgu-card">
              <div className="card-header-styled">
                <div>
                  <h3>
                    <CalendarRange size={18} color="#0284c7" />
                    <span>Department Routine Matrix — {filterSection}</span>
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Continuous slot allocation with automatic collision protection • {timetableSlots.length} slots active
                  </p>
                </div>
                <span className="academic-badge">Autonomous Engineering Session</span>
              </div>

              <div className="card-body">
                <div className="timetable-scroll-wrapper">
                  <table className="tt-table">
                    <thead>
                      <tr>
                        <th style={{ width: '110px' }}>Day \ Period</th>
                        {periods.map(p => (
                          <th key={p.id}>
                            <div>{p.id}</div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 500, opacity: 0.85 }}>{p.label}</div>
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
                              <td key={period.id} style={{ minWidth: '160px', height: '90px' }}>
                                {matchingSlots.length === 0 ? (
                                  <div
                                    onClick={() => {
                                      setCandidateSlot({ ...candidateSlot, day, slotId: period.id, sectionId: filterSection !== 'All' ? filterSection : 'CSE-5A' });
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
                                    title="Click to allocate a class in this empty slot"
                                  >
                                    + Assign Slot
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
                                            <span><strong>{slot.teacherName}</strong></span>
                                          </div>
                                          <div className="slot-meta-item">
                                            <MapPin size={12} color="#0284c7" />
                                            <span>{slot.roomId}</span>
                                          </div>
                                          {filterSection === 'All' && (
                                            <div style={{ fontSize: '0.7rem', color: 'var(--sky-primary)', fontWeight: 600 }}>
                                              {slot.sectionId}
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
          </div>
        )}

        {/* TAB 2: 15-FACULTY WORKLOAD MONITOR */}
        {activeTab === 'workload' && (
          <div className="cgu-card">
            <div className="card-header-styled">
              <div>
                <h3>
                  <BarChart3 size={18} color="#0284c7" />
                  <span>Department 15-Faculty Workload Balance Monitor</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  AICTE / UGC Norm Compliance: Professors (12 hrs), Associate Prof (14 hrs), Assistant Prof (16 hrs)
                </p>
              </div>
              <span className="academic-badge">15 Active Faculty</span>
            </div>

            <div className="card-body">
              <div className="timetable-scroll-wrapper">
                <table className="tt-table">
                  <thead>
                    <tr>
                      <th>Emp Code</th>
                      <th>Faculty Member</th>
                      <th>Designation & Specialization</th>
                      <th>Theory Hrs</th>
                      <th>Lab Hrs</th>
                      <th>Weekly Assigned / Max Cap</th>
                      <th>Workload Balance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyWorkload.map(fw => (
                      <tr key={fw.teacherId}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {fw.empCode}
                        </td>
                        <td>
                          <strong>{fw.name}</strong>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>{fw.designation}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--sky-primary)' }}>{fw.specialization}</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>{fw.theoryHours} hrs</td>
                        <td style={{ textAlign: 'center' }}>{fw.labHours} hrs</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '80px', height: '8px', background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{
                                width: `${Math.min(100, fw.percentage)}%`,
                                height: '100%',
                                background: fw.workloadStatus === 'Overloaded' ? '#ef4444' : fw.workloadStatus === 'Optimal' ? '#10b981' : '#0284c7'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                              {fw.totalHours} / {fw.maxHours} hrs
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: fw.workloadStatus === 'Optimal' ? 'var(--success-bg)' : fw.workloadStatus === 'Overloaded' ? 'var(--danger-bg)' : 'var(--bg-sky-light)',
                            color: fw.workloadStatus === 'Optimal' ? 'var(--success)' : fw.workloadStatus === 'Overloaded' ? 'var(--danger)' : 'var(--sky-primary)'
                          }}>
                            {fw.workloadStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENDING ACCOUNT APPROVALS QUEUE */}
        {activeTab === 'approvals' && (
          <div className="cgu-card">
            <div className="card-header-styled">
              <div>
                <h3>
                  <ShieldCheck size={18} color="#0284c7" />
                  <span>Institutional User Registration Verification Queue</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Approve new faculty or student accounts before granting them access to the timetable system
                </p>
              </div>
              <span className="academic-badge" style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#c2410c' }}>
                {pendingUsers.length} Pending
              </span>
            </div>

            <div className="card-body">
              {pendingUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
                  <h4>Verification Queue is Clear!</h4>
                  <p style={{ fontSize: '0.84rem', marginTop: '0.25rem' }}>
                    All registered faculty members and students have been verified and active.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingUsers.map(user => (
                    <div key={user.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#fffbeb' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{user.name}</strong>
                          <span className="role-tag teacher">{user.role}</span>
                          <span style={{ fontSize: '0.74rem', background: '#fef3c7', color: '#b45309', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700 }}>
                            Awaiting Approval
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span>Email: <strong>{user.email}</strong></span> • 
                          <span style={{ marginLeft: '0.4rem' }}>Dept: <strong>{user.department}</strong></span> • 
                          <span style={{ marginLeft: '0.4rem' }}>{user.role === 'TEACHER' ? `Emp ID: ${user.empCode}` : `Roll No: ${user.regNo}`}</span>
                        </div>
                        {user.specialization && (
                          <div style={{ fontSize: '0.76rem', color: 'var(--sky-primary)', marginTop: '0.2rem' }}>
                            Specialization: {user.specialization} ({user.designation})
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApproveUser(user.id)}
                          className="btn-primary"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', background: '#059669', borderColor: '#059669' }}
                        >
                          <Check size={14} />
                          <span>Approve & Activate Account</span>
                        </button>
                        <button
                          onClick={() => handleRejectUser(user.id)}
                          className="btn-danger-outline"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                        >
                          <X size={14} />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: ASSIGN PERIOD WITH LIVE CLASH DETECTOR */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-dialog">
              <div className="card-header-styled">
                <h3>
                  <CalendarRange size={18} color="#0284c7" />
                  <span>Assign Class / Lab Slot (Ground-Level Clash Detector)</span>
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

                {/* CLASH WARNING ALERT */}
                {clashes.length > 0 && (
                  <div className="conflict-box">
                    <div className="conflict-title">
                      <AlertTriangle size={16} />
                      <span>Scheduling Collision Detected!</span>
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                      {clashes.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                    <div style={{ fontSize: '0.74rem', marginTop: '0.4rem', fontWeight: 600 }}>
                      Change the Faculty, Room, or Period to resolve this clash.
                    </div>
                  </div>
                )}

                {clashes.length === 0 && !isCheckingClash && (
                  <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.5rem 0.75rem', borderRadius: 6, marginBottom: '1rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={15} />
                    <span>Slot is clear: No faculty clash, room collision, or batch overlap.</span>
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
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Section / Batch</label>
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
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Subject / Lab</label>
                    <select
                      value={candidateSlot.subjectCode}
                      onChange={e => setCandidateSlot({ ...candidateSlot, subjectCode: e.target.value })}
                      className="cgu-select"
                      style={{ width: '100%' }}
                    >
                      {meta?.subjects?.map(s => (
                        <option key={s.code} value={s.code}>{s.code} - {s.name} ({s.type} • {s.ltp})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Assign 1 of 15 Faculty</label>
                    <select
                      value={candidateSlot.teacherId}
                      onChange={e => setCandidateSlot({ ...candidateSlot, teacherId: e.target.value })}
                      className="cgu-select"
                      style={{ width: '100%' }}
                    >
                      {meta?.facultyList?.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.specialization || f.designation})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Lecture Hall / Studio Lab</label>
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
                    disabled={clashes.length > 0}
                    className="btn-primary"
                    style={clashes.length > 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    Commit to Department Routine
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
