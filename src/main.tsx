import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { TaskList } from "./components/TaskList"
import { TaskUpdateForm } from "./components/TaskUpdateForm"
import { mockTasks } from "./mocks/tasks"
import type { Task } from "./types"
import "./style.css"

/*
 * 外側と内側の点を15度ごとに交互に配置した形です。
 * 12個のギザギザが等間隔に並びます。
 */
const stickerShape =
  "polygon(50% 0%, 61.4% 7.5%, 75% 6.7%, 81.1% 18.9%, 93.3% 25%, 92.5% 38.6%, 100% 50%, 92.5% 61.4%, 93.3% 75%, 81.1% 81.1%, 75% 93.3%, 61.4% 92.5%, 50% 100%, 38.6% 92.5%, 25% 93.3%, 18.9% 81.1%, 6.7% 75%, 7.5% 61.4%, 0% 50%, 7.5% 38.6%, 6.7% 25%, 18.9% 18.9%, 25% 6.7%, 38.6% 7.5%)"

function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleToggle = (
    id: string,
    completed: boolean,
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed } : task,
      ),
    )
  }

  const handleUpdate = (
    taskId: string,
    updatedFields: Partial<Omit<Task, "id">>,
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updatedFields }
          : task,
      ),
    )

    setEditingTask(null)
  }

  const closeUpdateForm = () => {
    setEditingTask(null)
  }

  return (
    <>
      <main className="min-h-screen bg-[#eaf7fb] px-3 py-6 text-left sm:px-6">
        <div className="mx-auto max-w-3xl overflow-hidden bg-[#fffaf3] shadow-2xl">
          <header>
            {/* 左上から右下へ切り込む海の写真 */}
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
                      fontSize: "clamp(13px, 2vw, 18px)",
                    }}
                  >
                    MAKE YOUR SUMMER
                  </p>

                  <h1
                    className="whitespace-nowrap font-serif tracking-tight drop-shadow-sm"
                    style={{
                      margin: 0,
                      color: "#ffffff",
                      fontSize: "clamp(42px, 7vw, 80px)",
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
                    "drop-shadow(4px 7px 5px rgba(45, 70, 90, 0.28))",
                }}
              >
                {/* 少しずれた白い台紙 */}
                <div
                  className="absolute inset-0 translate-x-1 translate-y-1 bg-white"
                  style={{
                    clipPath: stickerShape,
                  }}
                />

                {/* ギザギザした黄色いステッカー本体 */}
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
                        fontSize: "clamp(9px, 1.5vw, 13px)",
                      }}
                    >
                      TRAVEL
                    </span>

                    <span
                      className="font-serif font-black leading-none"
                      style={{
                        fontSize: "clamp(17px, 3vw, 28px)",
                      }}
                    >
                      ENJOY!
                    </span>

                    <span
                      className="my-0.5 leading-none"
                      style={{
                        fontSize: "clamp(23px, 4vw, 36px)",
                      }}
                    >
                      ☀
                    </span>

                    <span
                      className="font-bold tracking-wide"
                      style={{
                        fontSize: "clamp(8px, 1.3vw, 11px)",
                      }}
                    >
                      SUMMER 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="px-4 pb-12 pt-10 sm:px-9 sm:pt-12">
            <div className="mb-8">
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
                  fontSize: "clamp(30px, 4vw, 40px)",
                  fontWeight: 900,
                  lineHeight: 1.2,
                  opacity: 1,
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

            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={setEditingTask}
            />
          </section>
        </div>
      </main>

      {/* タスク更新フォーム */}
      {editingTask && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${editingTask.title}の編集`}
          onClick={closeUpdateForm}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/45 px-4 py-8"
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* 控えめな横長の閉じるボタン */}
            <button
              type="button"
              onClick={closeUpdateForm}
              aria-label="更新フォームを閉じる"
              className="absolute right-3 top-3 z-50 flex h-8 w-20 items-center justify-center gap-1.5 border border-slate-300 bg-white/85 text-slate-400 transition hover:border-slate-400 hover:bg-white hover:text-slate-600"
            >
              <span className="text-lg leading-none">×</span>

              <span className="font-mono text-[9px] font-bold tracking-wider">
                CLOSE
              </span>
            </button>

            <TaskUpdateForm
              key={editingTask.id}
              initialData={editingTask}
              onSubmit={handleUpdate}
              onCancel={closeUpdateForm}
            />
          </div>
        </div>
      )}
    </>
  )
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)