# CLAUDE.md — ระบบจัดการอัพเกรดซอฟต์แวร์ตู้บุญเติม

## 1. Project Overview

- **ชื่อโปรเจกต์:** Boon Toem Upgrade Manager
- **เป้าหมาย 1 ประโยค:** ระบบจัดการและติดตามงานอัพเกรดซอฟต์แวร์ตู้บุญเติม (BT7, BT10, เต่าบิน) พร้อม Calendar และสรุปไฟล์ที่เปลี่ยนแปลงในแต่ละรอบ
- **Out of scope:** ระบบ authentication/login, การอัพโหลดไฟล์จริงขึ้น server, การแจ้งเตือน email/SMS, รองรับ multi-tenant

---

## 2. Stack & Versions

- **Frontend:** React `^18` + Vite `^5`
- **Backend:** Node.js `^20` + Express `^4`
- **Package manager:** npm `^10`
- **Database:** SQLite (via `better-sqlite3`) — ไม่ต้องติดตั้ง DB server แยก
- **ORM/Query:** `better-sqlite3` raw queries (ไม่ใช้ ORM)
- **Styling:** Tailwind CSS `^3`
- **Calendar:** `react-big-calendar` หรือ `@fullcalendar/react`
- **HTTP Client:** `axios`
- **Other:** `cors`, `dotenv`, `nodemon` (dev)

---

## 3. Folder Structure

```
final_project/
├── CLAUDE.md
├── TODO.md
├── README.md
├── backend/
│   ├── package.json
│   ├── .env                   # PORT, DB_PATH (ไม่ commit)
│   ├── server.js              # entry point
│   ├── db/
│   │   ├── init.js            # สร้าง table ครั้งแรก
│   │   └── database.sqlite    # ไฟล์ DB (ไม่ commit)
│   ├── routes/
│   │   ├── tasks.js           # /api/tasks
│   │   └── files.js           # /api/tasks/:id/files
│   └── controllers/
│       ├── taskController.js
│       └── fileController.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── taskApi.js     # axios calls
        ├── components/
        │   ├── TaskForm.jsx
        │   ├── TaskCard.jsx
        │   └── FileSummary.jsx
        └── pages/
            ├── CalendarPage.jsx
            ├── TaskListPage.jsx
            └── TaskDetailPage.jsx
```

---

## 4. Coding Conventions

- **Style:** ESLint + Prettier, 2-space indent
- **Naming:** Component = `PascalCase`, function/variable = `camelCase`, file = match component name
- **React:** Functional components + hooks เท่านั้น ห้ามใช้ class component
- **API:** RESTful, JSON response รูปแบบ `{ data, error, message }`
- **Machine types:** ใช้ค่า enum `"BT7" | "BT10" | "TURTLE"` เสมอ (ห้าม hardcode string อื่น)
- **Task status:** ใช้ค่า enum `"pending" | "in-progress" | "done"` เสมอ
- **File types:** รองรับเฉพาะ `.xml`, `.bmp`, `.pcm`, `.mp4`

---

## 5. Do / Don't

**DO**
- แยก business logic ออกจาก route handler (ไว้ใน controller)
- ใช้ environment variable สำหรับ PORT และ DB path
- Validate input ที่ API layer ก่อนบันทึก DB ทุกครั้ง
- ใช้ `async/await` และ try/catch จัดการ error อย่างสม่ำเสมอ
- ตั้ง proxy ใน `vite.config.js` ให้ frontend ชี้ไปที่ `http://localhost:3001`

**DON'T**
- ห้าม commit `database.sqlite`, `.env`, `node_modules/`
- ห้าม hardcode port หรือ base URL ใน source code
- ห้ามเขียน SQL query ปนอยู่ใน route file โดยตรง
- ห้าม mix ภาษาไทย/อังกฤษใน variable/function name — ใช้อังกฤษเสมอ
- ห้ามใช้ `var` — ใช้ `const`/`let` เท่านั้น
