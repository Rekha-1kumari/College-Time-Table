import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Building2, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Bell, 
  Send,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { api } from '../api/client';

export default function VCDashboard({ currentUser, meta }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState('High');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await api.getVcOverview();
        setAnalytics(data);
      } catch (err) {
        console.error("Error loading VC analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      await api.createAnnouncement({
        title: broadcastTitle,
        content: broadcastContent,
        priority: broadcastPriority,
        targetRole: 'ALL'
      });
      setBroadcastSuccess('University-wide executive memo broadcasted to all Deans, Faculty, and Students.');
      setBroadcastTitle('');
      setBroadcastContent('');
      setTimeout(() => setBroadcastSuccess(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      {/* Executive Welcome Banner */}
      <div className="cgu-card punch-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #f0f7ff 100%)', borderColor: '#fbcfe8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 8px 16px rgba(219, 39, 119, 0.25)'
          }}>
            <Crown size={34} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentUser.name}
              </h2>
              <span className="role-tag vc">
                Vice Chancellor Directorate
              </span>
            </div>
            <p style={{ color: '#db2777', fontWeight: 700, fontSize: '0.85rem' }}>
              Executive Institutional Cockpit • C.V. Raman Global University
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Autonomous Academic Cycle 2026-27 | Real-time Timetable Adherence & Faculty Load Monitoring
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="academic-badge" style={{ background: '#fdf2f8', borderColor: '#fbcfe8', color: '#db2777' }}>
            <ShieldCheck size={14} />
            Institutional Quality Standard: NAAC A++
          </span>
        </div>
      </div>

      {/* University Metric Widgets */}
      <div className="stats-grid">
        <div className="stat-widget" style={{ borderLeftColor: '#db2777' }}>
          <div className="stat-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="stat-number">{analytics?.metrics?.overallTimetableAdherence || '99.2%'}</div>
            <div className="stat-label">Timetable Slot Adherence</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-box">
            <Building2 size={22} />
          </div>
          <div>
            <div className="stat-number">{analytics?.metrics?.roomUtilization || '78%'}</div>
            <div className="stat-label">Classroom / Lab Utilization</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-box">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-number">{analytics?.metrics?.activeFacultyOnCampus || '3/3'}</div>
            <div className="stat-label">Faculty Present on Campus</div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-number">{analytics?.metrics?.nbaLogbookFilingRate || '94.8%'}</div>
            <div className="stat-label">NAAC Keynote Filing Rate</div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: School Comparison & Faculty Workload */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Department / School Breakdown */}
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <Layers size={18} color="#0284c7" />
              <span>School & Department Timetable Performance</span>
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Live Academic Adherence</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analytics?.deptStats?.map(dept => (
                <div key={dept.deptId} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <div>
                      <span className="slot-subject-code">{dept.deptId}</span>
                      <strong style={{ marginLeft: '0.5rem', fontSize: '0.88rem' }}>{dept.name}</strong>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                      {dept.adherenceRate}% Adherence
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>Enrolled Scholars: <strong>{dept.studentStrength}</strong></span>
                    <span>Assigned Weekly Periods: <strong>{dept.scheduledPeriods}</strong></span>
                    <span>Core Faculty: <strong>{dept.facultyCount}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Workload Audit */}
        <div className="cgu-card">
          <div className="card-header-styled">
            <h3>
              <BarChart3 size={18} color="#0284c7" />
              <span>Faculty Workload & Digital Diary Compliance</span>
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Weekly Credit Balances</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analytics?.facultyLoad?.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-sky-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-sky-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{f.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {f.dept} Dept • Logged Notes: <strong>{f.notesCount} Sessions</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--sky-primary)' }}>
                      {f.periodsAssigned} Periods / Week
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      background: f.workloadStatus === 'Optimal' ? 'var(--success-bg)' : '#e0f2fe',
                      color: f.workloadStatus === 'Optimal' ? 'var(--success)' : 'var(--sky-primary)'
                    }}>
                      {f.workloadStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VC Executive Broadcast Dispatcher */}
      <div className="cgu-card">
        <div className="card-header-styled">
          <h3>
            <Bell size={18} color="#db2777" />
            <span>Hon'ble Vice Chancellor Executive Circular / Broadcast Dispatcher</span>
          </h3>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Direct University Broadcast</span>
        </div>
        <div className="card-body">
          {broadcastSuccess && (
            <div style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0', color: 'var(--success)', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.84rem' }}>
              ✓ {broadcastSuccess}
            </div>
          )}

          <form onSubmit={handleSendBroadcast}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Circular Subject / Academic Directive Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Continuous Evaluation & NAAC Accreditation Timetable Freeze"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="cgu-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Priority Level
                </label>
                <select
                  value={broadcastPriority}
                  onChange={e => setBroadcastPriority(e.target.value)}
                  className="cgu-select"
                  style={{ width: '100%' }}
                >
                  <option value="Urgent">Urgent / Executive</option>
                  <option value="High">High Priority</option>
                  <option value="Standard">Standard Circular</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Executive Order Content (Reaches all Campus Dashboards)
              </label>
              <textarea
                rows={3}
                required
                placeholder="Enter academic scheduling guidelines, semester exam blocks, or holiday announcements..."
                value={broadcastContent}
                onChange={e => setBroadcastContent(e.target.value)}
                className="cgu-input"
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ background: '#db2777', borderColor: '#db2777' }}>
              <Send size={15} />
              <span>Broadcast Executive Directive to All Schools</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
