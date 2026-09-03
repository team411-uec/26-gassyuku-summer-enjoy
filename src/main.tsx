import { StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import { TaskList } from "./components/TaskList"
import { mockTasks } from "./mocks/tasks"
import type { Task } from "./types"
import "./style.css"

function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const handleToggle = (id: string, completed: boolean) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed } : task,
      ),
    )
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100)

  return (
    <main className="min-h-screen bg-[#eaf7fb] px-3 py-6 text-left sm:px-6">
      <div className="mx-auto max-w-3xl overflow-hidden bg-[#fffaf3] shadow-2xl">
        <header>
          {/* 左上から右下へ切り込む海の写真 */}
          <div className="relative h-48 bg-[#fffaf3] sm:h-64">
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 70%)",
              }}
            >
              <img
                src="/images/summer-sea.jpg"
                alt="夏の青い海"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent" />
            </div>

            <div className="absolute right-5 top-5 rotate-3 bg-white/90 px-3 py-1.5 text-sm font-bold tracking-widest text-[#377fbf] shadow-md">
              SUMMER PASS
            </div>
          </div>

          {/* 左側にぴったり接続したタイトル帯 */}
          <div className="relative -mt-10 pr-3 sm:-mt-14 sm:pr-6">
            <div
              className="relative flex min-h-24 items-center bg-[#5798d9] px-5 pr-28 shadow-lg sm:min-h-32 sm:px-8 sm:pr-36"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 91% 50%, 100% 100%, 0 100%)",
              }}
            >
              <div>
                <p className="mb-1 text-sm font-bold tracking-[0.2em] text-white/80 sm:text-base">
                  MAKE YOUR SUMMER
                </p>

                <h1 className="m-0 whitespace-nowrap font-serif text-[2.65rem] font-black leading-none tracking-tight text-white drop-shadow-sm sm:text-[5rem]">
                Summer Enjoy!
                </h1>
              </div>
            </div>

            {/* 帯の上に貼った黄色いシール */}
            <div className="absolute right-6 top-1/2 h-24 w-24 -translate-y-1/2 rotate-6 sm:right-10 sm:h-32 sm:w-32">
              <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-full bg-white shadow-lg" />

              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-[#ffd527] text-center text-[#2382bd] ring-[5px] ring-white">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-white" />

                <span className="relative text-xs font-black tracking-widest sm:text-sm">
                  ENJOY!
                </span>

                <span className="relative text-3xl leading-none sm:text-4xl">
                  ☀
                </span>

                <span className="relative text-[11px] font-bold sm:text-xs">
                  SUMMER 2026
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="px-4 pb-12 pt-10 sm:px-9 sm:pt-12">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-black tracking-[0.2em] text-[#e59a35]">
                YOUR SUMMER TICKETS
              </p>

              <h2 className="m-0 text-3xl font-black text-[#286fae] sm:text-4xl">
                夏の予定一覧
              </h2>

              <p className="mt-3 text-base leading-relaxed text-slate-600">
                行きたい夏にチェックを入れて、
                <br className="sm:hidden" />
                思い出を集めましょう。
              </p>
            </div>
          </div>

          <TaskList tasks={tasks} onToggle={handleToggle} />
        </section>
      </div>
    </main>
  )
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)