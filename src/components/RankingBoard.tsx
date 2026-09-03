import { useEffect, useState } from "react";
import { getUserRanking, maskUserId, type RankingEntry, type RankingResult } from "../lib/ranking";

interface RankingBoardProps {
  userId: string | null;
  refreshKey: number;
}

export function RankingBoard({ userId, refreshKey }: RankingBoardProps) {
  const [ranking, setRanking] = useState<RankingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRanking(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    void getUserRanking(userId)
      .then((nextRanking) => {
        if (!cancelled) setRanking(nextRanking);
      })
      .catch((loadError) => {
        console.error("ランキングの読み込みに失敗しました", loadError);
        if (!cancelled) setError("ランキングを読み込めませんでした。");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, refreshKey]);

  if (!userId) return null;

  return (
    <section
      aria-labelledby="ranking-heading"
      className="mt-10 border-2 border-sky-200 bg-[#fffefa] p-4 shadow-[0_8px_22px_rgba(45,93,126,0.14)] sm:p-7"
    >
      <div className="mb-5 border-b-2 border-dashed border-sky-200 pb-5">
        <p className="font-black tracking-[0.2em] text-[#e59a35]" style={{ fontSize: "13px" }}>
          SUMMER RANKING
        </p>

        <div
          className="mt-2 flex min-h-12 items-center justify-center bg-[#579bd9] px-8"
          style={{
            clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
          }}
        >
          <h2
            id="ranking-heading"
            className="m-0 text-center text-xl font-black text-white sm:text-2xl"
          >
            夏の達成ランキング
          </h2>
        </div>

        <p className="mt-3 text-sm text-slate-600">完了した夏の切符をポイントで競います。</p>
      </div>

      {isLoading ? (
        <p
          role="status"
          className="border-2 border-dashed border-sky-300 p-6 text-center text-[#3986c7]"
        >
          ランキングを読み込んでいます…
        </p>
      ) : error ? (
        <p
          role="alert"
          className="border-2 border-dashed border-red-300 p-6 text-center text-red-700"
        >
          {error}
        </p>
      ) : ranking ? (
        <RankingRows ranking={ranking} />
      ) : null}
    </section>
  );
}

function RankingRows({ ranking }: { ranking: RankingResult }) {
  const currentUserIsListed = ranking.currentUser
    ? ranking.entries.some((entry) => entry.id === ranking.currentUser?.id)
    : false;

  return (
    <>
      {ranking.entries.length === 0 ? (
        <p className="border-2 border-dashed border-sky-300 bg-[#fffdf8] p-6 text-center text-[#3986c7]">
          まだランキングはありません。
        </p>
      ) : (
        <ol aria-label="上位10名のランキング" className="m-0 space-y-2 p-0">
          {ranking.entries.map((entry) => (
            <RankingRow key={entry.id} entry={entry} />
          ))}
        </ol>
      )}

      {ranking.currentUser && !currentUserIsListed && (
        <ol aria-label="あなたの現在地" className="m-0 mt-4 list-none p-0">
          <RankingRow entry={ranking.currentUser} isOutsideTopTen />
        </ol>
      )}
    </>
  );
}

function RankingRow({
  entry,
  isOutsideTopTen = false,
}: {
  entry: RankingEntry;
  isOutsideTopTen?: boolean;
}) {
  return (
    <li
      aria-current={entry.isCurrentUser ? "true" : undefined}
      className={`relative flex min-w-0 items-center gap-3 border-2 px-3 py-3 sm:gap-4 sm:px-4 ${
        entry.isCurrentUser
          ? "border-[#e6c56d] bg-[#fdf4de] shadow-[3px_3px_0_#e6c56d]"
          : "border-sky-100 bg-[#fffefa]"
      }`}
    >
      <span
        className="w-8 shrink-0 text-center font-mono text-lg font-black text-[#347fbd]"
        aria-label={entry.rank ? `${entry.rank}位` : "トップ10圏外"}
      >
        {entry.rank ?? "—"}
      </span>

      <span className="min-w-0 flex-1 truncate font-bold text-slate-700">
        {entry.isCurrentUser ? "あなた" : `参加者 ${maskUserId(entry.id)}`}
        {isOutsideTopTen && <span className="ml-2 text-xs font-normal text-[#b3820b]">現在地</span>}
      </span>

      <span className="shrink-0 rounded-full border border-[#e6c56d] bg-[#fdf4de] px-2 py-1 font-mono text-xs font-black text-[#b3820b] sm:px-3">
        {entry.score} pt
      </span>
    </li>
  );
}
