# Boonterm Upgrade Manager

ระบบจัดการการอัพเกรดซอฟต์แวร์รอบตู้บุญเติม — Web Application ที่ช่วยติดตามและบริหารจัดการงานอัพเกรด Software สำหรับตู้บุญเติม 3 ประเภท: **BT7**, **BT10**, และ **ตู้เต่าบิน**

---

## ✨ Features

| Feature | รายละเอียด |
|---------|-----------|
| 📅 Monthly Calendar | หน้าหลักแสดงงานทุกชิ้นบน Calendar รายเดือน แยกสีตามประเภทตู้ |
| 📋 Task Management | เพิ่ม / แก้ไข / ลบงาน พร้อมกรอกชื่องาน ประเภท สถานะ วันที่ |
| 🏷️ Task Types | Software / Firmware / Content / Config Update / Maintenance |
| 🔄 Status Tracking | รอดำเนินการ → กำลังดำเนินการ → เสร็จสิ้น / ยกเลิก |
| 📁 File Management | บันทึกไฟล์ .xml .bmp .pcm .mp4 พร้อมระบุว่าแก้ไขหรือไม่ |
| 📊 File Summary | สรุปรายการไฟล์ทั้งหมดจัดกลุ่มตามประเภท |
| 🔍 Filter & Search | ค้นหา กรอง และเรียงลำดับงาน |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 5
- **Backend:** Node.js + Express 4
- **Storage:** JSON File (`backend/data/tasks.json`)
- **Font:** Noto Sans Thai + Inter

---

## 📁 Project Structure

```
final_project/
├── README.md
├── requirement.md
├── backend/
│   ├── package.json
│   ├── server.js              # Express API server (port 3001)
│   └── data/
│       └── tasks.json         # JSON data storage
└── frontend/
    ├── package.json
    ├── vite.config.js         # Proxy /api → localhost:3001
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx            # Root component, state management
        ├── index.css          # CSS variables & global styles
        ├── utils/
        │   └── constants.js   # Colors, labels, enums
        ├── components/
        │   ├── Sidebar.jsx        # Navigation sidebar
        │   ├── StatusBadge.jsx    # Status & Kiosk type badges
        │   ├── TaskModal.jsx      # Add/Edit task form
        │   └── TaskDetailPanel.jsx # Task detail slide-in panel
        └── pages/
            ├── CalendarPage.jsx   # Monthly calendar view
            ├── TasksPage.jsx      # Task list with filters
            └── FileSummaryPage.jsx # File summary by type
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js v18 หรือสูงกว่า
- npm v8 หรือสูงกว่า

### Step 1 — Install Backend

```bash
cd backend
npm install
```

### Step 2 — Install Frontend

```bash
cd frontend
npm install
```

### Step 3 — Start Backend

```bash
cd backend
npm start
# หรือ
node server.js
```

Backend จะรันที่: `http://localhost:3001`

### Step 4 — Start Frontend

เปิด terminal ใหม่:

```bash
cd frontend
npm run dev
```

Frontend จะรันที่: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | ดึงงานทั้งหมด |
| `GET` | `/api/tasks/:id` | ดึงงานตาม ID |
| `POST` | `/api/tasks` | สร้างงานใหม่ |
| `PUT` | `/api/tasks/:id` | แก้ไขงาน |
| `DELETE` | `/api/tasks/:id` | ลบงาน |
| `GET` | `/api/health` | Health check |

### ตัวอย่าง Request Body (POST /api/tasks)

```json
{
  "name": "อัพเกรด Firmware BT7 v2.6.0",
  "kioskType": "BT7",
  "taskType": "firmware_update",
  "status": "pending",
  "scheduledDate": "2026-07-01",
  "description": "รายละเอียดงาน...",
  "files": [
    {
      "filename": "firmware_bt7_v260.xml",
      "fileType": "xml",
      "isModified": true,
      "version": "2.6.0",
      "note": "Main config"
    }
  ]
}
```

---

## 🎨 UI Screenshots

### หน้า Calendar (หน้าหลัก)
- แสดงงานทุกชิ้นบน Monthly Calendar
- BT7 = สีน้ำเงิน | BT10 = สีเขียว | เต่าบิน = สีม่วง
  <img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/3ac80929-2a33-4837-834b-880eb61be28e" />
- คลิกงานเพื่อเปิด Detail Panel
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/28171f93-23b4-454a-9e69-ff8525309d2e" />


### หน้า Task List
- ตารางงานทั้งหมด
- Filter ตาม: ประเภทตู้, สถานะ, ค้นหา
- เปลี่ยนสถานะได้ inline
- แก้ไข / ลบงาน
<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/dd149c5e-698b-4bfc-8032-29276c517e07" />


### หน้า File Summary
- สรุปไฟล์จัดกลุ่มตาม .xml / .bmp / .pcm / .mp4
- Filter ตามประเภทตู้และสถานะการแก้ไข
- ตารางไฟล์ที่มีการแก้ไขทั้งหมด
<img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/439584c5-f9fb-4783-82f7-8a8dfeaacc18" />


---
