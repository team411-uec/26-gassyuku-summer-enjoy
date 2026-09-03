import { useEffect, useState } from "react"
import { Ichiran } from "./ichiran"
import { TaskForm } from "./TaskForm"
import type { Task } from "../types"
import { loginAnonymously } from "../lib/auth"
import { addTask, getTasks, updateTask } from "../lib/tasks"

export const App = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false)

  useEffect(() => {
    async function loadTasks() {
      const user = await loginAnonymously()
      setUserId(user.uid)
      setTasks(await getTasks(user.uid))
    }

    void loadTasks()
  }, [])

  const handleToggle = (id: string, completed: boolean) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed } : task,
      ),
    )

    if (userId) void updateTask(userId, id, { completed })
  }

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    if (!userId) return

    const id = await addTask(userId, newTask)
    setTasks((currentTasks) => [...currentTasks, { ...newTask, id }])
  }

  const openTaskForm = () => {
    setIsTaskFormVisible(true)
  }

  const closeTaskForm = () => {
    setIsTaskFormVisible(false)
  }

  return (
    <>
      <Ichiran
        tasks={tasks}
        onToggle={handleToggle}
        onOpenTaskForm={openTaskForm}
      />

      {isTaskFormVisible && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="新しい夏を登録"
          onClick={closeTaskForm}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-3 backdrop-blur-sm sm:p-6"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[94vh] w-full max-w-3xl overflow-y-auto shadow-[0_24px_70px_rgba(15,45,65,0.4)]"
          >
            <button
              type="button"
              onClick={() => setIsTaskFormVisible(false)}
              aria-label="登録フォームを閉じる"
              className="absolute right-3 top-3 z-40 flex h-8 w-14 items-center justify-center border border-slate-300 bg-white/80 text-xl font-normal leading-none text-slate-400 transition hover:border-slate-400 hover:bg-white hover:text-slate-600"
            >
              ×
            </button>

            <TaskForm onSubmit={handleAddTask} />
          </div>
        </div>
      )}
    </>
  )
}
