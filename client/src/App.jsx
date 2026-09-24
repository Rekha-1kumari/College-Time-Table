import React, { useState, useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import DemoRoleSwitcher from './components/DemoRoleSwitcher';
import AuthView from './components/AuthView';
import VCDashboard from './components/VCDashboard';
import DeanHODDashboard from './components/DeanHODDashboard';
import AdminTimetableScheduler from './components/AdminTimetableScheduler';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AnnouncementsModal from './components/AnnouncementsModal';
import { api, getCurrentUser, setCurrentUser, setAuthToken } from './api/client';
import { 
  Building2, 
  CalendarRange, 
  BookOpen, 
  UserCheck, 
  Layers, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function App() {
  const [currentUser, setUser] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState('role_primary');
  const [showAnnouncements, setShowAnnouncements] = useState(false);

  // Initialize
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }

    api.getMeta()
      .then(data => setMeta(data))
      .catch(err => console.error("Error fetching metadata:", err))
      .finally(() => setLoadingMeta(false));
  }, []);

  const handleLoginSuccess = (user) => {
    setUser(user);
    setActiveMainTab('role_primary'); // Auto-redirect to their specific role dashboard
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setUser(null);
  };

  // Demo Switcher for fast review of hierarchy
  const handleSelectDemoUser = async (userId) => {
    // If not logged in or logged in, switch to that user
    const target = meta?.facultyList?.find(f => f.id === userId) ||
      (userId === 'vc-01' ? { id: 'vc-01', email: 'vc@cgu-odisha.ac.in', name: 'Prof. (Dr.) B. K. Sahoo', role: 'VC', title: "Hon'ble Vice Chancellor", department: 'All Schools', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' } :
      userId === 'dean-fet' ? { id: 'dean-fet', email: 'dean.engineering@cgu-odisha.ac.in', name: 'Prof. (Dr.) R. K. Mohapatra', role: 'DEAN', title: 'Dean, Faculty of Engineering & Technology', department: 'Engineering Sciences', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' } :
      userId === 'hod-cse' ? { id: 'hod-cse', email: 'hod.cse@cgu-odisha.ac.in', name: 'Dr. Suchismita Rautray', role: 'HOD', title: 'Head of Department (CSE)', department: 'CSE', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' } :
      userId === 'admin-tt' ? { id: 'admin-tt', email: 'timetable.officer@cgu-odisha.ac.in', name: 'Er. Manoj Pattnaik', role: 'ADMIN', title: 'Chief University Time Table Coordinator', department: 'Academic Section', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' } :
      userId === 'stu-501' ? { id: 'stu-501', email: 'rohit.behera@cgu.edu.in', name: 'Rohit Behera', role: 'STUDENT', title: 'Undergraduate Scholar', section: 'CSE-5A', department: 'CSE', semester: '5th Semester', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' } : null);

    if (target) {
      setUser(target);
      setCurrentUser(target);
      setActiveMainTab('role_primary'); // Auto-redirect to that role's primary view
    }
  };

  // If user is not authenticated, render AuthView
  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  // Determine Primary Role Title for subnav tab
  const getPrimaryRoleTitle = () => {
    switch (currentUser.role) {
      case 'VC': return 'Executive Directorate Cockpit';
      case 'DEAN': return 'Dean Engineering Council';
      case 'HOD': return 'CSE Departmental Console';
      case 'ADMIN': return 'Master Timetable Scheduler & Conflict Engine';
      case 'TEACHER': return 'Faculty Desk, Attendance & Logbook';
      case 'STUDENT': return 'My Section 5A Timetable & Notes';
      default: return 'Role Dashboard';
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <TopNavbar
        currentUser={currentUser}
        onLogout={handleLogout}
        meta={meta}
        onOpenAnnouncements={() => setShowAnnouncements(true)}
      />

      {/* Demo Role Switcher Strip */}
      <DemoRoleSwitcher
        currentRole={currentUser.role}
        activeUserId={currentUser.id}
        onSelectDemoUser={handleSelectDemoUser}
      />

      {/* Navigation Sub-Tabs allowing cross-checking */}
      <div className="subnav-tabs">
        <div className="subnav-inner">
          <button
            onClick={() => setActiveMainTab('role_primary')}
            className={`tab-btn ${activeMainTab === 'role_primary' ? 'active' : ''}`}
          >
            {currentUser.role === 'VC' && <Building2 size={16} />}
            {currentUser.role === 'DEAN' && <Layers size={16} />}
            {currentUser.role === 'HOD' && <BookOpen size={16} />}
            {currentUser.role === 'ADMIN' && <CalendarRange size={16} />}
            {currentUser.role === 'TEACHER' && <UserCheck size={16} />}
            {currentUser.role === 'STUDENT' && <Clock size={16} />}
            <span>{getPrimaryRoleTitle()} (Assigned Role)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('master_timetable')}
            className={`tab-btn ${activeMainTab === 'master_timetable' ? 'active' : ''}`}
          >
            <CalendarRange size={16} />
            <span>University Master Timetable & Conflict Matrix</span>
          </button>

          {currentUser.role !== 'TEACHER' && (
            <button
              onClick={() => setActiveMainTab('faculty_logbook_preview')}
              className={`tab-btn ${activeMainTab === 'faculty_logbook_preview' ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>Teacher Attendance & Key Notes Audit</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area with Dynamic Redirection */}
      <main className="main-wrapper">
        {activeMainTab === 'role_primary' && (
          <>
            {currentUser.role === 'VC' && <VCDashboard currentUser={currentUser} meta={meta} />}
            {(currentUser.role === 'DEAN' || currentUser.role === 'HOD') && <DeanHODDashboard currentUser={currentUser} meta={meta} />}
            {currentUser.role === 'ADMIN' && <AdminTimetableScheduler currentUser={currentUser} meta={meta} />}
            {currentUser.role === 'TEACHER' && <TeacherDashboard currentUser={currentUser} meta={meta} />}
            {currentUser.role === 'STUDENT' && <StudentDashboard currentUser={currentUser} meta={meta} />}
          </>
        )}

        {activeMainTab === 'master_timetable' && (
          <AdminTimetableScheduler currentUser={currentUser} meta={meta} />
        )}

        {activeMainTab === 'faculty_logbook_preview' && (
          <TeacherDashboard 
            currentUser={{
              id: 'fac-101',
              name: 'Dr. Priya Sharma',
              title: 'Associate Professor',
              department: 'CSE',
              empCode: 'CGU-FAC-2018-042',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
            }} 
            meta={meta} 
          />
        )}
      </main>

      {/* Announcements Modal */}
      <AnnouncementsModal
        isOpen={showAnnouncements}
        onClose={() => setShowAnnouncements(false)}
      />
    </div>
  );
}
