import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import TeacherScheduleView from './components/TeacherScheduleView';
import StudentDashboard from './components/StudentDashboard';
import { api, getCurrentUser, setCurrentUser, setAuthToken } from './api/client';

export default function App() {
  const [currentUser, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'register'
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }

    api.getMeta()
      .then(data => setMeta(data))
      .catch(err => console.error("Error fetching metadata:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLoginSuccess = (user) => {
    setUser(user);
    // Refresh meta to get updated counts
    api.getMeta().then(data => setMeta(data));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setUser(null);
    setCurrentView('landing');
  };

  // 1. If user is logged in, show their dashboard based on role
  if (currentUser) {
    if (currentUser.role === 'ADMIN') {
      return (
        <CoordinatorDashboard 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          meta={meta} 
        />
      );
    }

    if (currentUser.role === 'TEACHER') {
      return (
        <TeacherScheduleView 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          meta={meta} 
        />
      );
    }

    if (currentUser.role === 'STUDENT') {
      return (
        <StudentDashboard 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          meta={meta} 
        />
      );
    }
  }

  // 2. Unauthenticated Views: Landing, Login, or Register
  if (currentView === 'login') {
    return (
      <LoginPage 
        onNavigate={setCurrentView} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterPage 
        onNavigate={setCurrentView} 
      />
    );
  }

  // Default: Landing Page
  return (
    <LandingPage 
      onNavigate={setCurrentView} 
    />
  );
}
