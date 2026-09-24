import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  BookOpen, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  MapPin, 
  Users, 
  Award, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';

export default function TeacherDashboard({ currentUser, meta }) {
  const [activeTab, setActiveTab] = useState('notes'); // 'today', 'notes', 'substitutions', 'all_schedule'
  const [loading, setLoading] = useState(false);
  const [mySlots, setMySlots] = useState([]);
  const [myNotes, setMyNotes] = useState([]);
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [punchStatus, setPunchStatus] = useState('Present');
  const [punchRemarks, setPunchRemarks] = useState('Active on Ramanujan Block Campus');
  const [punchMessage, setPunchMessage] = useState('');

  // New Key Note Modal State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedSlotForNote, setSelectedSlotForNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    subjectCode: '',
    sectionId: '',
    unitNo: 'Unit II',
    topic: '',
    studentAttendanceCount: 64,
    totalStudents: 68,
    keyNotes: '',
    learningOutcomesAchieved: '',
    homeworkAssigned: '',
    referenceLinks: ''
  });
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState('');

  // Proxy / Substitution State
  const [showSubModal, setShowSubModal] = useState(false);
  const [subForm, setSubForm] = useState({
    day: 'Friday',
    slotId: 'P5',
    substituteTeacherId: 'fac-102',
    subjectCode: 'CS501',
    sectionId: 'CSE-5A',
    roomId: 'LH-101',
    reason: 'Attending IEEE AI Symposium'
  });
  const [subSuccess, setSubSuccess] = useState('');

  const loadTeacherData = async () => {
    setLoading(true);
    try {
      // 1. My timetable slots
      const ttRes = await api.getTimetable({ teacherId: currentUser.id });
      setMySlots(ttRes.slots || []);

      // 2. My notes
      const notesRes = await api.getNotes({ teacherId: currentUser.id });
      setMyNotes(notesRes.notes || []);

      // 3. Today's attendance
      const today = new Date().toISOString().split('T')[0];
      const attRes = await api.getTeacherAttendance({ teacherId: currentUser.id, date: today });
      if (attRes.records && attRes.records.length > 0) {
        setAttendanceRecord(attRes.records[0]);
        setPunchStatus(attRes.records[0].status);
      }
    } catch (err) {
      console.error("Error loading teacher portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, [currentUser]);

  const handlePunchAttendance = async (status) => {
    try {
      const res = await api.punchAttendance({
        status,
        remarks: punchRemarks,
        mode: 'Biometric / Geofenced Smart Punch'
      });
      setAttendanceRecord(res.record);
      setPunchStatus(status);
      setPunchMessage(res.message);
      setTimeout(() => setPunchMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenNoteModal = (slot = null) => {
    if (slot) {
      setSelectedSlotForNote(slot);
      setNoteForm({
        ...noteForm,
        subjectCode: slot.subjectCode,
        sectionId: slot.sectionId,
        topic: `Lecture Session on ${slot.subjectName}`,
        unitNo: 'Unit II: Core Architectures'
      });
    } else {
      setSelectedSlotForNote(null);
      setNoteForm({
        ...noteForm,
        subjectCode: mySlots[0]?.subjectCode || 'CS501',
        sectionId: mySlots[0]?.sectionId || 'CSE-5A',
        topic: '',
        keyNotes: ''
      });
    }
    setShowNoteModal(true);
    setNoteSuccess('');
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    setNoteSaving(true);
    try {
      await api.createNote({
        ...noteForm,
        timetableId: selectedSlotForNote?.id || `custom-${Date.now()}`
      });
      setNoteSuccess('Lecture Key Notes logged in NAAC/NBA digital repository successfully!');
      setTimeout(() => {
        setShowNoteModal(false);
        setNoteSuccess('');
        loadTeacherData();
      }, 1500);
    } catch (err) {
      alert(err.message);
    } finally {
      setNoteSaving(false);
    }
  };

  const handleRequestSubstitution = async (e) => {
    e.preventDefault();
    try {
      await api.requestSubstitution(subForm);
      setSubSuccess('Proxy request submitted to Head of Department (HOD) for authorization.');
      setTimeout(() => {
        setShowSubModal(false);
        setSubSuccess('');
      }, 1800);
    } catch (err) {
      alert(err.message);
    }
  };

  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = mySlots.filter(s => s.day.toLowerCase() === currentDayName.toLowerCase()) || [];

  return (
    <div>
      {/* Teacher Profile Banner & Punch-in Strip */}
      <div className="cgu-card punch-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            style={{ width: 64, height: 64, borderRadius: 14, border: '2px solid #ffffff', boxShadow: 'var(--shadow-card)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentUser.name}
              </h2>
              <span className="role-tag teacher">
                {currentUser.title || 'Faculty Professor'}
              </span>
            </div>
            <p style={{ color: 'var(--sky-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
              {currentUser.department} Department • Employee Code: {currentUser.empCode || 'CGU-FAC-2018-042'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Total Weekly Load: <strong>{mySlots.length} Lecture Hours</strong></span>
              <span>•</span>
              <span>Logged Keynotes: <strong>{myNotes.length} Sessions</strong></span>
            </div>
          </div>
        </div>

        {/* Real-time Punch-in System */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-sky)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          minWidth: '280px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <UserCheck size={14} color="#0284c7" />
              Teacher Daily Attendance Status
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              background: attendanceRecord?.status === 'Present' ? 'var(--success-bg)' : '#fef3c7',
              color: attendanceRecord?.status === 'Present' ? 'var(--success)' : '#b45309'
            }}>
              {attendanceRecord?.status || 'Not Punched Today'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => handlePunchAttendance('Present')}
              className="btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              Punch Present
            </button>
            <button
              onClick={() => handlePunchAttendance('In-Lecture')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              In-Lecture
            </button>
            <button
              onClick={() => handlePunchAttendance('On-Duty')}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            >
              On-Duty / Lab
            </button>
          </div>

          {attendanceRecord && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
              Punched at <strong>{attendanceRecord.checkInTime}</strong> via {attendanceRecord.mode}
            </div>
          )}
          {punchMessage && (
            <div style={{ fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.3rem', fontWeight: 600 }}>
              ✓ {punchMessage}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setActiveTab('notes')}
          className={`btn-secondary ${activeTab === 'notes' ? 'btn-primary' : ''}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          <BookOpen size={16} />
          <span>Lecture Key Notes & Logbook ({myNotes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`btn-secondary ${activeTab === 'today' ? 'btn-primary' : ''}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          <Calendar size={16} />
          <span>Today's Classes ({todayClasses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('all_schedule')}
          className={`btn-secondary ${activeTab === 'all_schedule' ? 'btn-primary' : ''}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          <Clock size={16} />
          <span>My Full Weekly Timetable ({mySlots.length})</span>
        </button>
        <button
          onClick={() => setShowSubModal(true)}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', marginLeft: 'auto', borderColor: 'var(--border-sky)' }}
        >
          <Send size={15} color="#0284c7" />
          <span>Request Proxy / Substitution</span>
        </button>
      </div>

      {/* TAB 1: LECTURE KEY NOTES & LOGBOOK */}
      {activeTab === 'notes' && (
        <div className="cgu-card">
          <div className="card-header-styled">
            <div>
              <h3>
                <FileText size={18} color="#0284c7" />
                <span>NAAC & NBA Digital Academic Logbook (Continuous Lecture Diary)</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Systematic documentation of unit progress, conceptual key notes, learning outcomes, and student attendance
              </p>
            </div>
            <button 
              onClick={() => handleOpenNoteModal()} 
              className="btn-primary"
              style={{ fontSize: '0.82rem' }}
            >
              <PlusCircle size={15} />
              <span>Log New Lecture Key Note</span>
            </button>
          </div>

          <div className="card-body">
            {myNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <BookOpen size={48} color="#bae6fd" style={{ margin: '0 auto 1rem' }} />
                <h4>No Lecture Keynotes Logged Yet</h4>
                <p style={{ fontSize: '0.84rem', marginTop: '0.35rem' }}>
                  Click "Log New Lecture Key Note" above to register syllabus coverage and lecture takeaways.
                </p>
              </div>
            ) : (
              <div>
                {myNotes.map((note) => (
                  <div key={note.id} className="note-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                          <span className="slot-subject-code">{note.subjectCode}</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {note.topic}
                          </span>
                          <span className="naac-badge">
                            <ShieldCheck size={12} />
                            NAAC Audited Log
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <span><strong>Section:</strong> {note.sectionId}</span>
                          <span>•</span>
                          <span><strong>Unit:</strong> {note.unitNo}</span>
                          <span>•</span>
                          <span><strong>Date:</strong> {note.date}</span>
                          <span>•</span>
                          <span><strong>Student Attendance:</strong> <span style={{ color: 'var(--success)', fontWeight: 700 }}>{note.studentAttendanceCount}/{note.totalStudents || 68} ({Math.round((note.studentAttendanceCount/(note.totalStudents||68))*100)}%)</span></span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button 
                          onClick={async () => {
                            if (confirm('Archive this lecture entry?')) {
                              await api.deleteNote(note.id);
                              loadTeacherData();
                            }
                          }}
                          className="btn-danger-outline"
                        >
                          Archive
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.85rem', background: 'var(--bg-sky-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', border: '1px solid var(--border-sky-subtle)' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sky-primary)', marginBottom: '0.2rem' }}>
                        Key Lecture Takeaways & Core Concepts Delivered:
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {note.keyNotes}
                      </p>

                      {note.learningOutcomesAchieved && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <strong>Learning Outcomes Achieved:</strong> {note.learningOutcomesAchieved}
                        </div>
                      )}

                      {note.homeworkAssigned && (
                        <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)', background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: 4, border: '1px dashed var(--border-sky)' }}>
                          <strong>Assignment / Lab Task Given:</strong> {note.homeworkAssigned}
                        </div>
                      )}

                      {note.referenceLinks && (
                        <div style={{ marginTop: '0.35rem' }}>
                          <a 
                            href={note.referenceLinks} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ fontSize: '0.76rem', color: 'var(--sky-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                          >
                            <ExternalLink size={12} />
                            Reference Academic Materials / Syllabus URL
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TODAY'S CLASSES */}
      {activeTab === 'today' && (
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <Clock size={18} color="#0284c7" />
              <span>Today's Scheduled Periods ({currentDayName})</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Smart room allocation active
            </span>
          </div>
          <div className="card-body">
            {todayClasses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <Calendar size={48} color="#bae6fd" style={{ margin: '0 auto 1rem' }} />
                <h4>No Scheduled Lectures for Today ({currentDayName})</h4>
                <p style={{ fontSize: '0.84rem' }}>
                  Use this time for research, tutorial planning, or student mentoring.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {todayClasses.map(slot => (
                  <div key={slot.id} className="slot-class-card" style={{ padding: '1rem', borderLeftWidth: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="slot-subject-code">{slot.subjectCode}</span>
                      <span className="academic-badge" style={{ fontSize: '0.72rem' }}>
                        {slot.slotId}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0.35rem 0' }}>
                      {slot.subjectName}
                    </h4>
                    <div className="slot-meta" style={{ gap: '0.4rem', margin: '0.75rem 0' }}>
                      <div className="slot-meta-item">
                        <Clock size={14} color="#0284c7" />
                        <span>{slot.timeSlotLabel}</span>
                      </div>
                      <div className="slot-meta-item">
                        <MapPin size={14} color="#0284c7" />
                        <span><strong>{slot.roomName}</strong> ({slot.roomBlock})</span>
                      </div>
                      <div className="slot-meta-item">
                        <Users size={14} color="#0284c7" />
                        <span>Section: <strong>{slot.sectionName}</strong></span>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenNoteModal(slot)}
                        className="btn-primary" 
                        style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem', width: '100%', justifyContent: 'center' }}
                      >
                        <FileText size={14} />
                        Log Key Notes for this Class
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FULL WEEKLY TIMETABLE */}
      {activeTab === 'all_schedule' && (
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <Calendar size={18} color="#0284c7" />
              <span>Full Weekly Teaching Schedule</span>
            </h3>
            <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
              Print Schedule
            </button>
          </div>
          <div className="card-body">
            <div className="timetable-scroll-wrapper">
              <table className="tt-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Period / Time</th>
                    <th>Subject Code & Name</th>
                    <th>Section</th>
                    <th>Assigned Classroom</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mySlots.map(slot => (
                    <tr key={slot.id}>
                      <td className="day-header-cell">{slot.day}</td>
                      <td>
                        <strong>{slot.slotId}</strong>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{slot.timeSlotLabel}</div>
                      </td>
                      <td>
                        <span className="slot-subject-code">{slot.subjectCode}</span>
                        <div style={{ fontWeight: 600 }}>{slot.subjectName}</div>
                      </td>
                      <td>{slot.sectionId}</td>
                      <td>
                        <strong>{slot.roomId}</strong>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{slot.roomName}</div>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleOpenNoteModal(slot)}
                          className="btn-secondary"
                          style={{ fontSize: '0.74rem', padding: '0.25rem 0.5rem' }}
                        >
                          + Log Note
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG LECTURE KEY NOTES */}
      {showNoteModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="card-header-styled">
              <h3>
                <FileText size={18} color="#0284c7" />
                <span>Lecture Key Notes & Digital Logbook Entry</span>
              </h3>
              <button 
                onClick={() => setShowNoteModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} style={{ padding: '1.25rem' }}>
              {noteSuccess && (
                <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.84rem' }}>
                  ✓ {noteSuccess}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Subject Code</label>
                  <input
                    type="text"
                    required
                    value={noteForm.subjectCode}
                    onChange={e => setNoteForm({ ...noteForm, subjectCode: e.target.value })}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Section / Batch</label>
                  <input
                    type="text"
                    required
                    value={noteForm.sectionId}
                    onChange={e => setNoteForm({ ...noteForm, sectionId: e.target.value })}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Syllabus Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit II: Recurrences & Matrix Mult"
                    value={noteForm.unitNo}
                    onChange={e => setNoteForm({ ...noteForm, unitNo: e.target.value })}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Students Present in Session</label>
                  <input
                    type="number"
                    required
                    value={noteForm.studentAttendanceCount}
                    onChange={e => setNoteForm({ ...noteForm, studentAttendanceCount: e.target.value })}
                    className="cgu-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Topic Covered / Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strassen's Matrix Multiplication & Master Theorem Proofs"
                  value={noteForm.topic}
                  onChange={e => setNoteForm({ ...noteForm, topic: e.target.value })}
                  className="cgu-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Key Lecture Notes, Theorems & Derivations (NBA/NAAC Audit Record)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Summarize the core equations, algorithms, concepts covered, student questions addressed, and whiteboard notes..."
                  value={noteForm.keyNotes}
                  onChange={e => setNoteForm({ ...noteForm, keyNotes: e.target.value })}
                  className="cgu-input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Learning Outcomes Achieved</label>
                <input
                  type="text"
                  placeholder="e.g. Students can solve divide-and-conquer recurrence relations independently"
                  value={noteForm.learningOutcomesAchieved}
                  onChange={e => setNoteForm({ ...noteForm, learningOutcomesAchieved: e.target.value })}
                  className="cgu-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Homework / Lab Task Assigned</label>
                <input
                  type="text"
                  placeholder="e.g. Implement Strassen's algorithm in Python and submit execution benchmark"
                  value={noteForm.homeworkAssigned}
                  onChange={e => setNoteForm({ ...noteForm, homeworkAssigned: e.target.value })}
                  className="cgu-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Reference Link / Syllabus Reading (Optional)</label>
                <input
                  type="url"
                  placeholder="https://mit-press.mit.edu/algorithms or LMS link"
                  value={noteForm.referenceLinks}
                  onChange={e => setNoteForm({ ...noteForm, referenceLinks: e.target.value })}
                  className="cgu-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowNoteModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={noteSaving}
                  className="btn-primary"
                >
                  {noteSaving ? 'Saving to NAAC Logbook...' : 'Commit Lecture Key Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST PROXY / SUBSTITUTION */}
      {showSubModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="card-header-styled">
              <h3>
                <Send size={18} color="#0284c7" />
                <span>Faculty Proxy / Class Substitution Request</span>
              </h3>
              <button 
                onClick={() => setShowSubModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestSubstitution} style={{ padding: '1.25rem' }}>
              {subSuccess && (
                <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.84rem' }}>
                  ✓ {subSuccess}
                </div>
              )}

              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Request a fellow department professor to cover your scheduled lecture. Once approved by the Dean/HOD, the university timetable automatically updates.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Day</label>
                  <select
                    value={subForm.day}
                    onChange={e => setSubForm({ ...subForm, day: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Time Slot</label>
                  <select
                    value={subForm.slotId}
                    onChange={e => setSubForm({ ...subForm, slotId: e.target.value })}
                    className="cgu-select"
                    style={{ width: '100%' }}
                  >
                    <option value="P1">Period 1 (08:30 - 09:25)</option>
                    <option value="P2">Period 2 (09:25 - 10:20)</option>
                    <option value="P3">Period 3 (10:35 - 11:30)</option>
                    <option value="P4">Period 4 (11:30 - 12:25)</option>
                    <option value="P5">Period 5 (01:15 - 02:10)</option>
                    <option value="P6">Period 6 (02:10 - 03:05)</option>
                    <option value="P7">Lab Session (03:15 - 05:00)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Designated Substitute Faculty</label>
                <select
                  value={subForm.substituteTeacherId}
                  onChange={e => setSubForm({ ...subForm, substituteTeacherId: e.target.value })}
                  className="cgu-select"
                  style={{ width: '100%' }}
                >
                  <option value="fac-102">Prof. Arun Verma (Systems & Networks)</option>
                  <option value="fac-103">Dr. Meenakshi Jena (AIML Lead)</option>
                  <option value="hod-cse">Dr. Suchismita Rautray (HOD CSE)</option>
                </select>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Reason for Proxy / Leave</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attending National Accreditation Workshop / Medical Leave"
                  value={subForm.reason}
                  onChange={e => setSubForm({ ...subForm, reason: e.target.value })}
                  className="cgu-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowSubModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Proxy Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
