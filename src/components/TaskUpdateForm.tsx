import {
  useEffect,
  useState,
  type FormEvent,
} from "react"
import type { Task } from "../types"

interface TaskUpdateFormProps {
  initialData: Task
  onSubmit: (
    taskId: string,
    updatedFields: Partial<Omit<Task, "id">>,
  ) => void
  onCancel?: () => void
}

export function TaskUpdateForm({
  initialData,
  onSubmit,
  onCancel,
}: TaskUpdateFormProps) {
  const [title, setTitle] = useState(initialData.title)
  const [description, setDescription] = useState(
    initialData.description ?? "",
  )
  const [date, setDate] = useState(initialData.date)

  /*
   * 別のタスクが渡されたとき、
   * 入力欄を新しいタスクの内容に更新します。
   */
  useEffect(() => {
    setTitle(initialData.title)
    setDescription(initialData.description ?? "")
    setDate(initialData.date)
  }, [
    initialData.id,
    initialData.title,
    initialData.description,
    initialData.date,
  ])

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!title.trim() || !date) {
      alert("タイトルと日付は必須です")
      return
    }

    /*
     * completedとpointsは変更しません。
     * このフォームで編集した項目だけを親へ渡します。
     */
    onSubmit(initialData.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden border-2 border-sky-200 bg-[#fffefa] text-left shadow-[0_10px_28px_rgba(45,93,126,0.16)]"
    >
      {/* 切符らしい左右の半円 */}
      <div className="absolute -left-3 top-1/2 z-20 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#eaf7fb]" />

      <div className="absolute -right-3 top-1/2 z-20 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#eaf7fb]" />

      {/* フォーム上部 */}
      <div className="relative border-b-2 border-dashed border-sky-200 px-5 pb-5 pt-6 sm:px-7">
        <div className="mb-3 flex flex-wrap items-start gap-3">
          {/* チケット情報 */}
          <div className="min-w-0 flex-1">
            <p
              className="font-mono font-black tracking-[0.2em]"
              style={{
                margin: 0,
                color: "#e59a35",
                fontSize: "12px",
              }}
            >
              TICKET REVISION
            </p>

            <p className="mt-1 font-mono text-[10px] font-bold tracking-wider text-slate-400">
              TICKET No. {initialData.id.toUpperCase()}
            </p>
          </div>

          {/* EDITINGとCLOSEを同じ箱で管理 */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap border border-[#579bd9] px-2 py-1 font-mono text-[9px] font-bold tracking-[0.15em] text-[#579bd9]">
              EDITING
            </span>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                aria-label="更新フォームを閉じる"
                className="flex h-8 items-center justify-center gap-1.5 border border-slate-300 bg-white/85 px-3 text-slate-400 transition hover:border-slate-400 hover:bg-white hover:text-slate-600"
              >
                <span className="text-lg leading-none">
                  ×
                </span>

                <span className="font-mono text-[9px] font-bold tracking-wider">
                  CLOSE
                </span>
              </button>
            )}
          </div>
        </div>

        {/* 両端がしっぽになった帯 */}
        <div
          className="flex min-h-14 items-center justify-center bg-[#579bd9] px-12"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "clamp(21px, 4vw, 29px)",
              fontWeight: 900,
              lineHeight: 1.2,
            }}
          >
            夏の予定を書き直す
          </h2>
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          発行済みの切符を、新しい内容に書き換えます。
        </p>
      </div>

      {/* 入力欄 */}
      <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
        {/* タイトル */}
        <div>
          <label
            htmlFor="update-task-title"
            className="mb-2 block text-sm font-bold tracking-wide text-slate-600"
          >
            タイトル

            <span className="ml-2 text-xs font-black text-orange-500">
              REQUIRED
            </span>
          </label>

          <input
            id="update-task-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="例：海で泳ぐ"
            autoComplete="off"
            className="w-full border-2 border-sky-100 bg-[#f8fcff] px-4 py-3 text-base text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#579bd9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(87,155,217,0.12)]"
          />
        </div>

        {/* 日付 */}
        <div>
          <label
            htmlFor="update-task-date"
            className="mb-2 block text-sm font-bold tracking-wide text-slate-600"
          >
            出発日

            <span className="ml-2 text-xs font-black text-orange-500">
              REQUIRED
            </span>
          </label>

          <div className="relative">
            <input
              id="update-task-date"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              className="w-full border-2 border-sky-100 bg-[#f8fcff] px-4 py-3 pr-12 text-base text-slate-700 outline-none transition [color-scheme:light] focus:border-[#579bd9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(87,155,217,0.12)] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:h-7 [&::-webkit-calendar-picker-indicator]:w-7 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            />

            {/* 表示用カレンダーアイコン */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#579bd9]"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
              />

              <path d="M8 3v4M16 3v4M3 10h18" />

              <path d="M8 14h2M14 14h2M8 17h2M14 17h2" />
            </svg>
          </div>
        </div>

        {/* 説明 */}
        <div className="sm:col-span-2">
          <label
            htmlFor="update-task-description"
            className="mb-2 block text-sm font-bold tracking-wide text-slate-600"
          >
            旅のメモ

            <span className="ml-2 text-xs font-medium text-slate-400">
              OPTIONAL
            </span>
          </label>

          <textarea
            id="update-task-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="例：友達と海に行って、夏らしい写真を撮る"
            rows={4}
            className="w-full resize-y border-2 border-sky-100 bg-[#f8fcff] px-4 py-3 text-base leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#579bd9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(87,155,217,0.12)]"
          />
        </div>
      </div>

      {/* フォーム下部 */}
      <div className="flex flex-col gap-4 border-t-2 border-dashed border-sky-200 bg-[#f7fbfd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="m-0 font-mono text-xs font-black tracking-[0.18em] text-[#579bd9]">
            SUMMER TICKET OFFICE
          </p>

          <p className="mt-1 text-sm text-slate-500">
            内容を確認して、切符を再発行してください。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* キャンセル */}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700"
            >
              キャンセル
            </button>
          )}

          {/* 更新 */}
          <button
            type="submit"
            className="group relative cursor-pointer overflow-hidden border-2 border-[#387ab5] bg-[#579bd9] px-7 py-3 font-black text-white shadow-[3px_3px_0_#387ab5] transition hover:-translate-y-0.5 hover:bg-[#72afe3] hover:shadow-[4px_5px_0_#387ab5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <span className="mr-2 inline-block transition group-hover:rotate-180">
              ↻
            </span>

            変更した切符を再発行
          </button>
        </div>
      </div>
    </form>
  )
}