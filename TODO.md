# TODO — ระบบจัดการอัพเกรดซอฟต์แวร์ตู้บุญเติม

## ภาพรวม
Web App (React + Node.js) สำหรับจัดการงานอัพเกรดซอฟต์แวร์ตู้บุญเติม 3 ประเภท (BT7, BT10, เต่าบิน)

---

## Phase 1 — Project Setup ✅ เสร็จแล้ว

- [x] สร้างโครงสร้างโปรเจกต์ `frontend/` (React 18 + Vite 5) และ `backend/` (Node.js + Express)
- [x] ตั้งค่า `package.json` ทั้ง frontend และ backend
- [x] Storage: JSON file-based (`data/tasks.json`) ผ่าน `better-sqlite3` ไม่จำเป็น
- [x] ตั้งค่า CORS (backend) และ Vite proxy `/api` → `localhost:3001` (frontend)

---

## Phase 2 — Backend (Node.js + Express) ✅ เสร็จแล้ว

### Data Model
- [x] Schema `Task` — `id`, `name`, `kioskType`, `taskType`, `status`, `scheduledDate`, `description`, `files[]`, `createdAt`, `updatedAt`
- [x] Schema `UpgradeFile` — `id`, `filename`, `fileType`, `isModified` (embedded ใน `task.files`)

### API Endpoints
- [x] `GET    /api/tasks` — ดึงรายการงานทั้งหมด
- [x] `POST   /api/tasks` — เพิ่มงานใหม่ (พร้อม validation)
- [x] `GET    /api/tasks/:id` — ดูรายละเอียดงาน
- [x] `PUT    /api/tasks/:id` — แก้ไขงาน / อัพเดตสถานะ (พร้อม validation)
- [x] `DELETE /api/tasks/:id` — ลบงาน
- [x] `GET    /api/tasks/:id/files` — ดูไฟล์ของงาน (จัดกลุ่มตามนามสกุล)
- [x] `POST   /api/tasks/:id/files` — เพิ่มไฟล์เข้างาน (พร้อม validation)

### Architecture & Quality
- [x] แยก `app.js` (export Express app) จาก `server.js` (entry point) เพื่อให้ test ได้
- [x] `validators/taskValidator.js` — validate kioskType, taskType, status, fileType
- [x] **TDD (Red → Green → Refactor)** — 23/23 tests passing (`jest` + `supertest`)

---

## Phase 3 — Frontend (React) ✅ เสร็จแล้ว

### หน้า Calendar (หน้าหลัก)
- [x] Calendar view รายเดือนแบบ custom (ไม่ใช้ library)
- [x] แสดง task บนวันที่กำหนด (scheduledDate)
- [x] คลิก task บน calendar เพื่อดูรายละเอียด
- [x] แยกสีตามประเภทตู้ (BT7/BT10/เต่าบิน) ผ่าน `KIOSK_COLORS`

### หน้าจัดการงาน (Task Management)
- [x] แสดงรายการงานทั้งหมด (Table view)
- [x] ค้นหาด้วยชื่องาน + Filter ตามประเภทตู้ / สถานะ / เรียงลำดับ
- [x] `TaskModal` — Form เพิ่ม/แก้ไขงาน

### หน้ารายละเอียดงาน
- [x] `TaskDetailPanel` — panel ด้านขวา แสดงข้อมูลงานครบ
- [x] แก้ไข / อัพเดตสถานะ / ลบงานจาก panel

### สรุปไฟล์อัพเกรด (File Summary)
- [x] `FileSummaryPage` — แสดงรายชื่อไฟล์ทั้งหมด จัดกลุ่มตามนามสกุล (.xml .bmp .pcm .mp4)

### App-level
- [x] `App.jsx` — state management + CRUD handlers (fetch, create, update, delete) ต่อกับ API

---

## Phase 4 — UI / UX 🔄 บางส่วน

- [x] Layout หลัก: Sidebar + Main content (ผ่าน `Sidebar.jsx`)
- [x] `StatusBadge` / `KioskBadge` — badge สี consistent ทั่วแอป
- [x] `constants.js` — KIOSK_COLORS, STATUS_LIST, FILE_TYPE_INFO รวมศูนย์
- [ ] **Toast notification** เมื่อบันทึก/ลบสำเร็จ (ยังไม่มี)
- [ ] **Client-side form validation** ใน `TaskModal` ก่อน submit (ยังแสดง error จาก API เท่านั้น)
- [ ] Responsive design สำหรับหน้าจอเล็ก (ยังไม่ได้ทดสอบ)

---

## Phase 5 — Testing & Polish 🔄 บางส่วน

- [x] Backend API tests 23/23 pass (`npm test` ใน `backend/`)
- [x] ทดสอบ flow หลัก (TDD): เพิ่มงาน → update สถานะ → เพิ่มไฟล์ → ดูไฟล์
- [ ] **Frontend error state** — แสดง UI เมื่อ API ล้มเหลว (network error / 4xx / 5xx)
- [ ] **Integration test** — รัน backend + frontend พร้อมกันแล้วทดสอบ end-to-end
- [ ] ตรวจสอบ edge case: ชื่องานยาวมาก, งานไม่มีไฟล์, กรองจนไม่เหลืองาน

---

## สิ่งที่เพิ่มมาจาก TDD Session

| รายการ | ไฟล์ |
|--------|------|
| แยก app.js ออกจาก server.js | `backend/app.js`, `backend/server.js` |
| Input validation ทุก endpoint | `backend/validators/taskValidator.js` |
| File endpoints (GET/POST files) | `backend/app.js` |
| Test suite 23 tests | `backend/tests/tasks.test.js` |

---

## ลำดับงานที่เหลือ

| ลำดับ | งาน | Priority |
|-------|-----|----------|
| 1 | Toast notification (frontend) | Medium |
| 2 | Client-side form validation | Medium |
| 3 | Frontend error state (API fail) | High |
| 4 | Integration / end-to-end test | Medium |
| 5 | Responsive design | Low |
