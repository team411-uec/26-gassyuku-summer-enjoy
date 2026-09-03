import {
  addDoc,
  getDocs,
  collection,
  doc,
  getDoc,
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

export const changeIsCompletedTask = async (userId: string, taskId: string) :Promise<void>=> {
  const taskSnap = await getDoc(doc(db, "users", userId, "tasks", taskId))

  if(taskSnap.exists()) return
  
  const isCompletedTask: boolean = taskSnap.data()?.completed
  updateTask(userId, taskId, {completed: !isCompletedTask})
  
}
