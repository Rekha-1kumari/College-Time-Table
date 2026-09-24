import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, saveDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'cgu-timetable-coordinator-secret-2026';

app.use(cors());
app.use(express.json());

// Token Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Session expired or invalid' });
    req.user = user;
    next();
  });
}

// Role Authorization Middleware
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access restricted. Required role: ${roles.join(', ')}` });
    }
    next();
  };
}

// 1. Health & Meta
app.get('/api/health', (req, res) => {
  const db = getDb();
  res.json({
    status: 'ONLINE',
    system: 'CV Raman Global University — Timetable & Academic Scheduling Portal',
    activeTeachers: db.users.filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE').length,
    pendingApprovals: db.users.filter(u => u.status === 'PENDING_APPROVAL').length,
    scheduledSlots: db.timetable.length
  });
});

app.get('/api/meta', (req, res) => {
  const db = getDb();
  const activeTeachers = db.users
    .filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE')
    .map(({ password, ...u }) => u);

  res.json({
    university: db.university,
    sections: db.sections,
    rooms: db.rooms,
    subjects: db.subjects,
    timeSlots: db.timeSlots,
    facultyList: activeTeachers,
    pendingCount: db.users.filter(u => u.status === 'PENDING_APPROVAL').length
  });
});

// 2. Authentication (Login & Registration with Admin Approval)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid university email or password' });
  }

  // Check Approval Status
  if (user.status === 'PENDING_APPROVAL') {
    return res.status(403).json({
      error: 'ACCOUNT_PENDING_APPROVAL',
      message: 'Your registration is currently pending authorization by the Timetable Coordinator / Academic Admin. Please contact the CSE department.'
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, department: user.department },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...safeUser } = user;
  res.json({
    token,
    user: safeUser,
    message: `Logged in as ${user.name} (${user.role})`
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, department, designation, specialization, empCode, regNo, phone } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Please fill all mandatory fields (Name, Email, Password, Role)' });
  }

  const db = getDb();
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return res.status(400).json({ error: 'An account with this institutional email already exists' });
  }

  // New registrations are set to PENDING_APPROVAL unless it is the first admin setup
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    password,
    role: role.toUpperCase(),
    department: department || 'CSE',
    designation: designation || (role === 'TEACHER' ? 'Assistant Professor' : 'Student Scholar'),
    specialization: specialization || 'General Computer Science',
    empCode: empCode || (role === 'TEACHER' ? `CGU-FAC-${Date.now().toString().slice(-4)}` : undefined),
    regNo: regNo || (role === 'STUDENT' ? `230129${Date.now().toString().slice(-4)}` : undefined),
    maxHoursPerWeek: role === 'TEACHER' ? 16 : undefined,
    phone: phone || '',
    status: 'PENDING_APPROVAL', // Strict Admin Approval gate
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.users.push(newUser);
  saveDb(db);

  res.status(201).json({
    success: true,
    requiresApproval: true,
    message: 'Institutional registration submitted! Your account requires verification & approval by the Timetable Coordinator before sign-in is allowed.'
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// 3. Admin Approval Queue Endpoints
app.get('/api/admin/pending-users', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const db = getDb();
  const pending = db.users
    .filter(u => u.status === 'PENDING_APPROVAL')
    .map(({ password, ...u }) => u);
  res.json({ pendingUsers: pending, total: pending.length });
});

app.post('/api/admin/approve-user/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = 'ACTIVE';
  user.approvedAt = new Date().toISOString();
  user.approvedBy = req.user.name;
  saveDb(db);

  res.json({ message: `Account for ${user.name} (${user.role}) has been APPROVED and activated.` });
});

app.post('/api/admin/reject-user/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const rejectedName = db.users[index].name;
  db.users.splice(index, 1);
  saveDb(db);

  res.json({ message: `Registration for ${rejectedName} has been rejected and removed.` });
});

// 4. Live Faculty Workload Calculation Engine (for all 15 Faculty)
app.get('/api/admin/faculty-workload', authenticateToken, (req, res) => {
  const db = getDb();
  const teachers = db.users.filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE');

  const workloadStats = teachers.map(teacher => {
    const slots = db.timetable.filter(s => s.teacherId === teacher.id);
    let theoryHours = 0;
    let labHours = 0;

    slots.forEach(slot => {
      const subject = db.subjects.find(sub => sub.code === slot.subjectCode);
      if (subject?.type === 'Lab' || slot.slotId === 'P7') {
        labHours += 3; // Lab blocks account for 3 practical hours
      } else {
        theoryHours += 1;
      }
    });

    const totalHours = theoryHours + labHours;
    const maxHours = teacher.maxHoursPerWeek || 16;
    
    let workloadStatus = 'Optimal';
    if (totalHours > maxHours) workloadStatus = 'Overloaded';
    else if (totalHours < maxHours * 0.6) workloadStatus = 'Under-allocated';

    return {
      teacherId: teacher.id,
      name: teacher.name,
      designation: teacher.designation,
      specialization: teacher.specialization,
      empCode: teacher.empCode,
      theoryHours,
      labHours,
      totalHours,
      maxHours,
      percentage: Math.round((totalHours / maxHours) * 100),
      workloadStatus,
      assignedSlotsCount: slots.length
    };
  });

  res.json({ facultyWorkload: workloadStats });
});

// 5. Timetable Conflict Checking & Management
function detectClashes(candidate, existingSlots, ignoreId = null) {
  const conflicts = [];
  for (const slot of existingSlots) {
    if (ignoreId && slot.id === ignoreId) continue;
    if (slot.day !== candidate.day || slot.slotId !== candidate.slotId) continue;

    // Room Collision
    if (slot.roomId === candidate.roomId) {
      conflicts.push(`Room [${candidate.roomId}] is already allocated to Section [${slot.sectionId}] for Subject [${slot.subjectCode}].`);
    }

    // Teacher Double-Booking
    if (slot.teacherId === candidate.teacherId) {
      conflicts.push(`Faculty is already teaching Section [${slot.sectionId}] in Room [${slot.roomId}].`);
    }

    // Batch Collision
    if (slot.sectionId === candidate.sectionId) {
      conflicts.push(`Section [${candidate.sectionId}] is already scheduled with another course.`);
    }
  }
  return conflicts;
}

app.post('/api/timetable/check-clash', (req, res) => {
  const db = getDb();
  const conflicts = detectClashes(req.body, db.timetable, req.body.id);
  res.json({ hasClash: conflicts.length > 0, conflicts });
});

app.get('/api/timetable', (req, res) => {
  const { sectionId, teacherId, day, roomId } = req.query;
  const db = getDb();

  let slots = db.timetable.map(slot => {
    const subject = db.subjects.find(s => s.code === slot.subjectCode) || { name: slot.subjectCode, type: 'Theory' };
    const teacher = db.users.find(u => u.id === slot.teacherId) || { name: 'Unassigned', designation: 'Faculty' };
    const room = db.rooms.find(r => r.id === slot.roomId) || { name: slot.roomId, block: 'Campus' };
    const timeSlot = db.timeSlots.find(t => t.id === slot.slotId) || { label: slot.slotId };
    return {
      ...slot,
      subjectName: subject.name,
      subjectType: subject.type,
      teacherName: teacher.name,
      teacherDesignation: teacher.designation,
      roomName: room.name,
      roomType: room.type,
      timeSlotLabel: timeSlot.label
    };
  });

  if (sectionId && sectionId !== 'All') slots = slots.filter(s => s.sectionId === sectionId);
  if (teacherId && teacherId !== 'All') slots = slots.filter(s => s.teacherId === teacherId);
  if (day && day !== 'All') slots = slots.filter(s => s.day === day);
  if (roomId && roomId !== 'All') slots = slots.filter(s => s.roomId === roomId);

  res.json({ slots, total: slots.length });
});

app.post('/api/timetable', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { day, slotId, sectionId, subjectCode, teacherId, roomId } = req.body;
  if (!day || !slotId || !sectionId || !subjectCode || !teacherId || !roomId) {
    return res.status(400).json({ error: 'All fields are mandatory to assign a routine slot' });
  }

  const db = getDb();
  const candidate = { day, slotId, sectionId, subjectCode, teacherId, roomId };
  const clashes = detectClashes(candidate, db.timetable);

  if (clashes.length > 0) {
    return res.status(409).json({ error: 'Scheduling Collision Detected', clashes });
  }

  const newEntry = {
    id: `tt-${Date.now()}`,
    day,
    slotId,
    sectionId,
    subjectCode,
    teacherId,
    roomId
  };

  db.timetable.push(newEntry);
  saveDb(db);

  res.status(201).json({ slot: newEntry, message: 'Class slot allocated cleanly without clash' });
});

app.delete('/api/timetable/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.timetable = db.timetable.filter(s => s.id !== id);
  saveDb(db);
  res.json({ message: 'Period slot unassigned successfully' });
});

// Serve frontend build if available
const clientDistPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), err => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`Timetable Coordinator ERP Backend running on http://localhost:${PORT}`);
});
