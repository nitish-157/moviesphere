function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-40 sm:w-48 animate-pulse">
      <div className="rounded-lg bg-cine-surface aspect-[2/3]" />
      <div className="mt-2 h-3.5 w-3/4 rounded bg-cine-surface" />
      <div className="mt-1.5 h-3 w-1/4 rounded bg-cine-surface" />
    </div>
  );
}

export default SkeletonCard;
