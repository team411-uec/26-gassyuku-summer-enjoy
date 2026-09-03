import { useEffect, useState } from "react";
import { Ichiran } from "./ichiran";
import { TaskForm } from "./TaskForm";
import { TaskUpdateForm } from "./TaskUpdateForm";
import type { Task } from "../types";
import { estimateTaskPoints } from "../lib/ai";
import { loginAnonymously } from "../lib/auth";
import { addTask, getTasks, updateTask } from "../lib/tasks";

export const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    async function loadTasks() {
      const user = await loginAnonymously();
      setUserId(user.uid);
      setTasks(await getTasks(user.uid));
    }

    void loadTasks();
  }, []);

  const handleToggle = (id: string, completed: boolean) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, completed } : task)),
    );

    if (userId) void updateTask(userId, id, { completed });
  };

  const handleAddTask = async (newTask: Omit<Task, "id" | "points">) => {
    if (!userId) return;

    // ポイントは内容に応じて AI が決める。失敗しても既定値が返るので登録は止まらない。
    const points = await estimateTaskPoints(newTask);
    const task = { ...newTask, points };

    const id = await addTask(userId, task);
    setTasks((currentTasks) => [...currentTasks, { ...task, id }]);
  };

  const handleUpdate = async (taskId: string, updatedFields: Partial<Omit<Task, "id">>) => {
    if (!userId) return;

    await updateTask(userId, taskId, updatedFields);
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, ...updatedFields } : task)),
    );
    setEditingTask(null);
  };

  const closeUpdateForm = () => {
    setEditingTask(null);
  };

  const openTaskForm = () => {
    setIsTaskFormVisible(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormVisible(false);
  };

  return (
    <>
      <Ichiran
        tasks={tasks}
        onToggle={handleToggle}
        onEdit={setEditingTask}
        onOpenTaskForm={openTaskForm}
      />

      {isTaskFormVisible && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="新しい夏を登録"
          onClick={closeTaskForm}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-3 backdrop-blur-sm sm:p-6"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[94vh] w-full max-w-3xl overflow-y-auto shadow-[0_24px_70px_rgba(15,45,65,0.4)]"
          >
            <button
              type="button"
              onClick={() => setIsTaskFormVisible(false)}
              aria-label="登録フォームを閉じる"
              className="absolute right-3 top-3 z-40 flex h-8 w-14 items-center justify-center border border-slate-300 bg-white/80 text-xl font-normal leading-none text-slate-400 transition hover:border-slate-400 hover:bg-white hover:text-slate-600"
            >
              ×
            </button>

            <TaskForm onSubmit={handleAddTask} />
          </div>
        </div>
      )}

      {editingTask && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${editingTask.title}の編集`}
          onClick={closeUpdateForm}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/45 px-4 py-8"
        >
          <div className="relative w-full max-w-3xl" onClick={(event) => event.stopPropagation()}>
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
  );
};
