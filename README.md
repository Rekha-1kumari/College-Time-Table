# 🎓 C.V. Raman Global University — Academic Timetable, Faculty Scheduling & Digital Logbook ERP

[![Institutional Accreditation](https://img.shields.io/badge/NAAC-A%2B%2B%20Accredited-0284c7.svg)](#)
[![Cycle](https://img.shields.io/badge/Academic%20Cycle-Autumn%202026--27-0ea5e9.svg)](#)
[![Theme](https://img.shields.io/badge/UI%20Theme-White%20%26%20Light%20Sky%20Blue-38bdf8.svg)](#)
[![Role Redirection](https://img.shields.io/badge/Role%20Hierarchy-VC%20%7C%20Dean%20%7C%20HOD%20%7C%20Admin%20%7C%20Faculty%20%7C%20Student-0369a1.svg)](#)

An enterprise-grade, full-stack Academic Timetable, Resource Scheduling, Faculty Attendance, and Digital Logbook ERP designed specifically for multi-school institutions such as **C.V. Raman Global University (CGU)**.

Built with a **crisp white and light sky blue** visual aesthetic, strict university organizational hierarchy, role-based automatic login redirection, real-time collision prevention, continuous NAAC/NBA lecture key notes, and proxy teaching workflows.

---

## 🏛️ University Organizational Hierarchy & Role Flow

The system mirrors the administrative and academic operations of a university:

```
                          ┌────────────────────────┐
                          │   👑 Vice Chancellor   │ (University-Wide Overview, School Metrics,
                          │   (Executive Cockpit)  │  Workload Audit & Executive Orders)
                          └───────────┬────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
      ┌─────────────────────┐                   ┌─────────────────────┐
      │  🏛️ Dean of School  │                   │ ⚙️ Timetable Officer │ (Conflict-Free Slot Matrix,
      │ (Engineering/Mgmt)  │                   │  (Scheduler Engine) │  Room Allocations, PDF Print)
      └──────────┬──────────┘                   └─────────────────────┘
                 │
                 ▼
      ┌─────────────────────┐
      │  📋 HOD (e.g. CSE)  │ (Curriculum Mapping, L-T-P Credits,
      │ (Department Center) │  Proxy/Substitution Approvals)
      └──────────┬──────────┘
                 │
        ┌────────┴────────────────────┐
        ▼                             ▼
┌───────────────────────┐   ┌───────────────────────┐
│  👩‍🏫 Faculty Member    │   │   🎒 Student Scholar  │
│ (Attendance Punch-in, │   │ (Section 5A Schedule, │
│  Lecture Key Notes)   │   │  Teacher Keynotes Feed)│
└───────────────────────┘   └───────────────────────┘
```

---

## ✨ In-Depth Value-Add Features

### 1. 🛡️ Real-Time Scheduling Conflict Detector
- **Room Collision Prevention**: Ensures no two lectures or laboratory batches are scheduled in the same Smart Lecture Hall or Lab simultaneously.
- **Faculty Double-Booking Guard**: Prevents professors from being assigned to multiple classes in the same period slot.
- **Section Clash Check**: Protects student batches from overlapping courses.

### 2. 📝 NAAC & NBA Digital Academic Logbook (Lecture Key Notes)
- Enables faculty to log daily classroom teaching records required for accreditation audits:
  - **Syllabus Unit Number** and **Topic Delivered**
  - **Student Headcount Attendance** recorded during the period
  - **Core Derivations, Theorems & Whiteboard Notes**
  - **Learning Outcomes Achieved** (Course Outcome / CO compliance)
  - **Homework / Laboratory Task Assigned**
  - **Reference Material / LMS links**

### 3. ⏱️ Faculty Smart Attendance Punch-in
- 1-click status update (`Present`, `In-Lecture`, `On-Duty / Lab`, `Leave`) with automated timestamping, RFID/portal tracking, and campus block location.

### 4. 🔄 Faculty Leave & Proxy Substitution Workflow
- When a faculty member attends a national conference or takes medical leave, they can dispatch a proxy request to a departmental colleague.
- Head of Department (HOD) or Dean receives the request in their approval queue and authorizes it with 1 click, instantly syncing the live master timetable.

### 5. 📊 Executive VC Cockpit & Asset Optimization
- University-wide Timetable Slot Adherence rate (`99.2%`).
- Smart Classroom & High-Performance Lab utilization percentages.
- Faculty workload audit (identifying optimal vs under-allocated credits).
- Instant broadcast memo dispatcher for examination freezes and institutional directives.

### 6. 🖨️ Master Grid Print & PDF Export
- High-resolution, clean print layout formatted for department notice boards and official archiving.

---

## 🎨 Design System: White & Light Sky Blue Theme

Built without dark blue backgrounds, adhering strictly to a modern academic enterprise palette:
- **Base Canvas**: Crisp White (`#ffffff`) and Soft Ice Tint (`#f0f7ff`, `#f8fafc`).
- **Institutional Sky Accent**: Sky-600 (`#0284c7`) and Sky-500 (`#0ea5e9`).
- **Subtle Sky Borders**: Light Sky (`#e0f2fe`) and Sky-200 (`#bae6fd`).
- **Typography**: `Plus Jakarta Sans` with clean tabular numbers and `JetBrains Mono` for course codes.
- **Glassmorphic Cards**: Subtle shadows (`0 4px 6px -1px rgba(14, 165, 233, 0.05)`).

---

## 🔑 Demo Instant-Login Credentials

All accounts use the demo password: `password123`

| Role | Name | Institutional Email | Key Responsibilities |
|---|---|---|---|
| **👑 Vice Chancellor** | Prof. (Dr.) B. K. Sahoo | `vc@cgu-odisha.ac.in` | Global Adherence, Executive Directives |
| **🏛️ Dean (FET)** | Prof. (Dr.) R. K. Mohapatra | `dean.engineering@cgu-odisha.ac.in` | School Resource Allocation & Policy |
| **📋 HOD (CSE)** | Dr. Suchismita Rautray | `hod.cse@cgu-odisha.ac.in` | Course Credit Mapping, Proxy Approvals |
| **⚙️ Timetable Officer** | Er. Manoj Pattnaik | `timetable.officer@cgu-odisha.ac.in` | Master Timetable Matrix, Conflict Engine |
| **👩‍🏫 Faculty Member** | Dr. Priya Sharma | `priya.sharma@cgu-odisha.ac.in` | Daily Punch-in, NAAC Key Notes Diary |
| **🎒 Student Scholar** | Rohit Behera | `rohit.behera@cgu.edu.in` | Section 5A Timetable, Keynotes Feed |

*(A sticky preview bar at the top allows 1-click live simulation between all roles without re-typing credentials)*.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Quick Run (Development Mode)
```bash
# 1. Install all dependencies across root, server, and client
npm run install:all

# 2. Run both Backend API and React Frontend concurrently
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001/api`

### Production Run (Single Unified Server)
```bash
# 1. Build the React client bundle
npm run build

# 2. Launch production server serving both static UI and REST API
npm start
```
Open `http://localhost:5001` in your browser.

---

## 📡 Key REST API Endpoints

- `POST /api/auth/login` — Authentication & JWT issue
- `POST /api/auth/register` — Role-based institutional onboarding
- `GET  /api/meta` — University departments, rooms, slots, subjects
- `GET  /api/timetable` — Query slots by section, teacher, room, or day
- `POST /api/timetable` — Add slot with automated collision checking
- `POST /api/timetable/conflict-check` — Pre-validate room and teacher conflicts
- `POST /api/attendance/teachers/punch` — Faculty punch-in with timestamp
- `GET  /api/notes` — Continuous lecture key notes logbook
- `POST /api/notes` — Log new lecture key notes for NAAC/NBA audit
- `GET  /api/substitutions` — Proxy teaching requests
- `PUT  /api/substitutions/:id/status` — Approve or decline proxy
- `GET  /api/analytics/vc-overview` — Vice Chancellor global KPIs

---

## 👥 Collaboration & Main Branch

This repository is maintained and structured for pushing directly into the `main` branch:
- Remote: `https://github.com/Rekha-1kumari/College-Time-Table.git`
- Branch: `main`
