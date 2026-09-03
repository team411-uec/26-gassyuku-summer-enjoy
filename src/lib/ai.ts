import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  Schema,
} from "firebase/ai"
import type { Task } from "../types"
import { app } from "./firebase"

/** AI が提案するタスク。そのまま Task に変換して追加する。 */
export type Suggestion = {
  title: string
  description: string
  /** 実行までの日数。date に変換して使う。 */
  daysAhead: number
}

const MIN_DAYS_AHEAD = 1
const MAX_DAYS_AHEAD = 14

const suggestionSchema = Schema.object({
  properties: {
    title: Schema.string({
      description: "夏らしいタスクの短いタイトル。20文字以内。",
    }),
    description: Schema.string({
      description: "そのタスクの魅力が伝わる一文。40文字以内。",
    }),
    daysAhead: Schema.integer({
      description:
        "実行までの日数。思い立ってすぐできるものは 1、道具や場所の準備・人との予定合わせが必要なものほど大きくする。1 以上 14 以下。",
    }),
  },
})

const ai = getAI(app, { backend: new GoogleAIBackend() })

const model = getGenerativeModel(ai, {
  model: "gemini-3.7-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: suggestionSchema,
  },
})

const INSTRUCTION = {
  done: "ユーザーはこのタスクを達成しました。同じくらいの手間で楽しめる、関連した夏のタスクを 1 つ提案してください。",
  failed:
    "ユーザーはこのタスクを達成できませんでした。同じ楽しさを味わえて、準備・時間・費用の負担がより軽い代わりのタスクを 1 つ提案してください。",
} as const

function buildPrompt(
  mode: "done" | "failed",
  task: Pick<Task, "title" | "description">,
  existingTitles: string[],
): string {
  return [
    "あなたは夏の思い出づくりを応援するアシスタントです。",
    INSTRUCTION[mode],
    "",
    `対象のタスク: ${task.title}`,
    task.description ? `説明: ${task.description}` : "",
    "",
    "すでに登録されているタスク（重複した提案は避けてください）:",
    existingTitles.length > 0
      ? existingTitles.map((title) => `- ${title}`).join("\n")
      : "- （なし）",
  ]
    .filter((line) => line !== "")
    .join("\n")
}

/**
 * 完了・断念したタスクをもとに、次にやりたくなる夏タスクを 1 つ提案する。
 *
 * 提案はあくまで追加価値なので、失敗しても呼び出し元の処理を止めない。
 * エラーは握って null を返す。
 */
export async function suggestTask(
  mode: "done" | "failed",
  task: Pick<Task, "title" | "description">,
  existingTitles: string[],
): Promise<Suggestion | null> {
  try {
    const result = await model.generateContent(
      buildPrompt(mode, task, existingTitles),
    )
    const parsed = JSON.parse(result.response.text()) as Suggestion

    if (!parsed.title) return null

    return parsed
  } catch (error) {
    console.error("タスクの提案に失敗しました", error)
    return null
  }
}

/**
 * 「何日後か」を Task.date の形式（YYYY-MM-DD）に変換する。
 *
 * toISOString() は UTC に変換してしまい、日本時間の朝 9 時より前だと
 * 前日の日付になるため、ローカルの日付から組み立てる。
 */
export function toDueDate(daysAhead: number): string {
  const days = Math.min(
    Math.max(Math.round(daysAhead), MIN_DAYS_AHEAD),
    MAX_DAYS_AHEAD,
  )

  const date = new Date()
  date.setDate(date.getDate() + days)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/** 提案を、そのまま addTask に渡せる形にする。 */
export function toNewTask(suggestion: Suggestion): Omit<Task, "id"> {
  return {
    title: suggestion.title,
    description: suggestion.description,
    date: toDueDate(suggestion.daysAhead),
    completed: false,
  }
}
