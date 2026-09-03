import type { Task } from "../types"
import { TaskItem } from "./TaskItem"

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string, completed: boolean) => void
}

export function TaskList({ tasks, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="border-2 border-dashed border-sky-300 bg-[#fffdf8] p-10 text-center shadow-sm">
        <p className="text-lg font-bold text-[#3986c7]">
          タスクがありません
        </p>
        <p className="mt-2 text-sm text-slate-500">
          新しい夏が追加されるまで、少し休みましょう。
        </p>
      </div>
    )
  }

  return (
    <ul className="m-0 space-y-5 p-0">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </ul>
  )
}