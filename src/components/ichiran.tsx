import type { ReactNode } from "react"
import type { Task } from "../types"
import { TaskList } from "./TaskList"

interface IchiranProps {
  tasks: Task[]
  onToggle: (id: string, completed: boolean) => void | Promise<void>
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void | Promise<void>
  pendingTaskIds: Set<string>
  isLoading: boolean
  loadError: string | null
  onRetry: () => void
  feedback: string | null
  onOpenTaskForm: () => void
  children?: ReactNode
}

const stickerShape =
  "polygon(50% 0%, 61.4% 7.5%, 75% 6.7%, 81.1% 18.9%, 93.3% 25%, 92.5% 38.6%, 100% 50%, 92.5% 61.4%, 93.3% 75%, 81.1% 81.1%, 75% 93.3%, 61.4% 92.5%, 50% 100%, 38.6% 92.5%, 25% 93.3%, 18.9% 81.1%, 6.7% 75%, 7.5% 61.4%, 0% 50%, 7.5% 38.6%, 6.7% 25%, 18.9% 18.9%, 25% 6.7%, 38.6% 7.5%)"

export function Ichiran({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  pendingTaskIds,
  isLoading,
  loadError,
  onRetry,
  feedback,
  onOpenTaskForm,
  children,
}: IchiranProps) {
  return (
    <main className="min-h-screen bg-[#eaf7fb] px-3 py-6 text-left sm:px-6">
      <div className="mx-auto max-w-3xl overflow-hidden bg-[#fffaf3] shadow-2xl">
        <header>
          {/* 海の写真 */}
          <div className="relative h-48 bg-[#fffaf3] sm:h-64">
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, 0 70%)",
              }}
            >
              <img
                src="/images/summer-sea.jpg"
                alt="夏の青い海"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent" />
            </div>

            {/* 写真の上に貼った旅行ラベル */}
            <div className="absolute right-5 top-5 rotate-3 bg-white/90 px-3 py-1.5 text-sm font-bold tracking-widest text-[#377fbf] shadow-md">
              SUMMER PASS
            </div>
          </div>

          {/* 左端に密着したタイトル帯 */}
          <div className="relative -mt-10 pr-3 sm:-mt-14 sm:pr-6">
            <div
              className="relative flex min-h-28 items-center bg-[#5798d9] px-5 pr-32 shadow-lg sm:min-h-36 sm:px-8 sm:pr-44"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 91% 50%, 100% 100%, 0 100%)",
              }}
            >
              <div>
                <p
                  className="font-bold tracking-[0.2em]"
                  style={{
                    margin: "0 0 8px",
                    color: "rgba(255, 255, 255, 0.85)",
                    fontSize:
                      "clamp(13px, 2vw, 18px)",
                  }}
                >
                  MAKE YOUR SUMMER
                </p>

                <h1
                  className="whitespace-nowrap font-serif tracking-tight drop-shadow-sm"
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontSize:
                      "clamp(42px, 7vw, 80px)",
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  Summer Enjoy!
                </h1>
              </div>
            </div>

            {/* 旅行鞄に貼ったような記念ステッカー */}
            <div
              className="absolute right-5 top-1/2 z-10 h-28 w-28 -translate-y-1/2 rotate-6 sm:right-9 sm:h-36 sm:w-36"
              style={{
                filter:
                  "drop-shadow(4px 7px 5px rgba(45,70,90,0.28))",
              }}
            >
              {/* 少しずれた白い台紙 */}
              <div
                className="absolute inset-0 translate-x-1 translate-y-1 bg-white"
                style={{
                  clipPath: stickerShape,
                }}
              />

              {/* ギザギザした黄色いステッカー */}
              <div
                className="absolute inset-1 flex items-center justify-center bg-[#ffd323]"
                style={{
                  clipPath: stickerShape,
                }}
              >
                <div className="absolute inset-[14%] rounded-full border-2 border-dashed border-white" />

                <div className="relative flex flex-col items-center justify-center text-center text-[#167bb8]">
                  <span
                    className="font-black tracking-[0.15em]"
                    style={{
                      fontSize:
                        "clamp(9px, 1.5vw, 13px)",
                    }}
                  >
                    TRAVEL
                  </span>

                  <span
                    className="font-serif font-black leading-none"
                    style={{
                      fontSize:
                        "clamp(17px, 3vw, 28px)",
                    }}
                  >
                    ENJOY!
                  </span>

                  <span
                    className="my-0.5 leading-none"
                    style={{
                      fontSize:
                        "clamp(23px, 4vw, 36px)",
                    }}
                  >
                    ☀
                  </span>

                  <span
                    className="font-bold tracking-wide"
                    style={{
                      fontSize:
                        "clamp(8px, 1.3vw, 11px)",
                    }}
                  >
                    SUMMER 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* タスク一覧 */}
        <section className="px-4 pb-12 pt-10 sm:px-9 sm:pt-12">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className="font-black tracking-[0.2em]"
                style={{
                  margin: "0 0 6px",
                  color: "#e59a35",
                  fontSize: "14px",
                }}
              >
                YOUR SUMMER TICKETS
              </p>

              <h2
                style={{
                  margin: 0,
                  color: "var(--color-slate-600)",
                  fontSize:
                    "clamp(30px, 4vw, 40px)",
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                夏の予定一覧
              </h2>

              <p
                className="mt-3 text-base leading-relaxed text-slate-600"
                style={{
                  fontSize: "16px",
                }}
              >
                行きたい夏にチェックを入れて、
                <br className="sm:hidden" />
                思い出を集めましょう。
              </p>
            </div>

            {/* 新しい夏を追加するタグ型ボタン */}
            <button
              type="button"
              onClick={onOpenTaskForm}
              disabled={isLoading || Boolean(loadError)}
              className="group relative h-[72px] w-[230px] shrink-0 cursor-pointer bg-[#ffd323] pl-14 pr-5 text-left transition hover:-translate-y-0.5 hover:bg-[#ffdc4d] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                clipPath:
                  "polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 82%, 0 18%)",
              }}
            >
              {/* タグの穴 */}
              <span className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#fffaf3]">
                <span className="h-3 w-3 rounded-full bg-[#579bd9]" />
              </span>

              {/* 小さい英字 */}
              <span className="block font-mono text-[11px] font-black tracking-[0.18em] text-[#287ab9]">
                NEW SUMMER TAG
              </span>

              {/* メインテキスト */}
              <span className="mt-1 flex items-center gap-2 whitespace-nowrap text-[17px] font-black text-slate-700">
                <span className="text-xl leading-none text-[#287ab9]">
                  ＋
                </span>

                新しい夏を追加
              </span>

              {/* 値札らしい番号 */}
              <span className="absolute right-4 top-2 font-mono text-[8px] font-bold tracking-wider text-[#287ab9]/70">
                No.2026
              </span>

              {/* 下側の飾り線 */}
              <span className="absolute bottom-2 left-14 right-4 h-px bg-[#287ab9]/30" />
            </button>
          </div>

          {feedback && (
            <p
              role="alert"
              className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {feedback}
            </p>
          )}

          {isLoading ? (
            <div
              role="status"
              className="border-2 border-dashed border-sky-300 bg-[#fffdf8] p-10 text-center shadow-sm"
            >
              <p className="text-lg font-bold text-[#3986c7]">タスクを読み込んでいます…</p>
            </div>
          ) : loadError ? (
            <div
              role="alert"
              className="border-2 border-dashed border-red-300 bg-[#fffdf8] p-10 text-center shadow-sm"
            >
              <p className="text-lg font-bold text-red-700">{loadError}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 border-2 border-[#387ab5] bg-[#579bd9] px-5 py-2 font-bold text-white transition hover:bg-[#67a7df]"
              >
                再読み込み
              </button>
            </div>
          ) : (
            <TaskList
              tasks={tasks.filter((task) => !task.completed)}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              pendingTaskIds={pendingTaskIds}
            />
          )}

          {!isLoading && !loadError && children}
        </section>
      </div>
    </main>
  )
}
