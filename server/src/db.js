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

const defaultData = {
  university: {
    name: "C.V. Raman Global University",
    acronym: "CGU-Bhubaneswar",
    academicSession: "Academic Year 2026-27 (Autumn Semester)",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },

  // University Academic Hierarchy
  courses: [
    {
      id: "BTECH",
      name: "B.Tech (Bachelor of Technology)",
      years: [1, 2, 3, 4],
      branches: [
        { id: "CSE", name: "Computer Science & Engineering", code: "CSE" },
        { id: "CIVIL", name: "Civil Engineering", code: "CE" },
        { id: "MECH", name: "Mechanical Engineering", code: "ME" },
        { id: "AIML", name: "Artificial Intelligence & Machine Learning", code: "AIML" },
        { id: "EEE", name: "Electrical & Electronics Engineering", code: "EEE" }
      ]
    },
    {
      id: "BCA",
      name: "BCA (Bachelor of Computer Applications)",
      years: [1, 2, 3],
      branches: [
        { id: "BCA-GEN", name: "Software Development & Applications", code: "BCA" }
      ]
    },
    {
      id: "MCA",
      name: "MCA (Master of Computer Applications)",
      years: [1, 2],
      branches: [
        { id: "MCA-GEN", name: "Advanced Computing & Cloud", code: "MCA" }
      ]
    },
    {
      id: "MBA",
      name: "MBA (Master of Business Administration)",
      years: [1, 2],
      branches: [
        { id: "MBA-BA", name: "Business Analytics & Finance", code: "MBA" }
      ]
    },
    {
      id: "BSC",
      name: "B.Sc (Applied Sciences)",
      years: [1, 2, 3],
      branches: [
        { id: "BSC-DS", name: "Data Science & Mathematics", code: "BSC" }
      ]
    }
  ],

  // Sections / Groups across Courses & Branches
  sections: [
    // B.Tech CSE
    { id: "BTECH-CSE-1A", courseId: "BTECH", branchId: "CSE", year: 1, group: "Group A", name: "B.Tech CSE - 1st Year (Group A)", strength: 65 },
    { id: "BTECH-CSE-1B", courseId: "BTECH", branchId: "CSE", year: 1, group: "Group B", name: "B.Tech CSE - 1st Year (Group B)", strength: 64 },
    { id: "BTECH-CSE-2A", courseId: "BTECH", branchId: "CSE", year: 2, group: "Group A", name: "B.Tech CSE - 2nd Year (Group A)", strength: 68 },
    { id: "BTECH-CSE-2B", courseId: "BTECH", branchId: "CSE", year: 2, group: "Group B", name: "B.Tech CSE - 2nd Year (Group B)", strength: 66 },
    { id: "BTECH-CSE-3A", courseId: "BTECH", branchId: "CSE", year: 3, group: "Group A", name: "B.Tech CSE - 3rd Year (Group A)", strength: 68 },
    { id: "BTECH-CSE-3B", courseId: "BTECH", branchId: "CSE", year: 3, group: "Group B", name: "B.Tech CSE - 3rd Year (Group B)", strength: 65 },
    { id: "BTECH-CSE-4A", courseId: "BTECH", branchId: "CSE", year: 4, group: "Group A", name: "B.Tech CSE - 4th Year (Group A)", strength: 62 },

    // B.Tech Civil Engineering
    { id: "BTECH-CIVIL-1A", courseId: "BTECH", branchId: "CIVIL", year: 1, group: "Group A", name: "B.Tech Civil - 1st Year (Group A)", strength: 60 },
    { id: "BTECH-CIVIL-2A", courseId: "BTECH", branchId: "CIVIL", year: 2, group: "Group A", name: "B.Tech Civil - 2nd Year (Group A)", strength: 58 },
    { id: "BTECH-CIVIL-2B", courseId: "BTECH", branchId: "CIVIL", year: 2, group: "Group B", name: "B.Tech Civil - 2nd Year (Group B)", strength: 55 },
    { id: "BTECH-CIVIL-3A", courseId: "BTECH", branchId: "CIVIL", year: 3, group: "Group A", name: "B.Tech Civil - 3rd Year (Group A)", strength: 56 },

    // B.Tech Mechanical Engineering
    { id: "BTECH-MECH-2A", courseId: "BTECH", branchId: "MECH", year: 2, group: "Group A", name: "B.Tech Mech - 2nd Year (Group A)", strength: 60 },

    // BCA
    { id: "BCA-1A", courseId: "BCA", branchId: "BCA-GEN", year: 1, group: "Group A", name: "BCA - 1st Year (Group A)", strength: 55 },

    // MBA
    { id: "MBA-1A", courseId: "MBA", branchId: "MBA-BA", year: 1, group: "Group A", name: "MBA - 1st Year (Group A)", strength: 50 }
  ],

  // Classrooms, Specialized Labs & Virtual Smart Studios
  rooms: [
    { id: "LH-101", name: "Smart Lecture Hall 101", capacity: 75, type: "Theory", block: "Ramanujan Block" },
    { id: "LH-102", name: "Smart Lecture Hall 102", capacity: 75, type: "Theory", block: "Ramanujan Block" },
    { id: "LH-201", name: "Smart Lecture Hall 201", capacity: 70, type: "Theory", block: "Aryabhatta Block" },
    { id: "LH-202", name: "Smart Lecture Hall 202", capacity: 70, type: "Theory", block: "Aryabhatta Block" },
    { id: "LH-301", name: "Lecture Hall 301", capacity: 65, type: "Theory", block: "Visvesvaraya Engineering Block" },
    
    // Labs
    { id: "LAB-TURING", name: "Alan Turing High-Perf Systems Lab", capacity: 45, type: "Lab", block: "CS Block Lab 1" },
    { id: "LAB-LINUX", name: "Linux Kernel & Network Studio", capacity: 45, type: "Lab", block: "CS Block Lab 2" },
    { id: "LAB-NVIDIA", name: "NVIDIA AI & Deep Learning Studio", capacity: 40, type: "Lab", block: "Innovation Tower" },
    { id: "LAB-CIVIL-SURVEY", name: "Geotech & Surveying Lab", capacity: 40, type: "Lab", block: "Civil Tech Center" },
    { id: "LAB-CIVIL-CAD", name: "Structural AutoCAD & STAAD Studio", capacity: 45, type: "Lab", block: "Civil Design Hall" },
    { id: "LAB-MECH-FLUID", name: "Fluid Mechanics & Thermodynamics Lab", capacity: 40, type: "Lab", block: "Mechanical Complex" },
    
    // Virtual / Hybrid Operational Room
    { id: "STUDIO-ONLINE", name: "University Hybrid Digital Studio (Online Mode)", capacity: 200, type: "Online", block: "Central E-Learning Cloud" }
  ],

  // 1 Admin + 15 Department Faculty + Civil & Mech Faculty
  users: [
    // 1 University Chief Timetable Coordinator
    {
      id: "admin-cgu",
      email: "admin@cgu-odisha.ac.in",
      password: "password123",
      name: "Er. Manoj Pattnaik",
      role: "ADMIN",
      designation: "Chief University Timetable Coordinator",
      department: "Central Academic Scheduling Council",
      empCode: "CGU-COORD-001",
      phone: "+91 94399 77810",
      status: "ACTIVE"
    },

    // 15 CSE / IT Faculty Members
    { id: "fac-01", email: "priya.sharma@cgu-odisha.ac.in", password: "password123", name: "Dr. Priya Sharma", role: "TEACHER", designation: "Associate Professor", department: "CSE", specialization: "Design & Analysis of Algorithms", maxHoursPerWeek: 14, empCode: "CGU-CSE-101", status: "ACTIVE" },
    { id: "fac-02", email: "arun.verma@cgu-odisha.ac.in", password: "password123", name: "Prof. Arun Verma", role: "TEACHER", designation: "Assistant Professor (Sr.)", department: "CSE", specialization: "Operating Systems & Concurrency", maxHoursPerWeek: 16, empCode: "CGU-CSE-102", status: "ACTIVE" },
    { id: "fac-03", email: "suchismita.mohanty@cgu-odisha.ac.in", password: "password123", name: "Dr. Suchismita Mohanty", role: "TEACHER", designation: "Professor", department: "CSE", specialization: "Machine Learning & AI", maxHoursPerWeek: 12, empCode: "CGU-CSE-103", status: "ACTIVE" },
    { id: "fac-04", email: "rajesh.tripathy@cgu-odisha.ac.in", password: "password123", name: "Dr. Rajesh K. Tripathy", role: "TEACHER", designation: "Associate Professor", department: "CSE", specialization: "Database Management Systems", maxHoursPerWeek: 14, empCode: "CGU-CSE-104", status: "ACTIVE" },
    { id: "fac-05", email: "meenakshi.jena@cgu-odisha.ac.in", password: "password123", name: "Prof. Meenakshi Jena", role: "TEACHER", designation: "Assistant Professor", department: "CSE", specialization: "Software Engineering & Testing", maxHoursPerWeek: 16, empCode: "CGU-CSE-105", status: "ACTIVE" },
    { id: "fac-06", email: "debashis.pradhan@cgu-odisha.ac.in", password: "password123", name: "Dr. Debashis Pradhan", role: "TEACHER", designation: "Associate Professor", department: "CSE", specialization: "Computer Architecture", maxHoursPerWeek: 14, empCode: "CGU-CSE-106", status: "ACTIVE" },
    { id: "fac-07", email: "snigdha.samal@cgu-odisha.ac.in", password: "password123", name: "Prof. Snigdha Samal", role: "TEACHER", designation: "Assistant Professor", department: "CSE", specialization: "Theory of Computation & Automata", maxHoursPerWeek: 16, empCode: "CGU-CSE-107", status: "ACTIVE" },
    { id: "fac-08", email: "bikash.sahu@cgu-odisha.ac.in", password: "password123", name: "Er. Bikash Ranjan Sahu", role: "TEACHER", designation: "Assistant Professor", department: "CSE", specialization: "Cloud Computing & DevOps", maxHoursPerWeek: 16, empCode: "CGU-CSE-108", status: "ACTIVE" },
    { id: "fac-09", email: "lipsa.dash@cgu-odisha.ac.in", password: "password123", name: "Dr. Lipsa Dash", role: "TEACHER", designation: "Associate Professor", department: "CSE", specialization: "Data Structures & C++", maxHoursPerWeek: 14, empCode: "CGU-CSE-109", status: "ACTIVE" },
    { id: "fac-10", email: "subhashree.mishra@cgu-odisha.ac.in", password: "password123", name: "Prof. Subhashree Mishra", role: "TEACHER", designation: "Assistant Professor", department: "CSE", specialization: "Web Technologies", maxHoursPerWeek: 16, empCode: "CGU-CSE-110", status: "ACTIVE" },
    { id: "fac-11", email: "ashish.panda@cgu-odisha.ac.in", password: "password123", name: "Er. Ashish Panda", role: "TEACHER", designation: "Assistant Professor", department: "CSE", specialization: "Cyber Security & Cryptography", maxHoursPerWeek: 16, empCode: "CGU-CSE-111", status: "ACTIVE" },
    { id: "fac-12", email: "soumya.nayak@cgu-odisha.ac.in", password: "password123", name: "Dr. Soumya Ranjan Nayak", role: "TEACHER", designation: "Professor", department: "CSE", specialization: "Distributed Systems", maxHoursPerWeek: 12, empCode: "CGU-CSE-112", status: "ACTIVE" },
    { id: "fac-13", email: "puja.priyadarshini@cgu-odisha.ac.in", password: "password123", name: "Prof. Puja Priyadarshini", role: "TEACHER", designation: "Assistant Professor", department: "CSE", specialization: "Java & Object Oriented Prog", maxHoursPerWeek: 16, empCode: "CGU-CSE-113", status: "ACTIVE" },
    { id: "fac-14", email: "rakesh.mohanty@cgu-odisha.ac.in", password: "password123", name: "Er. Rakesh Kumar Mohanty", role: "TEACHER", designation: "Senior System Analyst", department: "CSE", specialization: "Linux Kernel Programming Lab", maxHoursPerWeek: 16, empCode: "CGU-CSE-114", status: "ACTIVE" },
    { id: "fac-15", email: "monalisa.biswal@cgu-odisha.ac.in", password: "password123", name: "Dr. Monalisa Biswal", role: "TEACHER", designation: "Associate Professor", department: "CSE", specialization: "Computer Vision & AI Lab", maxHoursPerWeek: 14, empCode: "CGU-CSE-115", status: "ACTIVE" },

    // Civil Engineering Faculty
    { id: "fac-cv-01", email: "kailash.rout@cgu-odisha.ac.in", password: "password123", name: "Dr. Kailash C. Rout", role: "TEACHER", designation: "Professor & HOD", department: "CIVIL", specialization: "Structural Engineering & Concrete Tech", maxHoursPerWeek: 12, empCode: "CGU-CIVIL-201", status: "ACTIVE" },
    { id: "fac-cv-02", email: "sarita.satpathy@cgu-odisha.ac.in", password: "password123", name: "Prof. Sarita Satpathy", role: "TEACHER", designation: "Associate Professor", department: "CIVIL", specialization: "Geotechnical & Surveying Engineering", maxHoursPerWeek: 14, empCode: "CGU-CIVIL-202", status: "ACTIVE" },
    { id: "fac-cv-03", email: "debi.prasad@cgu-odisha.ac.in", password: "password123", name: "Er. Debi Prasad Barik", role: "TEACHER", designation: "Assistant Professor", department: "CIVIL", specialization: "Hydraulics & Water Resources", maxHoursPerWeek: 16, empCode: "CGU-CIVIL-203", status: "ACTIVE" },

    // Sample Pending Registration awaiting Approval
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

  // Subjects by Department & Year
  subjects: [
    // B.Tech CSE (3rd Year - 5th Sem)
    { code: "CS501", name: "Design & Analysis of Algorithms", credits: 4, type: "Theory", dept: "CSE", sem: 5, course: "BTECH" },
    { code: "CS502", name: "Operating Systems & Concurrency", credits: 4, type: "Theory", dept: "CSE", sem: 5, course: "BTECH" },
    { code: "CS503", name: "Database Management Systems", credits: 4, type: "Theory", dept: "CSE", sem: 5, course: "BTECH" },
    { code: "CS504", name: "Theory of Computation & Automata", credits: 4, type: "Theory", dept: "CSE", sem: 5, course: "BTECH" },
    { code: "CS505P", name: "Advanced Linux & OS Kernel Lab", credits: 2, type: "Lab", dept: "CSE", sem: 5, course: "BTECH" },
    { code: "CS506P", name: "DBMS & SQL Studio Lab", credits: 2, type: "Lab", dept: "CSE", sem: 5, course: "BTECH" },

    // B.Tech Civil (2nd Year - 3rd Sem)
    { code: "CE301", name: "Surveying & Geomatics", credits: 4, type: "Theory", dept: "CIVIL", sem: 3, course: "BTECH" },
    { code: "CE302", name: "Mechanics of Solids", credits: 4, type: "Theory", dept: "CIVIL", sem: 3, course: "BTECH" },
    { code: "CE303", name: "Building Materials & Construction", credits: 3, type: "Theory", dept: "CIVIL", sem: 3, course: "BTECH" },
    { code: "CE304", name: "Fluid Mechanics & Open Channel Flow", credits: 4, type: "Theory", dept: "CIVIL", sem: 3, course: "BTECH" },
    { code: "CE305P", name: "Advanced Surveying Practical Lab", credits: 2, type: "Lab", dept: "CIVIL", sem: 3, course: "BTECH" },
    { code: "CE306P", name: "Material Testing & Concrete Lab", credits: 2, type: "Lab", dept: "CIVIL", sem: 3, course: "BTECH" }
  ],

  // Standard College Time Slots
  timeSlots: [
    { id: "P1", period: 1, startTime: "08:30", endTime: "09:25", label: "P1 (08:30 - 09:25)" },
    { id: "P2", period: 2, startTime: "09:25", endTime: "10:20", label: "P2 (09:25 - 10:20)" },
    { id: "TEA", period: 0, startTime: "10:20", endTime: "10:35", label: "Tea Recess", isBreak: true },
    { id: "P3", period: 3, startTime: "10:35", endTime: "11:30", label: "P3 (10:35 - 11:30)" },
    { id: "P4", period: 4, startTime: "11:30", endTime: "12:25", label: "P4 (11:30 - 12:25)" },
    { id: "LUNCH", period: 0, startTime: "12:25", endTime: "01:15", label: "Central Lunch Break", isBreak: true },
    { id: "P5", period: 5, startTime: "01:15", endTime: "02:10", label: "P5 (01:15 - 02:10)" },
    { id: "P6", period: 6, startTime: "02:10", endTime: "03:05", label: "P6 (02:10 - 03:05)" },
    { id: "P7", period: 7, startTime: "03:15", endTime: "05:00", label: "Lab Session Block (03:15 - 05:00)", isLab: true }
  ],

  // Routine Entries with status: 'ACTIVE', 'SUSPENDED', or 'ONLINE'
  timetable: [
    // B.Tech CSE 3rd Year (Group A)
    { id: "tt-1", day: "Monday", slotId: "P1", sectionId: "BTECH-CSE-3A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-2", day: "Monday", slotId: "P2", sectionId: "BTECH-CSE-3A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-3", day: "Monday", slotId: "P3", sectionId: "BTECH-CSE-3A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-4", day: "Monday", slotId: "P4", sectionId: "BTECH-CSE-3A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-5", day: "Monday", slotId: "P7", sectionId: "BTECH-CSE-3A", subjectCode: "CS505P", teacherId: "fac-14", roomId: "LAB-TURING", mode: "PHYSICAL" },

    { id: "tt-6", day: "Tuesday", slotId: "P1", sectionId: "BTECH-CSE-3A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-7", day: "Tuesday", slotId: "P2", sectionId: "BTECH-CSE-3A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-8", day: "Tuesday", slotId: "P3", sectionId: "BTECH-CSE-3A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-9", day: "Tuesday", slotId: "P5", sectionId: "BTECH-CSE-3A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101", mode: "PHYSICAL" },

    { id: "tt-10", day: "Wednesday", slotId: "P1", sectionId: "BTECH-CSE-3A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-11", day: "Wednesday", slotId: "P2", sectionId: "BTECH-CSE-3A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-12", day: "Wednesday", slotId: "P3", sectionId: "BTECH-CSE-3A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-13", day: "Wednesday", slotId: "P7", sectionId: "BTECH-CSE-3A", subjectCode: "CS506P", teacherId: "fac-04", roomId: "LAB-LINUX", mode: "PHYSICAL" },

    { id: "tt-14", day: "Thursday", slotId: "P1", sectionId: "BTECH-CSE-3A", subjectCode: "CS504", teacherId: "fac-07", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-15", day: "Thursday", slotId: "P2", sectionId: "BTECH-CSE-3A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-16", day: "Thursday", slotId: "P4", sectionId: "BTECH-CSE-3A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101", mode: "PHYSICAL" },

    { id: "tt-17", day: "Friday", slotId: "P1", sectionId: "BTECH-CSE-3A", subjectCode: "CS501", teacherId: "fac-01", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-18", day: "Friday", slotId: "P2", sectionId: "BTECH-CSE-3A", subjectCode: "CS502", teacherId: "fac-02", roomId: "LH-101", mode: "PHYSICAL" },
    { id: "tt-19", day: "Friday", slotId: "P5", sectionId: "BTECH-CSE-3A", subjectCode: "CS503", teacherId: "fac-04", roomId: "LH-101", mode: "PHYSICAL" },

    // B.Tech Civil Engineering 2nd Year (Group A)
    { id: "tt-cv-1", day: "Monday", slotId: "P1", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE301", teacherId: "fac-cv-01", roomId: "LH-301", mode: "PHYSICAL" },
    { id: "tt-cv-2", day: "Monday", slotId: "P2", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE302", teacherId: "fac-cv-02", roomId: "LH-301", mode: "PHYSICAL" },
    { id: "tt-cv-3", day: "Monday", slotId: "P3", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE303", teacherId: "fac-cv-03", roomId: "LH-301", mode: "PHYSICAL" },
    { id: "tt-cv-4", day: "Monday", slotId: "P7", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE305P", teacherId: "fac-cv-02", roomId: "LAB-CIVIL-SURVEY", mode: "PHYSICAL" },

    { id: "tt-cv-5", day: "Tuesday", slotId: "P1", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE304", teacherId: "fac-cv-03", roomId: "LH-301", mode: "PHYSICAL" },
    { id: "tt-cv-6", day: "Tuesday", slotId: "P2", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE301", teacherId: "fac-cv-01", roomId: "LH-301", mode: "PHYSICAL" },
    { id: "tt-cv-7", day: "Tuesday", slotId: "P3", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE302", teacherId: "fac-cv-02", roomId: "LH-301", mode: "PHYSICAL" },
    { id: "tt-cv-8", day: "Wednesday", slotId: "P7", sectionId: "BTECH-CIVIL-2A", subjectCode: "CE306P", teacherId: "fac-cv-01", roomId: "LAB-CIVIL-CAD", mode: "PHYSICAL" }
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

export function resetDb() {
  saveDb(defaultData);
  return defaultData;
}
