export interface TaskGeneratedNoticeProps {
  visible: boolean;
  onDismiss?: () => void;
}

export function TaskGeneratedNotice({ visible, onDismiss }: TaskGeneratedNoticeProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-start gap-3 border-2 border-[#e6c56d] bg-[#fdf4de] px-4 py-4 text-left shadow-[0_6px_16px_rgba(45,93,126,0.1)] sm:items-center sm:px-5"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#d79f00] bg-[#ffd323] text-lg font-black text-[#7f5d00]"
      >
        ✓
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] font-black tracking-[0.18em] text-[#b3820b]">
          TICKET ISSUED
        </p>
        <p className="mt-1 font-bold leading-relaxed text-[#6d5411]">
          新しい夏の切符が生成されました！
        </p>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="通知を閉じる"
          className="shrink-0 border border-[#d9b54f] bg-white/70 px-2 py-1 text-lg leading-none text-[#9a7715] transition hover:border-[#b3820b] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#579bd9]"
        >
          ×
        </button>
      )}
    </div>
  );
}
