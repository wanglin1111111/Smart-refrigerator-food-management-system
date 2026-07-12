export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm">加载中...</p>
    </div>
  );
}
