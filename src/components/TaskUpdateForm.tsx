import type { Task } from "../types";
import { useState } from "react";

interface TaskUpdateFormProps {
  initialData: Task;
  onSubmit: (taskId: string, updatedFields: Partial<Omit<Task, "id">>) => void;
  onCancel?: () => void;
}

export function TaskUpdateForm({
  initialData,
  onSubmit,
  onCancel,
}: TaskUpdateFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description ?? "");
  const [date, setDate] = useState(initialData.date);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!title || !date) {
          alert("タイトルと日付は必須です");
          return;
        }

        onSubmit(initialData.id, {
          title,
          description: description || undefined,
          date,
          completed: false,
        });
      }}
      className="flex flex-col gap-3 p-4 border rounded"
    >
      <div>
        <label className="block text-sm font-bold">タイトル（必須）</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-bold">説明</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-bold">日付（必須）</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-1 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        更新を保存
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 p-2 rounded"
        >
          キャンセル
        </button>
      )}
    </form>
  );
}
