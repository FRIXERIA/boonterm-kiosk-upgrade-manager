import { useState, useEffect } from 'react'
import { KIOSK_TYPES, TASK_TYPES, STATUS_LIST, FILE_TYPES, FILE_TYPE_INFO } from '../utils/constants'

const DEFAULT_FORM = {
  name: '', kioskType: 'BT7', taskType: 'software_update',
  status: 'pending', scheduledDate: '', description: '', files: []
}

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [newFile, setNewFile] = useState({ filename: '', fileType: 'xml', isModified: true, version: '', note: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        name: task.name || '',
        kioskType: task.kioskType || 'BT7',
        taskType: task.taskType || 'software_update',
        status: task.status || 'pending',
        scheduledDate: task.scheduledDate || '',
        description: task.description || '',
        files: task.files ? [...task.files] : []
      })
    } else {
      const today = new Date().toISOString().split('T')[0]
      setForm({ ...DEFAULT_FORM, scheduledDate: today })
    }
  }, [task])

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'กรุณาระบุชื่องาน'
    if (!form.scheduledDate) e.scheduledDate = 'กรุณาระบุวันที่'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  const detectFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    return FILE_TYPES.includes(ext) ? ext : 'xml'
  }

  const handleFilenameChange = (val) => {
    const ft = detectFileType(val)
    setNewFile(f => ({ ...f, filename: val, fileType: ft }))
  }

  const addFile = () => {
    if (!newFile.filename.trim()) return
    set('files', [...form.files, { ...newFile }])
    setNewFile({ filename: '', fileType: 'xml', isModified: true, version: '', note: '' })
  }

  const removeFile = (idx) => set('files', form.files.filter((_, i) => i !== idx))
  const toggleModified = (idx) => set('files', form.files.map((f, i) => i === idx ? { ...f, isModified: !f.isModified } : f))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: 560, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.2s ease' }}>
        <style>{`@keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>
            {task ? '✏️ แก้ไขงาน' : '➕ เพิ่มงานใหม่'}
          </h2>
          <button onClick={onClose} style={{ width: 28, height: 28, border: '1px solid var(--gray-200)', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14, color: 'var(--gray-500)' }}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>ชื่องาน <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="เช่น อัพเกรด Firmware BT7 v2.5.1"
                style={{ ...inputStyle, borderColor: errors.name ? 'var(--danger)' : 'var(--gray-200)' }}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* Row: kiosk + taskType */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>ประเภทตู้ <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select value={form.kioskType} onChange={e => set('kioskType', e.target.value)} style={selectStyle}>
                  {KIOSK_TYPES.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>ประเภทงาน <span style={{ color: 'var(--danger)' }}>*</span></label>
                <select value={form.taskType} onChange={e => set('taskType', e.target.value)} style={selectStyle}>
                  {TASK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            {/* Row: date + status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>วันที่กำหนด <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="date" value={form.scheduledDate} onChange={e => set('scheduledDate', e.target.value)}
                  style={{ ...inputStyle, borderColor: errors.scheduledDate ? 'var(--danger)' : 'var(--gray-200)' }}
                />
                {errors.scheduledDate && <p style={errorStyle}>{errors.scheduledDate}</p>}
              </div>
              <div>
                <label style={labelStyle}>สถานะ</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} style={selectStyle}>
                  {STATUS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>รายละเอียด</label>
              <textarea
                value={form.description} onChange={e => set('description', e.target.value)}
                rows={3} placeholder="รายละเอียดงานเพิ่มเติม..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* Files */}
            <div>
              <label style={labelStyle}>ไฟล์ที่เกี่ยวข้อง ({form.files.length})</label>

              {/* Add file row */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                <input
                  value={newFile.filename}
                  onChange={e => handleFilenameChange(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFile())}
                  placeholder="ชื่อไฟล์ เช่น config.xml"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <select value={newFile.fileType} onChange={e => setNewFile(f => ({ ...f, fileType: e.target.value }))} style={{ ...selectStyle, width: 70 }}>
                  {FILE_TYPES.map(ft => <option key={ft} value={ft}>.{ft}</option>)}
                </select>
                <input
                  value={newFile.version}
                  onChange={e => setNewFile(f => ({ ...f, version: e.target.value }))}
                  placeholder="ver"
                  style={{ ...inputStyle, width: 56 }}
                />
                <button type="button" onClick={addFile} style={{ padding: '0 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>+</button>
              </div>

              {/* File list */}
              {form.files.length > 0 && (
                <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  {form.files.map((f, i) => {
                    const info = FILE_TYPE_INFO[f.fileType] || {}
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: i < form.files.length - 1 ? '1px solid var(--gray-100)' : 'none', background: '#fff' }}>
                        <span style={{ fontSize: 14 }}>{info.icon || '📄'}</span>
                        <span style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', color: 'var(--gray-700)' }}>{f.filename}</span>
                        {f.version && <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>v{f.version}</span>}
                        <button
                          type="button" onClick={() => toggleModified(i)}
                          style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                            background: f.isModified ? '#def7ec' : 'var(--gray-100)',
                            color: f.isModified ? '#0e9f6e' : 'var(--gray-400)',
                            borderColor: f.isModified ? '#0e9f6e' : 'var(--gray-200)'
                          }}
                        >{f.isModified ? '✏️ แก้ไข' : '• ไม่เปลี่ยน'}</button>
                        <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-300)', fontSize: 14, padding: '0 2px' }}>✕</button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '9px 20px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
              ยกเลิก
            </button>
            <button type="submit" disabled={saving} style={{ padding: '9px 22px', background: saving ? 'var(--gray-300)' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600 }}>
              {saving ? 'กำลังบันทึก...' : task ? 'บันทึกการแก้ไข' : 'เพิ่มงาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 5 }
const inputStyle  = { width: '100%', padding: '8px 10px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13, outline: 'none' }
const selectStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13, background: '#fff', cursor: 'pointer' }
const errorStyle  = { fontSize: 11, color: 'var(--danger)', marginTop: 4 }
