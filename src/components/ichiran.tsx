import { TaskList } from "./TaskList"
import type { Task } from "../types"

interface IchiranProps {
  tasks: Task[]
  onToggle: (id: string, completed: boolean) => void
  onOpenTaskForm: () => void
}

const stickerShape =
  "polygon(50% 0%, 61.4% 7.5%, 75% 6.7%, 81.1% 18.9%, 93.3% 25%, 92.5% 38.6%, 100% 50%, 92.5% 61.4%, 93.3% 75%, 81.1% 81.1%, 75% 93.3%, 61.4% 92.5%, 50% 100%, 38.6% 92.5%, 25% 93.3%, 18.9% 81.1%, 6.7% 75%, 7.5% 61.4%, 0% 50%, 7.5% 38.6%, 6.7% 25%, 18.9% 18.9%, 25% 6.7%, 38.6% 7.5%)"

export function Ichiran({
  tasks,
  onToggle,
  onOpenTaskForm,
}: IchiranProps) {
  return (
    <main className="min-h-screen bg-[#eaf7fb] px-3 py-6 text-left sm:px-6">
      <div className="mx-auto max-w-3xl overflow-hidden bg-[#fffaf3] shadow-2xl">
        <header>
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

            <div
              className="absolute right-5 top-1/2 z-10 h-28 w-28 -translate-y-1/2 rotate-6 sm:right-9 sm:h-36 sm:w-36"
              style={{
                filter:
                  "drop-shadow(4px 7px 5px rgba(45,70,90,0.28))",
              }}
            >
              <div
                className="absolute inset-0 translate-x-1 translate-y-1 bg-white"
                style={{ clipPath: stickerShape }}
              />

              <div
                className="absolute inset-1 flex items-center justify-center bg-[#ffd323]"
                style={{ clipPath: stickerShape }}
              >
                <div className="absolute inset-[14%] rounded-full border-2 border-dashed border-white" />

                <div className="relative flex flex-col items-center justify-center text-center text-[#167bb8]">
                  <span
                    className="font-black tracking-[0.15em]"
                    style={{ fontSize: "clamp(9px, 1.5vw, 13px)" }}
                  >
                    TRAVEL
                  </span>

                  <span
                    className="font-serif font-black leading-none"
                    style={{ fontSize: "clamp(17px, 3vw, 28px)" }}
                  >
                    ENJOY!
                  </span>

                  <span
                    className="my-0.5 leading-none"
                    style={{ fontSize: "clamp(23px, 4vw, 36px)" }}
                  >
                    ☀
                  </span>

                  <span
                    className="font-bold tracking-wide"
                    style={{ fontSize: "clamp(8px, 1.3vw, 11px)" }}
                  >
                    SUMMER 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

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
                  fontSize: "clamp(30px, 4vw, 40px)",
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                夏の予定一覧
              </h2>

              <p
                className="mt-3 text-base leading-relaxed text-slate-600"
                style={{ fontSize: "16px" }}
              >
                行きたい夏にチェックを入れて、
                <br className="sm:hidden" />
                思い出を集めましょう。
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenTaskForm}
              className="group relative min-w-52 cursor-pointer overflow-hidden border-2 border-[#387ab5] bg-[#579bd9] px-5 py-3 text-left text-white shadow-[4px_4px_0_#387ab5] transition hover:-translate-y-1 hover:bg-[#67a7df] hover:shadow-[5px_6px_0_#387ab5] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#fffaf3]" />
              <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#fffaf3]" />

              <span className="flex items-center gap-3">
                {/* 白い丸＋黄色い十字 */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-black text-[#d79f00] shadow-sm transition group-hover:rotate-90">
                  ＋
                </span>

                <span>
                  <span className="block text-[10px] font-black tracking-[0.18em] text-white/75">
                    ISSUE A NEW TICKET
                  </span>

                  <span className="block text-base font-black">
                    新しい夏を追加
                  </span>
                </span>
              </span>
            </button>
          </div>

          <TaskList tasks={tasks} onToggle={onToggle} />
        </section>
      </div>
    </main>
  )
}