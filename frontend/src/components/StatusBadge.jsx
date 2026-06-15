import { STATUS_LIST, KIOSK_COLORS } from '../utils/constants'

export function StatusBadge({ status }) {
  const info = STATUS_LIST.find(s => s.value === status) || STATUS_LIST[0]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20, fontSize: 12, fontWeight: 500,
      background: info.bg, color: info.color
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: info.color, display: 'inline-block' }} />
      {info.label}
    </span>
  )
}

export function KioskBadge({ kioskType }) {
  const c = KIOSK_COLORS[kioskType] || { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.text
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, display: 'inline-block' }} />
      {kioskType}
    </span>
  )
}
