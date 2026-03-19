export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary to-background-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-highlight-cta border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary text-lg animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
