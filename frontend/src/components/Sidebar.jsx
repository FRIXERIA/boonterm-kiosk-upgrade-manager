const NAV_ITEMS = [
  { id: 'calendar', label: 'ปฏิทินกำหนดการ', icon: CalendarIcon },
  { id: 'tasks',    label: 'รายการงาน',       icon: TaskIcon    },
  { id: 'files',    label: 'สรุปไฟล์',        icon: FileIcon    }
]

export default function Sidebar({ currentPage, onNavigate, onAddTask }) {
  return (
    <aside style={{
      width: 230,
      minWidth: 230,
      background: 'var(--sidebar-bg)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1a56db, #7e3af2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0
          }}>🏧</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Boonterm</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Upgrade Manager</div>
          </div>
        </div>
      </div>

      {/* Add button */}
      <div style={{ padding: '12px 12px 8px' }}>
        <button
          onClick={onAddTask}
          style={{
            width: '100%', padding: '9px 12px',
            background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-dark)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          เพิ่มงานใหม่
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 8px', overflowY: 'auto' }}>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', padding: '8px 8px 4px', textTransform: 'uppercase' }}>
          เมนูหลัก
        </div>
        {NAV_ITEMS.map(item => {
          const active = currentPage === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                border: 'none', cursor: 'pointer',
                background: active ? 'var(--sidebar-active)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                marginBottom: 2, textAlign: 'left', transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' } }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
        v1.0.0 · Forth Smart Co., Ltd.
      </div>
    </aside>
  )
}

function CalendarIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function TaskIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
}

function FileIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}
