import { useEffect, useRef } from "react";

/**
 * Watches a sentinel element and fires `onIntersect` when it enters the
 * viewport (or a given scroll container). Used to trigger "load more"
 * calls for infinite scrolling instead of a manual "Load More" button.
 *
 * @param {Function} onIntersect - called when the sentinel becomes visible
 * @param {boolean} enabled - set to false to pause observing (e.g. while already loading, or no more pages)
 * @param {React.RefObject} rootRef - optional scroll container ref; omit to observe against the browser viewport
 */
function useInfiniteScroll(onIntersect, enabled = true, rootRef = null) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        root: rootRef?.current || null,
        rootMargin: "300px", // start loading a bit before the sentinel is fully visible
        threshold: 0,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [enabled, onIntersect, rootRef]);

  return sentinelRef;
}

export default useInfiniteScroll;
