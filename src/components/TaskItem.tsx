import type { Task } from "../types"

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
}

const stampShape =
  "polygon(50% 0%, 61.4% 7.5%, 75% 6.7%, 81.1% 18.9%, 93.3% 25%, 92.5% 38.6%, 100% 50%, 92.5% 61.4%, 93.3% 75%, 81.1% 81.1%, 75% 93.3%, 61.4% 92.5%, 50% 100%, 38.6% 92.5%, 25% 93.3%, 18.9% 81.1%, 6.7% 75%, 7.5% 61.4%, 0% 50%, 7.5% 38.6%, 6.7% 25%, 18.9% 18.9%, 25% 6.7%, 38.6% 7.5%)"

export function TaskItem({
  task,
  onToggle,
  onEdit,
}: TaskItemProps) {
  return (
    <li
      className={`relative overflow-hidden border shadow-[0_6px_16px_rgba(45,93,126,0.13)] transition duration-200 ${
        task.completed
          ? "border-slate-300 bg-[#f0f2f2]"
          : "border-sky-200 bg-[#fffefa] hover:-translate-y-0.5 hover:shadow-lg"
      }`}
    >
      {/* 切符の左右にある半円 */}
      <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#fffaf3]" />

      <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#fffaf3]" />

      <div className="grid sm:grid-cols-[1fr_9.5rem]">
        <div className="min-w-0 p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#559bdd]">
                SUMMER TICKET
              </p>

              {/* points を持たない古いタスクもあるため 0 で補う */}
              <span
                className={`whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] font-black tracking-wide ${
                  task.completed
                    ? "border-slate-300 text-slate-400"
                    : "border-[#e6c56d] bg-[#fdf4de] text-[#b3820b]"
                }`}
              >
                {task.points ?? 0} pt
              </span>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-mono text-xs text-slate-400">
                {task.id.toUpperCase()}
              </p>

              {/* 編集フォームを開くボタン */}
             <button
                type="button"
                onClick={() => onEdit(task)}
                className="border-b border-[#579bd9] pb-0.5  font-mono text-[10px] font-black tracking-[0.14em] text-[#579bd9] transition hover:border-[#d79f00] hover:text-[#d79f00]"
              >
                EDIT
              </button>
            </div>
          </div>

          {/* タスクタイトル */}
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

          {/* タスク説明 */}
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

        {/* 日付と完了操作 */}
        <label
          className={`flex min-h-36 cursor-pointer items-center justify-between gap-4 border-t-2 border-dashed p-5 sm:flex-col sm:justify-start sm:border-l-2 sm:border-t-0 ${
            task.completed
              ? "border-slate-300"
              : "border-sky-200"
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
            onChange={(event) =>
              onToggle(task.id, event.target.checked)
            }
            aria-label={
              task.completed
                ? `${task.title}の完了を取り消す`
                : `${task.title}を完了にする`
            }
            className="h-7 w-7 cursor-pointer accent-[#f2bd00]"
          />

          {!task.completed && (
            <span className="rounded-full border-2 border-sky-300 px-3 py-1 text-xs font-black text-[#559bdd]">
              READY
            </span>
          )}
        </label>
      </div>

      {/* 完了済みの旅行スタンプ */}
      {task.completed && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-0 z-20 h-28 w-28 -rotate-12 text-[#d79f00] sm:bottom-3 sm:right-4"
        >
          <div
            className="absolute inset-0 bg-[#d79f00]"
            style={{ clipPath: stampShape }}
          >
            <div
              className="absolute inset-[3px] bg-[#f0f2f2]"
              style={{ clipPath: stampShape }}
            />
          </div>

          <div className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full border-2 border-[#d79f00] text-center">
            <div className="absolute inset-[3px] rounded-full border border-[#d79f00]" />

            <span className="relative text-sm leading-none">
              ✈︎
            </span>

            <span className="relative mt-0.5 text-[10px] font-black tracking-wide">
              ENJOYED!
            </span>

            <span className="relative text-[7px] font-bold tracking-wide">
              SUMMER 2026
            </span>
          </div>
        </div>
      )}
    </li>
  )
}