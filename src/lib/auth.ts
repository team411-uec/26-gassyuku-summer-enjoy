import { signInAnonymously, type User } from "firebase/auth";
import { auth } from "./firebase";

/**
 * 匿名でサインインし、ユーザーを返す。
 * すでにサインイン済みならそのユーザーをそのまま返す。
 * 読み込み直後の auth.currentUser は、セッションが残っていても復元が
 * 終わるまで null を返すため、authStateReady() で復元完了を待ってから判定する。
 */
export async function loginAnonymously(): Promise<User> {
  await auth.authStateReady();
  if (auth.currentUser) return auth.currentUser;

  const credential = await signInAnonymously(auth);
  return credential.user;
}
