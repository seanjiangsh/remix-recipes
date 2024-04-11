import { useState, useEffect, useRef } from "react";

export const useDelayedBool = (value: boolean | undefined, delay: number) => {
  const [delayed, setDelayed] = useState(false);
  const timeoutId = useRef<number>();
  useEffect(() => {
    if (value) {
      timeoutId.current = window.setTimeout(() => {
        setDelayed(true);
      }, delay);
    } else {
      window.clearTimeout(timeoutId.current);
      setDelayed(false);
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [value, delay]);

  return delayed;
};
