# Architecture — Boon Toem Upgrade Manager

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│   React SPA (Vite, port 5173)                          │
│   ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│   │ CalendarPage │  │ TaskListPage │  │TaskDetailPage│ │
│   └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│          └─────────────────┼─────────────────┘        │
│                    ┌───────▼──────┐                    │
│                    │  taskApi.js  │  (axios)           │
│                    └───────┬──────┘                    │
└────────────────────────────┼────────────────────────────┘
                    HTTP/REST │ (proxy via vite → :3001)
┌────────────────────────────▼────────────────────────────┐
│              Node.js + Express (port 3001)              │
│                                                         │
│   server.js                                            │
│   ┌──────────────────────┐  ┌──────────────────────┐  │
│   │   routes/tasks.js    │  │   routes/files.js    │  │
│   └──────────┬───────────┘  └──────────┬───────────┘  │
│   ┌──────────▼───────────┐  ┌──────────▼───────────┐  │
│   │ taskController.js    │  │ fileController.js    │  │
│   └──────────┬───────────┘  └──────────┬───────────┘  │
│              └─────────────┬────────────┘              │
│                    ┌───────▼──────┐                    │
│                    │   db/init.js │  (better-sqlite3)  │
│                    └───────┬──────┘                    │
└────────────────────────────┼────────────────────────────┘
                    ┌────────▼──────┐
                    │ database.sqlite│
                    └───────────────┘
```

---

## Frontend Architecture

### Pages & Routing

| Path | Page | หน้าที่ |
|------|------|---------|
| `/` | `CalendarPage` | หน้าหลัก แสดง calendar พร้อม task แต่ละวัน |
| `/tasks` | `TaskListPage` | รายการงานทั้งหมด + filter |
| `/tasks/new` | `TaskListPage` (modal) | Form เพิ่มงานใหม่ |
| `/tasks/:id` | `TaskDetailPage` | รายละเอียด + สรุปไฟล์ของงาน |

### Component Tree

```
App
├── Layout (Sidebar + TopBar)
│   ├── CalendarPage
│   │   └── TaskCard (event บน calendar)
│   ├── TaskListPage
│   │   ├── TaskCard (แถวในตาราง)
│   │   └── TaskForm (modal สำหรับเพิ่ม/แก้ไข)
│   └── TaskDetailPage
│       ├── TaskForm (แก้ไขงาน)
│       └── FileSummary (รายชื่อไฟล์แยกตามนามสกุล)
```

### Data Flow

```
User Action
    │
    ▼
Page Component  ──useEffect/handler──▶  taskApi.js (axios)
    │                                        │
    │◀──── setState (re-render) ─────────────┘
```

ไม่ใช้ global state manager (Redux/Zustand) — ใช้ `useState` + `useEffect` เพียงพอสำหรับโปรเจกต์ขนาดนี้

---

## Backend Architecture

### Request Lifecycle

```
HTTP Request
    │
    ▼
server.js (cors, json middleware)
    │
    ▼
routes/tasks.js  หรือ  routes/files.js
    │
    ▼
controllers/taskController.js  หรือ  fileController.js
    │   (validate input, business logic)
    │
    ▼
db/init.js  (better-sqlite3 query)
    │
    ▼
database.sqlite
    │
    ▼
JSON Response  { data, error, message }
```

### API Endpoints

| Method | Path | Controller | หน้าที่ |
|--------|------|------------|---------|
| GET | `/api/tasks` | `getAllTasks` | ดึงงานทั้งหมด (รองรับ query filter) |
| POST | `/api/tasks` | `createTask` | เพิ่มงานใหม่ |
| GET | `/api/tasks/:id` | `getTaskById` | ดูรายละเอียดงาน |
| PUT | `/api/tasks/:id` | `updateTask` | แก้ไขงาน / เปลี่ยนสถานะ |
| DELETE | `/api/tasks/:id` | `deleteTask` | ลบงาน |
| GET | `/api/tasks/:id/files` | `getFilesByTask` | ดูไฟล์ของงาน |
| POST | `/api/tasks/:id/files` | `addFile` | เพิ่มไฟล์ในงาน |
| DELETE | `/api/tasks/:id/files/:fileId` | `deleteFile` | ลบไฟล์ออกจากงาน |

---

## Database Schema

### Table: `tasks`

| Column | Type | ข้อกำหนด |
|--------|------|----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `title` | TEXT | NOT NULL |
| `machine_type` | TEXT | NOT NULL — `'BT7'` / `'BT10'` / `'TURTLE'` |
| `status` | TEXT | NOT NULL DEFAULT `'pending'` — `'pending'` / `'in-progress'` / `'done'` |
| `description` | TEXT | nullable |
| `scheduled_date` | TEXT | NOT NULL — ISO 8601 `YYYY-MM-DD` |
| `created_at` | TEXT | DEFAULT CURRENT_TIMESTAMP |

### Table: `upgrade_files`

| Column | Type | ข้อกำหนด |
|--------|------|----------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `task_id` | INTEGER | FOREIGN KEY → `tasks.id` ON DELETE CASCADE |
| `filename` | TEXT | NOT NULL |
| `file_type` | TEXT | NOT NULL — `'.xml'` / `'.bmp'` / `'.pcm'` / `'.mp4'` |
| `is_modified` | INTEGER | DEFAULT `0` (0 = false, 1 = true) |

### ER Diagram

```
tasks                    upgrade_files
┌──────────────┐         ┌──────────────────┐
│ id (PK)      │────1──┐ │ id (PK)          │
│ title        │      └─▶│ task_id (FK)     │
│ machine_type │    N    │ filename         │
│ status       │         │ file_type        │
│ description  │         │ is_modified      │
│ scheduled_date│        └──────────────────┘
│ created_at   │
└──────────────┘
```

---

## Key Design Decisions

| การตัดสินใจ | เหตุผล |
|------------|--------|
| SQLite แทน PostgreSQL | ไม่ต้องติดตั้ง DB server แยก เหมาะกับโปรเจกต์ขนาดเล็ก |
| Vite proxy แทน CORS config ซับซ้อน | ง่ายกว่าในช่วง development, production ใช้ reverse proxy |
| ไม่ใช้ ORM (Prisma/Sequelize) | ลด dependency, query ง่ายตรงไปตรงมา |
| ไม่ใช้ global state (Redux) | scope ข้อมูลอยู่ใน page เดียว ไม่มี shared state ซับซ้อน |
| React Router v6 | standard routing สำหรับ SPA |
