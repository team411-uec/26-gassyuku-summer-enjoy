import { useId, useState } from "react";
import { toDueDate, type Suggestion } from "../lib/ai";
import type { Task } from "../types";

export type TaskSuggestionData = Suggestion | Omit<Task, "id">;

export interface TaskSuggestionProps {
  suggestion?: TaskSuggestionData | null;
  isLoading?: boolean;
  error?: string | null;
  onAdd: (suggestion: TaskSuggestionData) => void | Promise<void>;
  onDismiss: () => void;
}

const stampShape =
  "polygon(50% 0%, 61.4% 7.5%, 75% 6.7%, 81.1% 18.9%, 93.3% 25%, 92.5% 38.6%, 100% 50%, 92.5% 61.4%, 93.3% 75%, 81.1% 81.1%, 75% 93.3%, 61.4% 92.5%, 50% 100%, 38.6% 92.5%, 25% 93.3%, 18.9% 81.1%, 6.7% 75%, 7.5% 61.4%, 0% 50%, 7.5% 38.6%, 6.7% 25%, 18.9% 18.9%, 25% 6.7%, 38.6% 7.5%)";

function isReadyTask(data: TaskSuggestionData): data is Omit<Task, "id"> {
  return "date" in data;
}

export function TaskSuggestion({
  suggestion,
  isLoading = false,
  error = null,
  onAdd,
  onDismiss,
}: TaskSuggestionProps) {
  const headingId = useId();
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  if (isLoading && !suggestion) {
    return (
      <section
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="border-2 border-dashed border-sky-300 bg-[#fffdf8] p-6 text-center shadow-[0_6px_16px_rgba(45,93,126,0.1)] sm:p-8"
      >
        <p className="font-mono text-xs font-black tracking-[0.18em] text-[#e59a35]">
          AI SUMMER SUGGESTION
        </p>
        <p className="mt-2 text-base font-bold text-[#3986c7]">次の夏の切符を考えています…</p>
      </section>
    );
  }

  if (!suggestion) {
    if (!error) return null;

    return (
      <section
        role="alert"
        aria-live="assertive"
        className="border-2 border-dashed border-red-300 bg-[#fffdf8] p-6 text-left shadow-[0_6px_16px_rgba(45,93,126,0.1)] sm:p-8"
      >
        <p className="font-mono text-xs font-black tracking-[0.18em] text-red-500">
          AI SUMMER SUGGESTION
        </p>
        <p className="mt-2 font-bold leading-relaxed text-red-700">{error}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-4 border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d79f00]"
        >
          今回は見送る
        </button>
      </section>
    );
  }

  const title = suggestion.title;
  const description = suggestion.description;
  const departure = isReadyTask(suggestion) ? suggestion.date : toDueDate(suggestion.daysAhead);
  const points = suggestion.points ?? 0;
  const visibleError = addError ?? error;

  const handleAdd = async () => {
    if (isAdding || isLoading) return;

    setIsAdding(true);
    setAddError(null);
    try {
      await onAdd(suggestion);
    } catch (addTaskError) {
      console.error("提案タスクの登録に失敗しました", addTaskError);
      setAddError("タスクを追加できませんでした。もう一度お試しください。");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      aria-busy={isLoading || isAdding}
      className="relative overflow-hidden border-2 border-sky-200 bg-[#fffefa] text-left shadow-[0_8px_22px_rgba(45,93,126,0.14)]"
    >
      <div className="absolute -left-3 top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#eaf7fb]" />
      <div className="absolute -right-3 top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full border border-sky-200 bg-[#eaf7fb]" />

      <div className="relative border-b-2 border-dashed border-sky-200 px-5 pb-5 pt-6 sm:px-7">
        <div className="pr-20 sm:pr-24">
          <p className="font-mono text-xs font-black tracking-[0.2em] text-[#e59a35]">
            AI SUMMER SUGGESTION
          </p>
          <p className="mt-1 font-mono text-[10px] font-bold tracking-wider text-slate-400">
            NEXT SUMMER TICKET
          </p>
        </div>

        <div
          aria-hidden="true"
          className="absolute right-4 top-4 h-16 w-16 rotate-6 text-[#d79f00] sm:right-6 sm:h-20 sm:w-20"
        >
          <div className="absolute inset-0 bg-[#d79f00]" style={{ clipPath: stampShape }}>
            <div className="absolute inset-[3px] bg-[#fffefa]" style={{ clipPath: stampShape }} />
          </div>
          <div className="absolute inset-[8px] flex items-center justify-center rounded-full border-2 border-[#d79f00] text-center font-mono text-[8px] font-black leading-tight tracking-wide sm:inset-[10px] sm:text-[9px]">
            AI PICK
          </div>
        </div>

        <div
          className="mt-4 flex min-h-14 items-center bg-[#579bd9] px-5 pr-10 text-white sm:px-7"
          style={{ clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)" }}
        >
          <h2 id={headingId} className="m-0 text-xl font-black leading-tight sm:text-2xl">
            {title}
          </h2>
        </div>

        {description && <p className="mt-4 leading-7 text-slate-700">{description}</p>}
      </div>

      <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-7">
        <div className="border-l-4 border-[#579bd9] pl-3">
          <p className="font-mono text-[10px] font-black tracking-[0.16em] text-slate-400">
            DEPARTURE
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-[#347fbd]">{departure}</p>
        </div>

        <div className="border-l-4 border-[#ffd323] pl-3">
          <p className="font-mono text-[10px] font-black tracking-[0.16em] text-slate-400">
            REWARD
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-[#b3820b]">{points} pt</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t-2 border-dashed border-sky-200 bg-[#f7fbfd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="min-w-0">
          <p className="font-mono text-xs font-black tracking-[0.18em] text-[#579bd9]">
            TICKET OFFICE
          </p>
          {visibleError ? (
            <p role="alert" className="mt-1 text-sm font-bold leading-relaxed text-red-700">
              {visibleError}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-500">気に入ったら、夏の予定に加えましょう。</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onDismiss}
            disabled={isAdding || isLoading}
            className="cursor-pointer border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d79f00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            今回は見送る
          </button>
          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={isAdding || isLoading}
            className="cursor-pointer border-2 border-[#387ab5] bg-[#579bd9] px-6 py-3 text-sm font-black text-white shadow-[3px_3px_0_#387ab5] transition hover:-translate-y-0.5 hover:bg-[#72afe3] hover:shadow-[4px_5px_0_#387ab5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d79f00] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAdding ? "追加中…" : "追加する"}
          </button>
        </div>
      </div>
    </section>
  );
}
