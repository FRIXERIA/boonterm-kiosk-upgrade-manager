import { useState } from 'react'
import { KIOSK_TYPES, TASK_TYPES, STATUS_LIST } from '../utils/constants'
import { StatusBadge, KioskBadge } from '../components/StatusBadge'

export default function TasksPage({ tasks, onSelectTask, onAddTask, onEditTask, onDeleteTask, onUpdateStatus }) {
  const [search, setSearch]         = useState('')
  const [filterKiosk, setFilterKiosk] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy]         = useState('date_asc')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = tasks
    .filter(t => {
      if (filterKiosk !== 'all' && t.kioskType !== filterKiosk) return false
      if (filterStatus !== 'all' && t.status !== filterStatus) return false
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'date_asc')  return a.scheduledDate.localeCompare(b.scheduledDate)
      if (sortBy === 'date_desc') return b.scheduledDate.localeCompare(a.scheduledDate)
      if (sortBy === 'name')      return a.name.localeCompare(b.name, 'th')
      return 0
    })

  const getTaskTypeLabel = (v) => TASK_TYPES.find(t => t.value === v)?.label || v

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>รายการงาน</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 2 }}>ทั้งหมด {tasks.length} งาน · แสดง {filtered.length} รายการ</p>
        </div>
        <button
          onClick={onAddTask}
          style={{ padding: '9px 18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600 }}
        >+ เพิ่มงาน</button>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="🔍 ค้นหาชื่องาน..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: '1 1 180px', minWidth: 180 }}
        />
        <select value={filterKiosk} onChange={e => setFilterKiosk(e.target.value)} style={{ ...selectStyle, minWidth: 130 }}>
          <option value="all">ทุกประเภทตู้</option>
          {KIOSK_TYPES.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...selectStyle, minWidth: 150 }}>
          <option value="all">ทุกสถานะ</option>
          {STATUS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...selectStyle, minWidth: 160 }}>
          <option value="date_asc">วันที่ เก่าสุด → ใหม่สุด</option>
          <option value="date_desc">วันที่ ใหม่สุด → เก่าสุด</option>
          <option value="name">ชื่องาน A-Z</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
              {['ชื่องาน', 'ประเภทตู้', 'ประเภทงาน', 'กำหนดการ', 'สถานะ', 'ไฟล์', ''].map((h, i) => (
                <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>
                  ไม่พบงานที่ตรงกับเงื่อนไข
                </td>
              </tr>
            ) : filtered.map((task, idx) => (
              <tr
                key={task.id}
                style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--gray-100)' : 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => onSelectTask(task)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontWeight: 500, color: 'var(--gray-800)', fontSize: 13 }}
                  >
                    {task.name}
                  </button>
                  {task.description && (
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}><KioskBadge kioskType={task.kioskType} /></td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--gray-600)' }}>{getTaskTypeLabel(task.taskType)}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>
                  {formatDate(task.scheduledDate)}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={task.status}
                    onChange={e => onUpdateStatus(task.id, e.target.value)}
                    style={{ fontSize: 12, border: '1px solid var(--gray-200)', borderRadius: 20, padding: '3px 8px', cursor: 'pointer', background: '#fff' }}
                  >
                    {STATUS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--gray-500)' }}>
                  {task.files?.length || 0} ไฟล์
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => onEditTask(task)} style={actionBtn('#f3f4f6', '#374151')}>แก้ไข</button>
                    <button
                      onClick={() => setDeleteConfirm(task.id)}
                      style={actionBtn('#fde8e8', '#c81e1e')}
                    >ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={overlayStyle}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 28, maxWidth: 380, width: '90%', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>🗑️</div>
            <h3 style={{ textAlign: 'center', marginBottom: 8, color: 'var(--gray-800)' }}>ยืนยันการลบ</h3>
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: 13, marginBottom: 20 }}>
              คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '9px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
                ยกเลิก
              </button>
              <button
                onClick={() => { onDeleteTask(deleteConfirm); setDeleteConfirm(null) }}
                style={{ flex: 1, padding: '9px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                ลบงาน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${parseInt(y)+543}`
}

const inputStyle = { padding: '7px 12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13, outline: 'none', background: '#fff' }
const selectStyle = { padding: '7px 10px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13, background: '#fff', cursor: 'pointer' }
const actionBtn = (bg, color) => ({ padding: '4px 10px', background: bg, color, border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 11, cursor: 'pointer', fontWeight: 500 })
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
