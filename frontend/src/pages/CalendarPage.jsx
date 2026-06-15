import { useState } from 'react'
import { KIOSK_COLORS, THAI_MONTHS, THAI_DAYS_SHORT, STATUS_LIST } from '../utils/constants'
import { StatusBadge, KioskBadge } from '../components/StatusBadge'

export default function CalendarPage({ tasks, onSelectTask, onAddTask }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const goToday   = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()

  const cells = []
  // prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false, date: null })
  }
  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, current: true, date: dateStr })
  }
  // next month padding
  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, current: false, date: null })
  }

  // Map tasks by date
  const tasksByDate = {}
  tasks.forEach(t => {
    if (!tasksByDate[t.scheduledDate]) tasksByDate[t.scheduledDate] = []
    tasksByDate[t.scheduledDate].push(t)
  })

  // Stats for this month
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthTasks = tasks.filter(t => t.scheduledDate?.startsWith(monthStr))
  const statCounts = STATUS_LIST.map(s => ({
    ...s,
    count: monthTasks.filter(t => t.status === s.value).length
  }))

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>ปฏิทินกำหนดการ</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 2 }}>ติดตามงานอัพเกรดตู้บุญเติมรายเดือน</p>
        </div>
        <button
          onClick={onAddTask}
          style={{
            padding: '9px 18px', background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6
          }}
        >+ เพิ่มงาน</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {statCounts.map(s => (
          <div key={s.value} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, lineHeight: 1, color: s.color }}>{s.count}</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-800)', lineHeight: 1 }}>{s.count}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Card */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* Calendar Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={prevMonth} style={navBtnStyle}>‹</button>
            <button onClick={nextMonth} style={navBtnStyle}>›</button>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', margin: '0 8px' }}>
              {THAI_MONTHS[month]} {year + 543}
            </h2>
          </div>
          <button onClick={goToday} style={{ padding: '6px 14px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 12, color: 'var(--gray-600)', fontWeight: 500 }}>
            วันนี้
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--gray-100)' }}>
          {THAI_DAYS_SHORT.map((d, i) => (
            <div key={i} style={{
              padding: '8px 4px', textAlign: 'center', fontSize: 12, fontWeight: 600,
              color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : 'var(--gray-500)'
            }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {cells.map((cell, idx) => {
            const isToday = cell.date === todayStr
            const dayTasks = cell.date ? (tasksByDate[cell.date] || []) : []
            const col = idx % 7
            return (
              <div
                key={idx}
                style={{
                  minHeight: 90, padding: '6px 6px 4px',
                  borderRight: col < 6 ? '1px solid var(--gray-100)' : 'none',
                  borderBottom: idx < 35 ? '1px solid var(--gray-100)' : 'none',
                  background: isToday ? '#eff6ff' : '#fff',
                  opacity: cell.current ? 1 : 0.4
                }}
              >
                <div style={{ textAlign: 'right', marginBottom: 4 }}>
                  <span style={{
                    fontSize: 13, fontWeight: isToday ? 700 : 400,
                    color: isToday ? '#1a56db' : col === 0 ? '#ef4444' : col === 6 ? '#3b82f6' : 'var(--gray-700)',
                    background: isToday ? '#dbeafe' : 'transparent',
                    borderRadius: '50%', display: 'inline-block', width: 24, height: 24,
                    lineHeight: '24px', textAlign: 'center'
                  }}>{cell.day}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dayTasks.slice(0, 3).map(task => {
                    const c = KIOSK_COLORS[task.kioskType] || { bg: '#f3f4f6', text: '#374151' }
                    return (
                      <button
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        title={task.name}
                        style={{
                          width: '100%', padding: '2px 5px', fontSize: 11, fontWeight: 500,
                          background: c.bg, color: c.text,
                          border: 'none', borderRadius: 4, textAlign: 'left',
                          cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          transition: 'filter 0.1s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.93)'}
                        onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                      >
                        {task.name}
                      </button>
                    )
                  })}
                  {dayTasks.length > 3 && (
                    <span style={{ fontSize: 10, color: 'var(--gray-400)', paddingLeft: 4 }}>+{dayTasks.length - 3} อื่นๆ</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 14, justifyContent: 'flex-end' }}>
        {Object.entries(KIOSK_COLORS).map(([type, c]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gray-500)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c.bg, border: `1px solid ${c.dot}`, display: 'inline-block' }} />
            {type}
          </div>
        ))}
      </div>
    </div>
  )
}

const navBtnStyle = {
  width: 30, height: 30, border: '1px solid var(--gray-200)',
  borderRadius: 'var(--radius-sm)', background: '#fff',
  fontSize: 16, cursor: 'pointer', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)'
}
