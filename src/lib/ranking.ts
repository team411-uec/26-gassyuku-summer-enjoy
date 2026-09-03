import { getDoc,doc,updateDoc } from "firebase/firestore/lite";
import { db } from "./firebase";


export const updateUsersScore = async (userId: string,taskScore: number) => {

  const userSnap = await getDoc(doc(db, "users", userId))
  if (!userSnap.exists()) return

  const nowScore:number = userSnap.data()?.score

  await updateDoc(doc(db, "users", userId), { score: nowScore + taskScore })
}
