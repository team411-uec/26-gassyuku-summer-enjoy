import { useEffect, useState } from "react";
import { CompletedTaskArchive } from "./CompletedTaskArchive";
import { Ichiran } from "./ichiran";
import { RankingBoard } from "./RankingBoard";
import { TaskForm } from "./TaskForm";
import { TaskGeneratedNotice } from "./TaskGeneratedNotice";
import { TaskSuggestion, type TaskSuggestionData } from "./TaskSuggestion";
import { TaskUpdateForm } from "./TaskUpdateForm";
import type { Task } from "../types";
import { estimateTaskPoints, suggestTask, toNewTask, type Suggestion } from "../lib/ai";
import { loginAnonymously } from "../lib/auth";
import { syncUserScore } from "../lib/ranking";
import { addTask, deleteTask, getTasks, setTaskCompletedAndScore, updateTask } from "../lib/tasks";

const sortTasks = (tasks: Task[]) => [...tasks].sort((a, b) => a.date.localeCompare(b.date));

export const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set());
  const [rankingRefreshKey, setRankingRefreshKey] = useState(0);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [noticeVisible, setNoticeVisible] = useState(false);

  useEffect(() => {
    if (!noticeVisible) return;

    const timeoutId = window.setTimeout(() => setNoticeVisible(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [noticeVisible]);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const user = await loginAnonymously();
        const loadedTasks = await getTasks(user.uid);

        try {
          await syncUserScore(user.uid, loadedTasks);
        } catch (scoreError) {
          console.error("ユーザースコアの同期に失敗しました", scoreError);
        }

        if (cancelled) return;

        setUserId(user.uid);
        setTasks(sortTasks(loadedTasks));
        setRankingRefreshKey((currentKey) => currentKey + 1);
      } catch (error) {
        console.error("タスクの読み込みに失敗しました", error);
        if (!cancelled) {
          setUserId(null);
          setLoadError("タスクを読み込めませんでした。もう一度お試しください。");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadTasks();
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const setTaskPending = (id: string, pending: boolean) => {
    setPendingTaskIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (pending) nextIds.add(id);
      else nextIds.delete(id);
      return nextIds;
    });
  };

  const handleToggle = async (id: string, completed: boolean) => {
    if (!userId || pendingTaskIds.has(id)) return;

    setTaskPending(id, true);
    setFeedback(null);
    try {
      const result = await setTaskCompletedAndScore(userId, id, completed);
      if (!result.changed) {
        setTasks((currentTasks) =>
          currentTasks.map((currentTask) =>
            currentTask.id === id ? { ...currentTask, completed } : currentTask,
          ),
        );
        return;
      }

      const task = tasks.find((currentTask) => currentTask.id === id);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === id ? { ...currentTask, completed } : currentTask,
        ),
      );
      setRankingRefreshKey((currentKey) => currentKey + 1);

      if (task && !task.completed && completed) {
        setSuggestion(null);
        setSuggestionError(null);
        setIsSuggestionLoading(true);
        void suggestTask(
          "done",
          task,
          tasks.map((currentTask) => currentTask.title),
        )
          .then((nextSuggestion) => {
            if (nextSuggestion) setSuggestion(nextSuggestion);
            else setSuggestionError("次の夏の提案を取得できませんでした。");
          })
          .catch((suggestionLoadError) => {
            console.error("タスクの提案に失敗しました", suggestionLoadError);
            setSuggestionError("次の夏の提案を取得できませんでした。");
          })
          .finally(() => setIsSuggestionLoading(false));
      }
    } catch (error) {
      console.error("タスクの更新に失敗しました", error);
      setFeedback("タスクを更新できませんでした。もう一度お試しください。");
    } finally {
      setTaskPending(id, false);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, "id" | "points">) => {
    if (!userId) throw new Error("ログインが必要です");

    // ポイントは内容に応じて AI が決める。失敗しても既定値が返るので登録は止まらない。
    const points = await estimateTaskPoints(newTask);
    const task = { ...newTask, points };

    const id = await addTask(userId, task);
    setTasks((currentTasks) => sortTasks([...currentTasks, { ...task, id }]));
    setNoticeVisible(true);
    setIsTaskFormVisible(false);
  };

  const handleUpdate = async (taskId: string, updatedFields: Partial<Omit<Task, "id">>) => {
    if (!userId) throw new Error("ログインが必要です");

    await updateTask(userId, taskId, updatedFields);
    setTasks((currentTasks) =>
      sortTasks(
        currentTasks.map((task) => (task.id === taskId ? { ...task, ...updatedFields } : task)),
      ),
    );
    setEditingTask(null);
  };

  const handleDelete = async (task: Task) => {
    if (!userId || pendingTaskIds.has(task.id)) return;

    setTaskPending(task.id, true);
    setFeedback(null);
    try {
      const result = await deleteTask(userId, task.id);
      setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id));
      if (result.wasCompleted) setRankingRefreshKey((currentKey) => currentKey + 1);
    } catch (error) {
      console.error("タスクの削除に失敗しました", error);
      setFeedback("タスクを削除できませんでした。もう一度お試しください。");
    } finally {
      setTaskPending(task.id, false);
    }
  };

  const handleAddSuggestedTask = async (suggestionData: TaskSuggestionData) => {
    if (!userId) throw new Error("ログインが必要です");

    const task = "date" in suggestionData ? suggestionData : toNewTask(suggestionData);
    const id = await addTask(userId, task);
    setTasks((currentTasks) => sortTasks([...currentTasks, { ...task, id }]));
    setSuggestion(null);
    setSuggestionError(null);
    setIsSuggestionLoading(false);
    setNoticeVisible(true);
  };

  const dismissSuggestion = () => {
    setSuggestion(null);
    setSuggestionError(null);
    setIsSuggestionLoading(false);
  };

  const closeUpdateForm = () => {
    setEditingTask(null);
  };

  const openTaskForm = () => {
    if (isLoading || loadError || !userId) return;
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
        onDelete={handleDelete}
        pendingTaskIds={pendingTaskIds}
        isLoading={isLoading}
        loadError={loadError}
        onRetry={() => setRetryKey((currentKey) => currentKey + 1)}
        feedback={feedback}
        onOpenTaskForm={openTaskForm}
      >
        {!isLoading && !loadError && (
          <div className="mt-6 space-y-6">
            <TaskGeneratedNotice
              visible={noticeVisible}
              onDismiss={() => setNoticeVisible(false)}
            />
            <TaskSuggestion
              suggestion={suggestion}
              isLoading={isSuggestionLoading}
              error={suggestionError}
              onAdd={handleAddSuggestedTask}
              onDismiss={dismissSuggestion}
            />
            <CompletedTaskArchive
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              pendingTaskIds={pendingTaskIds}
            />
            <RankingBoard userId={userId} refreshKey={rankingRefreshKey} />
          </div>
        )}
      </Ichiran>

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
