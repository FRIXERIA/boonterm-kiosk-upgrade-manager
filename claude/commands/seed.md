Seed the Boon Toem Upgrade Manager database with realistic sample tasks for development and testing.

## Seed Data

Create the following 6 sample tasks by calling POST /api/tasks for each. The backend must be running on port 3001. If it is not running, say so and stop.

### Tasks to create

1. Upgrade firmware BT7 สาขา Central World
   - kioskType: BT7
   - taskType: firmware_update
   - status: completed
   - scheduledDate: (today minus 7 days, format YYYY-MM-DD)
   - description: อัพเกรด firmware v2.4.1 → v2.5.0 แก้ปัญหา display flicker
   - files: [{filename: "fw_bt7_v250.bmp", fileType: "bmp", isModified: true}, {filename: "config_central.xml", fileType: "xml", isModified: true}]

2. Software update BT10 สาขา Siam Paragon
   - kioskType: BT10
   - taskType: software_update
   - status: in_progress
   - scheduledDate: (today, format YYYY-MM-DD)
   - description: อัพเกรด payment module ให้รองรับ QR code รุ่นใหม่
   - files: [{filename: "payment_v310.xml", fileType: "xml", isModified: true}, {filename: "qr_bg.bmp", fileType: "bmp", isModified: true}, {filename: "beep_success.pcm", fileType: "pcm", isModified: false}]

3. Content update เต่าบิน สาขา MBK
   - kioskType: เต่าบิน
   - taskType: content_update
   - status: pending
   - scheduledDate: (today plus 3 days, format YYYY-MM-DD)
   - description: อัพเดต media content โปรโมชั่น เดือนมิถุนายน
   - files: [{filename: "promo_june.mp4", fileType: "mp4", isModified: true}, {filename: "banner_june.bmp", fileType: "bmp", isModified: true}]

4. Configuration update BT7 ทั้งเครือข่าย
   - kioskType: BT7
   - taskType: config_update
   - status: pending
   - scheduledDate: (today plus 5 days, format YYYY-MM-DD)
   - description: ปรับ timeout setting และ retry policy สำหรับ network unstable zones
   - files: [{filename: "network_config.xml", fileType: "xml", isModified: true}]

5. Maintenance BT10 สาขา The Mall Bangkapi
   - kioskType: BT10
   - taskType: maintenance
   - status: cancelled
   - scheduledDate: (today minus 2 days, format YYYY-MM-DD)
   - description: ยกเลิก — รอ spare parts จากโรงงาน
   - files: []

6. Firmware update เต่าบิน รุ่นใหม่ทั้งหมด
   - kioskType: เต่าบิน
   - taskType: firmware_update
   - status: pending
   - scheduledDate: (today plus 10 days, format YYYY-MM-DD)
   - description: rollout firmware v1.8.0 สำหรับตู้เต่าบินรุ่น 2024 ทั้งหมด
   - files: [{filename: "turtle_fw_v180.bmp", fileType: "bmp", isModified: true}, {filename: "turtle_fw_v180.xml", fileType: "xml", isModified: true}, {filename: "startup.mp4", fileType: "mp4", isModified: false}, {filename: "alert.pcm", fileType: "pcm", isModified: true}]

## Steps

1. Calculate all relative dates from today's actual date.
2. POST each task to http://localhost:3001/api/tasks one by one.
3. Report the created task IDs and names in a summary table.
4. If any POST fails, show the error and continue with the rest.

## Final report

Show a table: | # | ชื่องาน | ประเภทตู้ | สถานะ | วันที่ | ไฟล์ |
