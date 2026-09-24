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
  X,
  Sparkles,
  RefreshCw,
  Video,
  UserCheck,
  Send,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { api } from '../api/client';

export default function CoordinatorDashboard({ currentUser, onLogout, meta }) {
  const [activeTab, setActiveTab] = useState('routine'); // 'routine', 'ledger', 'workload', 'approvals'
  
  // Cascading Academic Hierarchy Selectors
  const [selectedCourse, setSelectedCourse] = useState('BTECH');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSectionId, setSelectedSectionId] = useState('BTECH-CSE-3A');

  const [filterDay, setFilterDay] = useState('All');
  const [filterRoom, setFilterRoom] = useState('All');

  // Timetable State
  const [timetableSlots, setTimetableSlots] = useState([]);
  const [facultyWorkload, setFacultyWorkload] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [occupancyLedger, setOccupancyLedger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Add / Edit Slot Modal & Smart Conflict Drawer
  const [showAddModal, setShowAddModal] = useState(false);
  const [candidateSlot, setCandidateSlot] = useState({
    day: 'Monday',
    slotId: 'P1',
    sectionId: 'BTECH-CSE-3A',
    subjectCode: 'CS501',
    teacherId: 'fac-01',
    roomId: 'LH-101',
    mode: 'PHYSICAL'
  });
  const [clashes, setClashes] = useState([]);
  const [isCheckingClash, setIsCheckingClash] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  // Case 3: Reassign / Substitute Modal State
  const [showSubModal, setShowSubModal] = useState(false);
  const [activeSlotForSub, setActiveSlotForSub] = useState(null);
  const [availableFreeFaculty, setAvailableFreeFaculty] = useState([]);
  const [loadingFreeFaculty, setLoadingFreeFaculty] = useState(false);
  const [selectedProxyTeacherId, setSelectedProxyTeacherId] = useState('');
  const [proxyReason, setProxyReason] = useState('Faculty Casual Leave / On-Duty');

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

  // Sync available branches and sections when course/branch/year changes
  const currentCourse = meta?.courses?.find(c => c.id === selectedCourse) || meta?.courses?.[0];
  const availableBranches = currentCourse?.branches || [];
  
  const matchingSections = meta?.sections?.filter(s => 
    s.courseId === selectedCourse && 
    s.branchId === selectedBranch && 
    Number(s.year) === Number(selectedYear)
  ) || [];

  // When course changes, pick first branch
  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    const course = meta?.courses?.find(c => c.id === courseId);
    if (course && course.branches.length > 0) {
      setSelectedBranch(course.branches[0].id);
      setSelectedYear('1');
    }
  };

  // Fetch slots whenever selected section or filters change
  const refreshTimetable = async () => {
    setLoading(true);
    try {
      const res = await api.getTimetable({
        sectionId: selectedSectionId,
        roomId: filterRoom !== 'All' ? filterRoom : undefined,
        day: filterDay !== 'All' ? filterDay : undefined
      });
      setTimetableSlots(res.slots || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuxiliaryData = async () => {
    try {
      const [wl, pend, ledg] = await Promise.all([
        api.getFacultyWorkload(),
        api.getPendingUsers(),
        api.getOccupancyLedger()
      ]);
      setFacultyWorkload(wl.facultyWorkload || []);
      setPendingUsers(pend.pendingUsers || []);
      setOccupancyLedger(ledg || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshTimetable();
  }, [selectedSectionId, filterRoom, filterDay]);

  useEffect(() => {
    refreshAuxiliaryData();
  }, []);

  // Update selectedSectionId when matchingSections changes
  useEffect(() => {
    if (matchingSections.length > 0) {
      const exists = matchingSections.some(s => s.id === selectedSectionId);
      if (!exists) {
        setSelectedSectionId(matchingSections[0].id);
      }
    }
  }, [selectedCourse, selectedBranch, selectedYear]);

  // Live Clash Checking in Modal
  useEffect(() => {
    if (!showAddModal) return;
    const timer = setTimeout(async () => {
      setIsCheckingClash(true);
      try {
        const res = await api.checkClash(candidateSlot);
        setClashes(res.clashes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsCheckingClash(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [candidateSlot, showAddModal]);

  // Case 1: Auto-generate semester routine
  const handleAutoGenerate = async () => {
    if (!confirm(`Auto-populate a standard balanced semester routine for ${selectedSectionId}? This will distribute core subjects and afternoon labs without clashes.`)) return;
    try {
      setLoading(true);
      const res = await api.autoGenerateRoutine(selectedCourse, selectedBranch, selectedYear, selectedSectionId);
      setStatusMsg(res.message);
      setTimeout(() => setStatusMsg(''), 5000);
      refreshTimetable();
      refreshAuxiliaryData();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Case 2: Actionable Conflict Resolutions in Add Modal
  const handleSwitchToOnline = () => {
    setCandidateSlot({
      ...candidateSlot,
      roomId: 'STUDIO-ONLINE',
      mode: 'ONLINE'
    });
  };

  const handlePickFreeTeacher = async () => {
    try {
      const res = await api.getFreeFaculty(candidateSlot.day, candidateSlot.slotId);
      if (res.freeFaculty && res.freeFaculty.length > 0) {
        setCandidateSlot({
          ...candidateSlot,
          teacherId: res.freeFaculty[0].id
        });
      } else {
        alert("No faculty are free during this time slot.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (clashes.length > 0) {
      alert("Cannot allocate slot: Clash detected. Please choose one of the resolution options.");
      return;
    }
    try {
      await api.createSlot(candidateSlot);
      setAddSuccess("Class/Lab slot allocated cleanly without collision!");
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess('');
        refreshTimetable();
        refreshAuxiliaryData();
      }, 1000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!confirm("Are you sure you want to remove this scheduled slot?")) return;
    try {
      await api.deleteSlot(id);
      refreshTimetable();
      refreshAuxiliaryData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Case 3: Reassign Faculty on Leave
  const handleOpenProxyModal = async (slot) => {
    setActiveSlotForSub(slot);
    setShowSubModal(true);
    setLoadingFreeFaculty(true);
    try {
      const res = await api.getFreeFaculty(slot.day, slot.slotId);
      setAvailableFreeFaculty(res.freeFaculty || []);
      if (res.freeFaculty?.length > 0) {
        setSelectedProxyTeacherId(res.freeFaculty[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFreeFaculty(false);
    }
  };

  const handleCommitProxy = async (e) => {
    e.preventDefault();
    if (!selectedProxyTeacherId) {
      alert("Please select a substitute faculty member");
      return;
    }
    try {
      await api.reassignFaculty(activeSlotForSub.id, selectedProxyTeacherId, proxyReason);
      setStatusMsg(`Class successfully reassigned to substitute faculty!`);
      setTimeout(() => setStatusMsg(''), 4000);
      setShowSubModal(false);
      refreshTimetable();
      refreshAuxiliaryData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Suspend or Online toggle
  const handleToggleMode = async (slotId, currentMode) => {
    const newMode = currentMode === 'ONLINE' ? 'PHYSICAL' : currentMode === 'SUSPENDED' ? 'PHYSICAL' : 'ONLINE';
    try {
      await api.setSlotMode(slotId, newMode, 'Operational Adjustment by Timetable Office');
      refreshTimetable();
      refreshAuxiliaryData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSuspendSlot = async (slotId) => {
    if (!confirm("Suspend this period? Students and faculty will see this class marked as Suspended.")) return;
    try {
      await api.setSlotMode(slotId, 'SUSPENDED', 'Official class suspension');
      refreshTimetable();
      refreshAuxiliaryData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Approvals
  const handleApproveUser = async (userId) => {
    try {
      const res = await api.approveUser(userId);
      setStatusMsg(res.message);
      setTimeout(() => setStatusMsg(''), 4000);
      refreshAuxiliaryData();
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
      refreshAuxiliaryData();
    } catch (err) {
      alert(err.message);
    }
  };

  const displayedDays = filterDay === 'All' ? days : [filterDay];

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="nav-inner">
          <div className="brand-section">
            <div className="brand-emblem">
              <Building2 size={24} />
            </div>
            <div className="brand-info">
              <h1>
                <span>C.V. Raman Global University</span>
                <span className="academic-badge">University Timetable Directorate</span>
              </h1>
              <div className="brand-subtitle">
                Central Academic Scheduling ERP • Autumn Session 2026-27
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{currentUser.name}</div>
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
            <span>Course & Branch Routine Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>Campus Resource Occupancy Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('workload')}
            className={`tab-btn ${activeTab === 'workload' ? 'active' : ''}`}
          >
            <BarChart3 size={16} />
            <span>Faculty Workload Monitor ({facultyWorkload.length} Teachers)</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            <ShieldCheck size={16} />
            <span>User Verification Queue</span>
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

        {/* TAB 1: COURSE & BRANCH ROUTINE BUILDER */}
        {activeTab === 'routine' && (
          <div>
            {/* Cascading University Selection Bar (Course -> Branch -> Year -> Group) */}
            <div className="cgu-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', background: '#ffffff', border: '1px solid var(--border-sky)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--sky-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                <Filter size={15} />
                <span>Select Course, Department & Batch to Manage Routine:</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                {/* 1. Course */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    1. Program / Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={e => handleCourseChange(e.target.value)}
                    className="cgu-select"
                    style={{ width: '100%', fontWeight: 600 }}
                  >
                    {meta?.courses?.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Branch */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    2. Branch / Department
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                    className="cgu-select"
                    style={{ width: '100%', fontWeight: 600 }}
                  >
                    {availableBranches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                {/* 3. Year */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    3. Academic Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    {currentCourse?.years?.map(y => (
                      <option key={y} value={y}>{y === 1 ? '1st Year' : y === 2 ? '2nd Year' : y === 3 ? '3rd Year' : '4th Year'}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Section / Group */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    4. Section / Group Batch
                  </label>
                  <select
                    value={selectedSectionId}
                    onChange={e => setSelectedSectionId(e.target.value)}
                    className="cgu-select"
                    style={{ width: '100%', borderColor: 'var(--sky-primary)', background: '#f0f9ff' }}
                  >
                    {matchingSections.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.group})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Actions & Filters Bar */}
            <div className="filter-bar">
              <div className="filter-group">
                <div className="filter-label">
                  <span>Filter Day:</span>
                </div>
                <select
                  value={filterDay}
                  onChange={e => setFilterDay(e.target.value)}
                  className="cgu-select"
                >
                  <option value="All">All 6 Working Days</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <div className="filter-label" style={{ marginLeft: '0.5rem' }}>
                  <span>Filter Room:</span>
                </div>
                <select
                  value={filterRoom}
                  onChange={e => setFilterRoom(e.target.value)}
                  className="cgu-select"
                >
                  <option value="All">All Lecture Halls & Labs</option>
                  {meta?.rooms?.map(r => <option key={r.id} value={r.id}>{r.id} ({r.name})</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* CASE 1: AUTO GENERATE SEMESTER ROUTINE */}
                <button 
                  onClick={handleAutoGenerate}
                  className="btn-secondary"
                  style={{ borderColor: 'var(--sky-primary)', color: 'var(--sky-primary)', background: 'var(--bg-sky-subtle)' }}
                  title="Populate standard conflict-free routine for this semester"
                >
                  <Sparkles size={15} />
                  <span>⚡ Auto-Populate Semester Routine</span>
                </button>

                <button onClick={() => window.print()} className="btn-secondary">
                  <Printer size={15} />
                  <span>Print Section Routine</span>
                </button>

                <button 
                  onClick={() => {
                    setCandidateSlot({
                      ...candidateSlot,
                      sectionId: selectedSectionId
                    });
                    setShowAddModal(true);
                  }} 
                  className="btn-primary"
                >
                  <Plus size={16} />
                  <span>Assign Class / Lab Slot</span>
                </button>
              </div>
            </div>

            {/* Routine Grid Matrix */}
            <div className="cgu-card">
              <div className="card-header-styled">
                <div>
                  <h3>
                    <CalendarRange size={18} color="#0284c7" />
                    <span>Master Weekly Routine: {selectedSectionId}</span>
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {selectedCourse} • {selectedBranch} Department • {selectedYear} Year • {timetableSlots.length} Slots Assigned
                  </p>
                </div>
                <span className="academic-badge">
                  {timetableSlots.length > 0 ? `${timetableSlots.length} Active Periods` : 'Empty Routine'}
                </span>
              </div>

              <div className="card-body">
                {timetableSlots.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#fafbfc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                    <CalendarRange size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      No Routine Scheduled Yet for {selectedSectionId}
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
                      As this is a new semester or unassigned batch, you can either click any slot below to assign manually, or use the 1-click Auto-Populate button.
                    </p>
                    <button 
                      onClick={handleAutoGenerate}
                      className="btn-primary"
                      style={{ padding: '0.65rem 1.25rem' }}
                    >
                      <Sparkles size={16} />
                      <span>⚡ Auto-Populate Standard Balanced Routine</span>
                    </button>
                  </div>
                ) : (
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
                                <td key={period.id} style={{ minWidth: '165px', height: '95px' }}>
                                  {matchingSlots.length === 0 ? (
                                    <div
                                      onClick={() => {
                                        setCandidateSlot({
                                          ...candidateSlot,
                                          day,
                                          slotId: period.id,
                                          sectionId: selectedSectionId
                                        });
                                        setShowAddModal(true);
                                      }}
                                      style={{
                                        height: '100%',
                                        minHeight: '65px',
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
                                        <div 
                                          key={slot.id} 
                                          className="slot-class-card"
                                          style={slot.mode === 'SUSPENDED' ? { background: '#fef2f2', borderColor: '#fca5a5', borderLeftColor: '#ef4444' } : slot.mode === 'ONLINE' ? { background: '#eff6ff', borderColor: '#bfdbfe', borderLeftColor: '#2563eb' } : {}}
                                        >
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <span className="slot-subject-code">{slot.subjectCode}</span>
                                            
                                            {/* Status Badge */}
                                            {slot.mode === 'SUSPENDED' && (
                                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                                                SUSPENDED
                                              </span>
                                            )}
                                            {slot.mode === 'ONLINE' && (
                                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2563eb', background: '#dbeafe', padding: '0.1rem 0.35rem', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                                                <Video size={10} />
                                                ONLINE
                                              </span>
                                            )}

                                            <button
                                              onClick={() => handleDeleteSlot(slot.id)}
                                              title="Delete slot"
                                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                            >
                                              <Trash2 size={12} />
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
                                          </div>

                                          {/* Quick Actions (Substitute on Leave, Shift Mode, Suspend) */}
                                          <div style={{ marginTop: '0.45rem', paddingTop: '0.35rem', borderTop: '1px dashed #cbd5e1', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                            {/* CASE 3: PROXY FACULTY REASSIGNMENT */}
                                            <button
                                              onClick={() => handleOpenProxyModal(slot)}
                                              style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', fontSize: '0.68rem', padding: '0.15rem 0.35rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                                              title="Assign substitute teacher if faculty is on leave"
                                            >
                                              Proxy/Substitute
                                            </button>

                                            <button
                                              onClick={() => handleToggleMode(slot.id, slot.mode)}
                                              style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.68rem', padding: '0.15rem 0.35rem', borderRadius: 4, cursor: 'pointer' }}
                                              title="Toggle between Physical Classroom and Online Smart Studio"
                                            >
                                              {slot.mode === 'ONLINE' ? 'Physical' : 'Online'}
                                            </button>

                                            <button
                                              onClick={() => handleSuspendSlot(slot.id)}
                                              style={{ background: '#ffffff', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.68rem', padding: '0.15rem 0.35rem', borderRadius: 4, cursor: 'pointer' }}
                                              title="Suspend class"
                                            >
                                              Suspend
                                            </button>
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPUS RESOURCE OCCUPANCY LEDGER ("See who is allocated to what") */}
        {activeTab === 'ledger' && (
          <div className="cgu-card">
            <div className="card-header-styled">
              <div>
                <h3>
                  <Layers size={18} color="#0284c7" />
                  <span>Campus Classrooms & Specialized Labs Occupancy Ledger</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Visual master occupancy map: See at a glance which lecture hall or computer lab is busy vs available at each period
                </p>
              </div>
              <span className="academic-badge">Real-Time Facility Tracking</span>
            </div>

            <div className="card-body">
              <div className="timetable-scroll-wrapper">
                <table className="tt-table">
                  <thead>
                    <tr>
                      <th style={{ width: '140px' }}>Room / Facility</th>
                      <th>Type & Block</th>
                      <th>Cap</th>
                      {periods.map(p => (
                        <th key={p.id}>
                          <div>{p.id}</div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 500 }}>{p.label}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {occupancyLedger?.roomLedger?.map(room => (
                      <tr key={room.roomId}>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)', background: 'var(--bg-sky-subtle)' }}>
                          <div>{room.roomId}</div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>{room.roomName}</div>
                        </td>
                        <td>
                          <span className={`role-tag ${room.type === 'Lab' ? 'admin' : 'teacher'}`}>
                            {room.type}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{room.block}</div>
                        </td>
                        <td style={{ fontWeight: 700, textAlign: 'center' }}>
                          {room.capacity}
                        </td>

                        {/* Periods Occupancy for Monday as representative */}
                        {periods.map(period => {
                          const matching = room.allocations.filter(a => a.day === 'Monday' && a.slotId === period.id);

                          return (
                            <td key={period.id} style={{ minWidth: '130px', verticalAlign: 'middle' }}>
                              {matching.length === 0 ? (
                                <span style={{ fontSize: '0.72rem', color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 700 }}>
                                  ✓ Available
                                </span>
                              ) : (
                                <div style={{ fontSize: '0.74rem', background: '#fff7ed', border: '1px solid #fed7aa', padding: '0.35rem 0.45rem', borderRadius: 4, color: '#9a3412' }}>
                                  <div style={{ fontWeight: 700 }}>{matching[0].sectionName}</div>
                                  <div style={{ fontSize: '0.68rem' }}>{matching[0].subjectCode} • {matching[0].teacherName}</div>
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
        )}

        {/* TAB 3: 15-FACULTY WORKLOAD MONITOR */}
        {activeTab === 'workload' && (
          <div className="cgu-card">
            <div className="card-header-styled">
              <div>
                <h3>
                  <BarChart3 size={18} color="#0284c7" />
                  <span>Faculty Workload & AICTE Credit Compliance Monitor</span>
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Real-time credit tracking across all department professors (Professors: 12 hrs, Assoc Prof: 14 hrs, Asst Prof: 16 hrs)
                </p>
              </div>
              <span className="academic-badge">{facultyWorkload.length} Department Teachers</span>
            </div>

            <div className="card-body">
              <div className="timetable-scroll-wrapper">
                <table className="tt-table">
                  <thead>
                    <tr>
                      <th>Emp Code</th>
                      <th>Faculty Member</th>
                      <th>Dept & Specialization</th>
                      <th>Theory Hrs</th>
                      <th>Lab Hrs</th>
                      <th>Weekly Load / Max Cap</th>
                      <th>Balance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyWorkload.map(fw => (
                      <tr key={fw.teacherId}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{fw.empCode}</td>
                        <td><strong>{fw.name}</strong></td>
                        <td>
                          <div>{fw.department} • {fw.designation}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--sky-primary)' }}>{fw.specialization}</div>
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

        {/* TAB 4: USER VERIFICATION QUEUE */}
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
                  <p style={{ fontSize: '0.84rem' }}>
                    All faculty members and students have been verified and active.
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

        {/* CASE 2: MODAL WITH ACTIONABLE COLLISION RESOLUTION DRAWER */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-dialog" style={{ maxWidth: '640px' }}>
              <div className="card-header-styled">
                <h3>
                  <CalendarRange size={18} color="#0284c7" />
                  <span>Assign Class or Lab Slot</span>
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

                {/* RED DANGER COLLISION BOX WITH IMMEDIATE RESOLUTIONS */}
                {clashes.length > 0 && (
                  <div className="conflict-box" style={{ background: '#fef2f2', border: '1.5px solid #ef4444', borderRadius: 10, padding: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      <AlertTriangle size={18} />
                      <span>SCHEDULING CLASH DETECTED!</span>
                    </div>
                    <ul style={{ paddingLeft: '1.25rem', color: '#991b1b', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                      {clashes.map((c, i) => (
                        <li key={i} style={{ marginBottom: '0.2rem' }}>{c.message}</li>
                      ))}
                    </ul>

                    {/* ACTIONABLE RESOLUTION BUTTONS */}
                    <div style={{ borderTop: '1px dashed #fca5a5', paddingTop: '0.65rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7f1d1d', display: 'block', marginBottom: '0.4rem' }}>
                        Quick Conflict Resolutions (1-Click Fix):
                      </span>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={handleSwitchToOnline}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                        >
                          <Video size={13} />
                          <span>Switch to Online Studio Mode</span>
                        </button>

                        <button
                          type="button"
                          onClick={handlePickFreeTeacher}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}
                        >
                          <UserCheck size={13} />
                          <span>Assign Available Free Teacher</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {clashes.length === 0 && !isCheckingClash && (
                  <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.5rem 0.75rem', borderRadius: 6, marginBottom: '1rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={15} />
                    <span>Verified: No teacher clash, room collision, or batch overlap.</span>
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
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Subject / Lab</label>
                    <select
                      value={candidateSlot.subjectCode}
                      onChange={e => setCandidateSlot({ ...candidateSlot, subjectCode: e.target.value })}
                      className="cgu-select"
                      style={{ width: '100%' }}
                    >
                      {meta?.subjects?.map(s => (
                        <option key={s.code} value={s.code}>{s.code} - {s.name} ({s.type})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Faculty Member</label>
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
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Classroom / Lab / Studio</label>
                    <select
                      value={candidateSlot.roomId}
                      onChange={e => setCandidateSlot({ ...candidateSlot, roomId: e.target.value, mode: e.target.value === 'STUDIO-ONLINE' ? 'ONLINE' : 'PHYSICAL' })}
                      className="cgu-select"
                      style={{ width: '100%' }}
                    >
                      {meta?.rooms?.map(r => (
                        <option key={r.id} value={r.id}>{r.id} - {r.name} ({r.type})</option>
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

        {/* CASE 3: PROXY / SUBSTITUTE TEACHER REASSIGNMENT MODAL */}
        {showSubModal && activeSlotForSub && (
          <div className="modal-overlay">
            <div className="modal-dialog">
              <div className="card-header-styled">
                <h3>
                  <UserCheck size={18} color="#0284c7" />
                  <span>Assign Substitute Faculty (Faculty on Leave)</span>
                </h3>
                <button
                  onClick={() => setShowSubModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCommitProxy} style={{ padding: '1.25rem' }}>
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '0.85rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <div>Course: <strong>{activeSlotForSub.subjectName} ({activeSlotForSub.subjectCode})</strong></div>
                  <div>Scheduled Time: <strong>{activeSlotForSub.day} • {activeSlotForSub.slotId} ({activeSlotForSub.timeSlotLabel})</strong></div>
                  <div>Original Faculty: <strong style={{ color: '#dc2626' }}>{activeSlotForSub.teacherName}</strong> (Marked on Leave)</div>
                  <div>Classroom: <strong>{activeSlotForSub.roomId}</strong></div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    Available Department Faculty (Free at this specific slot):
                  </label>
                  
                  {loadingFreeFaculty ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scanning faculty schedules...</div>
                  ) : availableFreeFaculty.length === 0 ? (
                    <div style={{ color: '#dc2626', fontSize: '0.8rem', padding: '0.5rem', background: '#fef2f2', borderRadius: 6 }}>
                      No departmental faculty members are free during this period. You may switch this class to Online Mode or Suspend it.
                    </div>
                  ) : (
                    <select
                      value={selectedProxyTeacherId}
                      onChange={e => setSelectedProxyTeacherId(e.target.value)}
                      className="cgu-select"
                      style={{ width: '100%', borderColor: '#10b981', background: '#ecfdf5' }}
                    >
                      {availableFreeFaculty.map(f => (
                        <option key={f.id} value={f.id}>
                          ✓ {f.name} ({f.designation} • {f.department}) - Available Free
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    Reason for Proxy / Deployment
                  </label>
                  <input
                    type="text"
                    required
                    value={proxyReason}
                    onChange={e => setProxyReason(e.target.value)}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" onClick={() => setShowSubModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={availableFreeFaculty.length === 0}
                    className="btn-primary"
                    style={{ background: '#059669', borderColor: '#059669' }}
                  >
                    Confirm & Reassign Class
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
