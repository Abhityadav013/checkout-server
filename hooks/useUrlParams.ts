"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface UpdateUrlParamsOptions {
  /**
   * Replace instead of push — default true, so history isn't polluted
   */
  replace?: boolean;
  /**
   * Preserve existing params when setting new ones — default true
   */
  preserve?: boolean;
  /**
   * Scroll page to top after update — default true
   */
  scroll?: boolean;
}

export function useUrlParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ready flag to indicate we’ve had our first client read of params
  const [isReady, setIsReady] = useState(false);

  // Capture an initial snapshot to stabilize first render usage
  const initialSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    // Mark ready after first client render where searchParams is available
    if (!isReady) setIsReady(true);
    if (initialSnapshotRef.current === null) {
      initialSnapshotRef.current = searchParams.toString();
    }
  }, [searchParams, isReady]);

  // Convenience getter that won’t throw if used before ready
  const getParam = (key: string): string | null => {
    if (!searchParams) return null;
    return searchParams.get(key);
  };

  // Get all current params as a plain object
  const getAllParams = useMemo(() => {
    const out: Record<string, string> = {};
    if (searchParams) {
      for (const [k, v] of searchParams.entries()) out[k] = v;
    }
    return out;
  }, [searchParams]);

  // A stable snapshot of the very first params (optional helper)
  const safeGetInitial = useCallback((): URLSearchParams => {
    return new URLSearchParams(initialSnapshotRef.current ?? "");
  }, []);

  /**
   * Update one or multiple query params
   */
  const updateParams = (
    params: Record<string, string | number | null | undefined>,
    options: UpdateUrlParamsOptions = {}
  ) => {
    const { replace = true, preserve = true, scroll = true } = options;

    const base = preserve ? searchParams.toString() : "";
    const current = new URLSearchParams(base);

    // Apply changes
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    const query = current.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;

    if (replace) {
      router.replace(newUrl, { scroll });
    } else {
      router.push(newUrl, { scroll });
    }
  };

  /**
   * Remove one or more params
   */
  const removeParams = (
    keys: string[],
    options: Omit<UpdateUrlParamsOptions, "preserve"> = {}
  ) => {
    const { replace = true, scroll = true } = options;
    const current = new URLSearchParams(searchParams.toString());

    keys.forEach((key) => current.delete(key));

    const query = current.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;

    if (replace) {
      router.replace(newUrl, { scroll });
    } else {
      router.push(newUrl, { scroll });
    }
  };

  return {
    // writers
    updateParams,
    removeParams,
    // readers
    getParams: searchParams,
    getParam,
    getAllParams,
    // readiness and snapshots
    isReady,          // true after first client-side param read
    safeGetInitial,   // snapshot of first-seen params (optional usage)
  };
}
