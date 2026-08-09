function MovieDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[45vh] sm:h-[55vh] bg-cine-surface" />
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-40 sm:w-56 h-60 sm:h-80 rounded-lg bg-cine-surface2 flex-shrink-0" />
          <div className="flex-1 pt-4 sm:pt-24 space-y-3">
            <div className="h-8 w-2/3 rounded bg-cine-surface2" />
            <div className="h-4 w-1/3 rounded bg-cine-surface2" />
            <div className="h-4 w-full rounded bg-cine-surface2" />
            <div className="h-4 w-full rounded bg-cine-surface2" />
            <div className="h-4 w-3/4 rounded bg-cine-surface2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsSkeleton;
