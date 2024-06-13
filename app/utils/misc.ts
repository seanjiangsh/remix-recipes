import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocation, useMatches } from "@remix-run/react";

import { settingsCookie } from "~/utils/auth/cookies";

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

export const getSettingsFromCookie = async (request: Request) => {
  const cookies = request.headers.get("cookie");
  const defaultSettings = { color: "green", theme: "light" };
  try {
    const settingsValue = await settingsCookie.parse(cookies);
    if (!settingsValue) return defaultSettings;
    const { color, theme } = JSON.parse(settingsValue);
    const colorValue = typeof color === "string" ? color : "green";
    const themeValue = typeof theme === "string" ? theme : "light";
    return { color: colorValue, theme: themeValue };
  } catch (err: any) {
    console.error(`Error parsing settings cookie: ${err.message}`);
    return defaultSettings;
  }
};
