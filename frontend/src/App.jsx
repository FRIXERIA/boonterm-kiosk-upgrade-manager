import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import CalendarPage from './pages/CalendarPage'
import TasksPage from './pages/TasksPage'
import FileSummaryPage from './pages/FileSummaryPage'
import TaskModal from './components/TaskModal'
import TaskDetailPanel from './components/TaskDetailPanel'

const API = '/api/tasks'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('calendar')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleCreate = async (taskData) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    })
    const newTask = await res.json()
    setTasks(prev => [...prev, newTask])
    setShowModal(false)
    setEditingTask(null)
  }

  const handleUpdate = async (id, taskData) => {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    })
    const updated = await res.json()
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
    if (selectedTask?.id === id) setSelectedTask(updated)
    setShowModal(false)
    setEditingTask(null)
  }

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    setTasks(prev => prev.filter(t => t.id !== id))
    if (selectedTask?.id === id) setSelectedTask(null)
  }

  const openAdd = () => { setEditingTask(null); setShowModal(true) }
  const openEdit = (task) => { setEditingTask(task); setShowModal(true) }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onAddTask={openAdd}
      />

      <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {currentPage === 'calendar' && (
              <CalendarPage
                tasks={tasks}
                onSelectTask={setSelectedTask}
                onAddTask={openAdd}
              />
            )}
            {currentPage === 'tasks' && (
              <TasksPage
                tasks={tasks}
                onSelectTask={setSelectedTask}
                onAddTask={openAdd}
                onEditTask={openEdit}
                onDeleteTask={handleDelete}
                onUpdateStatus={(id, status) => handleUpdate(id, { status })}
              />
            )}
            {currentPage === 'files' && (
              <FileSummaryPage tasks={tasks} />
            )}
          </>
        )}
      </main>

      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={() => openEdit(selectedTask)}
          onDelete={handleDelete}
          onUpdateStatus={(status) => handleUpdate(selectedTask.id, { status })}
        />
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? (data) => handleUpdate(editingTask.id, data) : handleCreate}
          onClose={() => { setShowModal(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
      <div style={{
        width: 40, height: 40, border: '3px solid var(--gray-200)',
        borderTopColor: 'var(--primary)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p>กำลังโหลด...</p>
    </div>
  )
}
