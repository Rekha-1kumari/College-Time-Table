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
    system: 'CV Raman Global University — Central Academic Scheduling ERP',
    coursesCount: db.courses.length,
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
    courses: db.courses,
    sections: db.sections,
    rooms: db.rooms,
    subjects: db.subjects,
    timeSlots: db.timeSlots,
    facultyList: activeTeachers,
    pendingCount: db.users.filter(u => u.status === 'PENDING_APPROVAL').length
  });
});

// 2. Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid university email or password' });
  }

  if (user.status === 'PENDING_APPROVAL') {
    return res.status(403).json({
      error: 'ACCOUNT_PENDING_APPROVAL',
      message: 'Your registration is currently pending review by the Chief Timetable Coordinator / Academic Admin.'
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
    return res.status(400).json({ error: 'Please provide all mandatory fields' });
  }

  const db = getDb();
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return res.status(400).json({ error: 'An account with this institutional email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    password,
    role: role.toUpperCase(),
    department: department || 'CSE',
    designation: designation || (role === 'TEACHER' ? 'Assistant Professor' : 'Student Scholar'),
    specialization: specialization || 'General Engineering',
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
    message: 'Institutional registration submitted! Awaiting administrator approval before sign-in.'
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

  res.json({ message: `Registration for ${rejectedName} has been rejected.` });
});

// 4. Faculty Workload Monitor
app.get('/api/admin/faculty-workload', authenticateToken, (req, res) => {
  const db = getDb();
  const teachers = db.users.filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE');

  const workloadStats = teachers.map(teacher => {
    const slots = db.timetable.filter(s => s.teacherId === teacher.id && s.mode !== 'SUSPENDED');
    let theoryHours = 0;
    let labHours = 0;

    slots.forEach(slot => {
      const subject = db.subjects.find(sub => sub.code === slot.subjectCode);
      if (subject?.type === 'Lab' || slot.slotId === 'P7') {
        labHours += 3;
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
      department: teacher.department,
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

// 5. Free Faculty Finder for any Day & Time Slot (Case 3: Daily substitution)
app.get('/api/timetable/free-faculty', (req, res) => {
  const { day, slotId } = req.query;
  const db = getDb();
  if (!day || !slotId) return res.status(400).json({ error: 'day and slotId are required' });

  const occupiedTeacherIds = db.timetable
    .filter(s => s.day === day && s.slotId === slotId && s.mode !== 'SUSPENDED')
    .map(s => s.teacherId);

  const freeFaculty = db.users
    .filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE' && !occupiedTeacherIds.includes(u.id))
    .map(({ password, ...u }) => u);

  res.json({ freeFaculty, total: freeFaculty.length });
});

// 6. Timetable Conflict Checking & Detailed Collision Analysis
function analyzeClashes(candidate, existingSlots, rooms, users, ignoreId = null) {
  const clashes = [];
  const occupiedRooms = [];
  const busyTeachers = [];

  for (const slot of existingSlots) {
    if (ignoreId && slot.id === ignoreId) continue;
    if (slot.mode === 'SUSPENDED') continue;
    if (slot.day !== candidate.day || slot.slotId !== candidate.slotId) continue;

    // Room Collision (Only if physical room)
    if (candidate.roomId !== 'STUDIO-ONLINE' && slot.roomId === candidate.roomId) {
      const room = rooms.find(r => r.id === candidate.roomId);
      clashes.push({
        type: 'ROOM_COLLISION',
        message: `Physical Room [${room?.name || candidate.roomId}] is already in use by Section [${slot.sectionId}] for course [${slot.subjectCode}].`
      });
      occupiedRooms.push(slot.roomId);
    }

    // Teacher Double-Booking
    if (slot.teacherId === candidate.teacherId) {
      const teacher = users.find(u => u.id === candidate.teacherId);
      clashes.push({
        type: 'TEACHER_BUSY',
        message: `Faculty [${teacher?.name || candidate.teacherId}] is already taking a lecture with Section [${slot.sectionId}] in Room [${slot.roomId}].`
      });
      busyTeachers.push(slot.teacherId);
    }

    // Batch Collision
    if (slot.sectionId === candidate.sectionId) {
      clashes.push({
        type: 'SECTION_BUSY',
        message: `This Batch / Group is already scheduled for course [${slot.subjectCode}].`
      });
    }
  }

  return { hasClash: clashes.length > 0, clashes, occupiedRooms, busyTeachers };
}

app.post('/api/timetable/check-clash', (req, res) => {
  const db = getDb();
  const analysis = analyzeClashes(req.body, db.timetable, db.rooms, db.users, req.body.id);
  res.json(analysis);
});

// 7. Timetable Query
app.get('/api/timetable', (req, res) => {
  const { sectionId, teacherId, day, roomId, course, branch, year } = req.query;
  const db = getDb();

  let slots = db.timetable.map(slot => {
    const subject = db.subjects.find(s => s.code === slot.subjectCode) || { name: slot.subjectCode, type: 'Theory', ltp: '3-0-0' };
    const teacher = db.users.find(u => u.id === slot.teacherId) || { name: 'Unassigned', designation: 'Faculty' };
    const room = db.rooms.find(r => r.id === slot.roomId) || { name: slot.roomId, block: 'Campus' };
    const timeSlot = db.timeSlots.find(t => t.id === slot.slotId) || { label: slot.slotId };
    const section = db.sections.find(sec => sec.id === slot.sectionId) || { name: slot.sectionId, courseId: 'BTECH', branchId: 'CSE', year: 3 };

    return {
      ...slot,
      subjectName: subject.name,
      subjectType: subject.type,
      subjectLtp: subject.ltp,
      teacherName: teacher.name,
      teacherDesignation: teacher.designation,
      teacherDepartment: teacher.department,
      roomName: room.name,
      roomType: room.type,
      timeSlotLabel: timeSlot.label,
      sectionName: section.name,
      courseId: section.courseId,
      branchId: section.branchId,
      academicYear: section.year
    };
  });

  if (sectionId && sectionId !== 'All' && sectionId !== 'undefined') slots = slots.filter(s => s.sectionId === sectionId);
  if (teacherId && teacherId !== 'All' && teacherId !== 'undefined') slots = slots.filter(s => s.teacherId === teacherId);
  if (day && day !== 'All' && day !== 'undefined') slots = slots.filter(s => s.day === day);
  if (roomId && roomId !== 'All' && roomId !== 'undefined') slots = slots.filter(s => s.roomId === roomId);
  if (course && course !== 'All' && course !== 'undefined') slots = slots.filter(s => s.courseId === course);
  if (branch && branch !== 'All' && branch !== 'undefined') slots = slots.filter(s => s.branchId === branch);
  if (year && year !== 'All' && year !== 'undefined') slots = slots.filter(s => s.academicYear === Number(year));

  res.json({ slots, total: slots.length });
});

// 8. Timetable Slot Mutation
app.post('/api/timetable', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { day, slotId, sectionId, subjectCode, teacherId, roomId, mode } = req.body;
  if (!day || !slotId || !sectionId || !subjectCode || !teacherId || !roomId) {
    return res.status(400).json({ error: 'All parameters (day, slotId, sectionId, subjectCode, teacherId, roomId) are required' });
  }

  const db = getDb();
  const candidate = { day, slotId, sectionId, subjectCode, teacherId, roomId, mode: mode || 'PHYSICAL' };
  const analysis = analyzeClashes(candidate, db.timetable, db.rooms, db.users);

  if (analysis.hasClash) {
    return res.status(409).json({
      error: 'Scheduling Conflict Detected',
      clashes: analysis.clashes
    });
  }

  const newEntry = {
    id: `tt-${Date.now()}`,
    ...candidate
  };

  db.timetable.push(newEntry);
  saveDb(db);

  res.status(201).json({ slot: newEntry, message: 'Class slot allocated cleanly without collision' });
});

app.delete('/api/timetable/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.timetable = db.timetable.filter(s => s.id !== id);
  saveDb(db);
  res.json({ message: 'Slot successfully unassigned from routine' });
});

// 9. Case 1: Auto-Generate Balanced Routine for Beginning of Semester
app.post('/api/timetable/auto-generate', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { sectionId } = req.body;
  const db = getDb();
  const section = db.sections.find(s => s.id === sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  // Filter department subjects
  const deptSubjects = db.subjects.filter(sub => sub.dept === section.branchId || sub.dept === 'CSE');
  const teachers = db.users.filter(u => u.role === 'TEACHER' && u.status === 'ACTIVE' && (u.department === section.branchId || u.department === 'CSE'));
  const theoryRoom = db.rooms.find(r => r.type === 'Theory') || db.rooms[0];
  const labRoom = db.rooms.find(r => r.type === 'Lab') || db.rooms[1];

  if (deptSubjects.length === 0 || teachers.length === 0) {
    return res.status(400).json({ error: 'Insufficient subjects or faculty mapped for this branch' });
  }

  // Clear existing slots for this section to cleanly regenerate
  db.timetable = db.timetable.filter(s => s.sectionId !== sectionId);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const theorySlots = ['P1', 'P2', 'P3', 'P4'];
  const generatedSlots = [];

  let subIdx = 0;
  let teacherIdx = 0;

  days.forEach((day, dIdx) => {
    // 3 theory periods in morning
    for (let i = 0; i < 3; i++) {
      const slotId = theorySlots[i];
      const subject = deptSubjects[subIdx % deptSubjects.length];
      const teacher = teachers[teacherIdx % teachers.length];
      subIdx++;
      teacherIdx++;

      const newSlot = {
        id: `gen-${sectionId}-${day}-${slotId}-${Date.now().toString().slice(-4)}`,
        day,
        slotId,
        sectionId,
        subjectCode: subject.code,
        teacherId: teacher.id,
        roomId: theoryRoom.id,
        mode: 'PHYSICAL'
      };
      db.timetable.push(newSlot);
      generatedSlots.push(newSlot);
    }

    // 2 lab blocks per week (e.g. Wednesday and Friday)
    if (day === 'Wednesday' || day === 'Friday') {
      const labSubject = deptSubjects.find(s => s.type === 'Lab') || deptSubjects[0];
      const labSlot = {
        id: `gen-${sectionId}-${day}-P7-${Date.now().toString().slice(-4)}`,
        day,
        slotId: 'P7',
        sectionId,
        subjectCode: labSubject.code,
        teacherId: teachers[(dIdx + 2) % teachers.length].id,
        roomId: labRoom.id,
        mode: 'PHYSICAL'
      };
      db.timetable.push(labSlot);
      generatedSlots.push(labSlot);
    }
  });

  saveDb(db);
  res.json({
    message: `Standard Semester Routine auto-generated for ${section.name}!`,
    slotsCount: generatedSlots.length,
    slots: generatedSlots
  });
});

// 10. Case 3: Reassign Faculty on Leave / Substitute Reassignment
app.post('/api/timetable/:id/reassign', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const { newTeacherId, reason } = req.body;
  const db = getDb();

  const slot = db.timetable.find(s => s.id === id);
  if (!slot) return res.status(404).json({ error: 'Timetable slot not found' });

  const newTeacher = db.users.find(u => u.id === newTeacherId);
  if (!newTeacher) return res.status(404).json({ error: 'Substitute faculty not found' });

  // Check if substitute teacher is already busy
  const clash = db.timetable.find(s => s.id !== id && s.day === slot.day && s.slotId === slot.slotId && s.teacherId === newTeacherId && s.mode !== 'SUSPENDED');
  if (clash) {
    return res.status(409).json({ error: `${newTeacher.name} is already teaching Section [${clash.sectionId}] in Room [${clash.roomId}] at this time.` });
  }

  slot.previousTeacherId = slot.teacherId;
  slot.teacherId = newTeacherId;
  slot.reassignedReason = reason || 'Faculty Casual Leave / On-Duty Deployment';
  slot.reassignedAt = new Date().toISOString();

  saveDb(db);
  res.json({ slot, message: `Class reassigned to ${newTeacher.name} successfully.` });
});

// 11. Mode Switch: Shift to Online Mode or Suspend Class
app.post('/api/timetable/:id/mode', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const { mode, reason } = req.body; // 'PHYSICAL', 'ONLINE', 'SUSPENDED'
  const db = getDb();

  const slot = db.timetable.find(s => s.id === id);
  if (!slot) return res.status(404).json({ error: 'Slot not found' });

  slot.mode = mode;
  if (mode === 'ONLINE') {
    slot.roomId = 'STUDIO-ONLINE';
    slot.onlineMeetingLink = `https://meet.google.com/cgu-${slot.sectionId.toLowerCase()}`;
  }
  if (mode === 'SUSPENDED') {
    slot.suspendedReason = reason || 'Class suspended by Academic Office';
  }

  saveDb(db);
  res.json({ slot, message: `Slot status updated to ${mode}` });
});

// 12. Campus Resource Occupancy Ledger ("See who is allocated to what")
app.get('/api/timetable/occupancy-ledger', (req, res) => {
  const db = getDb();
  const rooms = db.rooms;
  const slots = db.timeSlots.filter(t => !t.isBreak);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Matrix of room occupancy
  const roomLedger = rooms.map(room => {
    const allocations = db.timetable.filter(t => t.roomId === room.id && t.mode !== 'SUSPENDED').map(t => {
      const subject = db.subjects.find(s => s.code === t.subjectCode) || {};
      const teacher = db.users.find(u => u.id === t.teacherId) || {};
      const section = db.sections.find(s => s.id === t.sectionId) || {};
      return {
        id: t.id,
        day: t.day,
        slotId: t.slotId,
        subjectCode: t.subjectCode,
        subjectName: subject.name,
        teacherName: teacher.name,
        sectionName: section.name || t.sectionId
      };
    });
    return {
      roomId: room.id,
      roomName: room.name,
      capacity: room.capacity,
      type: room.type,
      block: room.block,
      allocations
    };
  });

  res.json({ roomLedger, days, periods: slots });
});

// Static frontend serving
const clientDistPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), err => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log(`University ERP Central Coordinator running on http://localhost:${PORT}`);
});
