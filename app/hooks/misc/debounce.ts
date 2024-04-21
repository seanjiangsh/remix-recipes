import { useRef } from "react";

export const useDebounce = <T extends Array<any>>(
  fn: (...args: T) => unknown,
  delay: number
) => {
  const timeoutRef = useRef<number | null>(null);

  return (...args: T) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => fn(...args), delay);
  };
};
