import type { Task } from "../types"

interface TaskItemProps {
  task: Task
  onToggle: (id: string, completed: boolean) => void
}

const stampShape =
  "polygon(50% 0%, 61.4% 7.5%, 75% 6.7%, 81.1% 18.9%, 93.3% 25%, 92.5% 38.6%, 100% 50%, 92.5% 61.4%, 93.3% 75%, 81.1% 81.1%, 75% 93.3%, 61.4% 92.5%, 50% 100%, 38.6% 92.5%, 25% 93.3%, 18.9% 81.1%, 6.7% 75%, 7.5% 61.4%, 0% 50%, 7.5% 38.6%, 6.7% 25%, 18.9% 18.9%, 25% 6.7%, 38.6% 7.5%)"

export function TaskItem({ task, onToggle }: TaskItemProps) {
  return (
    <li
      className={`relative transition duration-500 ${
        task.completed
          ? "overflow-visible border border-transparent bg-transparent"
          : "overflow-hidden border border-sky-200 bg-[#fffaf3] shadow-[0_6px_16px_rgba(45,93,126,0.13)] hover:-translate-y-0.5 hover:shadow-lg"
      }`}
    >
      {/* 未完了のときだけ表示する切符の半円 */}
      {!task.completed && (
        <>
          <div className="absolute -left-3 top-1/2 z-30 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#fffaf3]" />

          <div className="absolute -right-3 top-1/2 z-30 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#fffaf3]" />
        </>
      )}

      {/* 完了すると本体と半券の間が開く */}
      <div
        className={`grid transition-all duration-500 sm:grid-cols-[1fr_9.5rem] ${
          task.completed ? "gap-5" : "gap-0"
        }`}
      >
        {/* チケット本体 */}
        <div
          className={`relative min-w-0 p-5 transition-all duration-500 sm:p-6 ${
            task.completed
              ? "border-x border-t border-slate-300 bg-[#f0f2f2] shadow-[0_5px_12px_rgba(60,70,80,0.10)] sm:border-y sm:border-l sm:border-r-0"
              : "bg-[#fffefa]"
          }`}
        >
          {/* スマホ：本体側のちぎれ目 */}
          {task.completed && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-2 left-0 z-10 h-3 w-full bg-[#f0f2f2] sm:hidden"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% 45%, 95% 100%, 90% 45%, 85% 100%, 80% 45%, 75% 100%, 70% 45%, 65% 100%, 60% 45%, 55% 100%, 50% 45%, 45% 100%, 40% 45%, 35% 100%, 30% 45%, 25% 100%, 20% 45%, 15% 100%, 10% 45%, 5% 100%, 0 45%)",
              }}
            />
          )}

          {/* PC：本体側のちぎれ目 */}
          {task.completed && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 top-0 z-10 hidden h-full w-3 bg-[#f0f2f2] sm:block"
              style={{
                clipPath:
                  "polygon(0 0, 55% 0, 100% 5%, 55% 10%, 100% 15%, 55% 20%, 100% 25%, 55% 30%, 100% 35%, 55% 40%, 100% 45%, 55% 50%, 100% 55%, 55% 60%, 100% 65%, 55% 70%, 100% 75%, 55% 80%, 100% 85%, 55% 90%, 100% 95%, 55% 100%, 0 100%)",
              }}
            />
          )}

          {/* チケット番号 */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#559bdd]">
              SUMMER TICKET
            </p>

            <p className="font-mono text-xs text-slate-400">
              {task.id.toUpperCase()}
            </p>
          </div>

          {/* タスクタイトルの帯 */}
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

          {/* タスクの説明 */}
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

        {/* 点線より右側・スマホでは下側の半券 */}
        <label
          title={
            task.completed
              ? "クリックして未完了に戻す"
              : "クリックして完了にする"
          }
          className={`relative flex min-h-44 cursor-pointer items-center justify-between gap-4 p-5 transition-all duration-500 sm:flex-col sm:items-start sm:justify-start ${
            task.completed
              ? "origin-top-left translate-y-1.5 rotate-[1.5deg] border-x border-b border-slate-300 bg-[#f0f2f2] shadow-[0_5px_12px_rgba(60,70,80,0.12)] sm:translate-x-1.5 sm:translate-y-1 sm:rotate-[2deg] sm:border-y sm:border-r sm:border-l-0"
              : "border-t-2 border-dashed border-sky-200 bg-[#fffefa] sm:border-l-2 sm:border-t-0"
          }`}
        >
          {/* スマホ：半券側のちぎれ目 */}
          {task.completed && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-2 left-0 z-10 h-3 w-full bg-[#f0f2f2] sm:hidden"
              style={{
                clipPath:
                  "polygon(0 100%, 0 55%, 5% 0, 10% 55%, 15% 0, 20% 55%, 25% 0, 30% 55%, 35% 0, 40% 55%, 45% 0, 50% 55%, 55% 0, 60% 55%, 65% 0, 70% 55%, 75% 0, 80% 55%, 85% 0, 90% 55%, 95% 0, 100% 55%, 100% 100%)",
              }}
            />
          )}

          {/* PC：半券側のちぎれ目 */}
          {task.completed && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 top-0 z-10 hidden h-full w-3 bg-[#f0f2f2] sm:block"
              style={{
                clipPath:
                  "polygon(100% 0, 55% 0, 0 5%, 55% 10%, 0 15%, 55% 20%, 0 25%, 55% 30%, 0 35%, 55% 40%, 0 45%, 55% 50%, 0 55%, 55% 60%, 0 65%, 55% 70%, 0 75%, 55% 80%, 0 85%, 55% 90%, 0 95%, 55% 100%, 100% 100%)",
              }}
            />
          )}

          {/* 表示されないチェックボックス */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(event) =>
              onToggle(task.id, event.target.checked)
            }
            aria-label={
              task.completed
                ? `${task.title}を未完了に戻す`
                : `${task.title}を完了にする`
            }
            className="sr-only"
          />

          {/* 出発日 */}
          <div className="relative z-20 text-left">
            <p className="text-xs font-bold tracking-wider text-slate-400">
              DEPARTURE
            </p>

            <p className="mt-1 whitespace-nowrap font-mono text-sm font-bold text-[#347fbd]">
              {task.date}
            </p>
          </div>

          {/* 未完了のときだけ表示 */}
          {!task.completed && (
            <span className="rounded-full border-2 border-sky-300 px-3 py-1 text-xs font-black text-[#559bdd] sm:self-center">
              READY
            </span>
          )}

          {/* 完了したときの旅行スタンプ */}
          {task.completed && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-5 z-30 h-24 w-24 -rotate-12 sm:bottom-3 sm:right-4"
            >
              {/* ギザギザしたスタンプの外周 */}
              <div
                className="absolute inset-0 bg-[#d79f00]"
                style={{ clipPath: stampShape }}
              >
                <div
                  className="absolute inset-[3px] bg-[#f0f2f2]"
                  style={{ clipPath: stampShape }}
                />
              </div>

              {/* スタンプの内側 */}
              <div className="absolute inset-[8px] flex flex-col items-center justify-center rounded-full border-2 border-[#d79f00] text-center text-[#d79f00]">
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
        </label>
      </div>
    </li>
  )
}