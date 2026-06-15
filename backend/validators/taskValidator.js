const VALID_KIOSK_TYPES = ['BT7', 'BT10', 'เต่าบิน'];
const VALID_TASK_TYPES  = ['software_update', 'firmware_update', 'content_update', 'config_update', 'maintenance'];
const VALID_STATUSES    = ['pending', 'in_progress', 'completed', 'cancelled'];
const VALID_FILE_TYPES  = ['xml', 'bmp', 'pcm', 'mp4'];

function validateCreateTask(body) {
  if (!body.name || body.name.trim() === '')
    return 'name is required';
  if (!body.scheduledDate)
    return 'scheduledDate is required';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.scheduledDate))
    return 'scheduledDate must be in YYYY-MM-DD format';
  if (body.kioskType && !VALID_KIOSK_TYPES.includes(body.kioskType))
    return `kioskType must be one of: ${VALID_KIOSK_TYPES.join(', ')}`;
  if (body.taskType && !VALID_TASK_TYPES.includes(body.taskType))
    return `taskType must be one of: ${VALID_TASK_TYPES.join(', ')}`;
  if (body.status && !VALID_STATUSES.includes(body.status))
    return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  return null;
}

function validateUpdateTask(body) {
  if (body.kioskType && !VALID_KIOSK_TYPES.includes(body.kioskType))
    return `kioskType must be one of: ${VALID_KIOSK_TYPES.join(', ')}`;
  if (body.taskType && !VALID_TASK_TYPES.includes(body.taskType))
    return `taskType must be one of: ${VALID_TASK_TYPES.join(', ')}`;
  if (body.status && !VALID_STATUSES.includes(body.status))
    return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  return null;
}

function validateAddFile(body) {
  if (!body.filename || body.filename.trim() === '')
    return 'filename is required';
  if (!VALID_FILE_TYPES.includes(body.fileType))
    return `fileType must be one of: ${VALID_FILE_TYPES.join(', ')}`;
  return null;
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateAddFile,
  VALID_FILE_TYPES,
};
