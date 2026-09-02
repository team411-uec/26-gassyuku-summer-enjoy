import type { Task } from "../types"

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "海で泳ぐ",
    description: "友達と海に行って、夏らしい写真を撮る",
    date: "2026-08-10",
    completed: false,
  },
  {
    id: "task-2",
    title: "かき氷を食べる",
    date: "2026-08-12",
    completed: true,
  },
  {
    id: "task-3",
    title: "花火大会に行く",
    description: "近所の花火大会で夏を感じる",
    date: "2026-08-16",
    completed: false,
  },
  {
    id: "task-4",
    title: "夕方に散歩する",
    date: "2026-08-20",
    completed: true,
  },
  {
    id: "task-5",
    title: "そうめんを食べる",
    date: "2026-08-22",
    completed: false,
  },
]
