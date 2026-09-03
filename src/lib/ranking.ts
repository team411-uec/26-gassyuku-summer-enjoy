import { getDoc, doc, updateDoc, query, orderBy, getDocs } from "firebase/firestore/lite";
import { db } from "./firebase";
import { collection, limit } from "firebase/firestore/lite";

export const updateUsersScore = async (userId: string, taskScore: number) => {
  const userSnap = await getDoc(doc(db, "users", userId));
  if (!userSnap.exists()) return;

  const nowScore: number = userSnap.data().score === undefined ? 0 : userSnap.data().score;

  await updateDoc(doc(db, "users", userId), { score: nowScore + taskScore });
};

export const getUserRanking = async () => {
  const queryRanking = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
  const rankingSnap = await getDocs(queryRanking);
  return rankingSnap.docs;
};
