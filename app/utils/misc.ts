import { useEffect, useLayoutEffect, useMemo } from "react";
import { useMatches } from "@remix-run/react";

export const useMatchesData = <T>(id: string) => {
  const matches = useMatches();
  const route = useMemo(() => matches.find((m) => m.id === id), [id, matches]);
  return route?.data as T;
};

export const isRunningOnServer = () => typeof window === "undefined";

export const useServerLayoutEffect = isRunningOnServer()
  ? useEffect
  : useLayoutEffect;
