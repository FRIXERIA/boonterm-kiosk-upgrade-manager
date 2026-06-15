export const KIOSK_TYPES = ['BT7', 'BT10', 'เต่าบิน']

export const KIOSK_COLORS = {
  'BT7':    { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  'BT10':   { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  'เต่าบิน': { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' }
}

export const TASK_TYPES = [
  { value: 'software_update', label: 'Software Update' },
  { value: 'firmware_update', label: 'Firmware Update' },
  { value: 'content_update',  label: 'Content Update'  },
  { value: 'config_update',   label: 'Configuration Update' },
  { value: 'maintenance',     label: 'Maintenance' }
]

export const STATUS_LIST = [
  { value: 'pending',     label: 'รอดำเนินการ',      color: '#6b7280', bg: '#f3f4f6' },
  { value: 'in_progress', label: 'กำลังดำเนินการ',   color: '#1a56db', bg: '#e8f0fe' },
  { value: 'completed',   label: 'เสร็จสิ้น',        color: '#0e9f6e', bg: '#def7ec' },
  { value: 'cancelled',   label: 'ยกเลิก',           color: '#f05252', bg: '#fde8e8' }
]

export const FILE_TYPES = ['xml', 'bmp', 'pcm', 'mp4']

export const FILE_TYPE_INFO = {
  xml: { label: 'XML',  color: '#f97316', bg: '#fff7ed', icon: '📄' },
  bmp: { label: 'BMP',  color: '#8b5cf6', bg: '#f5f3ff', icon: '🖼️' },
  pcm: { label: 'PCM',  color: '#0ea5e9', bg: '#f0f9ff', icon: '🔊' },
  mp4: { label: 'MP4',  color: '#ec4899', bg: '#fdf2f8', icon: '🎬' }
}

export const THAI_MONTHS = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'
]

export const THAI_DAYS_SHORT = ['อา','จ','อ','พ','พฤ','ศ','ส']
