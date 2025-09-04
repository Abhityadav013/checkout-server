/* eslint-disable @typescript-eslint/no-explicit-any */
// useRestaurantAvailability.ts

import { base_url } from "@/lib/apiEndPoint";
import { useState, useEffect, useRef } from "react";

interface APIResponse {
  statusCode: number;
  data: {
    restaurantId: string;
    currentDay: string;
    isOpenNow: boolean;
    closingTime: string | null; // ISO format or null
    nextOpeningTime: string | null; // ISO format or null
  };
  message: string;
  success: boolean;
}

interface UseRestaurantAvailabilityResult {
  isOpen: boolean;
  closingTime: Date | null;
  nextOpeningTime: Date | null;
  loading: boolean;
  error: any;
}

export function useRestaurantAvailability(): UseRestaurantAvailabilityResult {
  const [isOpen, setIsOpen] = useState(false);
  const [closingTime, setClosingTime] = useState<Date | null>(null);
  const [nextOpeningTime, setNextOpeningTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: Fetch availability
  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${base_url}/info`, {
        headers: {
          "x-device-id": "abc123",
          "x-tid": "xyz789",
        },
      });
      const json: APIResponse = await res.json();

      if (!json.success) throw new Error(json.message);

      setIsOpen(json.data.isOpenNow);

      const closing = json.data.closingTime
        ? new Date(json.data.closingTime)
        : null;
      setClosingTime(closing);

      const opening = json.data.nextOpeningTime
        ? new Date(json.data.nextOpeningTime)
        : null;
      setNextOpeningTime(opening);

      setLoading(false);

      // Schedule next fetch logic
      let nextUpdate: number | null = null;
      if (json.data.isOpenNow && closing) {
        // 5 minutes before closing
        nextUpdate = closing.getTime() - 5 * 60 * 1000 - Date.now();
      } else if (!json.data.isOpenNow && opening) {
        // At next opening time
        nextUpdate = opening.getTime() - Date.now();
      }

      if (nextUpdate !== null && nextUpdate > 0) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(fetchAvailability, nextUpdate);
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    // Clean up timer on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only re-run if restaurantId or apiUrl changes

  return { isOpen, closingTime, nextOpeningTime, loading, error };
}
