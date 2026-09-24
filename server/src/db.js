import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'university_erp.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 15 Realistic Faculty Members for CSE Department + 1 Admin
const defaultData = {
  university: {
    name: "C.V. Raman Global University",
    acronym: "CGU-Bhubaneswar",
    department: "Department of Computer Science & Engineering",
    academicSession: "Autumn (Odd) Semester 2026-27",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  
  // 1 Coordinator + 15 Department Faculty + 1 Sample Student
  users: [
    // 1 Dedicated Timetable Coordinator (Admin)
    {
      id: "admin-cgu",
      email: "admin@cgu-odisha.ac.in",
      password: "password123",
      name: "Er. Manoj Pattnaik",
      role: "ADMIN",
      designation: "Chief Timetable Coordinator & Academic Officer",
      department: "CSE",
      empCode: "CGU-ADM-001",
      phone: "+91 94399 77810",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },

    // 15 Department Faculty Members
    {
      id: "fac-01",
      email: "priya.sharma@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Priya Sharma",
      role: "TEACHER",
      designation: "Associate Professor",
      department: "CSE",
      specialization: "Design & Analysis of Algorithms",
      maxHoursPerWeek: 14,
      empCode: "CGU-CSE-101",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-02",
      email: "arun.verma@cgu-odisha.ac.in",
      password: "password123",
      name: "Prof. Arun Verma",
      role: "TEACHER",
      designation: "Assistant Professor (Sr. Scale)",
      department: "CSE",
      specialization: "Operating Systems & Concurrency",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-102",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-03",
      email: "suchismita.mohanty@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Suchismita Mohanty",
      role: "TEACHER",
      designation: "Professor",
      department: "CSE",
      specialization: "Machine Learning & AI",
      maxHoursPerWeek: 12,
      empCode: "CGU-CSE-103",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-04",
      email: "rajesh.tripathy@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Rajesh K. Tripathy",
      role: "TEACHER",
      designation: "Associate Professor",
      department: "CSE",
      specialization: "Database Management Systems",
      maxHoursPerWeek: 14,
      empCode: "CGU-CSE-104",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-05",
      email: "meenakshi.jena@cgu-odisha.ac.in",
      password: "password123",
      name: "Prof. Meenakshi Jena",
      role: "TEACHER",
      designation: "Assistant Professor",
      department: "CSE",
      specialization: "Software Engineering & Testing",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-105",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-06",
      email: "debashis.pradhan@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Debashis Pradhan",
      role: "TEACHER",
      designation: "Associate Professor",
      department: "CSE",
      specialization: "Computer Organization & Architecture",
      maxHoursPerWeek: 14,
      empCode: "CGU-CSE-106",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-07",
      email: "snigdha.samal@cgu-odisha.ac.in",
      password: "password123",
      name: "Prof. Snigdha Samal",
      role: "TEACHER",
      designation: "Assistant Professor",
      department: "CSE",
      specialization: "Theory of Computation & Automata",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-107",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-08",
      email: "bikash.sahu@cgu-odisha.ac.in",
      password: "password123",
      name: "Er. Bikash Ranjan Sahu",
      role: "TEACHER",
      designation: "Assistant Professor",
      department: "CSE",
      specialization: "Cloud Computing & DevOps Studio",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-108",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-09",
      email: "lipsa.dash@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Lipsa Dash",
      role: "TEACHER",
      designation: "Associate Professor",
      department: "CSE",
      specialization: "Data Structures & Advanced C++",
      maxHoursPerWeek: 14,
      empCode: "CGU-CSE-109",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-10",
      email: "subhashree.mishra@cgu-odisha.ac.in",
      password: "password123",
      name: "Prof. Subhashree Mishra",
      role: "TEACHER",
      designation: "Assistant Professor",
      department: "CSE",
      specialization: "Web Technologies & Full-Stack",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-110",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-11",
      email: "ashish.panda@cgu-odisha.ac.in",
      password: "password123",
      name: "Er. Ashish Panda",
      role: "TEACHER",
      designation: "Assistant Professor",
      department: "CSE",
      specialization: "Cyber Security & Cryptography",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-111",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-12",
      email: "soumya.nayak@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Soumya Ranjan Nayak",
      role: "TEACHER",
      designation: "Professor",
      department: "CSE",
      specialization: "Distributed Systems & Parallel Computing",
      maxHoursPerWeek: 12,
      empCode: "CGU-CSE-112",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-13",
      email: "puja.priyadarshini@cgu-odisha.ac.in",
      password: "password123",
      name: "Prof. Puja Priyadarshini",
      role: "TEACHER",
      designation: "Assistant Professor",
      department: "CSE",
      specialization: "Java & Object Oriented Programming",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-113",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-14",
      email: "rakesh.mohanty@cgu-odisha.ac.in",
      password: "password123",
      name: "Er. Rakesh Kumar Mohanty",
      role: "TEACHER",
      designation: "Senior System Analyst & Lab In-Charge",
      department: "CSE",
      specialization: "Linux Kernel & Unix Programming Lab",
      maxHoursPerWeek: 16,
      empCode: "CGU-CSE-114",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },
    {
      id: "fac-15",
      email: "monalisa.biswal@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Monalisa Biswal",
      role: "TEACHER",
      designation: "Associate Professor",
      department: "CSE",
      specialization: "Computer Vision & Deep Learning Lab",
      maxHoursPerWeek: 14,
      empCode: "CGU-CSE-115",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },

    // Sample Student
    {
      id: "stu-01",
      email: "rohit.behera@cgu.edu.in",
      password: "password123",
      name: "Rohit Behera",
      role: "STUDENT",
      designation: "Student Scholar",
      department: "CSE",
      section: "CSE-5A",
      regNo: "2301297042",
      status: "ACTIVE",
      createdAt: "2026-08-01"
    },

    // 1 Sample Pending User needing Admin Approval
    {
      id: "usr-pending-1",
      email: "alok.tripathy@cgu-odisha.ac.in",
      password: "password123",
      name: "Dr. Alok Tripathy",
      role: "TEACHER",
      designation: "Visiting Assistant Professor",
      department: "CSE",
      specialization: "Natural Language Processing",
      empCode: "CGU-NEW-2026",
      status: "PENDING_APPROVAL",
      createdAt: new Date().toISOString().split('T')[0]
    }
  ],

  // Department Batches / Sections
  sections: [
    { id: "CSE-3A", name: "B.Tech CSE - 3rd Sem (Sec A)", semester: 3, strength: 65 },
    { id: "CSE-3B", name: "B.Tech CSE - 3rd Sem (Sec B)", semester: 3, strength: 64 },
    { id: "CSE-5A", name: "B.Tech CSE - 5th Sem (Sec A)", semester: 5, strength: 68 },
    { id: "CSE-5B", name: "B.Tech CSE - 5th Sem (Sec B)", semester: 5, strength: 66 },
    { id: "CSE-7A", name: "B.Tech CSE - 7th Sem (Sec A)", semester: 7, strength: 62 }
  ],

  // Lecture Halls & Practical Labs
  rooms: [
    { id: "LH-101", name: "Smart Lecture Hall 101", capacity: 75, type: "Theory", block: "Ramanujan Block" },
    { id: "LH-102", name: "Smart Lecture Hall 102", capacity: 75, type: "Theory", block: "Ramanujan Block" },
    { id: "LH-201", name: "Lecture Hall 201", capacity: 70, type: "Theory", block: "Aryabhatta Block" },
    { id: "LH-202", name: "Lecture Hall 202", capacity: 70, type: "Theory", block: "Aryabhatta Block" },
    { id: "LAB-TURING", name: "Alan Turing Systems & OS Lab", capacity: 45, type: "Lab", block: "Ramanujan Block (CS Lab 1)" },
    { id: "LAB-LINUX", name: "Linux & Network Computing Studio", capacity: 45, type: "Lab", block: "Ramanujan Block (CS Lab 2)" },
    { id: "LAB-NVIDIA", name: "NVIDIA Deep Learning & AI Studio", capacity: 40, type: "Lab", block: "Innovation Tower" }
  ],

  // Department Subjects (Theory & Practical Lab Blocks)
  subjects: [
    // 3rd Sem
    { code: "CS301", name: "Data Structures & Algorithms", credits: 4, type: "Theory", ltp: "3-1-0", sem: 3 },
    { code: "CS302", name: "Digital Logic & Computer Org", credits: 4, type: "Theory", ltp: "3-1-0", sem: 3 },
    { code: "CS303", name: "Object Oriented Programming (Java)", credits: 3, type: "Theory", ltp: "3-0-0", sem: 3 },
    { code: "CS304P", name: "Data Structures Practical Lab", credits: 2, type: "Lab", ltp: "0-0-3", sem: 3 },

    // 5th Sem
    { code: "CS501", name: "Design & Analysis of Algorithms", credits: 4, type: "Theory", ltp: "3-1-0", sem: 5 },
    { code: "CS502", name: "Operating Systems & Concurrency", credits: 4, type: "Theory", ltp: "3-1-0", sem: 5 },
    { code: "CS503", name: "Database Management Systems", credits: 4, type: "Theory", ltp: "3-0-2", sem: 5 },
    { code: "CS504", name: "Theory of Computation & Automata", credits: 4, type: "Theory", ltp: "3-1-0", sem: 5 },
    { code: "CS505P", name: "Advanced Linux & OS Kernel Lab", credits: 2, type: "Lab", ltp: "0-0-3", sem: 5 },
    { code: "CS506P", name: "DBMS & SQL Studio Lab", credits: 2, type: "Lab", ltp: "0-0-3", sem: 5 },

    // 7th Sem
    { code: "CS701", name: "Cloud Computing & Distributed Arch", credits: 3, type: "Theory", ltp: "3-0-0", sem: 7 },
    { code: "CS702", name: "Machine Learning & Neural Nets", credits: 4, type: "Theory", ltp: "3-1-0", sem: 7 },
    { code: "CS703P", name: "AI & Machine Learning Studio Lab", credits: 2, type: "Lab", ltp: "0-0-3", sem: 7 }
  ],

  // Standard College Periods
  timeSlots: [
    { id: "P1", period: 1, startTime: "08:30", endTime: "09:25", label: "P1 (08:30 - 09:25)" },
    { id: "P2", period: 2, startTime: "09:25", endTime: "10:20", label: "P2 (09:25 - 10:20)" },
    { id: "TEA", period: 0, startTime: "10:20", endTime: "10:35", label: "Tea Break", isBreak: true },
    { id: "P3", period: 3, startTime: "10:35", endTime: "11:30", label: "P3 (10:35 - 11:30)" },
    { id: "P4", period: 4, startTime: "11:30", endTime: "12:25", label: "P4 (11:30 - 12:25)" },
    { id: "LUNCH", period: 0, startTime: "12:25", endTime: "01:15", label: "Lunch Recess", isBreak: true },
    { id: "P5", period: 5, startTime: "01:15", endTime: "02:10", label: "P5 (01:15 - 02:10)" },
    { id: "P6", period: 6, startTime: "02:10", endTime: "03:05", label: "P6 (02:10 - 03:05)" },
    { id: "P7", period: 7, startTime: "03:15", endTime: "05:00", label: "Lab Session (03:15 - 05:00)", isLabBlock: true }
  ],

  // Initial Conflict-Free Scheduled Routine
  timetable: [
    // CSE-5A Routine
    { id: "tt-1", day: "Monday", slotId: "P1", sectionId: "CSE-5A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101" },
    { id: "tt-2", day: "Monday", slotId: "P2", sectionId: "CSE-5A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101" },
    { id: "tt-3", day: "Monday", slotId: "P3", sectionId: "CSE-5A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101" },
    { id: "tt-4", day: "Monday", slotId: "P4", sectionId: "CSE-5A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101" },
    { id: "tt-5", day: "Monday", slotId: "P7", sectionId: "CSE-5A", subjectCode: "CS505P", teacherId: "fac-14", roomId: "LAB-TURING" },

    { id: "tt-6", day: "Tuesday", slotId: "P1", sectionId: "CSE-5A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101" },
    { id: "tt-7", day: "Tuesday", slotId: "P2", sectionId: "CSE-5A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101" },
    { id: "tt-8", day: "Tuesday", slotId: "P3", sectionId: "CSE-5A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101" },
    { id: "tt-9", day: "Tuesday", slotId: "P5", sectionId: "CSE-5A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101" },

    { id: "tt-10", day: "Wednesday", slotId: "P1", sectionId: "CSE-5A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101" },
    { id: "tt-11", day: "Wednesday", slotId: "P2", sectionId: "CSE-5A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101" },
    { id: "tt-12", day: "Wednesday", slotId: "P3", sectionId: "CSE-5A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101" },
    { id: "tt-13", day: "Wednesday", slotId: "P7", sectionId: "CSE-5A", subjectCode: "CS506P", teacherId: "fac-04", roomId: "LAB-LINUX" },

    { id: "tt-14", day: "Thursday", slotId: "P1", sectionId: "CSE-5A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101" },
    { id: "tt-15", day: "Thursday", slotId: "P2", sectionId: "CSE-5A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101" },
    { id: "tt-16", day: "Thursday", slotId: "P4", sectionId: "CSE-5A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101" },

    { id: "tt-17", day: "Friday", slotId: "P1", sectionId: "CSE-5A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101" },
    { id: "tt-18", day: "Friday", slotId: "P2", sectionId: "CSE-5A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101" },
    { id: "tt-19", day: "Friday", slotId: "P5", sectionId: "CSE-5A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101" },

    // CSE-3A Routine
    { id: "tt-20", day: "Monday", slotId: "P1", sectionId: "CSE-3A", subjectCode: "CS301", teacherId: "fac-09", roomId: "LH-102" },
    { id: "tt-21", day: "Monday", slotId: "P2", sectionId: "CSE-3A", subjectCode: "CS302", teacherId: "fac-06", roomId: "LH-102" },
    { id: "tt-22", day: "Monday", slotId: "P3", sectionId: "CSE-3A", subjectCode: "CS303", teacherId: "fac-13", roomId: "LH-102" },
    { id: "tt-23", day: "Monday", slotId: "P7", sectionId: "CSE-3A", subjectCode: "CS304P", teacherId: "fac-09", roomId: "LAB-LINUX" },

    // CSE-7A Routine
    { id: "tt-24", day: "Tuesday", slotId: "P1", sectionId: "CSE-7A", subjectCode: "CS701", teacherId: "fac-08", roomId: "LH-201" },
    { id: "tt-25", day: "Tuesday", slotId: "P2", sectionId: "CSE-7A", subjectCode: "CS702", teacherId: "fac-03", roomId: "LH-201" },
    { id: "tt-26", day: "Tuesday", slotId: "P7", sectionId: "CSE-7A", subjectCode: "CS703P", teacherId: "fac-15", roomId: "LAB-NVIDIA" }
  ]
};

export function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    saveDb(defaultData);
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultData;
  }
}

export function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Reset helper
export function resetDb() {
  saveDb(defaultData);
  return defaultData;
}
