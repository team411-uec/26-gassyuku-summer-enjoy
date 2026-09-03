import type { Task } from "../types";
import { useState } from "react";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void;
}

const stampShape =
  "polygon(50% 0%, 61.4% 7.5%, 75% 6.7%, 81.1% 18.9%, 93.3% 25%, 92.5% 38.6%, 100% 50%, 92.5% 61.4%, 93.3% 75%, 81.1% 81.1%, 75% 93.3%, 61.4% 92.5%, 50% 100%, 38.6% 92.5%, 25% 93.3%, 18.9% 81.1%, 6.7% 75%, 7.5% 61.4%, 0% 50%, 7.5% 38.6%, 6.7% 25%, 18.9% 18.9%, 25% 6.7%, 38.6% 7.5%)";

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isIssued, setIsIssued] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (!title || !date) {
          alert("タイトルと日付は必須です");
          return;
        }

        onSubmit({
          title,
          description: description || undefined,
          points: 0,
          date,
          completed: false,
        });

        setIsIssued(true);

        window.setTimeout(() => {
          setIsIssued(false);
        }, 3000);

        setTitle("");
        setDescription("");
        setDate("");
      }}
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
            clipPath:
              "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
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
            <span className="ml-2 text-xs font-black text-orange-500">
              REQUIRED
            </span>
          </label>

          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
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
            <span className="ml-2 text-xs font-black text-orange-500">
              REQUIRED
            </span>
          </label>

          <div className="relative">
            <input
              id="task-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
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
            <span className="ml-2 text-xs font-medium text-slate-400">
              OPTIONAL
            </span>
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

          <p className="mt-1 text-sm text-slate-500">
            入力した内容で新しい切符を発行します。
          </p>
        </div>

        <button
          type="submit"
          className="relative cursor-pointer overflow-hidden border-2 border-[#387ab5] bg-[#579bd9] px-7 py-3 font-black text-white shadow-[3px_3px_0_#387ab5] transition hover:-translate-y-0.5 hover:bg-[#72afe3] hover:shadow-[4px_5px_0_#387ab5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <span className="mr-2">＋</span>
          夏の切符を発行
        </button>
      </div>

      {/* 発行時に表示する大きなスタンプ */}
      {isIssued && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 left-40 z-30 h-44 w-44 -rotate-12 text-[#3f7894] sm:bottom-5 sm:left-auto sm:right-[0px] sm:h-52 sm:w-52"
          style={{
            filter: "drop-shadow(3px 4px 0 rgba(63, 121, 148, 0.16))",
          }}
        >
          {/* ギザギザした外周 */}
          <div
            className="absolute inset-0 bg-[#3f7894]"
            style={{ clipPath: stampShape }}
          >
            {/* 中央を紙色で抜いて線だけに見せる */}
            <div
              className="absolute inset-[5px] bg-[#f7fbfd]"
              style={{ clipPath: stampShape }}
            />
          </div>

          {/* 内側の二重円 */}
          <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full border-[3px] border-[#3f7894] text-center sm:inset-[22px]">
            <div className="absolute inset-[6px] rounded-full border-2 border-[#3f7894]" />

            <span
              className="relative leading-none"
              style={{ fontSize: "clamp(28px, 5vw, 42px)" }}
            >
              ✈︎
            </span>

            <span
              className="relative mt-2 font-black tracking-[0.12em]"
              style={{ fontSize: "clamp(20px, 4vw, 28px)" }}
            >
              ISSUED
            </span>

            <span
              className="relative mt-1 font-bold tracking-[0.15em]"
              style={{ fontSize: "clamp(9px, 1.8vw, 13px)" }}
            >
              SUMMER 2026
            </span>
          </div>
        </div>
      )}
    </form>
  );
}
