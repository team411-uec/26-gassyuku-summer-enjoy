import type { Task } from "../types";
import { useState } from "react";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!title || !date) {
          alert("タイトルと日付は必須です");
          return;
        }

        onSubmit({
          title,
          description: description || undefined,
          date,
          completed: false,
        });

        setTitle("");
        setDescription("");
        setDate("");
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
        タスクを追加
      </button>
    </form>
  );
}
