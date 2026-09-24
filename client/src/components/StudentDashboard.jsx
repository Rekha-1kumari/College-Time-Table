import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';

export default function StudentDashboard({ currentUser, meta }) {
  const [sectionSlots, setSectionSlots] = useState([]);
  const [lectureNotes, setLectureNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'schedule'

  const sectionId = currentUser.section || 'CSE-5A';
  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const ttRes = await api.getTimetable({ sectionId });
        setSectionSlots(ttRes.slots || []);

        const notesRes = await api.getNotes({ sectionId });
        setLectureNotes(notesRes.notes || []);
      } catch (err) {
        console.error("Error loading student view:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [sectionId]);

  const todayClasses = sectionSlots.filter(s => s.day.toLowerCase() === currentDayName.toLowerCase());

  return (
    <div>
      {/* Student Banner */}
      <div className="cgu-card punch-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 50%, #f0f7ff 100%)', borderColor: '#a7f3d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: 64, height: 64, borderRadius: 14, border: '2px solid #ffffff', boxShadow: 'var(--shadow-card)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentUser.name}
              </h2>
              <span className="role-tag student">
                Student Scholar
              </span>
            </div>
            <p style={{ color: '#047857', fontWeight: 700, fontSize: '0.85rem' }}>
              {sectionId} • Reg No: {currentUser.regNo || '2301297042'} • {currentUser.semester || '5th Semester'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              B.Tech Computer Science & Engineering • C.V. Raman Global University
            </p>
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1.25rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Cumulative Attendance</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>92.4%</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>✓ Eligible for End-Sem Exam</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setActiveTab('notes')}
          className={`btn-secondary ${activeTab === 'notes' ? 'btn-primary' : ''}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          <BookOpen size={16} />
          <span>Faculty Lecture Key Notes & Homework ({lectureNotes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`btn-secondary ${activeTab === 'schedule' ? 'btn-primary' : ''}`}
          style={{ padding: '0.5rem 1rem' }}
        >
          <Calendar size={16} />
          <span>Section Weekly Timetable ({sectionSlots.length} Slots)</span>
        </button>
      </div>

      {/* TAB 1: FACULTY KEY NOTES FEED */}
      {activeTab === 'notes' && (
        <div className="cgu-card">
          <div className="card-header-styled">
            <div>
              <h3>
                <FileText size={18} color="#0284c7" />
                <span>Classroom Lecture Key Notes & Assignments Posted by Faculty</span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Official daily takeaways, whiteboard derivations, and homework assignments
              </p>
            </div>
            <span className="academic-badge">NBA/NAAC Logbook Feed</span>
          </div>

          <div className="card-body">
            {lectureNotes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <BookOpen size={48} color="#bae6fd" style={{ margin: '0 auto 1rem' }} />
                <h4>No Key Notes Published for Your Section Yet</h4>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lectureNotes.map(note => (
                  <div key={note.id} className="note-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span className="slot-subject-code">{note.subjectCode}</span>
                          <strong style={{ fontSize: '0.92rem' }}>{note.topic}</strong>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.8rem' }}>
                          <span>Faculty: <strong>{note.teacherName}</strong></span>
                          <span>•</span>
                          <span>Unit: <strong>{note.unitNo}</strong></span>
                          <span>•</span>
                          <span>Delivered on: {note.date}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.75rem', background: 'var(--bg-sky-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-sky-subtle)' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--sky-primary)', marginBottom: '0.25rem' }}>
                        Lecture Summary & Core Concept Notes:
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {note.keyNotes}
                      </p>

                      {note.homeworkAssigned && (
                        <div style={{ marginTop: '0.5rem', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px dashed var(--border-sky)' }}>
                          <strong style={{ color: '#0369a1', fontSize: '0.8rem' }}>📝 Homework / Lab Submission: </strong>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>{note.homeworkAssigned}</span>
                        </div>
                      )}

                      {note.referenceLinks && (
                        <div style={{ marginTop: '0.4rem' }}>
                          <a href={note.referenceLinks} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: 'var(--sky-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
                            <ExternalLink size={12} />
                            Open Syllabus / LMS Reference Resource
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

      {/* TAB 2: SECTION TIMETABLE */}
      {activeTab === 'schedule' && (
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <Calendar size={18} color="#0284c7" />
              <span>Section {sectionId} Master Class Timetable</span>
            </h3>
            <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
              Print My Timetable
            </button>
          </div>
          <div className="card-body">
            <div className="timetable-scroll-wrapper">
              <table className="tt-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Slot</th>
                    <th>Subject</th>
                    <th>Faculty Professor</th>
                    <th>Room / Hall</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionSlots.map(slot => (
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
                        <strong>{slot.teacherName}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{slot.teacherTitle}</div>
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
      )}
    </div>
  );
}
