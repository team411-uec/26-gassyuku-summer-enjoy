import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore/lite";
import type { Task } from "../types";
import { db } from "./firebase";

const usersCollection = collection(db, "users");

export interface RankingEntry {
  id: string;
  score: number;
  rank: number | null;
  isCurrentUser: boolean;
}

export interface RankingResult {
  entries: RankingEntry[];
  currentUser: RankingEntry | null;
}

function isValidScore(score: unknown): score is number {
  return typeof score === "number" && Number.isInteger(score) && score >= 0;
}

/** 完了済みタスクのポイント合計。古いタスクや不正な値は 0 として扱う。 */
export function completedTaskScore(tasks: Pick<Task, "completed" | "points">[]): number {
  return tasks.reduce(
    (score, task) => score + (task.completed && isValidScore(task.points) ? task.points : 0),
    0,
  );
}

/** タスク一覧から自分のスコアを再計算する。初回作成と再同期の両方に使える。 */
export async function syncUserScore(
  userId: string,
  tasks: Pick<Task, "completed" | "points">[],
): Promise<number> {
  const score = completedTaskScore(tasks);
  await setDoc(doc(usersCollection, userId), { score }, { merge: true });
  return score;
}

export async function getUserRanking(currentUserId?: string): Promise<RankingResult> {
  const snapshot = await getDocs(query(usersCollection, orderBy("score", "desc"), limit(10)));
  const entries = snapshot.docs
    .flatMap((user) => {
      const score = user.data().score;
      return isValidScore(score)
        ? [{ id: user.id, score, rank: null, isCurrentUser: user.id === currentUserId }]
        : [];
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  if (!currentUserId) return { entries, currentUser: null };

  const listedUser = entries.find((entry) => entry.isCurrentUser) ?? null;
  if (listedUser) return { entries, currentUser: listedUser };

  const currentUserSnapshot = await getDoc(doc(usersCollection, currentUserId));
  const currentScore = currentUserSnapshot.data()?.score;
  if (!isValidScore(currentScore)) return { entries, currentUser: null };

  // ponytail: 圏外順位は全参加者を走査。人数が増えたら count 集計へ置き換える。
  const aheadSnapshot = await getDocs(query(usersCollection, where("score", ">", currentScore)));
  const rank = aheadSnapshot.docs.filter((user) => isValidScore(user.data().score)).length + 1;
  const currentUser = { id: currentUserId, score: currentScore, rank, isCurrentUser: true };

  return { entries, currentUser };
}

export function maskUserId(userId: string): string {
  return userId.length <= 8 ? "••••" : `${userId.slice(0, 4)}…${userId.slice(-4)}`;
}
