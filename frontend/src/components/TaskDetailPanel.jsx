import { useState } from 'react'
import { STATUS_LIST, TASK_TYPES, FILE_TYPE_INFO } from '../utils/constants'
import { StatusBadge, KioskBadge } from './StatusBadge'

export default function TaskDetailPanel({ task, onClose, onEdit, onDelete, onUpdateStatus }) {
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const getTaskTypeLabel = (v) => TASK_TYPES.find(t => t.value === v)?.label || v

  const filesByType = {}
  ;(task.files || []).forEach(f => {
    if (!filesByType[f.fileType]) filesByType[f.fileType] = []
    filesByType[f.fileType].push(f)
  })

  const modifiedCount = (task.files || []).filter(f => f.isModified).length

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 90 }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 420, background: '#fff',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        zIndex: 91, display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.2s ease'
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              <KioskBadge kioskType={task.kioskType} />
              <StatusBadge status={task.status} />
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.4 }}>{task.name}</h2>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, border: '1px solid var(--gray-200)', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 14, color: 'var(--gray-500)', flexShrink: 0 }}>✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Info grid */}
          <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 16 }}>
            <InfoRow label="ประเภทงาน" value={getTaskTypeLabel(task.taskType)} />
            <InfoRow label="กำหนดการ" value={formatDate(task.scheduledDate)} />
            <InfoRow label="สร้างเมื่อ" value={formatDateTime(task.createdAt)} />
            <InfoRow label="แก้ไขล่าสุด" value={formatDateTime(task.updatedAt)} isLast />
          </div>

          {/* Description */}
          {task.description && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>รายละเอียด</div>
              <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.7, background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
                {task.description}
              </p>
            </div>
          )}

          {/* Change status */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>เปลี่ยนสถานะ</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {STATUS_LIST.map(s => (
                <button
                  key={s.value}
                  onClick={() => onUpdateStatus(s.value)}
                  style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    border: task.status === s.value ? `2px solid ${s.color}` : '2px solid transparent',
                    background: task.status === s.value ? s.bg : 'var(--gray-100)',
                    color: task.status === s.value ? s.color : 'var(--gray-500)',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                >{s.label}</button>
              ))}
            </div>
          </div>

          {/* Files */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ไฟล์ ({task.files?.length || 0} รายการ · แก้ไข {modifiedCount} ไฟล์)
              </div>
            </div>

            {(!task.files || task.files.length === 0) ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--gray-300)', fontSize: 13, background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                ยังไม่มีไฟล์
              </div>
            ) : (
              Object.entries(filesByType).map(([type, files]) => {
                const info = FILE_TYPE_INFO[type] || { icon: '📄', color: '#6b7280', bg: '#f3f4f6' }
                return (
                  <div key={type} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, padding: '4px 8px', background: info.bg, borderRadius: 6 }}>
                      <span>{info.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: info.color }}>.{type.toUpperCase()}</span>
                      <span style={{ fontSize: 11, color: info.color, opacity: 0.7 }}>({files.length})</span>
                    </div>
                    {files.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', background: '#fff', border: '1px solid var(--gray-100)', borderRadius: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, opacity: f.isModified ? 1 : 0.4 }}>{f.isModified ? '✏️' : '•'}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 500, color: 'var(--gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {f.filename}
                          </div>
                          {(f.version || f.note) && (
                            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 1 }}>
                              {f.version && `v${f.version}`}{f.version && f.note && ' · '}{f.note}
                            </div>
                          )}
                        </div>
                        {f.isModified && (
                          <span style={{ fontSize: 10, color: '#0e9f6e', fontWeight: 600, flexShrink: 0 }}>แก้ไขแล้ว</span>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 8 }}>
          <button onClick={onEdit} style={{ flex: 1, padding: '9px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ✏️ แก้ไข
          </button>
          <button
            onClick={() => setDeleteConfirm(true)}
            style={{ padding: '9px 14px', background: '#fde8e8', color: 'var(--danger)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 13, cursor: 'pointer' }}
          >🗑️</button>
        </div>
      </div>

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 28, maxWidth: 360, width: '90%', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
            <h3 style={{ textAlign: 'center', marginBottom: 8 }}>ยืนยันการลบ?</h3>
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 13, marginBottom: 20 }}>
              ลบ "<strong>{task.name}</strong>" ? ไม่สามารถย้อนกลับได้
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(false)} style={{ flex: 1, padding: 9, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', background: '#fff', cursor: 'pointer' }}>ยกเลิก</button>
              <button
                onClick={() => { onDelete(task.id); setDeleteConfirm(false) }}
                style={{ flex: 1, padding: 9, background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
              >ลบงาน</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function InfoRow({ label, value, isLast }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: isLast ? 'none' : '1px solid var(--gray-200)' }}>
      <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 12, color: 'var(--gray-800)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${parseInt(y)+543}`
}

function formatDateTime(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.toLocaleDateString('th-TH')} ${d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`
}
