import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocation, useMatches } from "@remix-run/react";

export const useMatchesData = <T>(id: string) => {
  const matches = useMatches();
  const route = useMemo(() => matches.find((m) => m.id === id), [id, matches]);
  return route?.data as T;
};

export const isRunningOnServer = () => typeof window === "undefined";

export const createItemId = () => `${Math.round(Math.random() * 1_000_000)}`;

export const useServerLayoutEffect = isRunningOnServer()
  ? useEffect
  : useLayoutEffect;

let hasHydrated = false;
export const useIsHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(hasHydrated);
  useEffect(() => {
    hasHydrated = true;
    setIsHydrated(true);
  }, []);
  return isHydrated;
};

export const useBuildSearchParams = () => {
  const location = useLocation();
  return (name: string, value: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(name, value);
    return `?${searchParams.toString()}`;
  };
};
