import React from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useRestaurantAvailability } from "@/hooks/useRestaurantAvailability";

interface RestaurantAvailabilityBannerProps {
  onAvailabilityChange?: (isOpen: boolean) => void;
}

export const RestaurantAvailabilityBanner: React.FC<
  RestaurantAvailabilityBannerProps
> = ({ onAvailabilityChange }) => {
  const {
    isOpen,
    closingTime,
    nextOpeningTime,
    loading: isLoading,
    error,
  } = useRestaurantAvailability();

  // Notify parent of availability changes
  React.useEffect(() => {
    if (onAvailabilityChange) {
      onAvailabilityChange(isOpen);
    }
  }, [isOpen, onAvailabilityChange]);

  // Add margin-top to push below the fixed navbar
  const bannerMargin = "mt-[56px] sm:mt-[64px]";

  // Helper to format local time output
  const formatTime = (date: Date | null) =>
    date
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : undefined;

  // Helper to format local date and time output (Day and time)
  const formatDateTime = (date: Date | null) =>
    date
      ? date.toLocaleString(undefined, {
          weekday: "short", // e.g., "Sat"
          month: "short", // e.g., "Aug"
          day: "numeric", // e.g., 23
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : undefined;
  if (isLoading) {
    return (
      <div
        className={`bg-blue-50 border-b border-blue-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 ${bannerMargin}`}
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-800 text-xs sm:text-sm">
            Checking restaurant availability...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border-b border-red-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 ${bannerMargin}`}
      >
        <div className="flex items-center justify-center">
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-800 text-xs sm:text-sm">
            Unable to check availability. Please try again later.
          </span>
        </div>
      </div>
    );
  }

  if (isOpen) {
    return (
      <div
        className={`bg-green-50 border-b border-green-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 ${bannerMargin}`}
      >
        <div className="flex items-center justify-center">
          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-2 flex-shrink-0" />
          <span className="text-green-800 text-xs sm:text-sm font-medium">
            Restaurant is open! 🍽️
            {closingTime && (
              <>
                {" "}
                Closes at <b>{formatTime(closingTime)}</b>
              </>
            )}
          </span>
        </div>
      </div>
    );
  }

  // Closed state
  return (
    <div
      className={`bg-orange-50 border-b border-orange-200 px-2 sm:px-3 md:px-4 py-2 sm:py-3 ${bannerMargin}`}
    >
      <div className="flex flex-col items-center justify-center text-center max-w-full">
        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mb-2 flex-shrink-0" />
        <div className="text-orange-800 text-xs sm:text-sm min-w-0">
          <p className="font-medium leading-tight break-words">
            The restaurant is currently closed.
          </p>
          {nextOpeningTime && (
            <p className="text-xs mt-1 leading-tight break-words">
              Next opening: <b>{formatDateTime(nextOpeningTime)}</b>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
