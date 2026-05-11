export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-96">
      <div className="loading-spinner"></div>
      <p className="mt-4 text-gray-500 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
}