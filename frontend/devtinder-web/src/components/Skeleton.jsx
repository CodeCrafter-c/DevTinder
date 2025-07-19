export default function Skeleton() {
  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm bg-base-300 mx-auto shadow-md rounded-xl overflow-hidden animate-pulse mt-10">
      {/* Image Placeholder */}
      <div className="p-4 flex justify-center">
        <div className="w-full h-72 bg-base-100 rounded-lg" />
      </div>

      {/* Text Placeholder */}
      <div className="px-4 pb-4">
        <div className="h-4 bg-base-100 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-base-100 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-base-100 rounded w-full mb-4"></div>

        {/* Button Placeholder */}
        <div className="flex justify-center gap-3">
          <div className="h-10 w-20 bg-base-100 rounded-md" />
          <div className="h-10 w-20 bg-base-100 rounded-md" />
        </div>
      </div>
    </div>
  );
}
