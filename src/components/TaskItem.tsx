import type { Task } from "../types"

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <li
      className={`relative overflow-hidden border shadow-[0_6px_16px_rgba(45,93,126,0.13)] transition duration-200 ${
        task.completed
          ? "border-slate-300 bg-[#f0f2f2]"
          : "border-sky-200 bg-[#fffefa] hover:-translate-y-0.5 hover:shadow-lg"
      }`}
    >
      <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#fffaf3]" />
      <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#fffaf3]" />

      <div className="grid sm:grid-cols-[1fr_9.5rem]">
        <div className="min-w-0 p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#559bdd]">
              SUMMER TICKET
            </p>

            <p className="font-mono text-xs text-slate-400">
              {task.id.toUpperCase()}
            </p>
          </div>

          {/* 上下の高さは一定で、右端だけV字に切り込む */}
          <div
            className={`mb-4 flex min-h-12 items-center px-5 pr-12 text-white ${
              task.completed ? "bg-slate-400" : "bg-[#559bdd]"
            }`}
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)",
            }}
          >
            <h2
              className={`m-0 text-left text-xl font-bold text-white ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h2>
          </div>

          {task.description ? (
            <p
              className={`text-left leading-7 ${
                task.completed
                  ? "text-slate-500 line-through"
                  : "text-slate-700"
              }`}
            >
              {task.description}
            </p>
          ) : (
            <p className="text-left text-sm text-slate-400">
              説明はありません
            </p>
          )}
        </div>

        <label
          className={`flex cursor-pointer items-center justify-between gap-4 border-t-2 border-dashed p-5 sm:flex-col sm:justify-center sm:border-l-2 sm:border-t-0 ${
            task.completed ? "border-slate-300" : "border-sky-200"
          }`}
        >
          <div className="text-left sm:text-center">
            <p className="text-xs font-bold tracking-wider text-slate-400">
              DEPARTURE
            </p>

            <p className="mt-1 whitespace-nowrap font-mono text-sm font-bold text-[#347fbd]">
              {task.date}
            </p>
          </div>

          <input
            type="checkbox"
            checked={task.completed}
            onChange={(event) => onToggle(task.id, event.target.checked)}
            aria-label={
              task.completed
                ? `${task.title}の完了を取り消す`
                : `${task.title}を完了にする`
            }
            className="h-7 w-7 cursor-pointer accent-[#f2bd00]"
          />

          <span
            className={`rounded-full border-2 px-3 py-1 text-xs font-black ${
              task.completed
                ? "rotate-[-6deg] border-[#e4ae00] text-[#d79f00]"
                : "border-sky-300 text-[#559bdd]"
            }`}
          >
            {task.completed ? "ENJOYED!" : "READY"}
          </span>
        </label>
      </div>
    </li>
  )
}