type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorMessage({ message = '加载失败，请稍后重试', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-danger">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-danger px-4 py-2 text-sm font-medium text-danger"
        >
          重试
        </button>
      )}
    </div>
  );
}
