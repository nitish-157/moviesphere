import { useEffect, useState } from "react";

function useDebounce(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer); // reset the timer if value changes before delay elapses
  }, [value, delayMs]);

  return debouncedValue;
}

export default useDebounce;
