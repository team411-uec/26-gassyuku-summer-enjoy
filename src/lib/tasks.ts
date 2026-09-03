import {
  addDoc,
  getDocs,
  collection,
  doc,
  orderBy,
  query,
  runTransaction,
  updateDoc,
} from "firebase/firestore/lite";
import type { Task } from "../types";
import { db } from "./firebase";

const tasksCollection = (userId: string) => collection(db, "users", userId, "tasks");

export async function getTasks(userId: string): Promise<Task[]> {
  const snapshot = await getDocs(query(tasksCollection(userId), orderBy("date", "asc")));

  return snapshot.docs.map((task) => ({
    ...task.data(),
    id: task.id,
  })) as Task[];
}

export async function addTask(userId: string, task: Omit<Task, "id">): Promise<string> {
  const { description, ...data } = task;
  const snapshot = await addDoc(tasksCollection(userId), {
    ...data,
    ...(description === undefined ? {} : { description }),
  });

  return snapshot.id;
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: Partial<Omit<Task, "id">>,
): Promise<void> {
  await updateDoc(doc(db, "users", userId, "tasks", taskId), data);
}

function taskPoints(points: unknown): number {
  return typeof points === "number" && Number.isInteger(points) && points >= 0 ? points : 0;
}

function userScore(score: unknown): number {
  return typeof score === "number" && Number.isInteger(score) && score >= 0 ? score : 0;
}

export interface TaskCompletionResult {
  changed: boolean;
  points: number;
}

/** タスクの完了状態とユーザースコアを1トランザクションで変更する。 */
export async function setTaskCompletedAndScore(
  userId: string,
  taskId: string,
  completed: boolean,
): Promise<TaskCompletionResult> {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  const userRef = doc(db, "users", userId);

  return runTransaction(db, async (transaction) => {
    const taskSnapshot = await transaction.get(taskRef);
    if (!taskSnapshot.exists() || taskSnapshot.data().completed === completed) {
      return { changed: false, points: 0 };
    }

    const points = taskPoints(taskSnapshot.data().points);
    const userSnapshot = await transaction.get(userRef);
    const score = userScore(userSnapshot.data()?.score);
    const nextScore = Math.max(0, score + (completed ? points : -points));

    transaction.update(taskRef, { completed });
    transaction.set(userRef, { score: nextScore }, { merge: true });
    return { changed: true, points };
  });
}

/** タスク削除と、完了済みタスクのスコア減算を1トランザクションで行う。 */
export async function deleteTask(
  userId: string,
  taskId: string,
): Promise<{ wasCompleted: boolean; points: number }> {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  const userRef = doc(db, "users", userId);

  return runTransaction(db, async (transaction) => {
    const taskSnapshot = await transaction.get(taskRef);
    if (!taskSnapshot.exists()) return { wasCompleted: false, points: 0 };

    const data = taskSnapshot.data();
    const wasCompleted = data.completed === true;
    const points = wasCompleted ? taskPoints(data.points) : 0;
    const userSnapshot = wasCompleted ? await transaction.get(userRef) : null;
    const score = userSnapshot ? userScore(userSnapshot.data()?.score) : 0;

    transaction.delete(taskRef);
    if (wasCompleted) {
      transaction.set(userRef, { score: Math.max(0, score - points) }, { merge: true });
    }

    return { wasCompleted, points };
  });
}
