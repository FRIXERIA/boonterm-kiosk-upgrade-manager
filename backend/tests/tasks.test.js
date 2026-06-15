/**
 * TDD — Tasks API
 * Red   : tests ที่เขียนก่อนมี implementation (จะ FAIL)
 * Green : implement validation + file endpoints แล้ว tests ผ่าน
 */

const path = require('path');
const fs = require('fs');

// ต้องตั้ง DATA_FILE ก่อน require app เสมอ (module caching)
const TEST_FILE = path.join(__dirname, 'tasks.test.json');
process.env.DATA_FILE = TEST_FILE;

const request = require('supertest');
const app = require('../app');

// ─── helpers ──────────────────────────────────────────────────────────────────
const validTask = {
  name: 'Upgrade Zone A',
  kioskType: 'BT7',
  taskType: 'software_update',
  scheduledDate: '2026-07-01',
  status: 'pending',
};

beforeEach(() => {
  fs.writeFileSync(TEST_FILE, '[]');
});

afterAll(() => {
  if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/tasks
// ═══════════════════════════════════════════════════════════════════════════════
describe('GET /api/tasks', () => {
  it('[GREEN] returns 200 with empty array when no tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('[GREEN] returns all created tasks', async () => {
    await request(app).post('/api/tasks').send(validTask);
    await request(app).post('/api/tasks').send({ ...validTask, name: 'Task B' });

    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/tasks
// ═══════════════════════════════════════════════════════════════════════════════
describe('POST /api/tasks', () => {
  it('[GREEN] creates task and returns 201 with id', async () => {
    const res = await request(app).post('/api/tasks').send(validTask);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Upgrade Zone A');
    expect(res.body.kioskType).toBe('BT7');
  });

  // ──── RED: ต้องการ validation ที่ยังไม่มี ────────────────────────────────────

  it('[RED] returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/tasks').send({
      kioskType: 'BT7',
      scheduledDate: '2026-07-01',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('[RED] returns 400 when scheduledDate is missing', async () => {
    const res = await request(app).post('/api/tasks').send({
      name: 'Test Task',
      kioskType: 'BT7',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('[RED] returns 400 when kioskType is invalid', async () => {
    const res = await request(app).post('/api/tasks').send({
      name: 'Test Task',
      kioskType: 'INVALID_TYPE',
      scheduledDate: '2026-07-01',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/kioskType/);
  });

  it('[RED] returns 400 when taskType is invalid', async () => {
    const res = await request(app).post('/api/tasks').send({
      name: 'Test Task',
      kioskType: 'BT7',
      scheduledDate: '2026-07-01',
      taskType: 'hacking',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/taskType/);
  });

  it('[RED] returns 400 when status is invalid', async () => {
    const res = await request(app).post('/api/tasks').send({
      name: 'Test Task',
      kioskType: 'BT7',
      scheduledDate: '2026-07-01',
      status: 'flying',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/status/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/tasks/:id
// ═══════════════════════════════════════════════════════════════════════════════
describe('GET /api/tasks/:id', () => {
  it('[GREEN] returns task by id', async () => {
    const created = await request(app).post('/api/tasks').send(validTask);
    const res = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Upgrade Zone A');
  });

  it('[GREEN] returns 404 for non-existent id', async () => {
    const res = await request(app).get('/api/tasks/no-such-id');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PUT /api/tasks/:id
// ═══════════════════════════════════════════════════════════════════════════════
describe('PUT /api/tasks/:id', () => {
  it('[GREEN] updates task fields and returns updated task', async () => {
    const created = await request(app).post('/api/tasks').send(validTask);
    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ status: 'completed', description: 'Done!' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
    expect(res.body.description).toBe('Done!');
  });

  it('[GREEN] returns 404 when updating non-existent task', async () => {
    const res = await request(app).put('/api/tasks/ghost-id').send({ status: 'completed' });
    expect(res.status).toBe(404);
  });

  it('[RED] returns 400 when updating with invalid kioskType', async () => {
    const created = await request(app).post('/api/tasks').send(validTask);
    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ kioskType: 'WRONG' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/kioskType/);
  });

  it('[RED] returns 400 when updating with invalid status', async () => {
    const created = await request(app).post('/api/tasks').send(validTask);
    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ status: 'banana' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/status/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DELETE /api/tasks/:id
// ═══════════════════════════════════════════════════════════════════════════════
describe('DELETE /api/tasks/:id', () => {
  it('[GREEN] deletes task and returns success', async () => {
    const created = await request(app).post('/api/tasks').send(validTask);
    const res = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('[GREEN] returns 404 when deleting non-existent task', async () => {
    const res = await request(app).delete('/api/tasks/ghost-id');
    expect(res.status).toBe(404);
  });

  it('[GREEN] task is actually gone after delete', async () => {
    const created = await request(app).post('/api/tasks').send(validTask);
    await request(app).delete(`/api/tasks/${created.body.id}`);
    const res = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// File endpoints — ❌ endpoints ยังไม่มีเลย (RED)
// ═══════════════════════════════════════════════════════════════════════════════
describe('POST /api/tasks/:id/files', () => {
  let taskId;

  beforeEach(async () => {
    const res = await request(app).post('/api/tasks').send(validTask);
    taskId = res.body.id;
  });

  it('[RED] adds a file and returns 201 with file object', async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/files`)
      .send({ filename: 'boot.xml', fileType: 'xml', isModified: true });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.filename).toBe('boot.xml');
    expect(res.body.fileType).toBe('xml');
    expect(res.body.isModified).toBe(true);
  });

  it('[RED] returns 400 when fileType is invalid', async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/files`)
      .send({ filename: 'readme.txt', fileType: 'txt' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/fileType/);
  });

  it('[RED] returns 400 when filename is missing', async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/files`)
      .send({ fileType: 'xml' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/filename/);
  });

  it('[RED] returns 404 when task does not exist', async () => {
    const res = await request(app)
      .post('/api/tasks/ghost-id/files')
      .send({ filename: 'a.xml', fileType: 'xml' });
    expect(res.status).toBe(404);
  });
});

describe('GET /api/tasks/:id/files', () => {
  let taskId;

  beforeEach(async () => {
    const res = await request(app).post('/api/tasks').send(validTask);
    taskId = res.body.id;
  });

  it('[RED] returns files grouped by type', async () => {
    await request(app).post(`/api/tasks/${taskId}/files`).send({ filename: 'a.xml', fileType: 'xml' });
    await request(app).post(`/api/tasks/${taskId}/files`).send({ filename: 'b.bmp', fileType: 'bmp' });
    await request(app).post(`/api/tasks/${taskId}/files`).send({ filename: 'c.xml', fileType: 'xml' });

    const res = await request(app).get(`/api/tasks/${taskId}/files`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.xml)).toBe(true);
    expect(res.body.xml).toHaveLength(2);
    expect(Array.isArray(res.body.bmp)).toBe(true);
    expect(res.body.bmp).toHaveLength(1);
    expect(Array.isArray(res.body.pcm)).toBe(true);
    expect(Array.isArray(res.body.mp4)).toBe(true);
  });

  it('[RED] returns 404 when task does not exist', async () => {
    const res = await request(app).get('/api/tasks/ghost-id/files');
    expect(res.status).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HAPPY PATH — Full upgrade workflow (end-to-end ใน backend layer)
// ═══════════════════════════════════════════════════════════════════════════════
describe('[HAPPY PATH] Full upgrade round workflow', () => {
  it('สร้างงาน → เพิ่มไฟล์ 4 ประเภท → อัพเดทสถานะ → ตรวจ grouped files ครบ', async () => {
    // 1. สร้างงาน
    const create = await request(app).post('/api/tasks').send({
      name: 'Upgrade BT7 Central World รอบมิถุนายน',
      kioskType: 'BT7',
      taskType: 'firmware_update',
      scheduledDate: '2026-06-20',
      status: 'pending',
    });
    expect(create.status).toBe(201);
    const taskId = create.body.id;

    // 2. เพิ่มไฟล์ครบ 4 ประเภท
    const filePayloads = [
      { filename: 'fw_v250.xml',    fileType: 'xml', isModified: true  },
      { filename: 'splash.bmp',     fileType: 'bmp', isModified: true  },
      { filename: 'beep_ok.pcm',    fileType: 'pcm', isModified: false },
      { filename: 'promo_june.mp4', fileType: 'mp4', isModified: true  },
    ];
    for (const payload of filePayloads) {
      const r = await request(app).post(`/api/tasks/${taskId}/files`).send(payload);
      expect(r.status).toBe(201);
      expect(r.body.filename).toBe(payload.filename);
    }

    // 3. อัพเดทสถานะเป็น completed
    const update = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ status: 'completed', description: 'เสร็จเรียบร้อย ไม่มีปัญหา' });
    expect(update.status).toBe(200);
    expect(update.body.status).toBe('completed');

    // 4. ดึง grouped files → ต้องครบทุก type และนับถูกต้อง
    const files = await request(app).get(`/api/tasks/${taskId}/files`);
    expect(files.status).toBe(200);
    expect(files.body.xml).toHaveLength(1);
    expect(files.body.bmp).toHaveLength(1);
    expect(files.body.pcm).toHaveLength(1);
    expect(files.body.mp4).toHaveLength(1);

    // 5. ตรวจ isModified ถูกต้อง
    expect(files.body.pcm[0].isModified).toBe(false);
    expect(files.body.xml[0].isModified).toBe(true);

    // 6. ตรวจ task โดยรวม
    const final = await request(app).get(`/api/tasks/${taskId}`);
    expect(final.body.files).toHaveLength(4);
    expect(final.body.status).toBe('completed');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASE 1 — scheduledDate format ไม่ถูกต้อง
// validator ปัจจุบันตรวจแค่ว่า "present" ไม่ได้ตรวจ format → RED
// ═══════════════════════════════════════════════════════════════════════════════
describe('[EDGE CASE] scheduledDate format validation', () => {
  it('[RED] returns 400 when scheduledDate is not YYYY-MM-DD format', async () => {
    const res = await request(app).post('/api/tasks').send({
      name: 'Bad Date Task',
      kioskType: 'BT7',
      scheduledDate: 'not-a-date',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/scheduledDate/);
  });

  it('[RED] returns 400 when scheduledDate is DD/MM/YYYY (Thai format)', async () => {
    const res = await request(app).post('/api/tasks').send({
      name: 'Thai Date Task',
      kioskType: 'BT10',
      scheduledDate: '20/06/2026',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/scheduledDate/);
  });

  it('[GREEN] accepts valid YYYY-MM-DD format', async () => {
    const res = await request(app).post('/api/tasks').send({
      name: 'Good Date Task',
      kioskType: 'BT7',
      scheduledDate: '2026-12-31',
    });
    expect(res.status).toBe(201);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASE 2 — PUT ต้องไม่ทับ files ที่มีอยู่
// ═══════════════════════════════════════════════════════════════════════════════
describe('[EDGE CASE] PUT task preserves existing files', () => {
  it('แก้ไขชื่องาน/สถานะ → files array ต้องคงเดิม ไม่ถูก reset', async () => {
    // สร้างงานพร้อมไฟล์
    const created = await request(app).post('/api/tasks').send({
      name: 'งานมีไฟล์',
      kioskType: 'BT7',
      scheduledDate: '2026-07-01',
    });
    const id = created.body.id;

    await request(app).post(`/api/tasks/${id}/files`)
      .send({ filename: 'important.xml', fileType: 'xml', isModified: true });
    await request(app).post(`/api/tasks/${id}/files`)
      .send({ filename: 'splash.bmp', fileType: 'bmp', isModified: false });

    // PUT เปลี่ยนแค่ name กับ status — ไม่ส่ง files
    const updated = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ name: 'งานมีไฟล์ (แก้ไขชื่อ)', status: 'in_progress' });

    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('งานมีไฟล์ (แก้ไขชื่อ)');
    // files ต้องยังอยู่ครบ
    expect(updated.body.files).toHaveLength(2);
    expect(updated.body.files[0].filename).toBe('important.xml');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASE 3 — ชื่องานภาษาไทย + อักขระพิเศษ
// ═══════════════════════════════════════════════════════════════════════════════
describe('[EDGE CASE] Thai characters and special symbols in task name', () => {
  it('บันทึกชื่อภาษาไทย + วงเล็บ + เลข และดึงกลับมาได้ถูกต้อง', async () => {
    const thaiName = 'อัพเกรด BT7 สาขา เซ็นทรัลเวิลด์ (ครั้งที่ 2) — มิถุนายน 2026';
    const created = await request(app).post('/api/tasks').send({
      name: thaiName,
      kioskType: 'เต่าบิน',
      scheduledDate: '2026-06-15',
    });
    expect(created.status).toBe(201);
    expect(created.body.name).toBe(thaiName);

    // ดึงกลับด้วย GET by id
    const fetched = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.name).toBe(thaiName);
    expect(fetched.body.kioskType).toBe('เต่าบิน');
  });

  it('ชื่อไฟล์ภาษาไทย + นามสกุลถูกต้อง → เพิ่มได้', async () => {
    const task = await request(app).post('/api/tasks').send({
      name: 'Thai File Test',
      kioskType: 'BT10',
      scheduledDate: '2026-06-15',
    });
    const res = await request(app)
      .post(`/api/tasks/${task.body.id}/files`)
      .send({ filename: 'โปรโมชั่น_มิถุนายน.bmp', fileType: 'bmp', isModified: true });
    expect(res.status).toBe(201);
    expect(res.body.filename).toBe('โปรโมชั่น_มิถุนายน.bmp');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASE 4 — GET /files บน task ที่ไม่มีไฟล์เลย
// ═══════════════════════════════════════════════════════════════════════════════
describe('[EDGE CASE] GET /files on task with no files', () => {
  it('คืน object ครบ 4 type ทุก array ว่าง — ไม่ใช่ empty object หรือ null', async () => {
    const task = await request(app).post('/api/tasks').send({
      name: 'No Files Task',
      kioskType: 'BT7',
      scheduledDate: '2026-07-01',
    });
    const res = await request(app).get(`/api/tasks/${task.body.id}/files`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('xml');
    expect(res.body).toHaveProperty('bmp');
    expect(res.body).toHaveProperty('pcm');
    expect(res.body).toHaveProperty('mp4');
    expect(res.body.xml).toEqual([]);
    expect(res.body.bmp).toEqual([]);
    expect(res.body.pcm).toEqual([]);
    expect(res.body.mp4).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EDGE CASE 5 — เพิ่มไฟล์ชื่อซ้ำ (no dedup — ทั้งสองรายการต้องอยู่)
// ═══════════════════════════════════════════════════════════════════════════════
describe('[EDGE CASE] Duplicate filenames in same task', () => {
  it('เพิ่มไฟล์ชื่อเดิม 2 ครั้ง → ได้ 2 รายการ (API ไม่ dedup)', async () => {
    const task = await request(app).post('/api/tasks').send({
      name: 'Dup File Task',
      kioskType: 'BT7',
      scheduledDate: '2026-07-01',
    });
    const id = task.body.id;

    await request(app).post(`/api/tasks/${id}/files`)
      .send({ filename: 'config.xml', fileType: 'xml', isModified: false });
    await request(app).post(`/api/tasks/${id}/files`)
      .send({ filename: 'config.xml', fileType: 'xml', isModified: true });

    const files = await request(app).get(`/api/tasks/${id}/files`);
    expect(files.body.xml).toHaveLength(2);
    // id ต้องต่างกัน (แต่ละรายการมี uuid ของตัวเอง)
    expect(files.body.xml[0].id).not.toBe(files.body.xml[1].id);
    // isModified ต่างกัน
    expect(files.body.xml[0].isModified).toBe(false);
    expect(files.body.xml[1].isModified).toBe(true);
  });
});
