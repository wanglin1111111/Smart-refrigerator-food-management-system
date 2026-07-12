type EmptyProps = {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function Empty({ message = '暂无数据', actionLabel, onAction }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
      <p className="text-sm">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
