// SkeletonCard.jsx
export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex gap-4 items-center w-full">
        {/* Circle avatar */}
        <div className="w-14 h-14 bg-gray-300 rounded-full"></div>

        {/* Name and about */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

    </div>
  );
}
