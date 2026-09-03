import type { Task } from "../types";
import { useState, type FormEvent } from "react";

interface TaskFormProps {
  /** points は AI が内容から見積もるため、フォームからは渡さない。 */
  onSubmit: (task: Omit<Task, "id" | "points">) => void | Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !date) {
      setError("タイトルと日付は必須です");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: trimmedTitle,
        description: trimmedDescription || undefined,
        date,
        completed: false,
      });

      setTitle("");
      setDescription("");
      setDate("");
    } catch (submitError) {
      console.error("タスクの登録に失敗しました", submitError);
      setError("タスクを登録できませんでした。入力内容を確認して、もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden border-2 border-sky-200 bg-[#fffefa] shadow-[0_8px_22px_rgba(45,93,126,0.14)]"
    >
      {/* フォームの見出し */}
      <div className="relative border-b-2 border-dashed border-sky-200 px-5 pb-5 pt-6 sm:px-7">
        <p
          className="font-black tracking-[0.2em]"
          style={{
            margin: "0 0 8px",
            color: "#e59a35",
            fontSize: "13px",
          }}
        >
          NEW SUMMER RESERVATION
        </p>

        <div
          className="flex min-h-12 items-center justify-center bg-[#579bd9] px-12"
          style={{
            clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: 900,
              lineHeight: 1.2,
            }}
          >
            新しい夏を予約する
          </p>
        </div>

        <p className="mt-3 text-slate-600" style={{ fontSize: "15px" }}>
          この夏にやってみたいことを、1枚の切符にしましょう。
        </p>
      </div>

      {/* 入力欄 */}
      <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
        <div className="sm:col-span-1">
          <label
            htmlFor="task-title"
            className="mb-2 block font-bold tracking-wide text-slate-600"
            style={{ fontSize: "14px" }}
          >
            タイトル
            <span className="ml-2 text-xs font-black text-orange-500">REQUIRED</span>
          </label>

          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            aria-invalid={Boolean(error && !title.trim())}
            placeholder="例：海で泳ぐ"
            className="w-full border-2 border-sky-100 bg-[#f8fcff] px-4 py-3 text-base text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#579bd9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(87,155,217,0.12)]"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="task-date"
            className="mb-2 block font-bold tracking-wide text-slate-600"
            style={{ fontSize: "14px" }}
          >
            出発日
            <span className="ml-2 text-xs font-black text-orange-500">REQUIRED</span>
          </label>

          <div className="relative">
            <input
              id="task-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="w-full border-2 border-sky-100 bg-[#f8fcff] px-4 py-3 pr-12 text-base text-slate-700 outline-none transition [color-scheme:light] focus:border-[#579bd9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(87,155,217,0.12)] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:h-7 [&::-webkit-calendar-picker-indicator]:w-7 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            />

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#579bd9]"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" />
              <path d="M8 14h2M14 14h2M8 17h2M14 17h2" />
            </svg>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="task-description"
            className="mb-2 block font-bold tracking-wide text-slate-600"
            style={{ fontSize: "14px" }}
          >
            旅のメモ
            <span className="ml-2 text-xs font-medium text-slate-400">OPTIONAL</span>
          </label>

          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="例：友達と海に行って、夏らしい写真を撮る"
            rows={3}
            className="w-full resize-y border-2 border-sky-100 bg-[#f8fcff] px-4 py-3 text-base leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-[#579bd9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(87,155,217,0.12)]"
          />
        </div>
      </div>

      {/* 送信部分 */}
      <div className="flex flex-col gap-4 border-t-2 border-dashed border-sky-200 bg-[#f7fbfd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="font-mono text-xs font-black tracking-[0.18em] text-[#579bd9]">
            SUMMER TICKET OFFICE
          </p>

          <p className="mt-1 text-sm text-slate-500">入力した内容で新しい切符を発行します。</p>
        </div>

        {error && (
          <p role="alert" className="text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative cursor-pointer overflow-hidden border-2 border-[#387ab5] bg-[#579bd9] px-7 py-3 font-black text-white shadow-[3px_3px_0_#387ab5] transition hover:-translate-y-0.5 hover:bg-[#72afe3] hover:shadow-[4px_5px_0_#387ab5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="mr-2">＋</span>
          {isSubmitting ? "発行中…" : "夏の切符を発行"}
        </button>
      </div>
    </form>
  );
}
