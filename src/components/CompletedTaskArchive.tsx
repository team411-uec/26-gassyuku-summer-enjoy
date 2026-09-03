import type { Task } from "../types";
import { TaskList } from "./TaskList";

interface CompletedTaskArchiveProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void | Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void | Promise<void>;
  pendingTaskIds: Set<string>;
}

export function CompletedTaskArchive({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  pendingTaskIds,
}: CompletedTaskArchiveProps) {
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <details open className="mt-10 border-t-2 border-dashed border-sky-200 pt-7">
      <summary className="flex cursor-pointer list-none items-end justify-between gap-4">
        <span>
          <span className="block font-black tracking-[0.2em] text-[#e59a35]">SUMMER ARCHIVE</span>

          <span className="mt-1 block text-2xl font-black text-slate-600 sm:text-3xl">
            思い出アーカイブ
          </span>
        </span>

        <span
          aria-label={`完了済み${completedTasks.length}件`}
          className="shrink-0 rounded-full border border-[#e6c56d] bg-[#fdf4de] px-3 py-1 font-mono text-sm font-black text-[#b3820b]"
        >
          {completedTasks.length}
        </span>
      </summary>

      <div className="mt-5">
        {completedTasks.length === 0 ? (
          <div className="border-2 border-dashed border-sky-300 bg-[#fffdf8] p-8 text-center shadow-sm sm:p-10">
            <p className="text-lg font-bold text-[#3986c7]">完了したタスクはありません</p>

            <p className="mt-2 text-sm text-slate-500">
              夏の思い出を集めると、ここに保存されます。
            </p>
          </div>
        ) : (
          <TaskList
            tasks={completedTasks}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            pendingTaskIds={pendingTaskIds}
          />
        )}
      </div>
    </details>
  );
}
