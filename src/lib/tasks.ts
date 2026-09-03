import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore"
import type { Task } from "../types"
import { db } from "./firebase"

const tasksCollection = (userId: string) =>
  collection(db, "users", userId, "tasks")

export async function getTasks(userId: string): Promise<Task[]> {
  const snapshot = await getDocs(
    query(tasksCollection(userId), orderBy("date", "asc")),
  )

  return snapshot.docs.map((task) => ({
    ...task.data(),
    id: task.id,
  })) as Task[]
}

export async function addTask(
  userId: string,
  task: Omit<Task, "id">,
): Promise<string> {
  const { description, ...data } = task
  const snapshot = await addDoc(tasksCollection(userId), {
    ...data,
    ...(description === undefined ? {} : { description }),
  })

  return snapshot.id
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: Partial<Omit<Task, "id">>,
): Promise<void> {
  await updateDoc(doc(db, "users", userId, "tasks", taskId), data)
}

export async function deleteTask(
  userId: string,
  taskId: string,
): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "tasks", taskId))
}
