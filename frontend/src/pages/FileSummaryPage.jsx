import { useState } from 'react'
import { FILE_TYPE_INFO, FILE_TYPES, KIOSK_TYPES } from '../utils/constants'
import { KioskBadge } from '../components/StatusBadge'

export default function FileSummaryPage({ tasks }) {
  const [filterKiosk, setFilterKiosk] = useState('all')
  const [filterModified, setFilterModified] = useState('all')

  const filtered = tasks.filter(t => filterKiosk === 'all' || t.kioskType === filterKiosk)

  // Collect all files
  const allFiles = []
  filtered.forEach(task => {
    (task.files || []).forEach(f => {
      if (filterModified === 'modified' && !f.isModified) return
      if (filterModified === 'unchanged' && f.isModified) return
      allFiles.push({ ...f, taskName: task.name, taskId: task.id, kioskType: task.kioskType, scheduledDate: task.scheduledDate })
    })
  })

  // Group by file type
  const grouped = {}
  FILE_TYPES.forEach(ft => {
    grouped[ft] = allFiles.filter(f => f.fileType === ft)
  })

  const totalModified = allFiles.filter(f => f.isModified).length
  const totalFiles    = allFiles.length

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>สรุปไฟล์</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 2 }}>รายการไฟล์ทั้งหมดที่มีการอัพเกรดในรอบตู้</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 20 }}>
        <SummaryCard label="ไฟล์ทั้งหมด" value={totalFiles} color="#1a56db" bg="#e8f0fe" icon="📁" />
        <SummaryCard label="แก้ไขแล้ว" value={totalModified} color="#0e9f6e" bg="#def7ec" icon="✅" />
        {FILE_TYPES.map(ft => {
          const info = FILE_TYPE_INFO[ft]
          return <SummaryCard key={ft} label={`.${ft}`} value={grouped[ft].length} color={info.color} bg={info.bg} icon={info.icon} />
        })}
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>กรอง:</span>
        <select value={filterKiosk} onChange={e => setFilterKiosk(e.target.value)} style={selectStyle}>
          <option value="all">ทุกประเภทตู้</option>
          {KIOSK_TYPES.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select value={filterModified} onChange={e => setFilterModified(e.target.value)} style={selectStyle}>
          <option value="all">ทุกไฟล์</option>
          <option value="modified">เฉพาะไฟล์ที่แก้ไข</option>
          <option value="unchanged">เฉพาะไฟล์ไม่เปลี่ยนแปลง</option>
        </select>
      </div>

      {/* File groups */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {FILE_TYPES.map(ft => {
          const info = FILE_TYPE_INFO[ft]
          const files = grouped[ft]
          return (
            <div key={ft} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {/* Group header */}
              <div style={{ padding: '12px 16px', background: info.bg, borderBottom: `2px solid ${info.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{info.icon}</span>
                  <span style={{ fontWeight: 700, color: info.color, fontSize: 14 }}>.{ft.toUpperCase()}</span>
                  <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Files</span>
                </div>
                <span style={{ background: info.color, color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                  {files.length}
                </span>
              </div>

              {/* File list */}
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {files.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--gray-300)', fontSize: 13 }}>
                    ไม่มีไฟล์ .{ft}
                  </div>
                ) : files.map((f, i) => (
                  <div key={i} style={{ padding: '10px 16px', borderBottom: i < files.length - 1 ? '1px solid var(--gray-100)' : 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 18, height: 18, borderRadius: 4, background: f.isModified ? '#def7ec' : '#f3f4f6',
                          fontSize: 10
                        }}>{f.isModified ? '✏️' : '•'}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.filename}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', paddingLeft: 24 }}>
                        งาน: {f.taskName}
                        {f.version && ` · v${f.version}`}
                        {f.note && ` · ${f.note}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <KioskBadge kioskType={f.kioskType} />
                      {f.isModified && (
                        <span style={{ fontSize: 10, color: '#0e9f6e', fontWeight: 600 }}>แก้ไขแล้ว</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Flat table of modified files */}
      {totalModified > 0 && (
        <div style={{ marginTop: 20, background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', fontWeight: 700, fontSize: 14, color: 'var(--gray-800)' }}>
            📋 รายการไฟล์ที่มีการแก้ไขทั้งหมด ({totalModified} ไฟล์)
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)' }}>
                {['ชื่อไฟล์','ประเภท','งาน','ตู้','เวอร์ชัน','หมายเหตุ'].map((h,i) => (
                  <th key={i} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', borderBottom: '1px solid var(--gray-200)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFiles.filter(f => f.isModified).map((f, i, arr) => {
                const info = FILE_TYPE_INFO[f.fileType] || {}
                return (
                  <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    <td style={{ padding: '9px 14px', fontSize: 12, fontFamily: 'monospace', color: 'var(--gray-700)', fontWeight: 500 }}>{f.filename}</td>
                    <td style={{ padding: '9px 14px' }}>
                      <span style={{ fontSize: 11, background: info.bg, color: info.color, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                        {info.icon} .{f.fileType}
                      </span>
                    </td>
                    <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--gray-600)' }}>{f.taskName}</td>
                    <td style={{ padding: '9px 14px' }}><KioskBadge kioskType={f.kioskType} /></td>
                    <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--gray-500)' }}>{f.version || '-'}</td>
                    <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--gray-500)' }}>{f.note || '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, color, bg, icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
      <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

const selectStyle = { padding: '7px 10px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13, background: '#fff', cursor: 'pointer' }
